/* eslint-disable react-refresh/only-export-components */
import type { SlideModule, SlideRenderContext } from '../../../src/types'
import {
  Callout,
  ComparisonTable,
  CtaSlide,
  SectionDivider,
  Slide,
  SlideHeading,
  Timeline,
  TitleSlide,
  useEnter,
  useStagger,
} from '../../../src/slide-kit'
import './styles.css'

export const slides: SlideModule['slides'] = [
  { id: 'opening', render: (props) => <OpeningSlide {...props} /> },
  { id: 'cta-intro', render: (props) => <CtaSlide {...props} /> },
  { id: 'basics-tokens', render: (props) => <BasicsTokensSlide {...props} /> },
  { id: 'basics-stateless', render: (props) => <BasicsStatelessSlide {...props} /> },
  { id: 'three-turns', render: (props) => <ThreeTurnsSlide {...props} /> },
  { id: 'misconception', render: (props) => <MisconceptionSlide {...props} /> },
  { id: 'within-vs-after', render: (props) => <WithinVsAfterSlide {...props} /> },
  { id: 'ttl-table', render: (props) => <TtlTableSlide {...props} /> },
  { id: 'prefix-match', render: (props) => <PrefixMatchSlide {...props} /> },
  { id: 'cost-example', render: (props) => <CostExampleSlide {...props} /> },
  { id: 'section-openai', render: (props) => <SectionOpenAiSlide {...props} /> },
  { id: 'openai-timeline', render: (props) => <OpenAiTimelineSlide {...props} /> },
  { id: 'twelve-hour', render: (props) => <TwelveHourSlide {...props} /> },
  { id: 'three-vendors', render: (props) => <ThreeVendorsSlide {...props} /> },
  { id: 'breakers', render: (props) => <BreakersSlide {...props} /> },
  { id: 'layout', render: (props) => <LayoutSlide {...props} /> },
  { id: 'checklist', render: (props) => <ChecklistSlide {...props} /> },
  { id: 'glossary', render: (props) => <GlossarySlide {...props} /> },
  { id: 'sources', render: (props) => <SourcesSlide {...props} /> },
  { id: 'cta-outro', render: (props) => <CtaSlide {...props} /> },
]

/* ── shared diagram parts ─────────────────────────────────── */

/**
 * hit = read from the cache, write = read for the first time and saved for next time,
 * compute = read normally with no cache, miss = cache expired or prefix changed,
 * output = what the AI writes back.
 */
type SegmentState = 'hit' | 'write' | 'compute' | 'miss' | 'output'

type Segment = {
  label: string
  state: SegmentState
  /**
   * Width in fixed units. The same segment is drawn at the same width on every
   * row, so a growing conversation reads as a longer strip, not a squeezed one.
   */
  grow?: number
}

/** Fixed width for a segment of `units` units, gaps between units included. */
function segmentWidth(units: number): string {
  return `calc(${units} * var(--pc-unit) + ${units - 1} * var(--pc-gap))`
}

type TokenRowProps = {
  frame: number
  label: string
  note?: string
  items: Segment[]
  /** The answer the AI writes back, drawn after an arrow. */
  body?: string
  delay: number
}

/** One request drawn as a strip of prompt segments, coloured by what happened to them. */
function TokenRow({ frame, label, note, items, body, delay }: TokenRowProps) {
  const rowStyle = useEnter(frame, delay, 18)
  const cells = useStagger(frame, items.length + 1, { start: delay + 6, step: 6, distance: 12 })

  return (
    <div className={body ? 'pc-row pc-row-turn' : 'pc-row'} style={rowStyle}>
      <strong className="pc-row-label">{label}</strong>
      <div className="pc-strip">
        {items.map((item, index) => (
          <span
            key={`${item.label}-${index}`}
            className={`pc-seg pc-seg-${item.state}`}
            style={{ ...cells[index], width: segmentWidth(item.grow ?? 1) }}
          >
            {item.label}
          </span>
        ))}
      </div>
      {body ? (
        <div className="pc-answer" style={cells[items.length]}>
          <span aria-hidden="true">→</span>
          <span className="pc-seg pc-seg-output">{body}</span>
        </div>
      ) : null}
      {note ? <p className="pc-row-note">{note}</p> : null}
    </div>
  )
}

