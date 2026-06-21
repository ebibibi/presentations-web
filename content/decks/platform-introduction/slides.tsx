/* eslint-disable react-refresh/only-export-components */
import { interpolate, spring, useVideoConfig } from 'remotion'
import type { SlideModule, SlideRenderContext } from '../../../src/types'

export const slides: SlideModule['slides'] = [
  {
    render: (props) => <OpeningSlide {...props} />
  },
  {
    render: (props) => <StudioLayoutSlide {...props} />
  },
  {
    render: (props) => <ArchiveSlide {...props} />
  }
]

function OpeningSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const entrance = spring({ frame, fps, config: { damping: 18 } })
  const accent = interpolate(frame, [0, 80], [0, 1], {
    extrapolateRight: 'clamp'
  })

  return (
    <section className="remotion-slide opening-slide">
      <div className="slide-kicker">presentations.ebisuda.net</div>
      <h1 style={{ transform: `translateY(${(1 - entrance) * 40}px)` }}>
        Web Presentation Platform
      </h1>
      <p>
        動画撮影のための表示と、視聴者が後から読むための資料共有を、同じReactコードから届ける。
      </p>
      <div className="opening-bars" style={{ opacity: accent }}>
        <span />
        <span />
        <span />
      </div>
    </section>
  )
}

function StudioLayoutSlide({ frame }: SlideRenderContext) {
  const marker = interpolate(frame, [10, 70], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  })

  return (
    <section className="remotion-slide layout-slide">
      <div>
        <span className="slide-kicker">studio layout</span>
        <h1>
          左2/3は資料
          <br />
          右1/3は撮影支援
        </h1>
      </div>
      <div className="layout-diagram">
        <div className="layout-main">
          <strong>1280 x 1080</strong>
          <span>slide canvas</span>
        </div>
        <div className="layout-side">
          <strong>640 x 1080</strong>
          <span>face / notes / AI cues</span>
        </div>
        <div className="layout-marker" style={{ transform: `scaleX(${marker})` }} />
      </div>
    </section>
  )
}

function ArchiveSlide({ frame }: SlideRenderContext) {
  const first = interpolate(frame, [0, 40], [0, 1], {
    extrapolateRight: 'clamp'
  })
  const second = interpolate(frame, [30, 80], [0, 1], {
    extrapolateRight: 'clamp'
  })
  const third = interpolate(frame, [70, 120], [0, 1], {
    extrapolateRight: 'clamp'
  })

  return (
    <section className="remotion-slide archive-slide">
      <span className="slide-kicker">archive</span>
      <h1>動画と資料の導線を短くする</h1>
      <div className="archive-steps">
        <div style={{ opacity: first }}>
          <strong>1</strong>
          <span>動画を選ぶ</span>
        </div>
        <div style={{ opacity: second }}>
          <strong>2</strong>
          <span>資料を見る</span>
        </div>
        <div style={{ opacity: third }}>
          <strong>3</strong>
          <span>必要なページを共有</span>
        </div>
      </div>
    </section>
  )
}
