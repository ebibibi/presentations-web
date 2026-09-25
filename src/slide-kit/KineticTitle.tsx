import type { CSSProperties } from 'react'
import { useVideoConfig } from 'remotion'
import { DEFAULT_BPM, beatToFrame, clamp01, ease, progress } from './beat'
import { useEnter } from './motion'

/**
 * How a word arrives. `slide` comes in from the left on expo-out, `pop` scales
 * up on back-out (overshoot, then settle), `drop` falls from above on
 * bounce-out.
 */
export type KineticEnter = 'slide' | 'pop' | 'drop'

export type KineticTitleProps = {
  frame: number
  kicker?: string
  /** Words separated by spaces; each word lands on its own beat. `\n` breaks the line. */
  heading: string
  lead?: string
  /** Tempo. Keep it equal to the soundtrack's so words land on the music. */
  bpm?: number
  /** Beat the first word lands on. */
  start?: number
  /** Beats between one word and the next. */
  every?: number
  /** One style for every word, or a list that is cycled word by word. */
  enter?: KineticEnter | KineticEnter[]
}

type Pose = { x: number; y: number; scale: number; opacity: number }

/** How long one word's entrance lasts, in beats. */
const WORD_BEATS = 1.5
const SLIDE_DISTANCE = 180
const DROP_DISTANCE = 160
/** A change of scale is weighted like this many pixels of travel. */
const SCALE_WEIGHT = 120
const BLUR_PER_PIXEL = 0.16
const MAX_BLUR = 12

function pose(kind: KineticEnter, frame: number, startFrame: number, length: number): Pose {
  const raw = progress(frame, startFrame, length)
  const opacity = clamp01(raw * 4)

  if (kind === 'pop') {
    return { x: 0, y: 0, scale: 0.3 + 0.7 * ease.backOut(raw), opacity }
  }
  if (kind === 'drop') {
    return { x: 0, y: -(1 - ease.bounceOut(raw)) * DROP_DISTANCE, scale: 1, opacity }
  }
  return { x: -(1 - ease.expoOut(raw)) * SLIDE_DISTANCE, y: 0, scale: 1, opacity }
}

/**
 * The word's style at `frame`, with a blur proportional to how far it moved
 * since the previous frame — the cheap stand-in for motion blur. A word at rest
 * has no blur, so the settled slide is sharp.
 */
function kineticWordStyle(
  kind: KineticEnter,
  frame: number,
  startFrame: number,
  length: number
): CSSProperties {
  const now = pose(kind, frame, startFrame, length)
  const before = pose(kind, frame - 1, startFrame, length)
  const travel =
    Math.hypot(now.x - before.x, now.y - before.y) + Math.abs(now.scale - before.scale) * SCALE_WEIGHT
  const blur = Math.min(MAX_BLUR, travel * BLUR_PER_PIXEL)

  return {
    opacity: now.opacity,
    transform: `translate(${now.x.toFixed(2)}px, ${now.y.toFixed(2)}px) scale(${now.scale.toFixed(4)})`,
    '--sk-blur': `${blur.toFixed(2)}px`
  } as CSSProperties
}

function splitWords(heading: string): string[][] {
  return heading.split('\n').map((line) => line.split(/\s+/).filter(Boolean))
}

/**
 * Kinetic typography: a headline whose words land one per beat.
 *
 * Timing is in beats, not frames, so a deck set to the same BPM as its
 * soundtrack stays in time without converting anything by hand. The kicker
 * fades in first and the lead arrives with the last word.
 */
export function KineticTitle({
  frame,
  kicker,
  heading,
  lead,
  bpm = DEFAULT_BPM,
  start = 1,
  every = 1,
  enter = ['slide', 'pop', 'drop']
}: KineticTitleProps) {
  const { fps } = useVideoConfig()
  const lines = splitWords(heading)
  const kinds = Array.isArray(enter) ? enter : [enter]
  const wordCount = lines.reduce((sum, line) => sum + line.length, 0)
  const length = beatToFrame(WORD_BEATS, bpm, fps)
  const landing = (index: number) => beatToFrame(start + index * every, bpm, fps)
  const kickerStyle = useEnter(frame, 0, 20)
  const leadStyle = useEnter(frame, Math.round(landing(Math.max(0, wordCount - 1))), 20)
  const offsets = lines.map((_, lineIndex) =>
    lines.slice(0, lineIndex).reduce((sum, line) => sum + line.length, 0)
  )

  return (
    <div className="sk-kinetic">
      {kicker ? (
        <span className="slide-kicker sk-kicker" style={kickerStyle}>
          {kicker}
        </span>
      ) : null}
      <h1 className="sk-kinetic-heading" aria-label={heading.replace(/\s+/g, ' ')}>
        {lines.map((words, lineIndex) => (
          <span key={`${words.join(' ')}-${lineIndex}`} className="sk-kinetic-line" aria-hidden="true">
            {words.map((word, position) => {
              const wordIndex = offsets[lineIndex] + position
              const kind = kinds[wordIndex % kinds.length] ?? 'slide'

              return (
                <span
                  key={`${word}-${wordIndex}`}
                  className={`sk-kinetic-word sk-kinetic-${kind}`}
                  style={kineticWordStyle(kind, frame, landing(wordIndex), length)}
                >
                  {word}
                </span>
              )
            })}
          </span>
        ))}
      </h1>
      {lead ? (
        <p className="sk-lead" style={leadStyle}>
          {lead}
        </p>
      ) : null}
    </div>
  )
}
