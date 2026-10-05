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
  { id: 'lineup', render: (props) => <LineupSlide {...props} /> },
  { id: 'still-runs', render: (props) => <StillRunsSlide {...props} /> },
  { id: 'history', render: (props) => <HistorySlide {...props} /> },
  { id: 'connectivity', render: (props) => <ConnectivitySlide {...props} /> },
  { id: 'ws2012', render: (props) => <Ws2012Slide {...props} /> },
  { id: 'checklist', render: (props) => <ChecklistSlide {...props} /> },
  { id: 'migrate', render: (props) => <MigrateSlide {...props} /> },
  { id: 'sources', render: (props) => <SourcesSlide {...props} /> },
  { id: 'cta-outro', render: (props) => <CtaSlide {...props} /> },
]

const SOURCES = [
  {
    label: '2026年にサポートが終了する製品',
    url: 'https://learn.microsoft.com/ja-jp/lifecycle/end-of-support/end-of-support-2026',
  },
  {
    label: 'Office LTSC 2021 のライフサイクル',
    url: 'https://learn.microsoft.com/ja-jp/lifecycle/products/office-ltsc-2021',
  },
  {
    label: 'Microsoft 365 サービスへの接続がサポートされる Office のバージョン',
    url: 'https://learn.microsoft.com/ja-jp/microsoft-365-apps/end-of-support/microsoft-365-services-connectivity',
  },
  {
    label: 'Windows Server 2012 R2 のライフサイクル',
    url: 'https://learn.microsoft.com/ja-jp/lifecycle/products/windows-server-2012-r2',
  },
  {
    label: '拡張セキュリティ更新プログラム（ESU）のFAQ',
    url: 'https://learn.microsoft.com/ja-jp/lifecycle/faq/extended-security-updates',
  },
  {
    label: 'Intune の検出されたアプリ',
    url: 'https://learn.microsoft.com/ja-jp/intune/intune-service/apps/app-discovered-apps',
  },
]

function OpeningSlide({ frame }: SlideRenderContext) {
  return (
    <TitleSlide
      frame={frame}
      kicker="2026年10月13日（火）"
      heading={'Office 2021と\nWindows Server 2012が\n同じ日に終わる'}
      lead="起動はする。でも、もう直らない"
      points={[
        { step: '01', heading: '何が終わるか', body: '同じ日に5つ' },
        { step: '02', heading: '+新問題', body: 'M365接続もサポート外' },
        { step: '03', heading: '今日確認する3つ', body: '10月13日までに棚卸し' },
      ]}
    />
  )
}

function LineupSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading frame={frame} kicker="10月13日" heading="同じ日に終わるもの" />
      <ComparisonTable
        frame={frame}
        columns={[{ label: '10月13日に起きること', accent: true }]}
        rows={[
          { label: 'Office 2021 / LTSC 2021', cells: ['サポート終了（Mac版・単体アプリも）'] },
          { label: 'Visio・Project 2021', cells: ['サポート終了（見落としやすい）'] },
          { label: 'Windows Server 2012 / R2', cells: ['ESU 3年目が終了。4年目は無い'] },
          { label: 'Windows 10 2016 LTSB', cells: ['サポート終了'] },
          { label: 'Windows 11 Home/Pro 24H2', cells: ['サービス終了'] },
        ]}
      />
      <Callout frame={frame} icon="📌" label="ついでに">
        <p>Windows Server 2022はこの日からメインストリーム終了 → 延長サポートへ</p>
      </Callout>
    </Slide>
  )
}

function StillRunsSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading frame={frame} kicker="誤解されがち" heading={'起動はする。\nでも、もう直らない'} />
      <ComparisonTable
        frame={frame}
        columns={[{ label: '10月13日まで' }, { label: '10月14日から', accent: true }]}
        rows={[
          { label: 'アプリの起動', cells: ['できる', 'できる'] },
          { label: 'セキュリティ更新', cells: ['届く', '届かない'] },
          { label: '技術サポート', cells: ['受けられる', '受けられない'] },
        ]}
      />
      <Callout frame={frame} tone="warn" icon="⚠️" label="だから気づかない">
        <p>見つかった脆弱性は、もう塞がれない</p>
      </Callout>
    </Slide>
  )
}

function HistorySlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading frame={frame} kicker="前回との違い" heading={'Office 2016/2019の\nときはこうだった'} />
      <Timeline
        frame={frame}
        orientation="vertical"
        steps={[
          { label: '2023年10月', heading: 'Office 2016/2019', body: 'M365への接続サポートが先に終了' },
          { label: '2025年10月', heading: 'Office 2016/2019', body: '本体のサポート終了' },
          {
            label: '2026年10月13日',
            heading: 'Office 2021',
            body: '本体の終了とM365接続のサポート終了が同じ日',
            accent: true,
          },
        ]}
      />
    </Slide>
  )
}

function ConnectivitySlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading frame={frame} kicker="+新問題" heading={'M365への接続も\nサポート外になる'} />
      <DiagramFrame frame={frame} caption="Office LTSC 2021 からの接続" note="10月13日でサポート対象外">
        <FlowDiagram
          frame={frame}
          items={[
            { heading: 'Office LTSC 2021', body: 'Outlook・Word・Excel' },
            { heading: 'Microsoft 365', body: 'Exchange Online・SharePoint・OneDrive', accent: true },
          ]}
        />
      </DiagramFrame>
      <Callout frame={frame} icon="💡" label="当日に遮断されるわけではない">
        <p>ただし、サービス側の改善は古いクライアントとの互換性を見なくなる</p>
      </Callout>
    </Slide>
  )
}

function Ws2012Slide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading frame={frame} kicker="Windows Server 2012 / 2012 R2" heading={'「延長の延長」も\n終わる'} />
      <Timeline
        frame={frame}
        orientation="vertical"
        steps={[
          { label: '2023年10月', heading: '延長サポート終了', body: 'ここからESUでつなぐ' },
          { label: 'ESU 1〜2年目', heading: 'セキュリティ更新だけ届く' },
          {
            label: '2026年10月13日',
            heading: 'ESU 3年目が終了',
            body: '4年目は無い。Azure Arc経由・Azure上のESUも同じ日',
            accent: true,
          },
        ]}
      />
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
          {
            label: '1',
            heading: 'Intuneの「検出されたアプリ」でOffice / Visio / Projectを絞る',
            body: '名前に LTSC・2021 が付くものが対象',
          },
          {
            label: '2',
            heading: 'そこに出てこない端末を別に確認する',
            body: 'Intune未登録・管理拡張機能なし・個人所有',
            accent: true,
          },
          {
            label: '3',
            heading: 'Windows Server 2012 / R2 が残っていないか',
            body: 'Arc経由のESUでも期限は同じ',
          },
        ]}
      />
    </Slide>
  )
}

function MigrateSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading frame={frame} kicker="見つかったら" heading="移行先の考え方" />
      <ComparisonTable
        frame={frame}
        columns={[{ label: 'Microsoft 365 Apps', accent: true }, { label: 'Office LTSC 2024' }]}
        rows={[
          { label: '向く端末', cells: ['普通の業務端末', 'オフライン前提・機能固定'] },
          { label: 'サポート', cells: ['更新が続く', '2029年10月9日まで'] },
        ]}
      />
      <Callout frame={frame} icon="🤝" label="相談先はどこでもいい">
        <p>情シスでも、いつものベンダーでも、Microsoftのパートナーでも。10月13日までに一度見る</p>
      </Callout>
    </Slide>
  )
}

function SourcesSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading frame={frame} kicker="Sources" heading="出典" lead="日付は2026年10月5日時点のMicrosoft Learn" />
      <Callout frame={frame} icon="📘" label="公式ページ">
        <ul>
          {SOURCES.map((s) => (
            <li key={s.url}>
              <a href={s.url} target="_blank" rel="noreferrer">
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </Callout>
    </Slide>
  )
}