function Legend({ frame, items }: { frame: number; items: { label: string; state: SegmentState }[] }) {
  const style = useEnter(frame, 70, 10)

  return (
    <div className="pc-legend" style={style}>
      {items.map((item) => (
        <span key={item.label} className="pc-legend-item">
          <i className={`pc-swatch pc-seg-${item.state}`} />
          {item.label}
        </span>
      ))}
    </div>
  )
}

/* ── opening and basics ───────────────────────────────────── */

function OpeningSlide({ frame }: SlideRenderContext) {
  return (
    <TitleSlide
      frame={frame}
      kicker="前提知識なしで分かる｜2026年10月"
      heading={'AIの\nプロンプトキャッシュ図解'}
      lead="AIは毎回、会話を最初から全部読み直している"
      points={[
        { step: '01', heading: '前回読んだところを再利用', body: '読み直しが安く、速くなる' },
        { step: '02', heading: 'ただし有効期限つき', body: 'Claude は5分、OpenAI は30分（既定）' },
        { step: '03', heading: 'OpenAI が12時間に', body: '2026年10月20日。間隔が空いても効く' },
      ]}
    />
  )
}

function BasicsTokensSlide({ frame }: SlideRenderContext) {
  const parts = useStagger(frame, 3, { start: 22, step: 12 })

  return (
    <Slide className="pc-slide">
      <SlideHeading
        frame={frame}
        kicker="前提1"
        heading={'AIの料金は\n「読んだ量」と「書いた量」で決まる'}
        lead="プログラムからAIを使う（API）場合の話"
      />
      <div className="pc-io">
        <div className="pc-io-box pc-seg-compute" style={parts[0]}>
          <strong>入力</strong>
          <span>AIに渡す文章</span>
          <b>$2</b>
        </div>
        <div className="pc-io-ai" style={parts[1]}>
          <span aria-hidden="true">→</span>
          <strong>AI</strong>
          <span aria-hidden="true">→</span>
        </div>
        <div className="pc-io-box pc-seg-output" style={parts[2]}>
          <strong>出力</strong>
          <span>AIが書く答え</span>
          <b>$10</b>
        </div>
      </div>
      <p className="pc-io-note">100万トークンあたりの料金（例：Claude Sonnet 5.5）</p>
      <Callout frame={frame} icon="🔤" label="トークン ＝ 文章の量の単位" delay={60}>
        <p>単語や文字のかたまり。日本語ならざっくり1文字前後。10万トークンで文庫本1冊くらい</p>
      </Callout>
    </Slide>
  )
}

function BasicsStatelessSlide({ frame }: SlideRenderContext) {
  return (
    <Slide className="pc-slide">
      <SlideHeading
        frame={frame}
        kicker="前提2（いちばん大事）"
        heading={'AIは会話を覚えていない\n毎回、全部を送り直している'}
      />
      <div className="pc-diagram">
        <TokenRow
          frame={frame}
          delay={18}
          label="1回目"
          body="答え1"
          items={[
            { label: '最初の指示文', state: 'compute', grow: 2 },
            { label: '質問1', state: 'compute' },
          ]}
        />
        <TokenRow
          frame={frame}
          delay={34}
          label="2回目"
          body="答え2"
          items={[
            { label: '最初の指示文', state: 'compute', grow: 2 },
            { label: '質問1', state: 'compute' },
            { label: '答え1', state: 'compute' },
            { label: '質問2', state: 'compute' },
          ]}
        />
        <TokenRow
          frame={frame}
          delay={50}
          label="3回目"
          body="答え3"
          items={[
            { label: '最初の指示文', state: 'compute', grow: 2 },
            { label: '質問1', state: 'compute' },
            { label: '答え1', state: 'compute' },
            { label: '質問2', state: 'compute' },
            { label: '答え2', state: 'compute' },
            { label: '質問3', state: 'compute' },
          ]}
        />
      </div>
      <Callout frame={frame} tone="warn" icon="⛄" label="会話が長くなるほど、毎回読む量が雪だるま式に増える" delay={70}>
        <p>チャットのアプリが会話を続けられるのは、アプリがこの送り直しをやってくれているから</p>
      </Callout>
    </Slide>
  )
}

