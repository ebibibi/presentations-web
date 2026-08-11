/* eslint-disable react-refresh/only-export-components */
import {
  ArrowRight,
  Bell,
  BookOpen,
  ChevronRight,
  Database,
  Fingerprint,
  Globe2,
  KeyRound,
  MessageCircleQuestion,
  Play,
  Send,
  Shield,
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
  { render: (props) => <GraphBridgeSlide {...props} /> },
  { render: (props) => <IdentifierEndpointSlide {...props} /> },
  { render: (props) => <ServiceMapSlide {...props} /> },
  { render: (props) => <EndToEndFlowSlide {...props} /> },
  { render: (props) => <PromoSlide {...props} /> }
]

const SOURCES = {
  connector: 'https://learn.microsoft.com/ja-jp/connectors/custom-connectors/azure-active-directory-authentication',
  scopes: 'https://learn.microsoft.com/en-us/entra/identity-platform/scopes-oidc',
  graphMessages: 'https://learn.microsoft.com/en-us/graph/api/user-list-messages',
  searchAuth: 'https://learn.microsoft.com/ja-jp/azure/search/search-get-started-rbac',
  resourceIndicators: 'https://datatracker.ietf.org/doc/html/rfc8707#section-2',
  tokenClaims: 'https://learn.microsoft.com/en-us/entra/identity-platform/access-token-claims-reference'
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
        <h1>どのAPIを<br /><em>たたくのか？</em></h1>
        <p>「誰が使うのか？」の次に<br />意識したいこと</p>
      </div>
      <div className="mi-opening-ticket mi-opening-versions" style={lift(entrance(frame, fps, 26), 34)}>
        <TicketCheck size={74} />
        <small>RESOURCE URL</small>
        <strong>どのAPI向けの<br />トークンか？</strong>
      </div>
      <Source href={SOURCES.connector}>Microsoft Learn · API とコネクタを認証する</Source>
    </section>
  )
}

function ViewerQuestionSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide mi-slide mi-viewer-question">
      <Header kicker="VIEWER QUESTION" title="Learnで、突然この入力を求められた" frame={frame} />
      <div className="mi-question-quote" style={lift(entrance(frame, fps, 18), 28)}>
        <MessageCircleQuestion />
        <blockquote>
          リソース URL には<br />
          <code>https://management.core.windows.net/</code><br />
          と入力します。末尾の <code>/</code> まで正確に。
        </blockquote>
      </div>
      <div className="mi-question-followup mi-question-followup-two" style={lift(entrance(frame, fps, 52), 18)}>
        <strong>呼び出したい対象APIが変わると<br />「トークンの宛先名」も変わる<br /><code>Graph → https://graph.microsoft.com</code></strong>
        <strong>この「URL」は何を表し、<br />誰が決め、どう選ぶのか？</strong>
      </div>
      <Source href={SOURCES.connector}>API とコネクタを認証する</Source>
    </section>
  )
}

function AcquisitionInterfacesSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const resources = [
    ['ARM · このLearn', 'https://management.core.windows.net/', 'ARM向けトークンの宛先名'],
    ['MICROSOFT GRAPH', 'https://graph.microsoft.com', 'Graph向けトークンの宛先名'],
    ['AZURE AI SEARCH', 'https://search.azure.com', 'Search向けトークンの宛先名']
  ]
  return (
    <section className="remotion-slide mi-slide">
      <Header kicker="THE SHORT ANSWER" title={<>これはAPIごとの「トークンの宛先名」</>} frame={frame} />
      <div className="mi-resource-identifiers">
        {resources.map(([tag, resource, note], i) => <div key={tag} style={lift(entrance(frame, fps, 18 + i * 13), 24)}><span>{tag}</span><code>{resource}</code><small>{note}</small></div>)}
      </div>
      <div className="mi-resource-rule" style={lift(entrance(frame, fps, 68), 16)}><TicketCheck /><strong>API提供側が定義する</strong><span>endpointから推測せず、公式ドキュメントの値を使う</span></div>
      <Source href={SOURCES.connector}>Microsoft Learn · Resource URL</Source>
    </section>
  )
}

function GraphBridgeSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide mi-slide">
      <Header kicker="CONNECT TO THE PREVIOUS EPISODE" title="前回のGraphメール取得も、同じ構造" frame={frame} />
      <div className="mi-graph-layout">
        <div className="mi-graph-questions">
          <div style={lift(entrance(frame, fps, 18), 20)}><span>誰が</span><strong>サインインした本人</strong><User /></div>
          <div style={lift(entrance(frame, fps, 30), 20)}><span>どのAPI</span><strong>Microsoft Graph</strong><code>https://graph.microsoft.com</code></div>
          <div style={lift(entrance(frame, fps, 42), 20)}><span>何を許可</span><strong>メールの読み取り</strong><code>Mail.Read</code></div>
        </div>
        <div className="mi-graph-request" style={lift(entrance(frame, fps, 48), 20)}><Globe2 /><span>実際のHTTP送信先</span><code>GET https://graph.microsoft.com/<br />v1.0/me/messages</code><small>Graphは識別子とendpointのホスト名が同じ</small></div>
      </div>
      <p className="mi-graph-bridge" style={lift(entrance(frame, fps, 68), 14)}>前回も、<strong>Graph向けのトークン</strong>を受け取り、Graphのendpointへ送っていた。</p>
      <Source href={SOURCES.graphMessages}>Microsoft Graph · List messages</Source>
    </section>
  )
}

function IdentifierEndpointSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide mi-slide">
      <Header kicker="IDENTITY ≠ LOCATION" title="トークンの対象と、HTTP送信先は別" frame={frame} />
      <div className="mi-uri-compare">
        <div style={lift(entrance(frame, fps, 18), 24)}><Fingerprint /><span>RESOURCE URL</span><strong>トークンの宛先名</strong><code>→ token の対象APIを指定</code><small>API提供側が決めた値を使う</small></div>
        <div style={lift(entrance(frame, fps, 34), 24)}><Globe2 /><span>ENDPOINT URL</span><strong>HTTP通信の入口</strong><code>GET https://host/path</code><small>実際にBearer tokenを送る先</small></div>
      </div>
      <div className="mi-multitenant-answer" style={lift(entrance(frame, fps, 66), 14)}><b>大事な点</b><strong>役割が違う</strong><span>Resource URLはトークンの相手、endpointは実際の通信先。</span></div>
      <Source href={SOURCES.resourceIndicators}>RFC 8707 · Resource Indicators</Source>
    </section>
  )
}

function ServiceMapSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const rows = [
    ['Microsoft Graph', 'https://graph.microsoft.com', 'https://graph.microsoft.com/v1.0/...'],
    ['ARM · 質問元connector', 'https://management.core.windows.net/', 'https://management.azure.com/...'],
    ['Azure AI Search', 'https://search.azure.com', 'https://<service>.search.windows.net/...']
  ]
  return (
    <section className="remotion-slide mi-slide">
      <Header kicker="RESOURCE TARGET vs ENDPOINT" title="同じに見える場合も、違う場合もある" frame={frame} />
      <div className="mi-service-table">
        <div className="mi-service-head"><span>Azure public cloud例</span><span>トークンの対象APIを示す値</span><span>実際のHTTP送信先</span></div>
        {rows.map(([service, target, endpoint], i) => <div key={service} style={lift(entrance(frame, fps, 18 + i * 14), 20)}><strong>{service}</strong><code>{target}</code><code>{endpoint}</code></div>)}
      </div>
      <div className="mi-control-plane-note"><strong>選び方</strong><span>endpointから推測せず、対象APIの公式ドキュメントに書かれた値をそのまま使う</span></div>
      <div className="mi-source mi-source-list">Sources · <a href={SOURCES.connector} target="_blank" rel="noreferrer">ARM</a> · <a href={SOURCES.scopes} target="_blank" rel="noreferrer">Graph</a> · <a href={SOURCES.searchAuth} target="_blank" rel="noreferrer">Search</a></div>
    </section>
  )
}

