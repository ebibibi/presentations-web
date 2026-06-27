/* eslint-disable react-refresh/only-export-components */
import { spring, useVideoConfig } from 'remotion'
import type { SlideModule, SlideRenderContext } from '../../../src/types'
import { LogoMark } from '../../../src/deck-shared'

export const slides: SlideModule['slides'] = [
  { render: (props) => <OpeningSlide {...props} /> },
  { render: (props) => <NumbersSlide {...props} /> },
  { render: (props) => <SectionSlide {...props} {...PRODUCTS_SECTION} /> },
  { render: (props) => <TopicSlide {...props} {...TOPICS.presentations} /> },
  { render: (props) => <TopicSlide {...props} {...TOPICS.debate} /> },
  { render: (props) => <TopicSlide {...props} {...TOPICS.shogi} /> },
  { render: (props) => <TopicSlide {...props} {...TOPICS.hyperv} /> },
  { render: (props) => <TopicSlide {...props} {...TOPICS.bridge} /> },
  { render: (props) => <SectionSlide {...props} {...MECHANISMS_SECTION} /> },
  { render: (props) => <TopicSlide {...props} {...TOPICS.secondBrain} /> },
  { render: (props) => <TopicSlide {...props} {...TOPICS.issueDriven} /> },
  { render: (props) => <TopicSlide {...props} {...TOPICS.parallel} /> },
  { render: (props) => <TopicSlide {...props} {...TOPICS.keyless} /> },
  { render: (props) => <RecapSlide {...props} /> }
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

// ── Slide 1: Opening ──────────────────────────────────────────────────────
function OpeningSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const title = entrance(frame, fps)
  const stat = entrance(frame, fps, 30)

  return (
    <section className="remotion-slide mwa-slide mwa-opening">
      <LogoMark />
      <div className="motion-grid" />
      <div className="mwa-opening-copy" style={lift(title, 48)}>
        <span className="slide-kicker">最近AIと一緒に作ったもの</span>
        <h1>
          全部、
          <br />
          見せます
        </h1>
      </div>
      <p className="mwa-opening-stat" style={lift(stat, 26)}>
        この1ヶ月、AIと一緒に作業したのは <strong>407</strong> セッション。
        <br />
        その中身を、まるごと棚卸しします。
      </p>
    </section>
  )
}

// ── Slide 2: By the numbers ───────────────────────────────────────────────
function NumbersSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const heading = entrance(frame, fps)

  const stats: ReadonlyArray<readonly [string, string, string]> = [
    ['407', 'セッション', '直近1ヶ月、AIと一緒に作業した回数'],
    ['140+', 'こなした作業', '重複を除いたユニークな作業の数'],
    ['15+', 'リポジトリ', '並行で動いている個人開発の数']
  ]

  return (
    <section className="remotion-slide mwa-slide">
      <div style={lift(heading, 24)}>
        <span className="slide-kicker">規模感</span>
        <h1>数字で見る、この1ヶ月</h1>
      </div>
      <div className="mwa-stats">
        {stats.map(([num, label, body], index) => (
          <div className="mwa-stat" key={label} style={lift(entrance(frame, fps, 24 + index * 12), 28)}>
            <strong>{num}</strong>
            <span>{label}</span>
            <p>{body}</p>
          </div>
        ))}
      </div>
      <p className="mwa-foot" style={lift(entrance(frame, fps, 70), 18)}>
        片手間ではなく、<b>AIが日常の作業基盤</b>になっている。
      </p>
    </section>
  )
}

// ── Section divider ───────────────────────────────────────────────────────
type SectionData = { kicker: string; label: string; lead: string; accent: string }

const PRODUCTS_SECTION: SectionData = {
  kicker: 'Chapter 1',
  label: '作ったもの',
  lead: '目に見えるプロダクト編 ─ ゼロから立ち上げたサービスとサイト',
  accent: 'var(--coral)'
}

