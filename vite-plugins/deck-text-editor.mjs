/**
 * Dev-only endpoints behind the in-browser slide text editor.
 *
 * The browser knows only what a slide renders, so it sends the visible string
 * and we resolve it back to a source range with the same extractor the CLI
 * uses. Never registered for builds: `apply: 'serve'`.
 */
import { readFileSync, readdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { publishFiles } from './deck-git.mjs'
import {
  collectTsxStrings,
  collectYamlStrings,
  deckPaths,
  patchTsxSource,
  patchYamlSource,
  duplicateTsxItems,
  removeTsxItems,
  removeYamlItems
} from '../scripts/deck-text-core.mjs'
import { readDeckSources, writeDeckSource } from '../scripts/deck-source.mjs'

const NORMALIZE = (value) => value.replace(/\s+/g, ' ').trim()

/**
 * These endpoints rewrite source files and can commit and push, so a page the
 * developer happens to be visiting must not be able to drive them.
 *
 * A cross-origin form or fetch can only send "simple" requests without a CORS
 * preflight, and a simple request cannot carry a custom header. Requiring one —
 * plus a same-origin check when the browser tells us the origin — blocks the
 * drive-by case; nothing here is a substitute for the fact that a dev server on
 * 0.0.0.0 trusts everyone who can reach it.
 */
const EDITOR_HEADER = 'x-deck-text-editor'

function isTrustedRequest(request) {
  if (request.headers[EDITOR_HEADER] !== '1') return false

  const origin = request.headers.origin
  if (!origin) return true

  try {
    return new URL(origin).host === request.headers.host
  } catch {
    return false
  }
}

function listSlugs(repoRoot) {
  return readdirSync(path.join(repoRoot, 'content', 'decks'), { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
}

/** Every editable string across the requested deck (or all decks). */
function candidatesFor(repoRoot, slug, text) {
  const target = NORMALIZE(text)
  const slugs = slug && listSlugs(repoRoot).includes(slug) ? [slug] : listSlugs(repoRoot)
  const found = []

  for (const current of slugs) {
    const paths = deckPaths(repoRoot, current)

    collectTsxStrings(paths.tsx).forEach((item, index) => {
      if (NORMALIZE(item.text) === target) {
        found.push({
          slug: current,
          source: 'tsx',
          index,
          component: item.component,
          line: item.line,
          text: item.text,
          removeLabel: item.remove?.label ?? null,
          duplicateLabel: item.duplicate?.label ?? null
        })
      }
    })

    collectYamlStrings(paths.yaml).forEach((item, index) => {
      if (NORMALIZE(item.text) === target) {
        found.push({
          slug: current,
          source: 'yaml',
          index,
          component: item.component,
          line: null,
          text: item.text,
          removeLabel: item.remove?.label ?? null,
          required: Boolean(item.required)
        })
      }
    })
  }

  return found
}

/**
 * Applies one new string to every requested occurrence, or deletes the
 * construct each occurrence sits in. Edits for the same file are computed from
 * a single read so batch indexes cannot shift mid-write.
 */
function applyPatch(repoRoot, targets, text, remove = false, duplicate = false) {
  const byFile = new Map()

  for (const target of targets) {
    const paths = deckPaths(repoRoot, target.slug)
    const file = target.source === 'yaml' ? paths.yaml : paths.tsx
    const entry = byFile.get(file) ?? { source: target.source, targets: [] }
    entry.targets.push(target)
    byFile.set(file, entry)
  }

  const written = []

  for (const [file, entry] of byFile) {
    const contents = readFileSync(file, 'utf8')
    const items =
      entry.source === 'yaml' ? collectYamlStrings(file, contents) : collectTsxStrings(file, contents)
    const edits = []

    for (const target of entry.targets) {
      const item = items[target.index]
      if (!item) {
        throw new Error('編集対象が見つかりませんでした。ページを再読み込みしてください。')
      }
      if (NORMALIZE(item.text) !== NORMALIZE(target.original)) {
        throw new Error('ソースが変更されています。ページを再読み込みしてください。')
      }
      if (duplicate && entry.source === 'yaml') {
        throw new Error('deck.yaml の項目は複製できません')
      }
      // deck.yaml の必須項目は空でも schema 検証に落ちるので、編集だけを許す。
      if (!remove && !duplicate && !text.trim() && item.required) {
        throw new Error(`${item.component} は必須項目なので空にできません`)
      }
      edits.push({ ...item, text })
    }

    const rewrite = () =>
      entry.source === 'yaml' ? patchYamlSource(contents, edits) : patchTsxSource(contents, edits)
    const cut = () =>
      entry.source === 'yaml' ? removeYamlItems(contents, edits) : removeTsxItems(contents, edits)

    const grow = () => duplicateTsxItems(contents, edits)

    writeFileSync(file, duplicate ? grow() : remove ? cut() : rewrite(), 'utf8')
    written.push(path.relative(repoRoot, file))
  }

  return { files: written }
}

function readJson(request) {
  return new Promise((resolve, reject) => {
    let body = ''
    request.on('data', (chunk) => {
      body += chunk
      if (body.length > 1_000_000) reject(new Error('リクエストが大きすぎます'))
    })
    request.on('end', () => {
      try {
        resolve(JSON.parse(body || '{}'))
      } catch {
        reject(new Error('リクエストの形式が不正です'))
      }
    })
    request.on('error', reject)
  })
}

export function deckTextEditor({ repoRoot = process.cwd() } = {}) {
  return {
    name: 'deck-text-editor',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/__deck-text', async (request, response, next) => {
        if (request.method !== 'POST') return next()

        if (!isTrustedRequest(request)) {
          response.statusCode = 403
          response.setHeader('Content-Type', 'application/json')
          response.end(JSON.stringify({ error: 'この編集APIはページ内の編集UIからのみ使えます' }))
          return
        }

        const send = (status, payload) => {
          response.statusCode = status
          response.setHeader('Content-Type', 'application/json')
          response.end(JSON.stringify(payload))
        }

        try {
          const body = await readJson(request)

          if (request.url.startsWith('/find')) {
            // Batch form: the client asks which of the strings it rendered are
            // actually editable, so a phone list can hide the rest.
            if (Array.isArray(body.texts)) {
              return send(200, {
                matches: body.texts.map((text) =>
                  typeof text === 'string' && text.trim()
                    ? candidatesFor(repoRoot, body.slug, text).length
                    : 0
                )
              })
            }
            if (typeof body.text !== 'string' || !body.text.trim()) {
              return send(400, { error: '対象の文字列が空です' })
            }
            return send(200, { candidates: candidatesFor(repoRoot, body.slug, body.text) })
          }

          // The escape hatch: the copy editor can only reach strings it can
          // resolve, so the whole file is also readable and writable.
          if (request.url.startsWith('/source')) {
            const slug = typeof body.slug === 'string' ? body.slug : ''
            if (!listSlugs(repoRoot).includes(slug)) {
              return send(400, { error: `不明なデッキです: ${slug || '(指定なし)'}` })
            }

            if (request.url.startsWith('/source-save')) {
              if (typeof body.text !== 'string') {
                return send(400, { error: '本文が指定されていません' })
              }
              const result = writeDeckSource(repoRoot, slug, body.name, body.text, body.hash)

              if (!body.publish || !result.changed) {
                return send(200, result)
              }

              // Same rule as a copy save: the file is already written, so a git
              // failure is reported without pretending the edit was lost.
              try {
                const published = await publishFiles(
                  repoRoot,
                  [result.file],
                  `fix(deck): edit ${body.name} source in ${slug}`
                )
                return send(200, { ...result, published })
              } catch (error) {
                return send(200, {
                  ...result,
                  publishError: error instanceof Error ? error.message : String(error)
                })
              }
            }

            return send(200, { files: readDeckSources(repoRoot, slug) })
          }

          if (request.url.startsWith('/patch')) {
            const remove = body.remove === true
            const duplicate = body.duplicate === true
            if (!remove && !duplicate && typeof body.text !== 'string') {
              return send(400, { error: '本文が指定されていません' })
            }
            const targets = Array.isArray(body.targets) ? body.targets : []
            if (!targets.length) {
              return send(400, { error: '編集対象が指定されていません' })
            }
            const slugs = listSlugs(repoRoot)
            const unknown = targets.find((target) => !slugs.includes(target.slug))
            if (unknown) {
              return send(400, { error: `不明なデッキです: ${unknown.slug}` })
            }
            const result = applyPatch(
              repoRoot,
              targets,
              remove || duplicate ? '' : body.text,
              remove,
              duplicate
            )

            if (!body.publish) {
              return send(200, result)
            }

            // Publishing is best effort: the copy is already written, so a git
            // failure must be reported without losing the edit.
            try {
              const slugs = [...new Set(targets.map((target) => target.slug))].join(', ')
              const published = await publishFiles(
                repoRoot,
                result.files,
                duplicate
                  ? `feat(copy): duplicate slide element in ${slugs}`
                  : remove
                    ? `fix(copy): remove slide text in ${slugs}`
                    : `fix(copy): update slide text in ${slugs}`
              )
              return send(200, { ...result, published })
            } catch (error) {
              return send(200, {
                ...result,
                publishError: error instanceof Error ? error.message : String(error)
              })
            }
          }

          return next()
        } catch (error) {
          send(400, { error: error instanceof Error ? error.message : String(error) })
        }
      })
    }
  }
}
