/* eslint-disable react-refresh/only-export-components */
import { spring, useVideoConfig } from 'remotion'
import type { SlideModule, SlideRenderContext } from '../../../src/types'
import { CtaSlide, LogoMark } from '../../../src/deck-shared'

export const slides: SlideModule['slides'] = [
  { render: (props) => <OpeningSlide {...props} /> },
  { render: (props) => <CtaSlide {...props} /> },
  { render: (props) => <ForEngineersSlide {...props} /> },
  { render: (props) => <InstructVsVerifySlide {...props} /> },
  { render: (props) => <WhatIsATestSlide {...props} /> },
  { render: (props) => <TddLoopSlide {...props} /> },
  { render: (props) => <ScreenshotCheckSlide {...props} /> },
  { render: (props) => <BridgeToHooksSlide {...props} /> },
  { render: (props) => <TypecheckHookSlide {...props} /> },
  { render: (props) => <ClaudeReviewsClaudeSlide {...props} /> },
  { render: (props) => <CommonHooksSlide {...props} /> },
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
  const note = entrance(frame, fps, 56)

  return (
    <section className="remotion-slide e16-slide">
      <div style={lift(heading, 24)}>
        <span className="slide-kicker">公式いわく「最もレバレッジが高い」</span>
        <h1>指示するだけ vs 検証を渡す</h1>
      </div>
      <div className="e16-compare">
        <div className="e16-compare-card" style={lift(left, 30)}>
          <span className="e16-tag e16-tag-muted">指示するだけ</span>
          <strong>「メールアドレスを検証する関数を作って」</strong>
          <p>できたかどうかは人間が見るまで分からない。Claudeは「できたっぽい」で止まる。</p>
        </div>
        <div className="e16-compare-card e16-compare-accent" style={lift(right, 30)}>
          <span className="e16-tag">検証を渡す</span>
          <strong>
            「validateEmail を書いて。
            <br />
            書いたらテストを実行して」
          </strong>
          <p className="e16-cases">
            user@example.com → true ／ invalid → false ／ user@.com → false
          </p>
          <p>合否が自動で出る。Claudeは通るまで自分で直し続けられる。</p>
        </div>
      </div>
      <p className="e16-note" style={lift(note, 18)}>
        渡すのは「テスト・ビルド・スクリーンショット」など<b>Claude自身が走らせて合否を読めるもの</b>。
      </p>
    </section>
  )
}

function WhatIsATestSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const heading = entrance(frame, fps)
  const table = entrance(frame, fps, 22)
  const terminal = entrance(frame, fps, 44)
  const note = entrance(frame, fps, 66)

  const cases: ReadonlyArray<readonly [string, string]> = [
    ['user@example.com', 'true（正しい）'],
    ['invalid', 'false（間違い）'],
    ['user@.com', 'false（間違い）']
  ]

  return (
    <section className="remotion-slide e16-slide">
      <div style={lift(heading, 24)}>
        <span className="slide-kicker">テストを知らない方へ</span>
        <h1>「テスト」＝入力と正解の対応表</h1>
      </div>
      <div className="e16-testcases" style={lift(table, 28)}>
        <div className="e16-testcase e16-testcase-head">
          <span>入力</span>
          <span>期待する答え</span>
        </div>
        {cases.map(([input, expected], index) => (
          <div
            key={input}
            className="e16-testcase"
            style={lift(entrance(frame, fps, 30 + index * 10), 20)}
          >
            <code>{input}</code>
            <span>{expected}</span>
          </div>
        ))}
      </div>
      <div className="e16-terminal" style={lift(terminal, 26)}>
        <div className="e16-terminal-bar">
          <span />
          <span />
          <span />
          <strong>npm test</strong>
        </div>
        <div className="e16-terminal-body">
          <code className="e16-output">✓ user@example.com → true</code>
          <code className="e16-fail">✗ user@.com → true になっている（期待は false）</code>
        </div>
      </div>
      <p className="e16-note" style={lift(note, 18)}>
        これをコードで書いておくと、<b>機械が自動で採点</b>してくれる。人の目視が要らなくなる。
      </p>
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
  const card = entrance(frame, fps, 22)
  const browser = entrance(frame, fps, 46)

  return (
    <section className="remotion-slide e16-slide">
      <div style={lift(heading, 24)}>
        <span className="slide-kicker">検証はコードだけじゃない</span>
        <h1>見た目もClaudeが自分で確かめる</h1>
      </div>
      <div className="e16-port" style={lift(card, 30)}>
        <span className="e16-tag">プロンプト例</span>
        <strong>
          {'「［デザイン画像］この通りに実装して。できたらスクリーンショットを撮って元画像と見比べて、違うところを列挙して直して」'}
        </strong>
        <p>「よくして」ではなく<b>比べる対象</b>を渡す。ズレを自分で見つけて直すまで回る。</p>
      </div>
      <div className="e16-browser" style={lift(browser, 28)}>
        <span className="e16-tag e16-tag-warn">重要</span>
        <strong>Claude Code自身がブラウザを開いて「見る」ことができる</strong>
        <p>
          <code>claude --chrome</code> でChrome拡張とつなぐと、Claudeが自分で
          <code>localhost:3000</code>
          {'を開き、フォームに入力し、スクショを撮り、コンソールのエラーまで読む。'}
          <b>人がスクショを撮って貼る必要すらない。</b>
        </p>
        <p className="e16-browser-example">
          例：「ログイン画面を開いて、わざと不正な値を入れて、エラーが正しく出るか確かめて」
        </p>
      </div>
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
  const note = entrance(frame, fps, 70)

  const script: ReadonlyArray<readonly [string, string]> = [
    ['dim', '# PostToolUse（Write / Edit のあと）に走らせる'],
    ['plain', 'FILE=$(jq -r \'.tool_input.file_path\')'],
    ['plain', 'VERDICT=$(claude -p "'],
    ['plain', '  $FILE に今書いた関数が、既存の関数と重複していないか調べて。'],
    ['plain', '  src/ 以下を Grep と Read で探すこと。名前が違っても中身が同じなら重複。'],
    ['plain', '  重複があれば DUP:<関数名> <パス:行> を、なければ OK だけを1行で返して。" \\'],
    ['plain', '  --allowedTools "Read,Grep,Glob" --model haiku)'],
    ['plain', '[ "$VERDICT" = OK ] || { echo "$VERDICT" >&2; exit 2; }']
  ]

  const points: ReadonlyArray<readonly [string, string]> = [
    ['何を見ればいい?', 'stdinのJSONから編集されたファイルのパスを取り、プロンプトに埋める'],
    ['どう調べればいい?', '探す場所と、Read / Grep を使えることを明示する'],
    ['どう答えればいい?', '出力の形を固定する。だからシェルで合否を判定できる']
  ]

  return (
    <section className="remotion-slide e16-slide">
      <div style={lift(heading, 24)}>
        <span className="slide-kicker">高度なHook ②</span>
        <h1>Claude→Claudeの審査</h1>
      </div>
      <div className="e16-terminal e16-terminal-script" style={lift(terminal, 28)}>
        <div className="e16-terminal-bar">
          <span />
          <span />
          <span />
          <strong>.claude/hooks/dup-check.sh</strong>
        </div>
        <div className="e16-terminal-body">
          {script.map(([kind, line], index) => (
            <code
              key={index}
              className={kind === 'dim' ? 'e16-dim' : 'e16-prompt'}
              style={lift(entrance(frame, fps, 26 + index * 3), 12)}
            >
              {line || '\u00a0'}
            </code>
          ))}
        </div>
      </div>
      <div className="e16-examples e16-examples-row">
        {points.map(([q, a], index) => (
          <div key={q} style={lift(entrance(frame, fps, 56 + index * 10), 24)}>
            <strong>{q}</strong>
            <span>{a}</span>
          </div>
        ))}
      </div>
      <p className="e16-note" style={lift(note, 18)}>
        <b>丸投げでは動かない。</b>別のClaudeは会話を引き継がない。判定は <code>exit 2</code>
        の標準エラー出力で本体のClaudeに返る。
      </p>
    </section>
  )
}

function CommonHooksSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const heading = entrance(frame, fps)

  const hooks: ReadonlyArray<readonly [string, string, string]> = [
    ['ファイル編集のあと', 'PostToolUse', 'eslint / prettier を自動で走らせて、整形と指摘をその場で返す'],
    ['ファイル編集のまえ', 'PreToolUse', 'DBのmigrationsフォルダなど、触ってほしくない場所への書き込みをブロック'],
    ['作業を終えるとき', 'Stop', 'テストを走らせ、失敗している間はターンを終わらせない']
  ]

  return (
    <section className="remotion-slide e16-slide">
      <div style={lift(heading, 24)}>
        <span className="slide-kicker">よくある使い方</span>
        <h1>Hookの定番3パターン</h1>
      </div>
      <div className="e16-hooks">
        {hooks.map(([when, name, body], index) => (
          <div key={name} style={lift(entrance(frame, fps, 24 + index * 12), 26)}>
            <span className="e16-hook-when">{when}</span>
            <strong>{name}</strong>
            <span>{body}</span>
          </div>
        ))}
      </div>
      <p className="e16-note" style={lift(entrance(frame, fps, 70), 18)}>
        Hookは自分で書かなくていい。<b>「ファイル編集のたびにeslintを走らせるHookを書いて」</b>とClaudeに頼めば作ってくれる。
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
  const prompt = entrance(frame, fps, 24)
  const steps = entrance(frame, fps, 48)

  const watch = [
    'Claudeが先にテストを書く（この時点では当然、失敗する）',
    '実装する → テストを自分で実行する → 失敗を読む',
    '直して再実行。全部通るまで、こちらは何も言わない'
  ]

  return (
    <section className="remotion-slide e16-slide demo-slide">
      <div style={lift(heading, 24)}>
        <span className="demo-badge">▶ 実演 / LIVE DEMO</span>
        <h1>テスト駆動ループを回す</h1>
      </div>
      <div className="e16-terminal" style={lift(prompt, 28)}>
        <div className="e16-terminal-bar">
          <span />
          <span />
          <span />
          <strong>claude</strong>
        </div>
        <div className="e16-terminal-body">
          <code className="e16-prompt">&gt; メールアドレスを検証する validateEmail を作って。TDDで進めて。</code>
          <code className="e16-prompt">&gt; テストが全部通るまで、自分で直し続けて。</code>
        </div>
      </div>
      <div className="e16-recap" style={lift(steps, 22)}>
        {watch.map((line, index) => (
          <div key={line} style={lift(entrance(frame, fps, 56 + index * 10), 20)}>
            <span className="e16-check">{index + 1}</span>
            <p>{line}</p>
          </div>
        ))}
      </div>
      <p className="demo-foot" style={lift(entrance(frame, fps, 92), 18)}>
        極端な話、<b>「TDDで進めて」</b>と書くだけでもループは回りはじめる。
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
    '見た目はClaude自身がブラウザを開いてスクショで確認できる',
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
