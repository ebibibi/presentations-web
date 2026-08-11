import type { DeckBundle } from './types'

export const studioIntroFrames = 150
export const studioOutroFrames = 180

export function getDeckDuration(deck: DeckBundle) {
  return deck.meta.slides.reduce(
    (sum, slide) => sum + (slide.durationInFrames ?? 120),
    0
  )
}

export function getStudioTimelineDuration(deck: DeckBundle) {
  return studioIntroFrames + getDeckDuration(deck) + studioOutroFrames
}
