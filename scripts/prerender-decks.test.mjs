import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  deckBody,
  escapeHtml,
  isIndexable,
  renderHead,
  renderRobots,
  renderRoot,
  renderSitemap,
  truncate
} from './prerender-decks.mjs'

const SHELL = `<!doctype html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="description"
      content="generic"
    />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="Ebisuda Presentations" />
    <title>Ebisuda Presentations</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`

const deck = {
  slug: 'demo',
  title: 'A <b>deck</b>',
  summary: 'Summary & more',
  status: 'public',
  updatedAt: '2026-09-26',
  slides: [
    { id: 'a', title: 'First', notes: 'Spoken "notes"' },
    { id: 'b', title: 'Second' }
  ]
}

test('escapeHtml escapes markup and quotes', () => {
  assert.equal(escapeHtml(`<a href="x">'&'</a>`), '&lt;a href=&quot;x&quot;&gt;&#39;&amp;&#39;&lt;/a&gt;')
})

test('truncate collapses whitespace and caps length', () => {
  assert.equal(truncate('a\n  b', 10), 'a b')
  assert.equal(truncate('abcdef', 4), 'abc…')
})

test('only public decks are indexable', () => {
  assert.equal(isIndexable(deck), true)
  for (const status of ['draft', 'unlisted', 'private']) {
    assert.equal(isIndexable({ ...deck, status }), false)
  }
})

test('renderHead replaces generic tags with page-specific ones', () => {
  const html = renderHead(SHELL, {
    title: 'T',
    description: 'D',
    url: 'https://example.test/decks/demo',
    image: 'https://example.test/i.png',
    type: 'article',
    indexable: true
  })
  assert.equal((html.match(/<title>/g) ?? []).length, 1)
  assert.match(html, /<title>T<\/title>/)
  assert.doesNotMatch(html, /generic/)
  assert.doesNotMatch(html, /og:type" content="website"/)
  assert.match(html, /<link rel="canonical" href="https:\/\/example.test\/decks\/demo" \/>/)
  assert.doesNotMatch(html, /noindex/)
})

test('renderHead marks non-indexable pages noindex', () => {
  const html = renderHead(SHELL, {
    title: 'T', description: '', url: 'u', image: 'i', type: 'article', indexable: false
  })
  assert.match(html, /<meta name="robots" content="noindex" \/>/)
})

test('renderHead fails loudly when the shell changes shape', () => {
  assert.throws(() => renderHead('<html><head></head></html>', {
    title: 'T', description: '', url: 'u', image: 'i', type: 'article', indexable: true
  }))
})

test('deckBody carries escaped titles and notes', () => {
  const body = deckBody(deck)
  assert.match(body, /<h1>A &lt;b&gt;deck&lt;\/b&gt;<\/h1>/)
  assert.match(body, /<h2>First<\/h2><p>Spoken &quot;notes&quot;<\/p>/)
  assert.match(body, /<h2>Second<\/h2><\/section>/)
})

test('renderRoot fills #root', () => {
  assert.match(renderRoot(SHELL, '<p>x</p>'), /<div id="root"><p>x<\/p><\/div>/)
  assert.throws(() => renderRoot('<div id="app"></div>', 'x'))
})

test('sitemap and robots point at the configured origin', () => {
  const sitemap = renderSitemap([deck])
  assert.match(sitemap, /<loc>https:\/\/[^<]+\/decks\/demo<\/loc><lastmod>2026-09-26<\/lastmod>/)
  assert.match(renderRobots(), /^Sitemap: https:\/\/[^\n]+\/sitemap\.xml$/m)
})
