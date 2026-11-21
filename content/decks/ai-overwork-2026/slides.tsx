/* eslint-disable react-refresh/only-export-components */
import type { SlideModule, SlideRenderContext } from '../../../src/types'
import { CtaSlide } from '../../../src/deck-shared'
import {
  Callout,
  CodeSlide,
  ComparisonTable,
  DiagramFrame,
  FlowDiagram,
  HookSlide,
  SectionDivider,
  Slide,
  SlideHeading,
  Timeline,
  useEnter,
  useStagger,
} from '../../../src/slide-kit'
import './styles.css'

export const slides: SlideModule['slides'] = [
  { id: 'opening', render: (props) => <OpeningSlide {...props} /> },
  { id: 'confession', render: (props) => <ConfessionSlide {...props} /> },
  { id: 'timeline', render: (props) => <TimelineSlide {...props} /> },
  { id: 'chart-load', render: (props) => <LoadChartSlide {...props} /> },
  { id: 'chart-hours', render: (props) => <HoursChartSlide {...props} /> },
  { id: 'chart-flow', render: (props) => <FlowChartSlide {...props} /> },
  { id: 'section-why', render: (props) => <SectionWhySlide {...props} /> },
  { id: 'bottleneck', render: (props) => <BottleneckSlide {...props} /> },
  { id: 'not-brakes', render: (props) => <NotBrakesSlide {...props} /> },
  { id: 'night-order', render: (props) => <NightOrderSlide {...props} /> },
  { id: 'checklist', render: (props) => <ChecklistSlide {...props} /> },
  { id: 'closing', render: (props) => <CtaSlide {...props} /> },
]

/* ── Data (measured 2026-11-21) ─────────────────────────────────────────
 * Instructions: the author's own messages to AI agents, per Mon-start week.
 * Blood pressure: home monitor, mornings 04-10h, weekly mean.
 * The week of 11/16 is still in progress (through 11/21).
 */
const WEEKS = ['10/5', '10/12', '10/19', '10/26', '11/2', '11/9', '11/16']
const INSTRUCTIONS = [552, 460, 281, 277, 370, 690, 377]
const BP_SYS = [134.5, 131.5, 135.0, 144.3, 138.8, 143.8, 144.9]
const BP_DIA = [87.6, 87.9, 90.8, 95.0, 93.5, 96.5, 93.3]

// Messages per hour of day, last 28 days.
const HOURS: Array<[number, number]> = [
  [6, 2], [7, 43], [8, 46], [9, 74], [10, 105], [11, 123], [12, 84], [13, 126],
  [14, 111], [15, 121], [16, 141], [17, 108], [18, 116], [19, 84], [20, 44],
  [21, 171], [22, 155], [23, 100], [0, 38],
]

const FLOW_WEEKS = ['10/26', '11/2', '11/9', '11/16']
const FLOW_NEW = [186, 167, 210, 118]
const FLOW_DONE = [103, 72, 95, 167]

function OpeningSlide({ frame }: SlideRenderContext) {
  return (
    <HookSlide
      frame={frame}
      kicker="2026年11月 自分の作業ログと血圧の記録から"
      heading={'AIと働きすぎて\n体を壊しかけた'}
      lead="指示は週690件。夜9時台が、1日でいちばん多い時間だった"
    >
      <ComparisonTable
        frame={frame}
        columns={[{ label: '何が起きたか', accent: true }]}
        rows={[
          { label: '指示', cells: ['多い週で690件。そのうち夜9時〜朝5時が185件'] },
          { label: '朝の血圧の平均', cells: ['10月前半 131〜135/88 → 143.8/96.5'] },
          { label: '受診', cells: ['胸の痛みと頭痛。160/109。「痛かったらすぐ救急車」'] },
        ]}
      />
    </HookSlide>
  )
}

function ConfessionSlide({ frame }: SlideRenderContext) {
  const enter = useEnter(frame, 30)
  return (
    <Slide>
      <SlideHeading
        frame={frame}
        kicker="自分への反省"
        heading={'AIは疲れない\n疲れるのは自分だった'}
        lead="並べたAIが返してくる「確認して」「決めて」を、全部1人で受けていた"
      />
      <div className="aow-stack" style={enter}>
        <Callout frame={frame} tone="warn" icon="🌙" label="毎晩やっていたこと">
          <p>寝る前に「あと1件だけ」と指示を出す。返事が来ると、また見てしまう。</p>
        </Callout>
        <Callout frame={frame} icon="🩺" label="おことわり">
          <p>これは私の働き方の記録です。体のことは医師の判断に従っています。</p>
        </Callout>
      </div>
    </Slide>
  )
}

function TimelineSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading frame={frame} kicker="何が起きたか" heading="楽しくて、止まれなかった" />
      <Timeline
        frame={frame}
        orientation="vertical"
        steps={[
          { label: '10月', heading: 'AIを並列で回す画面を本格運用', body: '自作のEbi AI Console。何十本でも同時に投げられる' },
          { label: '11/9の週', heading: '指示が週690件に', body: 'そのうち夜9時〜朝5時が185件' },
          { label: '11/17', heading: '胸の痛みと頭痛で受診', body: '病院で160/109。心電図と採血、降圧薬が出る。「痛かったらすぐ救急車」', accent: true },
          { label: '11/20', heading: '降圧薬1か月分と睡眠薬', body: '眠れなくなっていたことも相談した' },
        ]}
      />
    </Slide>
  )
}

function BarRow({
  frame,
  values,
  labels,
  highlight,
  unit,
  max,
  format = (v: number) => String(v),
}: {
  frame: number
  values: number[]
  labels: string[]
  highlight: number
  unit: string
  max: number
  format?: (v: number) => string
}) {
  // Long rows enter as one block: a per-bar stagger would still be running
  // when the slide settles, and the evening bars are the point of the chart.
  const staggered = useStagger(frame, values.length)
  const styles = values.length > 8 ? values.map(() => undefined) : staggered
  return (
    <div className="aow-bars" role="img" aria-label={unit}>
      {values.map((v, i) => (
        <div className="aow-bar-col" key={labels[i]} style={styles[i]}>
          <div className="aow-bar-track">
            <span className={i === highlight ? 'aow-bar-value aow-strong' : 'aow-bar-value'}>{format(v)}</span>
            <div
              className={i === highlight ? 'aow-bar aow-bar-hot' : 'aow-bar'}
              style={{ height: `${Math.max(2, (v / max) * 100)}%` }}
            />
          </div>
          <span className="aow-bar-label">{labels[i]}</span>
        </div>
      ))}
    </div>
  )
}

function LoadChartSlide({ frame }: SlideRenderContext) {
  const enter = useEnter(frame, 20)
  return (
    <Slide>
      <SlideHeading
        frame={frame}
        kicker="同じ週で並べる"
        heading="指示の数と、朝の血圧"
      />
      <div className="aow-charts" style={enter}>
        <div className="aow-chart">
          <p className="aow-chart-title">AIへの指示（件／週）</p>
          <BarRow frame={frame} values={INSTRUCTIONS} labels={WEEKS} highlight={5} unit="AIへの指示（件／週）" max={800} />
        </div>
        <div className="aow-chart">
          <p className="aow-chart-title">朝の血圧（週平均・上／下）</p>
          <div className="aow-bp-row">
            {WEEKS.map((w, i) => (
              <div className="aow-bp-cell" key={w}>
                <strong className={i >= 5 ? 'aow-hot-text' : undefined}>{BP_SYS[i].toFixed(0)}</strong>
                <span>{BP_DIA[i].toFixed(0)}</span>
                <em>{w}</em>
              </div>
            ))}
          </div>
        </div>
      </div>
      <p className="aow-foot">血圧は自宅の血圧計で朝4〜10時に測った値の週平均。11/17夕から服薬開始。冬は上がりやすいので、単純な因果ではない</p>
    </Slide>
  )
}

function HoursChartSlide({ frame }: SlideRenderContext) {
  const enter = useEnter(frame, 20)
  const values = HOURS.map(([, n]) => n)
  const labels = HOURS.map(([h]) => `${h}`)
  return (
    <Slide>
      <SlideHeading
        frame={frame}
        kicker="直近4週間、何時に話しかけたか"
        heading={'夜9時台が\n1日でいちばん多い'}
      />
      <div className="aow-chart aow-chart-wide" style={enter}>
        <p className="aow-chart-title">AIへのメッセージ（時台別・4週間合計）</p>
        <BarRow frame={frame} values={values} labels={labels} highlight={15} unit="時台別のメッセージ数" max={200} />
      </div>
      <p className="aow-foot">日中は1時間あたり100件前後。21時台171件、22時台155件、23時台100件。最後の1通が0時を回った日は4週間で9日</p>
    </Slide>
  )
}

function FlowChartSlide({ frame }: SlideRenderContext) {
  const enter = useEnter(frame, 20)
  const styles = useStagger(frame, FLOW_WEEKS.length)
  return (
    <Slide>
      <SlideHeading
        frame={frame}
        kicker="仕事の出入り"
        heading={'入る件数が\n終わる件数を超えていた'}
      />
      <div className="aow-flow" style={enter}>
        <div className="aow-legend">
          <span><i className="aow-swatch aow-swatch-new" />新しく始まった仕事</span>
          <span><i className="aow-swatch aow-swatch-done" />完了を確定した仕事</span>
        </div>
        <div className="aow-pairs">
          {FLOW_WEEKS.map((w, i) => (
            <div className="aow-pair" key={w} style={styles[i]}>
              <div className="aow-pair-bars">
                <div className="aow-pair-col">
                  <span className="aow-bar-value">{FLOW_NEW[i]}</span>
                  <div className="aow-bar aow-bar-new" style={{ height: `${(FLOW_NEW[i] / 220) * 100}%` }} />
                </div>
                <div className="aow-pair-col">
                  <span className="aow-bar-value">{FLOW_DONE[i]}</span>
                  <div className="aow-bar aow-bar-done" style={{ height: `${(FLOW_DONE[i] / 220) * 100}%` }} />
                </div>
              </div>
              <span className="aow-bar-label">{w}の週</span>
            </div>
          ))}
        </div>
        <div className="aow-totals">
          <div><strong>398</strong><span>未完了</span></div>
          <div><strong>47</strong><span>返事待ちの判断</span></div>
          <div><strong>681 : 437</strong><span>4週間で 入った : 終わった</span></div>
        </div>
      </div>
    </Slide>
  )
}