function ThreeTurnsSlide({ frame }: SlideRenderContext) {
  return (
    <Slide className="pc-slide">
      <SlideHeading
        frame={frame}
        kicker="同じ3往復に色を付けると"
        heading={'キャッシュが効くのは\n「前回送ったところ」まで'}
      />
      <div className="pc-diagram">
        <TokenRow
          frame={frame}
          delay={18}
          label="1回目"
          body="答え1"
          note="全部はじめて。読んだ結果を次のために保存（少し割増し）"
          items={[
            { label: '最初の指示文', state: 'write', grow: 2 },
            { label: '質問1', state: 'write' },
          ]}
        />
        <TokenRow
          frame={frame}
          delay={36}
          label="2回目"
          body="答え2"
          note="1回目に送ったところまでキャッシュ。はじめて読むのは答え1と質問2"
          items={[
            { label: '最初の指示文', state: 'hit', grow: 2 },
            { label: '質問1', state: 'hit' },
            { label: '答え1', state: 'write' },
            { label: '質問2', state: 'write' },
          ]}
        />
        <TokenRow
          frame={frame}
          delay={54}
          label="3回目"
          body="答え3"
          note="2回目に送ったところまでキャッシュ。はじめて読むのは答え2と質問3"
          items={[
            { label: '最初の指示文', state: 'hit', grow: 2 },
            { label: '質問1', state: 'hit' },
            { label: '答え1', state: 'hit' },
            { label: '質問2', state: 'hit' },
            { label: '答え2', state: 'write' },
            { label: '質問3', state: 'write' },
          ]}
        />
        <Legend
          frame={frame}
          items={[
            { label: 'キャッシュから読む（入力の約1/10の料金）', state: 'hit' },
            { label: 'はじめて読む＋保存', state: 'write' },
            { label: '答え（毎回ふつうに書く）', state: 'output' },
          ]}
        />
      </div>
    </Slide>
  )
}

function MisconceptionSlide({ frame }: SlideRenderContext) {
  return (
    <Slide className="pc-slide">
      <SlideHeading
        frame={frame}
        kicker="よくある誤解"
        heading={'保存しているのは「答え」ではなく\n「読んだときのメモ」'}
        lead="AIが入力を読む途中で作る計算結果（専門用語で KV キャッシュ）"
      />
      <ComparisonTable
        frame={frame}
        columns={[{ label: 'よくある誤解' }, { label: '実際', accent: true }]}
        rows={[
          { label: '何を保存', cells: ['前回の答え', '入力を読んだときのメモ'] },
          { label: '答え', cells: ['前と同じ答えが返る', '毎回新しく書く'] },
          { label: '効く条件', cells: ['似た質問なら効く', '先頭からまったく同じとき'] },
          { label: '安くなるのは', cells: ['答えの料金', '入力を読む料金'] },
        ]}
      />
    </Slide>
  )
}

/* ── expiry ───────────────────────────────────────────────── */

function WithinVsAfterSlide({ frame }: SlideRenderContext) {
  return (
    <Slide className="pc-slide">
      <SlideHeading
        frame={frame}
        kicker="キャッシュには有効期限がある（Claude は既定5分）"
        heading={'同じ質問・同じ答えでも\n期限内と期限切れでこう違う'}
        lead="前回までの会話が5万トークンある状態で、次の質問をする"
      />
      <div className="pc-diagram">
        <TokenRow
          frame={frame}
          delay={20}
          label="3分後"
          body="答え"
          note="期限内：前回までをキャッシュから読む"
          items={[
            { label: '前回までの会話 5万トークン', state: 'hit', grow: 4 },
            { label: '質問', state: 'write' },
          ]}
        />
        <TokenRow
          frame={frame}
          delay={38}
          label="10分後"
          body="答え"
          note="期限切れ：全部読み直して、もう一度保存"
          items={[
            { label: '前回までの会話 5万トークン', state: 'miss', grow: 4 },
            { label: '質問', state: 'write' },
          ]}
        />
      </div>
      <ComparisonTable
        frame={frame}
        columns={[{ label: '3分後（期限内）', accent: true }, { label: '10分後（期限切れ）' }]}
        rows={[
          { label: '会話を読む料金', cells: ['$0.005', '$0.125（25倍）'] },
          { label: '返事が出始めるまで', cells: ['速い', '遅い（長い会話ほど）'] },
          { label: '答えの中身', cells: ['同じ', '同じ'] },
        ]}
      />
    </Slide>
  )
}

