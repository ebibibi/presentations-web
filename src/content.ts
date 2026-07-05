import YAML from 'yaml'
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
    .sort((left, right) => {
      const leftOrder = left.meta.order ?? Number.POSITIVE_INFINITY
      const rightOrder = right.meta.order ?? Number.POSITIVE_INFINITY
      if (leftOrder !== rightOrder) {
        return leftOrder - rightOrder
      }
      return right.meta.createdAt.localeCompare(left.meta.createdAt)
    })

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

  if (slideModule.slides.length !== parsed.slides.length) {
    throw new Error(
      `${parsed.slug} has ${parsed.slides.length} slide metadata entries, but ${slideModule.slides.length} slide components`
    )
  }

  return {
    meta: parsed,
    slides: slideModule.slides.map((slide, index) => ({
      ...slide,
      ...parsed.slides[index]
    }))
  }
}

async function safeJson(response: Response) {
  try {
    return (await response.json()) as { decks?: unknown; error?: string }
  } catch {
    return {}
  }
}
