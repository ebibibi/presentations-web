import { useEnter, useStagger } from './motion'
import { renderLines } from './lines'
import { Slide } from './Slide'

export type TitlePoint = {
  /** Two-digit marker, for example "01". */
  step?: string
  heading: string
  body?: string
}

export type TitleSlideProps = {
  frame: number
  kicker?: string
  heading: string
  lead?: string
  /** Up to three promises the deck makes. Rendered as a row under the title. */
  points?: TitlePoint[]
}

/** Opening slide: series label, title, promise, and what the viewer will get. */
export function TitleSlide({ frame, kicker, heading, lead, points = [] }: TitleSlideProps) {
  const copy = useEnter(frame, 0, 48)
  const pointStyles = useStagger(frame, points.length, { start: 28, step: 12, distance: 28 })

  return (
    <Slide tone="paper" grid logo center className="sk-title-slide">
      <div className="sk-title-copy" style={copy}>
        {kicker ? <span className="slide-kicker sk-kicker">{kicker}</span> : null}
        <h1>{renderLines(heading)}</h1>
        {lead ? <p className="sk-lead">{lead}</p> : null}
      </div>
      {points.length ? (
        <div className="sk-title-points">
          {points.map((point, index) => (
            <div key={point.heading} className="sk-title-point" style={pointStyles[index]}>
              {point.step ? <strong>{point.step}</strong> : null}
              <span>{point.heading}</span>
              {point.body ? <p>{point.body}</p> : null}
            </div>
          ))}
        </div>
      ) : null}
    </Slide>
  )
}