function TtlTableSlide({ frame }: SlideRenderContext) {
  return (
    <Slide className="pc-slide">
      <SlideHeading
        frame={frame}
        kicker="2026年10月時点の公式ドキュメント"
        heading="有効期限は会社ごとに違う"
        lead="長い期限ほど、最初の保存料が高い"
      />
      <ComparisonTable
        frame={frame}
        columns={[{ label: '既定の期限' }, { label: '長くすると', accent: true }]}
        rows={[
          { label: 'OpenAI', cells: ['30分（保存料1.25倍）', '12時間（保存料2.5倍）'] },
          { label: 'Claude', cells: ['5分（保存料1.25倍）', '1時間（保存料2倍）'] },
          { label: 'Gemini', cells: ['自動（割引の保証なし）', '自分で作る：既定1時間＋置いておく料金'] },
        ]}
      />
      <Callout frame={frame} icon="⏱️" label="Claude は「最後に使ってから」5分" delay={60}>
        <p>使うたびに期限が無料で延びる。会話を続けている間は切れにくい</p>
      </Callout>
    </Slide>
  )
}

function PrefixMatchSlide({ frame }: SlideRenderContext) {
  return (
    <Slide className="pc-slide">
      <SlideHeading
        frame={frame}
        kicker="もう1つのルール"
        heading={'先頭から同じでないと効かない'}
        lead="途中が1文字違うと、そこから後ろは全部読み直し"
      />
      <div className="pc-diagram">
        <TokenRow
          frame={frame}
          delay={18}
          label="前回"
          items={[
            { label: '最初の指示文', state: 'write', grow: 2 },
            { label: '資料', state: 'write', grow: 3 },
            { label: '質問1', state: 'write' },
          ]}
        />
        <TokenRow
          frame={frame}
          delay={34}
          label="今回A"
          note="質問だけ違う → 資料まで効く"
          items={[
            { label: '最初の指示文', state: 'hit', grow: 2 },
            { label: '資料', state: 'hit', grow: 3 },
            { label: '質問2', state: 'write' },
          ]}
        />
        <TokenRow
          frame={frame}
          delay={50}
          label="今回B"
          note="先頭に今の日時を入れただけ → 全部外れる"
          items={[
            { label: '日時', state: 'miss' },
            { label: '最初の指示文', state: 'miss', grow: 2 },
            { label: '資料', state: 'miss', grow: 3 },
            { label: '質問2', state: 'write' },
          ]}
        />
        <Legend
          frame={frame}
          items={[
            { label: 'キャッシュから読む', state: 'hit' },
            { label: 'はじめて読む＋保存', state: 'write' },
            { label: '外れて全部読み直し', state: 'miss' },
          ]}
        />
      </div>
      <Callout frame={frame} icon="🧠" label="なぜ？" delay={76}>
        <p>AIがある文字を読んだ結果は、それより前の全部の文字に左右されるから</p>
      </Callout>
    </Slide>
  )
}

