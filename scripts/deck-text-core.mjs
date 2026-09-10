/**
 * Deck text extraction / patching core.
 *
 * Slide copy lives inline in `slides.tsx` (JSX children, data arrays) and in
 * `deck.yaml` (title, summary, per-slide title/notes). Editing those files by
 * hand means reading around animation code, so this module isolates the human
 * readable strings and writes edits back into the exact source ranges.
 *
 * Shared by the CLI (scripts/deck-text.mjs) and the dev-only in-browser editor
 * (vite-plugins/deck-text-editor.mjs) so both agree on what "editable" means.
 */
import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import ts from 'typescript'
import YAML from 'yaml'

export {
  patchTsxSource,
  encodeForKind,
  resolveRange,
  resolveSnippet,
  removeRanges
} from '../shared/deck-text-rewrite.mjs'
import { removeRanges, resolveSnippet } from '../shared/deck-text-rewrite.mjs'

/** deck.yaml keys the schema requires; emptying or dropping one breaks the deck. */
const REQUIRED_YAML_KEYS = new Set(['title', 'summary'])

/** JSX attributes whose value is copy shown to (or read by) a human. */
const COPY_ATTRIBUTES = new Set(['alt', 'title', 'aria-label', 'label', 'caption', 'placeholder'])

/** Object keys that hold styling or configuration, never copy. */
const NON_COPY_KEYS = new Set([
  'id',
  'slug',
  'style',
  'className',
  'config',
  'fontFamily',
  'fontWeight',
  'background',
  'backgroundColor',
  'color',
  'transform',
  'boxShadow',
  'border',
  'borderRadius',
  'easing'
])

