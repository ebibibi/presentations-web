import { useStagger } from './motion'

export type TimelineStep = {
  /** Date, version, or step number shown on the rail. */
  label: string
  heading: string
  body?: string
  /** Highlights the step the talk is actually about. */
  accent?: boolean
}

export type TimelineProps = {
  frame: number
  steps: TimelineStep[]
  /** `horizontal` suits 3-5 steps; `vertical` stays readable past that. */
  orientation?: 'horizontal' | 'vertical'
  delay?: number
}

/** A dated sequence: releases, migration phases, or the steps of a workflow. */
export function Timeline({ frame, steps, orientation = 'horizontal', delay = 18 }: TimelineProps) {
  const styles = useStagger(frame, steps.length, { start: delay, step: 10, distance: 22 })

  return (
    <ol className={`sk-timeline sk-timeline-${orientation}`}>
      {steps.map((step, index) => (
        <li
          key={step.heading}
          className={step.accent ? 'sk-timeline-step sk-timeline-on' : 'sk-timeline-step'}
          style={styles[index]}
        >
          <span className="sk-timeline-dot" aria-hidden="true" />
          <span className="sk-timeline-label">{step.label}</span>
          <strong>{step.heading}</strong>
          {step.body ? <p>{step.body}</p> : null}
        </li>
      ))}
    </ol>
  )
}
