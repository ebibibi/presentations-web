import type { ReactNode } from 'react'
import { useEnter } from './motion'
import { renderLines } from './lines'
import { Slide } from './Slide'

export type HookSlideProps = {
  frame: number
  /** Small context line above the hook, for example the date or the trigger. */
  kicker?: string
  /** The hook, the biggest text in the deck. Name the viewer and their situation. */
  heading: string
  /** The answer, in one line, right under the hook. */
  lead?: string
  /** Supporting detail for the answer, usually a ComparisonTable or a Callout. */
  children?: ReactNode
}

/**
 * Opening slide for a deck that has an answer.
 *
 * The hook is set larger than any other heading so a viewer recognises in the
 * first second that the video is about them ("あなたの〇〇が…"). The answer sits
 * directly under it in the accent colour, and the children carry the detail.
 */
export function HookSlide({ frame, kicker, heading, lead, children }: HookSlideProps) {
  const hook = useEnter(frame, 0, 40)
  const answer = useEnter(frame, 18, 28)
  const detail = useEnter(frame, 32, 28)

  return (
    <Slide tone="paper" grid className="sk-hook-slide">
      <header className="sk-hook" style={hook}>
        {kicker ? <span className="slide-kicker sk-kicker sk-hook-kicker">{kicker}</span> : null}
        <h1>{renderLines(heading)}</h1>
      </header>
      {lead ? (
        <p className="sk-hook-answer" style={answer}>
          {lead}
        </p>
      ) : null}
      {children ? (
        <div className="sk-hook-detail" style={detail}>
          {children}
        </div>
      ) : null}
    </Slide>
  )
}
