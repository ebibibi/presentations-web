/* eslint-disable react-refresh/only-export-components */
import {
  AppWindow,
  Bell,
  Bot,
  Building2,
  CalendarDays,
  Check,
  ChevronRight,
  CircleAlert,
  Database,
  FileText,
  Fingerprint,
  IdCard,
  KeyRound,
  LockKeyhole,
  Mail,
  MessageSquare,
  Monitor,
  Network,
  Send,
  ShieldCheck,
  Sparkles,
  ThumbsUp,
  User,
  UserCheck,
  Users
} from 'lucide-react'
import { interpolate, spring, useVideoConfig } from 'remotion'
import type { SlideModule, SlideRenderContext } from '../../../src/types'
import { LogoMark } from '../../../src/deck-shared'

export const slides: SlideModule['slides'] = [
  { render: (props) => <OpeningSlide {...props} /> },
  { render: (props) => <ProfileSlide {...props} /> },
  { render: (props) => <MadeAnAppSlide {...props} /> },
  { render: (props) => <SuddenWallSlide {...props} /> },
  { render: (props) => <AlreadyHaveIdSlide {...props} /> },
  { render: (props) => <FirstPartyAppsSlide {...props} /> },
  { render: (props) => <WhyIdSlide {...props} /> },
  { render: (props) => <WhyNotMyIdSlide {...props} /> },
  { render: (props) => <TwoIdentitiesSlide {...props} /> },
  { render: (props) => <RegistrationSlide {...props} /> },
  { render: (props) => <ApiAnalogySlide {...props} /> },
  { render: (props) => <M365CitySlide {...props} /> },
  { render: (props) => <GraphSlide {...props} /> },
  { render: (props) => <CompleteFlowSlide {...props} /> },
  { render: (props) => <TokenSlide {...props} /> },
  { render: (props) => <TwoTokenPathsSlide {...props} /> },
  { render: (props) => <DelegatedSlide {...props} /> },
  { render: (props) => <AppOnlySlide {...props} /> },
  { render: (props) => <PermissionSlide {...props} /> },
  { render: (props) => <ConsentSlide {...props} /> },
  { render: (props) => <RegistrationPolicySlide {...props} /> },
  { render: (props) => <ItCreatesSlide {...props} /> },
  { render: (props) => <CredentialSafetySlide {...props} /> },
  { render: (props) => <AdminViewSlide {...props} /> },
  { render: (props) => <RequestExampleSlide {...props} /> },
  { render: (props) => <RecapSlide {...props} /> },
  { render: (props) => <EndSummarySlide {...props} /> },
  { render: (props) => <EbiStudySlide {...props} /> },
  { render: (props) => <SourcesSlide {...props} /> },
  { render: (props) => <SourcesOperationsSlide {...props} /> },
  { render: (props) => <ThanksSlide {...props} /> }
]

function entrance(frame: number, fps: number, delay = 0) {
  return spring({ frame: frame - delay, fps, config: { damping: 18, stiffness: 105 } })
}

function lift(value: number, distance = 30) {
  return { opacity: value, transform: `translateY(${(1 - value) * distance}px)` }
}

function Header({ kicker, title, frame }: { kicker: string; title: React.ReactNode; frame: number }) {
  const { fps } = useVideoConfig()
  return <div className="m365-head" style={lift(entrance(frame, fps), 24)}><span className="slide-kicker">{kicker}</span><h1>{title}</h1></div>
}

function Badge({ tone, children }: { tone: 'safe' | 'warn' | 'info'; children: React.ReactNode }) {
  return <span className={`m365-badge m365-badge-${tone}`}>{children}</span>
}

function OpeningSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const pulse = 1 + Math.sin(frame / 12) * 0.025
  return (
    <section className="remotion-slide m365-slide m365-opening m365-opening-beginner">
      <div className="m365-grid-bg" /><LogoMark className="m365-logo" />
      <div className="m365-opening-copy" style={lift(entrance(frame, fps), 46)}>
        <span className="slide-kicker">MICROSOFT 365 × MY FIRST AI APP</span>
        <h1>なぜアプリにも<br /><em>IDが必要？</em></h1>
        <p>「自分のIDではダメなの？」から始める、M365アプリ登録</p>
      </div>
      <div className="m365-opening-visual" style={{ transform: `scale(${pulse})` }}>
        <div className="m365-orbit m365-orbit-one" /><div className="m365-orbit m365-orbit-two" />
        <div className="m365-id-core"><Fingerprint size={82} strokeWidth={1.5} /><span>WHO?</span></div>
        <div className="m365-satellite m365-sat-user"><User size={32} /><span>あなた</span></div>
        <div className="m365-satellite m365-sat-api"><AppWindow size={32} /><span>Webアプリ</span></div>
        <div className="m365-satellite m365-sat-key"><KeyRound size={32} /><span>許可</span></div>
      </div>
      <a className="m365-source-line" href="https://learn.microsoft.com/en-us/entra/identity-platform/application-model" target="_blank" rel="noreferrer">Source: Microsoft Learn ─ Application model</a>
    </section>
  )
}

function ProfileSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const facts = ['Microsoft MVP 14年連続', 'Windows・Azure・M365', '生成AIを実機で検証', '著書「Windowsインフラ管理者入門」']
  return (
    <section className="remotion-slide m365-slide m365-profile-slide">
      <Header kicker="YOUR GUIDE" title="解説する人：胡田 昌彦" frame={frame} />
      <div className="m365-profile-layout">
        <div className="m365-profile-mark" style={lift(entrance(frame, fps, 16), 24)}><LogoMark /><strong>Masahiko<br />Ebisuda</strong><span>えびすだ まさひこ</span></div>
        <div className="m365-profile-facts">{facts.map((fact, i) => <div key={fact} style={lift(entrance(frame, fps, 28 + i * 10), 18)}><Check size={27} /><strong>{fact}</strong></div>)}</div>
      </div>
      <p className="m365-punch">難しい管理者用語を、<b>普段M365を使う人の目線</b>に翻訳します。</p>
    </section>
  )
}

function MadeAnAppSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const steps = [['YOU', '「メールを整理するWebアプリを作って」'], ['AI', 'コードを書きます。画面も作ります。'], ['APP', 'サンプルデータで動いた！']]
  return (
    <section className="remotion-slide m365-slide">
      <Header kicker="OUR STORY ─ 01" title="AIと一緒にWebアプリを作った" frame={frame} />
      <div className="m365-live-build">
        <div className="m365-build-chat">{steps.map(([who, body], i) => <div key={who} style={lift(entrance(frame, fps, 18 + i * 12), 20)}><span>{who}</span><p>{body}</p></div>)}</div>
        <div className="m365-browser-card" style={lift(entrance(frame, fps, 42), 24)}><div><i /><i /><i /></div><Mail size={64} /><strong>AIメール整理</strong><button>メールを要約する</button><small>✓ サンプルデータで成功</small></div>
      </div>
      <p className="m365-punch" style={lift(entrance(frame, fps, 74), 14)}>次は、会社の<b>本物のメール</b>で使いたい。</p>
    </section>
  )
}

function SuddenWallSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const words = ['Microsoft Entra ID', 'アプリ登録', 'Application (client) ID']
  return (
    <section className="remotion-slide m365-slide">
      <Header kicker="OUR STORY ─ 02" title="実データの直前で、急に止まる" frame={frame} />
      <div className="m365-wall-stage">
        <div className="m365-ready-app" style={lift(entrance(frame, fps, 18), 24)}><AppWindow size={66} /><strong>完成したWebアプリ</strong><span>あと接続するだけ</span></div>
        <ChevronRight size={44} />
        <div className="m365-word-wall">{words.map((word, i) => <div key={word} style={lift(entrance(frame, fps, 32 + i * 12), 20)}>{word}</div>)}</div>
        <div className="m365-next-guide" style={lift(entrance(frame, fps, 74), 14)}>
          今は覚えなくてOK → 次から、ひとつずつ説明します
        </div>
      </div>
      <div className="m365-beginner-question" style={lift(entrance(frame, fps, 74), 16)}><CircleAlert size={34} /><strong>待って。</strong><span>普段は使えているのに、なぜアプリには別のIDがいるの？</span></div>
    </section>
  )
}

function AlreadyHaveIdSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide m365-slide">
      <Header kicker="START FROM WHAT YOU KNOW" title="あなたは、すでにIDを使っている" frame={frame} />
      <div className="m365-familiar-flow">
        <div className="m365-person-card" style={lift(entrance(frame, fps, 18), 22)}><User size={70} /><strong>あなた</strong><span>会社のアカウントでサインイン</span></div>
        <ChevronRight size={40} />
        <div className="m365-entra-gate" style={lift(entrance(frame, fps, 32), 22)}><ShieldCheck size={70} /><strong>Microsoft Entra ID</strong><span>あなたは誰？を確認</span></div>
        <ChevronRight size={40} />
        <div className="m365-familiar-apps"><div><Mail /><span>Outlook</span></div><div><MessageSquare /><span>Teams</span></div></div>
      </div>
      <p className="m365-punch" style={lift(entrance(frame, fps, 70), 14)}>普段はOutlookやTeamsが隠しているので、<b>IDの仕組みを意識しない</b>だけ。</p>
    </section>
  )
}

function FirstPartyAppsSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const apps = [[<Mail size={48} />, 'Outlook'], [<MessageSquare size={48} />, 'Teams'], [<Building2 size={48} />, 'SharePoint']]
  return (
    <section className="remotion-slide m365-slide">
      <Header kicker="MICROSOFT APPS, TOO" title="Outlookも、Microsoftが先にアプリ登録済み" frame={frame} />
      <div className="m365-first-party-flow">
        <div className="m365-first-party-apps" style={lift(entrance(frame, fps, 18), 22)}>
          <Badge tone="safe">Microsoft純正アプリ</Badge>
          <div>{apps.map(([icon, label]) => <span key={String(label)}>{icon}<b>{label}</b></span>)}</div>
        </div>
        <ChevronRight size={42} />
        <div className="m365-first-party-registration" style={lift(entrance(frame, fps, 38), 22)}>
          <ShieldCheck size={66} />
          <strong>Microsoftが<br />先にアプリ登録</strong>
          <span>Application IDを持つ</span>
        </div>
      </div>
      <p className="m365-punch" style={lift(entrance(frame, fps, 68), 14)}><b>自作アプリだけが特別なのではない。</b>純正アプリも同じIDの仕組みを使う。</p>
      <div className="m365-first-party-note" style={lift(entrance(frame, fps, 82), 12)}>
        <CircleAlert size={24} />
        <span>各社の管理画面には、利用・同意などに応じて管理用の情報が作られる。最初から全Microsoftアプリが並ぶ、という意味ではない。</span>
      </div>
    </section>
  )
}

function WhyIdSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide m365-slide">
      <Header kicker="WHY ID?" title="会社のデータは、誰にでも渡せない" frame={frame} />
      <div className="m365-id-reason-flow">
        <div className="m365-company-data" style={lift(entrance(frame, fps, 18), 24)}>
          <LockKeyhole size={62} />
          <strong>会社のデータ</strong>
          <div><span><Mail size={27} />メール</span><span><FileText size={27} />ファイル</span><span><MessageSquare size={27} />チャット</span></div>
        </div>
        <ChevronRight size={48} />
        <div className="m365-who-check" style={lift(entrance(frame, fps, 38), 24)}>
          <ShieldCheck size={66} />
          <span>利用する前に</span>
          <strong>「あなたは誰？」</strong>
          <b>を確認する</b>
        </div>
      </div>
      <p className="m365-punch" style={lift(entrance(frame, fps, 70), 14)}>この<b>「誰かを確かめるため」</b>に、IDが必要。</p>
    </section>
  )
}

function WhyNotMyIdSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const risks = [['パスワード漏えい', '人間のアカウントごと奪われる'], ['渡しすぎる', 'アプリに不要な資格情報まで渡す'], ['絞りにくい', 'アプリ単位で権限を制御しにくい']]
  return (
    <section className="remotion-slide m365-slide">
      <Header kicker="THE NATURAL QUESTION" title="自分のIDを、アプリに貸せばいい？" frame={frame} />
      <div className="m365-lend-id">
        <div className="m365-badge-loan" style={lift(entrance(frame, fps, 18), 24)}><IdCard size={88} /><strong>あなたのID・パスワード</strong><ChevronRight size={40} /><Bot size={88} /><span className="m365-no-mark">×</span></div>
        <div className="m365-risk-list">{risks.map(([title, body], i) => <div key={title} style={lift(entrance(frame, fps, 34 + i * 11), 18)}><CircleAlert size={26} /><strong>{title}</strong><span>{body}</span></div>)}</div>
      </div>
      <p className="m365-punch"><b>人とアプリは別々に識別</b>する。だからアプリにもIDが必要。</p>
    </section>
  )
}

function TwoIdentitiesSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const cards = [
    ['HUMAN ID', <User size={64} />, 'あなたを識別', '誰が使っている？', 'm365-human-id'],
    ['APPLICATION ID', <AppWindow size={64} />, 'ソフトウェアを識別', 'どのアプリから来た？', 'm365-app-id']
  ]
  return (
    <section className="remotion-slide m365-slide">
      <Header kicker="TWO ACTORS" title="人のIDと、アプリのID" frame={frame} />
      <div className="m365-two-id-cards">{cards.map(([label, icon, title, body, cls], i) => <div className={String(cls)} key={String(label)} style={lift(entrance(frame, fps, 18 + i * 16), 28)}><span>{label}</span>{icon}<strong>{title}</strong><p>{body}</p></div>)}</div>
      <div className="m365-two-id-result" style={lift(entrance(frame, fps, 66), 18)}><UserCheck /><b>胡田さん</b><span>が</span><AppWindow /><b>メール要約アプリ</b><span>を使っている</span></div>
    </section>
  )
}

function RegistrationSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const fields = ['アプリの名前', 'Application (client) ID', 'サインインできる組織', '回答を返すURL', '通常は、利用したいAPIと操作']
  return (
    <section className="remotion-slide m365-slide">
      <Header kicker="APP REGISTRATION" title="アプリ登録は「アプリの身元届」" frame={frame} />
      <div className="m365-registration">
        <div className="m365-id-card" style={lift(entrance(frame, fps, 20), 30)}><div className="m365-id-card-top"><Building2 size={42} /><span>Microsoft Entra ID の台帳</span></div><strong>MY AI APP</strong>{fields.map((field, i) => <div key={field} style={{ opacity: entrance(frame, fps, 34 + i * 8) }}><Check size={19} />{field}</div>)}</div>
        <div className="m365-not-code" style={lift(entrance(frame, fps, 64), 24)}><FileText size={56} /><span>Webアプリの<br />ソースコード</span><b>Entra IDへは<br />アップロードしない</b><small>コードはWebサーバーなど<br />別の場所で動く</small></div>
      </div>
      <div className="m365-registration-bottom">
        <p className="m365-punch">Entra IDへ登録するのは、<b>アプリの識別・サインイン設定</b>。通常は利用したいAPI権限も設定。</p>
        <div className="m365-next-guide">APIって何？ → 次のスライドで説明します</div>
      </div>
    </section>
  )
}

function ApiAnalogySlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide m365-slide">
      <Header kicker="NEW WORD ─ API" title="クリックの裏では、アプリがAPIへ依頼" frame={frame} />
      <div className="m365-click-flow">
        <div style={lift(entrance(frame, fps, 16), 20)}><User size={52} /><strong>人がクリック</strong><span>「受信トレイを開く」</span></div><ChevronRight />
        <div style={lift(entrance(frame, fps, 28), 20)}><Monitor size={52} /><strong>Outlookなどのアプリ</strong><span>人の操作を機械向けの依頼へ</span></div><ChevronRight />
        <div className="m365-click-api" style={lift(entrance(frame, fps, 40), 20)}><Network size={52} /><strong>API</strong><span>サービスへ正式に依頼</span></div><ChevronRight />
        <div style={lift(entrance(frame, fps, 52), 20)}><Mail size={52} /><strong>結果が返る</strong><span>人に分かる画面へ表示</span></div>
      </div>
      <p className="m365-punch" style={lift(entrance(frame, fps, 72), 14)}>API ＝ <b>アプリがサービスへ頼むための受付窓口とルール</b></p>
    </section>
  )
}

function M365CitySlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const services = [[<Mail />, 'メール・予定表', 'Exchange Online'], [<FileText />, 'ファイル', 'OneDrive'], [<Building2 />, '社内サイト', 'SharePoint'], [<MessageSquare />, 'チャット・会議', 'Teams'], [<Users />, '社員・グループ', 'Entra ID']]
  return (
    <section className="remotion-slide m365-slide">
      <Header kicker="MICROSOFT 365 MAP" title="M365は、1つの製品ではない" frame={frame} />
      <div className="m365-city-grid">{services.map(([icon, what, name], i) => <div key={String(name)} style={lift(entrance(frame, fps, 16 + i * 9), 22)}>{icon}<strong>{what}</strong><span>{name}</span><small>APIの入口</small></div>)}</div>
      <div className="m365-two-entrances" style={lift(entrance(frame, fps, 74), 16)}><span><User size={27} /><div>人は Outlook / Teams / SharePoint の<b>画面</b>から</div></span><span><AppWindow size={27} /><div>もともとは、アプリも<b>サービスごとのAPI</b>から</div></span></div>
    </section>
  )
}

function GraphSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const services = [[<Mail />, 'Mail'], [<CalendarDays />, 'Calendar'], [<FileText />, 'Files'], [<MessageSquare />, 'Teams'], [<Users />, 'Users']]
  return (
    <section className="remotion-slide m365-slide">
      <Header kicker="FROM MANY APIs TO ONE" title="そこで、共通入口のMicrosoft Graphへ" frame={frame} />
      <div className="m365-graph-hub">
        <div className="m365-graph-app" style={lift(entrance(frame, fps, 16), 20)}><AppWindow size={64} /><strong>あなたのWebアプリ</strong></div><ChevronRight size={40} />
        <div className="m365-graph-core" style={lift(entrance(frame, fps, 30), 20)}><Network size={74} /><strong>Microsoft Graph</strong><span>保護された統一API</span></div><ChevronRight size={40} />
        <div className="m365-graph-services">{services.map(([icon, label], i) => <div key={String(label)} style={lift(entrance(frame, fps, 44 + i * 7), 14)}>{icon}<span>{label}</span></div>)}</div>
      </div>
      <div className="m365-graph-history" style={lift(entrance(frame, fps, 72), 14)}><span>以前：サービスごとのAPIが中心</span><ChevronRight size={28} /><strong>現在：Graphへ統合を進める</strong><small>ただし完全一本化ではなく、一部は個別API・管理APIが残る</small></div>
    </section>
  )
}

function CompleteFlowSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const steps = [['1', <User />, 'Webアプリを開く'], ['2', <ShieldCheck />, 'Microsoftでサインイン'], ['3', <IdCard />, 'Entra IDから期限付き通行証'], ['4', <Network />, 'Graphへメールを依頼'], ['5', <Mail />, '許可されたデータが返る']]
  return (
    <section className="remotion-slide m365-slide">
      <Header kicker="PUT IT ALL TOGETHER" title="Webアプリからメールを読むまで" frame={frame} />
      <div className="m365-complete-flow">{steps.map(([num, icon, label], i) => <div className="m365-flow-unit" key={String(num)} style={lift(entrance(frame, fps, 14 + i * 12), 22)}><span>{num}</span>{icon}<strong>{label}</strong>{i < steps.length - 1 ? <ChevronRight className="m365-step-next" /> : null}</div>)}</div>
      <div className="m365-check-both" style={lift(entrance(frame, fps, 82), 14)}><ShieldCheck size={29} /><span>接続では</span><b>人</b><span>と</span><b>アプリ</b><span>の両方を区別する</span></div>
    </section>
  )
}

function TokenSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const scan = interpolate(frame % 60, [0, 59], [0, 360])
  return (
    <section className="remotion-slide m365-slide">
      <Header kicker="ACCESS TOKEN" title="パスワードではなく「期限付き通行証」" frame={frame} />
      <div className="m365-token-stage">
        <div className="m365-password-card" style={lift(entrance(frame, fps, 18), 22)}><LockKeyhole size={58} /><strong>あなたのパスワード</strong><span>アプリへ貸さない</span><b>×</b></div>
        <ChevronRight size={42} />
        <div className="m365-token-card" style={lift(entrance(frame, fps, 34), 22)}><div className="m365-token-scan" style={{ transform: `translateX(${scan}px)` }} /><IdCard size={60} /><strong>ACCESS TOKEN</strong><p>どのアプリ／許可範囲<br />誰（ユーザー委任時）<br />利用先／有効期限</p></div>
        <ChevronRight size={42} />
        <div className="m365-api-check" style={lift(entrance(frame, fps, 50), 22)}><ShieldCheck size={60} /><strong>APIが確認</strong><span>通してよい？</span></div>
      </div>
      <p className="m365-note"><CircleAlert size={23} /><span>トークンも機密情報。認証ライブラリを使って安全に扱う</span></p>
    </section>
  )
}

function TwoTokenPathsSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide m365-slide m365-two-paths-slide">
      <Header kicker="THE BIG FORK" title="Access Tokenには、大きく2つの道" frame={frame} />
      <div className="m365-token-fork">
        <div className="m365-fork-start" style={lift(entrance(frame, fps, 16), 20)}><IdCard size={66} /><strong>ACCESS<br />TOKEN</strong></div>
        <div className="m365-fork-line"><span /></div>
        <div className="m365-fork-options">
          <div style={lift(entrance(frame, fps, 34), 22)}><UserCheck size={62} /><Badge tone="safe">人がいる</Badge><strong>ユーザー委任</strong><span>利用者の代理で動く</span></div>
          <div style={lift(entrance(frame, fps, 48), 22)}><Bot size={62} /><Badge tone="warn">人がいない</Badge><strong>アプリ単独</strong><span>アプリ自身として動く</span></div>
        </div>
      </div>
      <div className="m365-next-guide">この2つを、次の2枚で順番に説明します</div>
    </section>
  )
}

function DelegatedSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const tokenX = interpolate(frame % 75, [0, 74], [0, 420])
  return (
    <section className="remotion-slide m365-slide">
      <Header kicker="CASE 01 ─ USER IS HERE" title="人が操作するなら「ユーザー委任」" frame={frame} />
      <div className="m365-flow-stage"><div className="m365-flow-node" style={lift(entrance(frame, fps, 18), 18)}><UserCheck size={60} /><strong>利用者</strong><span>サインインする</span></div><div className="m365-flow-track"><span style={{ transform: `translateX(${tokenX}px)` }}>TOKEN</span></div><div className="m365-flow-node m365-node-app" style={lift(entrance(frame, fps, 32), 18)}><AppWindow size={60} /><strong>Webアプリ</strong><span>利用者の代理</span></div><ChevronRight className="m365-flow-arrow" size={40} /><div className="m365-flow-node" style={lift(entrance(frame, fps, 46), 18)}><Database size={60} /><strong>Microsoft 365</strong><span>APIで応答</span></div></div>
      <div className="m365-intersection" style={lift(entrance(frame, fps, 68), 20)}><span>アプリに同意された範囲</span><b>∩</b><span>その人が見られる範囲</span><strong>＝ 実際に届く範囲</strong></div>
      <p className="m365-note"><ShieldCheck size={24} /><span>今回の「本人がボタンを押すWebアプリ」は、まずこちらを検討</span></p>
    </section>
  )
}

function AppOnlySlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide m365-slide m365-app-only">
      <Header kicker="CASE 02 ─ NO USER" title="人がいないなら「アプリ単独」" frame={frame} />
      <div className="m365-night-flow"><div className="m365-clock" style={lift(entrance(frame, fps, 20), 18)}><span>02:00</span><small>誰もサインインしていない</small></div><ChevronRight size={38} /><div className="m365-service" style={lift(entrance(frame, fps, 34), 18)}><Bot size={68} /><strong>定期処理アプリ</strong><span>アプリ自身のID</span></div><ChevronRight size={38} /><div className="m365-tenant" style={lift(entrance(frame, fps, 48), 18)}><Database size={68} /><strong>組織のデータ</strong><span>権限によっては広範囲</span></div></div>
      <div className="m365-warning-band" style={lift(entrance(frame, fps, 72), 16)}><CircleAlert size={30} /><b>Application権限はすべて管理者同意</b><span>アプリの認証方法・監視・停止方法まで設計</span></div>
      <div className="m365-mini-tags"><span>夜間処理</span><span>バックアップ</span><span>監視</span><span>同期</span></div>
    </section>
  )
}

function PermissionSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const actions = [[<Mail />, 'メールを読む', 'Mail.Read'], [<Send />, 'メールを送る', 'Mail.Send'], [<FileText />, 'ファイルを読む', 'Files.Read…']]
  return (
    <section className="remotion-slide m365-slide">
      <Header kicker="IDENTITY ≠ PERMISSION" title="IDだけがあっても、何もできない" frame={frame} />
      <div className="m365-id-vs-permission"><div style={lift(entrance(frame, fps, 18), 22)}><IdCard size={72} /><Badge tone="info">ID</Badge><strong>誰なのか</strong><p>人やアプリを区別する</p></div><div className="m365-plus">＋</div><div className="m365-action-perms">{actions.map(([icon, label, perm], i) => <div key={String(label)} style={lift(entrance(frame, fps, 34 + i * 10), 18)}>{icon}<span>{label}</span><code>{perm}</code></div>)}</div></div>
      <p className="m365-punch"><b>Permission</b> ＝ そのIDで「何をしてよいか」</p>
    </section>
  )
}

function RegistrationPolicySlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide m365-slide">
      <Header kicker="TENANT POLICY" title="アプリを自分で登録できる組織／できない組織" frame={frame} />
      <div className="m365-policy-split">
        <div className="m365-policy-yes" style={lift(entrance(frame, fps, 18), 24)}><Badge tone="safe">登録できる</Badge><AppWindow size={58} /><strong>自分でアプリ登録</strong><p>必要なAPI権限を設定</p><ChevronRight /><b>必要な項目だけ<br />管理者へ同意を依頼</b><small>管理画面またはWebアプリの承認画面</small></div>
        <div className="m365-policy-no" style={lift(entrance(frame, fps, 36), 24)}><Badge tone="warn">登録できない</Badge><ShieldCheck size={58} /><strong>情シスへ作成を依頼</strong><p>用途・URL・API・権限を伝える</p><ChevronRight /><b>運用できる形で<br />引き渡してもらう</b><small>詳しくは次のスライド</small></div>
      </div>
      <p className="m365-note">登録できるかどうかと、要求した権限へ同意できるかどうかは別の設定</p>
    </section>
  )
}

function ItCreatesSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const handoff = [['1', 'アプリ登録を作成', '名前・URL・対象組織・API権限'], ['2', 'あなたをOwnerへ', 'App registrationとEnterprise application'], ['3', '認証方法を設定', '認証情報そのものをチャットで配らない']]
  return (
    <section className="remotion-slide m365-slide">
      <Header kicker="WHEN IT CREATES IT" title="情シスに作ってもらうなら、運用権限も依頼" frame={frame} />
      <div className="m365-handoff-list">{handoff.map(([num, title, body], i) => <div key={num} style={lift(entrance(frame, fps, 16 + i * 14), 22)}><span>{num}</span><div><strong>{title}</strong><p>{body}</p></div></div>)}</div>
      <div className="m365-owner-explain" style={lift(entrance(frame, fps, 70), 18)}><UserCheck size={34} /><b>Owner</b><span>＝ そのアプリ設定を管理できる担当者。必要に応じて2つの管理対象へ追加してもらう。</span></div>
      <p className="m365-note">所有者にしてもらえない場合は、情シス側で変更・更新する運用窓口を決める</p>
    </section>
  )
}

function CredentialSafetySlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const choices = [['BEST', '対応環境で使う', 'Managed Identity／\nWorkload federation', '保存する資格情報なし', 'safe'], ['GOOD', '上記が使えない本番', '証明書', '秘密鍵をKey Vaultなどで保護', 'info'], ['DEV ONLY', '開発・試験', 'Client Secret', '本番では避ける', 'warn']]
  return (
    <section className="remotion-slide m365-slide">
      <Header kicker="APP CREDENTIALS" title="認証情報は「シークレットを配る」で済ませない" frame={frame} />
      <div className="m365-credential-grid">{choices.map(([rank, when, title, body, tone], i) => <div className={`m365-credential-${tone}`} key={rank} style={lift(entrance(frame, fps, 16 + i * 13), 24)}><span>{rank}</span>{i === 0 ? <Sparkles size={52} /> : i === 1 ? <ShieldCheck size={52} /> : <KeyRound size={52} />}<small>{when}</small><strong>{String(title).split('\n').map((line, index) => <span key={line}>{index ? <br /> : null}{line}</span>)}</strong><p>{body}</p></div>)}</div>
      <div className="m365-managed-note" style={lift(entrance(frame, fps, 72), 16)}><Building2 size={30} /><span>Azure App Serviceなどなら、Managed Identityへ必要な<b>Application権限</b>を直接付与する設計を検討</span></div>
    </section>
  )
}

function ConsentSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const steps = [['1', 'Requested', 'アプリが希望'], ['2', 'Review', '内容を確認'], ['3', 'Consent', '利用者／管理者が同意'], ['4', 'Granted', '許可が有効']]
  return (
    <section className="remotion-slide m365-slide">
      <Header kicker="CONSENT" title="「ほしい」と「許可された」は別" frame={frame} />
      <div className="m365-consent-line">{steps.map(([num, title, desc], i) => <div className={`m365-consent-step m365-consent-${i === 3 ? 'safe' : i === 2 ? 'warn' : 'info'}`} key={num} style={lift(entrance(frame, fps, 18 + i * 14), 22)}><span>{num}</span><strong>{title}</strong><p>{desc}</p></div>)}</div>
      <div className="m365-consent-note" style={lift(entrance(frame, fps, 80), 14)}><User size={28} /><span>ユーザー同意：組織ポリシーで許された範囲</span><ShieldCheck size={28} /><span>管理者同意：Application権限や高権限のDelegated権限</span></div>
    </section>
  )
}

function AdminViewSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const items = [['01', 'どのアプリ？', 'Application ID'], ['02', '誰が使う？', '利用者・対象組織'], ['03', '何を触る？', 'サービス・データ'], ['04', 'どこまで？', '読み取り・書き込み'], ['05', 'どう守る？', 'URL・資格情報'], ['06', '誰が止める？', '責任者・失効手順']]
  return (
    <section className="remotion-slide m365-slide">
      <Header kicker="WHY IT REVIEWS" title="情シスが守りたいもの" frame={frame} />
      <div className="m365-review-grid">{items.map(([num, title, desc], i) => <div key={num} style={lift(entrance(frame, fps, 16 + i * 9), 22)}><span>{num}</span><strong>{title}</strong><p>{desc}</p></div>)}</div>
      <p className="m365-punch" style={lift(entrance(frame, fps, 78), 14)}>アプリ登録して管理するから、<b>アプリ単位で確認・記録・停止</b>できる。</p>
    </section>
  )
}

function RequestExampleSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const items = [['目的', '本人が選んだSharePoint文書をAIで要約'], ['使い方', '本人がWebアプリへサインインして操作'], ['方式', 'Delegatedを希望'], ['操作', '読み取りのみ／具体的権限名を確認'], ['範囲', '検証利用者5名・最大到達範囲も明記'], ['運用', '実行URL・責任者・停止方法あり']]
  return (
    <section className="remotion-slide m365-slide">
      <Header kicker="REQUEST EXAMPLE" title="情シスには、こう説明する" frame={frame} />
      <div className="m365-beginner-request"><div className="m365-request-app" style={lift(entrance(frame, fps, 16), 22)}><Bot size={62} /><strong>AI文書要約<br />Webアプリ</strong><Badge tone="safe">小さく検証</Badge></div><div className="m365-request-facts">{items.map(([label, body], i) => <div key={label} style={lift(entrance(frame, fps, 28 + i * 8), 16)}><span>{label}</span><strong>{body}</strong></div>)}</div></div>
      <p className="m365-note">「Graphを使いたい」だけでなく、用途・最大範囲・守り方をセットで伝える</p>
    </section>
  )
}

function RecapSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const recap = [['あなたのID', '人間を区別する'], ['Application ID', '接続するソフトウェアを区別する'], ['API', 'アプリ向けの受付窓口'], ['Microsoft Graph', 'M365の多くのサービスにつながる共通受付'], ['Permission＋Consent', '何を許すかを決める']]
  return (
    <section className="remotion-slide m365-slide m365-recap-slide">
      <Header kicker="RECAP" title="Application IDは、アプリを区別するため" frame={frame} />
      <div className="m365-recap m365-recap-five">{recap.map(([label, body], i) => <div key={label} style={lift(entrance(frame, fps, 16 + i * 10), 22)}><Check size={27} /><strong>{label}</strong><span>{body}</span></div>)}</div>
      <p className="m365-final-line" style={lift(entrance(frame, fps, 80), 16)}>自分のIDを貸さずに、<b>人とアプリの両方を確認して</b>実データへつなぐ。</p>
    </section>
  )
}

function EndSummarySlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const points = [
    ['1', '人とアプリは、別々のIDで確認する'],
    ['2', 'APIへは、Entra IDの通行証を添えて依頼する'],
    ['3', '必要最小限の権限だけ、同意してもらう']
  ]
  return (
    <section className="remotion-slide m365-slide m365-end-summary-slide">
      <div className="m365-end-summary-copy" style={lift(entrance(frame, fps, 10), 34)}>
        <span>SUMMARY</span>
        <h1>覚えるのは、<br /><em>この3つ。</em></h1>
      </div>
      <div className="m365-end-summary-points">{points.map(([num, body], i) => <div key={num} style={lift(entrance(frame, fps, 24 + i * 12), 22)}><span>{num}</span><strong>{body}</strong></div>)}</div>
      <div className="m365-the-end" style={lift(entrance(frame, fps, 70), 18)}><Check size={38} /><strong>本編はここまで。</strong><b>おしまい！</b></div>
    </section>
  )
}

function EbiStudySlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide m365-slide m365-ebistudy-slide">
      <div className="m365-ebistudy-copy" style={lift(entrance(frame, fps, 12), 34)}><span>Ebi Study</span><h1>体系的に、<br />順番に学びたい方へ。</h1><p>Microsoft資格・Windows Server・Azure・Claude Codeを<br />迷わず進められる動画講座にまとめています。</p><a href="https://study.ebisuda.net" target="_blank" rel="noreferrer">study.ebisuda.net <ChevronRight size={30} /></a></div>
      <div className="m365-ebistudy-badge" style={lift(entrance(frame, fps, 34), 24)}><LogoMark /><strong>月額<br /><em>990円</em></strong></div>
    </section>
  )
}

function SourcesSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const sources = [['Application model', 'なぜ人とアプリの両方を登録するか', 'https://learn.microsoft.com/en-us/entra/identity-platform/application-model'], ['Microsoft first-party applications', 'Microsoft純正アプリのIDと管理情報', 'https://learn.microsoft.com/en-us/entra/identity/conditional-access/reference-office-365-application-contents'], ['Microsoft Graph overview', 'M365サービスへつながる統一API', 'https://learn.microsoft.com/en-us/graph/overview'], ['Authentication and authorization basics', '登録・Delegated・Application-only', 'https://learn.microsoft.com/en-us/graph/auth/auth-concepts'], ['Access tokens', 'APIへ渡すセキュリティトークン', 'https://learn.microsoft.com/en-us/entra/identity-platform/access-tokens'], ['Permissions and consent overview', '権限の要求と同意', 'https://learn.microsoft.com/en-us/entra/identity-platform/permissions-consent-overview']]
  return (
    <section className="remotion-slide m365-slide">
      <Header kicker="OFFICIAL SOURCES" title="Microsoft公式ドキュメント" frame={frame} />
      <div className="m365-sources">{sources.map(([title, desc, url], i) => <a href={url} target="_blank" rel="noreferrer" key={title} style={lift(entrance(frame, fps, 14 + i * 9), 18)}><span>{String(i + 1).padStart(2, '0')}</span><div><strong>{title}</strong><p>{desc}</p></div><ChevronRight size={26} /></a>)}</div>
      <p className="m365-source-foot">2026年8月6日確認 ｜ 実際の権限と組織ポリシーは情シスと最新文書で確認</p>
    </section>
  )
}

function SourcesOperationsSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const sources = [['Delegate app registration permissions', 'ユーザーが登録できない場合の委任', 'https://learn.microsoft.com/en-us/entra/identity/role-based-access-control/delegate-app-roles'], ['Assign enterprise application owners', 'Enterprise applicationのOwner', 'https://learn.microsoft.com/en-us/entra/identity/enterprise-apps/assign-app-owners'], ['Credentials overview', 'Managed Identity・証明書・Secretの推奨順位', 'https://learn.microsoft.com/en-us/entra/msidweb/authentication/credentials-overview'], ['Graph from App Service as the app', 'Managed IdentityへGraph権限を付与', 'https://learn.microsoft.com/en-us/entra/identity-platform/multi-service-web-app-access-microsoft-graph-as-app'], ['Microsoft Graph permissions', 'DelegatedとApplicationの範囲', 'https://learn.microsoft.com/en-us/graph/permissions-overview']]
  return (
    <section className="remotion-slide m365-slide">
      <Header kicker="OFFICIAL SOURCES ─ OPERATIONS" title="申請・運用・認証の根拠" frame={frame} />
      <div className="m365-sources">{sources.map(([title, desc, url], i) => <a href={url} target="_blank" rel="noreferrer" key={title} style={lift(entrance(frame, fps, 14 + i * 10), 18)}><span>{String(i + 7).padStart(2, '0')}</span><div><strong>{title}</strong><p>{desc}</p></div><ChevronRight size={26} /></a>)}</div>
      <p className="m365-source-foot">2026年8月6日確認 ｜ テナント設定・権限・管理画面は変更されるため、申請時に最新文書を確認</p>
    </section>
  )
}

function ThanksSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide m365-slide m365-thanks-slide">
      <div className="m365-thanks-glow" />
      <LogoMark className="m365-thanks-logo" />
      <div className="m365-thanks-copy" style={lift(entrance(frame, fps, 8), 38)}>
        <span>THANK YOU FOR WATCHING</span>
        <h1>ご視聴、<br /><em>ありがとうございました！</em></h1>
      </div>
      <div className="m365-thanks-actions">
        <div style={lift(entrance(frame, fps, 28), 24)}><ThumbsUp size={62} /><strong>高評価</strong><span>役に立ったらお願いします！</span></div>
        <div style={lift(entrance(frame, fps, 42), 24)}><Bell size={62} /><strong>チャンネル登録</strong><span>次の解説もお見逃しなく！</span></div>
      </div>
      <p className="m365-thanks-final">これからも、難しいITを分かりやすく解説します。</p>
    </section>
  )
}
