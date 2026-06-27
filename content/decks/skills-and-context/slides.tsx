/* eslint-disable react-refresh/only-export-components */
import { spring, useVideoConfig } from 'remotion'
import type { SlideModule, SlideRenderContext } from '../../../src/types'

export const slides: SlideModule['slides'] = [
  { render: (props) => <OpeningSlide {...props} /> },
  { render: (props) => <SkillVsCommandSlide {...props} /> },
  { render: (props) => <SkillCreateSlide {...props} /> },
  { render: (props) => <SkillStructureSlide {...props} /> },
  { render: (props) => <SkillMdExampleSlide {...props} /> },
  { render: (props) => <SkillEcosystemSlide {...props} /> },
  { render: (props) => <SkillDesignSlide {...props} /> },
  { render: (props) => <SkillModeSlide {...props} /> },
  { render: (props) => <ContextViewSlide {...props} /> },
  { render: (props) => <ContextEatersSlide {...props} /> },
  { render: (props) => <ContextDietSlide {...props} /> },
  { render: (props) => <BalanceSlide {...props} /> },
  { render: (props) => <DemoSlide {...props} /> },
  { render: (props) => <RecapSlide {...props} /> },
  { render: (props) => <NextSlide {...props} /> }
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
    ['01', 'スキルを覚えさせる', '繰り返す仕事の「やり方」をClaude Codeに記憶させる'],
    ['02', 'コンテキストを最適化', '/contextで中身を見て、必要なものだけを積み込む']
  ]

  return (
    <section className="remotion-slide e13-slide e13-opening">
      <div className="motion-grid" />
      <div className="e13-opening-copy" style={lift(title, 48)}>
        <span className="slide-kicker">Claude Codeの使い方コース ─ 第13回</span>
        <h1>
          スキル &amp;
          <br />
          コンテキスト最適化
        </h1>
      </div>
      <div className="e13-goal-row">
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

function SkillVsCommandSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const heading = entrance(frame, fps)
  const left = entrance(frame, fps, 22)
  const right = entrance(frame, fps, 36)

  return (
    <section className="remotion-slide e13-slide">
      <div style={lift(heading, 24)}>
        <span className="slide-kicker">スキルとは何か</span>
        <h1>テンプレートではなく「やり方」</h1>
      </div>
      <div className="e13-compare">
        <div className="e13-compare-card" style={lift(left, 30)}>
          <span className="e13-tag e13-tag-muted">第6回 カスタムコマンド</span>
          <strong>テンプレート</strong>
          <p>同じ文章を毎回そのまま注入する。レシピカードのような「型」。</p>
        </div>
        <div className="e13-compare-arrow" style={{ opacity: right }}>
          →
        </div>
        <div className="e13-compare-card e13-compare-accent" style={lift(right, 30)}>
          <span className="e13-tag">スキル</span>
          <strong>仕事のやり方マニュアル</strong>
          <p>判断基準・手順・注意事項まで書ける。「なぜそうするか」が残る料理の教科書。</p>
        </div>
      </div>
    </section>
  )
}

function SkillCreateSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const heading = entrance(frame, fps)
  const terminal = entrance(frame, fps, 22)

  const steps = ['先週のログを集めて', 'このフォーマットで整える', '上司に送る文面にする']

  return (
    <section className="remotion-slide e13-slide">
      <div style={lift(heading, 24)}>
        <span className="slide-kicker">スキルの作り方</span>
        <h1>Claude Codeに頼むだけ</h1>
      </div>
      <div className="e13-create-stage">
        <div className="e13-terminal" style={lift(terminal, 28)}>
          <div className="e13-terminal-bar">
            <span />
            <span />
            <span />
            <strong>claude</strong>
          </div>
          <div className="e13-terminal-body">
            <code className="e13-prompt">&gt; 週報をまとめるスキルを作って</code>
            <code className="e13-output">created .claude/skills/weekly-report/SKILL.md</code>
          </div>
        </div>
        <div className="e13-steps">
          {steps.map((label, index) => (
            <div key={label} style={lift(entrance(frame, fps, 40 + index * 12), 26)}>
              <strong>{index + 1}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function SkillStructureSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const heading = entrance(frame, fps)
  const tree = entrance(frame, fps, 22)

  const treeLines = [
    ['.claude/skills/weekly-report/', 'e13-tree-root'],
    ['├─ SKILL.md', 'e13-tree-file'],
    ['├─ scripts/', 'e13-tree-dir'],
    ['│    └─ collect.sh', 'e13-tree-sub'],
    ['└─ reference/', 'e13-tree-dir'],
    ['     └─ format.md', 'e13-tree-sub']
  ] as const

  const parts = [
    ['SKILL.md', '本体。説明・手順・判断基準を書く入口', false],
    ['scripts/', 'シェルやPythonの「道具」を同梱。説明だけでなく実際に実行できる', true],
    ['reference/', 'APIリファレンスやテンプレを格納。必要なときだけ読む', false]
  ] as const

  return (
    <section className="remotion-slide e13-slide">
      <div style={lift(heading, 24)}>
        <span className="slide-kicker">ファイル構造</span>
        <h1>スキルの正体はフォルダ</h1>
      </div>
      <div className="e13-structure">
        <div className="e13-tree" style={lift(tree, 28)}>
          {treeLines.map(([text, cls]) => (
            <code key={text} className={cls}>
              {text}
            </code>
          ))}
        </div>
        <div className="e13-parts">
          {parts.map(([name, body, accent], index) => (
            <div
              key={name}
              className={accent ? 'e13-part e13-part-accent' : 'e13-part'}
              style={lift(entrance(frame, fps, 34 + index * 12), 26)}
            >
              <strong>{name}</strong>
              <p>{body}</p>
            </div>
          ))}
        </div>
      </div>
      <p className="e13-note" style={lift(entrance(frame, fps, 78), 18)}>
        常に読むのは説明文だけ。本体は呼ばれたとき、reference は必要なときだけ。
        <b>だからスキルを増やしてもコンテキストを食わない。</b>
      </p>
    </section>
  )
}

function SkillMdExampleSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const heading = entrance(frame, fps)
  const panel = entrance(frame, fps, 22)

  const lines: ReadonlyArray<readonly [string, string]> = [
    ['---', 'skillmd-delim'],
    ['name: weekly-report', 'skillmd-key'],
    ['description: 先週のログを集めて週報を作る', 'skillmd-key'],
    ['---', 'skillmd-delim'],
    ['', 'skillmd-txt'],
    ['# 週報を作る', 'skillmd-h'],
    ['', 'skillmd-txt'],
    ['## 手順', 'skillmd-h'],
    ['1. scripts/collect.sh でログを集める', 'skillmd-txt'],
    ['2. 下のフォーマットに整える', 'skillmd-txt'],
    ['3. 上司向けの言葉づかいにする', 'skillmd-txt'],
    ['', 'skillmd-txt'],
    ['## 判断基準', 'skillmd-h'],
    ['- 1件1行。専門用語は避ける', 'skillmd-txt'],
    ['- 日付・件数は具体的に書く', 'skillmd-txt']
  ]

  return (
    <section className="remotion-slide e13-slide">
      <div style={lift(heading, 24)}>
        <span className="slide-kicker">SKILL.md の実例</span>
        <h1>中身はこんな感じ</h1>
      </div>
      <div className="skillmd" style={lift(panel, 28)}>
        <div className="skillmd-bar">
          <span />
          <span />
          <span />
          <strong>weekly-report/SKILL.md</strong>
        </div>
        <div className="skillmd-body">
          {lines.map(([text, cls], index) => (
            <code key={`line-${index}`} className={cls}>
              {text || ' '}
            </code>
          ))}
        </div>
      </div>
      <p className="e13-note" style={lift(entrance(frame, fps, 64), 18)}>
        先頭の <b>name / description</b> でClaudeが「いつ使うか」を判断。本体に手順と判断基準を書く。
      </p>
    </section>
  )
}

function SkillEcosystemSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const heading = entrance(frame, fps)
  const creator = entrance(frame, fps, 22)

  const sources = [
    ['Anthropic 公式', 'anthropics/skills', '文書作成・設計など多数（skill-creator もここ）'],
    ['Microsoft Azure', 'microsoft/azure-skills', 'Azure 操作の専門スキル'],
    ['コミュニティ', 'GitHub ほか', '有志が大量に公開']
  ] as const

  return (
    <section className="remotion-slide e13-slide">
      <div style={lift(heading, 24)}>
        <span className="slide-kicker">公式 &amp; コミュニティ</span>
        <h1>ゼロから作らなくていい</h1>
      </div>
      <div className="e13-ecosystem">
        <div className="e13-creator-card" style={lift(creator, 28)}>
          <span className="e13-tag">Anthropic 公式</span>
          <strong>skill-creator</strong>
          <p>
            「スキルを作るスキル」。<b>対話しながら設計・改善</b>してくれる。
            Claude本体に組み込み済み。
          </p>
        </div>
        <div className="e13-sources">
          {sources.map(([name, repo, body], index) => (
            <div key={name} style={lift(entrance(frame, fps, 36 + index * 12), 24)}>
              <strong>{name}</strong>
              <code>{repo}</code>
              <p>{body}</p>
            </div>
          ))}
        </div>
      </div>
      <p className="e13-note" style={lift(entrance(frame, fps, 80), 18)}>
        導入は <code className="e13-cmd">/plugin marketplace add …</code> で追加して入れるだけ。
        <b>まず探す → 無ければ作る</b> が効率的。
      </p>
    </section>
  )
}

function SkillDesignSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const heading = entrance(frame, fps)

  const items = [
    ['短く', '長すぎるスキルはClaudeが迷子に。1ページに収める', false],
    ['具体的に', '曖昧な指示は毎回違う結果に。やることを明確に', false],
    ['判断基準を明示', '「こういうときはこうする」を書けば再現性が出る', true]
  ] as const

  return (
    <section className="remotion-slide e13-slide">
      <div style={lift(heading, 24)}>
        <span className="slide-kicker">設計のコツ</span>
        <h1>失敗から学ぶ3原則</h1>
      </div>
      <div className="e13-principles">
        {items.map(([title, body, accent], index) => (
          <div
            key={title}
            className={accent ? 'e13-principle e13-principle-accent' : 'e13-principle'}
            style={lift(entrance(frame, fps, 22 + index * 12), 28)}
          >
            <strong>{title}</strong>
            <p>{body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function SkillModeSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const heading = entrance(frame, fps)
  const inline = entrance(frame, fps, 22)
  const fork = entrance(frame, fps, 34)
  const judge = entrance(frame, fps, 50)

  return (
    <section className="remotion-slide e13-slide">
      <div style={lift(heading, 24)}>
        <span className="slide-kicker">スキルの実行モード</span>
        <h1>自分でやるか、部下に任せるか</h1>
      </div>
      <div className="e13-mode">
        <div className="e13-mode-card" style={lift(inline, 30)}>
          <span className="e13-tag e13-tag-muted">インライン（既定）</span>
          <strong>自分で料理する</strong>
          <p>スキルの内容がメインの机にそのまま入る。会話の流れを引き継げる。</p>
        </div>
        <div className="e13-mode-card e13-mode-accent" style={lift(fork, 30)}>
          <span className="e13-tag">context: fork</span>
          <strong>出前を頼む</strong>
          <p>別の机（サブエージェント）で実行。メインの机を消費しない。agent指定で専門家も選べる。</p>
        </div>
      </div>
      <p className="e13-judge" style={lift(judge, 20)}>
        結果だけ欲しい → <b>fork</b> ／ 会話の続きとしてやりたい → <b>インライン</b>
      </p>
    </section>
  )
}

function ContextViewSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const heading = entrance(frame, fps)

  const bars = [
    ['CLAUDE.md', 0.32, 'var(--teal)'],
    ['rules', 0.18, 'var(--mustard)'],
    ['skills', 0.14, 'var(--coral)'],
    ['hooks', 0.09, 'var(--violet)'],
    ['会話履歴', 0.27, 'var(--muted)']
  ] as const

  return (
    <section className="remotion-slide e13-slide">
      <div style={lift(heading, 24)}>
        <span className="slide-kicker">可視化する</span>
        <h1>
          <code className="e13-cmd">/context</code> で中身を覗く
        </h1>
      </div>
      <div className="e13-bars">
        {bars.map(([label, ratio, color], index) => {
          const grow = entrance(frame, fps, 22 + index * 9)
          return (
            <div key={label} className="e13-bar-row" style={{ opacity: grow }}>
              <span className="e13-bar-label">{label}</span>
              <div className="e13-bar-track">
                <i
                  style={{
                    width: `${ratio * 100}%`,
                    background: color,
                    transform: `scaleX(${grow})`,
                    transformOrigin: 'left'
                  }}
                />
              </div>
              <span className="e13-bar-pct">{Math.round(ratio * 100)}%</span>
            </div>
          )
        })}
      </div>
      <p className="e13-note" style={lift(entrance(frame, fps, 70), 18)}>
        ステータスバーに使用率を常時表示すれば、残量がいつでも一目でわかる。
      </p>
    </section>
  )
}

function ContextEatersSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const heading = entrance(frame, fps)

  const eaters = [
    ['大きいファイルの全文読み込み', '読ませた瞬間、全部が机に残り続ける'],
    ['MCPのツール定義', '接続するだけで場所を取る（第14回で詳しく）'],
    ['長すぎるスキルの説明文', '呼び出すたびにコンテキストを消費する'],
    ['積み上がった会話履歴', '過去のやり取りがどんどん蓄積していく']
  ]

  return (
    <section className="remotion-slide e13-slide">
      <div style={lift(heading, 24)}>
        <span className="slide-kicker">意外な犯人たち</span>
        <h1>何がコンテキストを食うのか</h1>
      </div>
      <div className="e13-eaters">
        {eaters.map(([title, body], index) => (
          <div key={title} style={lift(entrance(frame, fps, 22 + index * 11), 26)}>
            <span className="e13-eater-mark">!</span>
            <div>
              <strong>{title}</strong>
              <p>{body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function ContextDietSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const heading = entrance(frame, fps)

  const tips = [
    ['サブエージェントに分離', '大量のファイル読みは部下に任せる（第9回）'],
    ['スキルは短く書く', '1ページに収め、判断基準だけを残す'],
    ['大きいファイルは部分読み', '「◯◯の部分だけ読んで」と範囲を指定する'],
    ['使わないMCPは外す', '頻度が低い連携は必要なときだけ有効化']
  ]

  return (
    <section className="remotion-slide e13-slide">
      <div style={lift(heading, 24)}>
        <span className="slide-kicker">最適化テクニック</span>
        <h1>4つのダイエット術</h1>
      </div>
      <div className="e13-diet">
        {tips.map(([title, body], index) => (
          <div key={title} style={lift(entrance(frame, fps, 22 + index * 11), 26)}>
            <strong>{index + 1}</strong>
            <div>
              <span>{title}</span>
              <p>{body}</p>
            </div>
          </div>
        ))}
      </div>
      <p className="e13-note" style={lift(entrance(frame, fps, 80), 18)}>
        会話が長くなったら <code className="e13-cmd">/compact</code> で要約して継続するのも有効（第7回）。
      </p>
    </section>
  )
}

function BalanceSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const heading = entrance(frame, fps)
  const scale = entrance(frame, fps, 22)
  const note = entrance(frame, fps, 46)

  return (
    <section className="remotion-slide e13-slide e13-balance">
      <div style={lift(heading, 24)}>
        <span className="slide-kicker">考え方</span>
        <h1>全部入りより、必要なものだけ</h1>
      </div>
      <div className="e13-scale" style={lift(scale, 30)}>
        <div className="e13-scale-side">
          <strong>便利さ</strong>
          <p>機能を全部盛りにすれば、できることは増える</p>
        </div>
        <div className="e13-scale-vs">⇄</div>
        <div className="e13-scale-side e13-scale-cost">
          <strong>コンテキストコスト</strong>
          <p>詰め込みすぎると、本当に必要なものが入らない</p>
        </div>
      </div>
      <p className="e13-judge" style={lift(note, 20)}>
        毎日使う機能は常時ON、たまにしか使わないものは必要なときだけ。<b>自分の使い方に合わせて調整する。</b>
      </p>
    </section>
  )
}

function DemoSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const heading = entrance(frame, fps)

  const items: ReadonlyArray<readonly [string, string]> = [
    ['スキルを作る', '「週報をまとめるスキルを作って」→ SKILL.md が生成される様子を見せる'],
    ['スキルに仕事をさせる', '作ったスキルを呼んで、実際に週報を作らせる'],
    ['/context で可視化', 'スキル追加の前後でコンテキスト使用量を比べる']
  ]

  return (
    <section className="remotion-slide e13-slide demo-slide">
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
    'スキル = 仕事の「やり方」を覚えさせる仕組み',
    '実行モードはインライン（流れを引き継ぐ）と fork（机を消費しない）',
    '/context で可視化し、4つのダイエット術で最適化',
    '便利さとコストのバランスは自分で決める'
  ]

  return (
    <section className="remotion-slide e13-slide">
      <div style={lift(heading, 24)}>
        <span className="slide-kicker">まとめ</span>
        <h1>今日のポイント</h1>
      </div>
      <div className="e13-recap">
        {points.map((point, index) => (
          <div key={point} style={lift(entrance(frame, fps, 22 + index * 11), 24)}>
            <span className="e13-check">✓</span>
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
    <section className="remotion-slide e13-slide e13-next">
      <div className="motion-grid" />
      <div style={lift(title, 30)}>
        <span className="slide-kicker">次回予告</span>
        <h1>外部連携の全て</h1>
      </div>
      <div className="e13-next-card" style={lift(card, 28)}>
        <strong>第14回</strong>
        <span>MCP vs 直接API ─ どちらで外の世界とつなぐか</span>
        <p>今日チラッと出た MCP を、正面から扱います。</p>
      </div>
      <p className="e13-cta" style={lift(cta, 18)}>
        チャンネル登録 &amp; メンバーシップ登録もよろしくお願いします！
      </p>
    </section>
  )
}
