/* eslint-disable react-refresh/only-export-components */
import { interpolate, spring, useVideoConfig } from 'remotion'
import type { SlideModule, SlideRenderContext } from '../../../src/types'

export const slides: SlideModule['slides'] = [
  {
    render: (props) => <OpeningSlide {...props} />
  },
  {
    render: (props) => <CodeSlide {...props} />
  },
  {
    render: (props) => <MotionSlide {...props} />
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
  const entrance = spring({ frame, fps, config: { damping: 17, stiffness: 120 } })
  const sweep = interpolate(frame, [12, 96], [-22, 118], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  })

  return (
    <section className="remotion-slide showcase-slide opening-slide">
      <div className="motion-grid" />
      <div className="showcase-orbit" style={{ transform: `rotate(${frame * 0.36}deg)` }}>
        <span />
        <span />
        <span />
      </div>
      <div
        className="light-sweep"
        style={{ transform: `translateX(${sweep}%) rotate(-12deg)` }}
      />
      <div
        className="showcase-copy"
        style={{
          opacity: entrance,
          transform: `translateY(${(1 - entrance) * 48}px)`
        }}
      >
        <span className="slide-kicker">presentations.ebisuda.net</span>
        <h1>
          HTMLで作る
          <br />
          撮影用プレゼン
        </h1>
        <p>
          Reactコンポーネント、CSS、Remotionの時間軸を使って、PowerPointでは届きにくい表現をそのままWebに公開する。
        </p>
      </div>
      <div className="opening-metrics">
        {[
          ['1280 x 1080', 'slide canvas'],
          ['640 x 1080', 'studio reserve'],
          ['URL + hash', 'shareable page']
        ].map(([value, label], index) => {
          const item = spring({
            frame: frame - 34 - index * 9,
            fps,
            config: { damping: 18 }
          })

          return (
            <div
              key={value}
              style={{
                opacity: item,
                transform: `translateY(${(1 - item) * 24}px)`
              }}
            >
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          )
        })}
      </div>
    </section>
  )
}

function CodeSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const editor = spring({ frame, fps, config: { damping: 20, stiffness: 100 } })
  const terminal = spring({ frame: frame - 54, fps, config: { damping: 18 } })
  const typed = Math.floor(interpolate(frame, [20, 112], [0, codeLines.length], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  }))

  return (
    <section className="remotion-slide code-slide">
      <div>
        <span className="slide-kicker">code generated decks</span>
        <h1>資料はコードとして増やせる</h1>
      </div>
      <div className="code-stage">
        <div
          className="code-editor"
          style={{
            opacity: editor,
            transform: `translateX(${(1 - editor) * -44}px) rotate(${(1 - editor) * -2}deg)`
          }}
        >
          <div className="code-window-bar">
            <span />
            <span />
            <span />
            <strong>slides.tsx</strong>
          </div>
          <pre>
            {codeLines.slice(0, typed).map((line) => (
              <code key={line}>{line}</code>
            ))}
            <code className="code-cursor">|</code>
          </pre>
        </div>
        <div
          className="terminal-card"
          style={{
            opacity: terminal,
            transform: `translateY(${(1 - terminal) * 34}px)`
          }}
        >
          <span>npm run check:recording</span>
          <strong>1920 x 1080 verified</strong>
          <p>ブラウザで実レンダリングして、撮影範囲を検証。</p>
        </div>
      </div>
    </section>
  )
}

function MotionSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const hero = spring({ frame, fps, config: { damping: 16 } })
  const progress = interpolate(frame, [18, 132], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  })

  return (
    <section className="remotion-slide motion-slide">
      <div>
        <span className="slide-kicker">remotion timeline</span>
        <h1>動きもプレゼンの部品</h1>
      </div>
      <div className="motion-showcase">
        <div
          className="motion-hero-card"
          style={{
            opacity: hero,
            transform: `scale(${0.92 + hero * 0.08})`
          }}
        >
          <span>transition</span>
          <strong>{Math.round(progress * 100)}%</strong>
          <div className="progress-rail">
            <i style={{ transform: `scaleX(${progress})` }} />
          </div>
        </div>
        <div className="motion-lanes">
          {['Spring', 'Timeline', 'Video', '3D ready'].map((label, index) => {
            const lane = spring({
              frame: frame - 24 - index * 11,
              fps,
              config: { damping: 20 }
            })

            return (
              <div
                key={label}
                style={{
                  opacity: lane,
                  transform: `translateX(${(1 - lane) * 70}px)`
                }}
              >
                <span>{label}</span>
                <i style={{ transform: `scaleX(${Math.min(1, progress + index * 0.08)})` }} />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function StudioLayoutSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const layout = spring({ frame, fps, config: { damping: 18 } })
  const marker = interpolate(frame, [18, 88], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp'
  })

  return (
    <section className="remotion-slide layout-slide">
      <div>
        <span className="slide-kicker">recording mode</span>
        <h1>
          全画面撮影は
          <br />
          1920 x 1080に固定
        </h1>
      </div>
      <div
        className="layout-diagram"
        style={{
          opacity: layout,
          transform: `translateY(${(1 - layout) * 36}px)`
        }}
      >
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
  const { fps } = useVideoConfig()
  const title = spring({ frame, fps, config: { damping: 18 } })

  return (
    <section className="remotion-slide archive-slide">
      <div
        style={{
          opacity: title,
          transform: `translateY(${(1 - title) * 30}px)`
        }}
      >
        <span className="slide-kicker">audience archive</span>
        <h1>撮影したあともURLで届く</h1>
      </div>
      <div className="archive-steps">
        {[
          ['1', '動画を選ぶ', 'YouTubeと資料を同じ場所へ'],
          ['2', '資料を読む', 'リンクもコピーもそのまま使える'],
          ['3', '#3で共有', 'スライド単位で指し示せる']
        ].map(([number, titleText, body], index) => {
          const item = spring({
            frame: frame - 24 - index * 14,
            fps,
            config: { damping: 18 }
          })

          return (
            <div
              key={number}
              style={{
                opacity: item,
                transform: `translateY(${(1 - item) * 36}px)`
              }}
            >
              <strong>{number}</strong>
              <span>{titleText}</span>
              <p>{body}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}

const codeLines = [
  'export const slides = [',
  '  { render: () => <OpeningSlide /> },',
  '  { render: () => <CodeDemo /> },',
  '  { render: () => <StudioLayout /> },',
  ']',
  '',
  'metadata.visibility = "public"',
  'metadata.youtube.id = "manual"'
]
