import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion'
import type { DeckBundle } from './types'

const transitionFrames = 24

export function DeckTimeline({ deck }: { deck: DeckBundle }) {
  const frame = useCurrentFrame()
  let cursor = 0

  for (let index = 0; index < deck.slides.length; index += 1) {
    const slide = deck.slides[index]
    const nextSlide = deck.slides[index + 1]
    const duration = slide.durationInFrames ?? 120

    if (frame >= cursor && frame < cursor + duration) {
      const localFrame = frame - cursor
      const transitionStart = duration - transitionFrames

      if (nextSlide && localFrame >= transitionStart) {
        const progress = interpolate(localFrame, [transitionStart, duration], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp'
        })

        return (
          <AbsoluteFill style={{ background: '#080a09', overflow: 'hidden' }}>
            <AbsoluteFill
              style={{
                opacity: interpolate(progress, [0, 1], [1, 0.45]),
                transform: `translateX(${-progress * 8}%) scale(${1 - progress * 0.035})`,
                transformOrigin: 'center'
              }}
            >
              {slide.render({ frame: localFrame, durationInFrames: duration })}
            </AbsoluteFill>
            <AbsoluteFill
              style={{
                opacity: interpolate(progress, [0, 0.28, 1], [0, 1, 1]),
                transform: `translateX(${(1 - progress) * 12}%) scale(${0.97 + progress * 0.03})`,
                transformOrigin: 'center'
              }}
            >
              {nextSlide.render({
                frame: 0,
                durationInFrames: nextSlide.durationInFrames ?? 120
              })}
            </AbsoluteFill>
            <AbsoluteFill
              style={{
                background:
                  'linear-gradient(90deg, transparent, rgba(20, 117, 111, 0.18), transparent)',
                mixBlendMode: 'multiply',
                opacity: interpolate(progress, [0, 0.5, 1], [0, 0.8, 0]),
                transform: `translateX(${interpolate(progress, [0, 1], [-80, 80])}%)`
              }}
            />
          </AbsoluteFill>
        )
      }

      return <>{slide.render({ frame: localFrame, durationInFrames: duration })}</>
    }

    cursor += duration
  }

  const lastSlide = deck.slides.at(-1)
  return lastSlide ? (
    <>{lastSlide.render({ frame: 0, durationInFrames: lastSlide.durationInFrames ?? 120 })}</>
  ) : null
}
