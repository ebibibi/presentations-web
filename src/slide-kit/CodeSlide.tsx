import type { ReactNode } from 'react'
import { SlideHeading } from './SlideHeading'
import { Slide } from './Slide'
import { Terminal } from './Terminal'
import type { TerminalLine } from './Terminal'

export type CodeSlideProps = {
  frame: number
  kicker?: string
  heading: string
  lead?: string
  caption?: string
  lines: TerminalLine[]
  /** Optional notes beside the window; keep them to a few short phrases. */
  children?: ReactNode
}

/** Heading plus a terminal window, with room for commentary on the right. */
export function CodeSlide({
  frame,
  kicker,
  heading,
  lead,
  caption,
  lines,
  children
}: CodeSlideProps) {
  return (
    <Slide className="sk-code-slide">
      <SlideHeading frame={frame} kicker={kicker} heading={heading} lead={lead} />
      <div className={children ? 'sk-code-stage sk-code-split' : 'sk-code-stage'}>
        <Terminal frame={frame} caption={caption} lines={lines} delay={18} stagger />
        {children ? <div className="sk-code-aside">{children}</div> : null}
      </div>
    </Slide>
  )
}
