/**
 * Slide-level edits: duplicate, delete, reorder.
 *
 * Copy edits rewrite a string; these rewrite the deck's shape, which lives in
 * two files at once. deck.yaml owns the running order and the per-slide
 * metadata, and slides.tsx owns the registration entry and the component behind
 * it. Reordering therefore touches deck.yaml alone — the pairing is by id, not
 * by position — while duplicating and deleting have to keep both files in step.
 *
 * Nothing here needs a compiler: the spans come from the deck index built at
 * deploy time, so the same code runs on the dev server and in the Function that
 * commits to GitHub.
 */
import YAML from 'yaml'
import { resolveSnippet } from './deck-text-rewrite.mjs'

/**
 * The lines a block-sequence item occupies, including its `- ` and newline.
 *
 * The item's own end offset is not usable as the block end: a block scalar
 * (`notes: |-`) reports its end at the next token, which is already inside the
 * following item's line. The next item's first line - or the end of the whole
 * sequence for the last one - is the only reliable boundary.
 */
function itemBlock(source, seq, index) {
  const item = seq.items[index]
  const start = source.lastIndexOf('\n', item.range[0] - 1) + 1
  const next = seq.items[index + 1]
  const end = next ? source.lastIndexOf('\n', next.range[0] - 1) + 1 : seqEnd(source, seq)
  return { start, end }
}

/** Where the sequence stops: its last line, newline included when there is one. */
function seqEnd(source, seq) {
  const newline = source.indexOf('\n', seq.range[1] - 1)
  return newline === -1 ? source.length : Math.min(newline + 1, source.length)
}

function slidesSeq(source) {
  const doc = YAML.parseDocument(source)
  const seq = doc.get('slides', true)
  if (!seq?.items?.length) {
    throw new Error('deck.yaml に slides がありません')
  }
  return seq
}

function indexOfSlide(seq, id) {
  const index = seq.items.findIndex((item) => item.get?.('id') === id)
  if (index < 0) {
    throw new Error(`deck.yaml に "${id}" のスライドがありません`)
  }
  return index
}

/** An id that no slide in the deck uses yet: `conclusion` → `conclusion-2`. */
export function nextSlideId(existingIds, baseId) {
  const stem = baseId.replace(/-\d+$/, '')
  for (let suffix = 2; suffix < 1000; suffix += 1) {
    const candidate = `${stem}-${suffix}`
    if (!existingIds.includes(candidate)) return candidate
  }
  throw new Error(`"${baseId}" の複製に使える id が見つかりません`)
}

export function slideIdsInYaml(source) {
  return slidesSeq(source).items.map((item) => item.get?.('id') ?? null)
}

/** Moves a slide one place earlier (-1) or later (+1) in the running order. */
export function moveSlideInYaml(source, id, offset) {
  const seq = slidesSeq(source)
  const from = indexOfSlide(seq, id)
  const to = from + offset

  if (to < 0 || to >= seq.items.length) {
    throw new Error('これ以上は動かせません')
  }

  const moving = itemBlock(source, seq, from)
  const other = itemBlock(source, seq, to)
  const movingText = source.slice(moving.start, moving.end)
  const otherText = source.slice(other.start, other.end)

  // Only ever a swap with a neighbour, so the two blocks are adjacent and the
  // rest of the file - including every comment outside them - is untouched.
  const [first, second] = from < to ? [moving, other] : [other, moving]
  const swapped = from < to ? otherText + movingText : movingText + otherText

  return source.slice(0, first.start) + swapped + source.slice(second.end)
}

export function deleteSlideFromYaml(source, id) {
  const seq = slidesSeq(source)
  if (seq.items.length <= 1) {
    throw new Error('最後の1枚は削除できません')
  }
  const block = itemBlock(source, seq, indexOfSlide(seq, id))
  return source.slice(0, block.start) + source.slice(block.end)
}

/**
 * Copies a slide's metadata directly after it, under a new id.
 *
 * The block is spliced as text rather than rebuilt from the parsed value, so
 * the copy keeps the original's block scalars, wrapping and indentation instead
 * of being reprinted in whatever style the YAML writer prefers.
 */
export function duplicateSlideInYaml(source, id, newId) {
  const seq = slidesSeq(source)
  const block = itemBlock(source, seq, indexOfSlide(seq, id))
  const text = source.slice(block.start, block.end)
  const copy = text.replace(/^([^\S\n]*-[^\S\n]*id:[^\S\n]*).*$/m, `$1${newId}`)

  if (copy === text) {
    throw new Error(`deck.yaml の "${id}" に id 行が見つかりません`)
  }

  const tail = copy.endsWith('\n') ? copy : `${copy}\n`
  return source.slice(0, block.end) + tail + source.slice(block.end)
}

