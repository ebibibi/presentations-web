#!/usr/bin/env node
/**
 * Guards the two ways slide copy can become unreachable from the browser.
 *
 * 1. A string the extractor refuses to see cannot be clicked again. The copy
 *    editor happily saves a one-character rewrite, so one character has to stay
 *    editable — otherwise the only way to undo it is a text editor on the host.
 *    (A lone 。 is the other half of that rule: it is the tail of copy split by
 *    an inline tag, it repeats all over a slide, and it must not be listed.)
 * 2. When resolving fails anyway, the whole file is the escape hatch — so the
 *    whole-file save has to refuse anything that would not parse, and refuse a
 *    write from a tab that was looking at an older version of the file.
 */
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { collectTsxStrings, fileHash } from './deck-text-core.mjs'
import { readDeckSources, sourceErrors, writeDeckSource } from './deck-source.mjs'

const failures = []

function check(name, condition, detail = '') {
  if (!condition) failures.push(`${name}${detail ? `: ${detail}` : ''}`)
}

const SLIDES = `import { useVideoConfig } from 'remotion'

function Sample() {
  return (
    <section className="remotion-slide">
      <p>
        答えを<strong>あ</strong>にして持ち帰っていただきます
      </p>
      <p className="note">
        <strong>手順書</strong>
        。
      </p>
    </section>
  )
}

export default Sample
`

const YAML_SOURCE = `title: サンプル
summary: ソース編集の確認用
slides:
  - id: sample
    title: サンプル
`

const strings = collectTsxStrings('slides.tsx', SLIDES).map((item) => item.text)

check('a lone Japanese character is editable', strings.includes('あ'), strings.join(' | '))
check('a lone punctuation mark is not listed', !strings.includes('。'), strings.join(' | '))
check('ordinary copy still extracted', strings.includes('手順書'), strings.join(' | '))

// --- whole-file escape hatch -------------------------------------------------

const repoRoot = mkdtempSync(path.join(tmpdir(), 'deck-source-'))
const deckDir = path.join(repoRoot, 'content', 'decks', 'sample')
mkdirSync(deckDir, { recursive: true })
writeFileSync(path.join(deckDir, 'slides.tsx'), SLIDES, 'utf8')
writeFileSync(path.join(deckDir, 'deck.yaml'), YAML_SOURCE, 'utf8')

const files = readDeckSources(repoRoot, 'sample')
check('both deck files are offered', files.map((file) => file.name).join(',') === 'slides.tsx,deck.yaml')
check('each file carries its hash', files.every((file) => file.hash === fileHash(file.text)))

check('broken tsx is rejected', sourceErrors('slides.tsx', '<p>unclosed').length > 0)
check('broken yaml is rejected', sourceErrors('deck.yaml', 'title: [oops').length > 0)
check('an empty file is rejected', sourceErrors('slides.tsx', '   ').length > 0)
check('valid tsx passes', sourceErrors('slides.tsx', SLIDES).length === 0)

const [tsxFile] = files
const fixed = SLIDES.replace('答えを<strong>あ</strong>にして', '答えを<strong>手順書</strong>にして')
const saved = writeDeckSource(repoRoot, 'sample', 'slides.tsx', fixed, tsxFile.hash)
check('a valid save lands on disk', readFileSync(path.join(deckDir, 'slides.tsx'), 'utf8') === fixed)
check('the save reports the new hash', saved.hash === fileHash(fixed))

let rejected = null
try {
  writeDeckSource(repoRoot, 'sample', 'slides.tsx', SLIDES, tsxFile.hash)
} catch (error) {
  rejected = error
}
check('a stale tab cannot overwrite a newer file', rejected !== null)
check('the newer file survived the conflict', readFileSync(path.join(deckDir, 'slides.tsx'), 'utf8') === fixed)

let brokenRejected = null
try {
  writeDeckSource(repoRoot, 'sample', 'slides.tsx', 'export default function () { return (<p>', fileHash(fixed))
} catch (error) {
  brokenRejected = error
}
check('a save that would not parse is refused', brokenRejected !== null)
check('the file survived the refused save', readFileSync(path.join(deckDir, 'slides.tsx'), 'utf8') === fixed)

let unknownRejected = null
try {
  writeDeckSource(repoRoot, 'sample', 'package.json', '{}', null)
} catch (error) {
  unknownRejected = error
}
check('only deck files can be written', unknownRejected !== null)

if (failures.length) {
  console.error('Deck source guard failed:')
  for (const failure of failures) console.error(`  - ${failure}`)
  process.exit(1)
}

console.log('Deck source guard passed (single-character copy stays editable, whole-file saves validated).')
