/* eslint-disable react-refresh/only-export-components */
import {
  AlarmClock,
  Archive,
  ArrowRight,
  Bot,
  Boxes,
  CalendarClock,
  Check,
  CirclePlay,
  ClipboardList,
  Cloud,
  CloudOff,
  Database,
  FileSearch,
  Filter,
  Fingerprint,
  Globe,
  Layers,
  ListChecks,
  Lock,
  LockKeyhole,
  Monitor,
  Radar,
  RefreshCw,
  ServerCog,
  ShieldAlert,
  ShieldCheck,
  Siren,
  Smartphone,
  ThumbsUp,
  Timer,
  Trash2,
  TriangleAlert,
  User,
  UserCheck,
  UserX,
  Workflow,
  X
} from 'lucide-react'
import { spring, useVideoConfig } from 'remotion'
import type { SlideModule, SlideRenderContext } from '../../../src/types'
import { LogoMark } from '../../../src/deck-shared'

export const slides: SlideModule['slides'] = [
  { render: (props) => <OpeningSlide {...props} /> },
  { render: (props) => <ProfileSlide {...props} /> },
  { render: (props) => <TheSceneSlide {...props} /> },
  { render: (props) => <TheWallSlide {...props} /> },
  { render: (props) => <ExclusionTrapSlide {...props} /> },
  { render: (props) => <WhatIsServiceIdSlide {...props} /> },
  { render: (props) => <SectionPeopleSlide {...props} /> },
  { render: (props) => <MethodsSlide {...props} /> },
  { render: (props) => <GuestsSlide {...props} /> },
  { render: (props) => <GuestMethodsSlide {...props} /> },
  { render: (props) => <RealQuestionSlide {...props} /> },
  { render: (props) => <SectionInventorySlide {...props} /> },
  { render: (props) => <InventoryLogsSlide {...props} /> },
  { render: (props) => <SortByLogSlide {...props} /> },
  { render: (props) => <LogsBlindspotsSlide {...props} /> },
  { render: (props) => <RetentionSlide {...props} /> },
  { render: (props) => <LedgerSlide {...props} /> },
  { render: (props) => <LedgerHumanPartSlide {...props} /> },
  { render: (props) => <SectionDestinationSlide {...props} /> },
  { render: (props) => <ClassifySlide {...props} /> },
  { render: (props) => <NotByNameSlide {...props} /> },
  { render: (props) => <ManagedIdentitySlide {...props} /> },
  { render: (props) => <ArcSlide {...props} /> },
  { render: (props) => <MiNotSilverBulletSlide {...props} /> },
  { render: (props) => <WifSlide {...props} /> },
  { render: (props) => <UamiVsAppSlide {...props} /> },
  { render: (props) => <WifGuardrailsSlide {...props} /> },
  { render: (props) => <LegacyCageSlide {...props} /> },
  { render: (props) => <SectionPitfallSlide {...props} /> },
  { render: (props) => <RopcSlide {...props} /> },
  { render: (props) => <DeviceCodeSlide {...props} /> },
  { render: (props) => <DeviceCodeScopeSlide {...props} /> },
  { render: (props) => <ReportOnlyTrapSlide {...props} /> },
  { render: (props) => <RolloutSlide {...props} /> },
  { render: (props) => <MicrosoftMfaSlide {...props} /> },
  { render: (props) => <RecapSlide {...props} /> },
  { render: (props) => <RelatedVideosSlide {...props} /> },
  { render: (props) => <EbiStudySlide {...props} /> },
  { render: (props) => <SourcesSlide {...props} /> },
  { render: (props) => <ThanksSlide {...props} /> }
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
    <div className="svc-head" style={lift(entrance(frame, fps), 22)}>
      <span className="slide-kicker">{kicker}</span>
      <h1>{title}</h1>
    </div>
  )
}

function Punch({ frame, delay = 70, children }: { frame: number; delay?: number; children: React.ReactNode }) {
  const { fps } = useVideoConfig()
  return (
    <p className="svc-punch" style={lift(entrance(frame, fps, delay), 14)}>
      {children}
    </p>
  )
}

function SourceLine({ href, label }: { href: string; label: string }) {
  return (
    <a className="svc-source-line" href={href} target="_blank" rel="noreferrer">
      Source: {label}
    </a>
  )
}

function SectionSlide({
  frame,
  number,
  title,
  lead
}: {
  frame: number
  number: string
  title: string
  lead: string
}) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide svc-slide svc-section">
      <div className="svc-grid-bg" />
      <div className="svc-section-body">
        <span className="svc-section-number" style={lift(entrance(frame, fps), 30)}>
          {number}
        </span>
        <h1 style={lift(entrance(frame, fps, 12), 26)}>{title}</h1>
        <p style={lift(entrance(frame, fps, 26), 20)}>{lead}</p>
      </div>
    </section>
  )
}

function OpeningSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const pulse = 1 + Math.sin(frame / 13) * 0.02
  return (
    <section className="remotion-slide svc-slide svc-opening">
      <div className="svc-grid-bg" />
      <LogoMark className="svc-logo" />
      <div className="svc-opening-copy" style={lift(entrance(frame, fps), 44)}>
        <span className="slide-kicker">MFA ROLLOUT × SERVICE IDENTITIES</span>
        <h1>
          MFAをかけられない
          <br />
          <em>IDをどうするか</em>
        </h1>
        <p>全社展開の最後に残る「人がいないID」を、見つけて、移す。</p>
      </div>
      <div className="svc-opening-visual" style={{ transform: `scale(${pulse})` }}>
        <div className="svc-orbit svc-orbit-one" />
        <div className="svc-orbit svc-orbit-two" />
        <div className="svc-id-core">
          <Fingerprint size={80} strokeWidth={1.5} />
          <span>NO HUMAN</span>
        </div>
        <div className="svc-satellite svc-sat-bot">
          <Bot size={30} />
          <span>バッチ</span>
        </div>
        <div className="svc-satellite svc-sat-server">
          <ServerCog size={30} />
          <span>RPA</span>
        </div>
        <div className="svc-satellite svc-sat-phone">
          <Smartphone size={30} />
          <span>MFA?</span>
        </div>
      </div>
      <SourceLine
        href="https://learn.microsoft.com/entra/workload-id/workload-identities-overview"
        label="Microsoft Learn ─ Workload identities"
      />
    </section>
  )
}

function ProfileSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const facts = ['Microsoft MVP 14年連続', 'Windows・Azure・M365', '生成AIを実機で検証', '著書「Windowsインフラ管理者入門」']
  return (
    <section className="remotion-slide svc-slide">
      <Header kicker="YOUR GUIDE" title="解説する人：胡田 昌彦" frame={frame} />
      <div className="svc-profile-layout">
        <div className="svc-profile-mark" style={lift(entrance(frame, fps, 16), 22)}>
          <LogoMark />
          <strong>
            Masahiko
            <br />
            Ebisuda
          </strong>
          <span>えびすだ まさひこ</span>
        </div>
        <div className="svc-profile-facts">
          {facts.map((fact, i) => (
            <div key={fact} style={lift(entrance(frame, fps, 28 + i * 10), 16)}>
              <Check size={26} />
              <strong>{fact}</strong>
            </div>
          ))}
        </div>
      </div>
      <Punch frame={frame} delay={72}>
        今日は<b>運用の現場で必ず詰まるところ</b>だけを扱います。
      </Punch>
    </section>
  )
}

function TheSceneSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const drivers = [
    { label: 'ランサムウェアの被害事例', icon: <Siren size={32} /> },
    { label: 'サイバー保険・監査の要件', icon: <ShieldCheck size={32} /> },
    { label: '取引先からの要請', icon: <Boxes size={32} /> }
  ]
  return (
    <section className="remotion-slide svc-slide">
      <Header kicker="THE SITUATION ─ 01" title="「今年こそMFAを全社へ」" frame={frame} />
      <div className="svc-driver-row">
        {drivers.map((driver, i) => (
          <div key={driver.label} className="svc-driver" style={lift(entrance(frame, fps, 18 + i * 12), 20)}>
            {driver.icon}
            <strong>{driver.label}</strong>
          </div>
        ))}
      </div>
      <div className="svc-progress" style={lift(entrance(frame, fps, 58), 18)}>
        <div className="svc-progress-bar">
          <span style={{ width: '82%' }} />
        </div>
        <div className="svc-progress-legend">
          <b>人のアカウントの展開は、実はそれほど難しくない</b>
        </div>
      </div>
      <Punch frame={frame} delay={80}>
        止まるのは、いつも<b>最後の十数%</b>。
      </Punch>
    </section>
  )
}

function TheWallSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const examples = [
    { icon: <AlarmClock size={30} />, label: '夜間バッチ' },
    { icon: <Bot size={30} />, label: 'RPA' },
    { icon: <Monitor size={30} />, label: '会議室端末' },
    { icon: <Radar size={30} />, label: '監視ツール' },
    { icon: <Database size={30} />, label: '連携ジョブ' },
    { icon: <ServerCog size={30} />, label: '出所不明の何か' }
  ]
  return (
    <section className="remotion-slide svc-slide">
      <Header kicker="THE SITUATION ─ 02" title="人がいないIDには、多要素をかけられない" frame={frame} />
      <div className="svc-wall-formula" style={lift(entrance(frame, fps, 16), 22)}>
        <div className="svc-formula-part">
          <Smartphone size={40} />
          <strong>MFA</strong>
          <span>人が「持っているもの」で本人を確かめる</span>
        </div>
        <div className="svc-formula-op">
          <UserX size={44} />
        </div>
        <div className="svc-formula-part svc-formula-bad">
          <Bot size={40} />
          <strong>確かめる人がいない</strong>
          <span>だから、原理的にかけられない</span>
        </div>
      </div>
      <div className="svc-chip-row">
        {examples.map((item, i) => (
          <div key={item.label} className="svc-chip" style={lift(entrance(frame, fps, 44 + i * 8), 16)}>
            {item.icon}
            <span>{item.label}</span>
          </div>
        ))}
      </div>
      <Punch frame={frame} delay={96}>
        まずここを認める。<b>工夫でどうにかする話ではない。</b>
      </Punch>
    </section>
  )
}

function ExclusionTrapSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const growth = ['最初は3件', '半年で20件', '2年で「触れないグループ」']
  return (
    <section className="remotion-slide svc-slide">
      <Header kicker="THE SITUATION ─ 03" title="そして「除外グループ」が生まれる" frame={frame} />
      <div className="svc-exclusion-stage">
        <div className="svc-exclusion-timeline">
          {growth.map((label, i) => (
            <div key={label} style={lift(entrance(frame, fps, 18 + i * 14), 18)}>
              <span>{String(i + 1).padStart(2, '0')}</span>
              <strong>{label}</strong>
            </div>
          ))}
        </div>
        <div className="svc-exclusion-bin" style={lift(entrance(frame, fps, 60), 24)}>
          <Trash2 size={62} />
          <strong>MFA除外グループ</strong>
          <span>困ったらここへ入れる</span>
        </div>
      </div>
      <div className="svc-alert" style={lift(entrance(frame, fps, 82), 16)}>
        <TriangleAlert size={34} />
        <p>
          全社にMFAを入れたのに、<b>攻撃者から見て一番おいしい入口</b>が一箇所にまとまる。
        </p>
      </div>
    </section>
  )
}

function WhatIsServiceIdSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const names = ['サービスアカウント', 'システム利用ID', '共有アカウント', '運用ID', '連携用ユーザー']
  return (
    <section className="remotion-slide svc-slide">
      <Header kicker="DEFINITION" title="「サービスID」と呼んでいるもの" frame={frame} />
      <div className="svc-alias-row">
        {names.map((name, i) => (
          <div key={name} className="svc-alias" style={lift(entrance(frame, fps, 16 + i * 9), 16)}>
            {name}
          </div>
        ))}
      </div>
      <div className="svc-definition" style={lift(entrance(frame, fps, 62), 20)}>
        <Fingerprint size={44} />
        <div>
          <strong>共通しているのは、この2つ</strong>
          <ul>
            <li>人が対話的にサインインしない</li>
            <li>特定の1人に紐づいていない</li>
          </ul>
        </div>
      </div>
      <Punch frame={frame} delay={86}>
        呼び方は組織ごとに違う。まず<b>自分の組織の言葉</b>で言えるようにする。
      </Punch>
    </section>
  )
}

function SectionPeopleSlide(props: SlideRenderContext) {
  return (
    <SectionSlide
      frame={props.frame}
      number="SECTION 1"
      title="まず、人にどうかけるのか"
      lead="ここが曖昧なままだと、本来かけられるものまで例外にしてしまう。"
    />
  )
}

function MethodsSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const rows: [string, string, boolean][] = [
    ['パスキー（FIDO2）', '単独でも / 2要素目でも', true],
    ['Microsoft Authenticator（パスキー）', '単独でも / 2要素目でも', true],
    ['Windows Hello for Business', '単独でも / 2要素目でも', true],
    ['証明書ベース認証（CBA）', '単独でも / 2要素目でも', true],
    ['Authenticator プッシュ通知', '単独でも / 2要素目でも', false],
    ['ハードウェア / ソフトウェア OATH トークン', '2要素目のみ', false],
    ['SMS / 音声通話', 'SMSは単独可 / 音声は2要素目のみ', false]
  ]
  return (
    <section className="remotion-slide svc-slide">
      <Header kicker="PEOPLE ─ 01" title="使える「要素」は、思っているより多い" frame={frame} />
      <div className="svc-method-table">
        {rows.map((row, i) => (
          <div
            key={row[0]}
            className={`svc-method-row${row[2] ? ' svc-method-strong' : ''}`}
            style={lift(entrance(frame, fps, 12 + i * 7), 14)}
          >
            <strong>{row[0]}</strong>
            <span>{row[1]}</span>
            {row[2] ? <i>フィッシング耐性</i> : <i />}
          </div>
        ))}
      </div>
      <Punch frame={frame} delay={72}>
        「スマホを配っていないからMFAは無理」ではない。<b>選択肢を知らないだけ</b>のことが多い。
      </Punch>
      <SourceLine
        href="https://learn.microsoft.com/entra/identity/authentication/overview-authentication"
        label="Microsoft Learn ─ Authentication methods"
      />
    </section>
  )
}

function GuestsSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide svc-slide">
      <Header kicker="PEOPLE ─ 02" title="「相手がMFAを入れていないから無理」は誤り" frame={frame} />
      <div className="svc-myth">
        <div className="svc-myth-wrong" style={lift(entrance(frame, fps, 16), 22)}>
          <X size={36} />
          <strong>よく言われること</strong>
          <p>「うちはMFAを展開していないので、ゲストとして対応できません」</p>
        </div>
        <div className="svc-myth-right" style={lift(entrance(frame, fps, 38), 22)}>
          <Check size={36} />
          <strong>実際の動き</strong>
          <p>
            B2Bコラボレーションのゲストは、既定では<b>招待した側のテナントでMFAを登録して満たす</b>。
            相手組織の展開状況は関係ない。ライセンスも招待した側が持つ。
          </p>
        </div>
      </div>
      <Punch frame={frame} delay={64}>
        相手テナントのMFAを信頼したいときだけ、<b>テナント間アクセス設定で明示的に信頼</b>を入れる。
      </Punch>
      <SourceLine
        href="https://learn.microsoft.com/entra/external-id/authentication-conditional-access"
        label="Microsoft Learn ─ Authentication and Conditional Access for B2B users"
      />
    </section>
  )
}

function GuestMethodsSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const rows: [string, boolean, boolean][] = [
    ['SMS（2要素目）', true, true],
    ['音声通話', true, true],
    ['Authenticator プッシュ通知', true, true],
    ['ソフトウェア OATH トークン', true, true],
    ['ハードウェア OATH トークン', true, false],
    ['FIDO2 セキュリティキー', true, false],
    ['Windows Hello for Business', true, false],
    ['証明書ベース認証', true, false]
  ]
  return (
    <section className="remotion-slide svc-slide">
      <Header kicker="PEOPLE ─ 03" title="自社側で登録できる方式は限られる" frame={frame} />
      <div className="svc-guest-table">
        <div className="svc-guest-head" style={lift(entrance(frame, fps, 10), 14)}>
          <span />
          <b>相手（ホーム）テナント</b>
          <b>自社（リソース）テナント</b>
        </div>
        {rows.map((row, i) => (
          <div key={row[0]} className="svc-guest-row" style={lift(entrance(frame, fps, 18 + i * 6), 12)}>
            <strong>{row[0]}</strong>
            <span className={row[1] ? 'svc-yes' : 'svc-no'}>{row[1] ? '○' : '×'}</span>
            <span className={row[2] ? 'svc-yes' : 'svc-no'}>{row[2] ? '○' : '×'}</span>
          </div>
        ))}
      </div>
      <Punch frame={frame} delay={74}>
        ゲストに<b>フィッシング耐性のある方式</b>を求めるなら、相手テナントのMFAを信頼する設定とセットで考える。
      </Punch>
    </section>
  )
}

function RealQuestionSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide svc-slide svc-question-slide">
      <Header kicker="THE CORE" title="ここから先が、本題の2つ" frame={frame} />
      <div className="svc-question-row">
        <div className="svc-question-card" style={lift(entrance(frame, fps, 20), 26)}>
          <span>Q1</span>
          <strong>どこにいるのか</strong>
          <p>棚卸し</p>
        </div>
        <ArrowRight size={52} />
        <div className="svc-question-card" style={lift(entrance(frame, fps, 40), 26)}>
          <span>Q2</span>
          <strong>どこへ移すのか</strong>
          <p>移行先の設計</p>
        </div>
      </div>
    </section>
  )
}

function SectionInventorySlide(props: SlideRenderContext) {
  return (
    <SectionSlide
      frame={props.frame}
      number="SECTION 2"
      title="どこにいるのかを見つける"
      lead="移行先の技術より先に、まず対象を見つける。"
    />
  )
}

function InventoryLogsSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const logs = [
    { label: '対話型サインイン', note: '人が画面で入る', muted: true },
    { label: '非対話型サインイン', note: 'サービスIDはほぼここ', muted: false },
    { label: 'サービスプリンシパル', note: 'アプリ自身の認証', muted: false },
    { label: 'マネージドID', note: 'Azureが管理するID', muted: false }
  ]
  return (
    <section className="remotion-slide svc-slide">
      <Header kicker="INVENTORY ─ 01" title="サインインログは、4種類ある" frame={frame} />
      <div className="svc-log-row">
        {logs.map((log, i) => (
          <div
            key={log.label}
            className={`svc-log-card${log.muted ? ' svc-log-muted' : ''}`}
            style={lift(entrance(frame, fps, 18 + i * 11), 20)}
          >
            <FileSearch size={30} />
            <strong>{log.label}</strong>
            <span>{log.note}</span>
            {log.muted ? <i>管理画面の既定表示</i> : null}
          </div>
        ))}
      </div>
      <div className="svc-alert" style={lift(entrance(frame, fps, 70), 16)}>
        <TriangleAlert size={34} />
        <p>
          既定表示は<b>対話型だけ</b>。ここだけ見て「サービスIDは無い」と結論するのが典型的な取りこぼし。
        </p>
      </div>
      <SourceLine
        href="https://learn.microsoft.com/entra/identity/monitoring-health/concept-sign-ins"
        label="Microsoft Learn ─ Microsoft Entra sign-in logs"
      />
    </section>
  )
}

function SortByLogSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const buckets = [
    {
      tone: 'good',
      icon: <UserCheck size={34} />,
      title: 'そのままMFAをかける',
      body: '対話型ログに出てくる、人のサインイン',
      note: '本来ここが大多数。例外にしない'
    },
    {
      tone: 'work',
      icon: <Bot size={34} />,
      title: '移行を検討する',
      body: '非対話型・サービスプリンシパル・マネージドIDのログ',
      note: '＝ 今日の主題のサービスID'
    },
    {
      tone: 'warn',
      icon: <TriangleAlert size={34} />,
      title: '個別に確認する',
      body: '対話型に見えるが、実体はスクリプト',
      note: '人の操作があるかをログだけでは決められない'
    }
  ]
  return (
    <section className="remotion-slide svc-slide">
      <Header kicker="INVENTORY ─ 02" title="今のログを、3つに仕分ける" frame={frame} />
      <div className="svc-bucket-row">
        {buckets.map((bucket, i) => (
          <div
            key={bucket.title}
            className={`svc-bucket svc-bucket-${bucket.tone}`}
            style={lift(entrance(frame, fps, 18 + i * 13), 22)}
          >
            {bucket.icon}
            <strong>{bucket.title}</strong>
            <span>{bucket.body}</span>
            <i>{bucket.note}</i>
          </div>
        ))}
      </div>
      <Punch frame={frame} delay={76}>
        <b>まだMFAをかけていない今の状態</b>のログでやる。かけた後では、止まってから気づくことになる。
      </Punch>
    </section>
  )
}

function LogsBlindspotsSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const spots = [
    { icon: <Timer size={30} />, title: '保持期間', body: '既定は最大30日。月次・四半期のバッチは窓に入らない' },
    { icon: <RefreshCw size={30} />, title: '既存トークン', body: '再認証しないIDは、そもそもログに現れない' },
    { icon: <CloudOff size={30} />, title: 'Entra外の認証', body: 'オンプレ直結、SQL認証、アクセスキーは対象外' },
    { icon: <User size={30} />, title: '所有者・用途', body: 'どこにも書かれていない。人に聞くしかない' },
    { icon: <Layers size={30} />, title: '規模', body: '大規模テナントは画面のエクスポート上限に当たる' }
  ]
  return (
    <section className="remotion-slide svc-slide">
      <Header kicker="INVENTORY ─ 03" title="それでも、ログで埋まらない5つ" frame={frame} />
      <div className="svc-blind-grid">
        {spots.map((spot, i) => (
          <div key={spot.title} className="svc-blind-card" style={lift(entrance(frame, fps, 16 + i * 10), 18)}>
            {spot.icon}
            <strong>{spot.title}</strong>
            <span>{spot.body}</span>
          </div>
        ))}
      </div>
      <Punch frame={frame} delay={78}>
        つまり<b>技術的な発見はログで足りる</b>。詰まるのは、組織的な帰属確認のほう。
      </Punch>
    </section>
  )
}

function RetentionSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide svc-slide">
      <Header kicker="INVENTORY ─ 04" title="最初にやるのは、ログを貯め始めること" frame={frame} />
      <div className="svc-retention">
        <div className="svc-retention-bad" style={lift(entrance(frame, fps, 18), 22)}>
          <Archive size={40} />
          <strong>何もしないと</strong>
          <p>既定の保持期間を過ぎた分は消える。過去へは遡れない。</p>
        </div>
        <ArrowRight size={46} />
        <div className="svc-retention-good" style={lift(entrance(frame, fps, 40), 22)}>
          <Database size={40} />
          <strong>診断設定でエクスポート</strong>
          <p>Log Analyticsやストレージへ送っておけば、長い期間で集計できる。</p>
        </div>
      </div>
      <div className="svc-alert" style={lift(entrance(frame, fps, 68), 16)}>
        <CalendarClock size={34} />
        <p>
          ここを後回しにすると、<b>3か月後に同じ場所で止まる</b>。今日からできる一番安い一手。
        </p>
      </div>
      <SourceLine
        href="https://learn.microsoft.com/entra/identity/monitoring-health/howto-configure-diagnostic-settings"
        label="Microsoft Learn ─ Configure Microsoft Entra diagnostic settings"
      />
    </section>
  )
}

function LedgerSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const columns = [
    'ID名 / 管理番号',
    '種別（ユーザー / SP / リソース）',
    '業務用途',
    '所有部門・責任者',
    '利用アプリ・対象リソース',
    '認証方式',
    '人の操作があるか',
    '実行場所',
    '接続元',
    '付与権限',
    '最終サインイン',
    '移行先の方式',
    '例外の失効日'
  ]
  return (
    <section className="remotion-slide svc-slide">
      <Header kicker="INVENTORY ─ 05" title="出てきたIDを、1つの台帳へ" frame={frame} />
      <div className="svc-ledger-grid">
        {columns.map((col, i) => (
          <div key={col} className="svc-ledger-cell" style={lift(entrance(frame, fps, 12 + i * 5), 14)}>
            {col}
          </div>
        ))}
      </div>
      <div className="svc-alert" style={lift(entrance(frame, fps, 84), 16)}>
        <TriangleAlert size={34} />
        <p>
          施策ごとに台帳を分けない。分けると<b>片方だけ見直されないID</b>が必ず残る。
        </p>
      </div>
    </section>
  )
}

function LedgerHumanPartSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide svc-slide">
      <Header kicker="INVENTORY ─ 06" title="台帳の「人にしか埋められない列」" frame={frame} />
      <div className="svc-split">
        <div className="svc-split-card svc-split-machine" style={lift(entrance(frame, fps, 18), 22)}>
          <Bot size={38} />
          <strong>機械が埋める</strong>
          <ul>
            <li>何が</li>
            <li>いつ</li>
            <li>どこから</li>
            <li>何に対して</li>
          </ul>
          <i>ログから自動生成できる</i>
        </div>
        <div className="svc-split-card svc-split-human" style={lift(entrance(frame, fps, 38), 22)}>
          <User size={38} />
          <strong>人が埋める</strong>
          <ul>
            <li>誰の持ち物か</li>
            <li>止めていいか</li>
            <li>いつ廃止するか</li>
          </ul>
          <i>ここが棚卸しの本当のコスト</i>
        </div>
      </div>
      <Punch frame={frame} delay={70}>
        <b>大半が埋まった表</b>を持って所有者を探しに行けば、作業量は現実的になる。
      </Punch>
    </section>
  )
}

