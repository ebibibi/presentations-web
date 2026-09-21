/* eslint-disable react-refresh/only-export-components */
import {
  BookOpen,
  Bot,
  Boxes,
  Cloud,
  Coins,
  Database,
  FileCode2,
  Gauge,
  HardDriveDownload,
  Hand,
  KeyRound,
  Layers,
  Lightbulb,
  type LucideIcon,
  Milestone,
  MousePointerClick,
  Network,
  ScrollText,
  ShieldCheck,
  SignalHigh,
  Siren,
  Stethoscope,
  UserCog
} from 'lucide-react'
import { spring, useVideoConfig } from 'remotion'
import type { SlideModule, SlideRenderContext } from '../../../src/types'
import { CtaSlide, LogoMark } from '../../../src/deck-shared'
import './styles.css'

export const slides: SlideModule['slides'] = [
  { id: 'opening', render: (props) => <OpeningSlide {...props} /> },
  { id: 'profile', render: (props) => <ProfileSlide {...props} /> },
  { id: 'the-list', render: (props) => <TheListSlide {...props} /> },
  { id: 'my-reply', render: (props) => <MyReplySlide {...props} /> },
  { id: 'how-i-work', render: (props) => <HowIWorkSlide {...props} /> },
  { id: 'section-resolution', render: (props) => <SectionResolutionSlide {...props} /> },
  { id: 'three-levels', render: (props) => <ThreeLevelsSlide {...props} /> },
  { id: 'why-not-aligned', render: (props) => <WhyNotAlignedSlide {...props} /> },
  { id: 'mapped', render: (props) => <MappedSlide {...props} /> },
  { id: 'the-punchline', render: (props) => <PunchlineSlide {...props} /> },
  { id: 'goalpost', render: (props) => <GoalpostSlide {...props} /> },
  { id: 'precedent', render: (props) => <PrecedentSlide {...props} /> },
  { id: 'why-it-moves', render: (props) => <WhyItMovesSlide {...props} /> },
  { id: 'each-site-its-era', render: (props) => <EachSiteItsEraSlide {...props} /> },
  { id: 'management', render: (props) => <ManagementSlide {...props} /> },
  { id: 'recap', render: (props) => <RecapSlide {...props} /> },
  { id: 'sources', render: (props) => <SourcesSlide {...props} /> },
  { id: 'cta', render: (props) => <CtaSlide {...props} /> }
]

// Screenshot of the public reply this deck answers from; the same URL is the
// deck's primary source, so both slides read it from here.
const ASSET_BASE = '/decks/infra-ai-13'
const REPLY_URL = 'https://x.com/ebi/status/2101475304342766023'

// Level of autonomy a task is handed over at. The whole deck turns on this one
// distinction, so the labels live here and every slide reads them from here.
type Level = 1 | 2 | 3

const LEVELS: Record<Level, { label: string; gloss: string; icon: LucideIcon }> = {
  1: { label: 'AIが手を動かす', gloss: '設計と判断は人間', icon: Hand },
  2: { label: 'AIが案を出す', gloss: '選ぶのは人間', icon: Lightbulb },
  3: { label: 'AIが判断まで持つ', gloss: '人間は結果を見る', icon: UserCog }
}

const TASKS: Array<{ short: string; full: string; icon: LucideIcon }> = [
  { short: 'アカウント設計・IAM', full: 'アカウント／Organization設計、IAM、権限分離', icon: UserCog },
  { short: 'ネットワーク', full: 'VPC、Subnet、Routing、Firewall、VPN、PrivateLink', icon: Network },
  { short: '実行基盤', full: 'Kubernetes／ECS／VM／Serverless', icon: Boxes },
  { short: '状態を持つ基盤', full: 'DB、Redis、Kafka', icon: Database },
  { short: 'IaC・変更管理', full: 'Terraform等によるIaC、CI/CD、変更管理', icon: FileCode2 },
  { short: 'シークレット・証明書', full: 'Secret／KMS、証明書、セキュリティ', icon: KeyRound },
  { short: 'オブザーバビリティ', full: 'Logging／Metrics／Tracing／Alerting', icon: SignalHigh },
  { short: 'キャパシティ・性能', full: 'キャパシティ設計、スケーリング、パフォーマンス', icon: Gauge },
  { short: 'バックアップ・DR', full: 'Backup／Restore／Disaster Recovery', icon: HardDriveDownload },
  { short: 'SLO・可用性設計', full: 'SLO、可用性設計、障害対応、オンコール', icon: ShieldCheck },
  { short: 'コスト管理', full: 'コスト管理', icon: Coins },
  { short: 'コンプライアンス', full: 'Compliance、監査、脆弱性対応', icon: ScrollText },
  { short: '障害時の復旧判断', full: '本番障害時の原因切り分けと復旧判断', icon: Siren }
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
    <div className="ia13-head" style={lift(entrance(frame, fps), 22)}>
      <span className="slide-kicker">{kicker}</span>
      <h1>{title}</h1>
    </div>
  )
}