type FlowStep = { no: string; icon: React.ReactNode; title: string; body: string; accent?: boolean; token?: boolean }

function EndToEndFlowSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const setupSteps: FlowStep[] = [
    { no: '1', icon: <Fingerprint />, title: 'アプリを登録', body: 'Entra IDにアプリの身元を作る' },
    { no: '2', icon: <TicketCheck />, title: '使うAPIを指定', body: '対象API（Resource URL）と必要な権限を決める', accent: true },
    { no: '3', icon: <Shield />, title: 'Consent / 権限付与', body: 'APIと権限方式に応じて、必要なアクセスを承認する' }
  ]
  const runtimeSteps: FlowStep[] = [
    { no: '4', icon: <Play />, title: '認証してtoken要求', body: 'アプリが動き、必要ならサインイン。対象APIを指定してEntra IDへ要求' },
    { no: '5', icon: <KeyRound />, title: '対象API向けtoken', body: 'Entra IDが対象API向けに発行', token: true },
    { no: '6', icon: <Send />, title: 'endpointへ送る', body: 'Bearerで送り、APIがaud・期限・署名・権限を検証' }
  ]
  const renderStep = (step: FlowStep, i: number) => (
    <div className={`mi-e2e-step${step.accent ? ' is-accent' : ''}${step.token ? ' has-token' : ''}`} key={step.no} style={lift(entrance(frame, fps, 12 + (Number(step.no) - 1) * 9), 18)}>
      <span className="mi-e2e-number">{step.no}</span>{step.icon}<strong>{step.title}</strong><p>{step.body}</p>
      {step.token && <code><b>aud</b> 対象APIを検証 / <b>iss</b> 発行元・テナント<br /><b>scp・roles</b> 許可された操作 / <b>exp</b> 有効期限<small>scp: ユーザー委任 / roles: アプリ単独</small></code>}
      {i < 2 && <ArrowRight className="mi-e2e-arrow" />}
    </div>
  )
  return (
    <section className="remotion-slide mi-slide mi-end-to-end">
      <Header kicker="THE WHOLE FLOW" title="Entra ID認証から、APIをたたくまで" frame={frame} />
      <div className="mi-e2e-flow">
        <div className="mi-e2e-band"><span>設定・承認</span>{setupSteps.map(renderStep)}</div>
        <ArrowRight className="mi-e2e-phase-arrow" />
        <div className="mi-e2e-band is-runtime"><span>実行・認証</span>{runtimeSteps.map(renderStep)}</div>
      </div>
      <div className="mi-e2e-answer" style={lift(entrance(frame, fps, 78), 14)}><Database /><strong>② 対象APIを指定 → ⑤ 対象API向けtoken → ⑥ APIがaudを検証</strong><span>Resource URLは、この流れで「どのAPI向けか」を指定する値。</span></div>
      <Source href={SOURCES.tokenClaims}>Microsoft identity platform · access token claims</Source>
    </section>
  )
}

function PromoSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide mi-slide mi-promo-slide">
      <div className="mi-grid" /><LogoMark className="mi-promo-logo" />
      <div className="mi-promo-copy" style={lift(entrance(frame, fps, 8), 34)}>
        <span>KEEP LEARNING</span>
        <h1>もっと体系的に、<br /><em>順番に学びたい方へ。</em></h1>
        <p>難しいITを、迷わず進められる動画講座に。</p>
      </div>
      <div className="mi-promo-actions">
        <a href="https://study.ebisuda.net" target="_blank" rel="noreferrer" style={lift(entrance(frame, fps, 30), 24)}>
          <BookOpen /><span><small>VIDEO COURSES</small><strong>Ebi Study</strong><b>study.ebisuda.net</b></span><ChevronRight />
        </a>
        <div style={lift(entrance(frame, fps, 44), 24)}>
          <Bell /><span><small>YOUTUBE</small><strong>チャンネル登録</strong><b>次の解説もお見逃しなく！</b></span>
        </div>
      </div>
    </section>
  )
}
