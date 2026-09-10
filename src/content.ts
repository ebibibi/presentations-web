import YAML from 'yaml'
import { compareDecksNewestFirst } from './deck-order'
import { privateDeckDocumentSchema, toPrivateDeckBundle } from './private-decks'
import { deckMetaSchema } from './schema'
import type { DeckBundle, DeckMeta, SlideModule } from './types'

const deckMetaFiles = import.meta.glob<string>('../content/decks/*/deck.yaml', {
  query: '?raw',
  import: 'default',
  eager: true
})

const slideModules = import.meta.glob<SlideModule>('../content/decks/*/slides.tsx', {
  eager: true
})

let cachedDecks: DeckBundle[] | null = null

export function getDecks(): DeckBundle[] {
  if (cachedDecks) {
    return cachedDecks
  }

  cachedDecks = Object.entries(deckMetaFiles)
    .map(([path, raw]) => buildDeck(path, raw))
    .sort((left, right) => compareDecksNewestFirst(left.meta, right.meta))

  return cachedDecks
}

export async function loadPrivateDecks(): Promise<DeckBundle[]> {
  const response = await fetch('/api/private/decks', { cache: 'no-store' })

  if (!response.ok) {
    const result = await safeJson(response)
    throw new Error(result.error || 'Failed to load private decks')
  }

  const result = await safeJson(response)
  const documents = privateDeckDocumentSchema.array().parse(result.decks ?? [])
  return documents.map(toPrivateDeckBundle)
}

function buildDeck(path: string, raw: string): DeckBundle {
  const parsed = deckMetaSchema.parse(YAML.parse(raw)) satisfies DeckMeta
  const deckDir = path.replace('/deck.yaml', '')
  const slideModule = slideModules[`${deckDir}/slides.tsx`]

  if (!slideModule) {
    throw new Error(`Slide module is missing for ${parsed.slug}`)
  }

  // Pairing by id, not by position: reordering a deck means moving one entry in
  // deck.yaml, and a slide whose component is missing fails loudly instead of
  // silently borrowing the next slide's title and notes.
  const componentsById = new Map(slideModule.slides.map((slide) => [slide.id, slide]))

  if (componentsById.size !== slideModule.slides.length) {
    throw new Error(`${parsed.slug} has duplicate slide ids in slides.tsx`)
  }

  const slides = parsed.slides.map((meta) => {
    const component = componentsById.get(meta.id)

    if (!component) {
      throw new Error(`${parsed.slug} has no slide component with id "${meta.id}"`)
    }

    componentsById.delete(meta.id)
    return { ...component, ...meta }
  })

  if (componentsById.size > 0) {
    throw new Error(
      `${parsed.slug} has slide components with no deck.yaml entry: ${[...componentsById.keys()].join(', ')}`
    )
  }

  return { meta: parsed, slides }
}

async function safeJson(response: Response) {
  try {
    return (await response.json()) as { decks?: unknown; error?: string }
  } catch {
    return {}
  }
}
