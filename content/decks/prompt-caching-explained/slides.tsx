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
  { id: 'misconception', render: (props) => <MisconceptionSlide {...props} /> },
  { id: 'kv-cache', render: (props) => <KvCacheSlide {...props} /> },
  { id: 'prefix-match', render: (props) => <PrefixMatchSlide {...props} /> },
  { id: 'two-effects', render: (props) => <TwoEffectsSlide {...props} /> },
  { id: 'cost-example', render: (props) => <CostExampleSlide {...props} /> },
  { id: 'section-openai', render: (props) => <SectionOpenAiSlide {...props} /> },
  { id: 'openai-timeline', render: (props) => <OpenAiTimelineSlide {...props} /> },
  { id: 'twelve-hour', render: (props) => <TwelveHourSlide {...props} /> },
  { id: 'three-vendors', render: (props) => <ThreeVendorsSlide {...props} /> },
  { id: 'breakers', render: (props) => <BreakersSlide {...props} /> },
  { id: 'layout', render: (props) => <LayoutSlide {...props} /> },
  { id: 'checklist', render: (props) => <ChecklistSlide {...props} /> },
  { id: 'sources', render: (props) => <SourcesSlide {...props} /> },
  { id: 'cta-outro', render: (props) => <CtaSlide {...props} /> },
]

/* ── shared diagram parts ─────────────────────────────────── */

/** compute = read from scratch, hit = taken from the cache, miss = recomputed after a mismatch. */
type SegmentState = 'compute' | 'hit' | 'miss' | 'write'

type Segment = {
  label: string
  state: SegmentState
  /** Relative width; the long document is drawn wider than the question. */
  grow?: number
}

type TokenRowProps = {
  frame: number
  label: string
  note?: string
  items: Segment[]
  delay: number
}