/**
 * The source range of a top-level slide component, found textually.
 *
 * Publishing the whole function body in the deck index would cost about 16 kB
 * gzipped per deck, so the index carries only the name and the range is worked
 * out here. Every deck component is a top-level `function Name(...)` whose
 * closing brace is the first `}` in the first column after it - a rule the
 * build checks against the compiler for every component in every deck, so a
 * deck that stopped fitting it fails there rather than here.
 */
export function findComponentSpan(source, name) {
  const declaration = new RegExp(`(^|\\n)(export\\s+)?function\\s+${name}\\s*[(<]`)
  const match = declaration.exec(source)
  if (!match) return null

  const start = match.index + (match[1] ? 1 : 0)
  const closing = source.indexOf('\n}', match.index + match[0].length)
  if (closing === -1) return null

  return { start, end: closing + 2 }
}

/** Re-finds a published span in the file as it is right now. */
function locate(source, span, what) {
  const range = resolveSnippet(source, span)
  if (!range) {
    throw new Error(`slides.tsx の${what}を特定できませんでした。ページを再読み込みしてください`)
  }
  return range
}

function locateComponent(source, name) {
  const span = findComponentSpan(source, name)
  if (!span) {
    throw new Error(`slides.tsx のコンポーネント ${name} を特定できませんでした。ページを再読み込みしてください`)
  }
  return span
}

/** Cuts whole lines out, so a removed entry leaves no blank line behind. */
function cutLines(source, range) {
  const start = source.lastIndexOf('\n', range.start - 1) + 1
  const newline = source.indexOf('\n', range.end)
  const end = newline === -1 ? source.length : newline + 1
  const outside = source.slice(start, range.start) + source.slice(range.end, end)
  // Only swallow the surrounding lines when nothing else lives on them.
  return outside.trim() ? { start: range.start, end: range.end } : { start, end }
}

export function deleteSlideFromTsx(source, slide) {
  const entry = cutLines(source, locate(source, slide.entry, '登録エントリ'))
  const cuts = [entry]

  if (slide.component) {
    const component = locateComponent(source, slide.component.name)
    // The blank line that separated the function from its neighbour goes too.
    const after = source.slice(component.end).match(/^\r?\n(\r?\n)?/)
    cuts.push({
      start: source.lastIndexOf('\n', component.start - 1) + 1,
      end: component.end + (after ? after[0].length : 0)
    })
  }

  return cuts
    .sort((left, right) => right.start - left.start)
    .reduce((text, cut) => text.slice(0, cut.start) + text.slice(cut.end), source)
}

/**
 * Registers a copy of a slide: the component function is copied under a new
 * name and the copy is registered right after the original.
 *
 * Renaming is a whole-word replacement inside the copied function only, so a
 * component that mentions its own name (a recursive helper, a displayName)
 * comes along consistently and nothing outside the copy is touched.
 */
export function duplicateSlideInTsx(source, slide, newId, newComponentName) {
  if (!slide.component) {
    throw new Error('このスライドは共通の部品を描画しているので複製できません（ソースを直接編集してください）')
  }

  const entry = locate(source, slide.entry, '登録エントリ')
  const component = locateComponent(source, slide.component.name)
  const rename = new RegExp(`\\b${slide.component.name}\\b`, 'g')

  const componentCopy = source.slice(component.start, component.end).replace(rename, newComponentName)

  // The entry anchor swallows the comma that follows it, exactly as a list
  // entry does - and the last entry of the array has none, so the copy has to
  // bring one with it or the two entries run together.
  const anchor = source.slice(entry.start, entry.end)
  const trailingComma = anchor.endsWith(',')
  const body = (trailingComma ? anchor.slice(0, -1).trimEnd() : anchor)
    .replace(`'${slide.id}'`, `'${newId}'`)
    .replace(rename, newComponentName)
  const indent = source.slice(source.lastIndexOf('\n', entry.start - 1) + 1, entry.start)
  const entryCopy = trailingComma ? `\n${indent}${body},` : `,\n${indent}${body}`

  // A component can be declared either side of the registration array, so both
  // insertions are measured against the original source and applied back to
  // front.
  const insertions = [
    { at: entry.end, text: entryCopy },
    { at: component.end, text: `\n\n${componentCopy}` }
  ].sort((left, right) => right.at - left.at)

  return insertions.reduce(
    (text, insertion) => text.slice(0, insertion.at) + insertion.text + text.slice(insertion.at),
    source
  )
}
