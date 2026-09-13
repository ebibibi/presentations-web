import { chromium } from '@playwright/test'
import { startStaticSite } from './static-site-server.mjs'

// Guards the archive's browsing tools. The list used to be a single column of
// full-width cards: 25 decks meant 25 screens of scrolling with no way to ask
// "the Azure ones" or "what shipped in August". Each of these is measured in a
// browser because every one of them can be broken by a CSS change alone.
const port = 5185
const viewport = { width: 1512, height: 860 }
// The list view exists to answer "what is here?" without scrolling.
const minimumRowsInView = 8

const site = await startStaticSite({ port, clientId: 'local-archive-browse-check' })

try {
  const browser = await chromium.launch()
  const context = await browser.newContext({ viewport })
  await context.route('https://accounts.google.com/**', (route) => route.abort())

  const page = await context.newPage()
  await page.goto(site.baseUrl)
  await page.locator('.deck-row').first().waitFor({ state: 'visible', timeout: 10000 })

  const listed = await page.locator('.deck-row').count()
  const rowsInView = await page.evaluate(
    () =>
      [...document.querySelectorAll('.deck-row')].filter(
        (row) => row.getBoundingClientRect().bottom <= window.innerHeight
      ).length
  )
  assert(
    rowsInView >= Math.min(minimumRowsInView, listed),
    `only ${rowsInView} of ${listed} decks fit the first screen in list view, expected ${minimumRowsInView}`
  )

  const months = await page.locator('.month-heading span:first-child').allTextContents()
  assert(months.length > 0, 'the archive shows no month headings')
  assert(
    new Set(months).size === months.length,
    `a month heading is repeated, so the list is not grouped: ${months.join(', ')}`
  )
  const monthKeys = months.map(toMonthKey)
  assert(
    monthKeys.join('|') === [...monthKeys].sort().reverse().join('|'),
    `month headings are not newest-first: ${months.join(', ')}`
  )

  const grouped = await page
    .locator('.month-count')
    .allTextContents()
    .then((counts) => counts.reduce((total, count) => total + Number(count), 0))
  assert(
    grouped === listed,
    `month headings count ${grouped} decks but the list renders ${listed}`
  )

  // A category chip has to narrow the list to exactly what it advertises.
  const chips = page.locator('.category-chip')
  const chipCount = await chips.count()
  assert(chipCount >= 3, `expected several category chips, found ${chipCount}`)

  const perCategory = []

  for (let index = 1; index < chipCount; index += 1) {
    const chip = chips.nth(index)
    const label = ((await chip.textContent()) ?? '').replace(/\d+$/, '').trim()
    const advertised = Number(await chip.locator('.category-count').textContent())
    await chip.click()
    await page.waitForFunction(
      (expected) => document.querySelectorAll('.deck-row').length === expected,
      advertised,
      { timeout: 5000 }
    )
    const shown = await page.locator('.deck-row').count()
    assert(
      shown === advertised,
      `category "${label}" advertises ${advertised} decks but shows ${shown}`
    )
    perCategory.push({ label, decks: shown })
  }

  await chips.first().click()
  await page.waitForFunction(
    (expected) => document.querySelectorAll('.deck-row').length === expected,
    listed,
    { timeout: 5000 }
  )
  assert(
    perCategory.reduce((total, entry) => total + entry.decks, 0) === listed,
    'the categories do not partition the archive: a deck is filed twice or not at all'
  )

  // The card view is still reachable, and the choice survives a reload.
  await page.locator('.view-switch button[data-view="cards"]').click()
  await page.locator('.deck-card').first().waitFor({ state: 'visible', timeout: 5000 })
  await page.reload()
  await page.locator('.deck-card').first().waitFor({ state: 'visible', timeout: 10000 })
  assert(
    (await page.locator('.deck-row').count()) === 0,
    'the remembered card view still renders list rows'
  )

  await context.close()
  await browser.close()

  console.log('Archive browse check passed.')
  console.log(JSON.stringify({ listed, rowsInView, months, perCategory }, null, 2))
} finally {
  site.close()
}

function toMonthKey(label) {
  const match = label.match(/^(\d{4})年(\d{1,2})月$/)
  return match ? `${match[1]}-${match[2].padStart(2, '0')}` : label
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message)
  }
}
