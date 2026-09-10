// Deck YAML is parsed in the browser at runtime, so a malformed deck.yaml
// sails through `tsc -b && vite build` and only shows up as a blank deck.
// Parse every deck here so the build fails instead.
import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { parse } from 'yaml'
import { collectTsxSlideIds } from './deck-text-core.mjs'

const decksDir = join(process.cwd(), 'content', 'decks')
const required = ['slug', 'title', 'summary', 'status', 'createdAt', 'slides']
const problems = []

const entries = await readdir(decksDir, { withFileTypes: true })

for (const entry of entries) {
  if (!entry.isDirectory()) continue

  const path = join(decksDir, entry.name, 'deck.yaml')
  let deck

  try {
    deck = parse(await readFile(path, 'utf8'))
  } catch (error) {
    // A plain YAML scalar ends at ": ", so "実測: 83KB" inside notes silently
    // truncates the mapping. Point at that first since it is the usual cause.
    problems.push(
      `${entry.name}/deck.yaml failed to parse: ${error.message}\n` +
        '    If a notes/summary value contains ": ", replace it with "：" or quote the value.'
    )
    continue
  }

  for (const key of required) {
    if (deck?.[key] === undefined) {
      problems.push(`${entry.name}/deck.yaml is missing "${key}"`)
    }
  }

  // The archive is ordered by these dates, so a malformed one does not throw an
  // error: it silently sorts the deck to the bottom where nobody looks.
  const isDate = (value) => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value)

  if (deck?.createdAt !== undefined && !isDate(deck.createdAt)) {
    problems.push(`${entry.name}/deck.yaml has a non-date "createdAt": ${deck.createdAt}`)
  }

  const publishedAt = deck?.youtube?.publishedAt
  if (publishedAt !== undefined && !isDate(publishedAt)) {
    problems.push(`${entry.name}/deck.yaml has a non-date "youtube.publishedAt": ${publishedAt}`)
  }

  if (Array.isArray(deck?.slides)) {
    deck.slides.forEach((slide, index) => {
      if (!slide?.id) problems.push(`${entry.name} slide ${index + 1} is missing "id"`)
      if (!slide?.title) problems.push(`${entry.name} slide ${index + 1} is missing "title"`)
      if (!slide?.durationInFrames) {
        problems.push(`${entry.name} slide ${index + 1} is missing "durationInFrames"`)
      }
    })

    const ids = deck.slides.map((slide) => slide?.id)
    const duplicates = ids.filter((id, index) => id && ids.indexOf(id) !== index)
    if (duplicates.length) {
      problems.push(`${entry.name} has duplicate slide ids: ${[...new Set(duplicates)].join(', ')}`)
    }

    // slides.tsx and deck.yaml are paired by id at runtime, so a missing or
    // stale id is a blank deck in the browser. Catch it here instead.
    const registered = collectTsxSlideIds(join(decksDir, entry.name, 'slides.tsx'))

    if (registered === null) {
      problems.push(`${entry.name}/slides.tsx has no exported "slides" array`)
    } else {
      const stale = registered.ids.filter((id) => !ids.includes(id))
      if (stale.length) {
        problems.push(`${entry.name}/slides.tsx registers ids with no deck.yaml entry: ${stale.join(', ')}`)
      }

      const duplicated = registered.ids.filter((id, index) => registered.ids.indexOf(id) !== index)
      if (duplicated.length) {
        problems.push(`${entry.name}/slides.tsx registers duplicate ids: ${[...new Set(duplicated)].join(', ')}`)
      }

      // Decks that generate slides from data cannot be counted statically; the
      // runtime pairing still catches those, so only check the ones we can see.
      if (registered.exhaustive) {
        if (registered.ids.length !== deck.slides.length) {
          problems.push(
            `${entry.name} has ${deck.slides.length} slide metadata entries, but ${registered.ids.length} slide components`
          )
        }

        const orphaned = ids.filter((id) => !registered.ids.includes(id))
        if (orphaned.length) {
          problems.push(
            `${entry.name}/deck.yaml has ids with no slide component: ${orphaned.slice(0, 5).join(', ')}`
          )
        }
      }
    }
  }
}

if (problems.length) {
  console.error(`Deck check failed with ${problems.length} problem(s):`)
  for (const problem of problems) console.error(`  - ${problem}`)
  process.exit(1)
}

console.log(`Deck check passed (${entries.filter((e) => e.isDirectory()).length} decks).`)
