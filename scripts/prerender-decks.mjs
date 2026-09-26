#!/usr/bin/env node
/**
 * Writes a crawlable HTML page for every deck, plus sitemap.xml and robots.txt.
 *
 * The site is a single-page app: without this step every URL returns the same
 * empty shell with the same title, so search engines see one blank page many
 * times over. Runs after `vite build` and derives each page from the built
 * dist/index.html, so the bundle, styles and scripts stay exactly the ones the
 * SPA ships.
 *
 * Each deck becomes dist/decks/<slug>.html, which Cloudflare Pages serves at
 * /decks/<slug>. The page carries the deck's own title, description, canonical
 * and Open Graph tags, and its outline (slide titles and speaker notes) inside
 * #root. React replaces that markup on mount; the same notes are what the
 * studio view shows, so the crawlable text is the deck's own content.
 *
 * Only `status: public` decks are indexable and listed in the sitemap. Every
 * other status gets a generic page marked noindex, so a draft's title is not
 * announced before it is released.
 */
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import YAML from 'yaml'
import { SITE_NAME, SITE_ORIGIN } from '../site.config.mjs'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const decksDir = path.join(repoRoot, 'content', 'decks')
const distDir = path.join(repoRoot, 'dist')
const DEFAULT_IMAGE = '/brand/ebi-logo.png'
const DESCRIPTION_LIMIT = 160

export function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

export function truncate(text, limit) {
  const flat = String(text).replace(/\s+/g, ' ').trim()
  return flat.length <= limit ? flat : `${flat.slice(0, limit - 1)}…`
}

export function isIndexable(meta) {
  return meta.status === 'public'
}

export function deckUrl(slug) {
  return `${SITE_ORIGIN}/decks/${encodeURIComponent(slug)}`
}

export function deckImage(meta) {
  if (meta.youtube?.id) return `https://i.ytimg.com/vi/${meta.youtube.id}/hqdefault.jpg`
  return `${SITE_ORIGIN}${meta.thumbnail ?? DEFAULT_IMAGE}`
}

/** Replaces the shell's generic head tags with page-specific ones. */
export function renderHead(shell, { title, description, url, image, type, indexable }) {
  const tags = [
    `<title>${escapeHtml(title)}</title>`,
    `<meta name="description" content="${escapeHtml(description)}" />`,
    `<link rel="canonical" href="${escapeHtml(url)}" />`,
    `<meta property="og:type" content="${type}" />`,
    `<meta property="og:site_name" content="${escapeHtml(SITE_NAME)}" />`,
    `<meta property="og:title" content="${escapeHtml(title)}" />`,
    `<meta property="og:description" content="${escapeHtml(description)}" />`,
    `<meta property="og:url" content="${escapeHtml(url)}" />`,
    `<meta property="og:image" content="${escapeHtml(image)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    ...(indexable ? [] : ['<meta name="robots" content="noindex" />'])
  ].join('\n    ')

  const stripped = shell
    .replace(/<title>[\s\S]*?<\/title>\s*/i, '')
    .replace(/<meta\s+name="description"[\s\S]*?\/>\s*/i, '')
    .replace(/<meta\s+property="og:[^"]+"[\s\S]*?\/>\s*/gi, '')

  if (stripped === shell || !stripped.includes('</head>')) {
    throw new Error('dist/index.html no longer has the head tags prerender-decks expects')
  }
  return stripped.replace('</head>', `    ${tags}\n  </head>`)
}

export function renderRoot(shell, body) {
  const marker = '<div id="root"></div>'
  if (!shell.includes(marker)) throw new Error(`dist/index.html has no ${marker}`)
  return shell.replace(marker, `<div id="root">${body}</div>`)
}

export function deckBody(meta) {
  const slides = meta.slides
    .map((slide) => {
      const notes = slide.notes ? `<p>${escapeHtml(slide.notes)}</p>` : ''
      return `<section><h2>${escapeHtml(slide.title)}</h2>${notes}</section>`
    })
    .join('')
  const video = meta.youtube?.url
    ? `<p><a href="${escapeHtml(meta.youtube.url)}">動画で見る</a></p>`
    : ''
  return (
    `<article><h1>${escapeHtml(meta.title)}</h1><p>${escapeHtml(meta.summary)}</p>${video}${slides}` +
    `<p><a href="/">${escapeHtml(SITE_NAME)} のトップへ</a></p></article>`
  )
}

export function homeBody(publicDecks) {
  const items = publicDecks
    .map(
      (meta) =>
        `<li><a href="/decks/${encodeURIComponent(meta.slug)}">${escapeHtml(meta.title)}</a>` +
        `<p>${escapeHtml(truncate(meta.summary, DESCRIPTION_LIMIT))}</p></li>`
    )
    .join('')
  return `<main><h1>${escapeHtml(SITE_NAME)}</h1><ul>${items}</ul></main>`
}

export function renderSitemap(publicDecks) {
  const urls = [
    `  <url><loc>${SITE_ORIGIN}/</loc></url>`,
    ...publicDecks.map(
      (meta) =>
        `  <url><loc>${escapeHtml(deckUrl(meta.slug))}</loc><lastmod>${escapeHtml(meta.updatedAt)}</lastmod></url>`
    )
  ]
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`
}

export function renderRobots() {
  return `User-agent: *\nDisallow: /api/\n\nSitemap: ${SITE_ORIGIN}/sitemap.xml\n`
}

function loadDecks() {
  return readdirSync(decksDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => YAML.parse(readFileSync(path.join(decksDir, entry.name, 'deck.yaml'), 'utf8')))
    .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))
}

function main() {
  const shell = readFileSync(path.join(distDir, 'index.html'), 'utf8')
  const decks = loadDecks()
  const publicDecks = decks.filter(isIndexable)

  mkdirSync(path.join(distDir, 'decks'), { recursive: true })
  for (const meta of decks) {
    const indexable = isIndexable(meta)
    const head = indexable
      ? {
          title: `${meta.title} | ${SITE_NAME}`,
          description: truncate(meta.summary, DESCRIPTION_LIMIT),
          image: deckImage(meta)
        }
      : { title: SITE_NAME, description: '', image: `${SITE_ORIGIN}${DEFAULT_IMAGE}` }
    const withHead = renderHead(shell, {
      ...head,
      url: deckUrl(meta.slug),
      type: 'article',
      indexable
    })
    const html = indexable ? renderRoot(withHead, deckBody(meta)) : withHead
    writeFileSync(path.join(distDir, 'decks', `${meta.slug}.html`), html)
  }

  const home = renderHead(shell, {
    title: SITE_NAME,
    description: '胡田昌彦の動画と連動した、Webブラウザで見るプレゼンテーション資料のアーカイブ',
    url: `${SITE_ORIGIN}/`,
    image: `${SITE_ORIGIN}${DEFAULT_IMAGE}`,
    type: 'website',
    indexable: true
  })
  writeFileSync(path.join(distDir, 'index.html'), renderRoot(home, homeBody(publicDecks)))
  writeFileSync(path.join(distDir, 'sitemap.xml'), renderSitemap(publicDecks))
  writeFileSync(path.join(distDir, 'robots.txt'), renderRobots())

  console.log(
    `prerender-decks: ${decks.length} deck pages (${publicDecks.length} indexable) for ${SITE_ORIGIN}`
  )
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main()
