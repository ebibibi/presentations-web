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
  { id: 'wu-cert', render: (props) => <WuCertSlide {...props} /> },
  { id: 'exchange-server', render: (props) => <ExchangeServerSlide {...props} /> },
  { id: 'exchange-online', render: (props) => <ExchangeOnlineSlide {...props} /> },
  { id: 'windows-26h2', render: (props) => <Windows26h2Slide {...props} /> },
  { id: 'windows-platform', render: (props) => <WindowsPlatformSlide {...props} /> },
  { id: 'azure-security', render: (props) => <AzureSecuritySlide {...props} /> },
  { id: 'checklist', render: (props) => <ChecklistSlide {...props} /> },
  { id: 'sources-1', render: (props) => <SourcesSlide {...props} part={0} /> },
  { id: 'sources-2', render: (props) => <SourcesSlide {...props} part={1} /> },
  { id: 'cta-outro', render: (props) => <CtaSlide {...props} /> },
]

// One primary source per item, in the item order used throughout the deck.
const SOURCES = [
  {
    label: '#1 Prepare for Windows Update certificate rotation in 2027（Windows IT Pro Blog）',
    url: 'https://techcommunity.microsoft.com/t5/windows-it-pro-blog/prepare-for-windows-update-certificate-rotation-in-2027/ba-p/4562463',
  },
  {
    label: '#2 2026年9月 V2 の Exchange Server セキュリティ更新プログラム（日本マイクロソフト）',
    url: 'https://jpmessaging.github.io/blog/released-september-2026-v2-exchange-server-security-updates/',
  },
  {
    label: '#3 Microsoft Exchange update fixes privilege escalation flaw（Petri）',
    url: 'https://petri.com/microsoft-exchange-update-privilege-escalation-flaw/',
  },
  {
    label: '#4 エイリアスからのメール送信が一般提供開始（日本マイクロソフト）',
    url: 'https://jpmessaging.github.io/blog/sending-from-email-aliases-general-availability/',
  },
  {
    label: '#5 Notes from the field: testing EWSAllowedAppIDs safely（Exchange Team Blog）',
    url: 'https://techcommunity.microsoft.com/t5/exchange-team-blog/notes-from-the-field-testing-ewsallowedappids-safely/ba-p/4548568',
  },
  {
    label: '#6 Microsoft Execution Containers: policy-driven containment for AI agents（Windows Blog）',
    url: 'https://blogs.windows.com/windowsdeveloper/2026/10/07/microsoft-execution-containers-policy-driven-containment-for-ai-agents/',
  },
  {
    label: '#7 Remote PC connections in Windows App on Windows is now generally available（Windows IT Pro Blog）',
    url: 'https://techcommunity.microsoft.com/t5/windows-it-pro-blog/remote-pc-connections-in-windows-app-on-windows-is-now-generally/ba-p/4561186',
  },
  {
    label: '#8 New Group Policy settings in Windows 11 26H2（Petri）',
    url: 'https://petri.com/microsoft-group-policy-settings-windows-11-26h2/',
  },
  {
    label: '#9 Windows 11 26H2 support in Intune and Configuration Manager（Petri）',
    url: 'https://petri.com/windows-11-26h2-support-intune-configuration-manager/',
  },
  {
    label: '#10 Windows 11 26H2 is crashing some games and apps（WindowsLatest）',
    url: 'https://www.windowslatest.com/2026/10/03/microsoft-confirms-windows-11-26h2-is-crashing-some-games-and-apps-promises-to-fix-it-in-the-next-update/',
  },
  {
    label: '#11 Microsoft Graph PowerShell SDK fix（Office 365 IT Pros）',
    url: 'https://office365itpros.com/2026/10/05/microsoft-graph-powershell-sdk-fix/',
  },
  {
    label: '#12 Azure Site Recovery for Azure Local is now generally available（Azure Stack Blog）',
    url: 'https://techcommunity.microsoft.com/t5/azure-stack-blog/azure-site-recovery-for-azure-local-is-now-generally-available/ba-p/4529925',
  },
  {
    label: '#13 Microsoft pauses Copilot on the Windows 11 taskbar（WindowsLatest）',
    url: 'https://www.windowslatest.com/2026/10/07/nobody-wants-copilot-microsoft-pauses-copilot-on-windows-11s-taskbar-to-incorporate-your-feedback/',
  },
  {
    label: '#14 Post-quantum authentication: start testing certificate ecosystems now（Microsoft Security Blog）',
    url: 'https://www.microsoft.com/en-us/security/blog/2026/10/08/post-quantum-authentication-why-organizations-should-start-testing-certificate-ecosystems-now/',
  },
  {
    label: '#15 Onboard Kubernetes clusters to Azure Arc with the Multicloud Connector（Azure Arc Blog）',
    url: 'https://techcommunity.microsoft.com/t5/azure-arc-blog/public-preview-onboard-kubernetes-clusters-to-azure-arc-with-the/ba-p/4556330',
  },
  {
    label: '#16 What’s New in Microsoft Teams, August–September 2026（Microsoft Teams Blog）',
    url: 'https://techcommunity.microsoft.com/t5/microsoft-teams-blog/what-s-new-in-microsoft-teams-august-september-2026/ba-p/4556438',
  },
  {
    label: '#17 Archive mailboxes and Microsoft 365 Copilot（Office 365 IT Pros）',
    url: 'https://office365itpros.com/2026/10/08/archive-mailbox-copilot/',
  },
]

