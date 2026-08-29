/* eslint-disable react-refresh/only-export-components */
import {
  ArrowRight,
  Check,
  CirclePlay,
  ClipboardList,
  Filter,
  Fingerprint,
  KeyRound,
  ListChecks,
  Lock,
  Mailbox,
  Monitor,
  RefreshCw,
  ServerCog,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  ThumbsUp,
  Timer,
  TriangleAlert,
  UserX,
  X
} from 'lucide-react'
import { spring, useVideoConfig } from 'remotion'
import type { SlideModule, SlideRenderContext } from '../../../src/types'
import { LogoMark } from '../../../src/deck-shared'

export const slides: SlideModule['slides'] = [
  { render: (props) => <OpeningSlide {...props} /> },
  { render: (props) => <ProfileSlide {...props} /> },
  { render: (props) => <TheQuestionSlide {...props} /> },
  { render: (props) => <SectionWhatSlide {...props} /> },
  { render: (props) => <ResourceAccountSlide {...props} /> },
  { render: (props) => <NotAFailureSlide {...props} /> },
  { render: (props) => <SectionMfaSlide {...props} /> },
  { render: (props) => <DontMfaSlide {...props} /> },
  { render: (props) => <AlsoBlockSlide {...props} /> },
  { render: (props) => <SectionHowSlide {...props} /> },
  { render: (props) => <TwoFactorsSlide {...props} /> },
  { render: (props) => <ExamplePolicySlide {...props} /> },
  { render: (props) => <SeparatePolicySlide {...props} /> },
  { render: (props) => <IntuneRequiredSlide {...props} /> },
  { render: (props) => <SectionFlowsSlide {...props} /> },
  { render: (props) => <RopcSlide {...props} /> },
  { render: (props) => <MtrUsesRopcSlide {...props} /> },
  { render: (props) => <DeviceCodeSlide {...props} /> },
  { render: (props) => <ExceptionScopeSlide {...props} /> },
  { render: (props) => <ExceptionDesignSlide {...props} /> },
  { render: (props) => <ReportOnlyTrapSlide {...props} /> },
  { render: (props) => <SectionNextSlide {...props} /> },
  { render: (props) => <RemainingRiskSlide {...props} /> },
  { render: (props) => <PasswordlessSlide {...props} /> },
  { render: (props) => <PasswordlessCaveatsSlide {...props} /> },
  { render: (props) => <RecapSlide {...props} /> },
  { render: (props) => <RelatedDecksSlide {...props} /> },
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
    <div className="mex-head" style={lift(entrance(frame, fps), 22)}>
      <span className="slide-kicker">{kicker}</span>
      <h1>{title}</h1>
    </div>
  )
}

function Punch({ frame, delay = 70, children }: { frame: number; delay?: number; children: React.ReactNode }) {
  const { fps } = useVideoConfig()
  return (
    <p className="mex-punch" style={lift(entrance(frame, fps, delay), 14)}>
      {children}
    </p>
  )
}

function SourceLine({ href, label }: { href: string; label: string }) {
  return (
    <a className="mex-source-line" href={href} target="_blank" rel="noreferrer">
      Source: {label}
    </a>
  )
}

function Alert({ frame, delay, tone, icon, children }: { frame: number; delay: number; tone?: string; icon: React.ReactNode; children: React.ReactNode }) {
  const { fps } = useVideoConfig()
  return (
    <div className={`mex-alert${tone ? ' mex-alert-' + tone : ''}`} style={lift(entrance(frame, fps, delay), 16)}>
      {icon}
      <p>{children}</p>
    </div>
  )
}

function SectionSlide({ frame, number, title, lead }: { frame: number; number: string; title: string; lead: string }) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide mex-slide mex-section">
      <div className="mex-grid-bg" />
      <div className="mex-section-body">
        <span className="mex-section-number" style={lift(entrance(frame, fps), 30)}>
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
  const pulse = 1 + Math.sin(frame / 14) * 0.02
  return (
    <section className="remotion-slide mex-slide mex-opening">
      <div className="mex-grid-bg" />
      <LogoMark className="mex-logo" />
      <div className="mex-opening-copy" style={lift(entrance(frame, fps), 44)}>
        <span className="slide-kicker">TEAMS ROOMS × ROPC × DEVICE CODE FLOW</span>
        <h1>
          MFAをかけられない
          <br />
          <em>機器をどう守るか</em>
        </h1>
        <p>除外グループに放り込む前に、公式の設計を知る。</p>
      </div>
      <div className="mex-opening-visual" style={{ transform: `scale(${pulse})` }}>
        <div className="mex-room">
          <Monitor size={64} />
          <strong>会議室端末</strong>
          <span>承認する人がいない</span>
        </div>
        <div className="mex-room-guards">
          <div>
            <ShieldCheck size={24} />
            <span>準拠デバイス</span>
          </div>
          <div>
            <Fingerprint size={24} />
            <span>既知の場所</span>
          </div>
        </div>
      </div>
      <SourceLine
        href="https://learn.microsoft.com/microsoftteams/rooms/conditional-access-and-compliance-for-devices"
        label="Microsoft Learn ─ Conditional Access for Teams Rooms"
      />
    </section>
  )
}

function ProfileSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const facts = ['Microsoft MVP 14年連続', 'Windows・Azure・M365', '生成AIを実機で検証', '著書「Windowsインフラ管理者入門」']
  return (
    <section className="remotion-slide mex-slide">
      <Header kicker="YOUR GUIDE" title="解説する人：胡田 昌彦" frame={frame} />
      <div className="mex-profile-layout">
        <div className="mex-profile-mark" style={lift(entrance(frame, fps, 16), 22)}>
          <LogoMark />
          <strong>
            Masahiko
            <br />
            Ebisuda
          </strong>
          <span>えびすだ まさひこ</span>
        </div>
        <div className="mex-profile-facts">
          {facts.map((fact, i) => (
            <div key={fact} style={lift(entrance(frame, fps, 28 + i * 10), 16)}>
              <Check size={26} />
              <strong>{fact}</strong>
            </div>
          ))}
        </div>
      </div>
      <Punch frame={frame} delay={72}>
        今日は<b>運用で必ず詰まる、この一点</b>だけを扱います。
      </Punch>
    </section>
  )
}

function TheQuestionSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const qs = [
    'MFAをかけられないIDはどうする？',
    'ROPCを使っている奴がいる',
    'デバイスコードフローを止めたい'
  ]
  return (
    <section className="remotion-slide mex-slide">
      <Header kicker="THE PREMISE" title="3つの質問は、同じ場所に帰着する" frame={frame} />
      <div className="mex-q-row">
        {qs.map((q, i) => (
          <div key={q} className="mex-q" style={lift(entrance(frame, fps, 16 + i * 12), 20)}>
            <span>Q{i + 1}</span>
            <strong>{q}</strong>
          </div>
        ))}
      </div>
      <div className="mex-converge" style={lift(entrance(frame, fps, 60), 20)}>
        <ArrowRight size={38} />
        <Monitor size={36} />
        <strong>会議室端末などの「リソースアカウント」</strong>
      </div>
      <Punch frame={frame} delay={78}>
        別々の話に見えるが、掘ると<b>答えの多くが一箇所に集まる</b>。
      </Punch>
    </section>
  )
}

function SectionWhatSlide(props: SlideRenderContext) {
  return <SectionSlide frame={props.frame} number="SECTION 1" title="そもそも、何が置かれているのか" lead="会議室端末が使っているIDの正体。" />
}

function ResourceAccountSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const facts = [
    { icon: <Mailbox size={30} />, title: 'Entraアカウント ＋ リソースメールボックス', body: 'ディレクトリ上はユーザーオブジェクト。でも人ではない' },
    { icon: <UserX size={30} />, title: '管理者が集中管理', body: 'エンドユーザーはサインインもサインアウトもできない' },
    { icon: <Lock size={30} />, title: 'Windows版はロックダウン', body: 'Teams Roomsアプリだけがアカウントを知る。Windows自身は知らない' }
  ]
  return (
    <section className="remotion-slide mex-slide">
      <Header kicker="WHAT ─ 01" title="リソースアカウントの正体" frame={frame} />
      <div className="mex-facts">
        {facts.map((f, i) => (
          <div key={f.title} style={lift(entrance(frame, fps, 16 + i * 13), 18)}>
            {f.icon}
            <div>
              <strong>{f.title}</strong>
              <span>{f.body}</span>
            </div>
          </div>
        ))}
      </div>
      <Punch frame={frame} delay={70}>
        3つ目が後で効く。<b>Windowsがアカウントを知らない</b>から、デバイス条件がそのままでは評価できない。
      </Punch>
      <SourceLine
        href="https://learn.microsoft.com/microsoftteams/rooms/rooms-authentication"
        label="Microsoft Learn ─ Authentication in Teams Rooms on Windows"
      />
    </section>
  )
}

function NotAFailureSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide mex-slide">
      <Header kicker="WHAT ─ 02" title="これは、運用の失敗ではない" frame={frame} />
      <div className="mex-versus">
        <div className="mex-versus-no" style={lift(entrance(frame, fps, 16), 22)}>
          <X size={34} />
          <strong>よくある誤解</strong>
          <p>「リソースアカウントが残っている＝ID管理ができていない」</p>
        </div>
        <div className="mex-versus-yes" style={lift(entrance(frame, fps, 36), 22)}>
          <Check size={34} />
          <strong>実際は</strong>
          <p>製品がそう作られている。IDの分類が完璧な組織でも、Teams Roomsを入れれば必ず生まれる</p>
        </div>
      </div>
      <Punch frame={frame} delay={62}>
        だから<b>「無くす」のではなく「守り方を決める」</b>のが正解になる。
      </Punch>
    </section>
  )
}

function SectionMfaSlide(props: SlideRenderContext) {
  return <SectionSlide frame={props.frame} number="SECTION 2" title="公式は「MFAをかけるな」と書いている" lead="ここが一番誤解されているところ。" />
}

function DontMfaSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const rows: [string, string, string][] = [
    ['Require MFA', '非サポート', '可。ただし「強制するな」と注記'],
    ['認証強度（FIDO2等）', '非サポート', '非サポート'],
    ['準拠デバイス', 'サポート', 'サポート'],
    ['場所 / デバイスフィルター', 'サポート', 'サポート'],
    ['認証フロー条件', 'サポート', '非サポート「ブロックするな」']
  ]
  return (
    <section className="remotion-slide mex-slide">
      <Header kicker="DON'T ─ 01" title="公式が「MFAをかけるな」と書くID" frame={frame} />
      <div className="mex-quote" style={lift(entrance(frame, fps, 12), 22)}>
        <p>
          リソースアカウントには<b>MFAの要求を承認するための第2のデバイスが無い</b>
        </p>
      </div>
      <div className="mex-table">
        <div className="mex-table-head" style={lift(entrance(frame, fps, 26), 14)}>
          <span />
          <b>Rooms on Windows</b>
          <b>Rooms on Android / パネル</b>
        </div>
        {rows.map((row, i) => (
          <div key={row[0]} className="mex-table-row" style={lift(entrance(frame, fps, 32 + i * 7), 12)}>
            <strong>{row[0]}</strong>
            <span>{row[1]}</span>
            <span>{row[2]}</span>
          </div>
        ))}
      </div>
      <SourceLine
        href="https://learn.microsoft.com/microsoftteams/rooms/supported-ca-and-compliance-policies"
        label="Microsoft Learn ─ Supported CA policies for Teams Rooms"
      />
    </section>
  )
}

function AlsoBlockSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide mex-slide">
      <Header kicker="DON'T ─ 02" title="サインイン中に操作を求めるものは全部だめ" frame={frame} />
      <div className="mex-quote" style={lift(entrance(frame, fps, 14), 22)}>
        <p>
          サインインフロー中に<b>何らかの操作を要求するポリシー</b>からも除外すべき
        </p>
      </div>
      <div className="mex-chip-row">
        {['対話型MFA', 'SSPRの認証方法登録の促し', '利用規約の同意'].map((c, i) => (
          <div key={c} className="mex-chip" style={lift(entrance(frame, fps, 36 + i * 10), 16)}>
            <X size={24} />
            <span>{c}</span>
          </div>
        ))}
      </div>
      <Alert frame={frame} delay={68} icon={<TriangleAlert size={34} />}>
        Teamsデバイスは<b>登録のプロンプトに対応していない</b>ので、サインインがブロックされる。
        MFAだけ除外して安心していると、ここで止まる。
      </Alert>
    </section>
  )
}

function SectionHowSlide(props: SlideRenderContext) {
  return <SectionSlide frame={props.frame} number="SECTION 3" title="では、何で守るのか" lead="MFAが使えないなら、代わりに何を置くのか。" />
}

function TwoFactorsSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide mex-slide">
      <Header kicker="HOW ─ 01" title="二要素相当を、別の材料で作る" frame={frame} />
      <div className="mex-quote" style={lift(entrance(frame, fps, 12), 22)}>
        <p>
          人がいないデバイスには、<b>知っているもの・持っているもの・体の特徴のうち少なくとも2つ</b>を
          満たす代替手段を使うべき
        </p>
      </div>
      <div className="mex-two">
        <div className="mex-two-card" style={lift(entrance(frame, fps, 34), 22)}>
          <KeyRound size={34} />
          <strong>知っているもの</strong>
          <span>リソースアカウントのパスワード</span>
        </div>
        <div className="mex-two-plus">+</div>
        <div className="mex-two-card mex-two-strong" style={lift(entrance(frame, fps, 48), 22)}>
          <ShieldCheck size={34} />
          <strong>持っているもの（相当）</strong>
          <span>準拠デバイス ＋ 既知のネットワーク場所</span>
        </div>
      </div>
      <Punch frame={frame} delay={72}>
        MFAという<b>実装</b>は諦める。でも<b>多要素という考え方</b>は捨てない。
      </Punch>
    </section>
  )
}

function ExamplePolicySlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const conds = [
    'リソースアカウント専用グループのメンバーであること',
    '対象は O365 / Exchange / Teams / SharePoint に限定',
    'モダン認証のみ（レガシー認証はブロック）',
    'デバイスプラットフォームは Windows または Android',
    '既知の信頼された場所から',
    '準拠デバイスであること'
  ]
  return (
    <section className="remotion-slide mex-slide">
      <Header kicker="HOW ─ 02" title="公式のサンプルポリシー" frame={frame} />
      <div className="mex-conds">
        {conds.map((c, i) => (
          <div key={c} style={lift(entrance(frame, fps, 12 + i * 8), 14)}>
            <Check size={24} />
            <span>{c}</span>
          </div>
        ))}
      </div>
      <Punch frame={frame} delay={72}>
        これを全部満たしたうえで、<b>正しいユーザー名とパスワードがあって初めて</b>サインインできる。
      </Punch>
      <SourceLine
        href="https://learn.microsoft.com/microsoftteams/rooms/conditional-access-and-compliance-for-devices"
        label="Microsoft Learn ─ Conditional Access best practices for Teams Rooms"
      />
    </section>
  )
}

function SeparatePolicySlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const steps = [
    { icon: <X size={30} />, title: '既存ポリシーからは全部除外', body: 'リソースアカウント専用のポリシーを新規に作る' },
    { icon: <ListChecks size={30} />, title: '命名規則を決める', body: '例：mtr- で始める' },
    { icon: <RefreshCw size={30} />, title: '動的グループで自動収集', body: '会議室が増えても勝手に対象になる' }
  ]
  return (
    <section className="remotion-slide mex-slide">
      <Header kicker="HOW ─ 03" title="除外リストを手で育てない" frame={frame} />
      <div className="mex-facts">
        {steps.map((s, i) => (
          <div key={s.title} style={lift(entrance(frame, fps, 16 + i * 13), 18)}>
            {s.icon}
            <div>
              <strong>{s.title}</strong>
              <span>{s.body}</span>
            </div>
          </div>
        ))}
      </div>
      <Punch frame={frame} delay={70}>
        <b>命名で自動化する。</b>ここが実務の差になる。
      </Punch>
    </section>
  )
}

function IntuneRequiredSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide mex-slide">
      <Header kicker="HOW ─ 04" title="Windows版は、Intune登録が必須" frame={frame} />
      <div className="mex-flow">
        <div className="mex-flow-node" style={lift(entrance(frame, fps, 16), 22)}>
          <Monitor size={32} />
          <strong>Teams Rooms on Windows</strong>
          <span>Windowsはリソースアカウントを知らない</span>
        </div>
        <div className="mex-flow-arrow" style={lift(entrance(frame, fps, 30), 10)}>
          <span>Intune登録</span>
          <ArrowRight size={34} />
        </div>
        <div className="mex-flow-node mex-flow-ok" style={lift(entrance(frame, fps, 42), 22)}>
          <ShieldCheck size={32} />
          <strong>準拠状態をCAへ送れる</strong>
          <span>登録済みアカウントを WAM 経由で使う</span>
        </div>
      </div>
      <Alert frame={frame} delay={64} icon={<TriangleAlert size={34} />}>
        つまり<b>準拠デバイス条件を使いたいなら、Intune登録が前提条件</b>。
      </Alert>
      <SourceLine
        href="https://learn.microsoft.com/microsoftteams/rooms/rooms-authentication"
        label="Microsoft Learn ─ Authentication in Teams Rooms on Windows"
      />
    </section>
  )
}

