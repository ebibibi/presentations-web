/* eslint-disable react-refresh/only-export-components */
import {
  ArrowRight,
  AppWindow,
  Bot,
  Building2,
  CheckCircle2,
  CircleAlert,
  Cloud,
  Database,
  Fingerprint,
  Globe2,
  KeyRound,
  Search,
  ShieldCheck,
  TicketCheck,
  User,
  Waypoints
} from 'lucide-react'
import { spring, useVideoConfig } from 'remotion'
import { LogoMark } from '../../../src/deck-shared'
import type { SlideModule, SlideRenderContext } from '../../../src/types'

export const slides: SlideModule['slides'] = [
  { render: (props) => <OpeningSlide {...props} /> },
  { render: (props) => <PreviousFocusSlide {...props} /> },
  { render: (props) => <MissingQuestionSlide {...props} /> },
  { render: (props) => <TokenFlowSlide {...props} /> },
  { render: (props) => <ThreeIdentifiersSlide {...props} /> },
  { render: (props) => <WhyCoreSlide {...props} /> },
  { render: (props) => <ArmTwoUrlsSlide {...props} /> },
  { render: (props) => <TwoPlanesSlide {...props} /> },
  { render: (props) => <SearchAnswerSlide {...props} /> },
  { render: (props) => <SearchFlowSlide {...props} /> },
  { render: (props) => <TroubleshootingSlide {...props} /> },
  { render: (props) => <RecapSlide {...props} /> }
]

const SOURCES = {
  connector: 'https://learn.microsoft.com/ja-jp/connectors/custom-connectors/azure-active-directory-authentication',
  token: 'https://learn.microsoft.com/en-us/entra/identity-platform/access-tokens',
  claims: 'https://learn.microsoft.com/en-us/entra/identity-platform/access-token-claims-reference',
  managedIdentity: 'https://learn.microsoft.com/en-us/entra/identity/managed-identities-azure-resources/how-to-use-vm-token',
  rest: 'https://learn.microsoft.com/en-us/rest/api/gettingstarted/',
  search: 'https://learn.microsoft.com/en-us/azure/search/search-get-started-rbac',
  searchRest: 'https://learn.microsoft.com/en-us/rest/api/searchservice/documents/search-get',
  searchRbac: 'https://learn.microsoft.com/en-us/azure/search/keyless-connections'
}

function entrance(frame: number, fps: number, delay = 0) {
  return spring({ frame: frame - delay, fps, config: { damping: 18, stiffness: 105 } })
}

function lift(value: number, distance = 28) {
  return { opacity: value, transform: `translateY(${(1 - value) * distance}px)` }
}

function Header({ kicker, title, frame }: { kicker: string; title: React.ReactNode; frame: number }) {
  const { fps } = useVideoConfig()
  return <header className="mi-head" style={lift(entrance(frame, fps), 24)}><span>{kicker}</span><h1>{title}</h1></header>
}

function Source({ href, children }: { href: string; children: React.ReactNode }) {
  return <a className="mi-source" href={href} target="_blank" rel="noreferrer">Microsoft Learn · {children}</a>
}

function OpeningSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide mi-slide mi-opening">
      <div className="mi-grid" /><LogoMark className="mi-logo" />
      <div className="mi-opening-copy" style={lift(entrance(frame, fps), 44)}>
        <span>M365 APP REGISTRATION · FOLLOW-UP</span>
        <h1>リソースURLって、<br /><em>何のURL？</em></h1>
        <p>前回の「誰が使う？」から<br />今回の「どのAPI向け？」へ</p>
      </div>
      <div className="mi-opening-ticket" style={lift(entrance(frame, fps, 26), 34)}>
        <TicketCheck size={82} />
        <small>ACCESS TOKEN</small>
        <strong>宛名：誰向け？</strong>
        <code>aud = ...</code>
      </div>
      <Source href={SOURCES.connector}>API とコネクタを認証する</Source>
    </section>
  )
}

function PreviousFocusSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide mi-slide">
      <Header kicker="PREVIOUS EPISODE" title="前回は「呼び出す側」を整理した" frame={frame} />
      <div className="mi-previous-paths">
        <div style={lift(entrance(frame, fps, 18), 24)}>
          <span>USER DELEGATION</span>
          <div className="mi-identity-icons"><User /><b>＋</b><AppWindow /></div>
          <strong>ユーザーがアプリを使う</strong>
          <p>アプリがユーザーの代理でAPIを呼ぶ</p>
        </div>
        <div style={lift(entrance(frame, fps, 36), 24)}>
          <span>APP-ONLY</span>
          <div className="mi-identity-icons"><Bot /><b>／</b><Fingerprint /></div>
          <strong>アプリ／Azureリソース自身</strong>
          <p>アプリ登録＋資格情報、またはManaged Identity</p>
        </div>
      </div>
      <div className="mi-previous-answer" style={lift(entrance(frame, fps, 68), 16)}><CheckCircle2 /><span>Application IDが必要な理由</span><strong>どのソフトウェアが接続するかを区別するため</strong></div>
      <a className="mi-source" href="/decks/m365-app-registration-guide">前回資料 · M365アプリ登録入門</a>
    </section>
  )
}

function MissingQuestionSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const cards = [
    [<Fingerprint />, '呼び出す主体', 'ユーザー＋アプリ／アプリ自身', '前回'],
    [<TicketCheck />, 'Resource URL', 'どのAPI向けのトークン？', '今回'],
    [<ShieldCheck />, 'Permission / RBAC', 'その主体に何を許す？', '権限']
  ]
  return (
    <section className="remotion-slide mi-slide mi-concept">
      <Header kicker="ONE MORE QUESTION" title={<>呼び出す側とは別に、<em>受け取るAPI</em>を決める</>} frame={frame} />
      <div className="mi-concept-row">{cards.map(([icon, title, body, analogy], i) => <div key={String(title)} style={lift(entrance(frame, fps, 20 + i * 14), 24)}>{icon}<span>{analogy}</span><strong>{title}</strong><p>{body}</p></div>)}</div>
      <p className="mi-punch">Resource URL ＝ <strong>アクセストークンの受取人（audience）</strong></p>
      <Source href={SOURCES.token}>Access tokens</Source>
    </section>
  )
}

function TokenFlowSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const steps = [
    [<Fingerprint />, '呼び出し元', 'resourceを指定'],
    [<Cloud />, 'Microsoft Entra ID', 'トークンを発行'],
    [<TicketCheck />, 'Access token', 'audに対象が入る'],
    [<ShieldCheck />, '対象API', 'audを検証']
  ]
  return (
    <section className="remotion-slide mi-slide">
      <Header kicker="TOKEN FLOW" title={<><code>resource</code> が <code>aud</code> になるまで</>} frame={frame} />
      <div className="mi-flow">{steps.map(([icon, title, body], i) => <div className="mi-flow-unit" key={String(title)} style={lift(entrance(frame, fps, 16 + i * 13), 22)}>{icon}<strong>{title}</strong><span>{body}</span>{i < steps.length - 1 ? <ArrowRight className="mi-arrow" /> : null}</div>)}</div>
      <div className="mi-code-band" style={lift(entrance(frame, fps, 76), 16)}><code>request: resource=https://search.azure.com</code><ArrowRight /><code>token: "aud": "https://search.azure.com"</code></div>
      <Source href={SOURCES.managedIdentity}>Managed identity token request</Source>
    </section>
  )
}

function ThreeIdentifiersSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const cards = [
    [<Globe2 />, 'API endpoint', '実際の通信先', 'https://<service>.search.windows.net'],
    [<TicketCheck />, 'audience / resource', 'トークンの受取人', 'https://search.azure.com'],
    [<Building2 />, 'Azure resource ID', '管理対象の住所', '/subscriptions/.../Microsoft.Search/...']
  ]
  return (
    <section className="remotion-slide mi-slide">
      <Header kicker="THREE IDENTIFIERS" title="Azure AI Searchで並べると、こうなる" frame={frame} />
      <div className="mi-id-cards">{cards.map(([icon, title, body, value], i) => <div key={String(title)} style={lift(entrance(frame, fps, 18 + i * 13), 24)}>{icon}<strong>{title}</strong><span>{body}</span><code>{value}</code></div>)}</div>
      <p className="mi-punch">3つが違っていて、<strong>正常。</strong></p>
      <Source href={SOURCES.search}>Connect to Azure AI Search using roles</Source>
    </section>
  )
}

function WhyCoreSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide mi-slide mi-arm-slide">
      <Header kicker="THE LEARN PAGE" title="なぜ management.core.windows.net？" frame={frame} />
      <div className="mi-learn-card" style={lift(entrance(frame, fps, 20), 26)}><span>このLearnがやっていること</span><Building2 size={70} /><strong>Azure Resource Manager API</strong><code>List all subscriptions</code></div>
      <ArrowRight className="mi-big-arrow" />
      <div className="mi-answer-card" style={lift(entrance(frame, fps, 42), 26)}><TicketCheck size={62} /><span>だからResource URLも</span><code>https://management.core.windows.net/</code><b>ARMを表す識別子</b></div>
      <p className="mi-warning">Azure全サービス共通の値ではない。</p>
      <Source href={SOURCES.connector}>Custom connector tutorial</Source>
    </section>
  )
}

function ArmTwoUrlsSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide mi-slide">
      <Header kicker="ARM HAS HISTORY" title="ARMでも、複数のURLが見える" frame={frame} />
      <div className="mi-arm-compare">
        <div style={lift(entrance(frame, fps, 18), 22)}><span>質問のコネクタ手順</span><strong>Resource URL</strong><code>management.core.windows.net/</code><small>末尾スラッシュまで正確に</small></div>
        <div style={lift(entrance(frame, fps, 34), 22)}><span>ARM REST APIの通信先</span><strong>Endpoint</strong><code>management.azure.com/</code><small>実際にHTTP要求を送る</small></div>
        <div style={lift(entrance(frame, fps, 50), 22)}><span>現在のManaged ID例</span><strong>Resource</strong><code>management.azure.com/</code><small>認証方式・公式手順に従う</small></div>
      </div>
      <div className="mi-dont-rewrite"><CircleAlert /><b>似ていても自己判断で置換しない。</b><span>対象の操作・認証方式・クラウドの最新公式値を使う。</span></div>
      <Source href={SOURCES.rest}>Azure REST API reference</Source>
    </section>
  )
}

function TwoPlanesSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide mi-slide">
      <Header kicker="FIRST QUESTION" title="何をしたい？ 管理か、データ利用か" frame={frame} />
      <div className="mi-plane-grid">
        <div className="mi-plane-management" style={lift(entrance(frame, fps, 20), 26)}><Building2 size={70} /><span>MANAGEMENT PLANE</span><strong>Searchサービスを作る・設定する</strong><code>management.azure.com</code><p>Azure Resource Managerのロール</p></div>
        <div className="mi-plane-data" style={lift(entrance(frame, fps, 38), 26)}><Search size={70} /><span>DATA PLANE</span><strong>インデックスを検索する</strong><code>&lt;service&gt;.search.windows.net</code><p>Searchのデータロール</p></div>
      </div>
      <p className="mi-punch">操作が違えば、<strong>宛名も権限も違う。</strong></p>
    </section>
  )
}

function SearchAnswerSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const rows = [
    ['audience / resource', 'https://search.azure.com', 'トークンの宛名'],
    ['v2 scope', 'https://search.azure.com/.default', 'MSAL・Azure CLIなど'],
    ['API endpoint', 'https://<service>.search.windows.net', '実際の通信先']
  ]
  return (
    <section className="remotion-slide mi-slide mi-search-answer">
      <Header kicker="AZURE AI SEARCH · DATA PLANE" title="使う値は、この対応表" frame={frame} />
      <div className="mi-value-table">{rows.map(([label, value, note], i) => <div key={label} style={lift(entrance(frame, fps, 18 + i * 14), 22)}><span>{label}</span><code>{value}</code><small>{note}</small></div>)}</div>
      <div className="mi-correct"><CheckCircle2 /><strong>違う文字列でOK。</strong><span>それぞれ別の役割を持つ。</span></div>
      <Source href={SOURCES.searchRest}>Search Documents REST API</Source>
    </section>
  )
}

function SearchFlowSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide mi-slide">
      <Header kicker="MINIMUM WORKFLOW" title="SearchをマネージドIDで呼ぶ" frame={frame} />
      <div className="mi-search-flow">
        <div style={lift(entrance(frame, fps, 16), 20)}><Fingerprint /><strong>Managed Identity</strong><span>Search向けtokenを要求</span></div><ArrowRight />
        <div style={lift(entrance(frame, fps, 30), 20)}><TicketCheck /><strong>Bearer token</strong><code>aud: search.azure.com</code></div><ArrowRight />
        <div style={lift(entrance(frame, fps, 44), 20)}><Database /><strong>Search endpoint</strong><span>検索APIへ送信</span></div>
      </div>
      <div className="mi-rbac-row" style={lift(entrance(frame, fps, 66), 18)}><KeyRound /><span>さらに必要</span><strong>Search Index Data Reader</strong><small>など、操作に合う最小限のRBACロール</small></div>
      <p className="mi-punch">正しい宛名 ＋ 正しい権限 ＝ アクセス成功</p>
      <Source href={SOURCES.search}>Search RBAC quickstart</Source>
    </section>
  )
}

function TroubleshootingSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const checks = [
    ['01', '操作', '管理プレーン？ データプレーン？'],
    ['02', 'aud', '対象APIの期待値と完全一致？'],
    ['03', 'endpoint', '個別サービスの通信先？'],
    ['04', 'RBAC', 'ロール・対象範囲・反映待ち？']
  ]
  return (
    <section className="remotion-slide mi-slide">
      <Header kicker="TROUBLESHOOT IN ORDER" title="401 / 403を、順番に切り分ける" frame={frame} />
      <div className="mi-check-grid">{checks.map(([num, title, body], i) => <div key={num} style={lift(entrance(frame, fps, 16 + i * 11), 20)}><span>{num}</span><strong>{title}</strong><p>{body}</p></div>)}</div>
      <div className="mi-error-hints"><div><b>401のヒント</b><span>トークン・aud・認証を確認</span></div><div><b>403のヒント</b><span>ロールとスコープを確認</span></div></div>
      <p className="mi-footnote">ステータスコードだけで断定せず、実際のエラー本文を優先。RBAC反映には時間がかかる場合あり。</p>
      <Source href={SOURCES.searchRbac}>Troubleshoot role-based access</Source>
    </section>
  )
}

function RecapSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const points = [
    ['WHO', '誰が／どのアプリが？', 'ユーザー委任 or アプリ単独'],
    ['FOR WHOM', 'どのAPI向け？', 'resource / audience'],
    ['WHAT', '何を許す？', 'Permission / RBAC']
  ]
  return (
    <section className="remotion-slide mi-slide mi-recap">
      <div className="mi-recap-head" style={lift(entrance(frame, fps), 34)}><LogoMark className="mi-recap-logo" /><span>TAKEAWAY</span><h1>3つの問いを、<br /><em>混ぜない。</em></h1></div>
      <div className="mi-recap-points">{points.map(([tag, title, value], i) => <div key={tag} style={lift(entrance(frame, fps, 22 + i * 13), 22)}><span>{tag}</span><strong>{title}</strong><code>{value}</code></div>)}</div>
      <div className="mi-final-answer" style={lift(entrance(frame, fps, 72), 18)}><Waypoints /><strong>前回はWHO。今回はFOR WHOM。</strong><span>Learnの値は、そのページがARM向けトークンを要求するから。</span></div>
    </section>
  )
}