const MECHANISMS_SECTION: SectionData = {
  kicker: 'Chapter 2',
  label: '作った仕組み',
  lead: '裏で効いている自動化編 ─ 一度作ると毎日勝手に働く仕掛け',
  accent: 'var(--teal)'
}

function SectionSlide({ frame, kicker, label, lead, accent }: SlideRenderContext & SectionData) {
  const { fps } = useVideoConfig()
  const title = entrance(frame, fps)

  return (
    <section className="remotion-slide mwa-slide mwa-section">
      <div className="motion-grid" />
      <div style={lift(title, 36)}>
        <span className="slide-kicker" style={{ color: accent }}>
          {kicker}
        </span>
        <h1 className="mwa-section-title" style={{ borderColor: accent }}>
          {label}
        </h1>
        <p className="mwa-section-lead">{lead}</p>
      </div>
    </section>
  )
}

// ── Topic slide (data-driven, one ネタ per slide) ─────────────────────────
type TopicData = {
  category: string
  name: string
  url?: string
  lead: string
  points: ReadonlyArray<string>
  accent: string
}

const C = 'var(--coral)'
const T = 'var(--teal)'

const TOPICS: Record<string, TopicData> = {
  presentations: {
    category: '作ったもの ─ Webサービス',
    name: 'Webプレゼン配信プラットフォーム',
    url: 'presentations.ebisuda.net',
    lead: '今まさに映しているこのスライド自体が、それ。',
    points: [
      'ブラウザで動くプレゼン基盤を約1日でMVPまで構築',
      '観客の閲覧モードと、自分の収録スタジオモードを分離',
      'スライドはコードで書く ─ 今日のこのデッキもAIが新規作成'
    ],
    accent: C
  },
  debate: {
    category: '作ったもの ─ Webサービス',
    name: '論点マップ',
    url: 'debate.ebisuda.net',
    lead: '政治・政策を「賛否」でなく「論点」で中立に可視化する。',
    points: [
      '各党の立場を出典付きで整理',
      '収集→承認→AI生成のパイプラインで論点記事を量産',
      '読者が立場を投票できる「みんなの意見ボード」も搭載'
    ],
    accent: C
  },
  shogi: {
    category: '作ったもの ─ Webサービス',
    name: '実戦詰将棋の将棋サイト',
    url: 'shogi.ebisuda.net',
    lead: '手作り数問から、500万問の厳選＆エンジン対局へ進化。',
    points: [
      'プロ用エンジンの公開データ500万問から良問を厳選',
      'エンジンと自由対局しながら手数順に反復練習する方式へ',
      'ブラウザ内でAIエンジンを動かす環境問題も粘って解決'
    ],
    accent: C
  },
  hyperv: {
    category: '作ったもの ─ 検証環境',
    name: 'ネストHyper-V 検証ラボ',
    lead: '1台のサーバー上に、丸ごと仮想のWindows環境を建てる。',
    points: [
      'AD・フェイルオーバークラスタ・Kerberosまで自動構築',
      'ADフォレストが約1時間22分で勝手に立ち上がる',
      '@IT新連載「AI検証ラボ」の題材にも活用中'
    ],
    accent: C
  },
  bridge: {
    category: '作ったもの ─ 開発ツール（OSS）',
    name: 'チャットからAIに開発を頼む橋渡し',
    lead: '出先のスマホからでも、話しかけるだけでAIが開発を進める。',
    points: [
      '普段のチャットからそのままAIにタスクを投げられる',
      '「これ直して」「これ作って」で裏側が動いて結果が返る',
      'このライブの準備（調査・スライド作成）もこの上で稼働'
    ],
    accent: C
  },
  secondBrain: {
    category: '作った仕組み ─ 知識の自動化',
    name: '自動で育つ「第2の脳」',
    lead: '知識管理を、人間とAIの共有メモにする。',
    points: [
      '会話やgitの記録から、状況メモが自動で最新化される',
      '技術的な知見はWikiとして自動で整理・蓄積',
      '次に同じ問題で詰まったとき、AIが蓄積を読んで即答'
    ],
    accent: T
  },
  issueDriven: {
    category: '作った仕組み ─ 開発フロー',
    name: 'Issueを書けば、AIが回す開発',
    lead: '困りごとを登録すると、修正PRまで自動で進む。',
    points: [
      'AIが内容を仕分け（トリアージ）して着手',
      'ブランチを切って修正し、PR作成まで自動',
      '人間は方針の承認と最終チェックだけ'
    ],
    accent: T
  },
  parallel: {
    category: '作った仕組み ─ 働き方',
    name: '複数のAIを同時に走らせる',
    lead: '1ヶ月407セッションの、種明かし。',
    points: [
      '調べ物・実装・レビューを複数のAIに同時に任せる',
      '作業場所を分けて（worktree）ぶつからないようにする',
      '自分は監督役 ─ 並行で進むから量がこなせる'
    ],
    accent: T
  },
  keyless: {
    category: '作った仕組み ─ セキュリティ',
    name: 'セキュリティも一気に底上げ',
    lead: '固定キー方式から、鍵を持たないID認証へ横断移行。',
    points: [
      'キー流出・ローテ漏れで全部止まるリスクを一括で解消',
      '過去の履歴に残っていた秘密情報の掃除も同時に実施',
      '地味だが効く、AIにまとめて潰してもらった改善'
    ],
    accent: T
  }
}

