/**
 * Dev-only endpoints behind the in-browser slide text editor.
 *
 * The browser knows only what a slide renders, so it sends the visible string
 * and we resolve it back to a source range with the same extractor the CLI
 * uses. Never registered for builds: `apply: 'serve'`.
 */
import { readFileSync, readdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import {
  collectTsxStrings,
  collectYamlStrings,
  deckPaths,
  patchTsxSource,
  patchYamlSource
} from '../scripts/deck-text-core.mjs'

const NORMALIZE = (value) => value.replace(/\s+/g, ' ').trim()

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
          text: item.text
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
          text: item.text
        })
      }
    })
  }

  return found
}

/**
 * Applies one new string to every requested occurrence. Edits for the same file
 * are computed from a single read so batch indexes cannot shift mid-write.
 */
function applyPatch(repoRoot, targets, text) {
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
      edits.push({ ...item, text })
    }

    writeFileSync(
      file,
      entry.source === 'yaml' ? patchYamlSource(contents, edits) : patchTsxSource(contents, edits),
      'utf8'
    )
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

        const send = (status, payload) => {
          response.statusCode = status
          response.setHeader('Content-Type', 'application/json')
          response.end(JSON.stringify(payload))
        }

        try {
          const body = await readJson(request)

          if (request.url.startsWith('/find')) {
            if (typeof body.text !== 'string' || !body.text.trim()) {
              return send(400, { error: '対象の文字列が空です' })
            }
            return send(200, { candidates: candidatesFor(repoRoot, body.slug, body.text) })
          }

          if (request.url.startsWith('/patch')) {
            if (typeof body.text !== 'string' || !body.text.trim()) {
              return send(400, { error: '空文字には変更できません' })
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
            return send(200, applyPatch(repoRoot, targets, body.text))
          }

          return next()
        } catch (error) {
          send(400, { error: error instanceof Error ? error.message : String(error) })
        }
      })
    }
  }
}