/** One request drawn as a strip of prompt segments, coloured by what happened to them. */
function TokenRow({ frame, label, note, items, delay }: TokenRowProps) {
  const rowStyle = useEnter(frame, delay, 18)
  const cells = useStagger(frame, items.length, { start: delay + 6, step: 6, distance: 12 })

  return (
    <div className="pc-row" style={rowStyle}>
      <strong className="pc-row-label">{label}</strong>
      <div className="pc-strip">
        {items.map((item, index) => (
          <span
            key={`${item.label}-${index}`}
            className={`pc-seg pc-seg-${item.state}`}
            style={{ ...cells[index], flexGrow: item.grow ?? 1 }}
          >
            {item.label}
          </span>
        ))}
      </div>
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

/* ── slides ───────────────────────────────────────────────── */

function OpeningSlide({ frame }: SlideRenderContext) {
  return (
    <TitleSlide
      frame={frame}
      kicker="OpenAI・Claude・Gemini｜2026年10月"
      heading={'AIの\nプロンプトキャッシュ図解'}
      lead="先頭が同じなら、2回目は読み直さない"
      points={[
        { step: '01', heading: '同じ資料に100回質問', body: '資料部分の入力料金 $20 → 約 $1.24' },
        { step: '02', heading: 'OpenAI が12時間に', body: '2026年10月20日。間隔が空いても効く' },
        { step: '03', heading: '壊さない置き方', body: '変わらないものを前、変わるものを後ろ' },
      ]}
    />
  )
}

function MisconceptionSlide({ frame }: SlideRenderContext) {
  return (
    <Slide className="pc-slide">
      <SlideHeading
        frame={frame}
        kicker="最初の誤解"
        heading={'保存するのは「答え」ではなく\n「読んだ途中の計算」'}
      />
      <ComparisonTable
        frame={frame}
        columns={[{ label: 'よくある誤解' }, { label: '実際', accent: true }]}
        rows={[
          { label: '何を保存', cells: ['前回の答え', '入力を読んだ途中の計算（KV）'] },
          { label: '出力', cells: ['同じ答えが返ってくる', '毎回ちゃんと生成される'] },
          { label: '当たる条件', cells: ['似た質問なら当たる', '先頭がまったく同じときだけ'] },
          { label: '効くところ', cells: ['答えの生成', '長い入力の読み込み'] },
        ]}
      />
    </Slide>
  )
}

function KvCacheSlide({ frame }: SlideRenderContext) {
  const storeStyle = useEnter(frame, 40, 14)

  return (
    <Slide className="pc-slide">
      <SlideHeading
        frame={frame}
        kicker="仕組み"
        heading={'読んだ結果（KV）を\nリクエストをまたいで取っておく'}
        lead="LLM は入力を読むとき、トークンごとに Key と Value を計算する"
      />
      <div className="pc-diagram">
        <TokenRow
          frame={frame}
          delay={18}
          label="1回目"
          note="全部を読む。読んだ結果（KV）を保存する"
          items={[
            { label: 'システム', state: 'write' },
            { label: 'ツール定義', state: 'write' },
            { label: '資料 10万トークン', state: 'write', grow: 3 },
            { label: '質問1', state: 'compute' },
          ]}
        />
        <div className="pc-store" style={storeStyle}>
          <span aria-hidden="true">⬇</span>
          <strong>KV キャッシュ</strong>
          <p>GPU のメモリに置いておく</p>
          <span aria-hidden="true">⬇</span>
        </div>
        <TokenRow
          frame={frame}
          delay={56}
          label="2回目"
          note="資料までは読み出すだけ。計算するのは増えた末尾だけ"
          items={[
            { label: 'システム', state: 'hit' },
            { label: 'ツール定義', state: 'hit' },
            { label: '資料 10万トークン', state: 'hit', grow: 3 },
            { label: '質問2', state: 'compute' },
          ]}
        />
        <Legend
          frame={frame}
          items={[
            { label: '計算してキャッシュに書く', state: 'write' },
            { label: 'キャッシュから読む', state: 'hit' },
            { label: '計算する', state: 'compute' },
          ]}
        />
      </div>
    </Slide>
  )
}

function PrefixMatchSlide({ frame }: SlideRenderContext) {
  return (
    <Slide className="pc-slide">
      <SlideHeading
        frame={frame}
        kicker="いちばん大事なルール"
        heading={'先頭が1文字でも違えば\nそこから後ろは全部外れる'}
        lead="あるトークンの計算は、それより前の全トークンに依存するから"
      />
      <div className="pc-diagram">
        <TokenRow
          frame={frame}
          delay={18}
          label="A"
          items={[
            { label: 'システム', state: 'write' },
            { label: 'ツール定義', state: 'write' },
            { label: '資料', state: 'write', grow: 3 },
            { label: '質問1', state: 'compute' },
          ]}
        />
        <TokenRow
          frame={frame}
          delay={34}
          label="B"
          note="質問だけ違う → 資料まで当たる"
          items={[
            { label: 'システム', state: 'hit' },
            { label: 'ツール定義', state: 'hit' },
            { label: '資料', state: 'hit', grow: 3 },
            { label: '質問2', state: 'compute' },
          ]}
        />
        <TokenRow
          frame={frame}
          delay={50}
          label="C"
          note="先頭に日時を入れただけ → 全部外れる"
          items={[
            { label: '10/21 11:42', state: 'miss' },
            { label: 'システム', state: 'miss' },
            { label: 'ツール定義', state: 'miss' },
            { label: '資料', state: 'miss', grow: 3 },
            { label: '質問2', state: 'compute' },
          ]}
        />
        <Legend
          frame={frame}
          items={[
            { label: '書く', state: 'write' },
            { label: '当たった', state: 'hit' },
            { label: '外れて計算し直し', state: 'miss' },
          ]}
        />
      </div>
    </Slide>
  )
}

function TwoEffectsSlide({ frame }: SlideRenderContext) {
  const cards = useStagger(frame, 2, { start: 20, step: 14 })

  return (
    <Slide className="pc-slide">
      <SlideHeading frame={frame} kicker="効き目" heading="速くなる。安くなる。" />
      <div className="pc-effects">
        <section className="pc-effect" style={cards[0]}>
          <span className="pc-effect-tag">速い</span>
          <strong>最初の1文字が出るまで</strong>
          <div className="pc-bars">
            <BarLine frame={frame} delay={34} label="キャッシュなし" body="11.5秒" ratio={1} state="compute" />
            <BarLine frame={frame} delay={44} label="キャッシュあり" body="2.4秒" ratio={2.4 / 11.5} state="hit" />
          </div>
          <p>10万トークンの本と対話（Anthropic 公式ブログの測定例）</p>
        </section>
        <section className="pc-effect" style={cards[1]}>
          <span className="pc-effect-tag">安い</span>
          <strong>キャッシュから読んだ入力の単価</strong>
          <div className="pc-bars">
            <BarLine frame={frame} delay={48} label="通常の入力" body="1倍" ratio={1} state="compute" />
            <BarLine frame={frame} delay={58} label="キャッシュ読み取り" body="0.1倍" ratio={0.1} state="hit" />
          </div>
          <p>3社とも基本は0.1倍。モデルによっては0.05倍</p>
        </section>
      </div>
      <Callout frame={frame} icon="💡" label="変わらないもの" delay={70}>
        <p>出力を生成する速さと、出力の中身。効くのは「入力の読み込み」だけ</p>
      </Callout>
    </Slide>
  )
}

type BarLineProps = {
  frame: number
  delay: number
  label: string
  body: string
  ratio: number
  state: SegmentState
}

function BarLine({ frame, delay, label, body, ratio, state }: BarLineProps) {
  const style = useEnter(frame, delay, 0)
  const grown = Number(style.opacity ?? 1)

  return (
    <div className="pc-bar-line">
      <span className="pc-bar-label">{label}</span>
      <div className="pc-bar-track">
        <i className={`pc-bar pc-seg-${state}`} style={{ width: `${Math.max(ratio * grown * 100, 2)}%` }} />
      </div>
      <b className="pc-bar-value">{body}</b>
    </div>
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
        lead="資料部分の入力料金だけを比べる（Claude Sonnet 5.5 / GPT-6.1 Sol）"
      />
      <div className="pc-cost">
        <div className="pc-cost-row" style={totals[0]}>
          <span className="pc-cost-label">キャッシュなし</span>
          <div className="pc-cost-track">
            <i className="pc-cost-bar pc-seg-compute" style={{ width: '100%' }} />
          </div>
          <b>$20.00</b>
          <p>100回 × 10万トークン × $2</p>
        </div>
        <div className="pc-cost-row" style={totals[1]}>
          <span className="pc-cost-label">キャッシュあり</span>
          <div className="pc-cost-track">
            <i className="pc-cost-bar pc-seg-write" style={{ width: '1.25%' }} />
            <i className="pc-cost-bar pc-seg-hit" style={{ width: '4.95%' }} />
          </div>
          <b>$1.24</b>
          <p>書き込み1回 $0.25 ＋ 読み取り99回 $0.99</p>
        </div>
      </div>
      <Callout frame={frame} tone="good" icon="📉" label="約94%減" delay={64}>
        <p>前提：100回とも有効期限内に送る。期限が切れると毎回書き込みになり、かえって高くつく</p>
      </Callout>
    </Slide>
  )
}

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
          { label: '7/9', heading: 'GPT-5.6 で明示的なキャッシュ制御', body: '区切り位置（ブレークポイント）を自分で指定できる' },
          { label: '8/20', heading: 'キャッシュのダッシュボード', body: 'ヒット率の推移、読み取り・書き込みの内訳' },
          { label: '9/8', heading: 'キャッシュ診断が一般提供', body: '外れた理由を教えてくれる' },
          { label: '9/29', heading: 'DevDay 2026：GPT-6.1 Sol', body: 'キャッシュ入力 $0.10（入力の0.05倍＝95%引き）' },
          { label: '10/20', heading: '12時間キャッシュ', body: 'Responses API。数時間あいても割引が効く', accent: true },
        ]}
      />
    </Slide>
  )
}

