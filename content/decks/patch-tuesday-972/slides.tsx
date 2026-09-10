/* eslint-disable react-refresh/only-export-components */
import type { ReactNode } from 'react'
import { interpolate, spring, useVideoConfig } from 'remotion'
import { Boxes, Globe, ShieldAlert, Siren, Timer, Worm } from 'lucide-react'
import { LogoMark } from '../../../src/deck-shared'
import type { SlideModule, SlideRenderContext } from '../../../src/types'
import './styles.css'

export const slides: SlideModule['slides'] = [
  { id: 'opening', render: (props) => <OpeningSlide {...props} /> },
  { id: 'chart-year', render: (props) => <YearChartSlide {...props} /> },
  { id: 'chart-month', render: (props) => <MonthChartSlide {...props} /> },
  { id: 'why', render: (props) => <WhySlide {...props} /> },
  { id: 'triage', render: (props) => <TriageSlide {...props} /> },
  { id: 'recap', render: (props) => <RecapSlide {...props} /> },
]

const SOURCES = {
  ars: 'https://arstechnica.com/security/2026/09/microsoft-patches-a-record-972-vulnerabilities-112-of-them-critical/',
  zdi: 'https://www.zerodayinitiative.com/blog/2026/9/8/the-september-2026-security-update-review',
  msrc: 'https://msrc.microsoft.com/update-guide/',
}

/** 数えた条件は1か所に書いて、両方のグラフで同じ文言を使う。 */
const COUNT_NOTE =
  'MSRCのCVRF APIを月ごとに取得し、Microsoft Edge (Chromium-based) と Azure Linux (Mariner) のCVEを除いて数えた件数'

/**
 * 入場アニメーションの共通形。delayフレーム後に下から立ち上がる。
 * DeckViewerは各スライドをフレーム112で「落ち着いた状態」として静止させるので、
 * delayは78を超えないこと。超えた要素は再生しない閲覧者に永久に見えない。
 */
function rise(frame: number, delay: number, fps: number) {
  return spring({ frame: frame - delay, fps, config: { damping: 18, stiffness: 105 } })
}

function riseStyle(progress: number, distance = 26) {
  return {
    opacity: progress,
    transform: `translateY(${(1 - progress) * distance}px)`,
  }
}

function Shell({
  children,
  eyebrow,
  footer,
  frame,
  title,
}: {
  children: ReactNode
  eyebrow: string
  footer?: ReactNode
  frame: number
  title: ReactNode
}) {
  const { fps } = useVideoConfig()
  const head = rise(frame, 0, fps)
  const foot = rise(frame, 24, fps)

  return (
    <section className="remotion-slide pt972-slide pt972-standard">
      <div className="pt972-grid" />
      <LogoMark className="pt972-logo" />
      <header className="pt972-page-head" style={riseStyle(head, 18)}>
        <span>{eyebrow}</span>
        <h1>{title}</h1>
      </header>
      <main className="pt972-page-body">{children}</main>
      <footer className="pt972-page-footer" style={{ opacity: foot }}>
        <span>2026年9月 Microsoft月例更新</span>
        <div>{footer}</div>
      </footer>
    </section>
  )
}

function Src({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noreferrer">
      {children}
    </a>
  )
}

type Bar = { label: string; value: number; accent?: boolean }

/**
 * 単系列の棒グラフ。棒は左から順に伸び、値は伸びに合わせて数え上がる。
 * 値を棒の上に直接置くので、凡例も目盛りも要らない。
 */
