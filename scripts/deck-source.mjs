/**
 * Whole-file access to a deck's source, for when the copy editor cannot help.
 *
 * The click-to-edit layer only ever sees strings it can resolve back to a
 * source range. Anything it cannot resolve — text a component generates, an
 * attribute edited down to nothing, a character left behind between two inline
 * tags — is then unreachable from the browser, and the fix means opening an
 * editor on the machine that holds the checkout.
 *
 * So the dev server also serves the two files a deck is made of and takes them
 * back, refusing a write that would not parse. That is the whole escape hatch:
 * no ranges, no extraction, just the file.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import YAML from 'yaml'
import { deckPaths, fileHash, tsxSyntaxErrors } from './deck-text-core.mjs'

/** The files a deck is made of, keyed by the name the UI shows. */
const DECK_FILES = ['slides.tsx', 'deck.yaml']

function pathFor(repoRoot, slug, name) {
  const paths = deckPaths(repoRoot, slug)
  if (name === 'slides.tsx') return paths.tsx
  if (name === 'deck.yaml') return paths.yaml
  throw new Error(`編集できないファイルです: ${name}`)
}

/** Both source files of a deck, each with the hash a save has to match. */
export function readDeckSources(repoRoot, slug) {
  return DECK_FILES.map((name) => {
    const file = pathFor(repoRoot, slug, name)
    const text = readFileSync(file, 'utf8')
    return { name, path: path.relative(repoRoot, file), text, hash: fileHash(text) }
  })
}

/**
 * Syntax errors that would break the deck, as messages for the human.
 *
 * A whole-file save is the one path where a person types source directly, so it
 * is also the one path that can leave the dev server unable to render anything.
 * Parsing before writing turns that into a message instead of a white screen.
 */
export function sourceErrors(name, text) {
  if (!text.trim()) return ['ファイルが空です']

  if (name === 'slides.tsx') {
    return tsxSyntaxErrors(name, text)
  }

  try {
    const document = YAML.parse(text)
    if (!document || typeof document !== 'object') return ['deck.yaml の中身がマッピングではありません']
    return []
  } catch (error) {
    return [error instanceof Error ? error.message : String(error)]
  }
}

/**
 * Replaces one deck source file.
 *
 * `baseHash` is the hash the browser was shown. Requiring it to still match
 * means an edit made from a stale tab reports a conflict rather than silently
 * reverting whatever landed in between — including a save the copy editor made
 * in another tab.
 */
export function writeDeckSource(repoRoot, slug, name, text, baseHash) {
  const file = pathFor(repoRoot, slug, name)
  const current = readFileSync(file, 'utf8')

  if (baseHash && fileHash(current) !== baseHash) {
    throw new Error(`${name} は編集を開いたあとに変更されています。読み直してください`)
  }

  const errors = sourceErrors(name, text)
  if (errors.length) {
    throw new Error(`${name} の構文エラー: ${errors.slice(0, 3).join(' / ')}`)
  }

  if (current === text) {
    return { file: path.relative(repoRoot, file), changed: false, hash: fileHash(current) }
  }

  writeFileSync(file, text, 'utf8')
  return { file: path.relative(repoRoot, file), changed: true, hash: fileHash(text) }
}
