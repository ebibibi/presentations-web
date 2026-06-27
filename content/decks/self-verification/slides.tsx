/* eslint-disable react-refresh/only-export-components */
import { spring, useVideoConfig } from 'remotion'
import type { SlideModule, SlideRenderContext } from '../../../src/types'
import { CtaSlide, LogoMark } from '../../../src/deck-shared'

export const slides: SlideModule['slides'] = [
  { render: (props) => <OpeningSlide {...props} /> },
  { render: (props) => <CtaSlide {...props} /> },
  { render: (props) => <ForEngineersSlide {...props} /> },
  { render: (props) => <InstructVsVerifySlide {...props} /> },
  { render: (props) => <TddLoopSlide {...props} /> },
  { render: (props) => <ScreenshotCheckSlide {...props} /> },
  { render: (props) => <BridgeToHooksSlide {...props} /> },
  { render: (props) => <TypecheckHookSlide {...props} /> },
  { render: (props) => <ClaudeReviewsClaudeSlide {...props} /> },
  { render: (props) => <MyRealHooksSlide {...props} /> },
  { render: (props) => <PhilosophySlide {...props} /> },
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
    ['01', 'テストで品質を上げる', 'Claudeに合格基準を渡して、自分で答え合わせさせる'],
    ['02', 'Hookで検証を仕組み化', '第8回のHookを発展させ、検証そのものを自動化する']
  ]

  return (
    <section className="remotion-slide e16-slide e16-opening">
      <LogoMark />
      <div className="motion-grid" />
      <div className="e16-opening-copy" style={lift(title, 48)}>
        <span className="slide-kicker">Claude Codeの使い方コース ─ 第16回</span>
        <h1>
          自己検証
          <br />
          <span className="e16-vs">テスト駆動 &amp; 高度なHook</span>
        </h1>
      </div>
      <div className="e16-goal-row">
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

function ForEngineersSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const heading = entrance(frame, fps)
  const card = entrance(frame, fps, 24)
  const note = entrance(frame, fps, 48)

  return (
    <section className="remotion-slide e16-slide">
      <div style={lift(heading, 24)}>
        <span className="slide-kicker">最初に正直に</span>
        <h1>ここからエンジニア向け</h1>
      </div>
      <div className="e16-port" style={lift(card, 30)}>
        <span className="e16-tag e16-tag-warn">難易度 🔴</span>
        <strong>プログラムを書く方向けの回</strong>
        <p>
          非エンジニアの方は<b>第15回まで</b>で実用上は十分。
          ここから先は踏み込んだ内容になる。
        </p>
      </div>
      <p className="e16-note" style={lift(note, 18)}>
        とはいえ、たとえ話を交えて噛み砕いて説明する。興味があればぜひ。
      </p>
    </section>
  )
}

function InstructVsVerifySlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const heading = entrance(frame, fps)
  const left = entrance(frame, fps, 22)
  const right = entrance(frame, fps, 36)

  return (
    <section className="remotion-slide e16-slide">
      <div style={lift(heading, 24)}>
        <span className="slide-kicker">公式いわく「最もレバレッジが高い」</span>
        <h1>指示するだけ vs 検証を渡す</h1>
      </div>
      <div className="e16-compare">
        <div className="e16-compare-card" style={lift(left, 30)}>
          <span className="e16-tag e16-tag-muted">指示するだけ</span>
          <strong>「美味しい料理を作って」</strong>
          <p>ゴールが曖昧。合っているか、Claude自身には確かめようがない。</p>
        </div>
        <div className="e16-compare-card e16-compare-accent" style={lift(right, 30)}>
          <span className="e16-tag">検証を渡す</span>
          <strong>「この味見テストに合格する料理を作って」</strong>
          <p>合否の基準ごと渡す。Claudeが自分で答え合わせできるようになる。</p>
        </div>
      </div>
    </section>
  )
}

function TddLoopSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const heading = entrance(frame, fps)
  const terminal = entrance(frame, fps, 22)
  const judge = entrance(frame, fps, 56)

  const steps = ['テストを渡す', '実行 → 失敗を検知', '原因を直して再実行 → 成功']

  return (
    <section className="remotion-slide e16-slide">
      <div style={lift(heading, 24)}>
        <span className="slide-kicker">テスト駆動</span>
        <h1>失敗→修正→成功の自己修正ループ</h1>
      </div>
      <div className="e16-how-stage">
        <div className="e16-terminal" style={lift(terminal, 28)}>
          <div className="e16-terminal-bar">
            <span />
            <span />
            <span />
            <strong>claude</strong>
          </div>
          <div className="e16-terminal-body">
            <code className="e16-prompt">&gt; このテストに合格するまで直して</code>
            <code className="e16-fail">✗ 2 failed — fixing...</code>
            <code className="e16-output">✓ all tests passed</code>
          </div>
        </div>
        <div className="e16-steps">
          {steps.map((label, index) => (
            <div key={label} style={lift(entrance(frame, fps, 40 + index * 12), 24)}>
              <strong>{index + 1}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
      <p className="e16-judge" style={lift(judge, 20)}>
        人が逐一チェックしなくても、合格するまでClaudeが直し続ける。<b>TDDと好相性。</b>
      </p>
    </section>
  )
}

function ScreenshotCheckSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const heading = entrance(frame, fps)
  const card = entrance(frame, fps, 24)
  const note = entrance(frame, fps, 48)

  return (
    <section className="remotion-slide e16-slide">
      <div style={lift(heading, 24)}>
        <span className="slide-kicker">検証はコードだけじゃない</span>
        <h1>スクリーンショットで見た目を検証</h1>
      </div>
      <div className="e16-port" style={lift(card, 30)}>
        <span className="e16-tag">UI変更</span>
        <strong>「この画面、デザイン通り?」</strong>
        <p>
          画面のスクリーンショットを撮ってClaudeに見せれば、
          <b>見た目という主観的なゴール</b>も検証の対象にできる。
        </p>
      </div>
      <p className="e16-note" style={lift(note, 18)}>
        テキストの合否だけでなく、目で見て確かめる検証も任せられる。
      </p>
    </section>
  )
}

function BridgeToHooksSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const heading = entrance(frame, fps)
  const port = entrance(frame, fps, 24)
  const note = entrance(frame, fps, 48)

  return (
    <section className="remotion-slide e16-slide">
      <div style={lift(heading, 24)}>
        <span className="slide-kicker">後半へ</span>
        <h1>Hookの応用へ</h1>
      </div>
      <div className="e16-port" style={lift(port, 30)}>
        <span className="e16-tag">第8回の続き</span>
        <strong>「検証を手でやる」から「自動で回す」へ</strong>
        <p>
          第8回で学んだHook（決まったタイミングで自動実行する仕組み）を、
          ここからは<b>検証の自動化</b>に応用していく。
        </p>
      </div>
      <p className="e16-note" style={lift(note, 18)}>
        基本のHookから、一歩踏み込んだ高度な実例へ。
      </p>
    </section>
  )
}

function TypecheckHookSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const heading = entrance(frame, fps)
  const terminal = entrance(frame, fps, 22)

  const steps = ['ファイル編集を検知', 'tsc --noEmit を自動実行', '型エラーをClaudeに返して自動修正']

  return (
    <section className="remotion-slide e16-slide">
      <div style={lift(heading, 24)}>
        <span className="slide-kicker">高度なHook ①</span>
        <h1>型チェックHook</h1>
      </div>
      <div className="e16-how-stage">
        <div className="e16-terminal" style={lift(terminal, 28)}>
          <div className="e16-terminal-bar">
            <span />
            <span />
            <span />
            <strong>PostToolUse hook</strong>
          </div>
          <div className="e16-terminal-body">
            <code className="e16-prompt">$ tsc --noEmit</code>
            <code className="e16-fail">✗ src/app.ts:12 — type error</code>
            <code className="e16-output">↩ Claudeに返す → 自動で修正</code>
          </div>
        </div>
        <div className="e16-steps">
          {steps.map((label, index) => (
            <div key={label} style={lift(entrance(frame, fps, 40 + index * 12), 24)}>
              <strong>{index + 1}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
      <p className="e16-judge" style={lift(entrance(frame, fps, 84), 20)}>
        編集するたびに型チェックが走り、<b>編集と検証がワンセット</b>で回る。
      </p>
    </section>
  )
}

function ClaudeReviewsClaudeSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const heading = entrance(frame, fps)
  const terminal = entrance(frame, fps, 22)
  const note = entrance(frame, fps, 56)

  return (
    <section className="remotion-slide e16-slide">
      <div style={lift(heading, 24)}>
        <span className="slide-kicker">高度なHook ②</span>
        <h1>Claude→Claudeの審査</h1>
      </div>
      <div className="e16-how-stage">
        <div className="e16-terminal" style={lift(terminal, 28)}>
          <div className="e16-terminal-bar">
            <span />
            <span />
            <span />
            <strong>review hook</strong>
          </div>
          <div className="e16-terminal-body">
            <code className="e16-prompt">$ claude -p &quot;既存と重複してない?&quot;</code>
            <code className="e16-output">✓ 別Claudeが審査して回答</code>
          </div>
        </div>
        <div className="e16-examples">
          <div style={lift(entrance(frame, fps, 40), 24)}>
            <strong>別インスタンスを起動</strong>
            <span>Hookからclaude -pで第二のClaudeを呼ぶ</span>
          </div>
          <div style={lift(entrance(frame, fps, 52), 24)}>
            <strong>重複をチェック</strong>
            <span>新しい関数が既存と被っていないか審査</span>
          </div>
        </div>
      </div>
      <p className="e16-note" style={lift(note, 18)}>
        Claudeの仕事を、もう一人のClaudeが<b>二重チェック</b>する仕組み。
      </p>
    </section>
  )
}

function MyRealHooksSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const heading = entrance(frame, fps)

  const hooks = [
    ['SessionStart', '起動時にプロジェクトの文脈を自動ロード'],
    ['Stop', '作業ログをObsidianに自動保存'],
    ['UserPromptSubmit', '送信前にメッセージを前処理（言語設定など）']
  ]

  return (
    <section className="remotion-slide e16-slide">
      <div style={lift(heading, 24)}>
        <span className="slide-kicker">実例</span>
        <h1>私の実際のHook</h1>
      </div>
      <div className="e16-hooks">
        {hooks.map(([name, body], index) => (
          <div key={name} style={lift(entrance(frame, fps, 24 + index * 12), 26)}>
            <strong>{name}</strong>
            <span>{body}</span>
          </div>
        ))}
      </div>
      <p className="e16-note" style={lift(entrance(frame, fps, 70), 18)}>
        検証だけでなく、<b>記録や前処理</b>まで仕組みに任せられる。
      </p>
    </section>
  )
}

function PhilosophySlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const heading = entrance(frame, fps)
  const left = entrance(frame, fps, 22)
  const right = entrance(frame, fps, 36)

  return (
    <section className="remotion-slide e16-slide">
      <div style={lift(heading, 24)}>
        <span className="slide-kicker">今日の核心</span>
        <h1>検証は「仕組み」に組み込む</h1>
      </div>
      <div className="e16-fit">
        <div className="e16-fit-col e16-fit-bad" style={lift(left, 28)}>
          <span className="e16-fit-head">人にやらせる</span>
          <p>毎回その都度チェック</p>
          <p>抜け漏れが起きる</p>
          <p>スケールしない</p>
        </div>
        <div className="e16-fit-col e16-fit-good" style={lift(right, 28)}>
          <span className="e16-fit-head">仕組みに組み込む</span>
          <p>テストとHookで自動で回る</p>
          <p>一度作れば回り続ける</p>
          <p>人間は基準を決める側に回る</p>
        </div>
      </div>
      <p className="e16-judge" style={lift(entrance(frame, fps, 60), 18)}>
        答え合わせをClaudeと仕組みに任せるのが、<b>品質を底上げする一番の近道。</b>
      </p>
    </section>
  )
}

function DemoSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const heading = entrance(frame, fps)

  const items: ReadonlyArray<readonly [string, string]> = [
    ['テスト駆動ループ', 'テストを渡し、失敗→修正→成功まで自走させる'],
    ['スクショ検証', 'UIのスクリーンショットを見せて「デザイン通り?」と確認する'],
    ['型チェックHook', 'ファイル編集後に tsc が自動で走り、型エラーを自動修正']
  ]

  return (
    <section className="remotion-slide e16-slide demo-slide">
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
    '自己検証はレバレッジ最大 ─ 合格基準ごと渡す',
    'テスト → 失敗 → 修正 → 成功の自己修正ループが回る',
    'UIはスクショで「デザイン通り?」と検証できる',
    'Hookは型チェック・Claude同士の審査まで発展',
    '検証は人ではなく「仕組み」に組み込む'
  ]

  return (
    <section className="remotion-slide e16-slide">
      <div style={lift(heading, 24)}>
        <span className="slide-kicker">まとめ</span>
        <h1>今日のポイント</h1>
      </div>
      <div className="e16-recap">
        {points.map((point, index) => (
          <div key={point} style={lift(entrance(frame, fps, 22 + index * 10), 24)}>
            <span className="e16-check">✓</span>
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
    <section className="remotion-slide e16-slide e16-next">
      <div className="motion-grid" />
      <div style={lift(title, 30)}>
        <span className="slide-kicker">次回予告</span>
        <h1>チームと本番運用へ</h1>
      </div>
      <div className="e16-next-card" style={lift(card, 28)}>
        <strong>第17回</strong>
        <span>大規模開発 ─ CI/CD・SDK</span>
        <p>個人の道具から、CI/CDへの組み込みやSDKでの自動化へとスケールさせる。</p>
      </div>
      <p className="e16-cta" style={lift(cta, 18)}>
        チャンネル登録 &amp; メンバーシップ登録もよろしくお願いします！
      </p>
    </section>
  )
}
