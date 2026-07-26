// Deck YAML is parsed in the browser at runtime, so a malformed deck.yaml
// sails through `tsc -b && vite build` and only shows up as a blank deck.
// Parse every deck here so the build fails instead.
import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { parse } from 'yaml'

const decksDir = join(process.cwd(), 'content', 'decks')
const required = ['slug', 'title', 'summary', 'status', 'order', 'slides']
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
  }
}

if (problems.length) {
  console.error(`Deck check failed with ${problems.length} problem(s):`)
  for (const problem of problems) console.error(`  - ${problem}`)
  process.exit(1)
}

console.log(`Deck check passed (${entries.filter((e) => e.isDirectory()).length} decks).`)
