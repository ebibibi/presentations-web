import { createReadStream } from 'node:fs'
import { readFile } from 'node:fs/promises'
import http from 'node:http'
import { extname, join, normalize } from 'node:path'
import { chromium } from '@playwright/test'

// Guards the mobile header: the sign-in control used to be hidden below 680px,
// which left phone users with no way to log in at all.
const port = 5183
const baseUrl = `http://127.0.0.1:${port}`
const root = join(process.cwd(), 'dist')
const widths = [1280, 680, 430, 390, 360, 320]
const minimumTapTarget = 40
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
    sendJson(response, { enabled: true, googleClientId: 'local-mobile-header-check' })
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

  for (const width of widths) {
    const context = await browser.newContext({
      viewport: { width, height: 800 },
      isMobile: width < 700
    })
    // Google Identity Services never renders for an unauthorized origin, so keep
    // the check offline and deterministic: we assert the slot, not Google's iframe.
    await context.route('https://accounts.google.com/**', (route) => route.abort())

    const page = await context.newPage()
    await page.goto(baseUrl)
    await page.locator('.auth-login').waitFor({ state: 'attached', timeout: 10000 })

    const measured = await page.evaluate(() => {
      const header = document.querySelector('.site-header')
      const login = document.querySelector('.auth-login')
      const rect = login.getBoundingClientRect()

      return {
        display: getComputedStyle(login).display,
        visibility: getComputedStyle(login).visibility,
        width: Math.round(rect.width),
        height: Math.round(rect.height),
        right: Math.round(rect.right),
        headerOverflow: header.scrollWidth - header.clientWidth,
        pageOverflow: document.documentElement.scrollWidth - window.innerWidth
      }
    })

    assert(
      measured.display !== 'none' && measured.visibility !== 'hidden',
      `${width}px: the sign-in control is hidden (display: ${measured.display})`
    )
    if (width < 700) {
      assert(
        measured.width >= minimumTapTarget && measured.height >= minimumTapTarget,
        `${width}px: the sign-in control is ${measured.width}x${measured.height}, smaller than the ${minimumTapTarget}px tap target`
      )
    }
    assert(
      measured.right <= width,
      `${width}px: the sign-in control overflows the viewport (right edge ${measured.right})`
    )
    assert(
      measured.headerOverflow <= 0 && measured.pageOverflow <= 0,
      `${width}px: the header overflows horizontally (header ${measured.headerOverflow}, page ${measured.pageOverflow})`
    )

    results.push({ viewport: width, ...measured })
    await context.close()
  }

  await browser.close()

  console.log('Mobile header check passed.')
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