const CSS_LIKE = /(^|\s)(-?\d*\.?\d+(px|rem|em|vh|vw|%|deg|s|ms)\b)|rgba?\(|var\(--|linear-gradient|translate|#[0-9a-fA-F]{3,8}\b/
const CJK = /[　-〿぀-ヿ㐀-䶿一-鿿＀-￯]/
/** Japanese punctuation and brackets: copy is never a single one of these. */
const CJK_PUNCTUATION = /^[、。，．・：；！？「」『』（）〔〕【】〈〉《》…‥ー―－～＝＋／＼｜"'　]$/

export function fileHash(source) {
  return createHash('sha256').update(source).digest('hex').slice(0, 16)
}

/** JSX collapses surrounding whitespace/newlines; show the human that view. */
function normalizeJsxText(raw) {
  return raw.replace(/\s+/g, ' ').trim()
}

function looksLikeCopy(value) {
  const text = value.trim()
  if (!text) return false
  // A single Japanese character is real copy — the editor itself can produce
  // one, and a string it refuses to extract is a string nobody can click again.
  // A lone punctuation mark is not: it is the tail of copy split by an inline
  // tag, it repeats all over a slide, and clicking it can only be a mistake.
  if (text.length === 1) return CJK.test(text) && !CJK_PUNCTUATION.test(text)
  if (CJK.test(text)) return true
  if (CSS_LIKE.test(text)) return false
  if (!/[A-Za-z]/.test(text)) return false
  // Bare identifiers/tokens (`opening`, `slide-kicker`, `https://…`) are wiring,
  // not copy. Real English copy has a space or sentence punctuation.
  return /[\s.!?:]/.test(text)
}

/**
 * Walks up the AST to decide whether a string sits in a copy position.
 * Returns null when the node should not be offered for editing.
 */
function copyContext(node) {
  let current = node
  let parent = node.parent

  while (parent) {
    if (ts.isImportDeclaration(parent) || ts.isExportDeclaration(parent)) return null
    if (ts.isJsxAttribute(parent)) {
      const name = parent.name.getText()
      return COPY_ATTRIBUTES.has(name) ? `@${name}` : null
    }
    if (ts.isPropertyAssignment(parent) && parent.initializer === current) {
      const key = parent.name.getText().replace(/['"]/g, '')
      if (NON_COPY_KEYS.has(key)) return null
    }
    if (ts.isPropertyAssignment(parent) && parent.name === current) return null
    if (ts.isCallExpression(parent) && parent.expression !== current) {
      const callee = parent.expression.getText()
      // Copy is never an argument to helpers like spring()/interpolate().
      if (!/^(String|t|tr)$/.test(callee)) return null
    }
    current = parent
    parent = parent.parent
  }

  return 'text'
}

/** True when the literal is written directly as a JSX attribute value. */
function jsxAttributeValue(node) {
  return Boolean(node.parent && ts.isJsxAttribute(node.parent))
}

/** Name of the enclosing slide component, used as a human-facing breadcrumb. */
function enclosingComponent(node) {
  let current = node.parent
  while (current) {
    if (ts.isFunctionDeclaration(current) && current.name) return current.name.getText()
    if (
      ts.isVariableDeclaration(current) &&
      current.name &&
      ts.isIdentifier(current.name) &&
      current.initializer &&
      (ts.isArrowFunction(current.initializer) || ts.isFunctionExpression(current.initializer))
    ) {
      return current.name.getText()
    }
    current = current.parent
  }
  return 'module'
}

/** JSX text that is only indentation between two tags, not copy. */
function isJsxWhitespace(node) {
  return ts.isJsxText(node) && !node.text.trim()
}

/**
 * The JSX element a piece of copy is the entire content of.
 *
 * Emptying `<p>text</p>` leaves a `<p>` that still takes its padding, margin
 * and any decoration with it, so "delete this" means the element. The climb
 * continues while the element remains its parent's only content — copy wrapped
 * as `<li><span>text</span></li>` should take the list item — but never reaches
 * the outermost element, because removing that would leave the component with
 * nothing to return.
 */
function jsxOwner(node) {
  let current = node
  // `<p>{'text'}</p>` wraps the literal in an expression container.
  while (current.parent && ts.isJsxExpression(current.parent)) current = current.parent

  let owner = null
  while (
    current.parent &&
    ts.isJsxElement(current.parent) &&
    current.parent.children.filter((child) => !isJsxWhitespace(child)).length === 1 &&
    (ts.isJsxElement(current.parent.parent) || ts.isJsxFragment(current.parent.parent))
  ) {
    owner = current.parent
    current = current.parent
  }

  return owner
}

/**
 * Grows a removal span so the file reads as if the item had never been there:
 * the comma that separated it goes too, and an item that owned its line takes
 * the line with it instead of leaving a blank one.
 */
function tidySpan(source, start, end) {
  const trailingComma = source.slice(end).match(/^[^\S\n]*,/)
  let from = start
  let to = end

  if (trailingComma) {
    to += trailingComma[0].length
  } else {
    // The last item of a list keeps the comma in front of it instead.
    const leadingComma = source.slice(0, start).match(/,\s*$/)
    if (leadingComma) from -= leadingComma[0].length
  }

  const lineStart = source.lastIndexOf('\n', from - 1) + 1
  const newline = source.indexOf('\n', to)
  const lineEnd = newline === -1 ? source.length : newline

  if (!source.slice(lineStart, from).trim() && !source.slice(to, lineEnd).trim()) {
    return { start: lineStart, end: newline === -1 ? source.length : newline + 1 }
  }

  const spaces = source.slice(to).match(/^[^\S\n]+/)
  return { start: from, end: spaces ? to + spaces[0].length : to }
}

/**
 * The construct this copy can be deleted with, or null when only the text
 * itself can go.
 *
 * Two shapes cover the decks: a string in an array (one bullet of a list) and
 * a JSX element whose whole content is the string. A property value — `answer`,
 * `verdict` — is deliberately not removable: the slide component and its type
 * both expect the key to exist, so dropping it would break the build rather
 * than the slide.
 */
function removableSpan(node, source, sourceFile) {
  const owner = jsxOwner(node)
  const target = owner ?? node
  const label = owner
    ? `<${owner.openingElement.tagName.getText()}> 要素`
    : target.parent && ts.isArrayLiteralExpression(target.parent)
      ? 'リストの1項目'
      : null

  if (!label) return null

  // `core` is the node itself; the span around it also takes the separator and
  // the blank line it would leave behind. Keeping both lets the round-trip
  // guard prove the tidying only ever swallowed punctuation.
  const core = { start: target.getStart(sourceFile), end: target.getEnd() }
  return { ...tidySpan(source, core.start, core.end), core, label }
}

/**
 * Carries the exact source the span covers today. A production save works from
 * an index built at deploy time and has no compiler to recompute the span, so
 * it re-finds this snippet in the file it is about to rewrite.
 */
function withSnippet(source, span) {
  if (!span) return null
  return { ...span, snippet: source.slice(span.start, span.end) }
}

/** Cuts the given items out of a tsx source, spans re-verified against it. */
export function removeTsxItems(source, items) {
  const spans = items.map((item) => {
    if (!item.remove) {
      throw new Error(`「${item.text.slice(0, 20)}」は要素ごと削除できません（文字だけ消せます）`)
    }
    const range = resolveSnippet(source, item.remove)
    if (!range) {
      throw new Error(`「${item.text.slice(0, 20)}」の位置を特定できませんでした。ページを再読み込みしてください`)
    }
    return range
  })

  return removeRanges(source, spans)
}

/** Drops the given keys from a deck.yaml source. */
export function removeYamlItems(source, items) {
  const doc = YAML.parseDocument(source)

  for (const item of items) {
    if (!item.remove) {
      throw new Error(`${item.component} は必須項目なので削除できません`)
    }
    if (doc.getIn(item.yamlPath) !== item.original) {
      throw new Error(`deck.yaml の ${item.component} が変更されています。ページを再読み込みしてください`)
    }
    doc.deleteIn(item.yamlPath)
  }

  return doc.toString({ lineWidth: 0 })
}

/**
 * Extracts every editable string from a slides.tsx file, in source order.
 * Each item carries the exact byte range so edits can be spliced back without
 * reprinting (and reformatting) the file.
 */
export function collectTsxStrings(filePath, source = readFileSync(filePath, 'utf8')) {
  const sourceFile = ts.createSourceFile(filePath, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
  const items = []

  const visit = (node) => {
    if (ts.isJsxText(node)) {
      const text = normalizeJsxText(node.text)
      if (text && looksLikeCopy(text)) {
        // JSX text keeps its surrounding indentation in the source range, and
        // `getStart` treats that indentation as trivia — so measure from `pos`
        // and trim the whitespace ourselves to land on the copy itself.
        const raw = source.slice(node.pos, node.end)
        const leading = raw.match(/^\s*/)[0]
        const trailing = raw.match(/\s*$/)[0]
        items.push({
          kind: 'jsx-text',
          start: node.pos + leading.length,
          end: node.end - trailing.length,
          text,
          original: text,
          component: enclosingComponent(node),
          line: sourceFile.getLineAndCharacterOfPosition(node.pos + leading.length).line + 1,
          remove: withSnippet(source, removableSpan(node, source, sourceFile))
        })
      }
    } else if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
      const context = copyContext(node)
      if (context && looksLikeCopy(node.text)) {
        items.push({
          kind: jsxAttributeValue(node)
            ? 'jsx-attribute'
            : ts.isStringLiteral(node)
              ? 'string'
              : 'template',
          start: node.getStart(sourceFile),
          end: node.getEnd(),
          text: node.text,
          original: node.text,
          quote: source[node.getStart(sourceFile)],
          component: enclosingComponent(node),
          line: sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1,
          remove: withSnippet(source, removableSpan(node, source, sourceFile))
        })
      }
    }

    ts.forEachChild(node, visit)
  }

  visit(sourceFile)
  items.sort((left, right) => left.start - right.start)
  return items
}

/** Editable copy inside deck.yaml: deck title/summary and per-slide title/notes. */
export function collectYamlStrings(filePath, source = readFileSync(filePath, 'utf8')) {
  const doc = YAML.parseDocument(source)
  const items = []
  const push = (yamlPath, label) => {
    const value = doc.getIn(yamlPath)
    if (typeof value === 'string' && value.trim()) {
      // A required key cannot be dropped or blanked without failing the deck
      // schema, so those strings are edit-only.
      const key = yamlPath[yamlPath.length - 1]
      items.push({
        kind: 'yaml',
        yamlPath,
        text: value,
        original: value,
        component: label,
        required: REQUIRED_YAML_KEYS.has(key),
        remove: REQUIRED_YAML_KEYS.has(key) ? null : { yamlPath, label: `deck.yaml の ${key}` }
      })
    }
  }

  push(['title'], 'deck.title')
  push(['summary'], 'deck.summary')

  const slides = doc.get('slides')
  const count = slides && typeof slides.items?.length === 'number' ? slides.items.length : 0
  for (let index = 0; index < count; index += 1) {
    const id = doc.getIn(['slides', index, 'id']) ?? index
    push(['slides', index, 'title'], `slide[${id}].title`)
    push(['slides', index, 'notes'], `slide[${id}].notes`)
  }

  return items
}

export function patchYamlSource(source, edits) {
  const doc = YAML.parseDocument(source)
  for (const edit of edits) {
    doc.setIn(edit.yamlPath, edit.text)
  }
  return doc.toString({ lineWidth: 0 })
}

/**
 * The slide ids registered in a slides.tsx.
 *
 * Returns `{ exhaustive, ids }`. Some decks build their array from data
 * (`visualSlides.map(...)`, `...QA.map(...)`), and those entries cannot be read
 * statically: `exhaustive` is false there, and only the ids that are literally
 * written in the file are returned. Returns null when there is no `slides`
 * array at all.
 */
export function collectTsxSlideIds(filePath, source = readFileSync(filePath, 'utf8')) {
  const sourceFile = ts.createSourceFile(filePath, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
  let declaration = null

  const visit = (node) => {
    if (declaration === null && ts.isVariableDeclaration(node) && node.name.getText() === 'slides') {
      declaration = node
    }
    ts.forEachChild(node, visit)
  }

  visit(sourceFile)
  if (!declaration) return null

  const initializer = declaration.initializer
  if (!initializer || !ts.isArrayLiteralExpression(initializer)) {
    return { exhaustive: false, ids: [] }
  }

  const ids = []
  let exhaustive = true

  for (const element of initializer.elements) {
    if (!ts.isObjectLiteralExpression(element)) {
      exhaustive = false
      continue
    }

    const property = element.properties.find((item) => item.name?.getText() === 'id')
    const value = property && ts.isPropertyAssignment(property) ? property.initializer : null

    if (value && (ts.isStringLiteral(value) || ts.isNoSubstitutionTemplateLiteral(value))) {
      ids.push(value.text)
    } else {
      exhaustive = false
    }
  }

  return { exhaustive, ids }
}

/** Syntax errors in a tsx source, used to prove a rewrite stayed valid. */
export function tsxSyntaxErrors(filePath, source) {
  const sourceFile = ts.createSourceFile(filePath, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
  return sourceFile.parseDiagnostics.map((diagnostic) =>
    ts.flattenDiagnosticMessageText(diagnostic.messageText, ' ')
  )
}

export function deckPaths(repoRoot, slug) {
  const dir = path.join(repoRoot, 'content', 'decks', slug)
  return { dir, yaml: path.join(dir, 'deck.yaml'), tsx: path.join(dir, 'slides.tsx') }
}