function CostExampleSlide({ frame }: SlideRenderContext) {
  const totals = useStagger(frame, 2, { start: 30, step: 16 })

  return (
    <Slide className="pc-slide">
      <SlideHeading
        frame={frame}
        kicker="料金の計算例（単価は公式、計算は筆者）"
        heading={'10万トークンの資料に\n100回質問すると'}
        lead="資料を読む料金だけを比べる（Claude Sonnet 5.5 / GPT-6.1 Sol）"
      />
      <div className="pc-cost">
        <div className="pc-cost-row" style={totals[0]}>
          <span className="pc-cost-label">キャッシュなし</span>
          <div className="pc-cost-track">
            <i className="pc-cost-bar pc-seg-compute" style={{ width: '100%' }} />
          </div>
          <b>$20.00</b>
          <p>100回とも全部読む</p>
        </div>
        <div className="pc-cost-row" style={totals[1]}>
          <span className="pc-cost-label">キャッシュあり</span>
          <div className="pc-cost-track">
            <i className="pc-cost-bar pc-seg-write" style={{ width: '1.25%' }} />
            <i className="pc-cost-bar pc-seg-hit" style={{ width: '4.95%' }} />
          </div>
          <b>$1.24</b>
          <p>1回目に読んで保存 $0.25 ＋ 残り99回はキャッシュから $0.99</p>
        </div>
      </div>
      <Callout frame={frame} tone="good" icon="📉" label="約94%減" delay={64}>
        <p>前提：100回とも有効期限内に聞く。期限が切れると毎回保存し直しになり、かえって高くつく</p>
      </Callout>
    </Slide>
  )
}

/* ── OpenAI ───────────────────────────────────────────────── */

function SectionOpenAiSlide({ frame }: SlideRenderContext) {
  return (
    <SectionDivider
      frame={frame}
      step="02"
      kicker="OpenAI の最新動向"
      heading={'DevDay 2026 の前後で\nキャッシュが一気に変わった'}
      lead="そして10月20日、12時間キャッシュ"
    />
  )
}

function OpenAiTimelineSlide({ frame }: SlideRenderContext) {
  return (
    <Slide className="pc-slide">
      <SlideHeading frame={frame} kicker="OpenAI 公式 changelog より" heading="2026年のキャッシュ改善" />
      <Timeline
        frame={frame}
        orientation="vertical"
        steps={[
          { label: '7/9', heading: 'キャッシュの区切りを自分で指定', body: 'GPT-5.6 から' },
          { label: '8/20', heading: 'キャッシュの効き具合を見る画面', body: 'どれだけキャッシュから読めたかのグラフ' },
          { label: '9/8', heading: '効かなかった理由を教える診断', body: '一般提供に' },
          { label: '9/29', heading: 'DevDay 2026：GPT-6.1 Sol', body: 'キャッシュから読む料金が入力の0.05倍（95%引き）' },
          { label: '10/20', heading: '12時間キャッシュ', body: '数時間あいても割引が効く', accent: true },
        ]}
      />
    </Slide>
  )
}

type HourlyRowProps = {
  frame: number
  delay: number
  label: string
  body: string
  /** One state per hourly call. */
  items: SegmentState[]
}

/** Twelve hourly calls drawn as cells, with what they cost in total. */
function HourlyRow({ frame, delay, label, body, items }: HourlyRowProps) {
  const rowStyle = useEnter(frame, delay, 14)
  const cells = useStagger(frame, items.length, { start: delay + 4, step: 3, distance: 8 })

  return (
    <div className="pc-hourly-row" style={rowStyle}>
      <strong>{label}</strong>
      <div className="pc-hourly-cells">
        {items.map((state, index) => (
          <i key={index} className={`pc-hourly-cell pc-seg-${state}`} style={cells[index]} />
        ))}
      </div>
      <b>{body}</b>
    </div>
  )
}

const ALL_COMPUTE: SegmentState[] = Array.from({ length: 12 }, () => 'compute')
const ALL_WRITE: SegmentState[] = Array.from({ length: 12 }, () => 'write')
const WRITE_ONCE: SegmentState[] = ['write', ...Array.from({ length: 11 }, (): SegmentState => 'hit')]

