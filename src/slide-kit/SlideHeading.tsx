import { renderLines } from './lines'
import { useEnter } from './motion'

export type SlideHeadingProps = {
  frame: number
  /** Small line above the headline. */
  kicker?: string
  /** The headline itself. Use a line break character for an intentional wrap. */
  heading: string
  /** One sentence under the headline. */
  lead?: string
  delay?: number
}

/**
 * Kicker + headline + lead, the block that opens almost every slide.
 *
 * `kicker`, `heading` and `lead` are plain string props on purpose: they are
 * registered in COPY_ATTRIBUTES (scripts/deck-text-core.mjs), so the
 * click-to-edit layer can still find and rewrite this copy in the deck file.
 */
export function SlideHeading({ frame, kicker, heading, lead, delay = 0 }: SlideHeadingProps) {
  const style = useEnter(frame, delay, 24)

  return (
    <header className="sk-heading" style={style}>
      {kicker ? <span className="slide-kicker sk-kicker">{kicker}</span> : null}
      <h1>{renderLines(heading)}</h1>
      {lead ? <p className="sk-lead">{lead}</p> : null}
    </header>
  )
}

