/* eslint-disable react-refresh/only-export-components */
import { spring, useVideoConfig } from 'remotion'
import type { SlideModule, SlideRenderContext } from '../../../src/types'
import { LogoMark } from '../../../src/deck-shared'

export const slides: SlideModule['slides'] = [
  { id: 'opening', render: (props) => <OpeningSlide {...props} /> },
  { id: 'three-models', render: (props) => <ThreeModelsSlide {...props} /> },
  { id: 'same-prompt', render: (props) => <SamePromptSlide {...props} /> },
  { id: 'second-round', render: (props) => <SecondRoundSlide {...props} /> },
  { id: 'speed', render: (props) => <SpeedSlide {...props} /> },
  { id: 'price', render: (props) => <PriceSlide {...props} /> },
  { id: 'decision', render: (props) => <DecisionSlide {...props} /> },
  { id: 'reusable', render: (props) => <ReusableSlide {...props} /> }
]

/** Pure helper (not a hook): spring-based entrance value for staggered items. */
function entrance(frame: number, fps: number, delay = 0) {
  return spring({ frame: frame - delay, fps, config: { damping: 20, stiffness: 110 } })
}

function lift(value: number, distance = 32) {
  return { opacity: value, transform: `translateY(${(1 - value) * distance}px)` }
}

const COMPARISON_BASE = '/decks/gpt-image-2-5'

type Shot = { file: string; model: string; caption: string }

const ROUND_TWO: Shot[] = [
  { file: 'r2-gpt-image-2.webp', model: 'gpt-image-2', caption: '旧モデル' },
  { file: 'r2-flare.webp', model: 'gpt-image-2.5-flare', caption: '新・速度重視' },
  { file: 'r2-sunburst.webp', model: 'gpt-image-2.5-sunburst', caption: '新・高忠実度' }
]

const ROUND_ONE: Shot[] = [
  { file: 'r1-gpt-image-2.webp', model: 'gpt-image-2', caption: '旧モデル' },
  { file: 'r1-flare.webp', model: 'gpt-image-2.5-flare', caption: '新・速度重視' },
  { file: 'r1-sunburst.webp', model: 'gpt-image-2.5-sunburst', caption: '新・高忠実度' }
]

function ShotStrip({ shots, frame, fps }: { shots: Shot[]; frame: number; fps: number }) {
  return (
    <div className="gi25-strip">
      {shots.map((shot, index) => (
        <figure key={shot.file} className="gi25-shot" style={lift(entrance(frame, fps, 10 + index * 6), 24)}>
          <img src={`${COMPARISON_BASE}/${shot.file}`} alt={`${shot.model} が生成したサムネイル`} />
          <figcaption>
            <span className="gi25-shot-caption">{shot.caption}</span>
          </figcaption>
        </figure>
      ))}
    </div>
  )
}

function OpeningSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const title = entrance(frame, fps)
  const sub = entrance(frame, fps, 14)

  return (
    <section className="remotion-slide gi25-slide gi25-opening">
      <LogoMark />
      <div className="gi25-opening-copy" style={lift(title, 44)}>
        <span className="slide-kicker">Azure AI Foundry ─ 画像生成モデルの選び直し</span>
        <h1>
          画像1枚<span className="gi25-strike">18円</span>が
          <br />
          <span className="gi25-accent">4.7円</span>になりました
        </h1>
      </div>
      <p className="gi25-opening-lead" style={lift(sub, 28)}>
        3モデル・2ラウンド・計6枚の実測と、請求データから逆算した単価で決めた話
      </p>
    </section>
  )
}

function ThreeModelsSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const models = [
    { name: 'gpt-image-2', version: '2026-04-21', role: 'これまでの既定', tone: 'old' },
    { name: 'gpt-image-2.5-flare', version: '2026-09-08', role: '速度重視', tone: 'new' },
    { name: 'gpt-image-2.5-sunburst', version: '2026-09-08', role: '高忠実度・精密編集', tone: 'new' }
  ]

  return (
    <section className="remotion-slide gi25-slide">
      <LogoMark />
      <span className="slide-kicker">前提</span>
      <h1>同じリージョンに3つ並んだ</h1>
      <div className="gi25-models">
        {models.map((model, index) => (
          <article
            key={model.name}
            className={`gi25-model gi25-model-${model.tone}`}
            style={lift(entrance(frame, fps, 8 + index * 8), 28)}
          >
            <span className="gi25-model-role">{model.role}</span>
            <h2>{model.name}</h2>
            <p>version {model.version}</p>
          </article>
        ))}
      </div>
      <p className="gi25-note" style={lift(entrance(frame, fps, 34), 20)}>
        3つとも一般提供済み。デプロイを足すだけで比べられる
      </p>
    </section>
  )
}

function SamePromptSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()

  return (
    <section className="remotion-slide gi25-slide gi25-gallery">
      <LogoMark />
      <span className="slide-kicker">実測 ─ 2ラウンド目</span>
      <h1>同じプロンプトで作った3枚</h1>
      <ShotStrip shots={ROUND_TWO} frame={frame} fps={fps} />
      <p className="gi25-verdict" style={lift(entrance(frame, fps, 34), 20)}>
        日本語はどれも完璧。<strong>見分けがつかない</strong>
      </p>
    </section>
  )
}

function SecondRoundSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()

  return (
    <section className="remotion-slide gi25-slide gi25-gallery">
      <LogoMark />
      <span className="slide-kicker">実測 ─ 1ラウンド目</span>
      <h1>題材を変えても同じだった</h1>
      <ShotStrip shots={ROUND_ONE} frame={frame} fps={fps} />
      <p className="gi25-verdict" style={lift(entrance(frame, fps, 34), 20)}>
        計6枚、日本語の破綻は<strong>ゼロ</strong>。差は絵の作り込みの方に出た
      </p>
    </section>
  )
}

function SpeedSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const rows = [
    { name: 'gpt-image-2', seconds: [93.5, 98.3], ratio: '基準', tone: 'old' },
    { name: 'gpt-image-2.5-flare', seconds: [30.9, 28.2], ratio: '約3.4倍速', tone: 'fast' },
    { name: 'gpt-image-2.5-sunburst', seconds: [57.1, 47.0], ratio: '約1.8倍速', tone: 'new' }
  ]
  const longest = 98.3

  return (
    <section className="remotion-slide gi25-slide">
      <LogoMark />
      <span className="slide-kicker">実測 ─ 生成時間</span>
      <h1>1280x720・最高品質・1枚あたり</h1>
      <div className="gi25-bars">
        {rows.map((row, index) => {
          const average = (row.seconds[0] + row.seconds[1]) / 2
          const value = entrance(frame, fps, 8 + index * 8)
          return (
            <div key={row.name} className={`gi25-bar-row gi25-bar-${row.tone}`} style={lift(value, 22)}>
              <span className="gi25-bar-name">{row.name}</span>
              <div className="gi25-bar-track">
                <div className="gi25-bar-fill" style={{ width: `${(average / longest) * 100 * value}%` }} />
              </div>
              <span className="gi25-bar-value">
                {row.seconds[0]}s / {row.seconds[1]}s
              </span>
              <span className="gi25-bar-ratio">{row.ratio}</span>
            </div>
          )
        })}
      </div>
      <p className="gi25-note" style={lift(entrance(frame, fps, 34), 20)}>
        2ラウンドとも順位も比率もほぼ同じ。題材によらない構造的な差
      </p>
    </section>
  )
}

function PriceSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const steps = [
    { label: '公開されている価格表', body: '新しいモデルの単価は未掲載。1つ前の世代までしか載っていない' },
    { label: '請求額 ÷ 使用量', body: '画像出力は100万トークンあたり4,779.6円。公表レートとほぼ一致した' },
    { label: '単価は3モデル共通', body: '新しいから高い、ということはなかった' },
    { label: '違ったのはトークン量', body: '旧モデルだけ1枚3,787トークン。新しい2つはどちらも947トークン' }
  ]

  return (
    <section className="remotion-slide gi25-slide gi25-price">
      <LogoMark />
      <span className="slide-kicker">実測 ─ 料金</span>
      <h1>単価は同じ。トークンが4倍</h1>
      <ol className="gi25-steps">
        {steps.map((step, index) => (
          <li key={step.label} style={lift(entrance(frame, fps, 6 + index * 7), 22)}>
            <span className="gi25-step-index">{String(index + 1).padStart(2, '0')}</span>
            <div>
              <h2>{step.label}</h2>
              <p>{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
      <div className="gi25-price-result" style={lift(entrance(frame, fps, 38), 22)}>
        <span>1枚あたり</span>
        <strong className="gi25-price-old">約18.2円</strong>
        <span className="gi25-price-arrow">→</span>
        <strong className="gi25-price-new">約4.7円</strong>
      </div>
    </section>
  )
}

function DecisionSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const reasons = [
    '日本語の精度では差がつかず、既定を据え置いていた根拠が消えた',
    '旧モデルは遅い・トークン4倍・絵も古い。3つとも負けている',
    '新モデル2つは出力トークンが同数。払うのは生成時間の差だけ',
    'サムネイルは1日数枚。20秒より画質を取る'
  ]

  return (
    <section className="remotion-slide gi25-slide">
      <LogoMark />
      <span className="slide-kicker">結論</span>
      <h1>
        既定を <span className="gi25-accent">sunburst</span> に固定した
      </h1>
      <ul className="gi25-reasons">
        {reasons.map((reason, index) => (
          <li key={reason} style={lift(entrance(frame, fps, 8 + index * 7), 22)}>
            {reason}
          </li>
        ))}
      </ul>
      <p className="gi25-note" style={lift(entrance(frame, fps, 38), 20)}>
        量産用途は flare が正解。引数でモデルを切り替えられるようにしてある
      </p>
    </section>
  )
}

function ReusableSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const steps = [
    '価格表APIは新しいモデルにすぐ追いつくとは限らない',
    '一度使えば、請求額と使用量の両方が記録に残る',
    '割れば単価が出る。公表レートと突き合わせれば検算になる',
    '単価が同じなら、残る差は1枚あたりのトークン量だけ'
  ]

  return (
    <section className="remotion-slide gi25-slide">
      <LogoMark />
      <span className="slide-kicker">持ち帰り</span>
      <h1>単価は、自分の請求から逆算できる</h1>
      <ol className="gi25-takeaway">
        {steps.map((step, index) => (
          <li key={step} style={lift(entrance(frame, fps, 8 + index * 7), 22)}>
            {step}
          </li>
        ))}
      </ol>
      <p className="gi25-closing" style={lift(entrance(frame, fps, 38), 22)}>
        新しいモデルが出るたびに、<strong>自分の請求額で決められる</strong>
      </p>
    </section>
  )
}
