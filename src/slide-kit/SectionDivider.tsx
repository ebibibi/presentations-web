import { KineticTitle } from './KineticTitle'
import { useEnter } from './motion'
import { renderLines } from './lines'
import { Slide } from './Slide'

export type SectionDividerProps = {
  frame: number
  /** Chapter marker, for example "02". */
  step?: string
  kicker?: string
  heading: string
  lead?: string
  /**
   * `fade` (default) lifts the copy in as one block. `kinetic` lands the
   * heading word by word on the beat, through KineticTitle.
   */
  motion?: 'fade' | 'kinetic'
}

/**
 * Chapter break. Inverted so it reads as a pause rather than another content
 * slide, which is the whole point of a divider in a recorded talk.
 */
export function SectionDivider({ frame, step, kicker, heading, lead, motion = 'fade' }: SectionDividerProps) {
  const marker = useEnter(frame, 0, 20)
  const copy = useEnter(frame, 14, 28)

  return (
    <Slide tone="ink" center className="sk-divider">
      {step ? (
        <span className="sk-divider-step" style={marker}>
          {step}
        </span>
      ) : null}
      {motion === 'kinetic' ? (
        <KineticTitle frame={frame} kicker={kicker} heading={heading} lead={lead} />
      ) : (
        <div style={copy}>
          {kicker ? <span className="slide-kicker sk-kicker">{kicker}</span> : null}
          <h1>{renderLines(heading)}</h1>
          {lead ? <p className="sk-lead">{lead}</p> : null}
        </div>
      )}
    </Slide>
  )
}
