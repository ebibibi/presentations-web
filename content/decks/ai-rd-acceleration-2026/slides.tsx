/* eslint-disable react-refresh/only-export-components */
import type { SlideRenderContext, SlideModule } from '../../../src/types'
import {
  Callout,
  ComparisonTable,
  DiagramFrame,
  FlowDiagram,
  HookSlide,
  Quote,
  SectionDivider,
  Slide,
  SlideHeading,
  Timeline,
  useStagger,
} from '../../../src/slide-kit'
import './styles.css'

export const slides: SlideModule['slides'] = [
  { id: 'opening', render: (props) => <OpeningSlide {...props} /> },
  { id: 'source', render: (props) => <SourceSlide {...props} /> },
  { id: 'threshold', render: (props) => <ThresholdSlide {...props} /> },
  { id: 'findings', render: (props) => <FindingsSlide {...props} /> },
  { id: 'section-why-10x', render: (props) => <SectionWhy10xSlide {...props} /> },
  { id: 'math', render: (props) => <MathSlide {...props} /> },
  { id: 'time-warp', render: (props) => <TimeWarpSlide {...props} /> },
  { id: 'compounding', render: (props) => <CompoundingSlide {...props} /> },
  { id: 'risk', render: (props) => <RiskSlide {...props} /> },
  { id: 'not-ready', render: (props) => <NotReadySlide {...props} /> },
  { id: 'redacted', render: (props) => <RedactedSlide {...props} /> },
  { id: 'summary', render: (props) => <SummarySlide {...props} /> },
  { id: 'sources', render: (props) => <SourcesSlide {...props} /> },
]

function OpeningSlide({ frame }: SlideRenderContext) {
  return (
    <HookSlide
      frame={frame}
      kicker="2026年11月 METRが報告書を公開"
      heading={'AIが、AIを作る\n速さを2倍にした'}
      lead="素朴に外挿すると、1年以内に超知能"
    >
      <ComparisonTable
        frame={frame}
        columns={[{ label: '記事の主張', accent: true }]}
        rows={[
          { label: '測定', cells: ['Anthropic の能力向上はこの1年で前年の約2倍速'] },
          { label: '原因', cells: ['いまの速さの大部分はAIによる研究の自動化'] },
          { label: '意味', cells: ['Anthropic 自身の「劇的な加速」の線はもう越えた'] },
        ]}
      />
    </HookSlide>
  )
}

function SourceSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading
        frame={frame}
        kicker="元ネタ"
        heading={'落合陽一さんが\n紹介した記事'}
        lead="2026年11月7日のXポスト"
      />
      <div className="ara-stack">
        <Quote frame={frame} quote="さようならホモサピエンス" source="落合陽一（@ochyai）のXポスト" />
        <Callout frame={frame} icon="📝" label="紹介された記事" delay={30}>
          <p>
            Ajeya Cotra「AI is dramatically accelerating AI research right now」（Planned Obsolescence）。
            著者は METR 所属だが報告書には関わっておらず、黒塗り前の版も見ていない個人の意見。
          </p>
        </Callout>
      </div>
    </Slide>
  )
}

function ThresholdSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading
        frame={frame}
        kicker="Anthropic の RSP（2026年7月版）"
        heading={'自分で決めた\n「劇的な加速」の線'}
        lead="2つとも満たしたら到達"
      />
      <Timeline
        frame={frame}
        orientation="vertical"
        steps={[
          {
            label: '条件1',
            heading: '能力の伸びが、過去の最速ペースの2倍',
            body: 'AIがAI研究にあまり貢献していなかった頃と比べる（見込みでもよい）',
          },
          {
            label: '条件2',
            heading: 'その原因がAIによる研究の自動化',
            body: '計算資源や人員を増やしたせいではない',
          },
          {
            label: '今週',
            heading: 'S-1に「まもなく到達するかもしれない」',
            body: 'METR の報告を読むと、もう越えている（Cotra 氏）',
            accent: true,
          },
        ]}
      />
    </Slide>
  )
}

function FindingsSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading frame={frame} kicker="METR の報告書" heading="見つかったこと" />
      <div className="ara-stack">
        <ComparisonTable
          frame={frame}
          columns={[{ label: '報告の中身', accent: true }]}
          rows={[
            { label: '速さ', cells: ['2025年10月〜2026年10月の能力向上は、その前の12か月の約2倍速'] },
            { label: '物差し', cells: ['社内版の能力指数（AECI）'] },
            { label: '理由', cells: ['当初は複合要因。いまも速いのは大部分がAIの自動化'] },
          ]}
        />
        <Callout frame={frame} tone="warn" icon="⬛" label="ただし" delay={36}>
          <p>最も参考になった証拠の大半と、AIのせいだと判断した理由は黒塗り。</p>
        </Callout>
      </div>
    </Slide>
  )
}

function SectionWhy10xSlide({ frame }: SlideRenderContext) {
  return (
    <SectionDivider
      frame={frame}
      step="01"
      kicker="記事の核心"
      heading={'全体が2倍なら、\n研究者は10倍'}
      lead="人間の側は、もっと大きく速くなっているはず"
    />
  )
}

function MathSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading
        frame={frame}
        kicker="著者の単純化したモデル"
        heading={'2倍の裏に\n必要な上乗せ'}
        lead="能力 ＝ 計算乗数（アルゴリズムの工夫）× 学習用計算量"
      />
      <DiagramFrame
        frame={frame}
        caption="逆算していくと"
        note="簡単なアイデアから先に刈り取られるので、同じ速さを保つだけでも上乗せは増え続ける。"
      >
        <FlowDiagram
          frame={frame}
          items={[
            { heading: '全体 2倍', body: '測定値' },
            { heading: '乗数 2〜3倍', body: '工夫だけで稼ぐ' },
            { heading: '労働 4〜9倍', body: '実験と半々で2乗' },
            { heading: 'いま 約10倍', body: '逓減分も上乗せ', accent: true },
          ]}
        />
      </DiagramFrame>
    </Slide>
  )
}

function TimeWarpSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading
        frame={frame}
        kicker="社員の自己申告は約12倍"
        heading={'10人のチームではなく\n10倍速の時間の泡'}
      />
      <ComparisonTable
        frame={frame}
        columns={[{ label: '誤ったイメージ' }, { label: '著者のイメージ', accent: true }]}
        rows={[
          { label: '形', cells: ['1人が10人のチームになる', '1人が外の1日で10日を過ごす'] },
          { label: '速さ', cells: ['10人いても10倍にはならない', '考える・読む・書くが全部10倍速'] },
          { label: '代わり', cells: ['人を雇えば近づける', '何人雇っても届かない'] },
        ]}
      />
    </Slide>
  )
}

function CompoundingSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading
        frame={frame}
        kicker="加速が複利で効いたら"
        heading={'倍加の間隔が\n半分ずつ縮む'}
        lead="METR は、これを止めるボトルネックの証拠を見つけなかった"
      />
      <Timeline
        frame={frame}
        steps={[
          { label: '約1年', heading: '2倍速', body: '少しの加速からここまで' },
          { label: '+6か月', heading: '4倍速' },
          { label: '+3か月', heading: '8倍速' },
          { label: '+6週間', heading: '16倍速', body: '足すと1年以内に発散', accent: true },
        ]}
      />
    </Slide>
  )
}

function RiskSlide({ frame }: SlideRenderContext) {
  return (
    <Slide tone="ink" center>
      <SlideHeading
        frame={frame}
        kicker="著者の見立て"
        heading={'ループを抜けた先の\nAIにできること'}
        lead="新しい兵器をすぐに作り、紛争になれば人類文明を簡単に圧倒する"
      />
      <Callout frame={frame} tone="warn" icon="⚠️" label="もし深刻にミスアラインしていたら" delay={30}>
        <p>人類から力を奪い、絶滅につながりうる。ソフトウェア効率の上限はあるが、いまの地点からはずっと先。</p>
      </Callout>
    </Slide>
  )
}

function NotReadySlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading
        frame={frame}
        kicker="業界の備え"
        heading="必要なものと、いまの状態"
        lead="旧RSPでは、今回より弱い段階でも国家レベルの攻撃者から重みを守るのが最低条件"
      />
      <div className="ara-stack">
        <ComparisonTable
          frame={frame}
          columns={[{ label: '知能爆発に近づくなら最低限', accent: true }]}
          rows={[
            { label: '守り', cells: ['モデル重みと秘密のアルゴリズムを強固に守る'] },
            { label: '監視', cells: ['全体を覆うログと監視、監視役同士の共謀対策'] },
            { label: '制御', cells: ['効いているか確かめられるアライメント手法'] },
            { label: '統治', cells: ['危なくなったら進歩を遅らせる仕組み'] },
          ]}
        />
        <Callout frame={frame} tone="warn" icon="🔓" label="いま" delay={40}>
          <p>OpenAI も Anthropic も、最近アマチュア集団に大きな侵入を許した。業界はこの水準にまったく届いていない。</p>
        </Callout>
      </div>
    </Slide>
  )
}

function RedactedSlide({ frame }: SlideRenderContext) {
  return (
    <Slide center>
      <SlideHeading
        frame={frame}
        kicker="著者の注文"
        heading={'肝心の証拠は\n黒塗り'}
        lead="同僚を信頼して見立ては大きく変えた。でも、信頼に頼らずに読めるべきだった"
      />
      <Callout frame={frame} icon="⏳" label="残り時間" delay={30}>
        <p>外部の科学者がデータを検証できないと、タイムラインの認識をそろえられない。そろえる時間はもう少ないかもしれない。</p>
      </Callout>
    </Slide>
  )
}

function SummarySlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading frame={frame} kicker="まとめ" heading="この記事が言っていること" />
      <Timeline
        frame={frame}
        orientation="vertical"
        steps={[
          { label: '1', heading: 'AIによるAI研究の加速が、測定された', body: '能力向上は前年の約2倍速', accent: true },
          { label: '2', heading: '研究者は約10倍速で働いている計算', body: '社員の自己申告（約12倍）とも合う' },
          { label: '3', heading: '複利で効けば、1年以内という外挿', body: '倍加の間隔が6か月、3か月、6週間と縮む' },
          { label: '4', heading: '安全の備えと証拠の公開が追いついていない', body: '数字の多くは単純化したモデルの推定。不確かさは大きい' },
        ]}
      />
    </Slide>
  )
}

const SOURCES = [
  {
    label: 'Ajeya Cotra「AI is dramatically accelerating AI research right now」（2026-11-06）',
    url: 'https://www.planned-obsolescence.org/p/ai-is-dramatically-accelerating-ai',
  },
  {
    label: 'METR「Anthropic AI R&D acceleration assessment」（2026-11-05）',
    url: 'https://metr.org/blog/2026-11-05-anthropic-ai-rd-acceleration-assessment/',
  },
  {
    label: '落合陽一さんのXポスト「さようならホモサピエンス」（2026-11-07）',
    url: 'https://x.com/ochyai/status/2118953142733992445',
  },
]

function SourcesSlide({ frame }: SlideRenderContext) {
  const items = useStagger(frame, SOURCES.length, { start: 16, step: 6, distance: 10 })

  return (
    <Slide>
      <SlideHeading frame={frame} kicker="出典" heading="一次情報はここ" lead="このデッキは元記事の要約。数字と見立ては著者のもの" />
      <ul className="ara-sources">
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
