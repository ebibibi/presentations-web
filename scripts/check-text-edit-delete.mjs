/**
 * Guards deleting slide copy from the browser.
 *
 * Emptying the box is how a human says "this should not be here". The editor
 * has to turn that into a delete of the construct that holds the copy — a
 * bullet, a `<p>` — rather than saving an empty string that leaves the element
 * (and its padding, border and marker) on the slide.
 *
 * The stub server below claims an owner session and a configured commit
 * backend, and captures the save instead of performing it: what this proves is
 * that the UI asks for a deletion. Whether the deletion itself is correct is
 * `npm run check:text` (`--deep` for every string in every deck).
 */
import { createReadStream } from 'node:fs'
import { readFile } from 'node:fs/promises'
import http from 'node:http'
import { extname, join, normalize } from 'node:path'
import { chromium } from '@playwright/test'

const port = 5186
const baseUrl = `http://127.0.0.1:${port}`
const root = join(process.cwd(), 'dist')
const deckSlug = process.env.DECK_SLUG ?? 'ntlm-retirement-faq'
const slidesToTry = 8
const saves = []
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
    sendJson(response, { enabled: true, googleClientId: 'text-edit-delete-check' })
    return
  }

  if (url.pathname === '/api/auth/session') {
    sendJson(response, { authenticated: true, canRecord: true })
    return
  }

  if (url.pathname === '/api/deck-text/patch') {
    if (request.method !== 'POST') {
      sendJson(response, { configured: true })
      return
    }
    saves.push(JSON.parse(await readBody(request)))
    sendJson(response, { files: ['content/decks/x/slides.tsx'], commit: { shortSha: 'abc1234', branch: 'main' } })
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
  const context = await browser.newContext({ viewport: { width: 1400, height: 950 } })
  await context.route('https://accounts.google.com/**', (route) => route.abort())

  const page = await context.newPage()
  const panel = page.locator('[data-deck-text-ui="panel"]')
  const input = panel.locator('textarea')
  const hint = page.locator('[data-deck-text-ui="hint"]')
  const saveButton = page.locator('[data-deck-text-ui="save"]')

  let opened = null

  // The editor is switched on once and the deck is walked with the arrow keys:
  // re-visiting the page with a different hash would not reload it, and the
  // second toggle click would quietly switch the editor back off.
  await page.goto(`${baseUrl}/decks/${deckSlug}`, { waitUntil: 'networkidle' })
  await page.locator('.viewer-footer span').waitFor({ timeout: 15000 })
  await page.locator('[data-deck-text-ui="toggle"]').click()

  for (let slide = 1; slide <= slidesToTry && !opened; slide += 1) {
    // Let the entrance animation settle so the copy is where it is clicked.
    await page.waitForTimeout(2500)

    for (const copy of await page.locator('.remotion-slide li, .remotion-slide p').all()) {
      const text = (await copy.textContent())?.trim() ?? ''
      if (text.length < 4) continue

      await copy.click({ force: true })
      // Resolving the copy back to source is a fetch, so the panel arrives a
      // beat after the click — and never at all for copy the index does not
      // know (a shared component, or generated text).
      const shown = await input
        .waitFor({ timeout: 5000 })
        .then(() => true)
        .catch(() => false)
      if (!shown) continue

      if (await page.locator('[data-deck-text-ui="delete"]').count()) {
        opened = { slide, text: await input.inputValue() }
        break
      }

      await page.keyboard.press('Escape')
    }

    if (!opened) await page.keyboard.press('ArrowRight')
  }

  assert(
    opened,
    `${deckSlug} の最初の ${slidesToTry} 枚に、要素ごと削除できる文言が1つもありませんでした`
  )

  const offered = (await hint.textContent()) ?? ''
  assert(
    offered.includes('削除します'),
    `削除できる文言なのに案内が「${offered.trim()}」でした`
  )

  // Clearing the box is the whole point: the primary button has to become the
  // delete, not a save that writes an empty string.
  await input.fill('')
  const label = ((await saveButton.textContent()) ?? '').trim()
  assert(label.startsWith('削除'), `本文を空にしても主ボタンが「${label}」のままでした`)
  assert(await saveButton.isEnabled(), '本文を空にすると主ボタンが押せなくなりました')

  await saveButton.click()
  await page.locator('[data-deck-text-ui="status"]').waitFor({ timeout: 15000 })
  const status = ((await page.locator('[data-deck-text-ui="status"]').textContent()) ?? '').trim()

  assert(saves.length === 1, `保存リクエストが ${saves.length} 件でした（1件のはず）`)
  assert(saves[0].remove === true, '削除ではなく通常の保存として送信されました')
  assert(saves[0].slug === deckSlug, `別のデッキに送信されました: ${saves[0].slug}`)
  assert(saves[0].ids?.length >= 1, '削除対象のidが送信されていません')
  assert(status.startsWith('削除しました'), `結果表示が「${status}」でした`)
  assert(!(await panel.isVisible()), '削除後も編集パネルが開いたままでした')

  await browser.close()

  console.log('Text edit delete check passed.')
  console.log(JSON.stringify({ deck: deckSlug, ...opened, request: saves[0], status }, null, 2))
} finally {
  server.close()
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    let body = ''
    request.on('data', (chunk) => {
      body += chunk
    })
    request.on('end', () => resolve(body))
    request.on('error', reject)
  })
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
