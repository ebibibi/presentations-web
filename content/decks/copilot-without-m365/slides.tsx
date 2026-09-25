/* eslint-disable react-refresh/only-export-components */
import type { SlideModule, SlideRenderContext } from '../../../src/types'
import {
  Callout,
  ComparisonTable,
  CtaSlide,
  DiagramFrame,
  FlowDiagram,
  Slide,
  SlideHeading,
  Timeline,
  TitleSlide,
} from '../../../src/slide-kit'

export const slides: SlideModule['slides'] = [
  { id: 'opening', render: (props) => <OpeningSlide {...props} /> },
  { id: 'cta-intro', render: (props) => <CtaSlide {...props} /> },
  { id: 'premise', render: (props) => <PremiseSlide {...props} /> },
  { id: 'graph', render: (props) => <GraphSlide {...props} /> },
  { id: 'gap', render: (props) => <GapSlide {...props} /> },
  { id: 'harm', render: (props) => <HarmSlide {...props} /> },
  { id: 'order', render: (props) => <OrderSlide {...props} /> },
  { id: 'kpi', render: (props) => <KpiSlide {...props} /> },
  { id: 'checklist', render: (props) => <ChecklistSlide {...props} /> },
  { id: 'cta-outro', render: (props) => <CtaSlide {...props} /> },
]

function OpeningSlide({ frame }: SlideRenderContext) {
  return (
    <TitleSlide
        frame={frame}
        kicker="Microsoft 365 Copilot"
        heading={'Copilotが活きるのは\nM365を素直に使う会社'}
        lead="前提が崩れていれば、歪な形になる"
        points={[
          { step: '01', heading: '当たり前の前提', body: 'CopilotはM365の延長線上' },
          { step: '02', heading: '崩れると歪になる', body: '素直に使わない弊害' },
          { step: '03', heading: '今日確認する3つ', body: 'チーム・情報・求めるAI' },
        ]}
      />
  )
}

function HarmSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading frame={frame} kicker="Copilot以前の問題" heading={'素直に使わないこと\n自体が損'} />
      <Timeline
        frame={frame}
        orientation="vertical"
        steps={[
          { label: '1', heading: 'どれが正本か分からない' },
          { label: '2', heading: '探しても見つからない' },
          { label: '3', heading: '一緒に編集できない' },
          { label: '4', heading: '新機能が来ても恩恵が届かない', accent: true },
        ]}
      />
    </Slide>
  )
}

function OrderSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading frame={frame} kicker="よくある順番" heading={'前提が崩れたまま\n買うと'} />
      <Timeline
        frame={frame}
        orientation="vertical"
        steps={[
          { label: '1', heading: 'ライセンス購入が決まる' },
          { label: '2', heading: '「コンテキスト」が無いので良い仕事ができない' },
          { label: '3', heading: '使われない' },
          { label: '4', heading: '個人で使っているChatGPTの方がはるかに高機能…', accent: true },
        ]}
      />
    </Slide>
  )
}

function PremiseSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading frame={frame} kicker="当たり前の話" heading={'CopilotはM365の\n延長線上にある'} />
      <DiagramFrame frame={frame} caption="前提" note="火を見るより明らか">
        <FlowDiagram
          frame={frame}
          items={[
            { heading: 'M365を素直に使う', body: '本来の使い方' },
            { heading: '仕事がM365に溜まる', body: 'メール・会議・資料' },
            { heading: 'Copilotが活きる', body: '本来の性能', accent: true },
          ]}
        />
      </DiagramFrame>
    </Slide>
  )
}

function GraphSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading frame={frame} kicker="仕組み" heading={'Copilotが読んでいるのは\nM365の中の仕事'} />
      <DiagramFrame frame={frame} caption="Microsoft Graph" note="M365に仕事が無ければ、答える材料が無い">
        <FlowDiagram
          frame={frame}
          items={[
            { heading: 'メール', body: 'Exchange Online' },
            { heading: '会議・チャット', body: 'Teams' },
            { heading: 'ファイル', body: 'SharePoint / OneDrive' },
            { heading: 'Copilot', body: 'ここから答える', accent: true },
          ]}
        />
      </DiagramFrame>
    </Slide>
  )
}

function GapSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading frame={frame} kicker="ギャップ" heading={'素直に使っていない\nM365'} />
      <ComparisonTable
        frame={frame}
        columns={[{ label: 'よくある使い方' }, { label: '素直な使い方', accent: true }]}
        rows={[
          { label: '会議', cells: ['対面・電話、記録なし', 'Teams会議＋文字起こし'] },
          { label: 'やり取り', cells: ['メール添付', 'Teamsのチャット・チャネル'] },
          { label: 'ファイル', cells: ['ファイルサーバー', 'SharePoint・Teams'] },
          { label: 'SharePoint', cells: ['ファイル置き場', 'チームの仕事場'] },
        ]}
      />
    </Slide>
  )
}

function KpiSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading frame={frame} kicker="外資IT" heading={'売る側に目標があるのは\n当たり前'} />
      <ComparisonTable
        frame={frame}
        columns={[{ label: '売る側' }, { label: '買う側', accent: true }]}
        rows={[
          { label: '目標', cells: ['ライセンス数', '仕事が変わること'] },
          { label: '確かめること', cells: ['売れたか', '前提を満たしているか'] },
        ]}
      />
      <Callout frame={frame} tone="warn" icon="⚠️" label="前提の確認は買う側の仕事">
        <p>売る側が止めてくれることは期待しない</p>
      </Callout>
    </Slide>
  )
}

function ChecklistSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading frame={frame} kicker="チェックリスト" heading="今日確認する3つ" />
      <Timeline
        frame={frame}
        orientation="vertical"
        steps={[
          { label: '1', heading: 'M365をTeamsの「チーム」中心に素直に利用しているか' },
          { label: '2', heading: '必要な情報はM365にあるか' },
          {
            label: '3',
            heading: '求めているのは「エンタープライズで大規模に信頼して使えるAI基盤」か',
            body: '「個人や少数に特化した最先端で最強のAI」ではなく',
            accent: true,
          },
        ]}
      />
    </Slide>
  )
}
