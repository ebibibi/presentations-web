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
