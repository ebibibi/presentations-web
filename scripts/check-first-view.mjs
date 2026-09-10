import { createReadStream } from 'node:fs'
import { readFile } from 'node:fs/promises'
import http from 'node:http'
import { extname, join, normalize } from 'node:path'
import { chromium } from '@playwright/test'

// Guards the first view of the archive: the hero used to be a full screen
// (min-height: 100vh), so a visitor saw a headline and had to scroll before
// learning that the site holds any decks at all. Measure it instead of
// eyeballing it — a padding change elsewhere can push the grid back down.
const port = 5184
const baseUrl = `http://127.0.0.1:${port}`
const root = join(process.cwd(), 'dist')
const viewports = [
  { width: 1512, height: 860, minCardsInView: 3 },
  { width: 1280, height: 800, minCardsInView: 3 },
  { width: 1366, height: 768, minCardsInView: 3 },
  { width: 390, height: 844, minCardsInView: 1 }
]
// The grid has to start inside the first screen with room to read a card.
const minimumGridHeadroom = 140
const contentTypes = new Map([
  ['.html', 'text/html; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.css', 'text/css; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.svg', 'image/svg+xml'],
  ['.png', 'image/png'],
  ['.jpg', 'image/jpeg']
])

const server = http.createServer(async (request, response) => {
  if (!request.url) {
    response.writeHead(400).end()
    return
  }

  const url = new URL(request.url, baseUrl)

  if (url.pathname === '/api/auth/config') {
    sendJson(response, { enabled: true, googleClientId: 'local-first-view-check' })
    return
  }

  if (url.pathname === '/api/auth/session') {
    sendJson(response, { authenticated: false, canRecord: false })
    return
  }

  const requestedPath = normalize(url.pathname).replace(/^\/+/, '')
  const filePath = join(root, requestedPath || 'index.html')

  try {
    await readFile(filePath)
    response.setHeader(
      'content-type',
      contentTypes.get(extname(filePath)) || 'application/octet-stream'
    )
    createReadStream(filePath).pipe(response)
  } catch {
    response.setHeader('content-type', 'text/html; charset=utf-8')
    createReadStream(join(root, 'index.html')).pipe(response)
  }
})

await new Promise((resolve) => server.listen(port, '127.0.0.1', resolve))

try {
  const browser = await chromium.launch()
  const results = []

  for (const viewport of viewports) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      isMobile: viewport.width < 700
    })
    await context.route('https://accounts.google.com/**', (route) => route.abort())

    const page = await context.newPage()
    await page.goto(baseUrl)
    await page.locator('.deck-card').first().waitFor({ state: 'visible', timeout: 10000 })

    const measured = await page.evaluate(() => {
      const grid = document.querySelector('.deck-grid')
      const cards = [...document.querySelectorAll('.deck-card')]
      const titles = cards.map((card) => card.querySelector('h2')?.textContent ?? '')
      const dates = cards.map((card) => card.querySelector('.card-date')?.textContent ?? '')

      return {
        gridTop: Math.round(grid.getBoundingClientRect().top),
        cardsInView: cards.filter((card) => card.getBoundingClientRect().top < window.innerHeight)
          .length,
        firstTitle: titles[0],
        dates
      }
    })

    assert(
      measured.gridTop <= viewport.height - minimumGridHeadroom,
      `${viewport.width}x${viewport.height}: the deck list starts at y=${measured.gridTop}, leaving less than ${minimumGridHeadroom}px of the first screen`
    )
    assert(
      measured.cardsInView >= viewport.minCardsInView,
      `${viewport.width}x${viewport.height}: only ${measured.cardsInView} deck card(s) reach the first screen, expected ${viewport.minCardsInView}`
    )

    const dates = measured.dates.filter(Boolean)
    assert(
      dates.length === measured.dates.length,
      `${viewport.width}x${viewport.height}: a deck card is missing its date`
    )
    const sorted = [...dates].sort().reverse()
    assert(
      dates.join('|') === sorted.join('|'),
      `${viewport.width}x${viewport.height}: decks are not newest-first: ${dates.join(', ')}`
    )

    results.push({ viewport: `${viewport.width}x${viewport.height}`, ...measured, dates: undefined })
    await context.close()
  }

  await browser.close()

  console.log('First view check passed.')
  console.log(JSON.stringify(results, null, 2))
} finally {
  server.close()
}

function sendJson(response, body) {
  response.setHeader('content-type', 'application/json; charset=utf-8')
  response.end(JSON.stringify(body))
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message)
  }
}
