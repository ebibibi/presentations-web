/* eslint-disable react-refresh/only-export-components */
import {
  ArrowRight,
  Bot,
  Check,
  Cloud,
  Code2,
  Database,
  LockKeyhole,
  MessageCircle,
  Network,
  PackageCheck,
  Radio,
  Server,
  ShieldCheck,
  TerminalSquare,
  Users,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { spring, useVideoConfig } from 'remotion'
import { CtaSlide, LogoMark } from '../../../src/deck-shared'
import type { SlideModule, SlideRenderContext } from '../../../src/types'
import './styles.css'

const RELEASE = 'https://github.com/ebibibi/ebi-agent-chat-relay/releases/tag/v4.0.0'
const TEAMS_GUIDE = 'https://github.com/ebibibi/ebi-agent-chat-relay/blob/v4.0.0/docs/teams-setup.md'

function entrance(frame: number, fps: number, delay = 0) {
  return spring({ frame: frame - delay, fps, config: { damping: 18, stiffness: 110 } })
}

function lift(value: number, distance = 30) {
  return { opacity: value, transform: `translateY(${(1 - value) * distance}px)` }
}

function Header({ kicker, children, frame }: { kicker: string; children: ReactNode; frame: number }) {
  const { fps } = useVideoConfig()
  return (
    <header className="relay-header" style={lift(entrance(frame, fps), 24)}>
      <span>{kicker}</span>
      <h1>{children}</h1>
    </header>
  )
}

function Source({ href, children }: { href: string; children: ReactNode }) {
  return <a className="relay-source" href={href} target="_blank" rel="noreferrer">{children} ↗</a>
}

function OpeningSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide relay-slide relay-opening">
      <div className="relay-grid" />
      <LogoMark className="relay-logo" />
      <div className="relay-opening-copy" style={lift(entrance(frame, fps), 42)}>
        <span>EBI AGENT CHAT RELAY · v4.0.0</span>
        <h1>AIエージェントを<br /><em>Teamsへ</em></h1>
        <p>Discord＋Teams × Claude Code CLI・Codex CLI・Local OpenAI互換・AG-UI</p>
      </div>
      <div className="relay-opening-visual" style={lift(entrance(frame, fps, 28), 36)}>
        <div><MessageCircle /><b>Discord</b></div>
        <div><Users /><b>Teams</b></div>
        <ArrowRight />
        <div className="relay-hub"><Network /><b>Relay</b></div>
        <ArrowRight />
        <div><TerminalSquare /><b>4 Backends</b></div>
      </div>
      <Source href={RELEASE}>GitHub Release v4.0.0</Source>
    </section>
  )
}

function EntranceOnlySlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide relay-slide relay-statement">
      <span className="relay-number">01 · V4.0.0 STRUCTURE</span>
      <p style={lift(entrance(frame, fps), 22)}>2つのFrontendと</p>
      <h1 style={lift(entrance(frame, fps, 18), 34)}>4つのBackend</h1>
      <div style={lift(entrance(frame, fps, 46), 22)}>会話する場所と、仕事をするAgentを別々に選べる基盤です。</div>
    </section>
  )
}

function TwoAxesSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const cards = [
    { icon: <MessageCircle />, tag: 'FRONTEND', title: '人が話す場所', items: ['Discord', 'Microsoft Teams'], note: '人とAgentをつなぐ会話の入口' },
    { icon: <Bot />, tag: 'BACKEND', title: '実際に働くAgent', items: ['Claude Code CLI', 'OpenAI Codex CLI', 'Local OpenAI互換 /v1/responses', 'AG-UI HTTP/SSE'], note: '2つのFrontendから選択可能' },
  ]
  return (
    <section className="remotion-slide relay-slide">
      <Header kicker="02 · TWO INDEPENDENT AXES" frame={frame}>FrontendとBackendを分けた</Header>
      <div className="relay-two-cards">
        {cards.map((card, i) => <article key={card.tag} style={lift(entrance(frame, fps, 18 + i * 18), 28)}>{card.icon}<span>{card.tag}</span><h2>{card.title}</h2><div>{card.items.map(x => <b key={x}>{x}</b>)}</div><p>{card.note}</p></article>)}
      </div>
      <div className="relay-shared">2つのFrontendから、4つのBackendを選べる</div>
    </section>
  )
}

function WhyTeamsHardSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const items = [
    [<LockKeyhole />, 'Entra app', 'application'], [<Bot />, 'Azure Bot', 'Bot resource'],
    [<Database />, 'Storage Queue', 'transport'], [<Cloud />, 'Public Receiver', '検証＋enqueue'],
    [<PackageCheck />, 'Private Host', 'outbound pull'],
  ]
  return (
    <section className="remotion-slide relay-slide">
      <Header kicker="03 · WHY TEAMS IS HARD" frame={frame}>推奨構成はTeams app packageだけではない</Header>
      <div className="relay-five-steps">{items.map(([icon, title, body], i) => <article key={String(title)} style={lift(entrance(frame, fps, 14 + i * 10), 22)}><span>{i + 1}</span>{icon}<strong>{title}</strong><p>{body}</p></article>)}</div>
      <div className="relay-warning">推奨経路は、公開受信とprivate実行をQueueで分離</div>
    </section>
  )
}

function NoPublicAgentHostSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide relay-slide relay-statement relay-danger">
      <span className="relay-number">04 · THE DESIGN RULE</span>
      <p style={lift(entrance(frame, fps), 22)}>公開入口は必要。でも</p>
      <h1 style={lift(entrance(frame, fps, 18), 34)}>Agent Hostを公開しない</h1>
      <div style={lift(entrance(frame, fps, 46), 22)}>repository access・agent credentials・Agent実行能力を、公開受信口から分離する。</div>
    </section>
  )
}

function OutboundFlowSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const units = [
    [<Users />, 'Teams', 'ユーザー'], [<Radio />, 'Bot Framework', 'Activity配送'],
    [<ShieldCheck />, 'Public Receiver', '検証＋enqueue'], [<Database />, 'Storage Queue', 'Activity待機'],
    [<Network />, 'ActivityPuller', '外向きpull'], [<Server />, 'Selected Backend', 'Agent実行'],
  ]
  return (
    <section className="remotion-slide relay-slide">
      <Header kicker="05 · OUTBOUND-ONLY PRIVATE HOST" frame={frame}>Public側は検証とenqueueだけ</Header>
      <div className="relay-boundary"><span>PUBLIC CLOUD</span><span>PRIVATE ENVIRONMENT</span></div>
      <div className="relay-flow">{units.map(([icon, title, body], i) => <div className="relay-flow-wrap" key={String(title)} style={lift(entrance(frame, fps, 12 + i * 9), 20)}><article>{icon}<strong>{title}</strong><small>{body}</small></article>{i < units.length - 1 ? <ArrowRight /> : null}</div>)}</div>
      <div className="relay-safety-pair"><span>Public Receiver：bot client secretなし／Agent起動不可</span><span>Private Host：Teams listenerを公開しない</span></div>
      <Source href={TEAMS_GUIDE}>Teams setup · private relay</Source>
    </section>
  )
}

function CombinationsSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const backends = ['Claude Code CLI', 'Codex CLI', 'Local OpenAI互換 /v1/responses', 'AG-UI']
  return (
    <section className="remotion-slide relay-slide">
      <Header kicker="06 · 2 × 4 COMBINATIONS" frame={frame}>同じRelayで8通り</Header>
      <div className="relay-matrix">
        <span />{backends.map(x => <strong key={x}>{x}</strong>)}
        {['Discord', 'Microsoft Teams'].flatMap((front, row) => [<b key={front}>{front}</b>, ...backends.map((back, col) => <span key={`${front}-${back}`} style={lift(entrance(frame, fps, 15 + row * 18 + col * 7), 14)}><Check /></span>)])}
      </div>
      <p className="relay-definition">AG-UI ＝ HTTP/SSEで接続するBackend</p>
    </section>
  )
}

function SetupEightSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const steps = ['Entra app', 'Azure Bot', 'Storage Queue', 'Public Receiver', 'Private session host', 'Teams app package', 'Upload & consent', '3段階で検証']
  return (
    <section className="remotion-slide relay-slide">
      <Header kicker="07 · SETUP MAP" frame={frame}>Teams導入ガイドは8セクション</Header>
      <div className="relay-setup-grid">{steps.map((step, i) => <article key={step} style={lift(entrance(frame, fps, 12 + i * 8), 18)}><span>{i + 1}</span><strong>{step}</strong></article>)}</div>
      <a className="relay-guide-link" href={TEAMS_GUIDE} target="_blank" rel="noreferrer"><Code2 /> 完全手順：docs/teams-setup.md</a>
    </section>
  )
}

function DataBoundarySlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide relay-slide relay-statement relay-purple">
      <span className="relay-number">08 · REAL DATA BOUNDARY</span>
      <p style={lift(entrance(frame, fps), 22)}>Entra appを顧客tenantに置いても</p>
      <h1 style={lift(entrance(frame, fps, 18), 34)}>Tenant登録 ≠ Tenant内処理</h1>
      <div style={lift(entrance(frame, fps, 46), 22)}>Bot Framework・Receiver・Queue・Private Host・Backendまでがデータ経路。</div>
    </section>
  )
}

function AguiSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide relay-slide">
      <Header kicker="09 · AG-UI BACKEND" frame={frame}>HTTP/SSE Agentも同じstreamへ</Header>
      <div className="relay-two-cards relay-agui-cards">
        <article style={lift(entrance(frame, fps, 18), 26)}><Code2 /><span>EVENT MAPPING</span><h2>共通eventへ変換</h2><div><b>Run lifecycle</b><b>Text streaming</b><b>Reasoning</b><b>Tool call / result</b></div></article>
        <article style={lift(entrance(frame, fps, 36), 26)}><ShieldCheck /><span>SECURITY BOUNDARY</span><h2>境界を明示</h2><div><b>URL credential拒否</b><b>Redirect拒否</b><b>SSE frame上限</b><b>Tokenを子CLIへ渡さない</b></div></article>
      </div>
      <div className="relay-shared">AG-UI eventをRelayの共通streamへ変換</div>
    </section>
  )
}

function LimitsSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const limits = [
    ['Teams commands', '/backend等は通常queue経路でcommand dispatchしない', 'configured/global Backend'],
    ['Teams files', '通常private queue経路はfile-consent invokeをbridgeしない', '対応範囲を明示'],
    ['AG-UI advanced', 'Durable HITL resume／state／activity等', '対応機能として未提示'],
  ]
  return (
    <section className="remotion-slide relay-slide">
      <Header kicker="10 · HONEST LIMITS" frame={frame}>v4でも同じではない部分</Header>
      <div className="relay-limit-grid">{limits.map(([title, body, result], i) => <article key={title} style={lift(entrance(frame, fps, 16 + i * 14), 22)}><span>{title}</span><p>{body}</p><strong>→ {result}</strong></article>)}</div>
      <div className="relay-honest"><Check /> 未対応を、対応済みのように見せない</div>
    </section>
  )
}

function ProofSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const facts = [['2,536', 'local tests', 'ruff成功／pyright 0 errors'], ['CI', 'Python 3.12／3.13', 'CodeQL／merge-after'], ['E2E', 'Teams → Azure relay', '→ Real Codex → Teams']]
  return (
    <section className="remotion-slide relay-slide">
      <Header kicker="11 · PROVEN ON REAL COMPONENTS" frame={frame}>Contractだけでなく実物で往復</Header>
      <div className="relay-proof-grid">{facts.map(([big, title, body], i) => <article key={big} style={lift(entrance(frame, fps, 16 + i * 15), 24)}><strong>{big}</strong><span>{title}</span><p>{body}</p></article>)}</div>
      <div className="relay-shared">本番検証でもDiscordとTeamsが同時稼働</div>
    </section>
  )
}

function NextSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide relay-slide relay-next">
      <span className="relay-number">12 · NEXT STEP</span>
      <h1 style={lift(entrance(frame, fps), 36)}>入口とAgentを、<em>分けて選ぶ</em></h1>
      <p style={lift(entrance(frame, fps, 28), 28)}>Release NotesとTeams Setup Guideから、自分のdeployment境界を決める。</p>
      <div className="relay-link-cards" style={lift(entrance(frame, fps, 52), 18)}>
        <a href={RELEASE} target="_blank" rel="noreferrer"><Code2 /><strong>v4.0.0 Release</strong><small>変更点・互換性・導入</small></a>
        <a href={TEAMS_GUIDE} target="_blank" rel="noreferrer"><ShieldCheck /><strong>Teams Setup Guide</strong><small>Entraから実往復まで</small></a>
      </div>
      <small className="relay-pypi">PyPIは未公開。GitHub tagまたはtagged Git URLから導入。</small>
    </section>
  )
}

export const slides: SlideModule['slides'] = [
  { render: props => <OpeningSlide {...props} /> },
  { render: props => <EntranceOnlySlide {...props} /> },
  { render: props => <TwoAxesSlide {...props} /> },
  { render: props => <WhyTeamsHardSlide {...props} /> },
  { render: props => <NoPublicAgentHostSlide {...props} /> },
  { render: props => <OutboundFlowSlide {...props} /> },
  { render: props => <CombinationsSlide {...props} /> },
  { render: props => <SetupEightSlide {...props} /> },
  { render: props => <DataBoundarySlide {...props} /> },
  { render: props => <AguiSlide {...props} /> },
  { render: props => <LimitsSlide {...props} /> },
  { render: props => <ProofSlide {...props} /> },
  { render: props => <NextSlide {...props} /> },
  { render: props => <CtaSlide {...props} /> },
]
