/**
 * Encoding and splicing for slide copy, with no TypeScript dependency.
 *
 * The extractor needs the TypeScript compiler, which is far too large for a
 * Cloudflare Function, so the parts that a production save also needs live here:
 * given a source file and edits that already carry their ranges, produce the new
 * file. The dev server, the CLI and the Pages Function all share this module so
 * a string is encoded the same way everywhere.
 */

/**
 * JSX attribute strings are raw: `\"` is a literal backslash, and the delimiter
 * cannot appear inside. Swap the quote when possible, otherwise fall back to an
 * expression container where normal escaping applies.
 */
export function encodeJsxAttribute(text) {
  if (!text.includes('\n')) {
    if (!text.includes('"')) return `"${text}"`
    if (!text.includes("'")) return `'${text}'`
  }
  return `{${encodeLiteral('string', text, "'")}}`
}

/** Re-encodes copy as a literal, keeping the quote style the source used. */
export function encodeLiteral(kind, text, quote = "'") {
  if (kind === 'template') {
    return '`' + text.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${') + '`'
  }
  const mark = quote === '"' ? '"' : "'"
  const escaped = text
    .replace(/\\/g, '\\\\')
    .replaceAll(mark, `\\${mark}`)
    .replace(/\n/g, '\\n')
  return `${mark}${escaped}${mark}`
}

/** Source form of one piece of copy, ready to splice into a tsx file. */
export function encodeForKind(kind, text, quote) {
  if (kind === 'jsx-text') {
    return text.replace(/[{}<>]/g, (match) => `{'${match}'}`)
  }
  if (kind === 'jsx-attribute') {
    return encodeJsxAttribute(text)
  }
  return encodeLiteral(kind, text, quote)
}

/**
 * Applies edits to a tsx source string. Each edit is `{ start, end, kind, text }`
 * with `original` carrying the copy the range holds today.
 */
export function patchTsxSource(source, edits) {
  const ordered = [...edits].sort((left, right) => right.start - left.start)
  let next = source

  for (const edit of ordered) {
    // Untouched copy keeps its exact source form, so a no-op patch is a no-op
    // diff even where the original spans several lines.
    if (edit.text === edit.original) continue

    next =
      next.slice(0, edit.start) +
      encodeForKind(edit.kind, edit.text, edit.quote) +
      next.slice(edit.end)
  }

  return next
}

/**
 * Confirms a range still holds the copy it was indexed with, and relocates it
 * when the file has moved on. Returns the usable range, or null when the copy
 * is gone or ambiguous.
 *
 * A production save works from an index built at deploy time, so the file on the
 * default branch may already have changed underneath it.
 */
export function resolveRange(source, item) {
  // JSX text keeps the indentation and line breaks of the source, while the
  // indexed copy is the collapsed form the browser renders, so the two are
  // compared (and searched for) with whitespace normalised.
  if (item.kind === 'jsx-text') {
    return resolveJsxText(source, item)
  }

  const encoded = encodeForKind(item.kind, item.original, item.quote)

  if (source.slice(item.start, item.end) === encoded) {
    return { start: item.start, end: item.end }
  }

  const first = source.indexOf(encoded)
  if (first === -1) return null
  if (source.indexOf(encoded, first + 1) !== -1) return null

  return { start: first, end: first + encoded.length }
}

/**
 * Confirms a removable span still holds the exact source it was indexed with,
 * and relocates it when the file has moved on. Same rule as `resolveRange`:
 * the recorded position first, then a unique match anywhere in the file, and
 * nothing at all when the snippet is gone or appears more than once.
 */
export function resolveSnippet(source, span) {
  if (source.slice(span.start, span.end) === span.snippet) {
    return { start: span.start, end: span.end }
  }

  const first = source.indexOf(span.snippet)
  if (first === -1) return null
  if (source.indexOf(span.snippet, first + 1) !== -1) return null

  return { start: first, end: first + span.snippet.length }
}

/**
 * Cuts spans out of a source file, back to front so the earlier offsets still
 * hold. Overlapping spans are refused rather than spliced: deleting every
 * occurrence of a string can pick a nested pair, and cutting one out of the
 * other would leave a broken file behind.
 */
export function removeRanges(source, ranges) {
  const ordered = [...ranges].sort((left, right) => right.start - left.start)
  let next = source
  let lowestRemoved = Number.POSITIVE_INFINITY

  for (const range of ordered) {
    if (range.end > lowestRemoved) {
      throw new Error('削除する範囲が重なっています。1件ずつ削除してください。')
    }
    lowestRemoved = range.start
    next = next.slice(0, range.start) + next.slice(range.end)
  }

  return next
}

const collapse = (value) => value.replace(/\s+/g, ' ').trim()

function resolveJsxText(source, item) {
  const wanted = collapse(item.original)

  if (collapse(source.slice(item.start, item.end)) === wanted) {
    return { start: item.start, end: item.end }
  }

  const pattern = new RegExp(
    wanted.split(' ').map(escapeRegExp).join('\\s+'),
    'g'
  )
  const matches = [...source.matchAll(pattern)]
  if (matches.length !== 1) return null

  return { start: matches[0].index, end: matches[0].index + matches[0][0].length }
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Repeats the given items in place: each list entry is copied and the copy is
 * inserted immediately after the original, so a list grows by one entry that
 * already has the right shape and indentation for the user to edit.
 *
 * The anchor span covers the entry and the comma that already follows it (if
 * any), so the copy always goes at the anchor's end. What goes in is derived
 * from the anchor itself:
 *
 * - an entry that ends with a comma is repeated as `\n<indent><entry>,`
 * - an entry without one - the last or only entry of a list - needs the comma
 *   put in front of the copy instead, or the two entries run together
 * - an entry sharing its line with siblings is repeated inline, after a space
 */
export function duplicateTsxItems(source, items) {
  const insertions = items.map((item) => {
    if (!item.duplicate) {
      throw new Error(`「${item.text.slice(0, 20)}」は複製できません（リストの項目や行だけ複製できます）`)
    }

    const range = resolveSnippet(source, item.duplicate)
    if (!range) {
      throw new Error(`「${item.text.slice(0, 20)}」の位置を特定できませんでした。ページを再読み込みしてください`)
    }

    const anchor = source.slice(range.start, range.end)
    const separator = item.duplicate.separator ?? ''
    const trailingComma = anchor.endsWith(',')
    const entry = trailingComma ? anchor.slice(0, -1).trimEnd() : anchor

    const lineStart = source.lastIndexOf('\n', range.start - 1) + 1
    const indent = source.slice(lineStart, range.start)
    const ownsLine = !indent.trim()
    const gap = ownsLine ? `\n${indent}` : ' '

    const text = trailingComma
      ? `${gap}${entry},`
      : `${separator}${gap}${entry}`

    return { at: range.end, text }
  })

  // Later insertions first, so the offsets of the earlier ones still hold.
  const ordered = [...insertions].sort((left, right) => right.at - left.at)
  let result = source

  for (const insertion of ordered) {
    result = result.slice(0, insertion.at) + insertion.text + result.slice(insertion.at)
  }

  return result
}
