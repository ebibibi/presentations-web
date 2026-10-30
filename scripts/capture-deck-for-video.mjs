// Capture every slide of a deck for video editing (run after `npm run build`):
//   node scripts/capture-deck-for-video.mjs <slug> <output dir> [--clip-hold=<seconds>] [--no-clips]
// Writes stills/slide_NN.png (finished slide, 1280x1080), video/session.webm (one continuous
// 1920x1080 capture of the recording surface, slide at x 0-1280) and capture.json (per slide:
// id, title, notes, animation length, and the second its entrance starts in the video).
// It then writes clips/slide_NN.mp4: each slide's entrance followed by --clip-hold seconds
// (default 4) of the settled slide with the theme's ambient motion, rendered frame by frame
// (H.264, 30 fps, slide canvas size; frames are JPEG q95 because PNG of the grain is ~10x slower) so an editor can use moving slides instead of stills.
// Clips are frame-exact: the page runs with `?ambient=manual` and every frame is set through
// window.__deckCapture (src/DeckViewer.tsx) before it is screenshotted. Requires ffmpeg.
// Draft decks are included because the local server answers as a signed-in owner.
import { chromium } from '@playwright/test'
import { execFile } from 'node:child_process'
import { mkdir, writeFile, readdir, rename, readFile, rm } from 'node:fs/promises'
import { promisify } from 'node:util'
import { parse } from 'yaml'
import { startStaticSite } from './static-site-server.mjs'
const args = process.argv.slice(2)
const [slug, out] = args.filter((arg) => !arg.startsWith('--'))
const flag = (name) => args.find((arg) => arg === `--${name}` || arg.startsWith(`--${name}=`))
const clipHoldArg = flag('clip-hold')?.split('=')[1]
const clipHoldSeconds = clipHoldArg === undefined ? 4 : Number(clipHoldArg)
const withClips = !flag('no-clips')
if (!slug || !out || !Number.isFinite(clipHoldSeconds) || clipHoldSeconds < 0) {
  console.error('usage: capture-deck-for-video.mjs <slug> <output dir> [--clip-hold=<seconds>] [--no-clips]')
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
const vids = await readdir(`${out}/video`)
await rename(`${out}/video/${vids[0]}`, `${out}/video/session.webm`)

let clips = null
if (withClips) {
  clips = await captureClips()
}

await browser.close()
site.close()
await writeFile(`${out}/capture.json`, JSON.stringify({ slug, total, video: 'video/session.webm', video_crop_slide: { x: 0, y: 0, w: 1280, h: 1080 }, ...(clips ? { clips: clips.info } : {}), slides: log }, null, 1))
console.log(`captured ${total} slides${clips ? ` and ${total} clips` : ''}`)
process.exit(0)

// Second pass, frame by frame. Kept separate from the session pass so session.webm and the
// stills are produced exactly as before.
async function captureClips() {
  const fps = 30
  const holdFrames = Math.round(clipHoldSeconds * fps)
  const run = promisify(execFile)
  await mkdir(`${out}/clips`, { recursive: true })
  const clipCtx = await browser.newContext({ viewport: { width: 1920, height: 1080 } })
  const clipPage = await clipCtx.newPage()
  await clipPage.goto(`${site.baseUrl}/decks/${slug}/studio?ambient=manual`)
  await clipPage.getByRole('button', { name: '全画面撮影' }).click()
  const frameLocator = clipPage.locator('.recording-slide-frame')
  await frameLocator.waitFor({ timeout: 10000 })
  await clipPage.waitForFunction(() => Boolean(window.__deckCapture))
  const { settledFrames, slideStarts, theme } = await clipPage.evaluate(() => ({
    theme: window.__deckCapture.theme,
    slideStarts: window.__deckCapture.slideStarts,
    settledFrames: window.__deckCapture.settledFrames
  }))
  const box = await frameLocator.boundingBox()
  const clip = { x: Math.round(box.x), y: Math.round(box.y), width: Math.round(box.width), height: Math.round(box.height) }
  // Waits for React and the Remotion player to commit the frame that was just set.
  const show = (deckFrame, ambientFrame) =>
    clipPage.evaluate(
      ([frame, ambient]) =>
        new Promise((resolve) => {
          window.__deckCapture.setAmbientFrame(ambient)
          window.__deckCapture.seek(frame)
          requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
        }),
      [deckFrame, ambientFrame]
    )

  for (let i = 1; i <= total; i++) {
    // Navigate the normal way so the studio cue overlay is dismissed and the notes follow.
    await clipPage.keyboard.press('ArrowRight')
    await clipPage.waitForFunction((n) => window.location.hash === `#${n}`, i, { timeout: 30000 })
    const start = slideStarts[i - 1]
    const entranceFrames = settledFrames[i - 1] - start
    const frameDir = `${out}/clips/.frames_${String(i).padStart(2, '0')}`
    await mkdir(frameDir, { recursive: true })
    const totalFrames = entranceFrames + 1 + holdFrames
    for (let f = 0; f < totalFrames; f++) {
      const local = Math.min(f, entranceFrames)
      await show(start + local, f)
      await clipPage.screenshot({ path: `${frameDir}/f_${String(f).padStart(5, '0')}.jpg`, clip, type: 'jpeg', quality: 95 })
    }
    const file = `clips/slide_${String(i).padStart(2, '0')}.mp4`
    await run('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(fps), '-i', `${frameDir}/f_%05d.jpg`, '-c:v', 'libx264', '-preset', 'slow', '-crf', '16', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', `${out}/${file}`])
    await rm(frameDir, { recursive: true, force: true })
    Object.assign(log[i - 1], { clip: file, clip_frames: totalFrames, clip_entrance_frames: entranceFrames + 1, clip_seconds: totalFrames / fps })
    console.log(`clip ${i}/${total}: ${file} (${totalFrames} frames)`)
  }
  await clipCtx.close()
  return { info: { dir: 'clips', format: 'mp4 (H.264, yuv420p)', fps, width: clip.width, height: clip.height, hold_seconds: clipHoldSeconds, theme } }
}