type TimelineRowProps = {
  frame: number
  delay: number
  label: string
  body: string
  /** One state per hourly call. */
  items: SegmentState[]
}

/** Twelve hourly calls drawn as cells, with what each one cost. */
function HourlyRow({ frame, delay, label, body, items }: TimelineRowProps) {
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
        heading={'1時間おきに呼ぶなら\n30分では切れてしまう'}
        lead="10万トークンを1時間おきに12回（GPT-6.1 Sol・筆者の計算）"
      />
      <div className="pc-hourly">
        <div className="pc-hourly-axis">
          <span>0時間</span>
          <span>→</span>
          <span>11時間</span>
        </div>
        <HourlyRow frame={frame} delay={20} label="キャッシュなし" body="$2.40" items={ALL_COMPUTE} />
        <HourlyRow frame={frame} delay={34} label="30分（既定）" body="$3.00" items={ALL_WRITE} />
        <HourlyRow frame={frame} delay={48} label="12時間" body="$0.61" items={WRITE_ONCE} />
        <Legend
          frame={frame}
          items={[
            { label: '通常の入力（1倍）', state: 'compute' },
            { label: '書き込み（30分1.25倍／12時間2.5倍）', state: 'write' },
            { label: '読み取り', state: 'hit' },
          ]}
        />
      </div>
      <Callout frame={frame} icon="⚙️" label='prompt_cache_options.ttl を "12h" に' delay={72}>
        <p>Responses API・GPT-5.6 以降。数分おきに呼ぶなら既定の30分で十分</p>
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
          { label: '使い方', cells: ['既定でオン', 'cache_control を付ける', '暗黙は既定でオン'] },
          { label: '保持時間', cells: ['30分／12時間', '5分／1時間', '明示は既定1時間'] },
          { label: '書き込み', cells: ['1.25倍／2.5倍', '1.25倍／2倍', '保存時間に応じた料金'] },
          { label: '読み取り', cells: ['0.1倍（〜0.05倍）', '0.1倍（〜0.05倍）', '料金表では1/10'] },
          { label: '最小', cells: ['1,024トークン', '512〜4,096トークン', '2,048〜4,096トークン'] },
        ]}
      />
      <Callout frame={frame} tone="warn" icon="⚠️" label="Gemini の暗黙キャッシュは割引の保証なし" delay={60}>
        <p>確実に効かせたいなら明示キャッシュ（Gemini 4 Argon 以降は非対応）</p>
      </Callout>
    </Slide>
  )
}