function TopicSlide({ frame, category, name, url, lead, points, accent }: SlideRenderContext & TopicData) {
  const { fps } = useVideoConfig()
  const heading = entrance(frame, fps)
  const card = entrance(frame, fps, 22)

  return (
    <section className="remotion-slide mwa-slide mwa-topic">
      <div style={lift(heading, 24)}>
        <span className="slide-kicker" style={{ color: accent }}>
          {category}
        </span>
        <h1>{name}</h1>
        {url ? (
          <span className="mwa-url" style={{ borderColor: accent, color: accent }}>
            {url}
          </span>
        ) : null}
      </div>
      <div className="mwa-topic-body" style={lift(card, 28)}>
        <p className="mwa-lead">{lead}</p>
        <ul className="mwa-points">
          {points.map((point, index) => (
            <li key={point} style={lift(entrance(frame, fps, 40 + index * 10), 20)}>
              <span className="mwa-bullet" style={{ background: accent }} />
              {point}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

// ── Recap ─────────────────────────────────────────────────────────────────
function RecapSlide({ frame }: SlideRenderContext) {
  const { fps } = useVideoConfig()
  const heading = entrance(frame, fps)
  const note = entrance(frame, fps, 60)

  const made = ['プレゼン基盤', '論点マップ', '実戦詰将棋', '検証ラボ', '開発ブリッジ']
  const mechanisms = ['育つ第2の脳', 'Issue駆動開発', '複数AI並走', 'セキュリティ底上げ']

  return (
    <section className="remotion-slide mwa-slide">
      <div style={lift(heading, 24)}>
        <span className="slide-kicker">まとめ</span>
        <h1>頼み方を覚えれば、ここまで作れる</h1>
      </div>
      <div className="mwa-recap">
        <div className="mwa-recap-col" style={lift(entrance(frame, fps, 22), 24)}>
          <span className="mwa-recap-head" style={{ color: C }}>
            作ったもの
          </span>
          <div className="mwa-chips">
            {made.map((m) => (
              <span key={m}>{m}</span>
            ))}
          </div>
        </div>
        <div className="mwa-recap-col" style={lift(entrance(frame, fps, 36), 24)}>
          <span className="mwa-recap-head" style={{ color: T }}>
            作った仕組み
          </span>
          <div className="mwa-chips">
            {mechanisms.map((m) => (
              <span key={m}>{m}</span>
            ))}
          </div>
        </div>
      </div>
      <p className="mwa-foot" style={lift(note, 18)}>
        自分がやったのは「何を作りたいか」を伝えただけ。<b>頼み方さえ掴めば、個人でもここまで作れる。</b>
      </p>
    </section>
  )
}
