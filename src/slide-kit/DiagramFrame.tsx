import type { ReactNode } from 'react'
import { useEnter, useStagger } from './motion'

export type DiagramFrameProps = {
  frame: number
  /** Label printed on the frame edge, for example "構成図" or a scope name. */
  caption?: string
  /** One line under the frame explaining what the reader should take from it. */
  note?: string
  delay?: number
  children: ReactNode
}

/**
 * A bordered stage for an architecture drawing.
 *
 * The frame owns the padding, the label and the caption so a diagram slide does
 * not have to reinvent them; what goes inside is up to the deck — `FlowDiagram`
 * below covers the common boxes-and-arrows case.
 */
export function DiagramFrame({ frame, caption, note, delay = 16, children }: DiagramFrameProps) {
  const style = useEnter(frame, delay, 26)

  return (
    <figure className="sk-diagram" style={style}>
      {caption ? <figcaption className="sk-diagram-caption">{caption}</figcaption> : null}
      <div className="sk-diagram-stage">{children}</div>
      {note ? <p className="sk-diagram-note">{note}</p> : null}
    </figure>
  )
}

export type FlowNode = {
  heading: string
  body?: string
  /** Highlights the node the talk is about. */
  accent?: boolean
}

export type FlowDiagramProps = {
  frame: number
  items: FlowNode[]
  /** Arrow glyph between nodes. Use "⇄" for a two-way hop. */
  arrow?: string
  delay?: number
}

/** Boxes joined left to right by arrows: a request path, a pipeline, a handoff. */
export function FlowDiagram({ frame, items, arrow = '→', delay = 24 }: FlowDiagramProps) {
  const styles = useStagger(frame, items.length, { start: delay, step: 10, distance: 18 })

  return (
    <div className="sk-flow">
      {items.map((item, index) => (
        <div key={item.heading} className="sk-flow-cell" style={styles[index]}>
          <div className={item.accent ? 'sk-flow-node sk-flow-on' : 'sk-flow-node'}>
            <strong>{item.heading}</strong>
            {item.body ? <p>{item.body}</p> : null}
          </div>
          {index < items.length - 1 ? (
            <span className="sk-flow-arrow" aria-hidden="true">
              {arrow}
            </span>
          ) : null}
        </div>
      ))}
    </div>
  )
}
