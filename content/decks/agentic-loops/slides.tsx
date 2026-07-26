/* eslint-disable react-refresh/only-export-components */
import { spring, useVideoConfig } from 'remotion'
import type { SlideModule, SlideRenderContext } from '../../../src/types'
import { CtaSlide, LogoMark } from '../../../src/deck-shared'

export const slides: SlideModule['slides'] = [
  { render: (props) => <OpeningSlide {...props} /> },
  { render: (props) => <CtaSlide {...props} /> },
  { render: (props) => <WhyNowSlide {...props} /> },
  { render: (props) => <DefinitionSlide {...props} /> },
  { render: (props) => <FourTypesSlide {...props} /> },
  { render: (props) => <TurnBasedSlide {...props} /> },
  { render: (props) => <VerificationLoopsSlide {...props} /> },
  { render: (props) => <GoalBasedSlide {...props} /> },
  { render: (props) => <TimeBasedSlide {...props} /> },
  { render: (props) => <ProactiveSlide {...props} /> },
  { render: (props) => <QualitySlide {...props} /> },
  { render: (props) => <TokenControlSlide {...props} /> },
  { render: (props) => <ModelEffortSlide {...props} /> },
  { render: (props) => <ChooseLoopSlide {...props} /> },
  { render: (props) => <DemoSlide {...props} /> },
  { render: (props) => <RecapSlide {...props} /> },
  { render: (props) => <SourcesSlide {...props} /> },
  { render: (props) => <CtaSlide {...props} /> }
]

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
    ['01', '4種類を使い分ける', 'ターン・ゴール・時間・プロアクティブを作業で選ぶ'],
    ['02', '止まり方まで設計する', '成功条件、停止条件、品質基準、使用量をセットで渡す']
  ] as const

  return (
    <section className="remotion-slide e19-slide e19-opening">
      <LogoMark />
      <div className="motion-grid" />
      <div className="e19-opening-copy" style={lift(title, 48)}>
        <span className="slide-kicker">Claude Codeの使い方コース ─ 第19回</span>
        <span className="e19-bonus">＋ 追加回 / 本編は第18回で完結しました</span>
        <h1>
          ループ設計
          <br />
          <span>
            Claude Codeに
            <br />
            仕事を回させる
          </span>
        </h1>
        <p className="e19-source">Source: Anthropic公式ブログ / gihyo.jp（出典は最後のスライドに）</p>
      </div>
      <div className="e19-goal-row">
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

function WhyNowSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const heading = entrance(frame, fps)
  const left = entrance(frame, fps, 22)
  const right = entrance(frame, fps, 36)

  return (
    <section className="remotion-slide e19-slide">
      <div style={lift(heading, 24)}>
        <span className="slide-kicker">なぜ今ループなのか</span>
        <h1>手動で進めるループから次へ</h1>
      </div>
      <div className="e19-compare">
        <div className="e19-compare-card" style={lift(left, 30)}>
          <span className="e19-tag e19-tag-muted">これまで</span>
          <strong>ユーザーのプロンプトで開始</strong>
          <p>Claudeが完了、または追加文脈が必要だと判断したら止まる。</p>
        </div>
        <div className="e19-compare-card e19-compare-accent" style={lift(right, 30)}>
          <span className="e19-tag">これから</span>
          <strong>停止条件まで設計する</strong>
          <p>何で動き、どこで止まるかを作業に合わせて選ぶ。</p>
        </div>
      </div>
    </section>
  )
}

function DefinitionSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const heading = entrance(frame, fps)
  const loop = entrance(frame, fps, 22)
  const note = entrance(frame, fps, 62)

  const steps = ['Trigger', 'Stop', 'Primitive', 'Task'] as const

  return (
    <section className="remotion-slide e19-slide">
      <div style={lift(heading, 24)}>
        <span className="slide-kicker">公式の定義</span>
        <h1>分類観点は4つ</h1>
      </div>
      <div className="e19-loop" style={lift(loop, 26)}>
        {steps.map((step, index) => (
          <div key={step}>
            <strong>{step}</strong>
            <span>{index === steps.length - 1 ? '✓' : '→'}</span>
          </div>
        ))}
      </div>
      <div className="e19-two-questions" style={lift(note, 18)}>
        <p>
          <b>何をきっかけに動く？</b>
          <span>トリガー</span>
        </p>
        <p>
          <b>どの作業に向く？</b>
          <span>適した作業</span>
        </p>
      </div>
    </section>
  )
}

function FourTypesSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const heading = entrance(frame, fps)

  const types = [
    ['Turn', 'ターンベース', 'ユーザーのプロンプト', '短い作業'],
    ['Goal', 'ゴールベース', '/goal', '検証可能な完了条件'],
    ['Time', '時間ベース', '/loop / /schedule', '外部変化の見張り'],
    ['Proactive', 'プロアクティブ', 'イベント・スケジュール', '繰り返し発生する仕事']
  ] as const

  return (
    <section className="remotion-slide e19-slide">
      <div style={lift(heading, 24)}>
        <span className="slide-kicker">4分類</span>
        <h1>機能名ではなく、渡すものが違う</h1>
      </div>
      <div className="e19-type-grid">
        {types.map(([label, title, trigger, use], index) => (
          <div key={label} style={lift(entrance(frame, fps, 22 + index * 10), 26)}>
            <span>{label}</span>
            <strong>{title}</strong>
            <p>{trigger}</p>
            <em>{use}</em>
          </div>
        ))}
      </div>
    </section>
  )
}

function TurnBasedSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const heading = entrance(frame, fps)
  const terminal = entrance(frame, fps, 24)

  const checks = ['dev server起動', 'UIを操作', 'console確認', 'performance audit'] as const

  return (
    <section className="remotion-slide e19-slide">
      <div style={lift(heading, 24)}>
        <span className="slide-kicker">Turn-based</span>
        <h1>短い作業は「確認手順」を足す</h1>
      </div>
      <div className="e19-how-stage">
        <div className="e19-terminal" style={lift(terminal, 28)}>
          <div className="e19-terminal-bar">
            <span />
            <span />
            <span />
            <strong>SKILL.md</strong>
          </div>
          <div className="e19-terminal-body">
            <code>&gt; UI変更を編集だけで完了扱いしない</code>
          <code className="e19-output">if any step fails → fix and rerun from step 1</code>
          </div>
        </div>
        <div className="e19-steps">
          {checks.map((label, index) => (
            <div key={label} style={lift(entrance(frame, fps, 40 + index * 10), 22)}>
              <strong>{index + 1}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function VerificationLoopsSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const heading = entrance(frame, fps)

  const items = [
    ['/verify', 'ビルドして動かして、変化を実際に観察する組み込みスキル'],
    ['CLAUDE.md', 'ビルドとテストのコマンドを書いておく。推測させない'],
    ['/code-review', '別の文脈のレビュー役に見せる。GitHub連携版もある'],
    ['自分のスキル', '毎回手で直しているならスキル化。skill-creatorに取材させる']
  ] as const

  return (
    <section className="remotion-slide e19-slide">
      <div style={lift(heading, 24)}>
        <span className="slide-kicker">検証ループ</span>
        <h1>自作の前に、組み込みを使う</h1>
      </div>
      <div className="e19-quality-grid">
        {items.map(([title, body], index) => (
          <div key={title} style={lift(entrance(frame, fps, 22 + index * 10), 24)}>
            <strong>{title}</strong>
            <p>{body}</p>
          </div>
        ))}
      </div>
      <p className="e19-note" style={lift(entrance(frame, fps, 72), 18)}>
        型チェック・lint・テストの失敗は<b>すでに検証されている</b>。
        スキルにすべきは、自分が毎回手で確かめている残りの部分だけ。
      </p>
    </section>
  )
}

function GoalBasedSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const heading = entrance(frame, fps)
  const command = entrance(frame, fps, 24)
  const bottom = entrance(frame, fps, 56)

  return (
    <section className="remotion-slide e19-slide">
      <div style={lift(heading, 24)}>
        <span className="slide-kicker">Goal-based</span>
        <h1>「できた」の条件を先に渡す</h1>
      </div>
      <div className="e19-command-card" style={lift(command, 28)}>
        <code>/goal get the homepage Lighthouse score to 90 or above, stop after 5 tries.</code>
      </div>
      <div className="e19-rule-row" style={lift(bottom, 20)}>
        <div>
          <strong>停止条件</strong>
          <p>目標達成、または最大ターン数</p>
        </div>
        <div>
          <strong>相性がよい基準</strong>
          <p>テスト通過数、スコア、件数など機械的に確認できるもの</p>
        </div>
      </div>
    </section>
  )
}

function TimeBasedSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const heading = entrance(frame, fps)
  const terminal = entrance(frame, fps, 24)
  const note = entrance(frame, fps, 58)

  return (
    <section className="remotion-slide e19-slide">
      <div style={lift(heading, 24)}>
        <span className="slide-kicker">Time-based</span>
        <h1>外部システムの変化を見張る</h1>
      </div>
      <div className="e19-terminal e19-wide-terminal" style={lift(terminal, 28)}>
        <div className="e19-terminal-bar">
          <span />
          <span />
          <span />
          <strong>/loop</strong>
        </div>
        <div className="e19-terminal-body">
          <code>/loop 5m check my PR, address review comments, and fix failing CI</code>
          <code className="e19-output">cancel or work completes → stop</code>
        </div>
      </div>
      <p className="e19-note" style={lift(note, 18)}>
        <b>/loop は手元のコンピューター上で動く。</b>
        クラウドに移したいときは <code>/schedule</code> でルーチンを作る。
      </p>
    </section>
  )
}

function ProactiveSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const heading = entrance(frame, fps)

  const flow = [
    ['/schedule', '新しい報告を定期チェック'],
    ['/goal', 'この実行分をすべて処理'],
    ['Dynamic workflows', '複数エージェントを編成'],
    ['Auto mode', '公式の組み合わせ例に登場']
  ] as const

  return (
    <section className="remotion-slide e19-slide">
      <div style={lift(heading, 24)}>
        <span className="slide-kicker">Proactive</span>
        <h1>人がその場で促さなくても動く</h1>
      </div>
      <div className="e19-flow">
        {flow.map(([name, body], index) => (
          <div key={name} style={lift(entrance(frame, fps, 22 + index * 10), 24)}>
            <strong>{name}</strong>
            <span>{body}</span>
          </div>
        ))}
      </div>
      <p className="e19-note" style={lift(entrance(frame, fps, 72), 18)}>
        バグ報告、Issueトリアージ、移行作業、依存関係更新など。
        <b> /schedule と Dynamic workflows は research preview。</b>
      </p>
    </section>
  )
}

function QualitySlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const heading = entrance(frame, fps)

  const items = [
    ['コードベースを整える', 'Claudeは既存のパターンと慣習に従う'],
    ['よい結果をスキルに書く', 'チームの基準で自己検証できるようにする'],
    ['ドキュメントへ届くようにする', '必要なドキュメントにアクセスしやすくする'],
    ['第二のエージェントでレビュー', '/code-review など、新しい文脈のレビュー役を置く']
  ] as const

  return (
    <section className="remotion-slide e19-slide">
      <div style={lift(heading, 24)}>
        <span className="slide-kicker">品質維持</span>
        <h1>品質を保つ仕組みもループ設計の一部</h1>
      </div>
      <div className="e19-quality-grid">
        {items.map(([title, body], index) => (
          <div key={title} style={lift(entrance(frame, fps, 22 + index * 10), 24)}>
            <strong>{title}</strong>
            <p>{body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function TokenControlSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const heading = entrance(frame, fps)

  const controls = [
    ['境界', '成功条件と停止条件を明確にする'],
    ['試行', '小さな範囲で試してから広げる'],
    ['自動化', '決まった処理はスクリプトに任せる'],
    ['観測', '/usage / /goal / /workflows で確認する']
  ] as const

  return (
    <section className="remotion-slide e19-slide">
      <div style={lift(heading, 24)}>
        <span className="slide-kicker">トークン管理</span>
        <h1>走らせるほど「使いすぎ」の設計も必要</h1>
      </div>
      <div className="e19-token-grid">
        {controls.map(([title, body], index) => (
          <div key={title} style={lift(entrance(frame, fps, 22 + index * 10), 24)}>
            <strong>{title}</strong>
            <span>{body}</span>
          </div>
        ))}
      </div>
      <p className="e19-note" style={lift(entrance(frame, fps, 72), 18)}>
        <b>頻度は、見張る対象が変わる速さに合わせる。</b>
        Dynamic workflows は数百のエージェントを起動し得るので、大きく回す前に小さい範囲で使用量を見る。
      </p>
    </section>
  )
}

function ModelEffortSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const heading = entrance(frame, fps)
  const left = entrance(frame, fps, 22)
  const right = entrance(frame, fps, 36)

  return (
    <section className="remotion-slide e19-slide">
      <div style={lift(heading, 24)}>
        <span className="slide-kicker">モデル選択 &amp; effort</span>
        <h1>能力不足か、試行不足かを分ける</h1>
      </div>
      <div className="e19-compare">
        <div className="e19-compare-card" style={lift(left, 30)}>
          <span className="e19-tag e19-tag-muted">モデル</span>
          <strong>固定された重みと能力範囲</strong>
          <p>文脈・スキル・ツール・範囲が適切でも誤るなら、より大きいモデルを選ぶ。</p>
        </div>
        <div className="e19-compare-card e19-compare-accent" style={lift(right, 30)}>
          <span className="e19-tag">effort</span>
          <strong>どこまで読んで試すか</strong>
          <p>ファイルを読まない、テストしない、早く戻るならeffortを上げる。</p>
        </div>
      </div>
    </section>
  )
}

function ChooseLoopSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const heading = entrance(frame, fps)

  const choices = [
    ['ターン', '確認を渡す', '探索中・短い作業', '検証スキル'],
    ['ゴール', '停止条件を渡す', '完了条件が明確', '/goal'],
    ['時間', '起動タイミングを渡す', '外部で変化が起きる', '/loop・/schedule'],
    ['プロアクティブ', 'プロンプトごと渡す', '繰り返し発生し、手順化できる', '全部 + workflow']
  ] as const

  return (
    <section className="remotion-slide e19-slide">
      <div style={lift(heading, 24)}>
        <span className="slide-kicker">使い分け</span>
        <h1>最初は一番単純な形から</h1>
      </div>
      <div className="e19-choice-table">
        {choices.map(([type, handoff, when, reach], index) => (
          <div key={type} style={lift(entrance(frame, fps, 22 + index * 10), 22)}>
            <strong>{type}</strong>
            <span>{handoff}</span>
            <p>{when}</p>
            <code>{reach}</code>
          </div>
        ))}
      </div>
    </section>
  )
}

function DemoSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const heading = entrance(frame, fps)

  const items = [
    ['ターンベース', 'UI変更 + SKILL.md の検証手順'],
    ['ゴールベース', '/goal でテストやLighthouseの停止条件を渡す'],
    ['時間ベース', '/loop 5m でPRレビューとCI失敗を見張る']
  ] as const

  return (
    <section className="remotion-slide e19-slide demo-slide">
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
        ループでは「止まる条件」まで設計する。そこを画面で見せる。
      </p>
    </section>
  )
}

function RecapSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const heading = entrance(frame, fps)

  const points = [
    'ループ = 停止条件まで作業サイクルを繰り返す設計',
    '4分類はターン / ゴール / 時間 / プロアクティブ',
    '品質はスキル、ドキュメント、レビューで支える',
    '使用量は境界、モデル、effort、スクリプトで管理する',
    '最初は自分がボトルネックの作業を1つ選ぶ'
  ] as const

  return (
    <section className="remotion-slide e19-slide">
      <div style={lift(heading, 24)}>
        <span className="slide-kicker">まとめ</span>
        <h1>今日のポイント</h1>
      </div>
      <div className="e19-recap">
        {points.map((point, index) => (
          <div key={point} style={lift(entrance(frame, fps, 22 + index * 10), 24)}>
            <span className="e19-check">✓</span>
            <p>{point}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function SourcesSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const heading = entrance(frame, fps)

  const sources = [
    [
      'Anthropic / 2026-06-30',
      'Getting started with loops',
      'https://claude.com/blog/getting-started-with-loops'
    ],
    [
      'Anthropic / 2026-07-22',
      'Building verification loops in Claude Code with skills',
      'https://claude.com/blog/building-verification-loops-in-claude-code-with-skills'
    ],
    [
      'gihyo.jp / 2026-07-09',
      'Anthropic、Claude CodeでAIエージェントを活用するループ設計を紹介',
      'https://gihyo.jp/article/2026/07/coding-agent-loop-design-with-claude-code'
    ],
    [
      'Anthropic',
      'Choosing a Claude model and effort level in Claude Code',
      'https://claude.com/blog/claude-model-and-effort-level-in-claude-code'
    ]
  ] as const

  return (
    <section className="remotion-slide e19-slide e19-sources-slide">
      <div style={lift(heading, 24)}>
        <span className="slide-kicker">参考リンク</span>
        <h1>元記事と補足記事</h1>
      </div>
      <div className="e19-sources">
        {sources.map(([site, title, url], index) => (
          <a
            key={url}
            href={url}
            target="_blank"
            rel="noreferrer"
            style={lift(entrance(frame, fps, 24 + index * 12), 22)}
          >
            <span>{site}</span>
            <strong>{title}</strong>
            <code>{url}</code>
          </a>
        ))}
      </div>
    </section>
  )
}
