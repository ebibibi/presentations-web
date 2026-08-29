/**
 * Owner-only endpoint that rewrites slide copy on the default branch.
 *
 * Production has no checkout and cannot run the extractor, so the ranges come
 * from the copy index published with the build (`/deck-text/<slug>.json`). The
 * index is read here rather than trusted from the request, and every range is
 * re-verified against the file on GitHub before it is rewritten.
 */
import YAML from 'yaml'
import { readSession } from '../../../shared/session.mjs'
import { createGitHubClient } from '../../../shared/github.mjs'
import { patchTsxSource, resolveRange } from '../../../shared/deck-text-rewrite.mjs'

/** Whether production editing is wired up at all (owner only). */
export async function onRequestGet({ request, env }) {
  const session = await readSession(request, env.AUTH_SECRET)
  if (!session?.canRecord) {
    return json({ error: 'オーナーとしてログインしてください' }, 403)
  }
  return json({ configured: Boolean(env.GITHUB_TOKEN && env.GITHUB_REPO) })
}

export async function onRequestPost(context) {
  const { request, env } = context

  const session = await readSession(request, env.AUTH_SECRET)
  if (!session?.canRecord) {
    return json({ error: 'オーナーとしてログインしてください' }, 403)
  }

  let body
  try {
    body = await request.json()
  } catch {
    return json({ error: 'リクエストの形式が不正です' }, 400)
  }

  const { slug, ids, text } = body ?? {}
  if (typeof slug !== 'string' || !Array.isArray(ids) || !ids.length || typeof text !== 'string') {
    return json({ error: 'slug / ids / text が必要です' }, 400)
  }
  if (!text.trim()) {
    return json({ error: '空文字には変更できません' }, 400)
  }

  const index = await loadIndex(context, slug)
  if (!index) {
    return json({ error: `デッキの索引が見つかりません: ${slug}` }, 404)
  }

  const items = ids.map((id) => index.items.find((item) => item.id === id)).filter(Boolean)
  if (items.length !== ids.length) {
    return json({ error: '編集対象が索引にありません。ページを再読み込みしてください' }, 409)
  }

  let github
  try {
    github = createGitHubClient({
      token: env.GITHUB_TOKEN,
      repo: env.GITHUB_REPO,
      branch: env.GITHUB_BRANCH || 'main',
      apiBase: env.GITHUB_API_BASE
    })
  } catch (error) {
    return json({ error: `本番編集が未設定です: ${error.message}` }, 501)
  }

  try {
    const paths = [...new Set(items.map((item) => item.file))]
    const sources = await github.readFiles(paths)
    const updated = {}

    for (const filePath of paths) {
      const forFile = items.filter((item) => item.file === filePath)
      updated[filePath] = filePath.endsWith('.yaml')
        ? applyYaml(sources[filePath], forFile, text)
        : applyTsx(sources[filePath], forFile, text)
    }

    const commit = await github.commitFiles(
      updated,
      `fix(copy): update slide text in ${slug}`
    )

    return json({ files: paths, commit })
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : String(error) }, 409)
  }
}

function applyTsx(source, items, text) {
  const edits = items.map((item) => {
    const range = resolveRange(source, { ...item, original: item.text })
    if (!range) {
      throw new Error(`「${item.text.slice(0, 20)}」が今のソースで特定できません。デプロイ直後かもしれません`)
    }
    return { ...item, ...range, original: item.text, text }
  })

  return patchTsxSource(source, edits)
}

function applyYaml(source, items, text) {
  const document = YAML.parseDocument(source)

  for (const item of items) {
    if (document.getIn(item.yamlPath) !== item.text) {
      throw new Error(`deck.yaml の ${item.component} が変更されています。ページを再読み込みしてください`)
    }
    document.setIn(item.yamlPath, text)
  }

  return document.toString({ lineWidth: 0 })
}

/** The copy index is a static asset of this same deployment. */
async function loadIndex(context, slug) {
  if (!/^[a-z0-9-]+$/.test(slug)) return null

  const url = new URL(context.request.url)
  url.pathname = `/deck-text/${slug}.json`
  url.search = ''

  const response = await context.env.ASSETS.fetch(new Request(url, { headers: { accept: 'application/json' } }))
  if (!response.ok) return null

  return response.json().catch(() => null)
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' }
  })
}
