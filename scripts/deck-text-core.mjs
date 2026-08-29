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

export { patchTsxSource, encodeForKind, resolveRange } from '../shared/deck-text-rewrite.mjs'

/** JSX attributes whose value is copy shown to (or read by) a human. */
const COPY_ATTRIBUTES = new Set(['alt', 'title', 'aria-label', 'label', 'caption', 'placeholder'])

/** Object keys that hold styling or configuration, never copy. */
const NON_COPY_KEYS = new Set([
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

export function fileHash(source) {
  return createHash('sha256').update(source).digest('hex').slice(0, 16)
}

/** JSX collapses surrounding whitespace/newlines; show the human that view. */
function normalizeJsxText(raw) {
  return raw.replace(/\s+/g, ' ').trim()
}

function looksLikeCopy(value) {
  const text = value.trim()
  if (text.length < 2) return false
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
          line: sourceFile.getLineAndCharacterOfPosition(node.pos + leading.length).line + 1
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
          line: sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1
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
      items.push({ kind: 'yaml', yamlPath, text: value, original: value, component: label })
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
