/* eslint-disable react-refresh/only-export-components */
import {
  ArrowDown,
  ArrowRight,
  Ban,
  CalendarDays,
  CalendarPlus,
  Check,
  CircleQuestionMark,
  ClipboardList,
  Copy,
  Eye,
  FileText,
  Link2,
  MessageSquare,
  MousePointerClick,
  Repeat,
  ShieldCheck,
  ThumbsUp,
  TriangleAlert,
  UserRound,
  Users,
  Video,
  X
} from 'lucide-react'
import { spring, useVideoConfig } from 'remotion'
import type { SlideModule, SlideRenderContext } from '../../../src/types'
import { LogoMark } from '../../../src/deck-shared'

export const slides: SlideModule['slides'] = [
  { render: (props) => <OpeningSlide {...props} /> },
  { render: (props) => <ProfileSlide {...props} /> },
  { render: (props) => <QuestionSlide {...props} /> },
  { render: (props) => <SectionWhatSlide {...props} /> },
  { render: (props) => <WhatIsItSlide {...props} /> },
  { render: (props) => <NotCopyPasteSlide {...props} /> },
  { render: (props) => <SupportedSlide {...props} /> },
  { render: (props) => <SectionCautionSlide {...props} /> },
  { render: (props) => <UrlInheritedSlide {...props} /> },
  { render: (props) => <UrlIsNotALinkSlide {...props} /> },
  { render: (props) => <ScenarioSlide {...props} /> },
  { render: (props) => <ConsequencesSlide {...props} /> },
  { render: (props) => <SectionUseSlide {...props} /> },
  { render: (props) => <GoodCasesSlide {...props} /> },
  { render: (props) => <RuleSlide {...props} /> },
  { render: (props) => <RecapSlide {...props} /> },
  { render: (props) => <SourcesSlide {...props} /> },
  { render: (props) => <ThanksSlide {...props} /> }
]

const SOURCE_URL = 'https://jpmessaging.github.io/blog/duplicate-event-considerations/'

function entrance(frame: number, fps: number, delay = 0) {
  return spring({ frame: frame - delay, fps, config: { damping: 18, stiffness: 105 } })
}

function lift(value: number, distance = 26) {
  return { opacity: value, transform: `translateY(${(1 - value) * distance}px)` }
}

function Header({ kicker, title, frame }: { kicker: string; title: React.ReactNode; frame: number }) {
  const { fps } = useVideoConfig()
  return (
    <div className="dup-head" style={lift(entrance(frame, fps), 22)}>
      <span className="slide-kicker">{kicker}</span>
      <h1>{title}</h1>
    </div>
  )
}

function Punch({ frame, delay = 70, children }: { frame: number; delay?: number; children: React.ReactNode }) {
  const { fps } = useVideoConfig()
  return (
    <p className="dup-punch" style={lift(entrance(frame, fps, delay), 14)}>
      {children}
    </p>
  )
}

function SectionSlide({ frame, number, title, lead }: { frame: number; number: string; title: string; lead: string }) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide dup-slide dup-section">
      <div className="dup-grid-bg" />
      <div className="dup-section-body">
        <span className="dup-section-number" style={lift(entrance(frame, fps), 30)}>
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
  const drift = Math.sin(frame / 18) * 5
  return (
    <section className="remotion-slide dup-slide dup-opening">
      <div className="dup-grid-bg" />
      <LogoMark className="dup-logo" />
      <div className="dup-opening-copy">
        <span className="slide-kicker">OUTLOOK / MICROSOFT TEAMS</span>
        <h1 style={lift(entrance(frame, fps), 30)}>
          その「イベントを複製」、
          <br />
          <em>Teams会議は同じままです</em>
        </h1>
        <p style={lift(entrance(frame, fps, 20), 22)}>
          Outlookの画面では新しい予定。Teamsとしては、前と同じ会議。
        </p>
      </div>
      <div className="dup-opening-visual" style={{ transform: `translateY(${drift}px)` }}>
        <div className="dup-clone-pair" style={lift(entrance(frame, fps, 26), 26)}>
          <div className="dup-clone-card">
            <CalendarDays size={34} />
            <strong>元の予定</strong>
            <span>出席者：Bさん</span>
          </div>
          <Copy size={34} />
          <div className="dup-clone-card">
            <CalendarDays size={34} />
            <strong>複製した予定</strong>
            <span>出席者：Cさん</span>
          </div>
        </div>
        <div className="dup-clone-link" style={lift(entrance(frame, fps, 44), 20)}>
          <Link2 size={30} />
          <strong>Teams会議のURLは、同じ</strong>
        </div>
      </div>
    </section>
  )
}

function ProfileSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const facts = ['Microsoft MVP 14年連続', 'Windows・Azure・M365', '実機で検証して解説', '著書「Windowsインフラ管理者入門」']
  return (
    <section className="remotion-slide dup-slide">
      <Header kicker="YOUR GUIDE" title="解説する人：胡田 昌彦" frame={frame} />
      <div className="dup-profile-layout">
        <div className="dup-profile-mark" style={lift(entrance(frame, fps, 16), 22)}>
          <LogoMark />
          <strong>
            Masahiko
            <br />
            Ebisuda
          </strong>
          <span>えびすだ まさひこ</span>
        </div>
        <div className="dup-profile-facts">
          {facts.map((fact, i) => (
            <div key={fact} style={lift(entrance(frame, fps, 28 + i * 10), 16)}>
              <Check size={26} />
              <strong>{fact}</strong>
            </div>
          ))}
        </div>
      </div>
      <Punch frame={frame} delay={72}>
        管理者の設定ではなく、<b>利用者が毎日踏みうる落とし穴</b>の話です。
      </Punch>
    </section>
  )
}

function QuestionSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const steps = [
    'Teams会議つきの予定を「複製」した',
    '複製した予定の出席者を、別の人に変えた',
    'このとき、Teams会議のURLは？'
  ]
  return (
    <section className="remotion-slide dup-slide">
      <Header kicker="THE QUESTION" title="複製したら、Teams会議のURLはどうなる？" frame={frame} />
      <div className="dup-question-list">
        {steps.map((q, i) => (
          <div key={q} style={lift(entrance(frame, fps, 18 + i * 13), 20)}>
            <CircleQuestionMark size={34} />
            <strong>{q}</strong>
          </div>
        ))}
      </div>
      <Punch frame={frame} delay={78}>
        答えは<b>「元のまま」</b>。今日の話は、すべてここから始まります。
      </Punch>
    </section>
  )
}

function SectionWhatSlide(props: SlideRenderContext) {
  return (
    <SectionSlide
      {...props}
      number="SECTION 1"
      title="「イベントを複製」とは"
      lead="まず、何ができる機能なのかをはっきりさせます。"
    />
  )
}

function WhatIsItSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const reuse = ['件名', '場所', '参加者', 'など既存の予定の情報']
  const places = [
    { icon: <CalendarDays size={30} />, label: 'Outlook on the web' },
    { icon: <CalendarPlus size={30} />, label: '新しい Outlook for Windows' },
    { icon: <Video size={30} />, label: 'Teams のカレンダー' }
  ]
  return (
    <section className="remotion-slide dup-slide">
      <Header kicker="WHAT IT IS" title="既存の予定を土台に、新しい予定を作る" frame={frame} />
      <div className="dup-two-col">
        <div className="dup-panel" style={lift(entrance(frame, fps, 16), 22)}>
          <span className="dup-panel-label">再利用されるもの</span>
          <div className="dup-chip-row">
            {reuse.map((r) => (
              <span key={r} className="dup-chip">
                {r}
              </span>
            ))}
          </div>
          <p>毎回ゼロから予定を作らなくて済む。</p>
        </div>
        <div className="dup-panel" style={lift(entrance(frame, fps, 30), 22)}>
          <span className="dup-panel-label">使える場所（予定を右クリック）</span>
          <div className="dup-place-list">
            {places.map((p) => (
              <div key={p.label}>
                {p.icon}
                <strong>{p.label}</strong>
              </div>
            ))}
          </div>
          <p>
            <MousePointerClick size={22} /> メニューに「イベントを複製」が出ます。
          </p>
        </div>
      </div>
      <Punch frame={frame} delay={72}>
        同じメンバーで<b>もう一度／次回</b>を作りたいとき向けの機能です。
      </Punch>
    </section>
  )
}

function NotCopyPasteSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide dup-slide">
      <Header kicker="DON'T CONFUSE" title="従来Outlookの「会議のコピー」とは別の機能" frame={frame} />
      <div className="dup-versus">
        <div className="dup-versus-card dup-versus-bad" style={lift(entrance(frame, fps, 16), 24)}>
          <Ban size={38} />
          <strong>従来の Outlook for Windows</strong>
          <span>会議のコピー ＆ ペースト</span>
          <p>サポートされていません（公開情報でブロックされると案内）</p>
        </div>
        <div className="dup-versus-card dup-versus-good" style={lift(entrance(frame, fps, 30), 24)}>
          <Copy size={38} />
          <strong>新しい Outlook / Outlook on the web</strong>
          <span>イベントを複製 (Duplicate Event)</span>
          <p>既存イベントの情報を再利用するために開発された、別の仕組み</p>
        </div>
      </div>
      <Punch frame={frame} delay={72}>
        「あっちがダメだから、こっちもダメ」<b>ではありません</b>。
      </Punch>
    </section>
  )
}

function SupportedSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide dup-slide dup-oneline">
      <div className="dup-grid-bg" />
      <div className="dup-oneline-body">
        <ShieldCheck size={64} style={{ color: 'var(--dup-green)', ...lift(entrance(frame, fps), 24) }} />
        <h1 style={lift(entrance(frame, fps, 12), 26)}>
          「イベントを複製」による会議の複製は、
          <br />
          <em>サポートされています</em>
        </h1>
        <p style={lift(entrance(frame, fps, 28), 20)}>使ってはいけない機能ではありません。ただし、使い方には注意が要ります。</p>
      </div>
    </section>
  )
}

function SectionCautionSlide(props: SlideRenderContext) {
  return (
    <SectionSlide
      {...props}
      number="SECTION 2"
      title="注意すべきは Teams 会議"
      lead="Teams 会議が設定されたイベントを複製する場合の話です。"
    />
  )
}

function UrlInheritedSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide dup-slide dup-oneline">
      <div className="dup-grid-bg" />
      <div className="dup-oneline-body">
        <Link2 size={64} style={{ color: 'var(--dup-red)', ...lift(entrance(frame, fps), 24) }} />
        <h1 style={lift(entrance(frame, fps, 12), 26)}>
          Teams会議のURLは、
          <br />
          <em>複製元のものが引き継がれる</em>
        </h1>
        <p style={lift(entrance(frame, fps, 28), 20)}>新しい会議URLは発行されません。</p>
      </div>
    </section>
  )
}

function UrlIsNotALinkSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const attached = [
    { icon: <MessageSquare size={30} />, label: '会議のチャット' },
    { icon: <FileText size={30} />, label: '共有されたファイル' },
    { icon: <Users size={30} />, label: 'Teams側の参加者情報' }
  ]
  return (
    <section className="remotion-slide dup-slide">
      <Header kicker="WHY IT MATTERS" title="URLは「入口のリンク」ではなく、会議そのもの" frame={frame} />
      <div className="dup-url-flow">
        <div className="dup-url-node" style={lift(entrance(frame, fps, 14), 20)}>
          <Link2 size={34} />
          <strong>同じ Teams 会議 URL</strong>
        </div>
        <ArrowDown size={34} />
        <div className="dup-url-attached">
          {attached.map((a, i) => (
            <div key={a.label} style={lift(entrance(frame, fps, 26 + i * 10), 18)}>
              {a.icon}
              <strong>{a.label}</strong>
            </div>
          ))}
        </div>
      </div>
      <Punch frame={frame} delay={72}>
        URLが同じ ＝ <b>チャットもファイルも同じ場所</b>を共有している。
      </Punch>
    </section>
  )
}

function ScenarioSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide dup-slide">
      <Header kicker="SCENARIO" title="AさんとBさんの会議を、Cさん用に複製した" frame={frame} />
      <div className="dup-scenario">
        <div className="dup-scenario-card" style={lift(entrance(frame, fps, 14), 22)}>
          <span className="dup-panel-label">元の会議</span>
          <div className="dup-people">
            <span>
              <UserRound size={26} /> Aさん（開催者）
            </span>
            <span>
              <UserRound size={26} /> Bさん
            </span>
          </div>
          <div className="dup-url-tag">
            <Link2 size={22} /> Teams会議 URL：X
          </div>
        </div>
        <div className="dup-scenario-arrow" style={lift(entrance(frame, fps, 26), 18)}>
          <Copy size={32} />
          <strong>複製 → 出席者を差し替え</strong>
          <ArrowRight size={32} />
        </div>
        <div className="dup-scenario-card dup-scenario-danger" style={lift(entrance(frame, fps, 38), 22)}>
          <span className="dup-panel-label">複製した会議</span>
          <div className="dup-people">
            <span>
              <UserRound size={26} /> Aさん（開催者）
            </span>
            <span>
              <UserRound size={26} /> Cさん
            </span>
          </div>
          <div className="dup-url-tag dup-url-tag-danger">
            <Link2 size={22} /> Teams会議 URL：<b>X（同じ）</b>
          </div>
        </div>
      </div>
      <Punch frame={frame} delay={78}>
        Outlookでは別の会議。<b>Teamsとしては同じ会議</b>。
      </Punch>
    </section>
  )
}

function ConsequencesSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const items = [
    { icon: <Users size={32} />, text: 'Teams会議側の参加者情報が、元の会議のまま（Bさん）になる' },
    { icon: <X size={32} />, text: 'AさんとCさんで話すはずの会議に、Bさんが参加できてしまう' },
    { icon: <Eye size={32} />, text: 'Cさんの書き込みや共有ファイルが、Bさんにも見られてしまう' }
  ]
  return (
    <section className="remotion-slide dup-slide">
      <Header kicker="WHAT GOES WRONG" title="何が起きるか" frame={frame} />
      <div className="dup-risk-list">
        {items.map((item, i) => (
          <div key={item.text} style={lift(entrance(frame, fps, 16 + i * 13), 20)}>
            {item.icon}
            <strong>{item.text}</strong>
          </div>
        ))}
      </div>
      <Punch frame={frame} delay={80}>
        <TriangleAlert size={26} /> 参加者の混乱にとどまらず、
        <b>意図しない相手への情報共有</b>につながります。
      </Punch>
    </section>
  )
}

function SectionUseSlide(props: SlideRenderContext) {
  return (
    <SectionSlide
      {...props}
      number="SECTION 3"
      title="では、どう使えばいいか"
      lead="判断基準はとてもシンプルです。"
    />
  )
}

function GoodCasesSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const cases = ['同じメンバーで、前回の会議の続きを行う', '同じメンバーで、次回の打ち合わせを設定する']
  return (
    <section className="remotion-slide dup-slide">
      <Header kicker="GOOD FIT" title="「同じ趣旨・同じ参加者」なら、複製が活きる" frame={frame} />
      <div className="dup-good-list">
        {cases.map((c, i) => (
          <div key={c} style={lift(entrance(frame, fps, 16 + i * 14), 20)}>
            <Check size={34} />
            <strong>{c}</strong>
          </div>
        ))}
      </div>
      <div className="dup-benefit" style={lift(entrance(frame, fps, 50), 20)}>
        <Repeat size={30} />
        <strong>会議作成の手間が減り、Teams会議が引き継がれること自体がメリットになる</strong>
      </div>
      <Punch frame={frame} delay={78}>
        前回のチャットもファイルも、<b>そのまま続き</b>として使えます。
      </Punch>
    </section>
  )
}

function RuleSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide dup-slide dup-oneline">
      <div className="dup-grid-bg" />
      <div className="dup-oneline-body">
        <h1 style={lift(entrance(frame, fps), 26)}>
          参加者が変わるなら、
          <br />
          <em>複製しない</em>
        </h1>
        <p style={lift(entrance(frame, fps, 20), 20)}>参加者が同じで前回の続きなら、複製が最適。判断基準はこれだけです。</p>
      </div>
    </section>
  )
}

function RecapSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const points = [
    '「イベントを複製」による会議の複製はサポートされている',
    '従来Outlookの会議コピー＆ペーストとは別の仕組み',
    'Teams会議のURLは複製元から引き継がれる',
    '参加者を変える用途で使うと、情報が意図せず共有される',
    '前回の続きを作る目的で使えば、メリットだけを活かせる'
  ]
  return (
    <section className="remotion-slide dup-slide">
      <Header kicker="RECAP" title="今日のまとめ" frame={frame} />
      <div className="dup-recap-list">
        {points.map((p, i) => (
          <div key={p} style={lift(entrance(frame, fps, 12 + i * 9), 16)}>
            <Check size={28} />
            <strong>{p}</strong>
          </div>
        ))}
      </div>
    </section>
  )
}

function SourcesSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const sources: [string, string][] = [
    ['「イベントを複製 (Duplicate Event)」を利用する際の注意点（日本マイクロソフト Exchange & Outlook サポート）', SOURCE_URL],
    [
      'Outlook では、"会議のコピーはサポートされていません" で会議のコピーがブロックされます',
      'https://support.microsoft.com/ja-jp/support/known-issues/outlook-blocks-copying-meetings-with-copying-meetings-is-not-supported'
    ]
  ]
  return (
    <section className="remotion-slide dup-slide">
      <Header kicker="REFERENCES" title="出典" frame={frame} />
      <div className="dup-source-list">
        {sources.map(([label, href], i) => (
          <a key={href} href={href} target="_blank" rel="noreferrer" style={lift(entrance(frame, fps, 12 + i * 10), 14)}>
            <ClipboardList size={26} />
            <div>
              <strong>{label}</strong>
              <span>{href.replace('https://', '')}</span>
            </div>
          </a>
        ))}
      </div>
      <Punch frame={frame} delay={64}>
        元記事は<b>2026年9月3日時点</b>の情報。運用前に最新の公式情報をご確認ください。
      </Punch>
    </section>
  )
}

function ThanksSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  return (
    <section className="remotion-slide dup-slide dup-thanks">
      <div className="dup-grid-bg" />
      <div style={lift(entrance(frame, fps), 34)}>
        <ThumbsUp size={78} />
        <h1>ご視聴ありがとうございました！</h1>
        <p>高評価・チャンネル登録をお願いします。</p>
      </div>
    </section>
  )
}
