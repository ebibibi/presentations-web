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
import {
  collectSlideStructure,
  collectTsxStrings,
  collectYamlStrings,
  deckPaths,
  fileHash
} from './deck-text-core.mjs'
import { slideIdsInYaml } from '../shared/deck-slides.mjs'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const outputDir = path.join(repoRoot, 'public', 'deck-text')

const slugs = readdirSync(path.join(repoRoot, 'content', 'decks'), { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort()

rmSync(outputDir, { recursive: true, force: true })
mkdirSync(outputDir, { recursive: true })

/** `core` only exists for the round-trip guard, so it stays out of the index. */
function publishedRemoval(removal) {
  if (!removal) return null
  const { core, ...published } = removal
  return published
}

/**
 * The duplication anchor, or `1` when the removal span already carries it byte
 * for byte — true for every JSX element, which is most of them. Repeating the
 * snippet for every string would roughly double the index the browser
 * downloads. The shorthand only applies when nothing else has to travel with
 * it, so an entry that needs a comma separator is always published in full.
 */
function publishedDuplication(duplication, removal) {
  if (!duplication) return null
  const { core, ...published } = duplication
  const sameSpan = removal && published.start === removal.start && published.end === removal.end
  if (sameSpan && !published.separator) return 1
  return published
}

/**
 * Drops the compiler-only offsets - the name is what production works from -
 * and puts the slides in running order. That order is deck.yaml's, not the
 * order the components are registered in: reordering rewrites deck.yaml alone,
 * so a list built from slides.tsx would drift from the deck the moment
 * something moves.
 */
function publishedSlides(slides, yamlIds) {
  if (!slides) return null
  const byId = new Map(slides.map((slide) => [slide.id, slide]))
  return yamlIds
    .filter((id) => byId.has(id))
    .map((id) => {
      const slide = byId.get(id)
      return {
        id,
        entry: slide.entry,
        component: slide.component ? { name: slide.component.name } : null
      }
    })
}

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
      component: item.component,
      // What "delete this" would take out, resolved here because the Function
      // has no compiler to work it out for itself.
      remove: publishedRemoval(item.remove),
      duplicate: publishedDuplication(item.duplicate, item.remove)
    })),
    ...collectYamlStrings(paths.yaml, yamlSource).map((item, index) => ({
      id: `y${index}`,
      file: yamlFile,
      kind: 'yaml',
      yamlPath: item.yamlPath,
      text: item.text,
      component: item.component,
      remove: publishedRemoval(item.remove)
    }))
  ]

  total += items.length
  writeFileSync(
    path.join(outputDir, `${slug}.json`),
    JSON.stringify({
      slug,
      files: { [tsxFile]: fileHash(tsxSource), [yamlFile]: fileHash(yamlSource) },
      // Slide-level edits need the registration entry and the name of the
      // component behind it; the component's range is found from the source at
      // apply time. Null for a deck that generates its slides, which is what
      // the Function reports back instead of guessing.
      slides: publishedSlides(collectSlideStructure(paths.tsx, tsxSource), slideIdsInYaml(yamlSource)),
      items
    }),
    'utf8'
  )
}

console.log(`Deck text index written (${slugs.length} decks, ${total} strings).`)
