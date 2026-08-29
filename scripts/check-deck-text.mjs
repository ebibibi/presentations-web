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
  tsxSyntaxErrors
} from './deck-text-core.mjs'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const slugs = readdirSync(path.join(repoRoot, 'content', 'decks'), { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort()

const failures = []
let stringCount = 0

// Quote characters are what the literal encoder can get wrong; appending them
// stresses escaping without changing whether a string counts as copy.
const MARKER = `'"`

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
}

if (failures.length) {
  console.error('Deck text round-trip failed:')
  for (const failure of failures) console.error(`  - ${failure}`)
  process.exit(1)
}

console.log(`Deck text round-trip passed (${slugs.length} decks, ${stringCount} strings).`)
