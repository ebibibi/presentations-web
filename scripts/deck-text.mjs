#!/usr/bin/env node
/**
 * Deck copy editing without opening slides.tsx.
 *
 *   node scripts/deck-text.mjs list
 *   node scripts/deck-text.mjs edit <slug>    # dump every editable string
 *   node scripts/deck-text.mjs apply <slug>   # write the dump back into source
 *
 * The dump is a flat text file: marker lines starting with "@@" carry the id
 * and location, everything until the next marker is the copy itself.
 */
import { mkdirSync, readFileSync, readdirSync, writeFileSync, existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  collectTsxStrings,
  collectYamlStrings,
  deckPaths,
  fileHash,
  patchTsxSource,
  patchYamlSource
} from './deck-text-core.mjs'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const decksDir = path.join(repoRoot, 'content', 'decks')

function listSlugs() {
  return readdirSync(decksDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort()
}

function dumpPath(slug) {
  return path.join(repoRoot, 'tmp', 'deck-text', `${slug}.txt`)
}

function requireDeck(slug) {
  if (!slug) {
    console.error('Specify a deck slug. List them with: node scripts/deck-text.mjs list')
    process.exit(1)
  }
  const paths = deckPaths(repoRoot, slug)
  if (!existsSync(paths.tsx) || !existsSync(paths.yaml)) {
    console.error(`Unknown deck: ${slug}`)
    console.error(`Available: ${listSlugs().join(', ')}`)
    process.exit(1)
  }
  return paths
}

function readDeck(slug) {
  const paths = requireDeck(slug)
  const yamlSource = readFileSync(paths.yaml, 'utf8')
  const tsxSource = readFileSync(paths.tsx, 'utf8')
  return {
    paths,
    yamlSource,
    tsxSource,
    yamlItems: collectYamlStrings(paths.yaml, yamlSource),
    tsxItems: collectTsxStrings(paths.tsx, tsxSource)
  }
}

function renderDump(slug, deck) {
  const lines = [
    `# deck: ${slug}`,
    `# fingerprint: deck.yaml@${fileHash(deck.yamlSource)} slides.tsx@${fileHash(deck.tsxSource)}`,
    '#',
    '# Edit the body lines only, save, then run:',
    `#   npm run text:apply ${slug}`,
    '#',
    '# Lines starting with "@@" are ids and locations — leave them alone.',
    '# Everything up to the next "@@" is that entry\'s copy; multiple lines are fine.',
    ''
  ]

  deck.yamlItems.forEach((item, index) => {
    lines.push(`@@ y${index + 1}  ${item.component}`, item.text, '')
  })
  deck.tsxItems.forEach((item, index) => {
    lines.push(`@@ t${index + 1}  ${item.component}  L${item.line}`, item.text, '')
  })

  return lines.join('\n')
}

function parseDump(content) {
  const entries = new Map()
  let currentId = null
  let buffer = []

  const flush = () => {
    if (currentId) {
      entries.set(currentId, buffer.join('\n').replace(/^\n+/, '').replace(/\n+$/, ''))
    }
    buffer = []
  }

  for (const line of content.split('\n')) {
    const marker = line.match(/^@@\s+(\S+)/)
    if (marker) {
      flush()
      currentId = marker[1]
      continue
    }
    if (currentId === null && line.startsWith('#')) continue
    if (currentId !== null) buffer.push(line)
  }
  flush()

  return entries
}

function commandEdit(slug) {
  const deck = readDeck(slug)
  const target = dumpPath(slug)
  mkdirSync(path.dirname(target), { recursive: true })
  writeFileSync(target, renderDump(slug, deck), 'utf8')

  console.log(`Wrote ${deck.yamlItems.length + deck.tsxItems.length} strings:`)
  console.log(`  ${target}`)
  console.log('')
  console.log('After editing, run:')
  console.log(`  npm run text:apply ${slug}`)
}

function commandApply(slug, options) {
  const deck = readDeck(slug)
  const target = dumpPath(slug)

  if (!existsSync(target)) {
    console.error(`No dump file at ${target}`)
    console.error(`Run  npm run text ${slug}  first`)
    process.exit(1)
  }

  const content = readFileSync(target, 'utf8')
  const fingerprint = content.match(/^# fingerprint: deck\.yaml@(\S+) slides\.tsx@(\S+)$/m)
  const current = [fileHash(deck.yamlSource), fileHash(deck.tsxSource)]

  if (!options.force && fingerprint && (fingerprint[1] !== current[0] || fingerprint[2] !== current[1])) {
    console.error('The deck changed after this dump was written; applying it would clobber that change.')
    console.error(`Re-run  npm run text ${slug}  to refresh the dump, or pass --force if this is intended.`)
    process.exit(1)
  }

  const entries = parseDump(content)
  const yamlEdits = []
  const tsxEdits = []

  deck.yamlItems.forEach((item, index) => {
    const next = entries.get(`y${index + 1}`)
    if (next !== undefined && next !== item.text) yamlEdits.push({ ...item, text: next })
  })
  deck.tsxItems.forEach((item, index) => {
    const next = entries.get(`t${index + 1}`)
    if (next !== undefined && next !== item.text) tsxEdits.push({ ...item, text: next })
  })

  if (!yamlEdits.length && !tsxEdits.length) {
    console.log('No changes.')
    return
  }

  if (yamlEdits.length) writeFileSync(deck.paths.yaml, patchYamlSource(deck.yamlSource, yamlEdits), 'utf8')
  if (tsxEdits.length) writeFileSync(deck.paths.tsx, patchTsxSource(deck.tsxSource, tsxEdits), 'utf8')

  for (const edit of [...yamlEdits, ...tsxEdits]) {
    console.log(`  ${edit.component}: ${edit.text.slice(0, 60)}`)
  }
  console.log('')
  console.log(`Applied ${yamlEdits.length + tsxEdits.length} change(s). Check them with npm run dev.`)
}

const [command, slug, ...rest] = process.argv.slice(2)
const options = { force: rest.includes('--force') }

switch (command) {
  case 'list':
    console.log(listSlugs().join('\n'))
    break
  case 'edit':
  case undefined:
    commandEdit(slug)
    break
  case 'apply':
    commandApply(slug, options)
    break
  default:
    console.error(`Unknown command: ${command}`)
    console.error('Usage: node scripts/deck-text.mjs [list|edit <slug>|apply <slug>]')
    process.exit(1)
}
