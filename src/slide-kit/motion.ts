import type { CSSProperties } from 'react'
import { spring, useVideoConfig } from 'remotion'
import { DEFAULT_BPM, beatClock } from './beat'
import type { BeatClock } from './beat'

/**
 * The entrance motion every deck in this repository had copied by hand.
 *
 * 24 of 29 decks carried an identical `entrance` / `lift` pair at the top of
 * their slides.tsx, so a timing change meant editing 24 files. Import these
 * instead; the numbers are the ones those copies agreed on.
 */
const ENTRANCE_CONFIG = { damping: 18, stiffness: 110 } as const

/** Default gap, in frames, between one staggered item and the next. */
export const STAGGER_STEP = 10

/** 0 → 1 entrance progress for a slide element, optionally delayed. */
export function entrance(frame: number, fps: number, delay = 0): number {
  return spring({ frame: frame - delay, fps, config: ENTRANCE_CONFIG })
}

/** Turns entrance progress into a fade-and-rise style. */
export function lift(value: number, distance = 32): CSSProperties {
  return {
    opacity: value,
    transform: `translateY(${(1 - value) * distance}px)`
  }
}

/** `lift(entrance(...))` for one element, reading fps from the Remotion config. */
export function useEnter(frame: number, delay = 0, distance = 32): CSSProperties {
  const { fps } = useVideoConfig()
  return lift(entrance(frame, fps, delay), distance)
}

export type StaggerOptions = {
  /** Frames before the first item starts. */
  start?: number
  /** Frames between consecutive items. */
  step?: number
  /** Rise distance in pixels. */
  distance?: number
}

/**
 * Entrance styles for a list, one per item.
 *
 * Hooks cannot be called per item, so this reads the Remotion config once and
 * returns the whole array — `styles[index]` goes on the item's wrapper.
 */
export function useStagger(
  frame: number,
  count: number,
  { start = 24, step = STAGGER_STEP, distance = 26 }: StaggerOptions = {}
): CSSProperties[] {
  const { fps } = useVideoConfig()
  return Array.from({ length: count }, (_, index) =>
    lift(entrance(frame, fps, start + index * step), distance)
  )
}

/**
 * Beat arithmetic for the current frame, reading fps from the Remotion config.
 *
 * `beat.frameOf(4)` is the frame beat 4 lands on; `beat.progress(4, 1, ease.backOut)`
 * is a one-beat pop that starts there. Beat 0 is the first frame of the slide.
 */
export function useBeat(frame: number, bpm = DEFAULT_BPM): BeatClock {
  const { fps } = useVideoConfig()
  return beatClock(frame, bpm, fps)
}
