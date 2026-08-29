#!/usr/bin/env node
/**
 * Writes the copy index the production editor works from.
 *
 * Extracting copy needs the TypeScript compiler, which cannot ship to a
 * Cloudflare Function, so the extraction happens here at build time and the
 * result is published as a static asset: for each deck, every editable string
 * with the source range it occupies. A save in production sends a range back and
 * the Function verifies it before rewriting the file on GitHub.
 */
import { mkdirSync, readFileSync, readdirSync, writeFileSync, rmSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { collectTsxStrings, collectYamlStrings, deckPaths, fileHash } from './deck-text-core.mjs'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const outputDir = path.join(repoRoot, 'public', 'deck-text')

const slugs = readdirSync(path.join(repoRoot, 'content', 'decks'), { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort()

rmSync(outputDir, { recursive: true, force: true })
mkdirSync(outputDir, { recursive: true })

let total = 0

for (const slug of slugs) {
  const paths = deckPaths(repoRoot, slug)
  const tsxSource = readFileSync(paths.tsx, 'utf8')
  const yamlSource = readFileSync(paths.yaml, 'utf8')
  const tsxFile = path.relative(repoRoot, paths.tsx)
  const yamlFile = path.relative(repoRoot, paths.yaml)

  const items = [
    ...collectTsxStrings(paths.tsx, tsxSource).map((item, index) => ({
      id: `t${index}`,
      file: tsxFile,
      kind: item.kind,
      start: item.start,
      end: item.end,
      quote: item.quote,
      text: item.text,
      component: item.component
    })),
    ...collectYamlStrings(paths.yaml, yamlSource).map((item, index) => ({
      id: `y${index}`,
      file: yamlFile,
      kind: 'yaml',
      yamlPath: item.yamlPath,
      text: item.text,
      component: item.component
    }))
  ]

  total += items.length
  writeFileSync(
    path.join(outputDir, `${slug}.json`),
    JSON.stringify({
      slug,
      files: { [tsxFile]: fileHash(tsxSource), [yamlFile]: fileHash(yamlSource) },
      items
    }),
    'utf8'
  )
}

console.log(`Deck text index written (${slugs.length} decks, ${total} strings).`)
