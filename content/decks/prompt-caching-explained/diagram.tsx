/* eslint-disable react-refresh/only-export-components */
import { useEnter, useStagger } from '../../../src/slide-kit'

/*
 * Diagram parts for the prompt-caching deck. They carry no copy of their own:
 * every label arrives as a prop from slides.tsx, where the editor can find it.
 */

/**
 * hit = read from the cache, write = read for the first time and saved for next time,
 * compute = read normally with no cache, miss = cache expired or prefix changed,
 * output = what the AI writes back.
 */
export type SegmentState = 'hit' | 'write' | 'compute' | 'miss' | 'output'

export type Segment = {
  label: string
  state: SegmentState
  /**
   * Width in fixed units. The same segment is drawn at the same width on every
   * row, so a growing conversation reads as a longer strip, not a squeezed one.
   */
  grow?: number
}

/** Fixed width for a segment of `units` units, gaps between units included. */
function segmentWidth(units: number): string {
  return `calc(${units} * var(--pc-unit) + ${units - 1} * var(--pc-gap))`
}

type TokenRowProps = {
  frame: number
  label: string
  note?: string
  items: Segment[]
  /** The answer the AI writes back, drawn after an arrow. */
  body?: string
  delay: number
}

/** One request drawn as a strip of prompt segments, coloured by what happened to them. */
export function TokenRow({ frame, label, note, items, body, delay }: TokenRowProps) {
  const rowStyle = useEnter(frame, delay, 18)
  const cells = useStagger(frame, items.length + 1, { start: delay + 6, step: 6, distance: 12 })

  return (
    <div className={body ? 'pc-row pc-row-turn' : 'pc-row'} style={rowStyle}>
      <strong className="pc-row-label">{label}</strong>
      <div className="pc-strip">
        {items.map((item, index) => (
          <span
            key={`${item.label}-${index}`}
            className={`pc-seg pc-seg-${item.state}`}
            style={{ ...cells[index], width: segmentWidth(item.grow ?? 1) }}
          >
            {item.label}
          </span>
        ))}
      </div>
      {body ? (
        <div className="pc-answer" style={cells[items.length]}>
          <span aria-hidden="true">→</span>
          <span className="pc-seg pc-seg-output">{body}</span>
        </div>
      ) : null}
      {note ? <p className="pc-row-note">{note}</p> : null}
    </div>
  )
}

export function Legend({ frame, items }: { frame: number; items: { label: string; state: SegmentState }[] }) {
  const style = useEnter(frame, 70, 10)

  return (
    <div className="pc-legend" style={style}>
      {items.map((item) => (
        <span key={item.label} className="pc-legend-item">
          <i className={`pc-swatch pc-seg-${item.state}`} />
          {item.label}
        </span>
      ))}
    </div>
  )
}

type HourlyRowProps = {
  frame: number
  delay: number
  label: string
  body: string
  /** One state per hourly call. */
  items: SegmentState[]
}

/** Twelve hourly calls drawn as cells, with what they cost in total. */
export function HourlyRow({ frame, delay, label, body, items }: HourlyRowProps) {
  const rowStyle = useEnter(frame, delay, 14)
  const cells = useStagger(frame, items.length, { start: delay + 4, step: 3, distance: 8 })

  return (
    <div className="pc-hourly-row" style={rowStyle}>
      <strong>{label}</strong>
      <div className="pc-hourly-cells">
        {items.map((state, index) => (
          <i key={index} className={`pc-hourly-cell pc-seg-${state}`} style={cells[index]} />
        ))}
      </div>
      <b>{body}</b>
    </div>
  )
}

export const ALL_COMPUTE: SegmentState[] = Array.from({ length: 12 }, () => 'compute')
export const ALL_WRITE: SegmentState[] = Array.from({ length: 12 }, () => 'write')
export const WRITE_ONCE: SegmentState[] = ['write', ...Array.from({ length: 11 }, (): SegmentState => 'hit')]

