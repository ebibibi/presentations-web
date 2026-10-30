import type { CSSProperties } from 'react'
import { useAmbientFrame } from './ThemeRoot'

/** Seconds for one full loop of each light; long and mutually prime so the pattern never visibly repeats. */
const LIGHT_A_PERIOD = 17
const LIGHT_B_PERIOD = 23
const GRID_DRIFT_PX_PER_FRAME = 0.08

const FPS = 30

function wave(frame: number, periodSeconds: number, phase = 0) {
  return Math.sin((frame / (periodSeconds * FPS)) * Math.PI * 2 + phase)
}

/**
 * The ambient layer a themed slide sits on: two soft lights that drift very
 * slowly, a static film grain and, when the slide asks for it, a faint grid
 * that creeps along with them.
 *
 * Everything is a function of the ambient frame, so the same frame always
 * draws the same picture. The theme stylesheet supplies the colours through
 * custom properties and keeps the layer behind the slide content
 * (`z-index: -1` inside an isolated slide), so nothing moves over the text.
 * Amplitudes are a few percent of the canvas: the motion should be noticed
 * only when the slide is otherwise still.
 */
export function AmbientBackdrop({ grid }: { grid: boolean }) {
  const frame = useAmbientFrame()

  const ax = 76 + 7 * wave(frame, LIGHT_A_PERIOD)
  const ay = 14 + 6 * wave(frame, LIGHT_A_PERIOD * 0.8, 1.3)
  const bx = 18 + 8 * wave(frame, LIGHT_B_PERIOD, 2.1)
  const by = 88 + 5 * wave(frame, LIGHT_B_PERIOD * 1.1, 0.4)
  const breathe = 0.85 + 0.15 * wave(frame, 11, 0.7)

  const style = {
    '--sk-ambient-a-x': `${ax.toFixed(2)}%`,
    '--sk-ambient-a-y': `${ay.toFixed(2)}%`,
    '--sk-ambient-b-x': `${bx.toFixed(2)}%`,
    '--sk-ambient-b-y': `${by.toFixed(2)}%`,
    '--sk-ambient-breathe': breathe.toFixed(3)
  } as CSSProperties

  const drift = (frame * GRID_DRIFT_PX_PER_FRAME) % 64
  const gridStyle: CSSProperties = {
    backgroundPosition: `${drift.toFixed(2)}px ${(drift * 0.5).toFixed(2)}px`
  }

  return (
    <div className="sk-ambient" style={style} aria-hidden="true">
      <div className="sk-ambient-light" />
      {grid ? <div className="sk-ambient-grid" style={gridStyle} /> : null}
      <div className="sk-ambient-grain" />
    </div>
  )
}
