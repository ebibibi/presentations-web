/* eslint-disable react-refresh/only-export-components */
import { spring, useVideoConfig } from 'remotion'
import type { SlideModule, SlideRenderContext } from '../../../src/types'
import { CtaSlide, LogoMark } from '../../../src/deck-shared'

export const slides: SlideModule['slides'] = [
  { render: (props) => <OpeningSlide {...props} /> },
  { render: (props) => <CtaSlide {...props} /> },
  { render: (props) => <FromPhoneSlide {...props} /> },
  { render: (props) => <DiscordDemoSlide {...props} /> },
  { render: (props) => <CcdbSlide {...props} /> },
  { render: (props) => <AnywhereSlide {...props} /> },
  { render: (props) => <AnytimeSlide {...props} /> },
  { render: (props) => <BackboneSlide {...props} /> },
  { render: (props) => <JourneySlide {...props} /> },
  { render: (props) => <ContextCoreSlide {...props} /> },
  { render: (props) => <YourWaySlide {...props} /> },
  { render: (props) => <DemoSlide {...props} /> },
  { render: (props) => <RecapSlide {...props} /> },
  { render: (props) => <FinaleSlide {...props} /> },
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
    ['01', 'ターミナルの外へ', 'ターミナル以外からもClaude Codeを動かす'],
    ['02', 'シリーズを締める', '全18回を貫いたテーマで、コースを完結させる']
  ]

  return (
    <section className="remotion-slide e18-slide e18-opening">
      <LogoMark />
      <div className="motion-grid" />
      <div className="e18-opening-copy" style={lift(title, 48)}>
        <span className="slide-kicker">Claude Codeの使い方コース ─ 第18回・最終回</span>
        <h1>
          どこからでも
          <br />
          <span className="e18-vs">Claude Code</span>
        </h1>
      </div>
      <div className="e18-goal-row">
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

function FromPhoneSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const heading = entrance(frame, fps)

  const flow = ['出先でスマホから指示', '帰り道は放っておく', '帰宅したら作業が完了']

  return (
    <section className="remotion-slide e18-slide">
      <div style={lift(heading, 24)}>
        <span className="slide-kicker">実はスマホから使ってる</span>
        <h1>ターミナルの前にいなくていい</h1>
      </div>
      <div className="e18-connect">
        <div className="e18-connect-core" style={lift(entrance(frame, fps, 18), 24)}>
          <strong>📱 指示を投げる</strong>
          <p>外出中・移動中でもOK</p>
        </div>
        <div className="e18-connect-link" style={{ opacity: entrance(frame, fps, 30) }}>
          ⇄
        </div>
        <div className="e18-connect-services">
          {flow.map((label, index) => (
            <span key={label} style={lift(entrance(frame, fps, 36 + index * 8), 20)}>
              {label}
            </span>
          ))}
        </div>
      </div>
      <p className="e18-note" style={lift(entrance(frame, fps, 80), 18)}>
        指示を投げて出かけ、<b>帰ってきたら終わっている</b>。そんな使い方が普通にできる。
      </p>
    </section>
  )
}

function DiscordDemoSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const heading = entrance(frame, fps)
  const terminal = entrance(frame, fps, 22)

  const steps = ['Discordにスレッドを作る', 'メッセージで指示を投稿', 'Claude Codeが反応して作業', '結果がDiscordに返ってくる']

  return (
    <section className="remotion-slide e18-slide">
      <div style={lift(heading, 24)}>
        <span className="slide-kicker">Discord連携の実演</span>
        <h1>チャット1本で開発が回る</h1>
      </div>
      <div className="e18-how-stage">
        <div className="e18-terminal" style={lift(terminal, 28)}>
          <div className="e18-terminal-bar">
            <span />
            <span />
            <span />
            <strong>#claude-thread</strong>
          </div>
          <div className="e18-terminal-body">
            <code className="e18-prompt">&gt; READMEに使い方を追記して</code>
            <code className="e18-output">✓ 完了しました — 差分を返信します</code>
          </div>
        </div>
        <div className="e18-steps">
          {steps.map((label, index) => (
            <div key={label} style={lift(entrance(frame, fps, 40 + index * 10), 24)}>
              <strong>{index + 1}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
      <p className="e18-note" style={lift(entrance(frame, fps, 96), 18)}>
        スマホで返信を確認すれば、それで<b>1タスク完了</b>。
      </p>
    </section>
  )
}

function CcdbSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const heading = entrance(frame, fps)
  const port = entrance(frame, fps, 24)
  const note = entrance(frame, fps, 48)

  return (
    <section className="remotion-slide e18-slide">
      <div style={lift(heading, 24)}>
        <span className="slide-kicker">仕組みは ccdb</span>
        <h1>Discord ⇄ Claude Code の橋</h1>
      </div>
      <div className="e18-port" style={lift(port, 30)}>
        <span className="e18-tag">claude-code-discord-bridge</span>
        <strong>DiscordとClaude CodeをつなぐOSS</strong>
        <p>
          私が作って<b>OSSとして公開</b>している。セットアップすれば、
          誰でも自分のDiscordから同じことができる。
        </p>
      </div>
      <p className="e18-note" style={lift(note, 18)}>
        魔法ではなく、再現可能な仕組み。手元の環境に橋を架けるだけ。
      </p>
    </section>
  )
}

function AnywhereSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const heading = entrance(frame, fps)

  const surfaces = [
    ['Cloud / Web', 'Claude Code Web から'],
    ['Desktop', '公式デスクトップアプリ'],
    ['IDE', 'エディタ拡張の中で'],
    ['CLI', 'おなじみのターミナル']
  ]

  return (
    <section className="remotion-slide e18-slide">
      <div style={lift(heading, 24)}>
        <span className="slide-kicker">どこからでも入れる</span>
        <h1>入口は1つじゃない</h1>
      </div>
      <div className="e18-surfaces">
        {surfaces.map(([name, body], index) => (
          <div key={name} style={lift(entrance(frame, fps, 26 + index * 10), 24)}>
            <strong>{name}</strong>
            <span>{body}</span>
          </div>
        ))}
      </div>
      <p className="e18-judge" style={lift(entrance(frame, fps, 78), 18)}>
        Discord連携も公式の選択肢も。<b>ターミナルは数ある入口の1つ</b>にすぎない。
      </p>
    </section>
  )
}

function AnytimeSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const heading = entrance(frame, fps)
  const left = entrance(frame, fps, 22)
  const right = entrance(frame, fps, 36)

  return (
    <section className="remotion-slide e18-slide">
      <div style={lift(heading, 24)}>
        <span className="slide-kicker">いつでも・どこでも</span>
        <h1>場所と時間から自由になる</h1>
      </div>
      <div className="e18-compare">
        <div className="e18-compare-card" style={lift(left, 30)}>
          <span className="e18-tag e18-tag-muted">これまで</span>
          <strong>机の前に座って作業</strong>
          <p>まとまった時間とPCの前を確保しないと動かせなかった。</p>
        </div>
        <div className="e18-compare-card e18-compare-accent" style={lift(right, 30)}>
          <span className="e18-tag">これから</span>
          <strong>スキマ時間でも動かせる</strong>
          <p>移動中・ソファの上でも、思いついた瞬間に指示を投げられる。</p>
        </div>
      </div>
    </section>
  )
}

function BackboneSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const heading = entrance(frame, fps)
  const card = entrance(frame, fps, 24)
  const note = entrance(frame, fps, 48)

  return (
    <section className="remotion-slide e18-slide e18-confession">
      <div style={lift(heading, 24)}>
        <span className="slide-kicker">シリーズの背骨</span>
        <h1>全18回を貫いたテーマ</h1>
      </div>
      <div className="e18-confession-card" style={lift(card, 30)}>
        <p>
          どの回も、突き詰めると同じ話に行き着いていた。
          それが<b>「コンテキスト管理」</b>。
        </p>
        <div className="e18-confession-result">
          <span>AIに渡す文脈の質</span>
          <strong>=成果</strong>
          <span>今日の「どこからでも」も</span>
          <strong>文脈を運ぶ話</strong>
        </div>
      </div>
      <p className="e18-note" style={lift(note, 18)}>
        ツールが変わっても、根っこはずっと<b>コンテキスト</b>だった。
      </p>
    </section>
  )
}

function JourneySlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const heading = entrance(frame, fps)

  const steps = ['CLAUDE.md', 'カスタムコマンド', 'Hooks', 'サブエージェント', 'MCP', '第2の脳']

  return (
    <section className="remotion-slide e18-slide">
      <div style={lift(heading, 24)}>
        <span className="slide-kicker">学びの旅</span>
        <h1>すべては一本の道だった</h1>
      </div>
      <div className="e18-journey">
        {steps.map((label, index) => (
          <div key={label} className="e18-journey-step" style={lift(entrance(frame, fps, 22 + index * 9), 24)}>
            <strong>{index + 1}</strong>
            <span>{label}</span>
          </div>
        ))}
      </div>
      <p className="e18-judge" style={lift(entrance(frame, fps, 84), 18)}>
        バラバラの機能ではなく、<b>「どう文脈を設計し・渡し・育てるか」</b>でつながっていた。
      </p>
    </section>
  )
}

function ContextCoreSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const heading = entrance(frame, fps)
  const card = entrance(frame, fps, 24)
  const note = entrance(frame, fps, 48)

  return (
    <section className="remotion-slide e18-slide">
      <div style={lift(heading, 24)}>
        <span className="slide-kicker">締めのメッセージ</span>
        <h1>コンテキスト管理が全ての基本</h1>
      </div>
      <div className="e18-port" style={lift(card, 30)}>
        <span className="e18-tag">本質はここ</span>
        <strong>ツールやコマンドは入口にすぎない</strong>
        <p>
          良い文脈を渡せば、Claude Codeは<b>強力な相棒</b>になる。
          この一点を押さえれば、新機能が出ても応用が効く。
        </p>
      </div>
      <p className="e18-note" style={lift(note, 18)}>
        18回かけて伝えたかったのは、結局この一言に尽きる。
      </p>
    </section>
  )
}

function YourWaySlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const heading = entrance(frame, fps)
  const left = entrance(frame, fps, 22)
  const right = entrance(frame, fps, 36)
  const note = entrance(frame, fps, 54)

  return (
    <section className="remotion-slide e18-slide">
      <div style={lift(heading, 24)}>
        <span className="slide-kicker">あなたの使い方次第</span>
        <h1>道具は、組み立てるもの</h1>
      </div>
      <div className="e18-choose">
        <div className="e18-choose-card e18-choose-accent" style={lift(left, 30)}>
          <span className="e18-tag">事実</span>
          <strong>Claude Codeはどこからでも動く</strong>
          <p>ターミナル・Discord・Web・Desktop・IDE、入口は自由。</p>
        </div>
        <div className="e18-choose-card" style={lift(right, 30)}>
          <span className="e18-tag e18-tag-muted">あとは</span>
          <strong>どう使うかはあなた次第</strong>
          <p>自分の生活と仕事に合わせて、道具を組み立てていけばいい。</p>
        </div>
      </div>
      <p className="e18-judge" style={lift(note, 18)}>
        シリーズはここで一区切り。でも<b>実践はここから始まる。</b>
      </p>
    </section>
  )
}

function DemoSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const heading = entrance(frame, fps)

  const items: ReadonlyArray<readonly [string, string]> = [
    ['スマホ(Discord)から指示', 'スレッドにメッセージを送る'],
    ['Claudeが作業', '反応して作業を進める様子を見せる'],
    ['結果が返る', 'スマホに結果が返り、完了を確認する']
  ]

  return (
    <section className="remotion-slide e18-slide demo-slide">
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
    'Claude Codeはターミナル専用じゃない',
    'Discord連携(ccdb)でどこからでも指示できる',
    '公式にもWeb / Desktop / IDE / CLIの入口がある',
    '全18回を貫いたのはコンテキスト管理。最後は使い方次第'
  ]

  return (
    <section className="remotion-slide e18-slide">
      <div style={lift(heading, 24)}>
        <span className="slide-kicker">まとめ</span>
        <h1>今日のポイント</h1>
      </div>
      <div className="e18-recap">
        {points.map((point, index) => (
          <div key={point} style={lift(entrance(frame, fps, 22 + index * 11), 24)}>
            <span className="e18-check">✓</span>
            <p>{point}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function FinaleSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const title = entrance(frame, fps)
  const card = entrance(frame, fps, 26)
  const cta = entrance(frame, fps, 44)

  return (
    <section className="remotion-slide e18-slide e18-next">
      <div className="motion-grid" />
      <div style={lift(title, 30)}>
        <span className="slide-kicker">全18回・完結</span>
        <h1>ありがとうございました</h1>
      </div>
      <div className="e18-next-card" style={lift(card, 28)}>
        <strong>Claude Codeの使い方コース</strong>
        <span>全18回、最後までご視聴ありがとう！</span>
        <p>ここで一区切り。これからも一緒にClaude Codeを楽しんでいきましょう。</p>
      </div>
      <p className="e18-cta" style={lift(cta, 18)}>
        チャンネル登録 &amp; メンバーシップ登録もよろしくお願いします！
      </p>
    </section>
  )
}
