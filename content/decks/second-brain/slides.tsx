/* eslint-disable react-refresh/only-export-components */
import { spring, useVideoConfig } from 'remotion'
import type { SlideModule, SlideRenderContext } from '../../../src/types'
import { CtaSlide, LogoMark } from '../../../src/deck-shared'

export const slides: SlideModule['slides'] = [
  { render: (props) => <OpeningSlide {...props} /> },
  { render: (props) => <CtaSlide {...props} /> },
  { render: (props) => <MemoryLimitSlide {...props} /> },
  { render: (props) => <SecondBrainSlide {...props} /> },
  { render: (props) => <AutoMemorySlide {...props} /> },
  { render: (props) => <NotebookSlide {...props} /> },
  { render: (props) => <MyVaultSlide {...props} /> },
  { render: (props) => <GoodmorningSlide {...props} /> },
  { render: (props) => <RecallSlide {...props} /> },
  { render: (props) => <GoodnightSlide {...props} /> },
  { render: (props) => <CulminationSlide {...props} /> },
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
    ['01', '記憶の限界を知る', 'Claudeはセッションを閉じると会話を忘れることを理解する'],
    ['02', '第2の脳を設計する', '人間とAIが共有する知識ベースをつくる']
  ]

  return (
    <section className="remotion-slide e15-slide e15-opening">
      <LogoMark />
      <div className="motion-grid" />
      <div className="e15-opening-copy" style={lift(title, 48)}>
        <span className="slide-kicker">Claude Codeの使い方コース ─ 第15回</span>
        <h1>
          第2の脳
          <br />
          <span className="e15-vs">セッションをまたいで記憶を残す</span>
        </h1>
      </div>
      <div className="e15-goal-row">
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

function MemoryLimitSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const heading = entrance(frame, fps)
  const left = entrance(frame, fps, 22)
  const right = entrance(frame, fps, 36)

  return (
    <section className="remotion-slide e15-slide">
      <div style={lift(heading, 24)}>
        <span className="slide-kicker">まず現実から</span>
        <h1>セッションを閉じると消える</h1>
      </div>
      <div className="e15-compare">
        <div className="e15-compare-card" style={lift(left, 30)}>
          <span className="e15-tag e15-tag-muted">Claude</span>
          <strong>会話を忘れる</strong>
          <p>セッションを閉じると、その中身を全部忘れる。次は毎回ゼロから説明し直し。</p>
        </div>
        <div className="e15-compare-card" style={lift(right, 30)}>
          <span className="e15-tag e15-tag-muted">人間</span>
          <strong>寝ると忘れる</strong>
          <p>一晩寝ると細かい話を忘れるのと同じ。記憶には限界がある。</p>
        </div>
      </div>
      <p className="e15-note" style={lift(entrance(frame, fps, 60), 18)}>
        だから「昨日の続き」を、毎回イチから説明することになる。<b>これを今日解決する。</b>
      </p>
    </section>
  )
}

function SecondBrainSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const heading = entrance(frame, fps)
  const note = entrance(frame, fps, 56)

  return (
    <section className="remotion-slide e15-slide">
      <div style={lift(heading, 24)}>
        <span className="slide-kicker">解決のカギ</span>
        <h1>外に記憶を置く ─ 第2の脳</h1>
      </div>
      <div className="e15-connect">
        <div className="e15-connect-side" style={lift(entrance(frame, fps, 18), 24)}>
          <strong>人間</strong>
          <p>書く・読む</p>
        </div>
        <div className="e15-connect-core" style={lift(entrance(frame, fps, 30), 28)}>
          <span className="e15-tag">共有ノート</span>
          <strong>第2の脳</strong>
          <p>1冊のノートを2人で使う</p>
        </div>
        <div className="e15-connect-side" style={lift(entrance(frame, fps, 42), 24)}>
          <strong>Claude</strong>
          <p>読む・書く</p>
        </div>
      </div>
      <p className="e15-note" style={lift(note, 18)}>
        人間もAIも<b>同じノートを双方向に読み書き</b>する。片方が書けば、もう片方も読める。
      </p>
    </section>
  )
}

function AutoMemorySlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const heading = entrance(frame, fps)
  const terminal = entrance(frame, fps, 22)

  const kinds = [
    ['好み', '「次からはこうして」を覚える'],
    ['フィードバック', '同じ失敗を繰り返さない'],
    ['プロジェクト情報', '進行中の状況を保持']
  ]

  return (
    <section className="remotion-slide e15-slide">
      <div style={lift(heading, 24)}>
        <span className="slide-kicker">まず標準機能</span>
        <h1>Auto Memory ─ 自動でたまる</h1>
      </div>
      <div className="e15-how-stage">
        <div className="e15-terminal" style={lift(terminal, 28)}>
          <div className="e15-terminal-bar">
            <span />
            <span />
            <span />
            <strong>claude</strong>
          </div>
          <div className="e15-terminal-body">
            <code className="e15-prompt">~/.claude/MEMORY.md</code>
            <code className="e15-output">✓ あなたの好みとフィードバックを自動で記録</code>
          </div>
        </div>
        <div className="e15-examples">
          {kinds.map(([name, body], index) => (
            <div key={name} style={lift(entrance(frame, fps, 40 + index * 10), 24)}>
              <strong>{name}</strong>
              <span>{body}</span>
            </div>
          ))}
        </div>
      </div>
      <p className="e15-note" style={lift(entrance(frame, fps, 90), 18)}>
        頼まなくても勝手に育つ。ただし<b>断片的なメモ</b>なので、これだけだと全体像は持てない。
      </p>
    </section>
  )
}

function NotebookSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const heading = entrance(frame, fps)
  const left = entrance(frame, fps, 22)
  const right = entrance(frame, fps, 36)
  const note = entrance(frame, fps, 54)

  return (
    <section className="remotion-slide e15-slide">
      <div style={lift(heading, 24)}>
        <span className="slide-kicker">もう一歩</span>
        <h1>外部の「メモ帳」を持つ</h1>
      </div>
      <div className="e15-choose">
        <div className="e15-choose-card" style={lift(left, 30)}>
          <span className="e15-tag e15-tag-muted">Auto Memory</span>
          <strong>付箋メモ</strong>
          <p>自動でたまるけど断片的。全体像は描けない。</p>
        </div>
        <div className="e15-choose-card e15-choose-accent" style={lift(right, 30)}>
          <span className="e15-tag">知識ベース</span>
          <strong>ちゃんとした手帳</strong>
          <p>構造化された外部メモ帳。デイリー・プロジェクト・リソースに整理。</p>
        </div>
      </div>
      <p className="e15-judge" style={lift(note, 18)}>
        両方持つのが正解。<b>付箋（Auto Memory）＋ 手帳（知識ベース）</b>で記憶を外に出す。
      </p>
    </section>
  )
}

function MyVaultSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const heading = entrance(frame, fps)

  const layers = [
    ['デイリーノート', '日々の記録・出来事'],
    ['プロジェクト', '進行中の仕事の状況'],
    ['リソース', '蓄積した知識・ルール']
  ]

  return (
    <section className="remotion-slide e15-slide">
      <div style={lift(heading, 24)}>
        <span className="slide-kicker">実例を見せます</span>
        <h1>私のVault ─ Obsidian</h1>
      </div>
      <div className="e15-fit">
        <div className="e15-fit-col e15-fit-good" style={lift(entrance(frame, fps, 22), 28)}>
          <span className="e15-fit-head">3層構造</span>
          {layers.map(([name, body]) => (
            <p key={name}>
              <b>{name}</b> ─ {body}
            </p>
          ))}
        </div>
        <div className="e15-fit-col e15-fit-side" style={lift(entrance(frame, fps, 36), 28)}>
          <span className="e15-fit-head">ポイント</span>
          <p>Claudeがこのノートを直接読み書きする。</p>
          <p>人間とAI共通の「脳」になっている。</p>
        </div>
      </div>
      <p className="e15-note" style={lift(entrance(frame, fps, 60), 18)}>
        知識ツールはObsidianでなくても良い。大事なのは<b>双方向に読み書きできる共有の場</b>。
      </p>
    </section>
  )
}

function GoodmorningSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const heading = entrance(frame, fps)
  const terminal = entrance(frame, fps, 22)
  const judge = entrance(frame, fps, 56)

  const parts = ['Hook ─ 起動をフックする', 'スキル ─ 手順をまとめる', 'サブエージェント ─ 調べて分担']

  return (
    <section className="remotion-slide e15-slide">
      <div style={lift(heading, 24)}>
        <span className="slide-kicker">第2の脳の上で動く</span>
        <h1>/goodmorning</h1>
      </div>
      <div className="e15-how-stage">
        <div className="e15-terminal" style={lift(terminal, 28)}>
          <div className="e15-terminal-bar">
            <span />
            <span />
            <span />
            <strong>claude</strong>
          </div>
          <div className="e15-terminal-body">
            <code className="e15-prompt">&gt; おはよう</code>
            <code className="e15-output">☀ 今日やること3件 ─ 第2の脳から取得</code>
          </div>
        </div>
        <div className="e15-steps">
          {parts.map((label, index) => (
            <div key={label} style={lift(entrance(frame, fps, 40 + index * 12), 24)}>
              <strong>{index + 1}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
      <p className="e15-judge" style={lift(judge, 20)}>
        「おはよう」と言うだけで、<b>これまで学んだ機能の合わせ技</b>が裏で動く。
      </p>
    </section>
  )
}

function RecallSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const heading = entrance(frame, fps)
  const terminal = entrance(frame, fps, 22)
  const note = entrance(frame, fps, 52)

  return (
    <section className="remotion-slide e15-slide">
      <div style={lift(heading, 24)}>
        <span className="slide-kicker">記憶を取り戻す</span>
        <h1>「思い出して」</h1>
      </div>
      <div className="e15-port" style={lift(entrance(frame, fps, 24), 30)}>
        <span className="e15-tag">新しいセッション</span>
        <strong>前回の続きが、自動で戻る</strong>
        <p>
          Claudeが<b>第2の脳をたどって</b>、前回どこまでやったかを復元する。
        </p>
      </div>
      <div className="e15-terminal" style={lift(terminal, 28)}>
        <div className="e15-terminal-bar">
          <span />
          <span />
          <span />
          <strong>claude</strong>
        </div>
        <div className="e15-terminal-body">
          <code className="e15-prompt">&gt; 思い出して</code>
          <code className="e15-output">↻ 前回の作業文脈を復元しました</code>
        </div>
      </div>
      <p className="e15-note" style={lift(note, 18)}>
        記憶が消える問題を、外部ノートで埋める。<b>毎回ゼロから説明しなくていい。</b>
      </p>
    </section>
  )
}

function GoodnightSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const heading = entrance(frame, fps)
  const card = entrance(frame, fps, 24)
  const note = entrance(frame, fps, 48)

  return (
    <section className="remotion-slide e15-slide e15-confession">
      <div style={lift(heading, 24)}>
        <span className="slide-kicker">1日の終わりに</span>
        <h1>/goodnight</h1>
      </div>
      <div className="e15-confession-card" style={lift(card, 30)}>
        <p>
          「おやすみ」と言うと、その日のデイリーノートをもとに
          Claudeが<b>日記を自動生成</b>して第2の脳に記録する。
        </p>
        <div className="e15-confession-result">
          <span>記録するほど</span>
          <strong>脳が育つ</strong>
          <span>明日の自分が</span>
          <strong>ラクになる</strong>
        </div>
      </div>
      <p className="e15-note" style={lift(note, 18)}>
        書く → たまる → 思い出す。<b>記録のループ</b>が回り始める。
      </p>
    </section>
  )
}

function CulminationSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const heading = entrance(frame, fps)

  const pieces = [
    ['CLAUDE.md', 'ルールを共有する'],
    ['カスタムコマンド', '手順を一発で呼ぶ'],
    ['Hook', '自動で動かす'],
    ['サブエージェント', '仕事を分担する']
  ]

  return (
    <section className="remotion-slide e15-slide">
      <div style={lift(heading, 24)}>
        <span className="slide-kicker">今日のクライマックス</span>
        <h1>第2の脳の上に、全部が乗る</h1>
      </div>
      <div className="e15-pieces">
        {pieces.map(([name, body], index) => (
          <div key={name} style={lift(entrance(frame, fps, 24 + index * 10), 24)}>
            <strong>{name}</strong>
            <span>{body}</span>
          </div>
        ))}
      </div>
      <p className="e15-judge" style={lift(entrance(frame, fps, 74), 18)}>
        バラバラだった点が、<b>ひとつの仕組み</b>としてつながる。これがシリーズの集大成。
      </p>
    </section>
  )
}

function DemoSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const heading = entrance(frame, fps)

  const items: ReadonlyArray<readonly [string, string]> = [
    ['/goodmorning', '第2の脳から「今日やること」が出てくる様子を見せる'],
    ['「思い出して」', '別セッションで前回の作業の続きが復元される'],
    ['/goodnight', '1日の記録から日記が自動生成される']
  ]

  return (
    <section className="remotion-slide e15-slide demo-slide">
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
    'Claudeはセッションを閉じると忘れる（人間も寝ると忘れる）',
    'だから外に第2の脳を持つ ─ 人間もAIも同じノートを読み書き',
    'Auto Memoryで好み・フィードバックが自動でたまる',
    'これまで学んだ機能は、全部この第2の脳の上に乗る'
  ]

  return (
    <section className="remotion-slide e15-slide">
      <div style={lift(heading, 24)}>
        <span className="slide-kicker">まとめ</span>
        <h1>今日のポイント</h1>
      </div>
      <div className="e15-recap">
        {points.map((point, index) => (
          <div key={point} style={lift(entrance(frame, fps, 22 + index * 11), 24)}>
            <span className="e15-check">✓</span>
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
    <section className="remotion-slide e15-slide e15-next">
      <div className="motion-grid" />
      <div style={lift(title, 30)}>
        <span className="slide-kicker">次回予告</span>
        <h1>自分の仕事を、自分でチェック</h1>
      </div>
      <div className="e15-next-card" style={lift(card, 28)}>
        <strong>第16回</strong>
        <span>自己検証 ─ テスト駆動 &amp; 高度なHook</span>
        <p>Claudeに自分の成果物を検証させる。テストを先に書く考え方と、もう一歩進んだHook。</p>
      </div>
      <p className="e15-cta" style={lift(cta, 18)}>
        チャンネル登録 &amp; メンバーシップ登録もよろしくお願いします！
      </p>
    </section>
  )
}
