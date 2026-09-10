#!/usr/bin/env node
/**
 * Round-trip guard for the deck text editor.
 *
 * Rewriting every extracted string with its own value must reproduce the file
 * byte for byte. If it does not, the extractor's ranges or the literal encoding
 * are wrong — and a real edit would corrupt the deck.
 */
import { readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  collectTsxStrings,
  collectYamlStrings,
  deckPaths,
  patchTsxSource,
  patchYamlSource,
  removeRanges,
  removeTsxItems,
  removeYamlItems,
  resolveRange,
  resolveSnippet,
  tsxSyntaxErrors
} from './deck-text-core.mjs'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const slugs = readdirSync(path.join(repoRoot, 'content', 'decks'), { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort()

// Deleting a string means cutting the construct around it out of the source,
// which every build has to prove is still safe. Re-parsing after each deletion
// costs about 12ms, so a build samples across the file and `--deep` does the
// lot (a few decks' worth of copy is thousands of deletions).
const deep = process.argv.includes('--deep')
const DELETION_SAMPLE = 8

const failures = []
let stringCount = 0
let deletionCount = 0

/** Spread a fixed number of picks across the file, not the first few strings. */
function spread(items, limit) {
  if (items.length <= limit) return items
  const step = items.length / limit
  return Array.from({ length: limit }, (unused, index) => items[Math.floor(index * step)])
}

function sample(items, limit) {
  return deep ? items : spread(items, limit)
}

// Quote characters are what the literal encoder can get wrong; appending them
// stresses escaping without changing whether a string counts as copy.
const MARKER = `'"`

// Deleting every occurrence at once means several spans in one write, and a
// pair where one sits inside the other would splice out a broken file. Proven
// here rather than trusted, because no deck happens to contain the shape.
const overlapping = [
  { start: 10, end: 40 },
  { start: 15, end: 20 }
]
try {
  removeRanges('x'.repeat(60), overlapping)
  failures.push('removeRanges: 入れ子の範囲を削除できてしまいました')
} catch {
  // expected
}
if (removeRanges('abcdef', [{ start: 0, end: 2 }, { start: 4, end: 6 }]) !== 'cd') {
  failures.push('removeRanges: 重ならない範囲の削除結果が違います')
}

for (const slug of slugs) {
  const paths = deckPaths(repoRoot, slug)

  const tsxSource = readFileSync(paths.tsx, 'utf8')
  const tsxItems = collectTsxStrings(paths.tsx, tsxSource)
  stringCount += tsxItems.length

  if (patchTsxSource(tsxSource, tsxItems) !== tsxSource) {
    failures.push(`${slug}/slides.tsx: a no-op rewrite changed the source`)
  }

  const rewritten = patchTsxSource(
    tsxSource,
    tsxItems.map((item) => ({ ...item, text: item.text + MARKER }))
  )
  const reparsed = collectTsxStrings(paths.tsx, rewritten)

  if (reparsed.length !== tsxItems.length) {
    failures.push(
      `${slug}/slides.tsx: string count changed after rewrite (${tsxItems.length} -> ${reparsed.length})`
    )
  } else {
    const broken = reparsed.findIndex((item, index) => item.text !== tsxItems[index].text + MARKER)
    if (broken >= 0) {
      failures.push(
        `${slug}/slides.tsx: copy near L${tsxItems[broken].line} was corrupted by the rewrite (${reparsed[broken].text.slice(0, 40)})`
      )
    }
  }

  // Characters that carry meaning in JSX must survive as plain copy. The node
  // structure legitimately changes here, so only require that it still parses.
  const hostile = patchTsxSource(
    tsxSource,
    tsxItems.map((item) => ({ ...item, text: `${item.text} <b>{x}</b> "q" 'q'` }))
  )
  const syntaxErrors = tsxSyntaxErrors(paths.tsx, hostile)
  if (syntaxErrors.length) {
    failures.push(`${slug}/slides.tsx: rewriting copy containing JSX syntax broke the file (${syntaxErrors[0]})`)
  }

  // The production editor works from ranges published at build time and
  // re-verified with resolveRange; every extracted item must survive that.
  for (const item of tsxItems) {
    const range = resolveRange(tsxSource, item)
    if (!range || range.start !== item.start || range.end !== item.end) {
      failures.push(`${slug}/slides.tsx: L${item.line} の範囲が索引から復元できません`)
      break
    }
  }

  // Production deletes work from the span published in the index and re-find it
  // with resolveSnippet, so every span has to resolve to itself in the file it
  // was extracted from.
  for (const item of tsxItems) {
    if (!item.remove) continue
    const span = resolveSnippet(tsxSource, item.remove)
    if (!span || span.start !== item.remove.start || span.end !== item.remove.end) {
      failures.push(`${slug}/slides.tsx: L${item.line} の削除範囲が索引から復元できません`)
      break
    }
  }

  // Deleting every occurrence of a repeated string is one write with several
  // spans, which is where an overlap would corrupt the file.
  const batch = spread(tsxItems.filter((item) => item.remove), 2)
  if (batch.length === 2) {
    deletionCount += 2
    const cut = removeTsxItems(tsxSource, batch)
    const errors = tsxSyntaxErrors(paths.tsx, cut)
    if (errors.length) {
      failures.push(`${slug}/slides.tsx: 2件まとめて削除するとファイルが壊れます (${errors[0]})`)
    }
  }

  // Deletion: the file has to stay parseable, actually shrink, and lose exactly
  // the copy that was asked for.
  for (const item of sample(tsxItems.filter((item) => item.remove), DELETION_SAMPLE)) {
    deletionCount += 1
    const cut = removeTsxItems(tsxSource, [item])
    const errors = tsxSyntaxErrors(paths.tsx, cut)

    if (errors.length) {
      failures.push(`${slug}/slides.tsx: L${item.line} を削除するとファイルが壊れます (${errors[0]})`)
      break
    }
    if (cut.length >= tsxSource.length) {
      failures.push(`${slug}/slides.tsx: L${item.line} の削除でファイルが小さくなりません`)
      break
    }
    if (collectTsxStrings(paths.tsx, cut).length >= tsxItems.length) {
      failures.push(`${slug}/slides.tsx: L${item.line} を削除しても文字列が減りません`)
      break
    }

    // Nothing outside the element itself may be lost: a span that reaches into
    // a neighbour would take copy the human never asked to delete. Copy inside
    // the element is meant to go with it (an alt text, a nested label).
    const collateral = tsxItems.find(
      (other) =>
        other.end > item.remove.start &&
        other.start < item.remove.end &&
        !(other.start >= item.remove.core.start && other.end <= item.remove.core.end)
    )
    if (collateral) {
      failures.push(
        `${slug}/slides.tsx: L${item.line} の削除が L${collateral.line} の文言にはみ出しています`
      )
      break
    }
  }

  const yamlSource = readFileSync(paths.yaml, 'utf8')
  const yamlItems = collectYamlStrings(paths.yaml, yamlSource)
  stringCount += yamlItems.length

  if (!yamlItems.length) {
    failures.push(`${slug}/deck.yaml: no editable copy found`)
  }
  if (patchYamlSource(yamlSource, yamlItems) !== yamlSource) {
    failures.push(`${slug}/deck.yaml: a no-op rewrite changed the source`)
  }

  const rewrittenYaml = patchYamlSource(
    yamlSource,
    yamlItems.map((item) => ({ ...item, text: item.text + MARKER }))
  )
  const reparsedYaml = collectYamlStrings(paths.yaml, rewrittenYaml)
  const brokenYaml = reparsedYaml.findIndex((item, index) => item.text !== yamlItems[index].text + MARKER)
  if (reparsedYaml.length !== yamlItems.length || brokenYaml >= 0) {
    failures.push(`${slug}/deck.yaml: copy was corrupted by the rewrite`)
  }

  // Only the optional keys may be dropped; title and summary are what the deck
  // schema insists on, and the editor must never be able to remove them.
  for (const item of sample(yamlItems.filter((entry) => entry.remove), DELETION_SAMPLE)) {
    deletionCount += 1
    const cut = removeYamlItems(yamlSource, [item])
    const left = collectYamlStrings(paths.yaml, cut)
    if (left.length !== yamlItems.length - 1) {
      failures.push(`${slug}/deck.yaml: ${item.component} の削除で消えた項目が1件ではありません`)
      break
    }
  }

  const required = yamlItems.filter((item) => !item.remove).map((item) => item.component)
  const missing = ['deck.title', 'deck.summary'].filter((name) => !required.includes(name))
  if (missing.length) {
    failures.push(`${slug}/deck.yaml: ${missing.join(', ')} が必須項目として保護されていません`)
  }
}

if (failures.length) {
  console.error('Deck text round-trip failed:')
  for (const failure of failures) console.error(`  - ${failure}`)
  process.exit(1)
}

console.log(
  `Deck text round-trip passed (${slugs.length} decks, ${stringCount} strings, ${deletionCount} deletions${deep ? '' : ' sampled'}).`
)
