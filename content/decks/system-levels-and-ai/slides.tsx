/* eslint-disable react-refresh/only-export-components */
import {
  AlertTriangle,
  ArrowRight,
  Ban,
  Boxes,
  ClipboardList,
  Database,
  Layers,
  Lock,
  Monitor,
  ShoppingCart,
  Timer,
  Truck,
  Unplug,
  UserX,
} from 'lucide-react'
import { Fragment, type ReactNode } from 'react'
import { spring, useVideoConfig } from 'remotion'
import { CtaSlide, LogoMark } from '../../../src/deck-shared'
import type { SlideModule, SlideRenderContext } from '../../../src/types'
import './styles.css'

export const slides: SlideModule['slides'] = [
  { render: (props) => <OpeningSlide {...props} /> },
  { render: (props) => <IdealSlide {...props} /> },
  { render: (props) => <AmazonSlide {...props} /> },
  { render: (props) => <DataStaysSlide {...props} /> },
  { render: (props) => <GoodSystemSlide {...props} /> },
  { render: (props) => <AiEasySlide {...props} /> },
  { render: (props) => <WorstSlide {...props} /> },
  { render: (props) => <TranscribeSlide {...props} /> },
  { render: (props) => <BadAutomationSlide {...props} /> },
  { render: (props) => <GradationSlide {...props} /> },
  { render: (props) => <ApproachSlide {...props} /> },
  { render: (props) => <HalfBakedSlide {...props} /> },
  { render: (props) => <WorseThanNothingSlide {...props} /> },
  { render: (props) => <LiabilitySlide {...props} /> },
  { render: (props) => <TwoStepsSlide {...props} /> },
  { render: (props) => <ClosingSlide {...props} /> },
  { render: (props) => <CtaSlide {...props} /> },
]

// Pure helper (not a hook): spring-based entrance value for staggered reveals.
function entrance(frame: number, fps: number, delay = 0) {
  return spring({ frame: frame - delay, fps, config: { damping: 18, stiffness: 110 } })
}

function lift(value: number, distance = 30) {
  return { opacity: value, transform: `translateY(${(1 - value) * distance}px)` }
}

/** Headline block shared by every non-statement slide. */
function Head({ kicker, frame, children }: { kicker: string; frame: number; children: ReactNode }) {
  const { fps } = useVideoConfig()
  return (
    <div style={lift(entrance(frame, fps), 26)}>
      <span className="lvl-kicker">{kicker}</span>
      <h1>{children}</h1>
    </div>
  )
}

/** Full-bleed single statement ─ the slides that land with one line. */
function Statement({
  kicker,
  frame,
  lead,
  huge,
  children,
}: {
  kicker: string
  frame: number
  lead?: ReactNode
  huge?: boolean
  children: ReactNode
}) {
  const { fps } = useVideoConfig()
  return (
    <section className={`remotion-slide lvl-slide lvl-statement${huge ? ' lvl-huge' : ''}`}>
      <div className="lvl-grid" />
      <div style={lift(entrance(frame, fps), 34)}>
        <span className="lvl-kicker">{kicker}</span>
        <h1>{children}</h1>
      </div>
      {lead ? (
        <p className="lvl-lead" style={lift(entrance(frame, fps, 30), 22)}>
          {lead}
        </p>
      ) : null}
    </section>
  )
}

function OpeningSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide lvl-slide lvl-opening">
      <div className="lvl-grid" />
      <LogoMark className="lvl-logo" />
      <div style={lift(entrance(frame, fps), 44)}>
        <span className="lvl-kicker">経営者のための業務レベル論</span>
        <h1>
          AIの前に、
          <br />
          <em className="lvl-accent">見るべきもの</em>がある
        </h1>
      </div>
      <p className="lvl-lead" style={lift(entrance(frame, fps, 32), 24)}>
        その業務、いま<b>どのレベル</b>で回っていますか。
      </p>
    </section>
  )
}

