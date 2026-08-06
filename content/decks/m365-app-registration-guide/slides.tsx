/* eslint-disable react-refresh/only-export-components */
import {
  AppWindow,
  Bot,
  Check,
  ChevronRight,
  CircleAlert,
  Database,
  FileText,
  Fingerprint,
  KeyRound,
  Mail,
  Network,
  ShieldCheck,
  User,
  UserCheck,
  Users,
  Workflow
} from 'lucide-react'
import { interpolate, spring, useVideoConfig } from 'remotion'
import type { SlideModule, SlideRenderContext } from '../../../src/types'
import { LogoMark } from '../../../src/deck-shared'

export const slides: SlideModule['slides'] = [
  { render: (props) => <OpeningSlide {...props} /> },
  { render: (props) => <BlockedSlide {...props} /> },
  { render: (props) => <EverydayVsAppSlide {...props} /> },
  { render: (props) => <RegistrationSlide {...props} /> },
  { render: (props) => <ThreeKeysSlide {...props} /> },
  { render: (props) => <DelegatedSlide {...props} /> },
  { render: (props) => <AppOnlySlide {...props} /> },
  { render: (props) => <SameNameSlide {...props} /> },
  { render: (props) => <ApiSlide {...props} /> },
  { render: (props) => <ConsentSlide {...props} /> },
  { render: (props) => <AdminReviewSlide {...props} /> },
  { render: (props) => <ThreeLeversSlide {...props} /> },
  { render: (props) => <RequestTemplateSlide {...props} /> },
  { render: (props) => <SaferFirstSlide {...props} /> },
  { render: (props) => <RecapSlide {...props} /> },
  { render: (props) => <SourcesSlide {...props} /> }
]

function entrance(frame: number, fps: number, delay = 0) {
  return spring({
    frame: frame - delay,
    fps,
    config: { damping: 18, stiffness: 105 }
  })
}

function lift(value: number, distance = 30) {
  return {
    opacity: value,
    transform: `translateY(${(1 - value) * distance}px)`
  }
}

function Header({ kicker, title, frame }: { kicker: string; title: React.ReactNode; frame: number }) {
  const { fps } = useVideoConfig()
  return (
    <div className="m365-head" style={lift(entrance(frame, fps), 24)}>
      <span className="slide-kicker">{kicker}</span>
      <h1>{title}</h1>
    </div>
  )
}

function Badge({ tone, children }: { tone: 'safe' | 'warn' | 'info'; children: React.ReactNode }) {
  return <span className={`m365-badge m365-badge-${tone}`}>{children}</span>
}

function OpeningSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const title = entrance(frame, fps)
  const pulse = 1 + Math.sin(frame / 12) * 0.025
  return (
    <section className="remotion-slide m365-slide m365-opening">
      <div className="m365-grid-bg" />
      <LogoMark className="m365-logo" />
      <div className="m365-opening-copy" style={lift(title, 46)}>
        <span className="slide-kicker">Microsoft 365 × AI APP ─ BEGINNER'S GUIDE</span>
        <h1>
          はじめての
          <br />
          <em>M365アプリ登録</em>
        </h1>
        <p>情シスに「正しく頼む」ための、ID・API・権限の話</p>
      </div>
      <div className="m365-opening-visual" style={{ transform: `scale(${pulse})` }}>
        <div className="m365-orbit m365-orbit-one" />
        <div className="m365-orbit m365-orbit-two" />
        <div className="m365-id-core"><Fingerprint size={82} strokeWidth={1.5} /><span>APP ID</span></div>
        <div className="m365-satellite m365-sat-user"><User size={32} /><span>User</span></div>
        <div className="m365-satellite m365-sat-api"><Network size={32} /><span>API</span></div>
        <div className="m365-satellite m365-sat-key"><KeyRound size={32} /><span>Permission</span></div>
      </div>
      <a className="m365-source-line" href="https://learn.microsoft.com/en-us/entra/identity-platform/application-model" target="_blank" rel="noreferrer">
        Source: Microsoft Learn ─ Application model
      </a>
    </section>
  )
}

function BlockedSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const messages = [
    ['YOU', 'AIでメールやファイルを扱う\n便利なアプリを作りたい！', 'idea'],
    ['情シス', 'アプリ登録の権限は付与していません', 'stop']
  ]
  return (
    <section className="remotion-slide m365-slide">
      <Header kicker="SCENARIO" title="「登録できない」で止まった" frame={frame} />
      <div className="m365-chat">
        {messages.map(([who, body, tone], index) => (
          <div className={`m365-chat-row m365-chat-${tone}`} key={who} style={lift(entrance(frame, fps, 24 + index * 22), 24)}>
            <span>{who}</span><p>{body}</p>
          </div>
        ))}
      </div>
      <div className="m365-two-eyes" style={lift(entrance(frame, fps, 76), 18)}>
        <div><Bot size={36} /><strong>あなたが見ているもの</strong><p>作りたい便利な機能</p></div>
        <ChevronRight size={34} />
        <div><ShieldCheck size={36} /><strong>情シスが見ているもの</strong><p>会社データへの新しい入口</p></div>
      </div>
    </section>
  )
}

function EverydayVsAppSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const cards = [
    { icon: <User size={52} />, tag: '日常の操作', title: '人が、その場で操作', lines: ['本人がサインイン', '本人の権限で実行', '画面を見ながら判断'], tone: 'safe' },
    { icon: <Workflow size={52} />, tag: 'アプリの操作', title: 'コードが、繰り返し実行', lines: ['APIを呼び出す', '大量・高速に処理できる', '人なしで動く設計も可能'], tone: 'warn' }
  ]
  return (
    <section className="remotion-slide m365-slide">
      <Header kicker="HUMAN vs APPLICATION" title="同じ操作でも、責任の置き方が違う" frame={frame} />
      <div className="m365-compare">
        {cards.map((card, index) => (
          <div className={`m365-compare-card m365-tone-${card.tone}`} key={card.tag} style={lift(entrance(frame, fps, 22 + index * 16), 28)}>
            <div className="m365-card-icon">{card.icon}</div><Badge tone={card.tone as 'safe' | 'warn'}>{card.tag}</Badge>
            <strong>{card.title}</strong>
            <ul>{card.lines.map((line) => <li key={line}><Check size={22} />{line}</li>)}</ul>
          </div>
        ))}
      </div>
      <p className="m365-punch" style={lift(entrance(frame, fps, 64), 14)}>だから先に決める：<b>誰として、どの入口から、どこまで触る？</b></p>
    </section>
  )
}

function RegistrationSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const fields = ['名前・Client ID', 'サインイン先', 'Redirect URI', '資格情報', '必要なAPI権限']
  return (
    <section className="remotion-slide m365-slide">
      <Header kicker="APP REGISTRATION" title="アプリ登録は「身分証の台帳」" frame={frame} />
      <div className="m365-registration">
        <div className="m365-id-card" style={lift(entrance(frame, fps, 24), 32)}>
          <div className="m365-id-card-top"><AppWindow size={46} /><span>Microsoft Entra ID</span></div>
          <strong>MY AI APP</strong>
          {fields.map((field, index) => <div key={field} style={{ opacity: entrance(frame, fps, 40 + index * 9) }}><Check size={20} />{field}</div>)}
        </div>
        <div className="m365-not-code" style={lift(entrance(frame, fps, 70), 26)}>
          <FileText size={56} /><span>コード本体</span><b>アップロードしない</b>
        </div>
      </div>
      <p className="m365-punch"><b>登録しただけでは</b>、メールもファイルも読めない。</p>
    </section>
  )
}

function ThreeKeysSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const keys = [
    ['01', <Fingerprint size={56} />, 'ID', '誰として動く？', 'm365-key-blue'],
    ['02', <Network size={56} />, 'API', 'どの窓口を呼ぶ？', 'm365-key-purple'],
    ['03', <KeyRound size={56} />, 'Permission', '何をしてよい？', 'm365-key-orange']
  ]
  return (
    <section className="remotion-slide m365-slide">
      <Header kicker="THE MAP" title="会話に必要なのは3つだけ" frame={frame} />
      <div className="m365-key-grid">
        {keys.map(([number, icon, label, question, cls], index) => (
          <div className={`m365-key-card ${cls}`} key={String(label)} style={lift(entrance(frame, fps, 22 + index * 14), 30)}>
            <span>{number}</span>{icon}<strong>{label}</strong><p>{question}</p>
          </div>
        ))}
      </div>
      <p className="m365-formula" style={lift(entrance(frame, fps, 74), 16)}>アプリ登録 ＝ <b>ID・API・Permissionを結ぶ設計図</b></p>
    </section>
  )
}

function DelegatedSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const tokenX = interpolate(frame % 75, [0, 74], [0, 420])
  return (
    <section className="remotion-slide m365-slide">
      <Header kicker="IDENTITY 01 ─ DELEGATED" title="人の代理で動く" frame={frame} />
      <div className="m365-flow-stage">
        <div className="m365-flow-node" style={lift(entrance(frame, fps, 18), 18)}><UserCheck size={60} /><strong>利用者</strong><span>サインインする</span></div>
        <div className="m365-flow-track"><span style={{ transform: `translateX(${tokenX}px)` }}>TOKEN</span></div>
        <div className="m365-flow-node m365-node-app" style={lift(entrance(frame, fps, 32), 18)}><AppWindow size={60} /><strong>アプリ</strong><span>利用者の代理</span></div>
        <ChevronRight className="m365-flow-arrow" size={40} />
        <div className="m365-flow-node" style={lift(entrance(frame, fps, 46), 18)}><Database size={60} /><strong>Microsoft 365</strong><span>APIで応答</span></div>
      </div>
      <div className="m365-intersection" style={lift(entrance(frame, fps, 68), 20)}>
        <span>アプリに同意された範囲</span><b>∩</b><span>その人が見られる範囲</span><strong>＝ 実際に届く範囲</strong>
      </div>
      <p className="m365-note"><ShieldCheck size={24} /> アプリだけで、本人が見られないデータへ飛び越えることはできない</p>
    </section>
  )
}

function AppOnlySlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide m365-slide m365-app-only">
      <Header kicker="IDENTITY 02 ─ APPLICATION-ONLY" title="アプリ自身で動く" frame={frame} />
      <div className="m365-night-flow">
        <div className="m365-clock" style={lift(entrance(frame, fps, 20), 18)}><span>02:00</span><small>誰もサインインしていない</small></div>
        <ChevronRight size={38} />
        <div className="m365-service" style={lift(entrance(frame, fps, 34), 18)}><Bot size={68} /><strong>バックグラウンドアプリ</strong><span>アプリ自身のID</span></div>
        <ChevronRight size={38} />
        <div className="m365-tenant" style={lift(entrance(frame, fps, 48), 18)}><Database size={68} /><strong>組織のデータ</strong><span>権限によっては広範囲</span></div>
      </div>
      <div className="m365-warning-band" style={lift(entrance(frame, fps, 72), 16)}><CircleAlert size={30} /><b>管理者同意が必要</b><span>便利さと、漏えい時の影響がどちらも大きい</span></div>
      <div className="m365-mini-tags"><span>自動処理</span><span>バッチ</span><span>バックアップ</span><span>デーモン</span></div>
    </section>
  )
}

function SameNameSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide m365-slide">
      <Header kicker="BEGINNER TRAP" title={<>同じ <code>Files.Read.All</code> でも違う</>} frame={frame} />
      <div className="m365-same-name">
        <div className="m365-perm-card m365-perm-delegated" style={lift(entrance(frame, fps, 22), 28)}>
          <Badge tone="safe">Delegated</Badge><User size={54} /><strong>その人がアクセスできる<br />すべてのファイル</strong><p>利用者の権限が上限になる</p>
        </div>
        <div className="m365-vs">VS</div>
        <div className="m365-perm-card m365-perm-app" style={lift(entrance(frame, fps, 38), 28)}>
          <Badge tone="warn">Application</Badge><Users size={54} /><strong>全サイトコレクション内の<br />すべてのファイル</strong><p>サインイン利用者なしで動く</p>
        </div>
      </div>
      <p className="m365-punch" style={lift(entrance(frame, fps, 70), 14)}>権限名だけでは足りない。<b>必ず「Type」と説明を確認</b></p>
    </section>
  )
}

function ApiSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const services = [[<Mail />, 'メール'], [<FileText />, 'ファイル'], [<Users />, 'Teams'], [<User />, 'ユーザー']]
  return (
    <section className="remotion-slide m365-slide">
      <Header kicker="MICROSOFT GRAPH" title="APIはM365の「公式受付窓口」" frame={frame} />
      <div className="m365-api-map">
        <div className="m365-api-app" style={lift(entrance(frame, fps, 20), 20)}><AppWindow size={64} /><strong>あなたのアプリ</strong><code>GET /me/messages</code></div>
        <ChevronRight size={42} />
        <div className="m365-graph" style={lift(entrance(frame, fps, 34), 20)}><Network size={72} /><strong>Microsoft Graph</strong><span>統一API</span></div>
        <ChevronRight size={42} />
        <div className="m365-service-grid">
          {services.map(([icon, label], index) => <div key={String(label)} style={lift(entrance(frame, fps, 46 + index * 7), 16)}>{icon}<span>{label}</span></div>)}
        </div>
      </div>
      <p className="m365-note">アクセストークンは「このアプリが、何をしてよいか」をAPIへ伝える通行証</p>
    </section>
  )
}

function ConsentSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const steps = [
    ['1', '登録', 'アプリのIDを作る', 'neutral'],
    ['2', 'Requested', '必要な権限を希望する', 'info'],
    ['3', 'Consent', '利用者／管理者が審査する', 'warn'],
    ['4', 'Granted', '同意された権限だけ使える', 'safe']
  ]
  return (
    <section className="remotion-slide m365-slide">
      <Header kicker="PERMISSION & CONSENT" title="Requested と Granted は別" frame={frame} />
      <div className="m365-consent-line">
        {steps.map(([num, title, desc, tone], index) => (
          <div className={`m365-consent-step m365-consent-${tone}`} key={num} style={lift(entrance(frame, fps, 20 + index * 14), 22)}>
            <span>{num}</span><strong>{title}</strong><p>{desc}</p>
          </div>
        ))}
      </div>
      <div className="m365-consent-note" style={lift(entrance(frame, fps, 80), 14)}>
        <User size={28} /><span>ユーザー同意：組織のポリシーで許された範囲</span>
        <ShieldCheck size={28} /><span>管理者同意：Application権限や高権限のDelegated権限</span>
      </div>
    </section>
  )
}

function AdminReviewSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const items = [
    ['01', '目的', 'なぜ必要？'], ['02', '実行主体', '人あり／なし？'], ['03', '対象データ', '誰の何？'],
    ['04', '操作', '読む／書く？'], ['05', '資格情報', 'どこで守る？'], ['06', '運用責任', '誰が止める？']
  ]
  return (
    <section className="remotion-slide m365-slide">
      <Header kicker="ADMIN REVIEW" title="情シスは「権限名」だけを見ない" frame={frame} />
      <div className="m365-review-grid">
        {items.map(([num, title, desc], index) => (
          <div key={num} style={lift(entrance(frame, fps, 18 + index * 9), 22)}><span>{num}</span><strong>{title}</strong><p>{desc}</p></div>
        ))}
      </div>
      <p className="m365-punch" style={lift(entrance(frame, fps, 78), 14)}>情シスの問いは「信用できる？」ではなく、<b>「事故の範囲を説明できる？」</b></p>
    </section>
  )
}

function ThreeLeversSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const levers = [
    { num: '1', icon: <UserCheck />, title: '誰が同意する？', body: 'ユーザー同意 / 管理者が組織を代表して同意', accent: 'blue' },
    { num: '2', icon: <Users />, title: '誰が使える？', body: 'ユーザー・グループ割り当てでサインインを制御', accent: 'purple' },
    { num: '3', icon: <Database />, title: 'どのデータへ届く？', body: 'Graph権限＋各サービス側のスコープ制御', accent: 'orange' }
  ]
  return (
    <section className="remotion-slide m365-slide">
      <Header kicker="ADMIN CONTROLS" title="管理者が操作する3つのレバー" frame={frame} />
      <div className="m365-levers">
        {levers.map((lever, index) => (
          <div className={`m365-lever m365-lever-${lever.accent}`} key={lever.num} style={lift(entrance(frame, fps, 18 + index * 15), 28)}>
            <span>{lever.num}</span>{lever.icon}<strong>{lever.title}</strong><p>{lever.body}</p>
          </div>
        ))}
      </div>
      <div className="m365-caveat" style={lift(entrance(frame, fps, 76), 14)}><CircleAlert size={27} /><b>注意：</b>ユーザー割り当てだけで、Application permissionのデータ範囲が狭くなるわけではない</div>
    </section>
  )
}

function RequestTemplateSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const fields = [
    ['1', 'アプリ名・目的'], ['2', '利用者'], ['3', 'Delegated / Application'], ['4', 'API・操作'],
    ['5', '必要な最小権限'], ['6', '実行場所・Redirect URI'], ['7', '責任者・停止方法']
  ]
  return (
    <section className="remotion-slide m365-slide">
      <Header kicker="REQUEST TEMPLATE" title="情シスへの依頼は、この7項目" frame={frame} />
      <div className="m365-request-layout">
        <div className="m365-request-list">
          {fields.map(([num, label], index) => <div key={num} style={lift(entrance(frame, fps, 16 + index * 7), 18)}><span>{num}</span><strong>{label}</strong></div>)}
        </div>
        <div className="m365-good-request" style={lift(entrance(frame, fps, 60), 24)}>
          <Badge tone="safe">GOOD REQUEST</Badge>
          <p>本人が選んだSharePointファイルだけを<br /><b>要約するAIアプリ</b>です。</p>
          <p><b>Delegated・読み取り</b>。要求権限名と<br />最大到達範囲も併記します。</p>
        </div>
      </div>
    </section>
  )
}

function SaferFirstSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const choices = [
    ['人なし前提', '人ありならDelegated検討'], ['読み書き', 'まず読み取り'], ['全社', '小さな対象'],
    ['マルチテナント', '単一テナント'], ['永久運用', '短い検証期間'], ['Client secret放置', 'Managed identity / 証明書']
  ]
  return (
    <section className="remotion-slide m365-slide">
      <Header kicker="SAFER BY DESIGN" title="安全な案から始める" frame={frame} />
      <div className="m365-safer-list">
        {choices.map(([from, to], index) => (
          <div key={from} style={lift(entrance(frame, fps, 16 + index * 9), 18)}>
            <span>{from}</span><ChevronRight size={24} /><strong>{to}</strong>
          </div>
        ))}
      </div>
      <p className="m365-punch" style={lift(entrance(frame, fps, 78), 14)}><ShieldCheck size={28} /> 最小権限は、<b>審査を通す技術</b>であり、事故を小さくする設計</p>
    </section>
  )
}

function RecapSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const recap = [
    ['登録', 'アプリの身分証をEntra IDへ作る'],
    ['権限', 'Delegated / Applicationで届き方が変わる'],
    ['同意', 'Requestedを審査し、Grantedにする'],
    ['申請', '誰として・何を・どこまで・どう守るか']
  ]
  return (
    <section className="remotion-slide m365-slide m365-recap-slide">
      <Header kicker="RECAP" title="申請の本質は「入口の共同設計」" frame={frame} />
      <div className="m365-recap">
        {recap.map(([label, body], index) => (
          <div key={label} style={lift(entrance(frame, fps, 18 + index * 12), 24)}><Check size={28} /><strong>{label}</strong><span>{body}</span></div>
        ))}
      </div>
      <p className="m365-final-line" style={lift(entrance(frame, fps, 76), 18)}>「使えません」で終わらせず、<b>安全に使える形を一緒に作る。</b></p>
    </section>
  )
}

function SourcesSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const sources = [
    ['Application model', 'アプリ登録とidentity configuration', 'https://learn.microsoft.com/en-us/entra/identity-platform/application-model'],
    ['Permissions and consent overview', 'Delegated / Application permissionと同意', 'https://learn.microsoft.com/en-us/entra/identity-platform/permissions-consent-overview'],
    ['Microsoft Graph auth concepts', 'Graph、トークン、2つのアクセスシナリオ', 'https://learn.microsoft.com/en-us/graph/auth/auth-concepts'],
    ['Microsoft Graph permissions reference', '各権限の正式な説明と最小権限', 'https://learn.microsoft.com/en-us/graph/permissions-reference'],
    ['Admin consent workflow', '管理者同意リクエストの仕組み', 'https://learn.microsoft.com/en-us/entra/identity/enterprise-apps/admin-consent-workflow-overview']
  ]
  return (
    <section className="remotion-slide m365-slide">
      <Header kicker="OFFICIAL SOURCES" title="Microsoft公式ドキュメント" frame={frame} />
      <div className="m365-sources">
        {sources.map(([title, desc, url], index) => (
          <a href={url} target="_blank" rel="noreferrer" key={title} style={lift(entrance(frame, fps, 16 + index * 9), 18)}>
            <span>{String(index + 1).padStart(2, '0')}</span><div><strong>{title}</strong><p>{desc}</p></div><ChevronRight size={26} />
          </a>
        ))}
      </div>
      <p className="m365-source-foot">2026年8月6日確認 ｜ 実運用では組織ポリシーと最新文書を情シスと確認してください</p>
    </section>
  )
}
