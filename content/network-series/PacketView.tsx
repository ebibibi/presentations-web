import type { CSSProperties } from 'react'
import { interpolate, useVideoConfig } from 'remotion'
import { DiagramFrame, Slide, SlideHeading, entrance, lift } from '../../src/slide-kit'
import type { SlideRenderContext } from '../../src/types'
import './packet-view.css'

/** Colour family of a header; the outer envelope is always the link layer. */
export type PacketLayerKind = 'eth' | 'arp' | 'ip' | 'tcp' | 'udp' | 'data'

export type PacketField = {
  label: string
  /** One value per packet column, in the same order as `columns`. */
  cells: string[]
  /** Glows once the packet is drawn: the field the narration is about. */
  changed?: boolean
}

export type PacketLayer = {
  kind: PacketLayerKind
  heading: string
  items: PacketField[]
}

export type PacketColumn = { label: string; body?: string }

type PacketViewProps = SlideRenderContext & {
  kicker: string
  heading: string
  lead: string
  caption: string
  note: string
  /** One entry per packet drawn side by side (one or two). */
  columns: PacketColumn[]
  /** Headers from the outermost envelope inward; the last one is usually the payload. */
  rows: PacketLayer[]
}

/**
 * Opens a packet: each header is drawn as an envelope wrapped around the next,
 * with the real field values, so the viewer sees what the wire actually carries.
 */
export function PacketView({ frame, kicker, heading, lead, caption, note, columns, rows }: PacketViewProps) {
  const { fps } = useVideoConfig()
  const glow = interpolate(frame, [70, 90], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })

  return (
    <Slide className="pkt-slide">
      <SlideHeading frame={frame} kicker={kicker} heading={heading} lead={lead} />
      <DiagramFrame frame={frame} caption={caption} note={note}>
        <div className={`pkt-columns pkt-columns-${columns.length}`}>
          {columns.map((column, index) => (
            <section key={column.label} className="pkt-column" style={lift(entrance(frame, fps, 18 + index * 14), 20)}>
              <header className="pkt-column-head">
                <strong>{column.label}</strong>
                {column.body ? <span>{column.body}</span> : null}
              </header>
              <Envelope layers={rows} column={index} frame={frame} fps={fps} glow={glow} depth={0} />
            </section>
          ))}
        </div>
      </DiagramFrame>
    </Slide>
  )
}

type EnvelopeProps = { layers: PacketLayer[]; column: number; frame: number; fps: number; glow: number; depth: number }

function Envelope({ layers, column, frame, fps, glow, depth }: EnvelopeProps) {
  const [layer, ...inner] = layers
  if (!layer) return null
  const style: CSSProperties = lift(entrance(frame, fps, 26 + depth * 9 + column * 14), 14)

  return (
    <div className={`pkt-layer pkt-${layer.kind}`} style={style}>
      <div className="pkt-layer-head">{layer.heading}</div>
      <dl className="pkt-fields">
        {layer.items.map((field) => (
          <div key={field.label} className={field.changed ? 'pkt-field pkt-changed' : 'pkt-field'} style={field.changed ? ({ '--pkt-glow': glow } as CSSProperties) : undefined}>
            <dt>{field.label}</dt>
            <dd>{field.cells[column] ?? ''}</dd>
          </div>
        ))}
      </dl>
      {inner.length ? <Envelope layers={inner} column={column} frame={frame} fps={fps} glow={glow} depth={depth + 1} /> : null}
    </div>
  )
}
