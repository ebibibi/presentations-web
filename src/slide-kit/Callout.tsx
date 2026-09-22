import type { ReactNode } from 'react'
import { useEnter } from './motion'

/** Colour and intent. `warn` is for a caveat, `good` for the recommended path. */
export type CalloutTone = 'note' | 'warn' | 'good'

export type CalloutProps = {
  frame: number
  tone?: CalloutTone
  /** Short emoji or symbol on the left. */
  icon?: string
  label?: string
  delay?: number
  children: ReactNode
}

/** A single point pulled out of the flow of the slide. */
export function Callout({ frame, tone = 'note', icon, label, delay = 30, children }: CalloutProps) {
  const style = useEnter(frame, delay, 18)

  return (
    <aside className={`sk-callout sk-callout-${tone}`} style={style}>
      {icon ? (
        <span className="sk-callout-icon" aria-hidden="true">
          {icon}
        </span>
      ) : null}
      <div>
        {label ? <strong>{label}</strong> : null}
        <div className="sk-callout-body">{children}</div>
      </div>
    </aside>
  )
}

export type QuoteProps = {
  frame: number
  quote: string
  /** Who said it, or the document it came from. */
  source?: string
  delay?: number
}

/**
 * A quotation with its attribution.
 *
 * Keep `source` accurate: a deck published on the site is read long after the
 * video, and an unattributed quote is the thing viewers write in to ask about.
 */
export function Quote({ frame, quote, source, delay = 16 }: QuoteProps) {
  const style = useEnter(frame, delay, 24)

  return (
    <figure className="sk-quote" style={style}>
      <blockquote>{quote}</blockquote>
      {source ? <figcaption>{source}</figcaption> : null}
    </figure>
  )
}
