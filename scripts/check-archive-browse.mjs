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

// Dated inside the archive, not at either end: appending it to the list would
// be visible, and so would sorting only one half of it.
const privateDeckFixture = {
  meta: {
    slug: 'order-check-private-deck',
    title: 'Order check private deck',
    summary: 'Fixture deck used by the archive order check.',
    status: 'private',
    visibility: 'private',
    createdAt: '2026-08-20',
    updatedAt: '2026-08-20',
    tags: ['security'],
    slides: [{ id: 'opening', title: 'Order check' }]
  },
  visualSlides: [{ layout: 'title', title: 'Order check' }]
}

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

// The owner sees private decks too, and those arrive from an API after the page
// has rendered. They used to be appended to the end of the already-sorted public
// decks, which put an old deck under a repeated month heading at the bottom of
// the list: "newest first" has to hold for the merged timeline.
const ownerSite = await startStaticSite({
  port: port + 1,
  clientId: 'local-archive-browse-owner-check',
  session: { authenticated: true, canRecord: true, email: 'owner@example.test' },
  privateDecks: [privateDeckFixture]
})

try {
  const browser = await chromium.launch()
  const context = await browser.newContext({ viewport })
  await context.route('https://accounts.google.com/**', (route) => route.abort())

  const page = await context.newPage()
  await page.goto(ownerSite.baseUrl)
  await page.locator(`.row-title:text-is("${privateDeckFixture.meta.title}")`).waitFor({
    state: 'attached',
    timeout: 10000
  })

  const dates = await page.locator('.row-date').allTextContents()
  assert(
    dates.join('|') === [...dates].sort().reverse().join('|'),
    `the owner's decks are not newest-first: ${dates.join(', ')}`
  )

  const ownerMonths = await page.locator('.month-heading span:first-child').allTextContents()
  assert(
    new Set(ownerMonths).size === ownerMonths.length,
    `a month heading is repeated for the owner: ${ownerMonths.join(', ')}`
  )

  await context.close()
  await browser.close()

  console.log('Archive owner order check passed.')
  console.log(JSON.stringify({ decks: dates.length, months: ownerMonths }, null, 2))
} finally {
  ownerSite.close()
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
