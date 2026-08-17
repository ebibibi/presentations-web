/* eslint-disable react-refresh/only-export-components */
import {
  ArrowRight,
  Ban,
  Bell,
  Brain,
  Check,
  ClipboardList,
  Copy,
  FileText,
  FolderInput,
  Hand,
  Image,
  Megaphone,
  Mic,
  Presentation,
  Scissors,
  Send,
  ShieldCheck,
  Sparkles,
  Table2,
  UserCheck,
  Video,
  Upload,
} from 'lucide-react'
import { type ReactNode } from 'react'
import { spring, useVideoConfig } from 'remotion'
import { CtaSlide, LogoMark } from '../../../src/deck-shared'
import type { SlideModule, SlideRenderContext } from '../../../src/types'
import './styles.css'

export const slides: SlideModule['slides'] = [
  { render: (props) => <OpeningSlide {...props} /> },
  { render: (props) => <BeforeSlide {...props} /> },
  { render: (props) => <PipelineSlide {...props} /> },
  { render: (props) => <EditSlide {...props} /> },
  { render: (props) => <DualSourceSlide {...props} /> },
  { render: (props) => <UnderstandSlide {...props} /> },
  { render: (props) => <ArtifactsSlide {...props} /> },
  { render: (props) => <GateSlide {...props} /> },
  { render: (props) => <TurnSlide {...props} /> },
  { render: (props) => <TriggerSlide {...props} /> },
  { render: (props) => <LayersSlide {...props} /> },
  { render: (props) => <MeetingSlide {...props} /> },
  { render: (props) => <CopyChainSlide {...props} /> },
  { render: (props) => <HumanSlide {...props} /> },
  { render: (props) => <StartSlide {...props} /> },
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

/** Headline block shared by the structured slides. */
function Head({ kicker, frame, children }: { kicker: string; frame: number; children: ReactNode }) {
  const { fps } = useVideoConfig()
  return (
    <div style={lift(entrance(frame, fps), 26)}>
      <span className="vea-kicker">{kicker}</span>
      <h1>{children}</h1>
    </div>
  )
}

/** Full-bleed single statement ─ the slides that land with one line. */
function Statement({
  kicker,
  frame,
  lead,
  children,
}: {
  kicker: string
  frame: number
  lead?: ReactNode
  children: ReactNode
}) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide vea-slide vea-statement">
      <div className="vea-grid" />
      <div style={lift(entrance(frame, fps), 36)}>
        <span className="vea-kicker">{kicker}</span>
        <h1>{children}</h1>
      </div>
      {lead ? (
        <p className="vea-lead" style={lift(entrance(frame, fps, 40), 20)}>
          {lead}
        </p>
      ) : null}
    </section>
  )
}

const ICON = { height: 34, width: 34 }

function OpeningSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const steps: Array<[string, string, string]> = [
    ['01', '具体', '私の環境で動いているものを、そのまま見せます'],
    ['02', '抽象', 'それが業務一般でどういう形になるかへ広げます'],
    ['03', '相談', '自社で始めるなら、どこから手を付けるか'],
  ]

  return (
    <section className="remotion-slide vea-slide vea-opening">
      <div className="vea-grid" />
      <LogoMark className="vea-logo" />
      <div style={lift(entrance(frame, fps), 44)}>
        <span className="vea-kicker">動画1本で実証した業務自動化の設計図</span>
        <h1>
          「ファイルができた」
          <br />
          から先は、
          <em className="vea-accent">人がやらない</em>
        </h1>
      </div>
      <div className="vea-steps-3" style={lift(entrance(frame, fps, 34), 24)}>
        {steps.map(([no, title, body]) => (
          <article key={no}>
            <b>{no}</b>
            <strong>{title}</strong>
            <p>{body}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

function BeforeSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const tasks = [
    '録画する',
    '不要部分を切る',
    '書き出す',
    'アップロードする',
    'タイトルを考える',
    '概要欄を書く',
    'サムネイルを作る',
    '再生リストに入れる',
    '公開する',
    'SNSで告知する',
  ]

  return (
    <section className="remotion-slide vea-slide">
      <div className="vea-grid" />
      <Head kicker="かつて" frame={frame}>
        1本出すのに、
        <br />
        工程が10個あった
      </Head>
      <div className="vea-chips" style={lift(entrance(frame, fps, 26), 22)}>
        {tasks.map((task) => (
          <span key={task}>{task}</span>
        ))}
      </div>
      <p className="vea-note" style={lift(entrance(frame, fps, 70), 18)}>
        ひとつは数分。10個並ぶと<b>数時間</b>。
        <br />
        そして、この中に<em className="vea-accent">私にしかできない仕事は、ほぼ無かった</em>。
      </p>
    </section>
  )
}

function PipelineSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const stages: Array<[ReactNode, string, string, boolean]> = [
    [<Video key="i" style={ICON} />, '撮る', '録画ファイルが置かれる', true],
    [<Scissors key="i" style={ICON} />, '編集する', '無音カット＋テンプレ結合', false],
    [<Upload key="i" style={ICON} />, '上げる', '非公開のままアップロード', false],
    [<Sparkles key="i" style={ICON} />, 'メタを作る', 'タイトル・概要・サムネ・再生リスト', false],
    [<UserCheck key="i" style={ICON} />, '承認する', '人が中身を見て公開を決める', true],
    [<Megaphone key="i" style={ICON} />, '広める', '各SNSへ告知・ショート生成', false],
  ]

  return (
    <section className="remotion-slide vea-slide">
      <div className="vea-grid" />
      <Head kicker="現在" frame={frame}>
        人が触るのは、
        <br />
        両端の<em className="vea-accent">2か所だけ</em>
      </Head>
      <div className="vea-flow">
        {stages.map(([icon, title, body, human], index) => (
          <article
            key={title}
            className={human ? 'vea-human' : undefined}
            style={lift(entrance(frame, fps, 24 + index * 9), 24)}
          >
            <span className="vea-flow-icon">{icon}</span>
            <strong>{title}</strong>
            <p>{body}</p>
            {human ? <span className="vea-tag">人</span> : null}
          </article>
        ))}
      </div>
      <p className="vea-note" style={lift(entrance(frame, fps, 92), 18)}>
        人を外したのではない。<b>判断すべきところにだけ人を置いた</b>。
      </p>
    </section>
  )
}

function EditSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const steps: Array<[string, string, string]> = [
    ['1', '最新の録画を見つける', '録画フォルダを見て、処理していないものを拾う'],
    ['2', '無音を落とす', '閾値と前後の余白は設定ファイルで環境ごとに調整'],
    ['3', '型に流し込む', '編集ソフトのAPIでテンプレート構成のタイムラインを組む'],
  ]

  return (
    <section className="remotion-slide vea-slide">
      <div className="vea-grid" />
      <Head kicker="工程①  編集" frame={frame}>
        毎回同じ形に作る、
        <br />
        と決めた
      </Head>
      <div className="vea-steps">
        {steps.map(([no, title, body], index) => (
          <article key={no} style={lift(entrance(frame, fps, 26 + index * 16), 26)}>
            <b>{no}</b>
            <div>
              <strong>{title}</strong>
              <p>{body}</p>
            </div>
          </article>
        ))}
      </div>
      <p className="vea-note" style={lift(entrance(frame, fps, 84), 18)}>
        <em className="vea-accent">型が決まっているから、機械に渡せる。</em>
        編集ソフトは人が開かない。
      </p>
    </section>
  )
}

function DualSourceSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const auto = ['2つの録画を音の波形で自動同期', 'ずれていたら止める', '毎回まったく同じ配置に並べる']
  const manual = ['一部のトランジション', '合成・キーイングの調整', 'APIが用意されていない操作']

  return (
    <section className="remotion-slide vea-slide">
      <div className="vea-grid" />
      <Head kicker="工程②  見切り" frame={frame}>
        できない場所を、
        <br />
        <em className="vea-accent">先に</em>確定させる
      </Head>
      <div className="vea-two">
        <article className="vea-yes" style={lift(entrance(frame, fps, 26), 26)}>
          <header>
            <Check style={ICON} />
            自動化する
          </header>
          <ul>
            {auto.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
        <article className="vea-no" style={lift(entrance(frame, fps, 42), 26)}>
          <header>
            <Ban style={ICON} />
            手作業と決める
          </header>
          <ul>
            {manual.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </div>
      <p className="vea-note" style={lift(entrance(frame, fps, 82), 18)}>
        これは負けではなく<b>設計</b>。外す範囲が決まるほど、残りは迷わず自動化できる。
      </p>
    </section>
  )
}

function UnderstandSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide vea-slide vea-statement">
      <div className="vea-grid" />
      <div style={lift(entrance(frame, fps), 36)}>
        <span className="vea-kicker">工程③  分岐点</span>
        <h1>
          機械が、中身を
          <br />
          <em className="vea-accent">読めるようになった</em>
        </h1>
      </div>
      <div className="vea-shift" style={lift(entrance(frame, fps, 34), 24)}>
        <span className="vea-old">
          <Copy style={ICON} />
          運ぶ・変換する・コピーする
        </span>
        <ArrowRight className="vea-shift-arrow" style={{ height: 44, width: 44 }} />
        <span className="vea-new">
          <Brain style={ICON} />
          何の話かを理解して、書く
        </span>
      </div>
      <p className="vea-lead" style={lift(entrance(frame, fps, 62), 20)}>
        音声を文字起こしし、その全文をAIに読ませる。
        <br />
        人の要約は要点を落とすが、<b>機械は全部拾う</b>。
      </p>
    </section>
  )
}

function ArtifactsSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const outputs: Array<[ReactNode, string]> = [
    [<FileText key="i" style={ICON} />, 'タイトル・概要文'],
    [<Image key="i" style={ICON} />, 'サムネイル画像'],
    [<ClipboardList key="i" style={ICON} />, '分類・タグ付け'],
    [<Scissors key="i" style={ICON} />, '短尺の切り出し'],
    [<Send key="i" style={ICON} />, '各媒体向けの告知文'],
    [<Presentation key="i" style={ICON} />, '記事・資料の下書き'],
  ]

  return (
    <section className="remotion-slide vea-slide">
      <div className="vea-grid" />
      <Head kicker="工程④  生成" frame={frame}>
        素材1つから、
        <br />
        成果物が<em className="vea-accent">何個も</em>出る
      </Head>
      <div className="vea-fan">
        <div className="vea-fan-source" style={lift(entrance(frame, fps, 20), 22)}>
          <Mic style={{ height: 40, width: 40 }} />
          <strong>1回の理解</strong>
          <p>文字起こし＋AIの読解</p>
        </div>
        <div className="vea-fan-out">
          {outputs.map(([icon, label], index) => (
            <span key={label} style={lift(entrance(frame, fps, 32 + index * 8), 20)}>
              {icon}
              {label}
            </span>
          ))}
        </div>
      </div>
      <p className="vea-note" style={lift(entrance(frame, fps, 92), 18)}>
        理解の層を1回作れば、<b>出口はいくらでも足せる</b>。配布先が増えても、作るのは出口1つ。
      </p>
    </section>
  )
}

function GateSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const cards: Array<[ReactNode, string, string]> = [
    [
      <Bell key="i" style={ICON} />,
      '承認を挟む',
      '下書き一式が揃った時点で通知が来る。公開と外部発信は、必ず人の承認の後ろ',
    ],
    [
      <Ban key="i" style={ICON} />,
      '構造上できないものは書き出す',
      'APIが無い操作は「まだ」ではなく「できない」。手順書に残して手作業と割り切る',
    ],
  ]

  return (
    <section className="remotion-slide vea-slide">
      <div className="vea-grid" />
      <Head kicker="工程⑤  ゲート" frame={frame}>
        人が押すボタンは、
        <br />
        残す
      </Head>
      <div className="vea-cards">
        {cards.map(([icon, title, body], index) => (
          <article key={title} style={lift(entrance(frame, fps, 28 + index * 18), 26)}>
            <span className="vea-card-icon">{icon}</span>
            <strong>{title}</strong>
            <p>{body}</p>
          </article>
        ))}
      </div>
      <p className="vea-note" style={lift(entrance(frame, fps, 80), 18)}>
        全部できることと、全部やらせることは<em className="vea-accent">別</em>。
      </p>
    </section>
  )
}

function TurnSlide({ frame }: SlideRenderContext) {
  return (
    <Statement kicker="ここから" frame={frame} lead="ここまでが、実際に動いているものの話。">
      これは
      <br />
      <em className="vea-accent">動画の話ではない</em>
    </Statement>
  )
}

function TriggerSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const sources = ['会議の録画', 'スキャンした書類', '現場で撮った写真', '機器が吐いたログ', '受信した添付ファイル']

  return (
    <section className="remotion-slide vea-slide vea-statement">
      <div className="vea-grid" />
      <div style={lift(entrance(frame, fps), 36)}>
        <span className="vea-kicker">抽象化</span>
        <h1>
          入口は、
          <br />
          <em className="vea-accent">たった1つのイベント</em>
        </h1>
      </div>
      <div className="vea-event" style={lift(entrance(frame, fps, 30), 24)}>
        <FolderInput style={{ height: 46, width: 46 }} />
        新しいファイルが、そこに置かれた
      </div>
      <div className="vea-chips vea-chips-tight" style={lift(entrance(frame, fps, 56), 20)}>
        {sources.map((source) => (
          <span key={source}>{source}</span>
        ))}
      </div>
      <p className="vea-lead" style={lift(entrance(frame, fps, 78), 18)}>
        工程で考えるのをやめて、<b>何が起きたら動き出すのか</b>で考え直す。
      </p>
    </section>
  )
}

function LayersSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const layers: Array<[string, string, string]> = [
    ['1', '検知', '置かれた・終わった、を拾う'],
    ['2', '取り込み・正規化', '手元に持ってきて、いつも同じ形に整える'],
    ['3', '理解', '中身を、構造化されたデータにする'],
    ['4', '生成', 'そのデータから成果物の下書きを作る'],
    ['5', '反映・配布', '決まった置き場所とテンプレートに流し込む'],
  ]

  return (
    <section className="remotion-slide vea-slide">
      <div className="vea-grid" />
      <Head kicker="共通構造" frame={frame}>
        題材が変わっても、
        <br />
        中身は<em className="vea-accent">この5層</em>
      </Head>
      <div className="vea-layers">
        {layers.map(([no, title, body], index) => (
          <article key={no} style={lift(entrance(frame, fps, 24 + index * 11), 22)}>
            <b>{no}</b>
            <strong>{title}</strong>
            <p>{body}</p>
          </article>
        ))}
      </div>
      <div className="vea-cross" style={lift(entrance(frame, fps, 86), 18)}>
        <ShieldCheck style={ICON} />
        全層を貫くのは<b>承認ゲートと記録</b> ─ 誰が何を承認し、何が出ていったのかが残ること
      </div>
    </section>
  )
}

function MeetingSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const rows: Array<[string, string]> = [
    ['検知・取り込み', '会議が終わり、録画と文字起こしができる'],
    ['理解', '決定事項・宿題・担当者・期日を構造化データで取り出す'],
    ['生成', '議事録、台帳に入れる行、報告資料に載せるコメント'],
    ['反映・配布', '台帳の該当行へ書き込み、資料テンプレートへ流し込み、関係者へ配る'],
  ]

  return (
    <section className="remotion-slide vea-slide">
      <div className="vea-grid" />
      <Head kicker="当てはめる" frame={frame}>
        同じ5層に、
        <br />
        会議を載せてみる
      </Head>
      <div className="vea-map">
        {rows.map(([layer, body], index) => (
          <article key={layer} style={lift(entrance(frame, fps, 26 + index * 13), 22)}>
            <strong>{layer}</strong>
            <ArrowRight className="vea-map-arrow" style={{ height: 28, width: 28 }} />
            <p>{body}</p>
          </article>
        ))}
      </div>
      <p className="vea-note" style={lift(entrance(frame, fps, 84), 18)}>
        人がやるのは、<b>出てきたものを見て承認すること</b>だけになる。
      </p>
    </section>
  )
}

function CopyChainSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const chain: Array<[ReactNode, string]> = [
    [<FileText key="i" style={ICON} />, '文字起こしを人が整形する'],
    [<Table2 key="i" style={ICON} />, '表計算の該当行に貼り付ける'],
    [<Copy key="i" style={ICON} />, '別の実行環境へコピーする'],
    [<Sparkles key="i" style={ICON} />, '処理を回して結果を得る'],
    [<Hand key="i" style={ICON} />, '結果を見て人が文章を書く'],
    [<Presentation key="i" style={ICON} />, 'テンプレート資料へ1枚ずつ貼る'],
  ]

  return (
    <section className="remotion-slide vea-slide">
      <div className="vea-grid" />
      <Head kicker="どこを見るか" frame={frame}>
        手作業は、いつも
        <br />
        <em className="vea-accent">境界</em>に溜まる
      </Head>
      <div className="vea-chain">
        {chain.map(([icon, label], index) => (
          <article key={label} style={lift(entrance(frame, fps, 24 + index * 9), 20)}>
            <span className="vea-chain-icon">{icon}</span>
            {label}
          </article>
        ))}
      </div>
      <p className="vea-note" style={lift(entrance(frame, fps, 88), 18)}>
        システムとシステムのつなぎ目に、貼り付け作業が残る。
        <br />
        <em className="vea-accent">貼り付けそのものに付加価値は無い</em>＝失うものが無いから、最初に取る。
      </p>
    </section>
  )
}

function HumanSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const machine = ['転記する', '整形する', '集計する', '下書きを書く']
  const human = ['判断する', '責任を持つ', '例外に対処する', '交渉する']

  return (
    <section className="remotion-slide vea-slide">
      <div className="vea-grid" />
      <Head kicker="線の引き方" frame={frame}>
        下書きまでは、
        <br />
        <em className="vea-accent">機械の仕事</em>
      </Head>
      <div className="vea-two">
        <article className="vea-yes" style={lift(entrance(frame, fps, 26), 26)}>
          <header>
            <Sparkles style={ICON} />
            機械に渡す
          </header>
          <ul>
            {machine.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
        <article className="vea-keep" style={lift(entrance(frame, fps, 42), 26)}>
          <header>
            <UserCheck style={ICON} />
            人に残す
          </header>
          <ul>
            {human.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </div>
      <p className="vea-note" style={lift(entrance(frame, fps, 82), 18)}>
        人の時間は<b>直すことと決めること</b>に使う。ゼロから書くのと直すのでは、かかる時間が違う。
      </p>
    </section>
  )
}

function StartSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const steps: Array<[string, string, string]> = [
    ['1', '流れを1本だけ選ぶ', '毎週必ず発生している、いちばん頻度の高いものがいい'],
    ['2', '成果物の型を先に固定する', '型が無いものは自動化できない。型を決めるだけで手作業は半分減る'],
    ['3', '承認ゲートを1つ置く', '全自動を目指さない。人が最後に見る場所を決めておく'],
  ]

  return (
    <section className="remotion-slide vea-slide">
      <div className="vea-grid" />
      <Head kicker="進め方" frame={frame}>
        始めるのは、
        <br />
        この3手だけ
      </Head>
      <div className="vea-steps">
        {steps.map(([no, title, body], index) => (
          <article key={no} style={lift(entrance(frame, fps, 26 + index * 16), 26)}>
            <b>{no}</b>
            <div>
              <strong>{title}</strong>
              <p>{body}</p>
            </div>
          </article>
        ))}
      </div>
      <p className="vea-note" style={lift(entrance(frame, fps, 84), 18)}>
        私の場合も、最初から繋がっていたわけではない。<b>無音カットの1工程</b>から始まっている。
      </p>
    </section>
  )
}

function ClosingSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide vea-slide vea-statement">
      <div className="vea-grid" />
      <LogoMark className="vea-logo" />
      <div style={lift(entrance(frame, fps), 36)}>
        <span className="vea-kicker">最後に</span>
        <h1>
          こういう仕組みを
          <br />
          作りたかったら、
          <br />
          <em className="vea-accent">相談してください</em>
        </h1>
      </div>
      <div className="vea-badge" style={lift(entrance(frame, fps, 34), 22)}>
        <ClipboardList style={{ height: 38, marginRight: 14, verticalAlign: 'middle', width: 38 }} />
        いま、貼り付け作業がどこに溜まっていますか
      </div>
      <p className="vea-lead" style={lift(entrance(frame, fps, 62), 20)}>
        特別な基盤も、大きな予算も使っていない。
        <br />
        必要なのは<b>イベントと成果物で捉え直すこと</b>と、<b>どこに人を残すか決めること</b>だけ。
      </p>
    </section>
  )
}
