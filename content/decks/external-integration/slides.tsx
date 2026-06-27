/* eslint-disable react-refresh/only-export-components */
import { spring, useVideoConfig } from 'remotion'
import type { SlideModule, SlideRenderContext } from '../../../src/types'
import { CtaSlide, LogoMark } from '../../../src/deck-shared'

export const slides: SlideModule['slides'] = [
  { render: (props) => <OpeningSlide {...props} /> },
  { render: (props) => <CtaSlide {...props} /> },
  { render: (props) => <WhyConnectSlide {...props} /> },
  { render: (props) => <WhatIsMcpSlide {...props} /> },
  { render: (props) => <McpHowSlide {...props} /> },
  { render: (props) => <DirectApiSlide {...props} /> },
  { render: (props) => <TradeoffContextSlide {...props} /> },
  { render: (props) => <TradeoffControlSlide {...props} /> },
  { render: (props) => <ConfessionSlide {...props} /> },
  { render: (props) => <WhenMcpSlide {...props} /> },
  { render: (props) => <HowToChooseSlide {...props} /> },
  { render: (props) => <DemoSlide {...props} /> },
  { render: (props) => <RecapSlide {...props} /> },
  { render: (props) => <NextSlide {...props} /> },
  { render: (props) => <CtaSlide {...props} /> }
]

// Pure helper (not a hook): spring-based entrance value for staggered items.
function entrance(frame: number, fps: number, delay = 0) {
  return spring({
    frame: frame - delay,
    fps,
    config: { damping: 18, stiffness: 110 }
  })
}

function lift(value: number, distance = 32) {
  return {
    opacity: value,
    transform: `translateY(${(1 - value) * distance}px)`
  }
}

function OpeningSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const title = entrance(frame, fps)

  const goals = [
    ['01', '2つの道を知る', '外の世界とつなぐ「MCP」と「直接API」を理解する'],
    ['02', '選べるようになる', '自分の使い方なら、どちらが向いているかを判断する']
  ]

  return (
    <section className="remotion-slide e14-slide e14-opening">
      <LogoMark />
      <div className="motion-grid" />
      <div className="e14-opening-copy" style={lift(title, 48)}>
        <span className="slide-kicker">Claude Codeの使い方コース ─ 第14回</span>
        <h1>
          外部連携の全て
          <br />
          <span className="e14-vs">MCP vs 直接API</span>
        </h1>
      </div>
      <div className="e14-goal-row">
        {goals.map(([number, heading, body], index) => (
          <div key={number} style={lift(entrance(frame, fps, 28 + index * 12), 28)}>
            <strong>{number}</strong>
            <span>{heading}</span>
            <p>{body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function WhyConnectSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const heading = entrance(frame, fps)

  const services = ['カレンダー', 'メール', 'Todo', 'GitHub', 'Notion']

  return (
    <section className="remotion-slide e14-slide">
      <div style={lift(heading, 24)}>
        <span className="slide-kicker">そもそも外部連携とは</span>
        <h1>つなぐと「秘書」になる</h1>
      </div>
      <div className="e14-connect">
        <div className="e14-connect-core" style={lift(entrance(frame, fps, 18), 24)}>
          <strong>Claude Code</strong>
          <p>そのままだと、このPCの中だけ</p>
        </div>
        <div className="e14-connect-link" style={{ opacity: entrance(frame, fps, 30) }}>
          ⇄
        </div>
        <div className="e14-connect-services">
          {services.map((label, index) => (
            <span key={label} style={lift(entrance(frame, fps, 36 + index * 8), 20)}>
              {label}
            </span>
          ))}
        </div>
      </div>
      <p className="e14-note" style={lift(entrance(frame, fps, 80), 18)}>
        助手に外線電話と社外の鍵を渡すイメージ。つなぎ方には<b>2つの道</b>がある。
      </p>
    </section>
  )
}

function WhatIsMcpSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const heading = entrance(frame, fps)
  const port = entrance(frame, fps, 24)
  const note = entrance(frame, fps, 48)

  return (
    <section className="remotion-slide e14-slide">
      <div style={lift(heading, 24)}>
        <span className="slide-kicker">1つ目の道</span>
        <h1>MCP ─ 共通の差し込み口</h1>
      </div>
      <div className="e14-port" style={lift(port, 30)}>
        <span className="e14-tag">Model Context Protocol</span>
        <strong>USB-Cみたいな業界標準規格</strong>
        <p>
          MCPサーバーを足すと、Claude Codeがそのサービスのツールを
          <b>自動で発見して</b>使えるようになる。
        </p>
      </div>
      <p className="e14-note" style={lift(note, 18)}>
        対応サービスはどんどん増えている。AIと外の世界をつなぐ「標準コネクタ」。
      </p>
    </section>
  )
}

function McpHowSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const heading = entrance(frame, fps)
  const terminal = entrance(frame, fps, 22)

  const examples = [
    ['Notion', 'ノートの検索・作成'],
    ['GitHub', 'Issue作成・PR確認'],
    ['Google Calendar', '予定の確認・作成'],
    ['Slack', 'メッセージ送信']
  ]

  return (
    <section className="remotion-slide e14-slide">
      <div style={lift(heading, 24)}>
        <span className="slide-kicker">MCPの使い方</span>
        <h1>追加はコマンド1つ</h1>
      </div>
      <div className="e14-how-stage">
        <div className="e14-terminal" style={lift(terminal, 28)}>
          <div className="e14-terminal-bar">
            <span />
            <span />
            <span />
            <strong>claude</strong>
          </div>
          <div className="e14-terminal-body">
            <code className="e14-prompt">&gt; claude mcp add notion</code>
            <code className="e14-output">✓ connected — 次回起動時も自動でつながる</code>
          </div>
        </div>
        <div className="e14-examples">
          {examples.map(([name, body], index) => (
            <div key={name} style={lift(entrance(frame, fps, 40 + index * 10), 24)}>
              <strong>{name}</strong>
              <span>{body}</span>
            </div>
          ))}
        </div>
      </div>
      <p className="e14-note" style={lift(entrance(frame, fps, 90), 18)}>
        「Notionを繋いで」と頼むだけでもOK。<b>差すだけで使える手軽さ</b>が最大の魅力。
      </p>
    </section>
  )
}

function DirectApiSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const heading = entrance(frame, fps)
  const terminal = entrance(frame, fps, 22)
  const judge = entrance(frame, fps, 56)

  const steps = ['APIを叩くスクリプトを書いてもらう', 'コマンド一発で実行できる', 'スキルでラップして繰り返し使う']

  return (
    <section className="remotion-slide e14-slide">
      <div style={lift(heading, 24)}>
        <span className="slide-kicker">2つ目の道</span>
        <h1>直接API ─ 自分で道具を作る</h1>
      </div>
      <div className="e14-how-stage">
        <div className="e14-terminal" style={lift(terminal, 28)}>
          <div className="e14-terminal-bar">
            <span />
            <span />
            <span />
            <strong>claude</strong>
          </div>
          <div className="e14-terminal-body">
            <code className="e14-prompt">&gt; このAPIを叩くスクリプトを書いて</code>
            <code className="e14-output">created scripts/fetch_todos.py</code>
          </div>
        </div>
        <div className="e14-steps">
          {steps.map((label, index) => (
            <div key={label} style={lift(entrance(frame, fps, 40 + index * 12), 24)}>
              <strong>{index + 1}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
      <p className="e14-judge" style={lift(judge, 20)}>
        MCP = <b>道具を渡す</b> ／ 直接API = <b>自分で道具を使う</b>（第13回のスキルが活きる）
      </p>
    </section>
  )
}

function TradeoffContextSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const heading = entrance(frame, fps)

  const bars = [
    ['MCPサーバー 1つ', 1, '約13,000〜18,000', 'var(--coral)'],
    ['スキル + 直接API', 0.014, '約225', 'var(--teal)']
  ] as const

  return (
    <section className="remotion-slide e14-slide">
      <div style={lift(heading, 24)}>
        <span className="slide-kicker">トレードオフ ①</span>
        <h1>
          つなぐだけで<code className="e14-cmd">/context</code>を食う
        </h1>
      </div>
      <div className="e14-bars">
        {bars.map(([label, ratio, value, color], index) => {
          const grow = entrance(frame, fps, 26 + index * 16)
          return (
            <div key={label} className="e14-bar-row" style={{ opacity: grow }}>
              <span className="e14-bar-label">{label}</span>
              <div className="e14-bar-track">
                <i
                  style={{
                    width: `${Math.max(ratio * 100, 3)}%`,
                    background: color,
                    transform: `scaleX(${grow})`,
                    transformOrigin: 'left'
                  }}
                />
              </div>
              <span className="e14-bar-val">{value}<small>トークン</small></span>
            </div>
          )
        })}
      </div>
      <p className="e14-note" style={lift(entrance(frame, fps, 74), 18)}>
        第13回で出た「コンテキストを食う犯人」の正体。<b>桁が2つ違う。</b>
      </p>
    </section>
  )
}

function TradeoffControlSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const heading = entrance(frame, fps)
  const left = entrance(frame, fps, 22)
  const right = entrance(frame, fps, 36)

  return (
    <section className="remotion-slide e14-slide">
      <div style={lift(heading, 24)}>
        <span className="slide-kicker">トレードオフ ②</span>
        <h1>安定性と制御のしやすさ</h1>
      </div>
      <div className="e14-compare">
        <div className="e14-compare-card" style={lift(left, 30)}>
          <span className="e14-tag e14-tag-muted">MCP</span>
          <strong>ときどき詰まる</strong>
          <p>認証トークンの更新失敗や、サブエージェントから呼べない問題が起きることがある。</p>
        </div>
        <div className="e14-compare-card e14-compare-accent" style={lift(right, 30)}>
          <span className="e14-tag">直接API</span>
          <strong>自分で握れる</strong>
          <p>トークンも実行も自分で管理。サブエージェントからもBash経由で確実に動く。</p>
        </div>
      </div>
    </section>
  )
}

function ConfessionSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const heading = entrance(frame, fps)
  const card = entrance(frame, fps, 24)
  const note = entrance(frame, fps, 48)

  return (
    <section className="remotion-slide e14-slide e14-confession">
      <div style={lift(heading, 24)}>
        <span className="slide-kicker">正直な告白</span>
        <h1>私はMCPを全部やめました</h1>
      </div>
      <div className="e14-confession-card" style={lift(card, 30)}>
        <p>
          外部連携を<b>すべて直接APIスクリプトに移行</b>した。
          理由は、私の使い方が「毎日同じ操作を繰り返す」自動化中心だから。
        </p>
        <div className="e14-confession-result">
          <span>コンテキストの無駄</span>
          <strong>激減</strong>
          <span>認証まわりの事故</span>
          <strong>激減</strong>
        </div>
      </div>
      <p className="e14-note" style={lift(note, 18)}>
        MCPが悪いのではなく、<b>自分の使い方に合わなかった</b>という話。
      </p>
    </section>
  )
}

function WhenMcpSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const heading = entrance(frame, fps)
  const left = entrance(frame, fps, 22)
  const right = entrance(frame, fps, 36)

  const fit = ['色々なサービスをとりあえず試す探索フェーズ', '公式サーバーが充実している連携', 'たまにしか使わず、自分で書かないとき']
  const unfit = ['毎日使う軽量なAPI', 'コンテキスト節約が最優先のとき']

  return (
    <section className="remotion-slide e14-slide">
      <div style={lift(heading, 24)}>
        <span className="slide-kicker">フェアに見る</span>
        <h1>MCPが悪いわけじゃない</h1>
      </div>
      <div className="e14-fit">
        <div className="e14-fit-col e14-fit-good" style={lift(left, 28)}>
          <span className="e14-fit-head">向いている</span>
          {fit.map((label) => (
            <p key={label}>{label}</p>
          ))}
        </div>
        <div className="e14-fit-col e14-fit-bad" style={lift(right, 28)}>
          <span className="e14-fit-head">向いていない</span>
          {unfit.map((label) => (
            <p key={label}>{label}</p>
          ))}
        </div>
      </div>
      <p className="e14-judge" style={lift(entrance(frame, fps, 60), 18)}>
        大事なのは優劣ではなく、<b>トレードオフを理解して選ぶこと。</b>
      </p>
    </section>
  )
}

function HowToChooseSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const heading = entrance(frame, fps)
  const left = entrance(frame, fps, 22)
  const right = entrance(frame, fps, 36)
  const note = entrance(frame, fps, 54)

  return (
    <section className="remotion-slide e14-slide">
      <div style={lift(heading, 24)}>
        <span className="slide-kicker">判断の物差し</span>
        <h1>どっちを選ぶ？</h1>
      </div>
      <div className="e14-choose">
        <div className="e14-choose-card e14-choose-accent" style={lift(left, 30)}>
          <span className="e14-tag">直接API + スキル</span>
          <strong>繰り返す・決まった操作</strong>
          <p>コンテキスト効率と制御性で勝る。毎日の自動化はこちら。</p>
        </div>
        <div className="e14-choose-card" style={lift(right, 30)}>
          <span className="e14-tag e14-tag-muted">MCP</span>
          <strong>手軽に色々試したい</strong>
          <p>追加の速さが魅力。たまにしか使わないならこちら。</p>
        </div>
      </div>
      <p className="e14-judge" style={lift(note, 18)}>
        最後は<b>コンテキストと相談して選ぶ</b>。第13回のダイエット術と地続きの考え方。
      </p>
    </section>
  )
}

function DemoSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const heading = entrance(frame, fps)

  const items: ReadonlyArray<readonly [string, string]> = [
    ['MCPを追加', '「claude mcp add」でサーバーを足し、/context で増えた分を見る'],
    ['直接APIで実行', 'スクリプトでAPIを叩き、結果をClaudeに渡して分析させる'],
    ['コンテキストを比較', '同じ操作をMCP版と直接API版で実行し、使用量を実測']
  ]

  return (
    <section className="remotion-slide e14-slide demo-slide">
      <div style={lift(heading, 24)}>
        <span className="demo-badge">▶ 実演 / LIVE DEMO</span>
        <h1>ここで手を動かす</h1>
      </div>
      <div className="demo-list">
        {items.map(([title, body], index) => (
          <div key={title} style={lift(entrance(frame, fps, 24 + index * 12), 26)}>
            <span className="demo-num">{index + 1}</span>
            <div>
              <strong>{title}</strong>
              <p>{body}</p>
            </div>
          </div>
        ))}
      </div>
      <p className="demo-foot" style={lift(entrance(frame, fps, 72), 18)}>
        説明だけで終わらせない。画面に映しながら、実際にやってみせる。
      </p>
    </section>
  )
}

function RecapSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const heading = entrance(frame, fps)

  const points = [
    '外部連携には2つの道 ─ MCP と 直接API',
    'MCP = 差すだけの手軽さ、でもコンテキストを食う',
    '直接API + スキル = 手間はかかるが効率と制御で勝る',
    '優劣ではなくトレードオフ。自分の使い方で選ぶ'
  ]

  return (
    <section className="remotion-slide e14-slide">
      <div style={lift(heading, 24)}>
        <span className="slide-kicker">まとめ</span>
        <h1>今日のポイント</h1>
      </div>
      <div className="e14-recap">
        {points.map((point, index) => (
          <div key={point} style={lift(entrance(frame, fps, 22 + index * 11), 24)}>
            <span className="e14-check">✓</span>
            <p>{point}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function NextSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const title = entrance(frame, fps)
  const card = entrance(frame, fps, 26)
  const cta = entrance(frame, fps, 44)

  return (
    <section className="remotion-slide e14-slide e14-next">
      <div className="motion-grid" />
      <div style={lift(title, 30)}>
        <span className="slide-kicker">次回予告</span>
        <h1>第2の脳をつくる</h1>
      </div>
      <div className="e14-next-card" style={lift(card, 28)}>
        <strong>第15回</strong>
        <span>第2の脳 &amp; 私の実際の使い方</span>
        <p>人間とAIが知識を共有する仕組みを、概念と実践の両面から。</p>
      </div>
      <p className="e14-cta" style={lift(cta, 18)}>
        チャンネル登録 &amp; メンバーシップ登録もよろしくお願いします！
      </p>
    </section>
  )
}
