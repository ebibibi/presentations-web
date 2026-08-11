import { createReadStream } from 'node:fs'
import { mkdir, readFile } from 'node:fs/promises'
import http from 'node:http'
import { extname, join, normalize } from 'node:path'
import { chromium } from '@playwright/test'

const port = 5182
const baseUrl = `http://127.0.0.1:${port}`
const deckSlug = process.env.DECK_SLUG || process.argv[2] || 'platform-introduction'
const deckPath = `/decks/${deckSlug}/studio`
const outputPath = `tmp/recording-surface-${deckSlug}.png`
const slideOutputPrefix = `tmp/recording-surface-${deckSlug}-slide`
const root = join(process.cwd(), 'dist')
const contentTypes = new Map([
  ['.html', 'text/html; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.css', 'text/css; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.svg', 'image/svg+xml'],
  ['.png', 'image/png'],
  ['.jpg', 'image/jpeg']
])

await mkdir('tmp', { recursive: true })

const server = http.createServer(async (request, response) => {
  if (!request.url) {
    response.writeHead(400).end()
    return
  }

  const url = new URL(request.url, baseUrl)

  if (url.pathname === '/api/auth/config') {
    sendJson(response, { enabled: true, googleClientId: 'local-recording-check' })
    return
  }

  if (url.pathname === '/api/auth/session') {
    sendJson(response, {
      authenticated: true,
      canRecord: true,
      user: {
        email: 'ebibibi@gmail.com',
        name: 'Recording check'
      }
    })
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
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } })
  await page.goto(`${baseUrl}${deckPath}`)
  await page
    .locator('.recording-surface [data-studio-bookend="hook"]')
    .waitFor({ timeout: 5000 })
  await assertVisibleBookend(page, 'hook')
  await page.getByRole('button', { name: '撮影再生' }).click()
  await page.waitForTimeout(400)
  await page.keyboard.press('Home')
  await assertVisibleBookend(page, 'hook')
  await page.waitForTimeout(5200)
  await assertVisibleBookend(page, 'hook')
  await page.waitForTimeout(800)
  const hookScreenshot = `tmp/recording-surface-${deckSlug}-hook.png`
  await page.screenshot({ path: hookScreenshot })
  await page.reload()
  await page.getByRole('button', { name: '全画面撮影' }).click()
  await page.waitForFunction(() =>
    document.fullscreenElement?.classList.contains('recording-surface')
  )
  await page
    .locator('.recording-surface [data-studio-bookend="hook"]')
    .waitFor({ timeout: 5000 })
  await assertVisibleBookend(page, 'hook')

  const boxes = await page.evaluate(() => {
    const surface = document.querySelector('.recording-surface')?.getBoundingClientRect()
    const slide = document.querySelector('.recording-slide-frame')?.getBoundingClientRect()
    const reserved = document
      .querySelector('.recording-reserved-area')
      ?.getBoundingClientRect()

    return {
      surface: toBox(surface),
      slide: toBox(slide),
      reserved: toBox(reserved)
    }

    function toBox(rect) {
      if (!rect) {
        return null
      }

      return {
        x: Math.round(rect.x),
        y: Math.round(rect.y),
        width: Math.round(rect.width),
        height: Math.round(rect.height)
      }
    }
  })

  assertBox(boxes.surface, { x: 0, y: 0, width: 1920, height: 1080 }, 'surface')
  assertBox(boxes.slide, { x: 0, y: 0, width: 1280, height: 1080 }, 'slide')
  assertBox(boxes.reserved, { x: 1280, y: 0, width: 640, height: 1080 }, 'reserved')

  await page.screenshot({ path: outputPath })
  const totalSlides = await getTotalSlides(page)
  await page.keyboard.press('ArrowRight')
  await page
    .locator('.recording-notes-count')
    .filter({ hasText: `1 / ${totalSlides}` })
    .waitFor({ timeout: 30000 })
  await page.waitForTimeout(400)
  const slideScreenshots = [`${slideOutputPrefix}-1.png`]
  await page.screenshot({ path: slideScreenshots[0] })

  for (let index = 2; index <= totalSlides; index += 1) {
    await page.keyboard.press('ArrowRight')
    // goToSlide plays the whole entrance at native speed before committing the
    // new index, so wait for the counter instead of guessing a duration —
    // a fixed sleep captures a half-animated slide and hides layout problems.
    await page
      .locator('.recording-notes-count')
      .filter({ hasText: `${index} / ${totalSlides}` })
      .waitFor({ timeout: 30000 })
    await page.waitForTimeout(400)
    const path = `${slideOutputPrefix}-${index}.png`
    await page.screenshot({ path })
    slideScreenshots.push(path)
  }

  await page.keyboard.press('ArrowRight')
  await page
    .locator('.recording-surface [data-studio-bookend="signoff"]')
    .waitFor({ timeout: 5000 })
  await assertVisibleBookend(page, 'signoff')
  await page.waitForTimeout(6200)
  await assertVisibleBookend(page, 'signoff')
  await page.waitForTimeout(800)
  const signoffScreenshot = `tmp/recording-surface-${deckSlug}-signoff.png`
  await page.screenshot({ path: signoffScreenshot })

  const audiencePage = await browser.newPage({ viewport: { width: 1280, height: 900 } })
  await audiencePage.goto(`${baseUrl}/decks/${deckSlug}`)
  const publicBookendCount = await audiencePage.locator('[data-studio-bookend]').count()

  if (publicBookendCount !== 0) {
    throw new Error(`Audience mode rendered ${publicBookendCount} studio bookend(s)`)
  }

  await audiencePage.close()

  await browser.close()

  console.log('Recording surface check passed.')
  console.log(JSON.stringify(boxes, null, 2))
  console.log(`Screenshot: ${outputPath}`)
  console.log(`Slide screenshots: ${slideScreenshots.join(', ')}`)
  console.log(`Hook screenshot: ${hookScreenshot}`)
  console.log(`Sign-off screenshot: ${signoffScreenshot}`)
} finally {
  server.close()
}

function sendJson(response, body) {
  response.setHeader('content-type', 'application/json; charset=utf-8')
  response.end(JSON.stringify(body))
}

function assertBox(actual, expected, label) {
  if (!actual) {
    throw new Error(`${label} box was not found`)
  }

  for (const [key, value] of Object.entries(expected)) {
    if (actual[key] !== value) {
      throw new Error(
        `${label}.${key} expected ${value}, received ${actual[key]} (${JSON.stringify(actual)})`
      )
    }
  }
}

async function assertVisibleBookend(page, kind) {
  await page.waitForFunction((bookendKind) => {
    const element = document.querySelector(`[data-studio-bookend="${bookendKind}"]`)
    if (!element) {
      return false
    }

    return Number.parseFloat(window.getComputedStyle(element).opacity) >= 0.9
  }, kind)
}

async function getTotalSlides(page) {
  const text = await page.locator('.viewer-footer span').textContent()
  const total = Number.parseInt(text?.split('/').at(1)?.trim() || '', 10)
  return Number.isFinite(total) ? total : 1
}
