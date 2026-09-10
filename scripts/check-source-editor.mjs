#!/usr/bin/env node
/**
 * Guards the escape hatch in the browser, not just on the server.
 *
 * `npm run check:source` proves the rules — a one-character string stays
 * editable, a whole-file save is refused unless it parses and unless the file
 * is still the one the panel was opened on. What it cannot prove is that the
 * panel is reachable: the button, the fetch and the file it shows are wiring,
 * and wiring is what silently comes loose.
 *
 * So this drives a real dev server with a real browser. Nothing is written: the
 * one save it attempts is a broken one, which has to be refused with the file
 * on disk untouched.
 */
import { spawn } from 'node:child_process'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from '@playwright/test'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const port = 5187
const baseUrl = `http://127.0.0.1:${port}`
const slug = process.env.DECK_SLUG ?? 'ntlm-retirement-faq'
const slidesPath = path.join(repoRoot, 'content', 'decks', slug, 'slides.tsx')
const failures = []

function check(name, condition, detail = '') {
  if (!condition) failures.push(`${name}${detail ? `: ${detail}` : ''}`)
}

// Output is discarded rather than piped: nothing here reads it, and a pipe
// nobody drains eventually blocks the dev server mid-run.
const server = spawn(
  path.join(repoRoot, 'node_modules', '.bin', 'vite'),
  ['--port', String(port), '--strictPort', '--host', '127.0.0.1'],
  { cwd: repoRoot, stdio: 'ignore' }
)

async function waitForServer() {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const response = await fetch(baseUrl)
      if (response.ok) return
    } catch {
      // not up yet
    }
    await new Promise((resolve) => setTimeout(resolve, 500))
  }
  throw new Error(`dev server did not start on ${port}`)
}

let browser = null

try {
  await waitForServer()

  const onDisk = readFileSync(slidesPath, 'utf8')
  browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } })
  // A save must never be able to commit from a check run.
  await page.addInitScript(() => window.localStorage.setItem('deck-text-publish', 'off'))

  await page.goto(`${baseUrl}/decks/${slug}`, { waitUntil: 'networkidle' })
  await page.click('[data-deck-text-ui="toggle"]')
  await page.click('[data-deck-text-ui="open-source"]')
  await page.waitForSelector('[data-deck-text-ui="source"]')

  const shown = await page.inputValue('[data-deck-text-ui="source"] textarea')
  check('the panel shows the file as it is on disk', shown === onDisk)

  const tabs = await page.$$eval('[data-deck-text-ui="source"] button', (nodes) =>
    nodes.map((node) => node.textContent.trim())
  )
  check('both deck files are offered', tabs.includes('slides.tsx') && tabs.includes('deck.yaml'), tabs.join(','))

  await page.fill(
    '[data-deck-text-ui="source"] textarea',
    // Anchored so the mutation lands on a real statement, not the word
    // "import" inside the file's header comment.
    shown.replace(/^import /m, 'import <<< ')
  )
  await page.click('[data-deck-text-ui="save-source"]')
  await page.waitForSelector('[data-deck-text-ui="status"]')
  const message = await page.textContent('[data-deck-text-ui="status"]')

  check('a save that would not parse is refused', message.includes('構文エラー'), message.slice(0, 80))
  check('the refused save left the file alone', readFileSync(slidesPath, 'utf8') === onDisk)

  await page.keyboard.press('Escape')
  await page.waitForTimeout(300)
  check('Escape closes the panel', (await page.locator('[data-deck-text-ui="source"]').count()) === 0)
} finally {
  await browser?.close()
  server.kill('SIGTERM')
}

if (failures.length) {
  console.error('Source editor check failed:')
  for (const failure of failures) console.error(`  - ${failure}`)
  process.exit(1)
}

console.log(`Source editor check passed (${slug}: panel reachable, broken save refused).`)
