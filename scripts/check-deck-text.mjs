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
  collectSlideStructure,
  collectTsxSlideIds,
  collectTsxStrings,
  duplicateTsxItems,
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

import {
  deleteSlideFromTsx,
  deleteSlideFromYaml,
  duplicateSlideInTsx,
  duplicateSlideInYaml,
  findComponentSpan,
  moveSlideInYaml,
  nextSlideId,
  slideIdsInYaml
} from '../shared/deck-slides.mjs'

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
const DUPLICATION_SAMPLE = 8
const SLIDE_OP_SAMPLE = 4

const failures = []
let stringCount = 0
let deletionCount = 0
let duplicationCount = 0
let slideOpCount = 0

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

  // Slide-level edits (duplicate / delete / reorder) work from the deck index,
  // which carries a component's name but not its body: production finds the
  // function textually. That rule has to agree with the compiler exactly, or a
  // deletion would cut the wrong lines out of a file nobody is watching.
  const yamlText = readFileSync(paths.yaml, 'utf8')
  const structure = collectSlideStructure(paths.tsx, tsxSource)

  if (structure) {
    for (const slide of structure) {
      if (!slide.component) continue
      const span = findComponentSpan(tsxSource, slide.component.name)
      if (!span || span.start !== slide.component.start || span.end !== slide.component.end) {
        failures.push(
          `${slug}/slides.tsx: ${slide.component.name} の範囲を本文から特定できません（コンパイラの範囲と不一致）`
        )
        break
      }
    }

    const yamlIds = slideIdsInYaml(yamlText)

    for (const slide of sample(structure, SLIDE_OP_SAMPLE)) {
      slideOpCount += 1

      // Every operation has to leave the two files agreeing on the same ids,
      // because that pairing is what assembles the deck.
      const pairs = []

      if (slide.component) {
        const newId = nextSlideId(yamlIds, slide.id)
        pairs.push({
          what: '複製',
          tsx: duplicateSlideInTsx(tsxSource, slide, newId, `Check${slideOpCount}Slide`),
          yaml: duplicateSlideInYaml(yamlText, slide.id, newId)
        })
      }

      pairs.push({
        what: '削除',
        tsx: deleteSlideFromTsx(tsxSource, slide),
        yaml: deleteSlideFromYaml(yamlText, slide.id)
      })

      const index = yamlIds.indexOf(slide.id)
      const offset = index === 0 ? 1 : -1
      pairs.push({ what: '移動', tsx: tsxSource, yaml: moveSlideInYaml(yamlText, slide.id, offset) })

      for (const pair of pairs) {
        const errors = tsxSyntaxErrors(paths.tsx, pair.tsx)
        if (errors.length) {
          failures.push(`${slug}: ${slide.id} の${pair.what}で slides.tsx が壊れます (${errors[0]})`)
          break
        }

        const registered = [...collectTsxSlideIds(paths.tsx, pair.tsx).ids].sort()
        const listed = [...slideIdsInYaml(pair.yaml)].sort()
        if (JSON.stringify(registered) !== JSON.stringify(listed)) {
          failures.push(
            `${slug}: ${slide.id} の${pair.what}で id が食い違います (tsx ${registered.length} / yaml ${listed.length})`
          )
          break
        }
      }
    }

    // Reordering must not lose or invent a slide, only change the order.
    if (yamlIds.length > 1) {
      const moved = slideIdsInYaml(moveSlideInYaml(yamlText, yamlIds[0], 1))
      if (moved[0] !== yamlIds[1] || moved[1] !== yamlIds[0] || moved.length !== yamlIds.length) {
        failures.push(`${slug}/deck.yaml: 先頭スライドの移動が入れ替えになっていません`)
      }
    }
  }

  // Duplication: the file has to stay parseable, grow, and gain exactly one
  // more copy of the string that was clicked. A span that stopped short of a
  // closing tag would still parse in some shapes, so the count is checked too.
  for (const item of sample(tsxItems.filter((entry) => entry.duplicate), DUPLICATION_SAMPLE)) {
    duplicationCount += 1
    const grown = duplicateTsxItems(tsxSource, [item])
    const errors = tsxSyntaxErrors(paths.tsx, grown)

    if (errors.length) {
      failures.push(`${slug}/slides.tsx: L${item.line} を複製するとファイルが壊れます (${errors[0]})`)
      break
    }
    if (grown.length <= tsxSource.length) {
      failures.push(`${slug}/slides.tsx: L${item.line} を複製してもファイルが大きくなりません`)
      break
    }

    // An entry can hold the clicked string more than once (a card whose title
    // repeats in its body), so the file gains one copy of everything inside the
    // entry - not one string.
    const inside = tsxItems.filter(
      (entry) => entry.start >= item.duplicate.start && entry.end <= item.duplicate.end
    ).length
    const after = collectTsxStrings(paths.tsx, grown).length
    if (after !== tsxItems.length + inside) {
      failures.push(
        `${slug}/slides.tsx: L${item.line} の複製で増えた項目数が違います (${tsxItems.length} + ${inside} -> ${after})`
      )
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
  `Deck text round-trip passed (${slugs.length} decks, ${stringCount} strings, ${deletionCount} deletions, ${duplicationCount} duplications, ${slideOpCount} slide edits${deep ? '' : ' sampled'}).`
)