function IdealSlide({ frame }: SlideRenderContext) {
  return (
    <Statement kicker="理想形" frame={frame} lead="効率化の最終形は、速く作業することではない。作業そのものが無いこと。">
      理想は、
      <br />
      <em className="lvl-accent">人が何もしない</em>こと
    </Statement>
  )
}

function AmazonSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const steps: Array<[ReactNode, string]> = [
    [<ShoppingCart key="i" />, '注文が確定'],
    [<Boxes key="i" />, '在庫を引当'],
    [<ClipboardList key="i" />, '移動を指示'],
    [<Truck key="i" />, '伝票・出荷'],
    [<Database key="i" />, 'データが残る'],
  ]

  return (
    <section className="remotion-slide lvl-slide">
      <div className="lvl-grid" />
      <Head kicker="たとえばAmazon" frame={frame}>
        注文から出荷まで、
        <br />
        止まらない
      </Head>
      <div className="lvl-flow">
        {steps.map(([icon, label], index) => (
          <Fragment key={label}>
            <article style={lift(entrance(frame, fps, 24 + index * 12), 26)}>
              {icon}
              <strong>{label}</strong>
            </article>
            {index < steps.length - 1 ? <ArrowRight className="lvl-flow-arrow" /> : null}
          </Fragment>
        ))}
      </div>
      <div className="lvl-badge" style={lift(entrance(frame, fps, 92), 20)}>
        この一連に、<b>人の承認は一度も挟まらない</b>
      </div>
    </section>
  )
}

function DataStaysSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const cards: Array<[string, string, string]> = [
    ['01', '記録が残る', '誰が何をいつ、が全部データになる'],
    ['02', '分析できる', '推測ではなく実績で判断できる'],
    ['03', '次の手が打てる', 'レコメンド・在庫最適化・価格施策'],
  ]

  return (
    <section className="remotion-slide lvl-slide">
      <div className="lvl-grid" />
      <Head kicker="自動で回ることの本当の価値" frame={frame}>
        データが残るから、
        <br />
        次の手が打てる
      </Head>
      <div className="lvl-triple">
        {cards.map(([no, title, body], index) => (
          <article key={no} style={lift(entrance(frame, fps, 26 + index * 14), 28)}>
            <span>{no}</span>
            <strong>{title}</strong>
            <p>{body}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

function GoodSystemSlide({ frame }: SlideRenderContext) {
  return (
    <Statement
      kicker="定義"
      frame={frame}
      lead="人は監視と、改善と、伸ばす仕事へ。手を動かす側から降りられる。"
    >
      いいシステムとは、
      <br />
      <em className="lvl-accent">人が介在しなくていい</em>もの
    </Statement>
  )
}

function AiEasySlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const cards: Array<[string, string, string]> = [
    ['前提1', 'データがある', '学習も判断も、材料がそろっている'],
    ['前提2', 'システムがある', 'つなぐ先が最初から存在する'],
    ['結論', 'ただの改修で済む', '特別なプロジェクトにならない'],
  ]

  return (
    <section className="remotion-slide lvl-slide">
      <div className="lvl-grid" />
      <Head kicker="だからこそ" frame={frame}>
        この土台の上なら、
        <br />
        <em className="lvl-accent">AIは簡単</em>
      </Head>
      <div className="lvl-triple">
        {cards.map(([tag, title, body], index) => (
          <article key={tag} style={lift(entrance(frame, fps, 26 + index * 14), 28)}>
            <span>{tag}</span>
            <strong>{title}</strong>
            <p>{body}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

function WorstSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const cards: Array<[string, string, string]> = [
    ['受注', 'メール1通', '担当者の受信箱の中だけにある'],
    ['書類', 'Excel と PDF', '添付で飛び交い、版が分からなくなる'],
    ['保管', '個人のフォルダ', '一元管理された場所がどこにもない'],
  ]

  return (
    <section className="remotion-slide lvl-slide">
      <div className="lvl-grid" />
      <Head kicker="対極にある現場" frame={frame}>
        担当者が動かないと、
        <br />
        <em className="lvl-alarm">全部止まる</em>
      </Head>
      <div className="lvl-triple lvl-triple-alarm">
        {cards.map(([tag, title, body], index) => (
          <article key={tag} style={lift(entrance(frame, fps, 26 + index * 14), 28)}>
            <span>{tag}</span>
            <strong>{title}</strong>
            <p>{body}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

function TranscribeSlide({ frame }: SlideRenderContext) {
  return (
    <Statement
      kicker="そして仕入れ工程では"
      frame={frame}
      lead="メーカーごとに違うフォーマットへ、手で写す。間違えるし、時間もかかる。"
    >
      そして、人間が
      <br />
      <em className="lvl-alarm">転記する</em>
    </Statement>
  )
}

function BadAutomationSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const items: Array<[ReactNode, string]> = [
    [<Ban key="i" />, 'Excelマクロでがんばる'],
    [<Ban key="i" />, 'この作業をAIでなんとかする'],
    [<Ban key="i" />, 'RPAで画面を操作させる'],
  ]

  return (
    <section className="remotion-slide lvl-slide">
      <div className="lvl-grid" />
      <Head kicker="ここでやってはいけないこと" frame={frame}>
        おかしな流れを、
        <br />
        <em className="lvl-alarm">固定してはいけない</em>
      </Head>
      <div className="lvl-list">
        {items.map(([icon, label], index) => (
          <article key={label} style={lift(entrance(frame, fps, 26 + index * 14), 26)}>
            {icon}
            <strong>{label}</strong>
          </article>
        ))}
      </div>
      <p className="lvl-note" style={lift(entrance(frame, fps, 78), 18)}>
        直すのは作業ではなく、<b>仕事の流れそのもの</b>。
      </p>
    </section>
  )
}

function GradationSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const levels: Array<[string, string, string]> = [
    ['lvl-lv0', 'LEVEL 0', 'メールと電話と個人の記憶'],
    ['lvl-lv1', 'LEVEL 1', 'ファイル置き場だけ決まっている'],
    ['lvl-lv2', 'LEVEL 2', 'システムはあるが人が転記でつなぐ'],
    ['lvl-lv3', 'LEVEL 3', 'APIでつながり、記録が残る'],
    ['lvl-lv4', 'LEVEL 4', '人の介在なしで回り、AIを足せる'],
  ]

  return (
    <section className="remotion-slide lvl-slide">
      <div className="lvl-grid" />
      <Head kicker="現実は、この間のどこか" frame={frame}>
        自社の業務は、
        <br />
        どのレベルか
      </Head>
      <div className="lvl-ladder">
        {levels.map(([cls, no, label], index) => (
          <article key={no} className={cls} style={lift(entrance(frame, fps, 24 + index * 11), 22)}>
            <b>{no}</b>
            <span>{label}</span>
          </article>
        ))}
      </div>
      <p className="lvl-note" style={lift(entrance(frame, fps, 86), 18)}>
        全社で一律には語れない。<b>業務ごとにレベルが違う</b>のが普通。
      </p>
    </section>
  )
}

function ApproachSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const cards: Array<[string, string, string]> = [
    ['A', 'SaaSを素直に使う', '既存の型にこちらが合わせる。カスタマイズは、しないほど強い'],
    ['B', 'SaaSの上に業務を載せる', 'プラットフォームで業務を標準化・統一する'],
    ['C', 'コアだけ自社開発', '競争力の源泉に投資を集中させる'],
  ]

  return (
    <section className="remotion-slide lvl-slide">
      <div className="lvl-grid" />
      <Head kicker="正しい打ち手は3つ" frame={frame}>
        どれを選ぶかを、
        <br />
        決めているか
      </Head>
      <div className="lvl-triple">
        {cards.map(([tag, title, body], index) => (
          <article key={tag} style={lift(entrance(frame, fps, 26 + index * 14), 28)}>
            <span>{tag}</span>
            <strong>{title}</strong>
            <p>{body}</p>
          </article>
        ))}
      </div>
      <p className="lvl-note" style={lift(entrance(frame, fps, 82), 18)}>
        条件はひとつ。<b>APIで操作できること</b>。
      </p>
    </section>
  )
}

function HalfBakedSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const items: Array<[ReactNode, string]> = [
    [<Timer key="i" />, '開発が、とにかく遅い'],
    [<AlertTriangle key="i" />, '障害が多く、人が張り付く'],
    [<Lock key="i" />, '変えたいのに、変えられない'],
    [<Unplug key="i" />, 'APIが無く、外とつながらない'],
    [<Monitor key="i" />, '古いブラウザでしか動かない'],
    [<UserX key="i" />, '作った人が、もういない'],
  ]

  return (
    <section className="remotion-slide lvl-slide">
      <div className="lvl-grid" />
      <Head kicker="中途半端なシステムの症状" frame={frame}>
        当てはまるものが
        <br />
        ありませんか
      </Head>
      <div className="lvl-list lvl-list-two">
        {items.map(([icon, label], index) => (
          <article key={label} style={lift(entrance(frame, fps, 24 + index * 10), 24)}>
            {icon}
            <strong>{label}</strong>
          </article>
        ))}
      </div>
      <p className="lvl-note" style={lift(entrance(frame, fps, 78), 18)}>
        3つ以上あるなら、それは直す対象ではなく<b>落とす対象</b>。
      </p>
    </section>
  )
}

function WorseThanNothingSlide({ frame }: SlideRenderContext) {
  return (
    <Statement
      kicker="今日いちばん伝えたいこと"
      frame={frame}
      huge
      lead="AIは、システムが無くても回せるほど賢くなった。詰むのは、中途半端に作ってしまった側。"
    >
      無いほうが、
      <br />
      <em className="lvl-warm">まだマシ</em>
    </Statement>
  )
}

function LiabilitySlide({ frame }: SlideRenderContext) {
  return (
    <Statement
      kicker="レガシーシステム"
      frame={frame}
      lead="現場では決められない。落とす判断ができるのは、経営だけ。"
    >
      それは資産ではなく、
      <br />
      <em className="lvl-alarm">負の資産</em>
    </Statement>
  )
}

function TwoStepsSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const steps: Array<[string, string, string]> = [
    ['1', '業務を並べて、レベルを測る', 'どんな業務があり、それぞれが今どのレベルにあるのか'],
    ['2', '順番と、現実的なゴールを決める', 'どこから合理化するか。体制と人を踏まえ「まずはここまで」を置く'],
  ]

  return (
    <section className="remotion-slide lvl-slide">
      <div className="lvl-grid" />
      <Head kicker="進め方" frame={frame}>
        始めるのは、
        <br />
        この2つから
      </Head>
      <div className="lvl-steps">
        {steps.map(([no, title, body], index) => (
          <article key={no} style={lift(entrance(frame, fps, 28 + index * 18), 28)}>
            <b>{no}</b>
            <div>
              <strong>{title}</strong>
              <p>{body}</p>
            </div>
          </article>
        ))}
      </div>
      <p className="lvl-note" style={lift(entrance(frame, fps, 82), 18)}>
        描ける人に設計させ、<b>着実に進める</b>。
      </p>
    </section>
  )
}

function ClosingSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide lvl-slide lvl-statement">
      <div className="lvl-grid" />
      <LogoMark className="lvl-logo" />
      <div style={lift(entrance(frame, fps), 36)}>
        <span className="lvl-kicker">今日の結論</span>
        <h1>
          決めるのは、
          <br />
          AIを入れるかどうかでは<em className="lvl-alarm">ない</em>
        </h1>
      </div>
      <div className="lvl-badge" style={lift(entrance(frame, fps, 34), 22)}>
        <Layers style={{ height: 40, width: 40, verticalAlign: 'middle', marginRight: 14 }} />
        どの業務を、どのレベルまで上げるか
      </div>
      <p className="lvl-lead" style={lift(entrance(frame, fps, 62), 20)}>
        何年もかかるロードマップになる。だから、今日から。
      </p>
    </section>
  )
}
