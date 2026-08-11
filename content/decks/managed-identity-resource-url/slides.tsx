/* eslint-disable react-refresh/only-export-components */
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  Cloud,
  Code2,
  Database,
  Fingerprint,
  Globe2,
  KeyRound,
  Mail,
  MessageCircleQuestion,
  ShieldCheck,
  TicketCheck,
  User
} from 'lucide-react'
import { spring, useVideoConfig } from 'remotion'
import { LogoMark } from '../../../src/deck-shared'
import type { SlideModule, SlideRenderContext } from '../../../src/types'

export const slides: SlideModule['slides'] = [
  { render: (props) => <OpeningSlide {...props} /> },
  { render: (props) => <ViewerQuestionSlide {...props} /> },
  { render: (props) => <AcquisitionInterfacesSlide {...props} /> },
  { render: (props) => <RecommendedPathSlide {...props} /> },
  { render: (props) => <GraphBridgeSlide {...props} /> },
  { render: (props) => <ThreeVersionsSlide {...props} /> },
  { render: (props) => <IdentifierEndpointSlide {...props} /> },
  { render: (props) => <ServiceMapSlide {...props} /> },
  { render: (props) => <ManagedIdentityFlowSlide {...props} /> },
  { render: (props) => <RecapSlide {...props} /> }
]

const SOURCES = {
  connector: 'https://learn.microsoft.com/ja-jp/connectors/custom-connectors/azure-active-directory-authentication',
  scopes: 'https://learn.microsoft.com/en-us/entra/identity-platform/scopes-oidc',
  tokens: 'https://learn.microsoft.com/en-us/entra/identity-platform/access-tokens',
  appServiceMi: 'https://learn.microsoft.com/en-us/azure/app-service/overview-managed-identity',
  search: 'https://learn.microsoft.com/ja-jp/azure/search/search-get-started-rbac',
  graphMessages: 'https://learn.microsoft.com/en-us/graph/api/user-list-messages',
  msalMigration: 'https://learn.microsoft.com/ja-jp/entra/identity-platform/msal-migration',
  resourceIndicators: 'https://datatracker.ietf.org/doc/html/rfc8707#section-2'
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
  return <a className="mi-source" href={href} target="_blank" rel="noreferrer">Source · {children}</a>
}

function OpeningSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide mi-slide mi-opening">
      <div className="mi-grid" /><LogoMark className="mi-logo" />
      <div className="mi-opening-copy" style={lift(entrance(frame, fps), 44)}>
        <span>M365 APP REGISTRATION · FOLLOW-UP</span>
        <h1><code>resource</code> と<br /><em><code>scope</code></em> を混ぜない</h1>
        <p>Entra ID v1 / v2 と<br />実際のAPI endpointを整理する</p>
      </div>
      <div className="mi-opening-ticket mi-opening-versions" style={lift(entrance(frame, fps, 26), 34)}>
        <TicketCheck size={74} />
        <small>TOKEN REQUEST</small>
        <code>v1 → resource</code>
        <code>v2 → scope</code>
      </div>
      <Source href={SOURCES.scopes}>Microsoft identity platform scopes</Source>
    </section>
  )
}

function ViewerQuestionSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide mi-slide mi-viewer-question">
      <Header kicker="VIEWER QUESTION" title="今回、こんな質問をいただきました" frame={frame} />
      <div className="mi-question-quote" style={lift(entrance(frame, fps, 18), 28)}>
        <MessageCircleQuestion />
        <blockquote>
          <code>Resource URL = management.core.windows.net</code><br />
          なのに、実際は <code>management.azure.com</code> へ投げる。<br />
          なぜ同じURLではないの？
        </blockquote>
      </div>
      <div className="mi-question-followup mi-question-followup-two" style={lift(entrance(frame, fps, 52), 18)}>
        <strong>Searchでは <code>resource</code> と <code>scope</code> の両方が出てくる？</strong>
        <strong>Azure AI Searchが2種類のAPIを持っている？</strong>
      </div>
      <Source href={SOURCES.connector}>API とコネクタを認証する</Source>
    </section>
  )
}

function AcquisitionInterfacesSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const cards = [
    ['ENTRA v1', '/oauth2/token', 'resource=', '旧方式・既存互換'],
    ['ENTRA v2', '/oauth2/v2.0/token', 'scope=.../.default', '現在の方式'],
    ['MANAGED IDENTITY BROKER', 'IDENTITY_ENDPOINT / IMDS', 'resource=', 'ブローカーAPIの契約']
  ]
  return (
    <section className="remotion-slide mi-slide">
      <Header kicker="FIRST, SEPARATE THESE" title={<>同じ <code>resource</code> でも、入口が違う</>} frame={frame} />
      <div className="mi-interface-cards">
        {cards.map(([tag, endpoint, parameter, note], i) => <div key={tag} className={i === 1 ? 'is-current' : ''} style={lift(entrance(frame, fps, 18 + i * 13), 24)}><span>{tag}</span><strong>{endpoint}</strong><code>{parameter}</code><small>{note}</small></div>)}
      </div>
      <div className="mi-interface-answer" style={lift(entrance(frame, fps, 68), 16)}><CircleXMark /><strong>Search APIが3種類あるわけではない。</strong><span>違うのは、トークン取得インターフェース。</span></div>
      <Source href={SOURCES.appServiceMi}>App Service managed identity REST endpoint</Source>
    </section>
  )
}

function CircleXMark() {
  return <span className="mi-x-mark">×</span>
}

function RecommendedPathSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide mi-slide">
      <Header kicker="FOR NEW DEVELOPMENT" title="今から作るなら、SDK ＋ v2を基本に" frame={frame} />
      <div className="mi-path-main" style={lift(entrance(frame, fps, 18), 28)}>
        <Code2 /><div><span>第一選択</span><strong>Search SDKへ <code>DefaultAzureCredential</code> を渡す</strong><p>SDKがトークン取得方式の違いを吸収する</p></div>
      </div>
      <div className="mi-path-options">
        <div style={lift(entrance(frame, fps, 42), 22)}><Cloud /><span>v2へ直接HTTP</span><code>scope=https://search.azure.com/.default</code></div>
        <div style={lift(entrance(frame, fps, 56), 22)}><Fingerprint /><span>生のManaged ID API</span><code>resource=https://search.azure.com</code><small>そのAPIの仕様に従う</small></div>
      </div>
      <p className="mi-punch">自作コードかSDKかではなく、<strong>どのトークン取得APIを使うか</strong>で決まる。</p>
      <Source href={SOURCES.msalMigration}>Migrate applications to MSAL</Source>
    </section>
  )
}

function GraphBridgeSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide mi-slide">
      <Header kicker="CONNECT TO THE PREVIOUS EPISODE" title="前回のGraphメール取得も、同じ構造" frame={frame} />
      <div className="mi-graph-v2-grid">
        <div style={lift(entrance(frame, fps, 18), 22)}><User /><span>WHO · ユーザー委任</span><strong>本人のメールを読む</strong><code>scope=Mail.Read</code></div>
        <div style={lift(entrance(frame, fps, 32), 22)}><Bot /><span>WHO · アプリ単独</span><strong>アプリ自身で呼ぶ</strong><code>scope=https://graph.microsoft.com/.default</code></div>
        <div className="mi-graph-endpoint" style={lift(entrance(frame, fps, 46), 22)}><Mail /><span>実際の通信先</span><code>GET graph.microsoft.com/v1.0/me/messages</code></div>
      </div>
      <div className="mi-version-warning" style={lift(entrance(frame, fps, 70), 14)}><strong>Graphの <code>/v1.0</code> ≠ Entra OAuth v1</strong><span>これはGraph REST APIのバージョン。</span></div>
      <Source href={SOURCES.graphMessages}>Microsoft Graph · List messages</Source>
    </section>
  )
}

function ThreeVersionsSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const rows = [
    ['TOKEN REQUEST', 'Entra OAuth endpoint', '/oauth2/token ↔ /oauth2/v2.0/token'],
    ['TOKEN FORMAT', 'Access token の ver', '"ver": "1.0" / "2.0"'],
    ['API REQUEST', '呼び出し先APIのversion', 'Graph /v1.0 · Search api-version=...']
  ]
  return (
    <section className="remotion-slide mi-slide">
      <Header kicker="THREE DIFFERENT VERSIONS" title="v1 / v2という言葉も、3種類ある" frame={frame} />
      <div className="mi-version-rows">{rows.map(([tag, title, value], i) => <div key={tag} style={lift(entrance(frame, fps, 18 + i * 14), 20)}><span>{tag}</span><strong>{title}</strong><code>{value}</code></div>)}</div>
      <div className="mi-token-version-note" style={lift(entrance(frame, fps, 68), 16)}><ShieldCheck /><strong>v2 endpointへ要求しても、<code>ver: 1.0</code> のtokenはあり得る。</strong><span>token形式は受け取るAPI側が決める。</span></div>
      <Source href={SOURCES.tokens}>Access token versions</Source>
    </section>
  )
}

function IdentifierEndpointSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide mi-slide">
      <Header kicker="IDENTITY ≠ LOCATION" title="トークンの対象と、HTTP送信先は別" frame={frame} />
      <div className="mi-uri-compare">
        <div style={lift(entrance(frame, fps, 18), 24)}><Fingerprint /><span>RESOURCE / SCOPE</span><strong>APIの固有名</strong><code>token の audience</code><small>どのAPI向けのtokenか</small></div>
        <div style={lift(entrance(frame, fps, 34), 24)}><Globe2 /><span>ENDPOINT URL</span><strong>HTTP通信の入口</strong><code>GET https://host/path</code><small>実際にBearer tokenを送る先</small></div>
      </div>
      <div className="mi-multitenant-answer" style={lift(entrance(frame, fps, 66), 14)}><b>マルチテナントだから？</b><strong>主因ではない。</strong><span>URIを「場所」ではなく、衝突しにくい「名前」として使っている。</span></div>
      <Source href={SOURCES.resourceIndicators}>RFC 8707 · Resource Indicators</Source>
    </section>
  )
}

function ServiceMapSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const rows = [
    ['Microsoft Graph', 'https://graph.microsoft.com/.default', 'https://graph.microsoft.com/v1.0/...'],
    ['ARM · 質問のLearn', 'https://management.core.windows.net/', 'https://management.azure.com/...'],
    ['Azure AI Search', 'https://search.azure.com/.default', 'https://<service>.search.windows.net/...']
  ]
  return (
    <section className="remotion-slide mi-slide">
      <Header kicker="RESOURCE TARGET vs ENDPOINT" title="同じに見える場合も、違う場合もある" frame={frame} />
      <div className="mi-service-table">
        <div className="mi-service-head"><span>サービス</span><span>トークンの対象</span><span>実際のHTTP送信先</span></div>
        {rows.map(([service, target, endpoint], i) => <div key={service} style={lift(entrance(frame, fps, 18 + i * 14), 20)}><strong>{service}</strong><code>{target}</code><code>{endpoint}</code></div>)}
      </div>
      <p className="mi-punch">URLの見た目ではなく、<strong>フィールドの役割</strong>で読む。</p>
      <Source href={SOURCES.connector}>Custom connector tutorial</Source>
    </section>
  )
}

function ManagedIdentityFlowSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide mi-slide">
      <Header kicker="AZURE AI SEARCH · PRACTICAL FLOW" title="Managed IdentityでSearchを呼ぶ" frame={frame} />
      <div className="mi-search-flow mi-search-flow-four">
        <div style={lift(entrance(frame, fps, 14), 20)}><Code2 /><strong>Search SDK</strong><span>DefaultAzureCredential</span></div><ArrowRight />
        <div style={lift(entrance(frame, fps, 28), 20)}><Fingerprint /><strong>Managed Identity</strong><span>Search向けtokenを取得</span></div><ArrowRight />
        <div style={lift(entrance(frame, fps, 42), 20)}><TicketCheck /><strong>Bearer token</strong><span>対象はSearch API</span></div><ArrowRight />
        <div style={lift(entrance(frame, fps, 56), 20)}><Database /><strong>Search endpoint</strong><code>&lt;service&gt;.search.windows.net</code></div>
      </div>
      <div className="mi-rbac-row mi-rbac-row-compact" style={lift(entrance(frame, fps, 72), 18)}><KeyRound /><span>別途必要</span><strong>Search Index Data Reader などのRBAC</strong><small>宛名と権限は別問題</small></div>
      <Source href={SOURCES.search}>Azure AI Search · RBAC quickstart</Source>
    </section>
  )
}

function RecapSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const points = [
    ['ENTRA v1', '/oauth2/token', 'resource=...'],
    ['ENTRA v2', '/oauth2/v2.0/token', 'scope=.../.default'],
    ['MANAGED IDENTITY', 'local broker API', 'resource=... が残る'],
    ['HTTP REQUEST', 'service endpoint', 'Bearer tokenを送る先']
  ]
  return (
    <section className="remotion-slide mi-slide mi-recap mi-recap-v2">
      <div className="mi-recap-head" style={lift(entrance(frame, fps), 34)}><LogoMark className="mi-recap-logo" /><span>TAKEAWAY</span><h1>名前が似ても、<br /><em>層を分ける。</em></h1></div>
      <div className="mi-recap-points mi-recap-points-four">{points.map(([tag, title, value], i) => <div key={tag} style={lift(entrance(frame, fps, 18 + i * 11), 20)}><span>{tag}</span><strong>{title}</strong><code>{value}</code></div>)}</div>
      <div className="mi-final-answer" style={lift(entrance(frame, fps, 74), 16)}><CheckCircle2 /><strong>新規開発はAzure SDK＋DefaultAzureCredentialを第一選択。</strong><span>v1/v2、tokenのver、API version、endpointを混ぜない。</span></div>
    </section>
  )
}
