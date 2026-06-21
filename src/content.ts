import YAML from 'yaml'
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
    .sort((left, right) => right.meta.createdAt.localeCompare(left.meta.createdAt))

  return cachedDecks
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
