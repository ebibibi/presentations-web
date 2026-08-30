/**
 * The published site only offers the local-editor link to the owner, and that
 * UI is mounted outside the React tree. It used to be decided once at load, so
 * signing in from the header left the owner with no editing affordance until
 * they reloaded by hand. This pins both halves: hidden for a visitor, and
 * present the moment the sign-in state says owner.
 *
 * Sign-in itself goes through Google, which headless Chromium cannot complete,
 * so the check drives the same `deck-owner-change` event that App dispatches.
 */
import { createReadStream } from 'node:fs'
import { readFile } from 'node:fs/promises'
import http from 'node:http'
import { extname, join, normalize } from 'node:path'
import { chromium } from '@playwright/test'

const port = 5183
const baseUrl = `http://127.0.0.1:${port}`
const root = join(process.cwd(), 'dist')
const editorUi = '[data-local-editor-ui="root"]'
const contentTypes = new Map([
  ['.html', 'text/html; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.css', 'text/css; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.svg', 'image/svg+xml'],
  ['.png', 'image/png'],
  ['.jpg', 'image/jpeg']
])

// The visitor case: no session, and no commit backend behind the site.
const server = http.createServer(async (request, response) => {
  if (!request.url) {
    response.writeHead(400).end()
    return
  }

  const url = new URL(request.url, baseUrl)

  if (url.pathname === '/api/auth/config') {
    sendJson(response, { enabled: true, googleClientId: 'local-editor-link-check' })
    return
  }

  if (url.pathname === '/api/auth/session') {
    sendJson(response, { authenticated: false, canRecord: false })
    return
  }

  if (url.pathname === '/api/deck-text/patch') {
    sendJson(response, { configured: false })
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
  const page = await browser.newPage()
  await page.goto(baseUrl, { waitUntil: 'networkidle' })

  if (await page.locator(editorUi).count()) {
    throw new Error('A signed-out visitor was offered the local editor link')
  }

  await announceOwner(page, true)
  await page.locator(editorUi).waitFor({ timeout: 5000 })

  const href = await page.locator(`${editorUi} a`).first().getAttribute('href')

  if (!href?.startsWith('http://')) {
    throw new Error(`The editor link did not point at a local server: ${href}`)
  }

  await announceOwner(page, false)
  await page.locator(editorUi).waitFor({ state: 'detached', timeout: 5000 })

  await browser.close()

  console.log('Owner editor link check passed.')
  console.log(`Link after sign-in: ${href}`)
} finally {
  server.close()
}

function announceOwner(page, canRecord) {
  return page.evaluate(
    (detail) => window.dispatchEvent(new CustomEvent('deck-owner-change', { detail })),
    canRecord
  )
}

function sendJson(response, body) {
  response.setHeader('content-type', 'application/json; charset=utf-8')
  response.end(JSON.stringify(body))
}
