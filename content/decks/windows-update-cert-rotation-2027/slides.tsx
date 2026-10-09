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
  { id: 'answer', render: (props) => <AnswerSlide {...props} /> },
  { id: 'why', render: (props) => <WhySlide {...props} /> },
  { id: 'versions', render: (props) => <VersionsSlide {...props} /> },
  { id: 'after-expiry', render: (props) => <AfterExpirySlide {...props} /> },
  { id: 'wsus', render: (props) => <WsusSlide {...props} /> },
  { id: 'checklist', render: (props) => <ChecklistSlide {...props} /> },
  { id: 'sources', render: (props) => <SourcesSlide {...props} /> },
  { id: 'cta-outro', render: (props) => <CtaSlide {...props} /> },
]

const SOURCES = [
  {
    label: 'Prepare for Windows Update certificate rotation in 2027（Windows IT Pro Blog）',
    url: 'https://techcommunity.microsoft.com/t5/windows-it-pro-blog/prepare-for-windows-update-certificate-rotation-in-2027/ba-p/4562463',
  },
  {
    label: 'Windows release health',
    url: 'https://learn.microsoft.com/windows/release-health/',
  },
  {
    label: 'Microsoft Update カタログから更新を入手する',
    url: 'https://learn.microsoft.com/troubleshoot/windows-client/installing-updates-features-roles/download-updates-drivers-hotfixes-windows-update-catalog',
  },
]

function OpeningSlide({ frame }: SlideRenderContext) {
  return (
    <TitleSlide
      frame={frame}
      kicker="2027年5月17日・6月19日"
      heading={'Windows Update の\n証明書が期限切れに'}
      lead="必要な更新を当てていない端末は、更新が届かなくなる"
      points={[
        { step: '01', heading: 'やること', body: '最新の月例更新を当てる' },
        { step: '02', heading: '止まる端末', body: '更新が未適用・サポート切れ' },
        { step: '03', heading: '今日確認する3つ', body: '古い端末の洗い出しから' },
      ]}
    />
  )
}

function AnswerSlide({ frame }: SlideRenderContext) {
  return (
    <Slide center>
      <SlideHeading frame={frame} kicker="何をすればいい？" heading={'最新の月例更新を\n当てる'} />
      <ComparisonTable
        frame={frame}
        columns={[{ label: '期限を過ぎたあと', accent: true }]}
        rows={[
          { label: 'サポート中・最新', cells: ['対応不要。そのまま更新が届く'] },
          { label: '必要な更新が未適用', cells: ['Windows Update につながらなくなる'] },
          { label: 'サポート切れ', cells: ['Windows Update を使えなくなる'] },
        ]}
      />
    </Slide>
  )
}

function WhySlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading frame={frame} kicker="しくみ" heading={'なぜ「証明書」で\n更新が止まるのか'} />
      <DiagramFrame frame={frame} caption="Windows Update の接続" note="新しい証明書が入っていない端末は、期限後に接続できない">
        <FlowDiagram
          frame={frame}
          items={[
            { heading: '本物か確かめる', body: '証明書で接続先が本物の Windows Update か確認' },
            { heading: '証明書には期限', body: '期限が来たら新しい証明書へ交換（ローテーション）' },
            { heading: '月例更新で配布', body: '新しい証明書は通常の月例更新に入っている', accent: true },
          ]}
        />
      </DiagramFrame>
    </Slide>
  )
}

function VersionsSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading frame={frame} kicker="バージョン別" heading="何をいつまでに当てるか" lead="期限はいずれも2027年。Windows 11 25H2 以降は対応不要" />
      <ComparisonTable
        frame={frame}
        columns={[{ label: '当てる更新' }, { label: '期限', accent: true }]}
        rows={[
          { label: 'Windows 11 24H2 / Windows Server 2025', cells: ['2025年9月以降のセキュリティ更新', '6月19日より前'] },
          { label: 'サポート中の他の Windows 11・Windows 10 / Windows Server 2022', cells: ['2026年7月以降のセキュリティ更新', '6月19日より前'] },
          { label: 'Windows 10 Enterprise 2019 LTSC / Windows Server 2019・2016', cells: ['2026年7月以降のセキュリティ更新', '5月17日より前'] },
          { label: 'それ以外（サポート切れ）', cells: ['サポート中の版へアップグレード', '—'] },
        ]}
      />
    </Slide>
  )
}

function AfterExpirySlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading frame={frame} kicker="期限を過ぎると" heading="端末は3通りに分かれる" />
      <Timeline
        frame={frame}
        orientation="vertical"
        steps={[
          { label: 'サポート中・最新', heading: 'そのまま更新が届く', body: '新しい証明書はすでに入っている' },
          {
            label: 'サポート中・未適用',
            heading: 'Windows Update につながらなくなる',
            body: 'Microsoft Update カタログから手動で入れるか、管理ツールで配る',
            accent: true,
          },
          { label: 'サポート切れ', heading: 'Windows Update を使えなくなる', body: 'サポート中の版へのアップグレードが推奨' },
        ]}
      />
    </Slide>
  )
}

function WsusSlide({ frame }: SlideRenderContext) {
  return (
    <Slide center>
      <SlideHeading frame={frame} kicker="例外は？" heading={'WSUS 経由の端末は\n対象外'} lead="WSUS（社内サーバーから更新を配る仕組み）で更新を受け取る端末には適用されない、と公式に明記" />
      <Callout frame={frame} icon="💡" label="私の提案">
        <p>Windows Update に直接つないでいる端末がどれかを先に把握しておく</p>
      </Callout>
    </Slide>
  )
}

function ChecklistSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading frame={frame} kicker="チェックリスト（私の提案）" heading="今日確認する3つ" />
      <Timeline
        frame={frame}
        orientation="vertical"
        steps={[
          { label: '1', heading: '古い Windows・サポート切れの Windows がどこにあるか', body: '洗い出して台数をつかむ' },
          { label: '2', heading: '月例更新を止めている端末はないか', body: 'サポート中なら必要な更新を当てる', accent: true },
          { label: '3', heading: 'サポート切れ端末のアップグレード計画', body: '2027年5月・6月の期限より前に立てる' },
        ]}
      />
    </Slide>
  )
}

function SourcesSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading frame={frame} kicker="Sources" heading="出典" lead="2026年10月9日時点の公式情報" />
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