function SectionWhySlide({ frame }: SlideRenderContext) {
  return (
    <SectionDivider
      frame={frame}
      step="02"
      kicker="原因と直し方"
      heading="なぜこうなったか"
      lead="AIは並列なのに、確認する人間が1列だった"
    />
  )
}

function BottleneckSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading
        frame={frame}
        kicker="詰まっていた場所"
        heading={'AIは並列\n確認は1列'}
      />
      <DiagramFrame
        frame={frame}
        caption="仕事の流れ"
        note="確認とは、完了の確定・AIからの質問への回答・定期報告を読むこと。AIを増やすほど、この列が長くなる"
      >
        <FlowDiagram
          frame={frame}
          items={[
            { heading: '仕事が入る', body: '依頼・定期ジョブ' },
            { heading: 'AIが実行', body: '何十本も同時に' },
            { heading: '人間が確認', body: '全部1人で受ける', accent: true },
            { heading: '完了', body: '手前でたまる' },
          ]}
        />
      </DiagramFrame>
    </Slide>
  )
}

function NotBrakesSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading
        frame={frame}
        kicker="AIに相談したら最初はブレーキを勧められた"
        heading={'止めるのではなく\n流れを直す'}
        lead="止めたいのはAIではなく、確認のために私が起きていること"
      />
      <ComparisonTable
        frame={frame}
        columns={[{ label: '勧められたブレーキ' }, { label: 'これからやること', accent: true }]}
        rows={[
          { label: '夜', cells: ['21時以降はAIを使わない', '寝る前に、朝まで人を呼ばない指示を出す'] },
          { label: '完了', cells: ['件数に上限を付ける', '完了してよい条件を決め、満たせばAIが閉じる'] },
          { label: '判断', cells: ['毎回カードで聞く', '推奨案と期限を付け、返事がなければ推奨で進む（取り消せるものだけ）'] },
          { label: '定期ジョブ', cells: ['ジョブを止める', '異常のときだけ知らせ、正常なら1日1枚にまとめる'] },
        ]}
      />
    </Slide>
  )
}

function NightOrderSlide({ frame }: SlideRenderContext) {
  return (
    <CodeSlide
      frame={frame}
      kicker="寝る前に1回だけ"
      heading="朝まで呼ばれない指示の型"
      caption="夜の指示テンプレート"
      lines={[
        { kind: 'comment', body: 'ゴール：朝の時点でどうなっていればいいか' },
        { kind: 'prompt', body: 'やっていいこと：調査・下書き・PR作成・テスト' },
        { kind: 'prompt', body: 'やらないこと：送信・公開・課金・本番変更' },
        { kind: 'prompt', body: '迷ったら：推奨案で進め、理由を書き残す' },
        { kind: 'prompt', body: '止まる条件：失敗が3回続いたら、そこで止めて記録' },
        { kind: 'output', body: '朝：1枚のまとめ（できた・決めて・見て）だけ見せる' },
      ]}
    >
      <Callout frame={frame} tone="good" icon="☀️" label="夜中に質問が来ない">
        <p>「迷ったら推奨で進める」と先に決めておくのがいちばん効く。</p>
      </Callout>
    </CodeSlide>
  )
}

function ChecklistSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading
        frame={frame}
        kicker="AIエージェントで忙しくなった人へ"
        heading={'自分の数字を\n1回見てみる'}
      />
      <ComparisonTable
        frame={frame}
        columns={[{ label: '見るもの' }, { label: '私の場合', accent: true }]}
        rows={[
          { label: '1', cells: ['週に何件、AIに指示しているか', '多い週で690件'] },
          { label: '2', cells: ['何時台がいちばん多いか', '21時台'] },
          { label: '3', cells: ['入る件数と終わる件数、どちらが多いか', '入る方が1.5倍'] },
          { label: '4', cells: ['血圧と睡眠', '朝143/96、眠れなくなった'] },
        ]}
      />
      <p className="aow-foot">胸の痛み・頭痛など体の症状があれば、仕組みを直すより先に病院へ</p>
    </Slide>
  )
}