function TwelveHourSlide({ frame }: SlideRenderContext) {
  return (
    <Slide className="pc-slide">
      <SlideHeading
        frame={frame}
        kicker="12時間キャッシュ（2026年10月20日）"
        heading={'1時間おきに使うなら\n30分では毎回切れてしまう'}
        lead="10万トークンの資料に1時間おきに12回質問（GPT-6.1 Sol・筆者の計算）"
      />
      <div className="pc-hourly">
        <div className="pc-hourly-axis">
          <span>0時間</span>
          <span>→</span>
          <span>11時間</span>
        </div>
        <HourlyRow frame={frame} delay={20} label="キャッシュなし" body="$2.40" items={ALL_COMPUTE} />
        <HourlyRow frame={frame} delay={34} label="期限30分" body="$3.00" items={ALL_WRITE} />
        <HourlyRow frame={frame} delay={48} label="期限12時間" body="$0.61" items={WRITE_ONCE} />
        <Legend
          frame={frame}
          items={[
            { label: '全部読む（ふつうの料金）', state: 'compute' },
            { label: '読む＋保存（割増し）', state: 'write' },
            { label: 'キャッシュから読む', state: 'hit' },
          ]}
        />
      </div>
      <Callout frame={frame} icon="⚙️" label="30分だと、むしろキャッシュなしより高い" delay={72}>
        <p>毎回期限切れで保存料だけ払う。数分おきに使うなら30分で十分</p>
      </Callout>
    </Slide>
  )
}

function ThreeVendorsSlide({ frame }: SlideRenderContext) {
  return (
    <Slide className="pc-slide">
      <SlideHeading frame={frame} kicker="2026年10月21日時点の公式ドキュメント" heading="3社でここが違う" />
      <ComparisonTable
        frame={frame}
        columns={[{ label: 'OpenAI', accent: true }, { label: 'Claude' }, { label: 'Gemini' }]}
        rows={[
          { label: '使い方', cells: ['何もしなくても自動', '「ここまで」の印を付ける', '自動（保証なし）か自分で作る'] },
          { label: 'キャッシュから読む料金', cells: ['入力の0.1倍〜0.05倍', '入力の0.1倍〜0.05倍', '料金表では入力の1/10'] },
          { label: '最小の長さ', cells: ['1,024トークン', '512〜4,096トークン', '2,048〜4,096トークン'] },
        ]}
      />
      <Callout frame={frame} icon="💡" label="短い会話には効かない" delay={60}>
        <p>最小の長さに届かないと、エラーにはならずにふつうに読まれるだけ</p>
      </Callout>
    </Slide>
  )
}

/* ── practice ─────────────────────────────────────────────── */

function BreakersSlide({ frame }: SlideRenderContext) {
  return (
    <Slide className="pc-slide">
      <SlideHeading frame={frame} kicker="Claude Code チームが実際に踏んだ" heading="キャッシュを壊す5つの例" />
      <Timeline
        frame={frame}
        orientation="vertical"
        steps={[
          { label: '1', heading: '最初の指示文に細かい日時', body: '毎回先頭が変わり、全部外れる', accent: true },
          { label: '2', heading: 'AIが使う道具の説明の並び順が毎回違う', body: '並び順まで同じでないと別物になる' },
          { label: '3', heading: '会話の途中で道具を足す・消す', body: '会話全体のキャッシュが無効になる' },
          { label: '4', heading: '会話の途中でAIのモデルを変える', body: 'キャッシュはモデルごと。作り直しで逆に高くつく' },
          { label: '5', heading: '間隔が期限より長い／会話が短すぎる', body: '期限切れ、または最小の長さに届かない' },
        ]}
      />
    </Slide>
  )
}

const LAYERS = [
  { label: '変わらない指示文・道具の説明', body: 'ほぼ変わらない' },
  { label: 'プロジェクトのルール・資料', body: 'プロジェクトの中では同じ' },
  { label: 'その作業の情報', body: '作業の間は同じ' },
  { label: '会話・今回の質問', body: '毎回変わる' },
]