function BreakersSlide({ frame }: SlideRenderContext) {
  return (
    <Slide className="pc-slide">
      <SlideHeading
        frame={frame}
        kicker="Claude Code チームが実際に踏んだ"
        heading="キャッシュを壊す5つの例"
      />
      <Timeline
        frame={frame}
        orientation="vertical"
        steps={[
          { label: '1', heading: 'システムプロンプトに細かい日時', body: '毎回先頭が変わり、全部外れる', accent: true },
          { label: '2', heading: 'ツール定義の並び順が毎回違う', body: '辞書やセットの順番まかせにしていた' },
          { label: '3', heading: '会話の途中でツールを足す・消す', body: '会話全体のキャッシュが無効になる' },
          { label: '4', heading: '会話の途中でモデルを変える', body: 'キャッシュはモデルごと。作り直しで逆に高くつく' },
          { label: '5', heading: '間隔が保持時間より長い／短すぎる', body: '期限切れ、または最小トークン数に届かない' },
        ]}
      />
    </Slide>
  )
}

const LAYERS = [
  { label: '静的なシステムプロンプト・ツール', body: 'ほぼ変わらない' },
  { label: 'CLAUDE.md・参照資料', body: 'プロジェクトの中では同じ' },
  { label: 'セッションの文脈', body: 'セッションの中では同じ' },
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
      <Callout frame={frame} tone="good" icon="🚨" label="ヒット率が下がったら障害扱い" delay={70}>
        <p>Claude Code チームはヒット率にアラートを張っている。古くなった情報は先頭を書き換えず、次のメッセージで足す</p>
      </Callout>
    </Slide>
  )
}

function ChecklistSlide({ frame }: SlideRenderContext) {
  return (
    <Slide className="pc-slide">
      <SlideHeading frame={frame} kicker="調査をもとにした筆者の提案" heading="今日確認する3項目" />
      <Timeline
        frame={frame}
        orientation="vertical"
        steps={[
          {
            label: '1',
            heading: 'usage でキャッシュの読み取りを見る',
            body: 'OpenAI は cached_tokens、Claude は cache_read_input_tokens。0 なら当たっていない',
            accent: true,
          },
          { label: '2', heading: '先頭に日時・ユーザー名・ランダムな ID がないか', body: '変わるものは末尾へ移す' },
          { label: '3', heading: '呼ぶ間隔と保持時間を合わせる', body: '1時間おきなら長い保持時間、数分おきなら既定で十分' },
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
