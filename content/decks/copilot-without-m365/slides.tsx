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
  { id: 'order', render: (props) => <OrderSlide {...props} /> },
  { id: 'graph', render: (props) => <GraphSlide {...props} /> },
  { id: 'gap', render: (props) => <GapSlide {...props} /> },
  { id: 'kpi', render: (props) => <KpiSlide {...props} /> },
  { id: 'checklist', render: (props) => <ChecklistSlide {...props} /> },
  { id: 'cta-outro', render: (props) => <CtaSlide {...props} /> },
]

function OpeningSlide({ frame }: SlideRenderContext) {
  return (
    <TitleSlide
        frame={frame}
        kicker="Microsoft 365 Copilot"
        heading={'Copilotを買っても\n仕事は変わらない'}
        lead="M365の使い方が変わらない会社で起きていること"
        points={[
          { step: '01', heading: '買う順番が逆', body: 'ライセンスが先、置き場は後' },
          { step: '02', heading: 'Copilotが読むもの', body: 'M365の中の仕事だけ' },
          { step: '03', heading: '今日確認する3つ', body: '会議・利用率・正本' },
        ]}
      />
  )
}

function OrderSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading frame={frame} kicker="よくある順番" heading="買う順番が逆" />
      <Timeline
        frame={frame}
        orientation="vertical"
        steps={[
          { label: '1', heading: 'ライセンス購入が決まる' },
          { label: '2', heading: '情報の置き場は後回し' },
          { label: '3', heading: 'SharePointへ一部だけ移す' },
          { label: '4', heading: '使われない', accent: true },
          { label: '5', heading: '研修・定着化で挽回' },
        ]}
      />
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
      <SlideHeading frame={frame} kicker="ギャップ" heading={'ただのチャットに\nなっていないか'} />
      <ComparisonTable
        frame={frame}
        columns={[{ label: 'よくある環境' }, { label: 'Copilotが活きる環境', accent: true }]}
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
      <SlideHeading frame={frame} kicker="構造の問題" heading={'売る側のスコアと\n買う側のゴール'} />
      <ComparisonTable
        frame={frame}
        columns={[{ label: '売る側' }, { label: '買う側', accent: true }]}
        rows={[
          { label: 'スコア', cells: ['ライセンス数', '仕事が変わったか'] },
          { label: '関心', cells: ['契約したか', '使われているか'] },
        ]}
      />
      <Callout frame={frame} tone="warn" icon="⚠️" label="ずれたまま契約が進む">
        <p>使われるかどうかは、買った後の話にされる</p>
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
          { label: '1', heading: '会議はTeamsで、文字起こしが残っているか' },
          { label: '2', heading: 'Copilotを実際に使っている人の割合', body: 'M365管理センターの利用状況レポート' },
          { label: '3', heading: '完成した資料（正本）の置き場が決まっているか', accent: true },
        ]}
      />
    </Slide>
  )
}