function LayoutSlide({ frame }: SlideRenderContext) {
  const layers = useStagger(frame, LAYERS.length, { start: 22, step: 10, distance: 16 })

  return (
    <Slide className="pc-slide">
      <SlideHeading
        frame={frame}
        kicker="置き方の原則（Claude Code の並び順）"
        heading={'変わらないものを前に\n変わるものを後ろに'}
      />
      <div className="pc-layers">
        <div className="pc-layer-stack">
          {LAYERS.map((layer, index) => (
            <div key={layer.label} className={`pc-layer pc-layer-${index}`} style={layers[index]}>
              <strong>{layer.label}</strong>
              <span>{layer.body}</span>
            </div>
          ))}
        </div>
        <div className="pc-layer-axis" aria-hidden="true">
          <span>先頭</span>
          <i />
          <span>末尾</span>
        </div>
      </div>
      <Callout frame={frame} tone="good" icon="🚨" label="キャッシュの効きが落ちたら障害扱い" delay={70}>
        <p>Claude Code チームは効き具合を監視している。古くなった情報は先頭を書き換えず、次のメッセージで足す</p>
      </Callout>
    </Slide>
  )
}

function ChecklistSlide({ frame }: SlideRenderContext) {
  return (
    <Slide className="pc-slide">
      <SlideHeading
        frame={frame}
        kicker="APIでAIを使っている人向け（筆者の提案）"
        heading="今日確認する3項目"
        lead="アプリを使うだけなら、各社が裏でやってくれている"
      />
      <Timeline
        frame={frame}
        orientation="vertical"
        steps={[
          {
            label: '1',
            heading: '返ってくる使用量（usage）を見る',
            body: 'OpenAI は cached_tokens、Claude は cache_read_input_tokens。0 なら効いていない',
            accent: true,
          },
          { label: '2', heading: '先頭に日時・ユーザー名・毎回変わるIDがないか', body: '変わるものは後ろへ移す' },
          { label: '3', heading: '使う間隔と有効期限を合わせる', body: '1時間おきなら長い期限、数分おきなら既定で十分' },
        ]}
      />
    </Slide>
  )
}

function GlossarySlide({ frame }: SlideRenderContext) {
  return (
    <Slide className="pc-slide">
      <SlideHeading frame={frame} kicker="読み返す用" heading="用語まとめ" />
      <ComparisonTable
        frame={frame}
        columns={[{ label: '意味', accent: true }]}
        rows={[
          { label: 'API', cells: ['プログラムからAIを使う方法。使った量だけ料金'] },
          { label: 'トークン', cells: ['文章の量の単位。日本語ならざっくり1文字前後'] },
          { label: '入力・出力', cells: ['AIに渡す文章と、AIが書く答え。料金は別々'] },
          { label: 'キャッシュ', cells: ['前回読んだときのメモを、しばらくとっておくこと'] },
          { label: '有効期限', cells: ['メモをとっておく時間。切れたら全部読み直し'] },
          { label: '保存料', cells: ['はじめて読んでメモを作るときの割増し料金'] },
        ]}
      />
    </Slide>
  )
}

const SOURCES = [
  { label: 'OpenAI API Changelog（2026年10月20日 12時間キャッシュ ほか）', url: 'https://developers.openai.com/api/docs/changelog' },
  { label: 'OpenAI Prompt caching ガイド', url: 'https://developers.openai.com/api/docs/guides/prompt-caching' },
  { label: 'Claude Prompt caching ドキュメント', url: 'https://platform.claude.com/docs/en/build-with-claude/prompt-caching' },
  { label: 'Lessons from building Claude Code: Prompt caching is everything（2026年4月30日）', url: 'https://claude.dev/blog/lessons-from-building-claude-code-prompt-caching-is-everything/' },
  { label: 'Gemini API Context caching', url: 'https://ai.google.dev/gemini-api/docs/caching' },
  { label: 'vLLM Automatic Prefix Caching（仕組みの説明）', url: 'https://docs.vllm.ai/en/latest/design/prefix_caching.html' },
]

function SourcesSlide({ frame }: SlideRenderContext) {
  const items = useStagger(frame, SOURCES.length, { start: 16, step: 6, distance: 10 })

  return (
    <Slide className="pc-slide">
      <SlideHeading frame={frame} kicker="出典" heading="一次情報はここ" lead="料金は2026年10月21日時点。計算例は公式単価から筆者が計算" />
      <ul className="pc-sources">
        {SOURCES.map((source, index) => (
          <li key={source.url} style={items[index]}>
            <a href={source.url} target="_blank" rel="noreferrer">
              {source.label}
            </a>
          </li>
        ))}
      </ul>
    </Slide>
  )
}
