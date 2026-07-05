/* eslint-disable react-refresh/only-export-components */
import { spring, useVideoConfig } from 'remotion'
import { z } from 'zod'
import { CtaSlide, LogoMark } from './deck-shared'
import { deckMetaSchema } from './schema'
import type { DeckBundle, SlideRenderContext } from './types'

const privateMetricSchema = z.object({
  value: z.string(),
  label: z.string(),
  caption: z.string().optional(),
  tone: z.enum(['teal', 'coral', 'mustard', 'violet']).optional()
})

const privateItemSchema = z.object({
  label: z.string().optional(),
  title: z.string(),
  body: z.string().optional(),
  value: z.string().optional(),
  tone: z.enum(['teal', 'coral', 'mustard', 'violet']).optional()
})

const privatePanelSchema = z.object({
  title: z.string(),
  body: z.string().optional(),
  items: z.array(privateItemSchema).optional(),
  tone: z.enum(['teal', 'coral', 'mustard', 'violet']).optional()
})

const privateSlideSpecSchema = z.object({
  layout: z.enum(['cta', 'title', 'metrics', 'timeline', 'process', 'split', 'lesson', 'closing']),
  kicker: z.string().optional(),
  title: z.string(),
  subtitle: z.string().optional(),
  sourceUrl: z.string().url().optional(),
  body: z.string().optional(),
  emphasis: z.string().optional(),
  metrics: z.array(privateMetricSchema).optional(),
  items: z.array(privateItemSchema).optional(),
  panels: z.array(privatePanelSchema).optional(),
  footer: z.string().optional()
})

export const privateDeckDocumentSchema = z.object({
  meta: deckMetaSchema,
  visualSlides: z.array(privateSlideSpecSchema)
})

type PrivateDeckDocument = z.infer<typeof privateDeckDocumentSchema>
type PrivateSlideSpec = z.infer<typeof privateSlideSpecSchema>

export function toPrivateDeckBundle(document: PrivateDeckDocument): DeckBundle {
  if (document.meta.slides.length !== document.visualSlides.length) {
    throw new Error(
      `${document.meta.slug} has ${document.meta.slides.length} slide metadata entries, but ${document.visualSlides.length} private slide visuals`
    )
  }

  return {
    meta: document.meta,
    slides: document.visualSlides.map((spec, index) => ({
      ...document.meta.slides[index],
      render: (props) => <PrivateSlide spec={spec} {...props} />
    }))
  }
}

function PrivateSlide({
  spec,
  frame,
  durationInFrames
}: { spec: PrivateSlideSpec } & SlideRenderContext) {
  const { fps } = useVideoConfig()
  const head = entrance(frame, fps)

  if (spec.layout === 'cta') {
    return <CtaSlide frame={frame} durationInFrames={durationInFrames} />
  }

  return (
    <section className={`remotion-slide private-slide private-${spec.layout}`}>
      {spec.layout === 'title' ? <LogoMark /> : null}
      <div className="private-grid" />
      <div className="private-head" style={lift(head, 42)}>
        {spec.kicker ? <span className="slide-kicker">{spec.kicker}</span> : null}
        <h1>{spec.title}</h1>
        {spec.subtitle ? <p className="private-subtitle">{spec.subtitle}</p> : null}
      </div>
      <PrivateSlideBody spec={spec} frame={frame} fps={fps} />
      {spec.sourceUrl ? (
        <a className="private-source" href={spec.sourceUrl} target="_blank" rel="noreferrer">
          source: {spec.sourceUrl}
        </a>
      ) : null}
      {spec.footer ? <p className="private-footer">{spec.footer}</p> : null}
    </section>
  )
}

function PrivateSlideBody({
  spec,
  frame,
  fps
}: {
  spec: PrivateSlideSpec
  frame: number
  fps: number
}) {
  if (spec.layout === 'title') {
    return (
      <div className="private-title-body" style={lift(entrance(frame, fps, 24), 28)}>
        {spec.emphasis ? <strong>{spec.emphasis}</strong> : null}
        {spec.body ? <p>{spec.body}</p> : null}
      </div>
    )
  }

  if (spec.layout === 'metrics') {
    return (
      <div className="private-metrics">
        {spec.metrics?.map((metric, index) => (
          <div
            key={`${metric.value}-${metric.label}`}
            className={`private-metric tone-${metric.tone ?? 'teal'}`}
            style={lift(entrance(frame, fps, 22 + index * 8), 24)}
          >
            <strong>{metric.value}</strong>
            <span>{metric.label}</span>
            {metric.caption ? <p>{metric.caption}</p> : null}
          </div>
        ))}
      </div>
    )
  }

  if (spec.layout === 'timeline' || spec.layout === 'process') {
    return (
      <div className={`private-flow private-flow-${spec.layout}`}>
        {spec.items?.map((item, index) => (
          <div
            key={`${item.title}-${index}`}
            className={`private-flow-item tone-${item.tone ?? 'teal'}`}
            style={lift(entrance(frame, fps, 20 + index * 9), 22)}
          >
            <span>{item.label ?? String(index + 1).padStart(2, '0')}</span>
            <strong>{item.title}</strong>
            {item.body ? <p>{item.body}</p> : null}
          </div>
        ))}
      </div>
    )
  }

  if (spec.layout === 'split') {
    return (
      <div className="private-panels">
        {spec.panels?.map((panel, index) => (
          <div
            key={panel.title}
            className={`private-panel tone-${panel.tone ?? 'teal'}`}
            style={lift(entrance(frame, fps, 22 + index * 10), 24)}
          >
            <h2>{panel.title}</h2>
            {panel.body ? <p>{panel.body}</p> : null}
            {panel.items ? (
              <ul>
                {panel.items.map((item) => (
                  <li key={item.title}>
                    <strong>{item.title}</strong>
                    {item.body ? <span>{item.body}</span> : null}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="private-lesson-list">
      {spec.items?.map((item, index) => (
        <div
          key={`${item.title}-${index}`}
          className={`private-lesson tone-${item.tone ?? 'teal'}`}
          style={lift(entrance(frame, fps, 18 + index * 7), 18)}
        >
          {item.value ? <span>{item.value}</span> : null}
          <strong>{item.title}</strong>
          {item.body ? <p>{item.body}</p> : null}
        </div>
      ))}
      {spec.body ? <p className="private-closing-body">{spec.body}</p> : null}
    </div>
  )
}

function entrance(frame: number, fps: number, delay = 0) {
  return spring({
    frame: frame - delay,
    fps,
    config: { damping: 18, stiffness: 110 }
  })
}

function lift(value: number, distance = 32) {
  return {
    opacity: value,
    transform: `translateY(${(1 - value) * distance}px)`
  }
}
