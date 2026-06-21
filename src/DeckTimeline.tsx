import { useCurrentFrame } from 'remotion'
import type { DeckBundle } from './types'

export function DeckTimeline({ deck }: { deck: DeckBundle }) {
  const frame = useCurrentFrame()
  let cursor = 0

  for (const slide of deck.slides) {
    const duration = slide.durationInFrames ?? 120

    if (frame >= cursor && frame < cursor + duration) {
      return <>{slide.render({ frame: frame - cursor, durationInFrames: duration })}</>
    }

    cursor += duration
  }

  const lastSlide = deck.slides.at(-1)
  return lastSlide ? (
    <>{lastSlide.render({ frame: 0, durationInFrames: lastSlide.durationInFrames ?? 120 })}</>
  ) : null
}