function SectionFlowsSlide(props: SlideRenderContext) {
  return <SectionSlide frame={props.frame} number="SECTION 4" title="ROPCとデバイスコードフローの正体" lead="ここで冒頭の3つの質問がつながる。" />
}

function RopcSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide mex-slide">
      <Header kicker="FLOWS ─ 01" title="ROPC ─ パスワードを直接渡す方式" frame={frame} />
      <div className="mex-ropc" style={lift(entrance(frame, fps, 16), 22)}>
        <div>
          <ServerCog size={30} />
          <span>アプリ</span>
        </div>
        <div className="mex-ropc-creds">ID + パスワード</div>
        <ArrowRight size={34} />
        <div>
          <ShieldCheck size={30} />
          <span>Entra ID</span>
        </div>
      </div>
      <Alert frame={frame} delay={40} icon={<TriangleAlert size={34} />}>
        ブラウザーが出てこない ＝ <b>MFAを差し込む場所がない</b>。Microsoft自身が「使うな」と警告。
      </Alert>
      <Alert frame={frame} delay={62} icon={<TriangleAlert size={34} />} tone="warn">
        <b>レガシー認証のブロックとは別物。</b>「Other clients」の定義は SMTP / IMAP4 / POP3 / EWS などの
        メール系プロトコル一覧で、ROPCは含まれない。
      </Alert>
      <SourceLine
        href="https://learn.microsoft.com/entra/identity-platform/v2-oauth-ropc"
        label="Microsoft Learn ─ Resource owner password credentials"
      />
    </section>
  )
}

function MtrUsesRopcSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide mex-slide">
      <Header kicker="FLOWS ─ 02" title="Teams Rooms on Windows は、設計上ROPCを使う" frame={frame} />
      <div className="mex-quote mex-quote-hot" style={lift(entrance(frame, fps, 14), 24)}>
        <p>
          そのモダン認証の仕組みは、OAuth 2.0の
          <b>リソースオーナーパスワードクレデンシャル（ROPC）</b>の認可付与タイプを使う
        </p>
        <cite>Microsoft Learn ─ Authentication in Teams Rooms on Windows</cite>
      </div>
      <Alert frame={frame} delay={48} icon={<TriangleAlert size={34} />}>
        だから「ROPCを使っている奴がいる」を調べると、<b>その多くがTeams Rooms</b>という話が実際に起きる。
      </Alert>
      <Punch frame={frame} delay={70}>
        そして<b>ROPCを全面的に止める施策は、Teams Roomsを止めることと同義</b>。
      </Punch>
      <SourceLine
        href="https://learn.microsoft.com/microsoftteams/rooms/rooms-authentication"
        label="Microsoft Learn ─ Authentication in Teams Rooms on Windows"
      />
    </section>
  )
}

function DeviceCodeSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide mex-slide">
      <Header kicker="FLOWS ─ 03" title="デバイスコードフロー ─ Android の Teamsデバイスが使う" frame={frame} />
      <div className="mex-two">
        <div className="mex-two-card" style={lift(entrance(frame, fps, 16), 22)}>
          <ShieldAlert size={32} />
          <strong>危険な理由</strong>
          <span>攻撃者がコードを発行し「これを入力して」と送るだけで成立。Microsoftは「可能な限りブロック」を推奨</span>
        </div>
        <div className="mex-two-plus">but</div>
        <div className="mex-two-card mex-two-need" style={lift(entrance(frame, fps, 36), 22)}>
          <Smartphone size={32} />
          <strong>Teamsデバイスは必要とする</strong>
          <span>初回登録・再プロビジョニング・一部の再認証で使う</span>
        </div>
      </div>
      <Alert frame={frame} delay={62} icon={<TriangleAlert size={34} />}>
        サポート表では Android の Teamsデバイスに対し<b>認証フロー条件そのものが非サポート</b>、
        <b>「ブロックするな」</b>と明記。ここでも全面ブロックは製品を止める。
      </Alert>
      <SourceLine
        href="https://learn.microsoft.com/entra/identity/conditional-access/policy-teams-devices-device-code-flow"
        label="Microsoft Learn ─ Restrict device code flow for Teams devices"
      />
    </section>
  )
}

function ExceptionScopeSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide mex-slide">
      <Header kicker="FLOWS ─ 04" title="例外の粒度は「機器」ではなく「アカウント」" frame={frame} />
      <div className="mex-versus">
        <div className="mex-versus-yes" style={lift(entrance(frame, fps, 14), 20)}>
          <Filter size={32} />
          <strong>CAにはデバイスフィルターがある</strong>
          <p>deviceId や拡張属性で特定の端末を指定できる。ただし<b>Entra登録済みのデバイスに限る</b></p>
        </div>
        <div className="mex-versus-no" style={lift(entrance(frame, fps, 34), 20)}>
          <X size={32} />
          <strong>例外はアカウント単位</strong>
          <p>「一つのリソースやシナリオだけに絞る方法は無い」と公式に明記</p>
        </div>
      </div>
      <Alert frame={frame} delay={62} icon={<TriangleAlert size={34} />}>
        除外されたアカウントは、ポリシーの範囲内なら<b>どのアプリに対しても</b>デバイスコードフローを使えてしまう。
        メンバーは本物のTeamsデバイスのリソースアカウントだけに限定し、監視し、所有者の承認を取る。
      </Alert>
      <SourceLine
        href="https://learn.microsoft.com/entra/identity/conditional-access/policy-teams-devices-device-code-flow"
        label="Microsoft Learn ─ Restrict device code flow for Teams devices"
      />
    </section>
  )
}

function ExceptionDesignSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const layers = [
    { n: '01', title: '既定でデバイスコードフローをブロック', body: 'ポリシーは1本' },
    { n: '02', title: 'Teamsデバイスの永続グループを除外', body: 'リソースアカウントだけ' },
    { n: '03', title: '承認済みの非Teams用途は別グループ', body: '混ぜない' },
    { n: '04', title: 'Device Registration Service を対象から除外', body: 'これを忘れるとデバイス登録自体が止まる' }
  ]
  return (
    <section className="remotion-slide mex-slide">
      <Header kicker="FLOWS ─ 05" title="例外設計は「永続グループ ＋ DRS除外」" frame={frame} />
      <div className="mex-layers">
        {layers.map((l, i) => (
          <div key={l.n} style={lift(entrance(frame, fps, 14 + i * 11), 16)}>
            <span>{l.n}</span>
            <div>
              <strong>{l.title}</strong>
              <em>{l.body}</em>
            </div>
          </div>
        ))}
      </div>
      <Alert frame={frame} delay={72} icon={<Timer size={34} />} tone="warn">
        この例外は<b>期限付きではなく永続</b>。Teamsデバイスは
        <b>パスワード変更やCAポリシー変更のたび</b>に再認証でデバイスコードフローを使うため。
      </Alert>
    </section>
  )
}

function ReportOnlyTrapSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const facts = [
    { icon: <ListChecks size={28} />, title: '評価期間中にトークン要求しないIDは出てこない', body: 'だから「該当ゼロ」に見える' },
    { icon: <Timer size={28} />, title: 'アクセストークンは既定1時間 / CAE対応なら最大28時間', body: 'その間は手元のトークンで動き続ける' },
    { icon: <RefreshCw size={28} />, title: 'ポリシー変更がリソース側へ届くまで最大24時間', body: '一部の更新は2時間まで短縮' }
  ]
  return (
    <section className="remotion-slide mex-slide">
      <Header kicker="FLOWS ─ 06" title="落とし穴：レポート専用モードの「該当なし」" frame={frame} />
      <div className="mex-facts">
        {facts.map((f, i) => (
          <div key={f.title} style={lift(entrance(frame, fps, 16 + i * 12), 18)}>
            {f.icon}
            <div>
              <strong>{f.title}</strong>
              <span>{f.body}</span>
            </div>
          </div>
        ))}
      </div>
      <Alert frame={frame} delay={60} icon={<TriangleAlert size={34} />}>
        止まるのは有効化した瞬間ではなく、<b>次のトークン要求のときから順に</b>。数日かけて出てくる。
      </Alert>
      <SourceLine
        href="https://learn.microsoft.com/entra/identity/conditional-access/concept-continuous-access-evaluation"
        label="Microsoft Learn ─ Continuous access evaluation"
      />
    </section>
  )
}

function SectionNextSlide(props: SlideRenderContext) {
  return <SectionSlide frame={props.frame} number="SECTION 5" title="そして、パスワードを消せる" lead="残る唯一の現実的なリスクに手を打つ。" />
}

function RemainingRiskSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide mex-slide">
      <Header kicker="RISK" title="残る唯一のリスクは、パスワード漏えい" frame={frame} />
      <div className="mex-facts">
        <div style={lift(entrance(frame, fps, 16), 18)}>
          <KeyRound size={30} />
          <div>
            <strong>MFAが使えない以上、IDとパスワードでサインインする</strong>
            <span>漏れれば、CAが効かない経路・場所からサインインされうる</span>
          </div>
        </div>
        <div style={lift(entrance(frame, fps, 30), 18)}>
          <ShieldCheck size={30} />
          <div>
            <strong>だから条件付きアクセスが唯一の防御線になる</strong>
            <span>ここまでの設計は、そのための設計だった</span>
          </div>
        </div>
        <div style={lift(entrance(frame, fps, 44), 18)}>
          <X size={30} />
          <div>
            <strong>しかもIntuneのパスワードポリシーは非サポート</strong>
            <span>ローカルSkypeアカウントの自動サインインを妨げるため。強度を製品側で強制できない</span>
          </div>
        </div>
      </div>
      <Punch frame={frame} delay={68}>
        つまり<b>パスワードそのものを無くせれば、この論点は消える</b>。
      </Punch>
    </section>
  )
}

function PasswordlessSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const points = [
    { icon: <ShieldCheck size={30} />, title: 'デバイスに紐づく資格情報', body: 'WindowsはTPM、AndroidはKeystoreに保管。他の端末へ移せない' },
    { icon: <KeyRound size={30} />, title: 'パスワードを削除またはスクランブル', body: '誰も知らない状態にできる' },
    { icon: <RefreshCw size={30} />, title: 'パスワードを変えてもサインアウトしない', body: '運用の耐性も上がる' }
  ]
  return (
    <section className="remotion-slide mex-slide">
      <Header kicker="PASSWORDLESS ─ 01" title="2026年、パスワードを消せるようになった" frame={frame} />
      <div className="mex-cards3">
        {points.map((p, i) => (
          <div key={p.title} style={lift(entrance(frame, fps, 16 + i * 12), 18)}>
            {p.icon}
            <strong>{p.title}</strong>
            <span>{p.body}</span>
          </div>
        ))}
      </div>
      <Punch frame={frame} delay={64}>
        公式は<b>「仕組みとしてはWindows Hello for Businessに近い」</b>と説明している。
      </Punch>
      <SourceLine
        href="https://learn.microsoft.com/microsoftteams/rooms/passwordlessentraresourceaccounts"
        label="Microsoft Learn ─ Password-less Teams shared device resource accounts"
      />
    </section>
  )
}

function PasswordlessCaveatsSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const caveats = [
    'Teams Rooms ライセンス ＋ Pro Management Portal に見えていること',
    'Windows版は Windows 11 24H2 以降かつ Entra参加（ハイブリッド参加は非対応）',
    '移行は管理者が手動で開始。新規をいきなりパスワードレス展開はまだ不可',
    '初期化・手動サインアウトで資格情報は失われ、パスワードからやり直し',
    'Crestron製のWindowsデバイスは現時点で非互換'
  ]
  return (
    <section className="remotion-slide mex-slide">
      <Header kicker="PASSWORDLESS ─ 02" title="ただし、前提は重い" frame={frame} />
      <div className="mex-conds mex-conds-warn">
        {caveats.map((c, i) => (
          <div key={c} style={lift(entrance(frame, fps, 12 + i * 9), 14)}>
            <TriangleAlert size={24} />
            <span>{c}</span>
          </div>
        ))}
      </div>
      <Punch frame={frame} delay={72}>
        それでも<b>唯一の残存リスクを構造的に消せる</b>ので、検討する価値がある。
      </Punch>
      <SourceLine
        href="https://learn.microsoft.com/microsoftteams/rooms/passwordlessentraresourceaccounts"
        label="Microsoft Learn ─ Password-less Teams shared device resource accounts"
      />
    </section>
  )
}

function RecapSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const items = [
    ['01', 'MFAをかけないのは妥協ではなく公式設計', '承認する第2デバイスが無い。Windows版はCAのRequire MFA自体が非サポート'],
    ['02', '代わりに準拠デバイス ＋ 既知の場所で二要素相当を作る', '除外グループに放り込むのとは別物。専用ポリシーを当てる'],
    ['03', 'ROPCとデバイスコードフローは製品が正規に使う', '全面ブロックは製品を止める。例外はアカウント単位で永続管理']
  ]
  return (
    <section className="remotion-slide mex-slide">
      <Header kicker="RECAP" title="覚えるのは、この3つ" frame={frame} />
      <div className="mex-recap">
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

function RelatedDecksSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const decks = [
    { slug: 'mfa-service-identity', title: 'サービスIDの棚卸しと移行', note: '人のIDで動く自動化を見つけて、ワークロードIDへ移す' },
    { slug: 'phishing-resistant-mfa', title: 'そのMFA、中継されて終わりです', note: '人にどうMFAをかけるか。フィッシング耐性とは何か' }
  ]
  return (
    <section className="remotion-slide mex-slide">
      <Header kicker="RELATED" title="関連するスライド" frame={frame} />
      <div className="mex-decks">
        {decks.map((d, i) => (
          <a
            key={d.slug}
            href={`https://presentations.ebisuda.net/decks/${d.slug}`}
            target="_blank"
            rel="noreferrer"
            style={lift(entrance(frame, fps, 18 + i * 14), 22)}
          >
            <ClipboardList size={34} />
            <strong>{d.title}</strong>
            <span>{d.note}</span>
          </a>
        ))}
      </div>
      <Punch frame={frame} delay={60}>
        3枚で1セットです。<b>今日は「機器」、他の2枚は「自動化」と「人」</b>。
      </Punch>
    </section>
  )
}

function RelatedVideosSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const videos = [
    { id: 'CGEWsDgdFvk', title: '認証パターンを基礎から理解', note: 'SP・マネージドID・トークンの全体像' },
    { id: 'u3DmYibZgwE', title: '条件付きアクセス「全リソース＋除外」の挙動', note: '除外設計の落とし穴' },
    { id: 'n2RodbBpzeo', title: 'なぜアプリにもIDが必要？', note: 'アプリ登録と権限・同意の基礎' }
  ]
  return (
    <section className="remotion-slide mex-slide">
      <Header kicker="GO DEEPER" title="関連する解説動画" frame={frame} />
      <div className="mex-video-list">
        {videos.map((video, i) => (
          <a
            key={video.id}
            className="mex-video-row"
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
    <section className="remotion-slide mex-slide mex-ebistudy">
      <Header kicker="EBI STUDY" title="体系的に、順番に学びたい方へ" frame={frame} />
      <div className="mex-course-row">
        {courses.map((course, i) => (
          <a
            key={course.path}
            className="mex-course-card"
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
    ['Teams Rooms on Windows の認証', 'https://learn.microsoft.com/microsoftteams/rooms/rooms-authentication'],
    ['Teams Rooms の条件付きアクセス ベストプラクティス', 'https://learn.microsoft.com/microsoftteams/rooms/conditional-access-and-compliance-for-devices'],
    ['Teams Rooms のサポート対象CAポリシー', 'https://learn.microsoft.com/microsoftteams/rooms/supported-ca-and-compliance-policies'],
    ['Teamsデバイスのデバイスコードフロー制限', 'https://learn.microsoft.com/entra/identity/conditional-access/policy-teams-devices-device-code-flow'],
    ['パスワードレス リソースアカウント', 'https://learn.microsoft.com/microsoftteams/rooms/passwordlessentraresourceaccounts']
  ]
  return (
    <section className="remotion-slide mex-slide">
      <Header kicker="REFERENCES" title="出典" frame={frame} />
      <div className="mex-source-list">
        {sources.map(([label, href], i) => (
          <a key={href} href={href} target="_blank" rel="noreferrer" style={lift(entrance(frame, fps, 12 + i * 9), 14)}>
            <strong>{label}</strong>
            <span>{href.replace('https://', '')}</span>
          </a>
        ))}
      </div>
      <Punch frame={frame} delay={68}>
        設定を変える前に、<b>必ず最新の公式ドキュメント</b>を確認してください。
      </Punch>
    </section>
  )
}

function ThanksSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide mex-slide mex-thanks">
      <div className="mex-grid-bg" />
      <div style={lift(entrance(frame, fps), 34)}>
        <ThumbsUp size={78} />
        <h1>ご視聴ありがとうございました！</h1>
        <p>高評価・チャンネル登録をお願いします。</p>
      </div>
    </section>
  )
}
