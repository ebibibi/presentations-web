/**
 * Guards the caret while slide copy is being edited.
 *
 * The deck viewer listens for the arrow keys on `window` to move between
 * slides. The click-to-edit panel is an ordinary textarea on the same page, so
 * pressing the right arrow to move the caret used to send the deck to the next
 * slide instead — and the panel was then anchored to copy no longer on screen.
 * Space had the same problem: typing one advanced a slide.
 *
 * The published site only mounts the editor for a signed-in owner with a commit
 * backend, so the stub server below claims both. Saving is never exercised; the
 * check is only about which element owns the keystroke.
 */
import { createReadStream } from 'node:fs'
import { readFile } from 'node:fs/promises'
import http from 'node:http'
import { extname, join, normalize } from 'node:path'
import { chromium } from '@playwright/test'

const port = 5185
const baseUrl = `http://127.0.0.1:${port}`
const root = join(process.cwd(), 'dist')
const deckSlug = process.env.DECK_SLUG ?? 'ntlm-retirement-faq'
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
    sendJson(response, { enabled: true, googleClientId: 'text-edit-keys-check' })
    return
  }

  if (url.pathname === '/api/auth/session') {
    sendJson(response, { authenticated: true, canRecord: true })
    return
  }

  if (url.pathname === '/api/deck-text/patch') {
    sendJson(response, { configured: true })
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
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } })
  await context.route('https://accounts.google.com/**', (route) => route.abort())

  const page = await context.newPage()
  await page.goto(`${baseUrl}/decks/${deckSlug}`, { waitUntil: 'networkidle' })

  const counter = page.locator('.viewer-footer span')
  await counter.waitFor({ timeout: 10000 })

  // Nothing focused: the arrow keys still have to move the deck, or this check
  // would pass just as happily on a viewer with no keyboard navigation at all.
  const start = await counter.textContent()
  await page.keyboard.press('ArrowRight')
  await page.waitForFunction(
    (previous) => document.querySelector('.viewer-footer span')?.textContent !== previous,
    start,
    { timeout: 5000 }
  )
  const afterNavigation = await counter.textContent()

  const toggle = page.locator('[data-deck-text-ui="toggle"]')
  await toggle.waitFor({ timeout: 10000 })
  await toggle.click()

  // Open the editor on a piece of copy that is actually on the slide.
  const copy = page.locator('.remotion-slide h1, .remotion-slide h2, .remotion-slide p').first()
  await copy.waitFor({ timeout: 10000 })
  await copy.click({ force: true })

  const input = page.locator('[data-deck-text-ui="panel"] textarea')
  await input.waitFor({ timeout: 10000 })
  await input.focus()

  const before = await input.inputValue()
  assert(before.length > 1, `The editor opened on "${before}", too short to move a caret inside`)

  await input.evaluate((element) => element.setSelectionRange(0, 0))
  await page.keyboard.press('ArrowRight')
  await page.keyboard.press('ArrowLeft')
  await page.keyboard.press('ArrowRight')
  await page.keyboard.type(' x')

  const caret = await input.evaluate((element) => element.selectionStart)
  const typed = await input.inputValue()
  const afterTyping = await counter.textContent()

  assert(
    afterNavigation !== start,
    `The arrow keys no longer move the deck at all (still on ${start})`
  )
  assert(
    afterTyping === afterNavigation,
    `Editing moved the deck from ${afterNavigation} to ${afterTyping}`
  )
  assert(
    await input.isVisible(),
    'The editor panel closed while its own textarea had focus'
  )
  assert(caret === 3, `The caret ended at ${caret} instead of 3 after one step plus " x"`)
  assert(
    typed === `${before.slice(0, 1)} x${before.slice(1)}`,
    `The typed text landed as "${typed}", not one character in`
  )

  await browser.close()

  console.log('Text edit key check passed.')
  console.log(
    JSON.stringify({ deck: deckSlug, start, afterNavigation, afterTyping, caret }, null, 2)
  )
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
