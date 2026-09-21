/* eslint-disable react-refresh/only-export-components */
import {
  Brain,
  ClipboardCheck,
  Coins,
  FlaskConical,
  Link2,
  Lock,
  Ruler,
  ShieldCheck,
  Shuffle,
  TriangleAlert,
  Wrench
} from 'lucide-react'
import { spring, useVideoConfig } from 'remotion'
import type { SlideModule, SlideRenderContext } from '../../../src/types'
import { CtaSlide, LogoMark } from '../../../src/deck-shared'
import './styles.css'

export const slides: SlideModule['slides'] = [
  { id: 'opening', render: (props) => <OpeningSlide {...props} /> },
  { id: 'profile', render: (props) => <ProfileSlide {...props} /> },
  { id: 'what-is-harness', render: (props) => <WhatIsHarnessSlide {...props} /> },
  { id: 'the-study', render: (props) => <TheStudySlide {...props} /> },
  { id: 'finding-1', render: (props) => <FindingOneSlide {...props} /> },
  { id: 'the-example', render: (props) => <TheExampleSlide {...props} /> },
  { id: 'finding-2', render: (props) => <FindingTwoSlide {...props} /> },
  { id: 'finding-3', render: (props) => <FindingThreeSlide {...props} /> },
  { id: 'caveat', render: (props) => <CaveatSlide {...props} /> },
  { id: 'section-my-take', render: (props) => <SectionMyTakeSlide {...props} /> },
  { id: 'my-take', render: (props) => <MyTakeSlide {...props} /> },
  { id: 'my-setup', render: (props) => <MySetupSlide {...props} /> },
  { id: 'management', render: (props) => <ManagementSlide {...props} /> },
  { id: 'recap', render: (props) => <RecapSlide {...props} /> },
  { id: 'sources', render: (props) => <SourcesSlide {...props} /> },
  { id: 'cta', render: (props) => <CtaSlide {...props} /> }
]

function entrance(frame: number, fps: number, delay = 0) {
  return spring({ frame: frame - delay, fps, config: { damping: 18, stiffness: 105 } })
}

function lift(value: number, distance = 26) {
  return { opacity: value, transform: `translateY(${(1 - value) * distance}px)` }
}

function Header({ kicker, title, frame }: { kicker: string; title: React.ReactNode; frame: number }) {
  const { fps } = useVideoConfig()
  return (
    <div className="hxt-head" style={lift(entrance(frame, fps), 22)}>
      <span className="slide-kicker">{kicker}</span>
      <h1>{title}</h1>
    </div>
  )
}

function Punch({ frame, delay = 70, children }: { frame: number; delay?: number; children: React.ReactNode }) {
  const { fps } = useVideoConfig()
  return (
    <p className="hxt-punch" style={lift(entrance(frame, fps, delay), 14)}>
      {children}
    </p>
  )
}

function OpeningSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide opening-slide hxt-slide hxt-opening">
      <div className="motion-grid" />
      <LogoMark />
      <div className="showcase-copy">
        <span className="slide-kicker hxt-alarm" style={lift(entrance(frame, fps), 18)}>
          UC BERKELEY / ARENA ─ HARNESS TAX
        </span>
        <h1 style={lift(entrance(frame, fps, 10), 26)}>
          AI導入で
          <br />
          最初にツールを決める会社が、
          <br />
          一番損をする
        </h1>
        <p style={lift(entrance(frame, fps, 26), 18)}>
          同じモデル、同じ仕事、<b>成功率の差は2%</b>。
          <br />
          それでも<b>コストは2倍</b>違いました。
        </p>
      </div>
    </section>
  )
}

function ProfileSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const facts = ['Microsoft MVP 14年連続', 'Windows Server / Azure / Azure Hybrid', 'Claude と Codex を併用して運用', '著書「Windowsインフラ管理者入門」']
  return (
    <section className="remotion-slide hxt-slide">
      <Header kicker="YOUR GUIDE" title="解説する人：胡田 昌彦" frame={frame} />
      <div className="hxt-profile">
        <div className="hxt-profile-mark" style={lift(entrance(frame, fps, 16), 22)}>
          <LogoMark className="hxt-profile-logo" />
          <strong>
            Masahiko
            <br />
            Ebisuda
          </strong>
          <span>えびすだ まさひこ</span>
        </div>
        <div className="hxt-profile-facts">
          {facts.map((fact, i) => (
            <div key={fact} style={lift(entrance(frame, fps, 28 + i * 10), 16)}>
              <ShieldCheck size={24} />
              <strong>{fact}</strong>
            </div>
          ))}
        </div>
      </div>
      <Punch frame={frame} delay={72}>
        研究の紹介から入りますが、最後は<b>自分の運用の話</b>に着地します。
      </Punch>
    </section>
  )
}

function WhatIsHarnessSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const parts = [
    { icon: Brain, term: 'モデル', gloss: '頭脳', detail: 'Claude / GPT / Kimi など。考える側' },
    { icon: Wrench, term: 'ハーネス', gloss: '手足と作業環境', detail: 'Claude Code / Codex CLI / Pi など。道具・文脈・実行順を管理する側' }
  ]
  return (
    <section className="remotion-slide hxt-slide">
      <Header kicker="THE SETUP" title="モデルは頭脳、ハーネスは手足" frame={frame} />
      <div className="hxt-parts">
        {parts.map((part, i) => {
          const Icon = part.icon
          return (
            <div key={part.term} style={lift(entrance(frame, fps, 18 + i * 16), 20)}>
              <Icon size={46} />
              <strong>{part.term}</strong>
              <em>{part.gloss}</em>
              <span>{part.detail}</span>
            </div>
          )
        })}
      </div>
      <Punch frame={frame} delay={78}>
        私たちは「どのモデルか」だけを話しますが、<b>実際には必ずセットで選んでいます</b>。
      </Punch>
    </section>
  )
}

function TheStudySlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const facts = [
    { label: '実施', value: 'UC Berkeley / Arena' },
    { label: '著者に', value: 'Ion Stoica・Matei Zaharia' },
    { label: '比較', value: '7モデル × 3ハーネス = 21通り' },
    { label: 'ハーネス', value: 'Claude Code / Codex CLI / Pi' },
    { label: '課題', value: 'SWE-bench Lite・Terminal-Bench 2.0 から各30問' },
    { label: '試行', value: '1問につき3回。価格は2026-09-01の直販API価格で統一' }
  ]
  return (
    <section className="remotion-slide hxt-slide">
      <Header kicker="THE STUDY" title="誰が、何を測ったのか" frame={frame} />
      <div className="hxt-facts">
        {facts.map((fact, i) => (
          <div key={fact.label} style={lift(entrance(frame, fps, 12 + i * 9), 14)}>
            <span>{fact.label}</span>
            <strong>{fact.value}</strong>
          </div>
        ))}
      </div>
      <Punch frame={frame} delay={82}>
        素性としては<b>十分</b>です。だからこの数字は一度、受け止める価値がある。
      </Punch>
    </section>
  )
}

function FindingOneSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const bars = [
    { label: '成功率の差', value: '±2 〜 5%', tone: 'small' as const, note: 'SWE-bench Lite で±2%／Terminal-Bench 2.0 で±5%' },
    { label: 'コストの差', value: '平均 2.0倍', tone: 'large' as const, note: 'Claude Code は Pi の約2.0倍・Codex の約1.6倍（幾何平均）' }
  ]
  return (
    <section className="remotion-slide hxt-slide">
      <Header kicker="FINDING 1 / 3" title="効くのは正確さではなく、コスト" frame={frame} />
      <div className="hxt-bars">
        {bars.map((bar, i) => (
          <div key={bar.label} className={`hxt-bar hxt-bar-${bar.tone}`} style={lift(entrance(frame, fps, 18 + i * 18), 22)}>
            <span className="hxt-bar-label">{bar.label}</span>
            <strong>{bar.value}</strong>
            <span className="hxt-bar-note">{bar.note}</span>
          </div>
        ))}
      </div>
      <Punch frame={frame} delay={84}>
        研究チームはこれを <b>Harness Tax（ハーネス税）</b> と呼んでいます。
      </Punch>
    </section>
  )
}

function TheExampleSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const rows = [
    { harness: 'Claude Code', success: '97.8%', cost: '$1.33', turns: '15.3', highlight: true },
    { harness: 'Codex CLI', success: '96.7%', cost: '─', turns: '─', highlight: false },
    { harness: 'Pi', success: '96.7%', cost: '$0.67', turns: '15.4', highlight: false }
  ]
  return (
    <section className="remotion-slide hxt-slide">
      <Header kicker="THE EXAMPLE" title="成功率1.1%の差に、2倍の価格" frame={frame} />
      <table className="hxt-table" style={lift(entrance(frame, fps, 16), 20)}>
        <thead>
          <tr>
            <th>ハーネス（モデルは Fable 5 で固定）</th>
            <th>成功率</th>
            <th>1回あたりコスト</th>
            <th>ターン数</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.harness} className={row.highlight ? 'hxt-row-costly' : undefined}>
              <td>{row.harness}</td>
              <td>{row.success}</td>
              <td>{row.cost}</td>
              <td>{row.turns}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Punch frame={frame} delay={76}>
        やりとりの回数はほぼ同じ。つまり<b>1ターンあたりの単価が違う</b>ということです。
      </Punch>
    </section>
  )
}

function FindingTwoSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const tools = ['read', 'write', 'edit', 'bash']
  return (
    <section className="remotion-slide hxt-slide">
      <Header kicker="FINDING 2 / 3" title="単純なハーネスが強い" frame={frame} />
      <div className="hxt-tools" style={lift(entrance(frame, fps, 16), 20)}>
        <span className="hxt-tools-label">Pi が持っている道具は、この4つだけ</span>
        <div className="hxt-tools-row">
          {tools.map((tool, i) => (
            <code key={tool} style={lift(entrance(frame, fps, 26 + i * 8), 14)}>
              {tool}
            </code>
          ))}
        </div>
      </div>
      <div className="hxt-context" style={lift(entrance(frame, fps, 62), 20)}>
        <Ruler size={38} />
        <div>
          <strong>最初の呼び出しで渡す文脈量は Claude Code が Pi の 10倍以上</strong>
          <span>長い指示と大きなツール定義が、毎回のやりとりに乗る</span>
        </div>
      </div>
      <Punch frame={frame} delay={86}>
        ハーネス税は、<b>1回目の呼び出しから始まっています</b>。
      </Punch>
    </section>
  )
}

function FindingThreeSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const cases = [
    { model: 'Sonnet 4.6', own: 'Claude Code 66.7%', other: 'Codex CLI 68.9%', note: 'ほぼ同コストで他社ハーネスが上' },
    { model: 'GPT-5.6 Sol', own: 'Codex CLI 78.9% / $0.76', other: 'Pi 83.3% / $0.42', note: '成功率が上がって、コストは約半額' }
  ]
  return (
    <section className="remotion-slide hxt-slide">
      <Header kicker="FINDING 3 / 3" title="純正が最適とは限らない" frame={frame} />
      <div className="hxt-headline" style={lift(entrance(frame, fps, 14), 20)}>
        <strong>12</strong>
        <span>通りの比較のうち</span>
        <strong>9</strong>
        <span>通りで、自社製ではないハーネスが勝った</span>
      </div>
      <div className="hxt-cases">
        {cases.map((row, i) => (
          <div key={row.model} style={lift(entrance(frame, fps, 34 + i * 14), 18)}>
            <strong>{row.model}</strong>
            <div className="hxt-case-pair">
              <span className="hxt-case-own">{row.own}</span>
              <Shuffle size={22} />
              <span className="hxt-case-other">{row.other}</span>
            </div>
            <em>{row.note}</em>
          </div>
        ))}
      </div>
    </section>
  )
}

function CaveatSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const limits = [
    'ベンチマークは公開されており、モデルが学習時に見ている可能性がある',
    'タスクは各30問 × 3回。大規模な検証ではない',
    '他のワークロードでは結果が変わりうる（研究チーム自身が明記）'
  ]
  return (
    <section className="remotion-slide hxt-slide">
      <Header kicker="CAVEAT" title="この研究の限界も、言っておきます" frame={frame} />
      <ul className="hxt-limits">
        {limits.map((limit, i) => (
          <li key={limit} style={lift(entrance(frame, fps, 16 + i * 14), 18)}>
            <TriangleAlert size={30} />
            <span>{limit}</span>
          </li>
        ))}
      </ul>
      <Punch frame={frame} delay={80}>
        数字を「絶対」として持ち歩かず、<b>こういう差が存在しうる</b>という事実として持ち帰ってください。
      </Punch>
    </section>
  )
}

function SectionMyTakeSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide hxt-slide hxt-section">
      <div className="motion-grid" />
      <span className="slide-kicker" style={lift(entrance(frame, fps), 18)}>
        SECTION 2
      </span>
      <h1 style={lift(entrance(frame, fps, 12), 26)}>
        ここから、
        <br />
        私の話
      </h1>
    </section>
  )
}

function MyTakeSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide hxt-slide">
      <Header kicker="MY TAKE" title="AI導入を「選定」にすると損をする" frame={frame} />
      <div className="hxt-take">
        <div className="hxt-take-wrong" style={lift(entrance(frame, fps, 16), 20)}>
          <Lock size={34} />
          <div>
            <span>よくある形</span>
            <strong>比較表を作り、「うちはこれを使う」と決めて稟議に通す</strong>
            <em>決めた瞬間は正しい。でも最適な組み合わせは半年で入れ替わる</em>
          </div>
        </div>
        <div className="hxt-take-right" style={lift(entrance(frame, fps, 38), 20)}>
          <Shuffle size={34} />
          <div>
            <span>本来の形</span>
            <strong>導入とは選定ではなく、切り替えられる状態を作ること</strong>
            <em>固定した会社は、今日見たような差を取りに行けなくなる</em>
          </div>
        </div>
      </div>
      <Punch frame={frame} delay={82}>
        AI導入というときに、<b>何かを固定的にするのはよくない</b>と思っています。
      </Punch>
    </section>
  )
}

function MySetupSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide hxt-slide">
      <Header kicker="MY SETUP" title="私は最初から固定していません" frame={frame} />
      <div className="hxt-setup" style={lift(entrance(frame, fps, 16), 20)}>
        <div className="hxt-setup-entry">
          <Link2 size={32} />
          <strong>入口は1本</strong>
        </div>
        <div className="hxt-setup-arrow">→</div>
        <div className="hxt-setup-backends">
          <span>Claude</span>
          <span>Codex</span>
        </div>
      </div>
      <Punch frame={frame} delay={60}>
        だからこういう研究が出てきても<b>何も困らない</b>。明日から比率を変えるだけです。
      </Punch>
      <p className="hxt-inverse" style={lift(entrance(frame, fps, 84), 14)}>
        固定していたら、この研究を読んでも<b>「困ったな」で終わっていた</b>はずです。
      </p>
    </section>
  )
}

function ManagementSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const steps = [
    { icon: Link2, text: '入口を1本にして、後ろのモデルとハーネスを差し替えられるようにする' },
    { icon: Coins, text: '同じ仕事のコストを、組み合わせ別に計測できるようにしておく' },
    { icon: ClipboardCheck, text: '全社標準を決めるのは、測れるようになってから' }
  ]
  return (
    <section className="remotion-slide hxt-slide">
      <Header kicker="FOR DECISION MAKERS" title="稟議の書き方が変わる" frame={frame} />
      <p className="hxt-lead" style={lift(entrance(frame, fps, 12), 16)}>
        「どのツールを使うか」で書くと、決裁が下りた瞬間に固定されます。
        <br />
        <b>「切り替えコストをいくらに抑えるか」</b>で書いてください。
      </p>
      <ol className="hxt-steps">
        {steps.map((step, i) => {
          const Icon = step.icon
          return (
            <li key={step.text} style={lift(entrance(frame, fps, 30 + i * 12), 16)}>
              <Icon size={28} />
              <span>{step.text}</span>
            </li>
          )
        })}
      </ol>
      <Punch frame={frame} delay={86}>
        この<b>順番が逆になっている会社</b>が、とても多いです。
      </Punch>
    </section>
  )
}

function RecapSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const points = [
    'ハーネスを変えても成功率はほぼ変わらない（±2〜5%）',
    '同じモデルでもコストは平均2倍動く＝ハーネス税',
    '12通り中9通りで、純正ではないハーネスが勝った',
    'だからAI導入は選定ではなく、切り替えられる状態を作ること'
  ]
  return (
    <section className="remotion-slide hxt-slide">
      <Header kicker="RECAP" title="今日のまとめ" frame={frame} />
      <ol className="hxt-recap">
        {points.map((point, i) => (
          <li key={point} style={lift(entrance(frame, fps, 16 + i * 12), 16)}>
            <span>{i + 1}</span>
            <strong>{point}</strong>
          </li>
        ))}
      </ol>
    </section>
  )
}

function SourcesSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide hxt-slide">
      <Header kicker="SOURCES" title="出典" frame={frame} />
      <ul className="hxt-sources">
        <li style={lift(entrance(frame, fps, 16), 16)}>
          <FlaskConical size={22} />
          <a href="https://harnesstax.github.io/" target="_blank" rel="noreferrer">
            HarnessTax: How Much Does the Harness Matter for Coding Agents?
          </a>
        </li>
        <li style={lift(entrance(frame, fps, 28), 16)}>
          <ShieldCheck size={22} />
          <span>Melissa Z. Pan, Shuo Yang, Negar Arabzadeh, Wei-Lin Chiang, Ion Stoica, Matei Zaharia（UC Berkeley / Arena）</span>
        </li>
      </ul>
      <Punch frame={frame} delay={60}>
        数字は<b>一次情報に当たって確認</b>したものです。リンクは概要欄に置きます。
      </Punch>
    </section>
  )
}
