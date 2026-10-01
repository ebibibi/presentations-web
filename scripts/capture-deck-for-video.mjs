// Capture every slide of a deck for video editing (run after `npm run build`):
//   node scripts/capture-deck-for-video.mjs <slug> <output dir>
// Writes stills/slide_NN.png (finished slide, 1280x1080), video/session.webm (one continuous
// 1920x1080 capture of the recording surface, slide at x 0-1280) and capture.json (per slide:
// id, title, notes, animation length, and the second its entrance starts in the video).
// Draft decks are included because the local server answers as a signed-in owner.
import { chromium } from '@playwright/test'
import { mkdir, writeFile, readdir, rename, readFile } from 'node:fs/promises'
import { parse } from 'yaml'
import { startStaticSite } from './static-site-server.mjs'
const [slug, out] = process.argv.slice(2)
if (!slug || !out) {
  console.error('usage: capture-deck-for-video.mjs <slug> <output dir>')
  process.exit(2)
}
await mkdir(`${out}/stills`, { recursive: true })
const site = await startStaticSite({ port: 5198, session: { authenticated: true, canRecord: true, user: { email: 'ebibibi@gmail.com', name: 'capture' } } })
// Without an explicit window size the fullscreen recording surface is captured at 800x600.
const browser = await chromium.launch({ args: ['--window-size=1920,1080'] })
const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 }, recordVideo: { dir: `${out}/video`, size: { width: 1920, height: 1080 } } })
const page = await ctx.newPage()
const t0 = Date.now()
await page.goto(`${site.baseUrl}/decks/${slug}/studio`)
await page.getByRole('button', { name: '全画面撮影' }).click()
await page.locator('.recording-slide-frame').waitFor({ timeout: 10000 })
const total = Number((await page.locator('.recording-notes-count').innerText()).split('/')[1].trim())
const meta = parse(await readFile(`content/decks/${slug}/deck.yaml`, 'utf8'))
const log = []
for (let i = 1; i <= total; i++) {
  const enter = (Date.now() - t0) / 1000
  await page.keyboard.press('ArrowRight')
  await page.locator('.recording-notes-count').filter({ hasText: `${i} / ${total}` }).waitFor({ timeout: 30000 })
  const settled = (Date.now() - t0) / 1000
  const animSeconds = (meta.slides[i - 1]?.durationInFrames ?? 240) / 30
  await page.waitForTimeout(animSeconds * 1000 + 1500)
  const file = `stills/slide_${String(i).padStart(2, '0')}.png`
  await page.locator('.recording-slide-frame').screenshot({ path: `${out}/${file}` })
  log.push({ index: i, id: meta.slides[i - 1]?.id, title: meta.slides[i - 1]?.title, notes: meta.slides[i - 1]?.notes, pressed_at: enter, settled_at: settled, animation_seconds: animSeconds, still: file })
}
await ctx.close()
await browser.close()
site.close()
const vids = await readdir(`${out}/video`)
await rename(`${out}/video/${vids[0]}`, `${out}/video/session.webm`)
await writeFile(`${out}/capture.json`, JSON.stringify({ slug, total, video: 'video/session.webm', video_crop_slide: { x: 0, y: 0, w: 1280, h: 1080 }, slides: log }, null, 1))
console.log(`captured ${total} slides`)
process.exit(0)