function OpeningSlide({ frame }: SlideRenderContext) {
  return (
    <TitleSlide
      frame={frame}
      kicker="MS週報 ─ 2026年10月9日までの1週間"
      heading={'Windows Update の\n証明書が入れ替わる'}
      lead="月例更新が古いままのデバイスは、2027年に接続できなくなる"
      points={[
        { step: '01', heading: '今週いちばん大きい変化', body: '期限は2027年5月と6月' },
        { step: '02', heading: 'そのほか16件', body: 'Exchange・Windows・Azure・セキュリティ' },
        { step: '03', heading: '今日確認すること', body: '最後にチェックリスト' },
      ]}
    />
  )
}

function WuCertSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading frame={frame} kicker="#1 Windows Update" heading={'期限は\n2つある'} />
      <Timeline
        frame={frame}
        orientation="vertical"
        steps={[
          {
            label: '2027年5月17日',
            heading: 'Windows Server 2019・2016、Windows 10 LTSC 2019',
            body: '2026年7月以降のセキュリティ更新を入れておく',
            accent: true,
          },
          {
            label: '2027年6月19日',
            heading: 'それ以外のサポート中の Windows（25H2 以降は対応不要）',
            body: '24H2・Server 2025 は2025年9月以降、ほかは2026年7月以降の更新',
          },
        ]}
      />
      <Callout frame={frame} tone="good" icon="📦" label="対象外">
        <p>WSUS で更新を配っている環境は、この件の対象外。サポート切れの Windows は Windows Update を使えなくなる</p>
      </Callout>
    </Slide>
  )
}

function ExchangeServerSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading frame={frame} kicker="Exchange Server（オンプレミス）" heading="更新が2つ出ている" />
      <ComparisonTable
        frame={frame}
        columns={[{ label: '何が出た', accent: true }]}
        rows={[
          {
            label: '#2 9月 V2 の更新',
            cells: ['SE・2019・2016 向け。2019 CU14/CU15 と 2016 CU23 向けは ESU 登録が条件'],
          },
          {
            label: '#3 緊急の更新',
            cells: ['CVE-2026-96940: 認証済みユーザーが他人のメールボックスを読める恐れ'],
          },
        ]}
      />
    </Slide>
  )
}

function ExchangeOnlineSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading frame={frame} kicker="Exchange Online" heading="クラウド側の変更" />
      <ComparisonTable
        frame={frame}
        columns={[{ label: '何が変わる', accent: true }]}
        rows={[
          { label: '#4 エイリアス送信', cells: ['プライマリ以外のアドレスから送信できるように（GA）'] },
          {
            label: '#5 EWS 廃止の続報',
            cells: ['EWSAllowedAppIDs を許可と拒否の両方で試す公式の検証手順が公開'],
          },
          {
            label: '#17 アーカイブ',
            cells: ['Copilot はアーカイブ メールボックスも参照。筆者の検証では DLP が効かなかった'],
          },
        ]}
      />
    </Slide>
  )
}

function Windows26h2Slide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading frame={frame} kicker="Windows 11 バージョン 26H2" heading="展開する前に" />
      <ComparisonTable
        frame={frame}
        columns={[{ label: '何が分かった', accent: true }]}
        rows={[
          { label: '#8 Group Policy', cells: ['新しい設定が28個。利用者に選ばせる機能が多い'] },
          { label: '#9 管理ツール', cells: ['Intune と Configuration Manager が対応'] },
          { label: '#10 不具合', cells: ['一部のゲームやアプリがクラッシュ。次の更新で修正予定'] },
          { label: '#13 Ask Copilot', cells: ['タスクバーの Ask Copilot を一時停止'] },
        ]}
      />
    </Slide>
  )
}

function WindowsPlatformSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading frame={frame} kicker="Windows / 管理ツール" heading="そのほかの Windows" />
      <ComparisonTable
        frame={frame}
        columns={[{ label: '何が変わる', accent: true }]}
        rows={[
          { label: '#6 MXC', cells: ['AI エージェントをポリシーで強制する境界の中で動かす（GA）'] },
          { label: '#7 Windows App', cells: ['物理・仮想 PC へのリモート接続が一般提供'] },
          { label: '#11 Graph SDK 2.41', cells: ['他の Microsoft 365 モジュールとのアセンブリ競合を解消'] },
        ]}
      />
    </Slide>
  )
}

function AzureSecuritySlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading frame={frame} kicker="Azure / セキュリティ / Teams" heading="そのほかの変更" />
      <ComparisonTable
        frame={frame}
        columns={[{ label: '何が変わる', accent: true }]}
        rows={[
          { label: '#12 Azure Local', cells: ['Azure Site Recovery による災害復旧が一般提供'] },
          { label: '#15 Azure Arc', cells: ['EKS・GKE クラスターを自動でオンボード（プレビュー）'] },
          { label: '#14 ポスト量子', cells: ['証明書エコシステムのテストを今から始めるよう案内'] },
          { label: '#16 Teams', cells: ['What’s New が月次から四半期ごとに。次回は12月'] },
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
          { label: '1', heading: '月例更新が古いまま止まっているデバイスを洗い出す', accent: true },
          { label: '2', heading: 'オンプレミス Exchange に9月 V2 と緊急の更新を入れる' },
          { label: '3', heading: 'EWSAllowedAppIDs の許可と拒否を検証手順で試す' },
          { label: '4', heading: '26H2 の展開前に、クラッシュの修正と新しい GPO を確認する' },
        ]}
      />
    </Slide>
  )
}

function SourcesSlide({ frame, part }: SlideRenderContext & { part: number }) {
  const items = part === 0 ? SOURCES.slice(0, 9) : SOURCES.slice(9)
  return (
    <Slide>
      <SlideHeading frame={frame} kicker="Sources" heading="出典" lead="2026年10月9日時点の公開情報" />
      <Callout frame={frame} icon="📘" label={part === 0 ? '#1〜#9' : '#10〜#17'}>
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