function SectionDestinationSlide(props: SlideRenderContext) {
  return (
    <SectionSlide
      frame={props.frame}
      number="SECTION 3"
      title="どこへ移すのかを決める"
      lead="判断の順番さえ決めれば、機械的に振り分けられる。"
    />
  )
}

function ClassifySlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const steps = [
    {
      q: 'Q1. 人が操作するか？',
      yes: 'はい',
      to: '人のID。MFAをかける（できればフィッシング耐性のある方式）',
      tone: 'good'
    },
    {
      q: 'Q2. 動く場所はAzureの中か？（Azure Arcでオンボードした機器を含む）',
      yes: 'はい',
      to: 'マネージドID',
      tone: 'good'
    },
    {
      q: 'Q3. 信頼できるOIDCのトークンを発行できるワークロードか？',
      yes: 'はい',
      to: 'Workload identity federation',
      tone: 'good'
    },
    {
      q: 'Q4. 資格情報を安全に保管できるか？',
      yes: 'はい',
      to: '証明書を使うサービスプリンシパル',
      tone: 'ok'
    }
  ]
  return (
    <section className="remotion-slide svc-slide">
      <Header kicker="DESTINATION ─ 01" title="移行先は、4つの質問で決まる" frame={frame} />
      <div className="svc-tree">
        {steps.map((step, i) => (
          <div key={step.q} className="svc-tree-row" style={lift(entrance(frame, fps, 14 + i * 11), 16)}>
            <div className="svc-tree-q">{step.q}</div>
            <div className="svc-tree-yes">
              {step.yes} <ArrowRight size={22} />
            </div>
            <div className={`svc-tree-to svc-tone-${step.tone}`}>{step.to}</div>
          </div>
        ))}
        <div className="svc-tree-else" style={lift(entrance(frame, fps, 62), 16)}>
          <Lock size={28} />
          <span>Q4も「いいえ」なら</span>
          <strong>期限付きの例外として、条件を絞って残す</strong>
        </div>
      </div>
      <Punch frame={frame} delay={78}>
        上から順に答えるだけ。<b>迷うのは技術ではなく、Q1とQ2の事実確認</b>。
      </Punch>
    </section>
  )
}

function NotByNameSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide svc-slide">
      <Header kicker="DESTINATION ─ 02" title="アプリ名だけで判断してはいけない" frame={frame} />
      <div className="svc-samename">
        <div className="svc-samename-top" style={lift(entrance(frame, fps, 16), 20)}>
          <ServerCog size={38} />
          <strong>ログに出てきた「同じコマンドラインツール」</strong>
        </div>
        <div className="svc-samename-split">
          <div style={lift(entrance(frame, fps, 34), 22)}>
            <User size={32} />
            <strong>人が手で叩いている</strong>
            <span>→ Q1が「はい」。人のIDとしてMFA</span>
          </div>
          <div style={lift(entrance(frame, fps, 48), 22)}>
            <Bot size={32} />
            <strong>スクリプトが無人で回している</strong>
            <span>→ Q1が「いいえ」。Q2へ進む</span>
          </div>
        </div>
      </div>
      <Punch frame={frame} delay={72}>
        だから台帳には<b>「人の操作があるか」</b>の列を必ず作る。
      </Punch>
    </section>
  )
}

function ManagedIdentitySlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide svc-slide">
      <Header kicker="DESTINATION ─ 03" title="Azureの中なら、マネージドID" frame={frame} />
      <div className="svc-mi-types">
        <div className="svc-mi-type" style={lift(entrance(frame, fps, 16), 22)}>
          <Cloud size={34} />
          <strong>システム割り当て</strong>
          <ul>
            <li>リソースと1対1</li>
            <li>リソースを消せば一緒に消える</li>
            <li>フェデレーションは設定できない</li>
          </ul>
        </div>
        <div className="svc-mi-type svc-mi-type-user" style={lift(entrance(frame, fps, 34), 22)}>
          <Layers size={34} />
          <strong>ユーザー割り当て</strong>
          <ul>
            <li>独立したAzureリソース</li>
            <li>複数のリソースで共有できる</li>
            <li>フェデレーションを設定できる</li>
          </ul>
        </div>
      </div>
      <Punch frame={frame} delay={60}>
        どちらも<b>パスワードもシークレットもコードに出てこない</b>。
      </Punch>
      <SourceLine
        href="https://learn.microsoft.com/entra/identity/managed-identities-azure-resources/overview"
        label="Microsoft Learn ─ Managed identities overview"
      />
    </section>
  )
}

function ArcSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide svc-slide">
      <Header kicker="DESTINATION ─ 04" title="Azure Arcを入れれば、「Azureの中」にできる" frame={frame} />
      <div className="svc-arc-flow">
        <div className="svc-arc-node" style={lift(entrance(frame, fps, 16), 22)}>
          <Globe size={34} />
          <strong>オンプレ / 他社クラウドのサーバー</strong>
          <span>Q2が「いいえ」だった機器</span>
        </div>
        <div className="svc-arc-arrow" style={lift(entrance(frame, fps, 30), 10)}>
          <span>Azure Arc でオンボード</span>
          <ArrowRight size={38} />
        </div>
        <div className="svc-arc-node svc-arc-in" style={lift(entrance(frame, fps, 42), 22)}>
          <ShieldCheck size={34} />
          <strong>マネージドIDを持てる</strong>
          <span>Q2が「はい」の枠に入る</span>
        </div>
      </div>
      <div className="svc-alert" style={lift(entrance(frame, fps, 64), 16)}>
        <TriangleAlert size={34} />
        <p>
          Windows 10 / 11 クライアントも対応OSだが、<b>常時電源とネットワークにつながったサーバー的な使い方</b>
          に限る。持ち歩く業務用PCはIntuneを使う、と公式に明記。
        </p>
      </div>
      <SourceLine
        href="https://learn.microsoft.com/azure/azure-arc/servers/prerequisites"
        label="Microsoft Learn ─ Connected Machine agent prerequisites"
      />
    </section>
  )
}

function MiNotSilverBulletSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const limits = [
    { icon: <CloudOff size={30} />, body: 'Azureの外で、Arcも入れられない場所' },
    { icon: <Boxes size={30} />, body: 'サービス側がマネージドIDでの認証に対応していない' }
  ]
  return (
    <section className="remotion-slide svc-slide">
      <Header kicker="DESTINATION ─ 05" title="マネージドIDが使えない場合もある" frame={frame} />
      <div className="svc-limit-row">
        {limits.map((limit, i) => (
          <div key={limit.body} className="svc-limit-card" style={lift(entrance(frame, fps, 18 + i * 12), 20)}>
            {limit.icon}
            <strong>{limit.body}</strong>
          </div>
        ))}
      </div>
      <Punch frame={frame} delay={56}>
        使えるかどうかは<b>接続先のサービスごとに確認</b>する。ここでQ3へ進む。
      </Punch>
    </section>
  )
}

function WifSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide svc-slide">
      <Header kicker="DESTINATION ─ 06" title="OIDCのトークンを出せるなら、フェデレーション" frame={frame} />
      <div className="svc-wif-flow">
        <div className="svc-wif-node" style={lift(entrance(frame, fps, 16), 22)}>
          <Workflow size={34} />
          <strong>外部のワークロード</strong>
          <span>CI/CD、Kubernetes、他社クラウド</span>
        </div>
        <div className="svc-wif-arrow" style={lift(entrance(frame, fps, 30), 10)}>
          <span>短命なOIDCトークン</span>
          <ArrowRight size={38} />
        </div>
        <div className="svc-wif-node svc-wif-entra" style={lift(entrance(frame, fps, 42), 22)}>
          <ShieldCheck size={34} />
          <strong>Microsoft Entra ID</strong>
          <span>事前に設定した信頼に基づいて交換</span>
        </div>
        <div className="svc-wif-arrow" style={lift(entrance(frame, fps, 54), 10)}>
          <span>アクセストークン</span>
          <ArrowRight size={38} />
        </div>
        <div className="svc-wif-node" style={lift(entrance(frame, fps, 64), 22)}>
          <Database size={34} />
          <strong>Azureのリソース</strong>
          <span>最小権限で許可</span>
        </div>
      </div>
      <Punch frame={frame} delay={82}>
        利点は明確。<b>長期のシークレットを相手側へ保存しなくてよくなる。</b>
      </Punch>
      <SourceLine
        href="https://learn.microsoft.com/entra/workload-id/workload-identity-federation"
        label="Microsoft Learn ─ Workload identity federation"
      />
    </section>
  )
}

function UamiVsAppSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const rows = [
    ['実体', 'Azureリソースに内包', '独立したAzureリソース', 'Entra IDのアプリ'],
    ['フェデレーション', '設定できない', '設定できる', '設定できる'],
    ['共有', 'そのリソース専用', '複数リソースで共有可', 'アプリとして共有'],
    ['向く場面', 'Azure内の単一リソース', 'Azure内 / 外部CI-CD', 'API公開・マルチテナント']
  ]
  return (
    <section className="remotion-slide svc-slide">
      <Header kicker="DESTINATION ─ 07" title="3つの器を並べて比べる" frame={frame} />
      <div className="svc-compare3">
        <div className="svc-compare3-head" style={lift(entrance(frame, fps, 12), 16)}>
          <span />
          <b>システム割り当てMI</b>
          <b>ユーザー割り当てMI</b>
          <b>アプリ登録</b>
        </div>
        {rows.map((row, i) => (
          <div key={row[0]} className="svc-compare3-row" style={lift(entrance(frame, fps, 24 + i * 10), 14)}>
            <span>{row[0]}</span>
            <p>{row[1]}</p>
            <p>{row[2]}</p>
            <p>{row[3]}</p>
          </div>
        ))}
      </div>
      <Punch frame={frame} delay={70}>
        安全性の優劣ではなく<b>管理モデルの違い</b>。フェデレーションを使うなら右2つから選ぶ。
      </Punch>
      <SourceLine
        href="https://learn.microsoft.com/entra/workload-id/workload-identity-federation-create-trust-user-assigned-managed-identity"
        label="Microsoft Learn ─ Federated identity credential on a user-assigned managed identity"
      />
    </section>
  )
}

function WifGuardrailsSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const rules = [
    { icon: <Filter size={30} />, title: '信頼相手を絞る', body: '組織全体ではなく、対象のリポジトリ・環境まで指定する' },
    { icon: <Layers size={30} />, title: '本番と非本番を分ける', body: '同じIDを使い回さない' },
    { icon: <LockKeyhole size={30} />, title: '最小権限', body: 'サブスクリプション全体ではなく必要な範囲へ' },
    { icon: <ListChecks size={30} />, title: '上限は20件', body: '1つのIDへ多数の対象を集約しない' }
  ]
  return (
    <section className="remotion-slide svc-slide">
      <Header kicker="DESTINATION ─ 08" title="フェデレーションで必ず確認すること" frame={frame} />
      <div className="svc-rule-grid">
        {rules.map((rule, i) => (
          <div key={rule.title} className="svc-rule-card" style={lift(entrance(frame, fps, 16 + i * 11), 18)}>
            {rule.icon}
            <strong>{rule.title}</strong>
            <span>{rule.body}</span>
          </div>
        ))}
      </div>
      <Punch frame={frame} delay={72}>
        シークレットが無くなっても、<b>信頼の範囲が広ければ同じこと</b>。
      </Punch>
      <SourceLine
        href="https://learn.microsoft.com/graph/api/resources/federatedidentitycredentials-overview"
        label="Microsoft Learn ─ Federated identity credentials overview"
      />
    </section>
  )
}

function LegacyCageSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const bars = ['長いランダムなパスワード', '接続元を限定', '使えるアプリを限定', '権限を最小化', '失効日を設定', '責任者を明記']
  return (
    <section className="remotion-slide svc-slide">
      <Header kicker="DESTINATION ─ 09" title="それでも残るIDは「檻」に入れる" frame={frame} />
      <div className="svc-cage" style={lift(entrance(frame, fps, 16), 22)}>
        <div className="svc-cage-inner">
          <UserX size={54} />
          <strong>移行できないID</strong>
          <span>MFAは適用できない</span>
        </div>
        <div className="svc-cage-bars">
          {bars.map((bar, i) => (
            <div key={bar} style={lift(entrance(frame, fps, 30 + i * 9), 16)}>
              <ShieldCheck size={24} />
              <span>{bar}</span>
            </div>
          ))}
        </div>
      </div>
      <Punch frame={frame} delay={90}>
        MFAが使えなくても<b>危険度は大きく下げられる</b>。何もせず除外グループへ入れるのとは別物。
      </Punch>
    </section>
  )
}

function SectionPitfallSlide(props: SlideRenderContext) {
  return (
    <SectionSlide
      frame={props.frame}
      number="SECTION 4"
      title="ここから、3つの落とし穴"
      lead="どれも「対策したつもり」になる種類のもの。"
    />
  )
}

function RopcSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide svc-slide">
      <Header kicker="PITFALL ─ 01" title="パスワードを、アプリに直接渡す方式" frame={frame} />
      <div className="svc-ropc">
        <div className="svc-ropc-flow" style={lift(entrance(frame, fps, 16), 22)}>
          <div>
            <ServerCog size={32} />
            <span>アプリ</span>
          </div>
          <div className="svc-ropc-creds">ID + パスワード</div>
          <ArrowRight size={36} />
          <div>
            <ShieldCheck size={32} />
            <span>Entra ID</span>
          </div>
        </div>
        <div className="svc-ropc-note" style={lift(entrance(frame, fps, 38), 20)}>
          <TriangleAlert size={34} />
          <p>
            ブラウザーが出てこない = <b>MFAを差し込む場所がない</b>
          </p>
        </div>
      </div>
      <div className="svc-alert" style={lift(entrance(frame, fps, 62), 16)}>
        <TriangleAlert size={34} />
        <p>
          <b>レガシー認証だけをブロックしても、それで大丈夫とは言えない。</b>これは別物。
        </p>
      </div>
      <SourceLine
        href="https://learn.microsoft.com/entra/identity-platform/v2-oauth-ropc"
        label="Microsoft Learn ─ Resource owner password credentials"
      />
    </section>
  )
}

function DeviceCodeSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide svc-slide">
      <Header kicker="PITFALL ─ 02" title="デバイスコードフロー" frame={frame} />
      <div className="svc-devicecode">
        <div className="svc-devicecode-legit" style={lift(entrance(frame, fps, 16), 22)}>
          <Monitor size={34} />
          <strong>本来の用途</strong>
          <span>画面に出たコードを、別の端末で入力する</span>
          <i>キーボードやブラウザーが使いにくい機器のため</i>
        </div>
        <div className="svc-devicecode-abuse" style={lift(entrance(frame, fps, 38), 22)}>
          <ShieldAlert size={34} />
          <strong>攻撃者にとっては</strong>
          <span>コードを発行して「これを入力してください」と送るだけ</span>
          <i>被害者は自分の正規の画面で承認してしまう</i>
        </div>
      </div>
      <Punch frame={frame} delay={64}>
        Microsoftの案内は<b>「可能な限りブロックする」</b>。
      </Punch>
      <SourceLine
        href="https://learn.microsoft.com/entra/identity/conditional-access/concept-authentication-flows"
        label="Microsoft Learn ─ Authentication flows as a condition"
      />
    </section>
  )
}

function DeviceCodeScopeSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const scopes = ['ユーザー / グループ', '対象リソース', 'デバイスプラットフォーム', 'ネットワークの場所']
  return (
    <section className="remotion-slide svc-slide">
      <Header kicker="PITFALL ─ 02b" title="「この機器だけ許可」とは書けない" frame={frame} />
      <div className="svc-scope">
        <div className="svc-scope-no" style={lift(entrance(frame, fps, 14), 20)}>
          <X size={34} />
          <strong>できない書き方</strong>
          <p>「この1台だけデバイスコードフローを許可する」</p>
        </div>
        <div className="svc-scope-yes" style={lift(entrance(frame, fps, 30), 20)}>
          <Check size={34} />
          <strong>条件付きアクセスで指定できるのは</strong>
          <div className="svc-scope-chips">
            {scopes.map((scope, i) => (
              <span key={scope} style={lift(entrance(frame, fps, 42 + i * 7), 12)}>
                {scope}
              </span>
            ))}
          </div>
          <i>公式の例：「特定のネットワーク場所のAndroidデバイス以外はすべてブロック」</i>
        </div>
      </div>
      <div className="svc-alert" style={lift(entrance(frame, fps, 76), 16)}>
        <TriangleAlert size={34} />
        <p>
          さらに<b>プロトコルトラッキング</b>。一度この方式を使ったセッションは、以後ほかの方式で認証しても対象になる。
        </p>
      </div>
      <SourceLine
        href="https://learn.microsoft.com/entra/identity/conditional-access/concept-authentication-flows"
        label="Microsoft Learn ─ Authentication flows as a condition"
      />
    </section>
  )
}

function ReportOnlyTrapSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const facts = [
    { icon: <FileSearch size={28} />, title: '評価期間中に再認証しないIDは、ログに出ない', body: 'だから「該当ゼロ」に見える' },
    { icon: <Timer size={28} />, title: 'アクセストークンは既定1時間 / CAE対応なら最大28時間', body: '有効化しても、その間は動き続ける' },
    { icon: <RefreshCw size={28} />, title: 'ポリシーやグループの変更が届くまで最大24時間', body: '一部の更新は2時間まで短縮される' }
  ]
  return (
    <section className="remotion-slide svc-slide">
      <Header kicker="PITFALL ─ 03" title="レポート専用モードの「該当なし」" frame={frame} />
      <div className="svc-fact-list">
        {facts.map((fact, i) => (
          <div key={fact.title} style={lift(entrance(frame, fps, 16 + i * 12), 18)}>
            {fact.icon}
            <div>
              <strong>{fact.title}</strong>
              <span>{fact.body}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="svc-alert" style={lift(entrance(frame, fps, 62), 16)}>
        <TriangleAlert size={34} />
        <p>
          止まるのは有効化した瞬間ではなく、<b>トークンが切れて再認証した時点</b>。数日かけて順に出てくる。
          すぐ効かせたいならセッションを明示的に失効させる。
        </p>
      </div>
      <SourceLine
        href="https://learn.microsoft.com/entra/identity/conditional-access/concept-continuous-access-evaluation"
        label="Microsoft Learn ─ Continuous access evaluation"
      />
    </section>
  )
}

function RolloutSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const steps = [
    'ログの保持を延ばす',
    '棚卸しして台帳を作る',
    '所有者を確定させる',
    '移行できるものから移す',
    '残すIDを檻に入れる',
    'レポート専用モードで測る',
    '分割して有効化する',
    '切り戻しの単位を決めておく'
  ]
  return (
    <section className="remotion-slide svc-slide">
      <Header kicker="THE ORDER" title="展開の順番" frame={frame} />
      <div className="svc-steps">
        {steps.map((step, i) => (
          <div key={step} className="svc-step" style={lift(entrance(frame, fps, 12 + i * 8), 16)}>
            <span>{String(i + 1).padStart(2, '0')}</span>
            <strong>{step}</strong>
          </div>
        ))}
      </div>
      <Punch frame={frame} delay={82}>
        緊急時に<b>ポリシー全体を無効化しない</b>で済むよう、戻す単位を先に決めておく。
      </Punch>
    </section>
  )
}

function MicrosoftMfaSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide svc-slide">
      <Header kicker="ONE MORE THING" title="テナントの除外だけでは守れない場所がある" frame={frame} />
      <div className="svc-mandatory">
        <div className="svc-mandatory-card" style={lift(entrance(frame, fps, 18), 22)}>
          <ShieldCheck size={38} />
          <strong>自分のテナントの条件付きアクセス</strong>
          <span>除外を設定できる</span>
        </div>
        <div className="svc-mandatory-plus" style={lift(entrance(frame, fps, 32), 12)}>
          +
        </div>
        <div className="svc-mandatory-card svc-mandatory-strong" style={lift(entrance(frame, fps, 44), 22)}>
          <Siren size={38} />
          <strong>Microsoft側の必須MFA</strong>
          <span>Azureの管理画面などへは別に適用される</span>
        </div>
      </div>
      <Punch frame={frame} delay={70}>
        ユーザーのIDを無人処理へ使い続ける構成は、<b>除外だけでは維持できない</b>。
      </Punch>
      <SourceLine
        href="https://learn.microsoft.com/entra/identity/authentication/concept-mandatory-multifactor-authentication"
        label="Microsoft Learn ─ Mandatory multifactor authentication for Azure"
      />
    </section>
  )
}

function RecapSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const items = [
    ['01', 'MFAが使えないことと、弱いままでよいことは別', 'シークレットを持たない仕組みへ移す。除外して終わりにしない'],
    ['02', '棚卸しはログで大半が埋まる', '残るのは所有者を探す作業'],
    ['03', '移行先は「動く場所」と「トークンを出せるか」で決まる', '4つの質問に上から答えるだけ']
  ]
  return (
    <section className="remotion-slide svc-slide">
      <Header kicker="RECAP" title="覚えるのは、この3つ" frame={frame} />
      <div className="svc-recap">
        {items.map(([num, title, body], i) => (
          <div key={num} style={lift(entrance(frame, fps, 18 + i * 14), 22)}>
            <span>{num}</span>
            <strong>{title}</strong>
            <p>{body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function RelatedVideosSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const videos = [
    { id: 'CGEWsDgdFvk', title: '認証パターンを基礎から理解', note: 'SP・マネージドID・トークンの全体像' },
    { id: 'Xvh9z-N6N5c', title: 'マネージドIDをざっくり理解する', note: '今日の移行先その1の入門' },
    { id: 'n2RodbBpzeo', title: 'なぜアプリにもIDが必要？', note: 'アプリ登録と権限・同意の基礎' },
    { id: 'SkqRmdStxnQ', title: '「リソースURL」の正体', note: 'トークンが誰宛かを理解する' },
    { id: 'u3DmYibZgwE', title: '条件付きアクセス「全リソース＋除外」の挙動', note: '除外設計の落とし穴' }
  ]
  return (
    <section className="remotion-slide svc-slide">
      <Header kicker="GO DEEPER" title="関連する解説動画" frame={frame} />
      <div className="svc-video-list">
        {videos.map((video, i) => (
          <a
            key={video.id}
            className="svc-video-row"
            href={`https://www.youtube.com/watch?v=${video.id}`}
            target="_blank"
            rel="noreferrer"
            style={lift(entrance(frame, fps, 14 + i * 10), 16)}
          >
            <CirclePlay size={30} />
            <div>
              <strong>{video.title}</strong>
              <span>{video.note}</span>
            </div>
          </a>
        ))}
      </div>
      <Punch frame={frame} delay={76}>
        今日出てきた用語を<b>基礎から知りたい方</b>はこちらから。
      </Punch>
    </section>
  )
}

function EbiStudySlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const courses = [
    { path: 'microsoft-identity-foundations', label: 'Microsoft ID・アカウント・テナント基礎', note: 'まずここから' },
    { path: 'entra-auth', label: 'Entra ID認証と自動化', note: 'SP・マネージドID・トークン' },
    { path: 'pki', label: '証明書・PKI入門', note: '証明書認証の前提' }
  ]
  return (
    <section className="remotion-slide svc-slide svc-ebistudy">
      <Header kicker="EBI STUDY" title="体系的に、順番に学びたい方へ" frame={frame} />
      <div className="svc-course-row">
        {courses.map((course, i) => (
          <a
            key={course.path}
            className="svc-course-card"
            href={`https://study.ebisuda.net/${course.path}/`}
            target="_blank"
            rel="noreferrer"
            style={lift(entrance(frame, fps, 18 + i * 12), 22)}
          >
            <ClipboardList size={34} />
            <strong>{course.label}</strong>
            <span>{course.note}</span>
          </a>
        ))}
      </div>
      <Punch frame={frame} delay={64}>
        <b>study.ebisuda.net</b> ─ Microsoft資格・Windows Server・Azure・Claude Code。月額990円。
      </Punch>
    </section>
  )
}

function SourcesSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const sources = [
    ['認証方式の一覧', 'https://learn.microsoft.com/entra/identity/authentication/overview-authentication'],
    ['ゲストの認証と条件付きアクセス', 'https://learn.microsoft.com/entra/external-id/authentication-conditional-access'],
    ['認証フローを条件にする', 'https://learn.microsoft.com/entra/identity/conditional-access/concept-authentication-flows'],
    ['継続的アクセス評価', 'https://learn.microsoft.com/entra/identity/conditional-access/concept-continuous-access-evaluation'],
    ['Azure Arc 接続マシンエージェントの前提条件', 'https://learn.microsoft.com/azure/azure-arc/servers/prerequisites']
  ]
  return (
    <section className="remotion-slide svc-slide">
      <Header kicker="REFERENCES" title="Microsoft公式ドキュメント" frame={frame} />
      <div className="svc-source-list">
        {sources.map(([label, href], i) => (
          <a key={href} href={href} target="_blank" rel="noreferrer" style={lift(entrance(frame, fps, 14 + i * 10), 14)}>
            <strong>{label}</strong>
            <span>{href.replace('https://', '')}</span>
          </a>
        ))}
      </div>
      <Punch frame={frame} delay={74}>
        設定を変える前に、<b>必ず最新の公式ドキュメント</b>を確認してください。
      </Punch>
    </section>
  )
}

function ThanksSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide svc-slide svc-thanks">
      <div className="svc-grid-bg" />
      <div style={lift(entrance(frame, fps), 34)}>
        <ThumbsUp size={78} />
        <h1>ご視聴ありがとうございました！</h1>
        <p>高評価・チャンネル登録をお願いします。</p>
      </div>
    </section>
  )
}
