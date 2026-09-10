/**
 * Owner-only endpoint for slide-level edits: duplicate, delete, reorder.
 *
 * Same shape as the copy editor's endpoint — production has no checkout, so the
 * registration entry and the component name come from the deck index published
 * with the build, and both files are re-read from GitHub and verified before
 * they are rewritten. Reordering only touches deck.yaml: the deck is assembled
 * by pairing ids, so the running order lives there alone.
 */
import { readSession } from '../../../shared/session.mjs'
import { createGitHubClient } from '../../../shared/github.mjs'
import {
  deleteSlideFromTsx,
  deleteSlideFromYaml,
  duplicateSlideInTsx,
  duplicateSlideInYaml,
  moveSlideInYaml,
  nextSlideId,
  slideIdsInYaml
} from '../../../shared/deck-slides.mjs'

const ACTIONS = ['duplicate', 'delete', 'move']

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

  const { slug, id, action, offset } = body ?? {}
  if (typeof slug !== 'string' || typeof id !== 'string' || !id) {
    return json({ error: 'slug / id が必要です' }, 400)
  }
  if (!ACTIONS.includes(action)) {
    return json({ error: `不明な操作です: ${action}` }, 400)
  }
  if (action === 'move' && offset !== -1 && offset !== 1) {
    return json({ error: '移動は前後1枚ずつです' }, 400)
  }

  const index = await loadIndex(context, slug)
  if (!index) {
    return json({ error: `デッキの索引が見つかりません: ${slug}` }, 404)
  }
  if (action !== 'move' && !index.slides) {
    return json({ error: 'このデッキはスライドをデータから生成しているので、この操作はできません' }, 409)
  }

  const slide = index.slides?.find((entry) => entry.id === id) ?? null
  if (action !== 'move' && !slide) {
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

  const tsxPath = `content/decks/${slug}/slides.tsx`
  const yamlPath = `content/decks/${slug}/deck.yaml`

  try {
    const sources = await github.readFiles(action === 'move' ? [yamlPath] : [tsxPath, yamlPath])
    const updated = {}

    if (action === 'move') {
      updated[yamlPath] = moveSlideInYaml(sources[yamlPath], id, offset)
    } else if (action === 'delete') {
      updated[tsxPath] = deleteSlideFromTsx(sources[tsxPath], slide)
      updated[yamlPath] = deleteSlideFromYaml(sources[yamlPath], id)
    } else {
      const newId = nextSlideId(slideIdsInYaml(sources[yamlPath]), id)
      updated[tsxPath] = duplicateSlideInTsx(
        sources[tsxPath],
        slide,
        newId,
        componentNameFor(sources[tsxPath], newId)
      )
      updated[yamlPath] = duplicateSlideInYaml(sources[yamlPath], id, newId)
    }

    const commit = await github.commitFiles(updated, commitMessage(action, id, slug))
    return json({ files: Object.keys(updated), commit })
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : String(error) }, 409)
  }
}

/** A component name that is free in this file: `opening-2` → `Opening2Slide`. */
function componentNameFor(source, id) {
  const stem = id
    .split(/[^A-Za-z0-9]+/)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join('')
  const base = `${stem || 'Copy'}Slide`
  let name = base

  for (let suffix = 2; new RegExp(`\\b${name}\\b`).test(source); suffix += 1) {
    name = `${base}${suffix}`
  }

  return name
}

function commitMessage(action, id, slug) {
  if (action === 'duplicate') return `feat(deck): duplicate slide ${id} in ${slug}`
  if (action === 'delete') return `fix(deck): remove slide ${id} from ${slug}`
  return `chore(deck): reorder slide ${id} in ${slug}`
}

async function loadIndex(context, slug) {
  if (!/^[a-z0-9-]+$/.test(slug)) return null

  const url = new URL(context.request.url)
  url.pathname = `/deck-text/${slug}.json`
  url.search = ''

  const response = await context.env.ASSETS.fetch(
    new Request(url, { headers: { accept: 'application/json' } })
  )
  if (!response.ok) return null

  return response.json().catch(() => null)
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' }
  })
}
