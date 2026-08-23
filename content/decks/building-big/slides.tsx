/* eslint-disable react-refresh/only-export-components */
import type { ReactNode } from 'react'
import { spring, useVideoConfig } from 'remotion'
import type { SlideModule, SlideRenderContext } from '../../../src/types'
import { CtaSlide, LogoMark } from '../../../src/deck-shared'

export const slides: SlideModule['slides'] = [
  { render: (props) => <OpeningSlide {...props} /> },
  { render: (props) => <CtaSlide {...props} /> },
  { render: (props) => <DumpProblemSlide {...props} /> },
  { render: (props) => <SpecFirstSlide {...props} /> },
  { render: (props) => <WhoDecidesSlide {...props} /> },
  { render: (props) => <WriterReviewerSlide {...props} /> },
  { render: (props) => <ParallelSlide {...props} /> },
  { render: (props) => <GithubSlide {...props} /> },
  { render: (props) => <ClaudePSlide {...props} /> },
  { render: (props) => <SdkSlide {...props} /> },
  { render: (props) => <PipelineSlide {...props} /> },
  { render: (props) => <DemoInterviewSlide {...props} /> },
  { render: (props) => <DemoBuildSlide {...props} /> },
  { render: (props) => <DemoPipelineSlide {...props} /> },
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
    ['01', '大きい仕事の渡し方', '丸投げせず、仕様書・別視点・並列で大規模をさばく'],
    ['02', 'パイプラインに組み込む', 'GitHub連携・claude -p・SDKでCI/CDの中にClaudeを置く']
  ]

  return (
    <section className="remotion-slide e17-slide e17-opening">
      <LogoMark />
      <div className="motion-grid" />
      <div className="e17-opening-copy" style={lift(title, 48)}>
        <span className="slide-kicker">Claude Codeの使い方コース ─ 第17回</span>
        <h1>
          大規模開発
          <br />
          <span className="e17-vs">CI/CD・SDK</span>
        </h1>
      </div>
      <div className="e17-goal-row">
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

function DumpProblemSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const heading = entrance(frame, fps)
  const left = entrance(frame, fps, 22)
  const right = entrance(frame, fps, 36)

  return (
    <section className="remotion-slide e17-slide">
      <div style={lift(heading, 24)}>
        <span className="slide-kicker">大きい仕事の渡し方</span>
        <h1>「全部やって」は事故る</h1>
      </div>
      <div className="e17-compare">
        <div className="e17-compare-card" style={lift(left, 30)}>
          <span className="e17-tag e17-tag-muted">事故①</span>
          <strong>コンテキスト切れ</strong>
          <p>途中で文脈があふれ、最初に渡した指示を忘れてしまう。</p>
        </div>
        <div className="e17-compare-card" style={lift(right, 30)}>
          <span className="e17-tag e17-tag-muted">事故②</span>
          <strong>方向のズレ → 手戻り</strong>
          <p>全体像がないまま進み、後から大きな作り直しが発生する。</p>
        </div>
      </div>
      <p className="e17-note" style={lift(entrance(frame, fps, 56), 18)}>
        地図なしで大工事を始めるイメージ。だから<b>渡す前の準備</b>が要る。
      </p>
    </section>
  )
}

function SpecFirstSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const heading = entrance(frame, fps)
  const terminal = entrance(frame, fps, 22)

  const steps = ['まずClaudeにこちらをインタビューさせる', 'やり取りからSPEC.md（仕様書）を作る', '実装前に仕様書をコンテキストへ読み込む']

  return (
    <section className="remotion-slide e17-slide">
      <div style={lift(heading, 24)}>
        <span className="slide-kicker">解決策 ①</span>
        <h1>仕様書を先に書く</h1>
      </div>
      <div className="e17-how-stage">
        <div className="e17-terminal" style={lift(terminal, 28)}>
          <div className="e17-terminal-bar">
            <span />
            <span />
            <span />
            <strong>claude</strong>
          </div>
          <div className="e17-terminal-body">
            <code className="e17-prompt">&gt; 実装の前に仕様を詰めたい。質問して</code>
            <code className="e17-output">created SPEC.md</code>
          </div>
        </div>
        <div className="e17-steps">
          {steps.map((label, index) => (
            <div key={label} style={lift(entrance(frame, fps, 40 + index * 12), 24)}>
              <strong>{index + 1}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
      <p className="e17-judge" style={lift(entrance(frame, fps, 90), 18)}>
        設計図を先に描いてから工事する。<b>仕様を共有すれば方向はズレない。</b>
      </p>
    </section>
  )
}

function WhoDecidesSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const heading = entrance(frame, fps)
  const left = entrance(frame, fps, 22)
  const right = entrance(frame, fps, 36)

  return (
    <section className="remotion-slide e17-slide">
      <div style={lift(heading, 24)}>
        <span className="slide-kicker">仕様の役割分担</span>
        <h1>誰が何を決めるか</h1>
      </div>
      <div className="e17-compare">
        <div className="e17-compare-card e17-compare-accent" style={lift(left, 30)}>
          <span className="e17-tag">人間が決める</span>
          <strong>要件・優先順位</strong>
          <p>何を作るか、何を大事にするか。ここは人間の判断が正本。</p>
        </div>
        <div className="e17-compare-card" style={lift(right, 30)}>
          <span className="e17-tag e17-tag-muted">Claudeが決める</span>
          <strong>実装方法</strong>
          <p>どう作るか。細部の設計と実装はClaudeに任せる。</p>
        </div>
      </div>
      <p className="e17-note" style={lift(entrance(frame, fps, 56), 18)}>
        この線引きを仕様書で<b>はっきり分ける</b>のが大規模の肝。
      </p>
    </section>
  )
}

function WriterReviewerSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const heading = entrance(frame, fps)
  const left = entrance(frame, fps, 22)
  const right = entrance(frame, fps, 36)

  return (
    <section className="remotion-slide e17-slide">
      <div style={lift(heading, 24)}>
        <span className="slide-kicker">解決策 ②</span>
        <h1>Writer / Reviewer</h1>
      </div>
      <div className="e17-compare">
        <div className="e17-compare-card" style={lift(left, 30)}>
          <span className="e17-tag e17-tag-muted">セッション1</span>
          <strong>Writer ─ 実装役</strong>
          <p>仕様書をもとに、ひたすら手を動かして書き上げる。</p>
        </div>
        <div className="e17-compare-card e17-compare-accent" style={lift(right, 30)}>
          <span className="e17-tag">セッション2</span>
          <strong>Reviewer ─ 別のClaude</strong>
          <p>別人格としてレビュー。わざと「別の視点」で間違いを捕まえる。</p>
        </div>
      </div>
      <p className="e17-judge" style={lift(entrance(frame, fps, 56), 18)}>
        同じ頭は自分のミスに気づきにくい。<b>二段構えで質を上げる。</b>
      </p>
    </section>
  )
}

function ParallelSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const heading = entrance(frame, fps)

  const sessions = [
    ['Claude A', 'API実装', 'var(--teal)'],
    ['Claude B', 'UI実装', 'var(--coral)'],
    ['Claude C', 'テスト整備', 'var(--violet)']
  ] as const

  return (
    <section className="remotion-slide e17-slide">
      <div style={lift(heading, 24)}>
        <span className="slide-kicker">解決策 ③</span>
        <h1>並列セッション</h1>
      </div>
      <div className="e17-parallel">
        {sessions.map(([name, task, color], index) => (
          <div key={name} className="e17-parallel-card" style={lift(entrance(frame, fps, 24 + index * 12), 26)}>
            <span className="e17-parallel-dot" style={{ background: color }} />
            <strong>{name}</strong>
            <p>{task}</p>
            <small>独立したコンテキスト</small>
          </div>
        ))}
      </div>
      <p className="e17-judge" style={lift(entrance(frame, fps, 66), 18)}>
        別タスク・別文脈なので<b>干渉しない</b>。第9回サブエージェントの発展形。
      </p>
    </section>
  )
}

function GithubSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const heading = entrance(frame, fps)
  const terminal = entrance(frame, fps, 22)

  const examples = [
    ['Mention Action', 'Issue/PRに @claude → 応答・作業'],
    ['PR Action', 'PRを自動レビュー・影響範囲を分析'],
    ['ツール権限', '設定でできることを管理']
  ]

  return (
    <section className="remotion-slide e17-slide">
      <div style={lift(heading, 24)}>
        <span className="slide-kicker">パイプライン編</span>
        <h1>GitHub統合</h1>
      </div>
      <div className="e17-how-stage">
        <div className="e17-terminal" style={lift(terminal, 28)}>
          <div className="e17-terminal-bar">
            <span />
            <span />
            <span />
            <strong>claude</strong>
          </div>
          <div className="e17-terminal-body">
            <code className="e17-prompt">&gt; /install-github-app</code>
            <code className="e17-output">✓ GitHub App installed — @claude が使える</code>
          </div>
        </div>
        <div className="e17-examples">
          {examples.map(([name, body], index) => (
            <div key={name} style={lift(entrance(frame, fps, 40 + index * 10), 24)}>
              <strong>{name}</strong>
              <span>{body}</span>
            </div>
          ))}
        </div>
      </div>
      <p className="e17-note" style={lift(entrance(frame, fps, 90), 18)}>
        一発でセットアップ。<b>チームの開発フローにClaudeが住み着く。</b>
        <br />
        ここは奥が深いので、<b>GitHubの使い方は別コースでまとめて扱う。</b>
      </p>
    </section>
  )
}

function ClaudePSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const heading = entrance(frame, fps)
  const terminal = entrance(frame, fps, 22)

  const steps = ['対話画面を開かず呼び出せる', 'stdin / stdout でつなぐ', 'ログ解析・バッチ・大規模マイグレーション']

  return (
    <section className="remotion-slide e17-slide">
      <div style={lift(heading, 24)}>
        <span className="slide-kicker">非対話モード</span>
        <h1>
          <code className="e17-cmd">claude -p</code> で自動化
        </h1>
      </div>
      <div className="e17-how-stage">
        <div className="e17-terminal" style={lift(terminal, 28)}>
          <div className="e17-terminal-bar">
            <span />
            <span />
            <span />
            <strong>pipeline</strong>
          </div>
          <div className="e17-terminal-body">
            <code className="e17-prompt">&gt; cat error.log | claude -p "原因を要約"</code>
            <code className="e17-output">→ 結果を stdout に返す</code>
          </div>
        </div>
        <div className="e17-steps">
          {steps.map((label, index) => (
            <div key={label} style={lift(entrance(frame, fps, 40 + index * 12), 24)}>
              <strong>{index + 1}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
      <p className="e17-judge" style={lift(entrance(frame, fps, 90), 18)}>
        人が座っていなくても回る。<b>スクリプトからClaudeを呼ぶ入口。</b>
      </p>
    </section>
  )
}

function SdkSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const heading = entrance(frame, fps)
  const left = entrance(frame, fps, 22)
  const right = entrance(frame, fps, 36)

  return (
    <section className="remotion-slide e17-slide">
      <div style={lift(heading, 24)}>
        <span className="slide-kicker">もっと細かく制御</span>
        <h1>Claude Code SDK</h1>
      </div>
      <div className="e17-compare">
        <div className="e17-compare-card" style={lift(left, 30)}>
          <span className="e17-tag e17-tag-muted">使い方</span>
          <strong>TS / Python から import</strong>
          <p>公式SDKをコードに組み込む。ツール権限・モデル・並列度を細かく指定できる。</p>
        </div>
        <div className="e17-compare-card e17-compare-accent" style={lift(right, 30)}>
          <span className="e17-tag">安全設計</span>
          <strong>既定は読み取り専用</strong>
          <p>書き込みは <code className="e17-cmd">allowedTools</code> で明示的に許可して初めて有効になる。</p>
        </div>
      </div>
      <p className="e17-note" style={lift(entrance(frame, fps, 56), 18)}>
        <code className="e17-cmd">claude -p</code> より細かい制御。<b>プログラムに埋め込む正式な入口。</b>
      </p>
    </section>
  )
}

function PipelineSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const heading = entrance(frame, fps)

  const stages = ['コミット', 'レビュー', '解析', 'デプロイ']
  const rules = [
    ['権限は最小限', '既定は読み取り。書き込みは明示的に許可する。'],
    ['レビューは必須', '自動化しても、最終確認は人間が握る。']
  ]

  return (
    <section className="remotion-slide e17-slide">
      <div style={lift(heading, 24)}>
        <span className="slide-kicker">全体像</span>
        <h1>パイプラインに組み込む</h1>
      </div>
      <div className="e17-flow">
        {stages.map((label, index) => (
          <div key={label} className="e17-flow-step" style={lift(entrance(frame, fps, 22 + index * 8), 20)}>
            <span>{label}</span>
            {index < stages.length - 1 && <i className="e17-flow-arrow">→</i>}
          </div>
        ))}
      </div>
      <div className="e17-principles">
        {rules.map(([title, body], index) => (
          <div key={title} className="e17-principle-card" style={lift(entrance(frame, fps, 50 + index * 12), 26)}>
            <strong>{title}</strong>
            <p>{body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function DemoScaffold({
  frame,
  step,
  title,
  prompts,
  answers,
  watch,
  foot
}: {
  frame: number
  step: string
  title: string
  prompts: ReadonlyArray<string>
  answers?: ReadonlyArray<readonly [string, string]>
  watch: ReadonlyArray<string>
  foot: ReactNode
}) {
  const { fps } = useVideoConfig()
  const heading = entrance(frame, fps)
  const terminal = entrance(frame, fps, 24)

  const terminalBlock = (
    <div className="e17-terminal" style={lift(terminal, 28)}>
      <div className="e17-terminal-bar">
        <span />
        <span />
        <span />
        <strong>claude</strong>
      </div>
      <div className="e17-terminal-body">
        {prompts.map((line) => (
          <code key={line} className="e17-prompt">
            &gt; {line}
          </code>
        ))}
      </div>
    </div>
  )

  return (
    <section className="remotion-slide e17-slide demo-slide">
      <div style={lift(heading, 24)}>
        <span className="demo-badge">▶ 実演 / LIVE DEMO ─ {step}</span>
        <h1>{title}</h1>
      </div>
      {answers ? (
        <div className="e17-how-stage">
          {terminalBlock}
          <div className="e17-examples">
            {answers.map(([label, body], index) => (
              <div key={label} style={lift(entrance(frame, fps, 40 + index * 10), 24)}>
                <strong>{label}</strong>
                <span>{body}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        terminalBlock
      )}
      {watch.length > 0 && (
        <div className="e17-recap">
          {watch.map((line, index) => (
            <div key={line} style={lift(entrance(frame, fps, 52 + index * 10), 22)}>
              <span className="e17-check">{index + 1}</span>
              <p>{line}</p>
            </div>
          ))}
        </div>
      )}
      <p className="demo-foot" style={lift(entrance(frame, fps, 92), 18)}>
        {foot}
      </p>
    </section>
  )
}

function DemoInterviewSlide({ frame }: SlideRenderContext) {
  return (
    <DemoScaffold
      frame={frame}
      step="その1"
      title="作るものを、取材させて決める"
      prompts={[
        '毎朝の情報収集を自動化する小さなツールがほしい。実装はまだしないで。',
        '1問ずつ質問して要件を引き出して、SPEC.md にまとめて。'
      ]}
      answers={[
        ['集めるもの', 'はてブ（テクノロジー）／Publickey／ITmedia NEWS の前日分'],
        ['出力', '日付ごとのMarkdown 1枚（タイトル・リンク・3行要約）'],
        ['要約のさせ方', 'claude -p に投げる'],
        ['動かし方', '自分のPCで毎朝6時。失敗したら気づけるように']
      ]}
      watch={[]}
      foot={
        <>
          聞かれるのは「何を作るか」だけ。<b>運用の希望もここで渡す。</b>
        </>
      }
    />
  )
}

function DemoBuildSlide({ frame }: SlideRenderContext) {
  return (
    <DemoScaffold
      frame={frame}
      step="その2"
      title="運用込みの計画を書かせる"
      prompts={[
        'SPEC.md をもとに、毎朝6時の自動実行と失敗時の通知まで含めて',
        'PLAN.md に実装計画を書いて。まだ実装はしないで。'
      ]}
      watch={[
        '「まだ実装しないで」で、いきなり手が動くのを止める',
        '実行基盤の候補（cron・タスクスケジューラなど）を出してくる',
        '失敗したときの扱いも、動かす前に決まる'
      ]}
      foot={
        <>
          作ってから運用を考えると二度手間。<b>運用込みで設計させる。</b>
        </>
      }
    />
  )
}

function DemoPipelineSlide({ frame }: SlideRenderContext) {
  return (
    <DemoScaffold
      frame={frame}
      step="その3"
      title="計画にOKを出して、投げる"
      prompts={['PLAN.md のとおり実装して。毎朝6時の自動実行の設定まで含めて。']}
      watch={[
        '計画を画面で一緒に読んで、選択肢に答えるだけでOKになる',
        '走り出したら、ここで終わり。完走は待たない',
        '人間がやったのは、質問に答えることと、計画にOKを出すことだけ'
      ]}
      foot={
        <>
          作る → 毎朝動かす、までが1本の計画。<b>渡すのは、この一言。</b>
        </>
      }
    />
  )
}

function RecapSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const heading = entrance(frame, fps)

  const points = [
    '大きい仕事は丸投げせず、SPEC.mdを先に書く',
    '人間=要件／Claude=実装。役割を分ける',
    'Writer/Reviewerで別視点、並列セッションで広げる',
    '取材→実装→運用の計画まで、ひと続きで渡せる',
    'claude -p・SDK・GitHub連携で組み込む（権限最小・レビュー必須）'
  ]

  return (
    <section className="remotion-slide e17-slide">
      <div style={lift(heading, 24)}>
        <span className="slide-kicker">まとめ</span>
        <h1>今日のポイント</h1>
      </div>
      <div className="e17-recap">
        {points.map((point, index) => (
          <div key={point} style={lift(entrance(frame, fps, 22 + index * 11), 24)}>
            <span className="e17-check">✓</span>
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
    <section className="remotion-slide e17-slide e17-next">
      <div className="motion-grid" />
      <div style={lift(title, 30)}>
        <span className="slide-kicker">次回予告</span>
        <h1>どこからでもClaude Code</h1>
      </div>
      <div className="e17-next-card" style={lift(card, 28)}>
        <strong>第18回</strong>
        <span>Discordからも使えるよ</span>
        <p>ターミナルの外、スマホやチャットからClaude Codeを動かす話。</p>
      </div>
      <p className="e17-cta" style={lift(cta, 18)}>
        チャンネル登録 &amp; メンバーシップ登録もよろしくお願いします！
      </p>
    </section>
  )
}
