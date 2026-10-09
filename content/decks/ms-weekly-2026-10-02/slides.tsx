/* eslint-disable react-refresh/only-export-components */
import type { SlideModule, SlideRenderContext } from '../../../src/types'
import {
  Callout,
  ComparisonTable,
  CtaSlide,
  Slide,
  SlideHeading,
  Timeline,
  TitleSlide,
} from '../../../src/slide-kit'

export const slides: SlideModule['slides'] = [
  { id: 'opening', render: (props) => <OpeningSlide {...props} /> },
  { id: 'ews-timeline', render: (props) => <EwsTimelineSlide {...props} /> },
  { id: 'ews-hidden', render: (props) => <EwsHiddenSlide {...props} /> },
  { id: 'exchange', render: (props) => <ExchangeSlide {...props} /> },
  { id: 'windows', render: (props) => <WindowsSlide {...props} /> },
  { id: 'identity', render: (props) => <IdentitySlide {...props} /> },
  { id: 'm365-azure', render: (props) => <M365AzureSlide {...props} /> },
  { id: 'security', render: (props) => <SecuritySlide {...props} /> },
  { id: 'checklist', render: (props) => <ChecklistSlide {...props} /> },
  { id: 'sources-1', render: (props) => <SourcesSlide {...props} part={0} /> },
  { id: 'sources-2', render: (props) => <SourcesSlide {...props} part={1} /> },
  { id: 'cta-outro', render: (props) => <CtaSlide {...props} /> },
]

// One primary source per item, in the item order used throughout the deck.
const SOURCES = [
  {
    label: '#1 Exchange Online の EWS 廃止が始まりました（日本マイクロソフト）',
    url: 'https://jpmessaging.github.io/blog/ews-deprecation-is-here-what-this-means-to-you/',
  },
  {
    label: '#2 EWS 廃止がハイブリッドのリッチ共存・組織間共有に与える影響（日本マイクロソフト）',
    url: 'https://jpmessaging.github.io/blog/impact-of-exchange-online-ews-deprecation-on-hybrid-rich-coexistence-and-cross-o/',
  },
  {
    label: '#3 Cross-tenant free/busy, MailTips and calendar sharing are moving（Exchange Team Blog）',
    url: 'https://techcommunity.microsoft.com/t5/exchange-team-blog/cross-tenant-free-busy-mailtips-and-calendar-sharing-are-moving/ba-p/4545169',
  },
  {
    label: '#4 Action required: upgrade ExchangeOnlineManagement PowerShell（Exchange Team Blog）',
    url: 'https://techcommunity.microsoft.com/t5/exchange-team-blog/action-required-upgrade-exchangeonlinemanagement-powershell/ba-p/4561418',
  },
  {
    label: '#5 Windows settings backup becoming a new resilience baseline（Windows IT Pro Blog）',
    url: 'https://techcommunity.microsoft.com/t5/windows-it-pro-blog/windows-settings-backup-becoming-a-new-resilience-baseline/ba-p/4530757',
  },
  {
    label: '#6 An IT pro’s guide to Windows 11, version 26H2（Windows IT Pro Blog）',
    url: 'https://techcommunity.microsoft.com/t5/windows-it-pro-blog/an-it-pro-s-guide-to-windows-11-version-26h2/ba-p/4559760',
  },
  {
    label: '#7 Microsoft to block script injection on Entra ID sign-in pages（Petri）',
    url: 'https://petri.com/microsoft-block-script-injection-entra-id-sign-in-pages/',
  },
  {
    label: '#8 Microsoft retires Windows PowerShell support in Graph SDK（Petri）',
    url: 'https://petri.com/microsoft-retires-windows-powershell-support-graph-sdk/',
  },
  {
    label: '#9 WDS deprecation forces IT teams to evaluate alternatives（Petri）',
    url: 'https://petri.com/wds-deprecation-forces-it-teams-evaluate-alternatives/',
  },
  {
    label: '#10 Microsoft pauses update over Office 2016/2019 licensing issues（Petri）',
    url: 'https://petri.com/microsoft-update-office-2016-2019-licensing-issues/',
  },
  {
    label: '#11 Azure Communication Services retirement, September 2028（Office 365 IT Pros）',
    url: 'https://office365itpros.com/2026/09/29/acs-retirement-sept-2028/',
  },
  {
    label: '#12 Sign in to Microsoft apps with passkeys from external identity providers（Microsoft Entra Blog）',
    url: 'https://techcommunity.microsoft.com/t5/microsoft-entra-blog/sign-in-to-microsoft-apps-with-passkeys-from-external-identity/ba-p/4556448',
  },
  {
    label: '#13 Easier federated chat in Teams（Office 365 IT Pros）',
    url: 'https://office365itpros.com/2026/10/02/easier-federated-chat/',
  },
  {
    label: '#14 What’s new in Microsoft Intune: September（Microsoft Intune Blog）',
    url: 'https://techcommunity.microsoft.com/t5/microsoft-intune-blog/what-s-new-in-microsoft-intune-september/ba-p/4537394',
  },
  {
    label: '#15 Microsoft 365 SharePoint Storage and OneDrive Storage public preview（M365 Blog）',
    url: 'https://techcommunity.microsoft.com/t5/microsoft-365-blog/now-in-public-preview-microsoft-365-sharepoint-storage-and/ba-p/4559758',
  },
  {
    label: '#16 What’s new in Copilot in SharePoint, October 2026（SharePoint Blog）',
    url: 'https://techcommunity.microsoft.com/t5/microsoft-sharepoint-blog/what-s-new-in-copilot-in-sharepoint-october-2026/ba-p/4535423',
  },
  {
    label: '#17 Regional resiliency for Azure Virtual Desktop is generally available（AVD Blog）',
    url: 'https://techcommunity.microsoft.com/t5/azure-virtual-desktop-blog/now-generally-available-regional-resiliency-for-azure-virtual/ba-p/4540458',
  },
  {
    label: '#18 Storm-3168: cloud attacks using compromised service principals（Microsoft Security Blog）',
    url: 'https://www.microsoft.com/en-us/security/blog/2026/09/25/storm-3168-agentic-driven-cloud-attacks-using-compromised-service-principals/',
  },
  {
    label: '#19 Tracking CVE-2026-73570 on internet-facing mail servers（Microsoft Security Blog）',
    url: 'https://www.microsoft.com/en-us/security/blog/2026/09/30/unauthenticated-command-injection-on-internet-facing-mail-servers-tracking-cve-2026-73570/',
  },
  {
    label: '#20 Phishing abuses RMM tools for persistent access（Microsoft Security Blog）',
    url: 'https://www.microsoft.com/en-us/security/blog/2026/09/29/phishing-abuses-rmm-tools-persistent-access/',
  },
]