function Punch({ frame, delay = 70, children }: { frame: number; delay?: number; children: React.ReactNode }) {
  const { fps } = useVideoConfig()
  return (
    <p className="ia13-punch" style={lift(entrance(frame, fps, delay), 14)}>
      {children}
    </p>
  )
}

function OpeningSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide opening-slide ia13-slide ia13-opening">
      <div className="motion-grid" />
      <LogoMark />
      <div className="showcase-copy">
        <span className="slide-kicker ia13-alarm" style={lift(entrance(frame, fps), 18)}>
          「インフラはAIには無理」への回答
        </span>
        <h1 style={lift(entrance(frame, fps, 10), 26)}>
          私はインフラエンジニアの
          <br />
          業務を全部
          <br />
          AIにやらせています
        </h1>
        <p style={lift(entrance(frame, fps, 26), 18)}>
          ただし<b>「何も知らない人間ができる」とは思わない</b>。
          <br />
          その差が、この動画の中身です。
        </p>
      </div>
    </section>
  )
}

function ProfileSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const facts = ['Microsoft MVP 14年連続', 'Windows Server / Azure / Azure Hybrid', '生成AIを実運用へ組み込み中', '著書「Windowsインフラ管理者入門」']
  return (
    <section className="remotion-slide ia13-slide">
      <Header kicker="YOUR GUIDE" title="解説する人：胡田 昌彦" frame={frame} />
      <div className="ia13-profile">
        <div className="ia13-profile-mark" style={lift(entrance(frame, fps, 16), 22)}>
          <LogoMark className="ia13-profile-logo" />
          <strong>
            Masahiko
            <br />
            Ebisuda
          </strong>
          <span>えびすだ まさひこ</span>
        </div>
        <div className="ia13-profile-facts">
          {facts.map((fact, i) => (
            <div key={fact} style={lift(entrance(frame, fps, 28 + i * 10), 16)}>
              <ShieldCheck size={24} />
              <strong>{fact}</strong>
            </div>
          ))}
        </div>
      </div>
      <Punch frame={frame} delay={72}>
        今日の話は意見ではなく、<b>毎日やっていることの報告</b>です。
      </Punch>
    </section>
  )
}

function TheListSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide ia13-slide">
      <Header kicker="THE LIST" title="回ってきた13項目" frame={frame} />
      <ol className="ia13-list">
        {TASKS.map((task, i) => (
          <li key={task.short} style={lift(entrance(frame, fps, 10 + i * 4), 12)}>
            <span className="ia13-list-no">{String(i + 1).padStart(2, '0')}</span>
            <span className="ia13-list-body">{task.full}</span>
          </li>
        ))}
      </ol>
      <Punch frame={frame} delay={78}>
        よくできたリストです。<b>実務を知っている人が書いている</b>。だから土台にします。
      </Punch>
    </section>
  )
}

function MyReplySlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide ia13-slide ia13-reply-slide">
      <Header kicker="MY REPLY" title="私はこう答えました" frame={frame} />
      <div className="ia13-reply">
        <figure className="ia13-shot" style={lift(entrance(frame, fps, 14), 22)}>
          <img src={`${ASSET_BASE}/x-reply.webp`} alt="元投稿を引用した返信（Xの公開投稿）のスクリーンショット" />
          <figcaption>
            <a href={REPLY_URL} target="_blank" rel="noreferrer">
              2026年9月20日のポスト
            </a>
          </figcaption>
        </figure>
        <blockquote className="ia13-quote" style={lift(entrance(frame, fps, 26), 20)}>
          <span>それ丸ごとできるけどな。私やらせてるけど。</span>
          <span className="ia13-quote-dim">何も知らない人間ができるとは思わないけども。</span>
          <strong>「AIでできる」の解像度を高めないと議論に乗らないかなあ。</strong>
        </blockquote>
      </div>
      <Punch frame={frame} delay={74}>
        <b>できる／できないの二択</b>で話している限り、この議論は終わりません。
      </Punch>
    </section>
  )
}

function HowIWorkSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const modes = [
    {
      icon: MousePointerClick,
      tone: 'past',
      when: 'もうやっていない',
      what: 'ポータル画面を自分で触る。コマンドを自分で打つ。'
    },
    {
      icon: Bot,
      tone: 'now',
      when: 'いまのやり方',
      what: 'やってほしいことをAIに伝えて、やってもらう。'
    }
  ] as const
  return (
    <section className="remotion-slide ia13-slide ia13-work-slide">
      <Header kicker="HOW I ACTUALLY WORK" title="自分では、もう触っていません" frame={frame} />
      <div className="ia13-modes">
        {modes.map((mode, i) => {
          const Icon = mode.icon
          return (
            <div key={mode.when} className={`ia13-mode ia13-mode-${mode.tone}`} style={lift(entrance(frame, fps, 16 + i * 16), 20)}>
              <Icon size={38} />
              <div>
                <span>{mode.when}</span>
                <strong>{mode.what}</strong>
              </div>
            </div>
          )
        })}
      </div>
      <Punch frame={frame} delay={78}>
        これは見通しではなく、<b>今日そうやって仕事をしている</b>という報告です。
      </Punch>
    </section>
  )
}

function SectionResolutionSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide ia13-slide ia13-section">
      <div className="motion-grid" />
      <span className="slide-kicker" style={lift(entrance(frame, fps), 18)}>
        SECTION 2
      </span>
      <h1 style={lift(entrance(frame, fps, 12), 26)}>
        「AIでできる」の
        <br />
        解像度を上げる
      </h1>
    </section>
  )
}

function ThreeLevelsSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const order: Level[] = [1, 2, 3]
  return (
    <section className="remotion-slide ia13-slide">
      <Header kicker="THE DISTINCTION" title="「できる」には3つの層がある" frame={frame} />
      <div className="ia13-levels">
        {order.map((level, i) => {
          const Icon = LEVELS[level].icon
          return (
            <div key={level} className={`ia13-level ia13-level-${level}`} style={lift(entrance(frame, fps, 16 + i * 14), 20)}>
              <span className="ia13-level-no">LEVEL {level}</span>
              <Icon size={42} />
              <strong>{LEVELS[level].label}</strong>
              <span className="ia13-level-gloss">{LEVELS[level].gloss}</span>
            </div>
          )
        })}
      </div>
      <Punch frame={frame} delay={78}>
        この3つは<b>まったく別の話</b>なのに、同じ「AIでできる」で語られています。
      </Punch>
    </section>
  )
}

function WhyNotAlignedSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const sides = [
    { who: '「AIでできる」派', points: 'LEVEL 1 〜 2', tone: 'yes' as const },
    { who: '「AIには無理」派', points: 'LEVEL 3', tone: 'no' as const }
  ]
  return (
    <section className="remotion-slide ia13-slide">
      <Header kicker="WHY IT STALLS" title="議論が噛み合わない理由" frame={frame} />
      <div className="ia13-sides">
        {sides.map((side, i) => (
          <div key={side.who} className={`ia13-side ia13-side-${side.tone}`} style={lift(entrance(frame, fps, 18 + i * 16), 20)}>
            <strong>{side.who}</strong>
            <span>が指しているのは</span>
            <em>{side.points}</em>
          </div>
        ))}
      </div>
      <p className="ia13-verdict" style={lift(entrance(frame, fps, 62), 16)}>
        どちらも正しい。<b>指しているものが違うだけ</b>。
      </p>
      <Punch frame={frame} delay={86}>
        「AIでインフラはできますか」は、<b>レベルを添えないと質問として成立していない</b>。
      </Punch>
    </section>
  )
}

function MappedSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  // No item is pinned to a level: what splits the work is作業 vs デザイン, and
  // where the line falls is a per-system call rather than an allocation.
  const band = [
    {
      level: 3 as Level,
      when: '作業',
      what: '完全にAIに任せられる',
      note: 'リスクが低いシステムなら、13項目ぜんぶここで回せる'
    },
    {
      level: 2 as Level,
      when: 'デザイン（設計）',
      what: '人間がやるべき領域が、まだまだ大きい',
      note: 'AI自体も設計はできる。案を見て、人間が決める'
    }
  ]
  return (
    <section className="remotion-slide ia13-slide ia13-mapped-slide">
      <Header kicker="THE MAP" title="作業は任せられる。デザインはまだ人間" frame={frame} />
      <div className="ia13-band">
        {band.map((row, i) => (
          <div key={row.level} className={`ia13-band-col ia13-level-${row.level}`} style={lift(entrance(frame, fps, 14 + i * 14), 20)}>
            <span className="ia13-level-no">LEVEL {row.level}</span>
            <strong>{LEVELS[row.level].label}</strong>
            <em>{row.when}</em>
            <p>{row.what}</p>
            <span className="ia13-band-note">{row.note}</span>
          </div>
        ))}
      </div>
      <p className="ia13-band-zero" style={lift(entrance(frame, fps, 52), 16)}>
        コストだけは、人間が「問題ない」ことを確認する。LEVEL 1 に置いている項目は<b>ゼロ</b>。
      </p>
      <Punch frame={frame} delay={86}>
        項目ごとに固定ではありません。<b>システムの重要度とリスクで都度</b>。正解がないことも多い。
      </Punch>
    </section>
  )
}

function PunchlineSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const stats = [
    { value: 0, unit: '項目', label: 'AIが一切触れない' },
    { value: 0, unit: '項目', label: '手だけ借りる（LEVEL 1）' },
    { value: TASKS.length, unit: '項目', label: 'LEVEL 2〜3 で動かしている' }
  ]
  return (
    <section className="remotion-slide ia13-slide ia13-punchline-slide">
      <Header kicker="THE PUNCHLINE" title="触れない項目もゼロ。LEVEL 1 もゼロ" frame={frame} />
      <div className="ia13-stats">
        {stats.map((stat, i) => (
          <div key={stat.label} style={lift(entrance(frame, fps, 18 + i * 14), 22)}>
            <strong>
              {stat.value}
              <span>{stat.unit}</span>
            </strong>
            <span className="ia13-stat-label">{stat.label}</span>
          </div>
        ))}
      </div>
      <Punch frame={frame} delay={80}>
        「全部できる」も「まだ無理」も、<b>同じ現実を別の角度から言っている</b>だけ。
      </Punch>
    </section>
  )
}

function GoalpostSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const said = [
    '非エンジニアが開発のようにパッとAIに指示出してできることはない、ということを言っています',
    'エンジニア経験長いのであれば、これくらいはAI使ってできるのは当然なのでは'
  ]
  return (
    <section className="remotion-slide ia13-slide">
      <Header kicker="THE GOALPOST MOVED" title="争点は、すでに動いている" frame={frame} />
      <p className="ia13-said-lead" style={lift(entrance(frame, fps, 10), 14)}>
        元の投稿をした方が、後からこう書いています。
      </p>
      <div className="ia13-said">
        {said.map((line, i) => (
          <p key={line} style={lift(entrance(frame, fps, 14 + i * 14), 18)}>
            <Milestone size={26} />
            <span>{line}</span>
          </p>
        ))}
      </div>
      <div className="ia13-shift" style={lift(entrance(frame, fps, 52), 18)}>
        <em>「インフラはAIオンリーでは厳しい」</em>
        <span>から</span>
        <strong>「エンジニアならAIでできて当然」</strong>
      </div>
      <Punch frame={frame} delay={84}>
        「AIにできるか」ではなく<b>「誰がやればできるか」</b>。私の最初の返信と、同じ場所です。
      </Punch>
    </section>
  )
}

function PrecedentSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const steps = [
    { when: 'かつて', what: '「AIがプログラムを書くなんて」' },
    { when: 'いま', what: '「もうAIに任せています」が多数派に' },
    { when: 'クラウド', what: 'すでに同じ移動が起きている' },
    { when: 'オンプレ', what: '時間の問題' }
  ]
  return (
    <section className="remotion-slide ia13-slide">
      <Header kicker="THE PRECEDENT" title="プログラマーで起きたことが、起きる" frame={frame} />
      <div className="ia13-steps">
        {steps.map((step, i) => (
          <div key={step.when} style={lift(entrance(frame, fps, 14 + i * 12), 18)}>
            <span className="ia13-step-when">{step.when}</span>
            <strong>{step.what}</strong>
          </div>
        ))}
      </div>
      <Punch frame={frame} delay={82}>
        その移動は下の層から起きます。私の手元では<b>LEVEL 1 がもう空</b>になりました。
      </Punch>
    </section>
  )
}

function WhyItMovesSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const needs = [
    { icon: BookOpen, title: 'スキル集', gloss: 'AIに渡せる形になった運用知識' },
    { icon: FileCode2, title: 'AIが読みやすいドキュメント', gloss: '人間向けの読み物ではなく参照用' },
    { icon: Layers, title: 'リファレンスアーキテクチャ', gloss: '典型的なパターンを網羅したもの' }
  ]
  return (
    <section className="remotion-slide ia13-slide ia13-moves-slide">
      <Header kicker="WHY IT WILL MOVE" title="整備する動機は、運営元が一番持っている" frame={frame} />
      <div className="ia13-needs">
        {needs.map((need, i) => {
          const Icon = need.icon
          return (
            <div key={need.title} style={lift(entrance(frame, fps, 14 + i * 12), 20)}>
              <Icon size={32} />
              <strong>{need.title}</strong>
              <span>{need.gloss}</span>
            </div>
          )
        })}
      </div>
      <div className="ia13-who" style={lift(entrance(frame, fps, 56), 18)}>
        <Cloud size={34} />
        <div>
          <span>これを揃えたいのは誰か</span>
          <strong>そのクラウドを運営しているメガテック自身。競い合って「AIが使いやすいクラウド」にしていく。</strong>
        </div>
      </div>
      <Punch frame={frame} delay={88}>
        AWS／GCP／Azureだけの話ではありません。<b>APIで触れるものすべて</b>、M365もWorkspaceも同じです。
      </Punch>
    </section>
  )
}

function EachSiteItsEraSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const steps = [
    { when: 'ただし', what: 'アプリからインフラまで全部、となるとレガシーの問題が大きく、ものすごく時間がかかる' },
    { when: '現に', what: 'メインフレームもCOBOLも、まだ現役で動いている' },
    { when: 'つまり', what: '「現場」ごとに違う「時代」がある。自分に合った現場＝時代で働ける' }
  ]
  return (
    <section className="remotion-slide ia13-slide ia13-era-slide">
      <Header kicker="NOT EVERYWHERE AT ONCE" title="現場ごとに、違う「時代」がある" frame={frame} />
      <div className="ia13-steps">
        {steps.map((step, i) => (
          <div key={step.when} style={lift(entrance(frame, fps, 14 + i * 12), 18)}>
            <span className="ia13-step-when">{step.when}</span>
            <strong>{step.what}</strong>
          </div>
        ))}
      </div>
      <Punch frame={frame} delay={80}>
        重宝されるのは、最先端をわかった上で<b>幅広い時代に合わせられる人</b>、現場に時代をまたぐ変化を起こせる人。
      </Punch>
    </section>
  )
}

function ManagementSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide ia13-slide">
      <Header kicker="FOR DECISION MAKERS" title="経営にも大きな影響がある" frame={frame} />
      <div className="ia13-mgmt">
        <div className="ia13-mgmt-said" style={lift(entrance(frame, fps, 16), 20)}>
          <span>よく聞く相談</span>
          <strong>「インフラ人材が採れない」</strong>
        </div>
        <div className="ia13-mgmt-real" style={lift(entrance(frame, fps, 34), 20)}>
          <span>本当の形</span>
          <strong>
            AIに任せられる層と任せてはいけない層の境目を、
            <br />
            社内の誰も言語化できていない
          </strong>
        </div>
      </div>
      <Punch frame={frame} delay={80}>
        境目が引けていないと<b>「全部人間」か「全部丸投げ」の二択</b>になり、どちらも失敗します。
      </Punch>
    </section>
  )
}

function RecapSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const points = [
    '「AIでできる」は 手を動かす／案を出す／判断まで持つ の3層',
    '13項目のうち、触れない項目も、手だけ借りる項目もゼロ',
    '作業は完全にAIに任せられる',
    'デザインは人間がやるべき領域がまだ大きい。AI自体も設計はできる',
    'リスクが低ければ全部任せられる。コストだけは人間が確認する',
    'どこまで任せるかは重要度とリスクで都度。正解がないことも多い'
  ]
  return (
    <section className="remotion-slide ia13-slide">
      <Header kicker="RECAP" title="今日のまとめ" frame={frame} />
      <ol className="ia13-recap">
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
  const sources = [
    { label: '元の13項目リスト（@aws202211maru）', href: 'https://x.com/aws202211maru/status/2101242302870298739' },
    { label: '私の返信（スライドのスクリーンショット）', href: REPLY_URL },
    { label: 'プログラマーの先例について', href: 'https://x.com/ebi/status/2101480635575754906' }
  ]
  return (
    <section className="remotion-slide ia13-slide">
      <Header kicker="SOURCES" title="出典" frame={frame} />
      <ul className="ia13-sources">
        {sources.map((source, i) => (
          <li key={source.href} style={lift(entrance(frame, fps, 16 + i * 12), 16)}>
            <Stethoscope size={20} />
            <a href={source.href} target="_blank" rel="noreferrer">
              {source.label}
            </a>
          </li>
        ))}
      </ul>
      <Punch frame={frame} delay={64}>
        いずれもXの<b>公開投稿</b>です。リンクは概要欄に置きます。
      </Punch>
    </section>
  )
}