function BarChart({
  bars,
  caption,
  captionDelay,
  frame,
  height = 470,
  startDelay,
  step,
}: {
  bars: Bar[]
  caption: string
  captionDelay: number
  frame: number
  height?: number
  startDelay: number
  step: number
}) {
  const { fps } = useVideoConfig()
  const width = 1120
  const top = 54
  const bottom = 62
  const plot = height - top - bottom
  const max = Math.max(...bars.map((b) => b.value))
  const slot = width / bars.length
  const barWidth = Math.min(96, slot * 0.56)
  const axis = interpolate(frame, [startDelay - 8, startDelay + 14], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const captionProgress = rise(frame, captionDelay, fps)

  return (
    <figure className="pt972-chart">
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={caption}>
        <line
          className="pt972-axis"
          x1={0}
          x2={width * axis}
          y1={height - bottom}
          y2={height - bottom}
        />
        {bars.map((bar, index) => {
          const grow = spring({
            frame: frame - startDelay - index * step,
            fps,
            config: { damping: 20, stiffness: 90 },
          })
          const barHeight = Math.max(2, (bar.value / max) * plot * grow)
          const x = index * slot + (slot - barWidth) / 2
          const y = height - bottom - barHeight
          const shown = Math.round(bar.value * grow)

          return (
            <g key={bar.label}>
              <rect
                className={bar.accent ? 'pt972-bar is-accent' : 'pt972-bar'}
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                rx={6}
              />
              <text
                className={bar.accent ? 'pt972-bar-value is-accent' : 'pt972-bar-value'}
                x={x + barWidth / 2}
                y={y - 14}
                textAnchor="middle"
                opacity={grow}
              >
                {shown.toLocaleString('en-US')}
              </text>
              <text
                className="pt972-bar-label"
                x={x + barWidth / 2}
                y={height - bottom + 34}
                textAnchor="middle"
                opacity={grow}
              >
                {bar.label}
              </text>
            </g>
          )
        })}
      </svg>
      <figcaption style={{ opacity: captionProgress }}>{caption}</figcaption>
    </figure>
  )
}

const YEAR_BARS: Bar[] = [
  { label: '2021', value: 871 },
  { label: '2022', value: 944 },
  { label: '2023', value: 948 },
  { label: '2024', value: 1069 },
  { label: '2025', value: 1242 },
  { label: '2026*', value: 2871, accent: true },
]

const MONTH_BARS: Bar[] = [
  { label: '1月', value: 125 },
  { label: '2月', value: 61 },
  { label: '3月', value: 97 },
  { label: '4月', value: 183 },
  { label: '5月', value: 156 },
  { label: '6月', value: 221 },
  { label: '7月', value: 606 },
  { label: '8月', value: 449 },
  { label: '9月', value: 973, accent: true },
]

function OpeningSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const entrance = spring({ frame, fps, config: { damping: 17, stiffness: 120 } })
  const counted = Math.round(
    interpolate(frame, [12, 70], [0, 972], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  )
  const sweep = interpolate(frame, [10, 110], [-24, 120], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const lead = rise(frame, 56, fps)

  return (
    <section className="remotion-slide pt972-slide pt972-opening">
      <div className="pt972-grid" />
      <div className="pt972-sweep" style={{ transform: `translateX(${sweep}%) rotate(-12deg)` }} />
      <LogoMark className="pt972-logo" />
      <div className="pt972-opening-copy">
        <span style={{ opacity: entrance }}>SECURITY / PATCH TUESDAY</span>
        <h1 style={riseStyle(entrance, 36)}>
          1か月で
          <br />
          <em>{counted.toLocaleString('en-US')}件</em>
        </h1>
        <p style={riseStyle(lead)}>
          2026年9月のMicrosoft月例更新は、新規CVEが過去最多の972件になりました。
          先月が約620件、その前が570件です。
        </p>
      </div>
      <div className="pt972-opening-side">
        {[
          { label: 'Critical', value: '114件', note: 'Ars Technicaは112件としている' },
          { label: '悪用中のゼロデイ', value: '2件', note: 'いずれもWindowsの権限昇格' },
          { label: '2026年の累計', value: '約2,900件', note: '2025年1年間の2倍以上' },
        ].map((item, index) => {
          const progress = rise(frame, 62 + index * 8, fps)
          return (
            <article key={item.label} className="pt972-open-card" style={riseStyle(progress)}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
              <small>{item.note}</small>
            </article>
          )
        })}
      </div>
    </section>
  )
}

function YearChartSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const note = rise(frame, 78, fps)

  return (
    <Shell
      eyebrow="年別"
      frame={frame}
      title="5年ぶん横ばいだったものが、今年だけ跳ねた"
      footer={<Src href={SOURCES.msrc}>データ: Microsoft Security Update Guide (CVRF)</Src>}
    >
      <BarChart
        bars={YEAR_BARS}
        caption={`年ごとのMicrosoft CVE件数。* 2026年は1月〜9月の合計。${COUNT_NOTE}。`}
        captionDelay={70}
        frame={frame}
        startDelay={14}
        step={10}
      />
      <p className="pt972-note" style={riseStyle(note)}>
        <Timer />
        2021年から2025年までは年900〜1,200件台。2026年は9月の時点で、その2倍以上に達しています。
      </p>
    </Shell>
  )
}

function MonthChartSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const note = rise(frame, 78, fps)

  return (
    <Shell
      eyebrow="月別"
      frame={frame}
      title="跳ねたのは、今年の夏から"
      footer={<Src href={SOURCES.msrc}>データ: Microsoft Security Update Guide (CVRF)</Src>}
    >
      <BarChart
        bars={MONTH_BARS}
        caption={`2026年の月ごとのMicrosoft CVE件数。${COUNT_NOTE}。`}
        captionDelay={70}
        frame={frame}
        startDelay={14}
        step={7}
      />
      <p className="pt972-note" style={riseStyle(note)}>
        <ShieldAlert />
        6月まで月100〜200件台。7月に跳ね、9月に1,000件近くへ。月ごとの値は集計元で違いますが、跳ねた時期は一致します。
      </p>
    </Shell>
  )
}

function WhySlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const first = rise(frame, 16, fps)
  const arrow = rise(frame, 44, fps)
  const second = rise(frame, 56, fps)
  const note = rise(frame, 78, fps)

  return (
    <Shell
      eyebrow="原因と、まだ起きていないこと"
      frame={frame}
      title="増えたのは「発見の速度」"
      footer={<Src href={SOURCES.zdi}>Zero Day Initiative / Dustin Childs</Src>}
    >
      <div className="pt972-two">
        <article className="pt972-panel is-blue" style={riseStyle(first, 34)}>
          <ShieldAlert />
          <strong>AIが脆弱性を見つけるようになった</strong>
          <p>
            製品が急に脆くなったのではありません。元からあったものが先に見つかり、
            修正として公開される数が跳ね上がりました。
          </p>
        </article>
        <span className="pt972-between" style={{ opacity: arrow }}>
          だが
        </span>
        <article className="pt972-panel is-red" style={riseStyle(second, 34)}>
          <Siren />
          <strong>悪用の急増は、まだ来ていない</strong>
          <p>
            件数の増加に比例した実際の悪用は、まだ観測されていないとZDIは書いています。
            今は追いかける時間ではなく、選び方を決める時間です。
          </p>
        </article>
      </div>
      <p className="pt972-note" style={riseStyle(note)}>
        <Worm />
        ただし公開された瞬間から、攻撃側も同じ情報を読めます。猶予は無期限ではありません。
      </p>
    </Shell>
  )
}

const TRIAGE_STEPS = [
  {
    head: '悪用が確認されているもの',
    body: '今月は2件。Windows Updateのスタックと、ALPCの権限昇格',
  },
  {
    head: 'インターネットから届く資産',
    body: 'Exchange（メール受信だけでコード実行に至りうるもの）、SharePoint 17件、リモートデスクトップの深刻度9.8',
  },
  {
    head: 'ワーム性のあるもの',
    body: '利用者の操作なしで広がる種類。20件を超えたところでZDIは数えるのをやめた',
  },
  {
    head: '自分が実際に持っている製品',
    body: '資産の一覧が先。持っていない製品のCVEは読まなくていい',
  },
]

function TriageSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const note = rise(frame, 78, fps)

  return (
    <Shell
      eyebrow="運用"
      frame={frame}
      title="全部読む運用は、もう成り立たない"
      footer={<span>CVE番号ではなく、資産の名前で優先順位を付ける</span>}
    >
      <div className="pt972-steps">
        {TRIAGE_STEPS.map((step, index) => {
          const progress = rise(frame, 16 + index * 14, fps)
          return (
            <article key={step.head} className="pt972-step" style={riseStyle(progress, 20)}>
              <span>{index + 1}</span>
              <div>
                <strong>{step.head}</strong>
                <small>{step.body}</small>
              </div>
            </article>
          )
        })}
      </div>
      <p className="pt972-note" style={riseStyle(note)}>
        <Globe />
        件数が3倍になっても、この順番なら読む量は増えません。
      </p>
    </Shell>
  )
}

const RECAP_LINES = [
  '2026年9月の月例更新は新規CVE 972件、Critical 114件、悪用中のゼロデイ2件。過去最多です。',
  '原因はAI支援の脆弱性発見。件数は跳ねましたが、悪用の急増はまだ観測されていません。',
  '悪用中 → 外部公開 → ワーム性 → 保有製品の順で絞る。件数そのものは指標にしない。',
]

function RecapSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const links = rise(frame, 74, fps)
  const note = rise(frame, 60, fps)

  return (
    <Shell
      eyebrow="まとめ"
      frame={frame}
      title="読む量ではなく、選び方を変える"
      footer={<Src href={SOURCES.ars}>元記事: Ars Technica</Src>}
    >
      <div className="pt972-recap">
        {RECAP_LINES.map((line, index) => {
          const progress = rise(frame, 16 + index * 14, fps)
          return (
            <article key={line} style={riseStyle(progress, 20)}>
              <strong>{index + 1}</strong>
              <p>{line}</p>
            </article>
          )
        })}
      </div>
      <p className="pt972-note" style={riseStyle(note)}>
        <Boxes />
        見るべきなのは、公開から適用までの日数と、未適用の資産の台数です。
      </p>
      <div className="pt972-links" style={{ opacity: links }}>
        <Src href={SOURCES.zdi}>ZDI: The September 2026 Security Update Review</Src>
        <Src href={SOURCES.ars}>Ars Technica: Why this month's Microsoft patch release is a doozy</Src>
      </div>
    </Shell>
  )
}
