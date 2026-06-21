import type { ReactNode } from 'react'
import type { z } from 'zod'
import type { deckMetaSchema } from './schema'

export type DeckMeta = z.infer<typeof deckMetaSchema>

export type SlideRenderContext = {
  frame: number
  durationInFrames: number
}

export type SlideComponent = {
  id: string
  title: string
  durationInFrames?: number
  notes?: string
  render: (context: SlideRenderContext) => ReactNode
}

export type SlideModule = {
  slides: Array<Pick<SlideComponent, 'render'>>
}

export type DeckBundle = {
  meta: DeckMeta
  slides: SlideComponent[]
}