function OpeningSlide({ frame }: SlideRenderContext) {
  return (
    <TitleSlide
      frame={frame}
      kicker="MS週報 ─ 2026年10月2日までの1週間"
      heading={'Exchange Online の\nEWS 廃止が始まった'}
      lead="10月10日以降、EWSEnabled = True だけでは動かない"
      points={[
        { step: '01', heading: '今週いちばん大きい変化', body: 'EWS は許可リストが必須に' },
        { step: '02', heading: 'そのほか19件', body: 'Exchange・Windows・Entra ID・M365・Azure' },
        { step: '03', heading: '今日確認すること', body: '最後にチェックリスト' },
      ]}
    />
  )
}

function EwsTimelineSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading frame={frame} kicker="#1 EWS 廃止" heading={'段階的に\n進んでいる'} />
      <Timeline
        frame={frame}
        orientation="vertical"
        steps={[
          {
            label: '10月2日時点',
            heading: '許可リストを作っていないテナントには自動登録',
            body: 'EWS を有効にしていた場合、過去60日間に EWS を使ったアプリを Microsoft が登録',
          },
          {
            label: '10月10日以降',
            heading: 'EWSAllowedAppIDs（App ID の許可リスト）が必須',
            body: 'EWSEnabled を True にしておくだけでは EWS を使えない',
            accent: true,
          },
          {
            label: '次の段階',
            heading: 'EWSEnabled を何も設定していないテナントは無効化',
            body: '対象には7日前に Message Center で通知',
          },
        ]}
      />
    </Slide>
  )
}

function EwsHiddenSlide({ frame }: SlideRenderContext) {
  return (
    <Slide center>
      <SlideHeading
        frame={frame}
        kicker="#1 EWS 廃止"
        heading={'「うちは使っていない」\nこそ確認する'}
        lead="思わぬところが EWS を使っている"
      />
      <Callout frame={frame} tone="warn" icon="🔍" label="例">
        <ul>
          <li>従来の Outlook for Mac</li>
          <li>Excel の Power Query</li>
          <li>Exchange のハイブリッド構成</li>
        </ul>
      </Callout>
    </Slide>
  )
}

function ExchangeSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading frame={frame} kicker="Exchange Online / Exchange Server" heading="そのほかの変更" />
      <ComparisonTable
        frame={frame}
        columns={[{ label: '何が変わる', accent: true }]}
        rows={[
          {
            label: '#2 ハイブリッド',
            cells: ['オンプレの EWS は廃止されないが、リッチ共存と組織間共有の2つに影響'],
          },
          {
            label: '#3 テナント間共有',
            cells: ['空き時間・MailTips・予定表共有がクロステナント アクセス ポリシーの管理へ'],
          },
          {
            label: '#4 PowerShell',
            cells: ['ExchangeOnlineManagement 3.10.1 より前は更新が必要'],
          },
        ]}
      />
    </Slide>
  )
}

function WindowsSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading frame={frame} kicker="Windows / Windows Server / Office" heading="クライアントとサーバー" />
      <ComparisonTable
        frame={frame}
        columns={[{ label: '何が変わる', accent: true }]}
        rows={[
          { label: '#5 設定バックアップ', cells: ['対象デバイスで既定オン。設定とストアアプリの一覧を自動保存'] },
          { label: '#6 Windows 11 26H2', cells: ['提供開始。24H2・25H2 は軽量な有効化パッケージで移行'] },
          { label: '#9 WDS', cells: ['将来の Windows Server で非推奨。PXE 展開は代替の検討を'] },
          { label: '#10 KB5002907', cells: ['Office 2016 / 2019 永続版でライセンス問題、配信を一時停止'] },
        ]}
      />
    </Slide>
  )
}

function IdentitySlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading frame={frame} kicker="Entra ID / 管理ツール" heading="ID と管理スクリプト" />
      <ComparisonTable
        frame={frame}
        columns={[{ label: '何が変わる', accent: true }]}
        rows={[
          { label: '#7 サインイン ページ', cells: ['スクリプト挿入をブロックへ。監視・カスタマイズ用ツールに影響の可能性'] },
          { label: '#8 Graph PowerShell SDK', cells: ['Windows PowerShell 5.1 のサポート廃止が始まった'] },
          { label: '#12 パスキー', cells: ['外部 IdP のパスキーで Outlook・Teams などモバイル／macOS のアプリにサインイン'] },
        ]}
      />
    </Slide>
  )
}

function M365AzureSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading frame={frame} kicker="Microsoft 365 / Azure" heading="サービスの変更" />
      <ComparisonTable
        frame={frame}
        columns={[{ label: '何が変わる', accent: true }]}
        rows={[
          { label: '#11 ACS', cells: ['ほとんどが2028年9月30日に廃止。Email も含む'] },
          { label: '#13 Teams', cells: ['フェデレーション チャットでファイル共有が容易に'] },
          { label: '#14 Intune', cells: ['段階的展開と Android 管理の強化'] },
          { label: '#15 ストレージ', cells: ['SharePoint / OneDrive Storage がパブリック プレビュー'] },
          { label: '#16 SharePoint', cells: ['Copilot in SharePoint が一般提供'] },
          { label: '#17 AVD', cells: ['リージョナル レジリエンシーが一般提供'] },
        ]}
      />
    </Slide>
  )
}

function SecuritySlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading frame={frame} kicker="Microsoft Security Blog" heading="攻撃の事例" />
      <ComparisonTable
        frame={frame}
        columns={[{ label: '何が起きた', accent: true }]}
        rows={[
          { label: '#18 侵害された ID', cells: ['ID を足がかりにパイプラインとクラウド全体へ拡大（Storm-3068）'] },
          { label: '#19 Zimbra', cells: ['認証不要のコマンド インジェクション CVE-2026-73570 の悪用'] },
          { label: '#20 RMM ツール', cells: ['フィッシングから MSP360 RMM 経由で ScreenConnect を展開'] },
        ]}
      />
    </Slide>
  )
}

function ChecklistSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading frame={frame} kicker="チェックリスト（私の提案）" heading="今日確認する4つ" />
      <Timeline
        frame={frame}
        orientation="vertical"
        steps={[
          { label: '1', heading: 'EWS を使っているアプリと、許可リストの中身を確認する', accent: true },
          { label: '2', heading: 'ExchangeOnlineManagement を 3.10.1 以降にする' },
          { label: '3', heading: 'Graph SDK を Windows PowerShell 5.1 で動かしているスクリプトを洗い出す' },
          { label: '4', heading: '26H2 の対象デバイスで設定バックアップの扱いを決める' },
        ]}
      />
    </Slide>
  )
}

function SourcesSlide({ frame, part }: SlideRenderContext & { part: number }) {
  const items = SOURCES.slice(part * 10, part * 10 + 10)
  return (
    <Slide>
      <SlideHeading frame={frame} kicker="Sources" heading="出典" lead="2026年10月4日時点の公開情報" />
      <Callout frame={frame} icon="📘" label={part === 0 ? '#1〜#10' : '#11〜#20'}>
        <ul>
          {items.map((s) => (
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
