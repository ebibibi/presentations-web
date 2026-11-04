/* eslint-disable react-refresh/only-export-components */
import type { SlideModule, SlideRenderContext } from '../../../src/types'
import {
  Callout,
  ComparisonTable,
  DiagramFrame,
  FlowDiagram,
  HookSlide,
  Quote,
  Slide,
  SlideHeading,
  Timeline,
} from '../../../src/slide-kit'

export const slides: SlideModule['slides'] = [
  { id: 'opening', render: (props) => <OpeningSlide {...props} /> },
  { id: 'what-changes', render: (props) => <WhatChangesSlide {...props} /> },
  { id: 'team-site-trap', render: (props) => <TeamSiteTrapSlide {...props} /> },
  { id: 'are-you-the-five-percent', render: (props) => <FivePercentSlide {...props} /> },
  { id: 'timeline', render: (props) => <HistorySlide {...props} /> },
  { id: 'two-phases', render: (props) => <TwoPhasesSlide {...props} /> },
  { id: 'custom-scripts', render: (props) => <CustomScriptsSlide {...props} /> },
  { id: 'why-now', render: (props) => <WhyNowSlide {...props} /> },
  { id: 'find-it', render: (props) => <FindItSlide {...props} /> },
  { id: 'how-to-move', render: (props) => <HowToMoveSlide {...props} /> },
  { id: 'checklist', render: (props) => <ChecklistSlide {...props} /> },
  { id: 'sources', render: (props) => <SourcesSlide {...props} /> },
]

const SOURCES = [
  {
    label: 'Microsoft Learn：Upcoming changes to classic publishing sites, classic pages, and custom scripting',
    url: 'https://learn.microsoft.com/en-us/sharepoint/classic-user-created-page-deprecation',
  },
  {
    label: 'メッセージセンター MC1464926（2026年8月31日）',
    url: 'https://mc.merill.net/message/MC1464926',
  },
  {
    label: 'SharePoint Blog：Upcoming changes to classic experiences in SharePoint Online',
    url: 'https://techcommunity.microsoft.com/blog/spblog/upcoming-changes-to-classic-experiences-in-sharepoint-online/4549091',
  },
  {
    label: 'Mission Critical Blog：Prepare for Retirement of Classic Publishing Sites and Pages',
    url: 'https://techcommunity.microsoft.com/blog/microsoftmissioncriticalblog/prepare-for-retirement-of-classic-publishing-sites-and-pages-in-sharepoint-onlin/4556343',
  },
  {
    label: 'Microsoft Learn：Modernize your classic SharePoint sites',
    url: 'https://learn.microsoft.com/en-us/sharepoint/dev/transform/modernize-classic-sites',
  },
  {
    label: 'Microsoft Learn：Transform selected classic pages with PnP PowerShell',
    url: 'https://learn.microsoft.com/en-us/sharepoint/dev/transform/modernize-userinterface-site-pages-powershell',
  },
  {
    label: 'メッセージセンター MC1117115（スクリプト規制と発行サイトの作成制限）',
    url: 'https://mc.merill.net/message/MC1117115',
  },
  {
    label: 'PnP：PnP Framework roadmap update',
    url: 'https://pnp.github.io/blog/post/pnp-framework-roadmap-update-1/',
  },
]

function OpeningSlide({ frame }: SlideRenderContext) {
  return (
    <HookSlide
      frame={frame}
      kicker="2026年8月31日 Microsoft公式発表（MC1464926）"
      heading={'あなたのSharePoint\n編集できなくなる？'}
      lead="クラシックページは2028年10月に読み取り専用へ"
    >
      <ComparisonTable
        frame={frame}
        columns={[{ label: '結論', accent: true }]}
        rows={[
          { label: '2027年3月1日', cells: ['クラシック発行サイトの新規作成が止まる'] },
          { label: '2028年10月1日', cells: ['既存のクラシックページが編集できなくなる'] },
          { label: '消える？', cells: ['消えない。サイトもページも閲覧できる'] },
          { label: '今日やること', cells: ['自分のテナントに何があるか棚卸しする'] },
        ]}
      />
    </HookSlide>
  )
}

function WhatChangesSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading
        frame={frame}
        kicker="正確に言うと"
        heading={'消えない。\nでも直せなくなる'}
        lead="対象のページで2028年10月以降にできること、できないこと"
      />
      <ComparisonTable
        frame={frame}
        columns={[{ label: 'できなくなる' }, { label: '続けられる', accent: true }]}
        rows={[
          { label: '中身', cells: ['新規作成・編集・保存', '閲覧'] },
          { label: '公開', cells: ['チェックイン／アウト・発行', '発行の取り消し・承認／却下'] },
          { label: '管理', cells: ['─', '削除・名前変更・移動・コピー'] },
          { label: '属性', cells: ['─', 'プロパティ・版の復元・権限'] },
        ]}
      />
      <Callout frame={frame} tone="warn" icon="📄" label="実害は「古い情報が直せない」こと">
        <p>更新し続けている手順書やお知らせが、最初の対象です。</p>
      </Callout>
    </Slide>
  )
}

function TeamSiteTrapSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading
        frame={frame}
        kicker="いちばんの落とし穴"
        heading={'「チームサイトだから\n関係ない」は危ない'}
        lead="対象はサイトの種類ではなく、ページの種類で決まる"
      />
      <DiagramFrame frame={frame} caption="モダン化していないクラシックチームサイトの場合">
        <FlowDiagram
          frame={frame}
          items={[
            { heading: 'チームサイト', body: 'サイトは残る' },
            { heading: 'ホーム・各ページ', body: 'wiki／Webパーツページ' },
            { heading: '読み取り専用', body: '2028年10月から', accent: true },
          ]}
        />
      </DiagramFrame>
      <ComparisonTable
        frame={frame}
        columns={[{ label: '読み取り専用の対象', accent: true }, { label: '今回の対象外' }]}
        rows={[
          { label: 'ページ', cells: ['wiki・Webパーツ・ブログ・発行', 'モダンページ'] },
          { label: 'その他', cells: ['Designer等で作ったASPX', 'リスト／ライブラリのビュー・フォーム'] },
        ]}
      />
    </Slide>
  )
}

function FivePercentSlide({ frame }: SlideRenderContext) {
  return (
    <Slide center>
      <SlideHeading
        frame={frame}
        kicker="月間アクティブテナントの5%未満"
        heading={'利用は5%未満。\nうちは関係ない？'}
        lead="自社がどちら側かは、調べるまで分からない"
      />
      <Callout frame={frame} icon="🔎" label="こんなページが残っていませんか">
        <ul>
          <li>昔の部門サイトのトップページ</li>
          <li>今も更新している手順書wiki</li>
          <li>SharePoint Designerで作ったページ</li>
          <li>Script Editorで動かしている自作ツール</li>
        </ul>
      </Callout>
    </Slide>
  )
}

function HistorySlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading frame={frame} kicker="ここまでの流れ" heading="順番に閉じてきた" />
      <Timeline
        frame={frame}
        orientation="vertical"
        steps={[
          { label: '2025年9月', heading: '発行サイトの作成制限とスクリプト規制が開始', body: 'MC1117115' },
          { label: '2026年3月', heading: 'テナント全体で規制を遅らせるスイッチが終了予定に', body: 'サイト単位の一時的な例外だけが残る' },
          { label: '2026年4月', heading: 'SharePointアドインが全テナントで停止', body: '4月2日' },
          { label: '2026年7月', heading: 'SharePointアラートの完全停止が始まる', body: 'MC1072889の告知' },
          { label: '2026年8月31日', heading: 'クラシックページの読み取り専用化を発表', body: 'MC1464926', accent: true },
        ]}
      />
    </Slide>
  )
}

function TwoPhasesSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading frame={frame} kicker="期限" heading={'正式な日付は2つ。\n新テナントは前倒し'} />
      <ComparisonTable
        frame={frame}
        columns={[{ label: '既存のテナント' }, { label: '2027年3月1日以降の新テナント', accent: true }]}
        rows={[
          { label: '発行サイトの作成', cells: ['2027年3月1日に完全停止', '最初からできない'] },
          { label: 'クラシックページの作成・編集', cells: ['2028年10月1日に停止', '最初からできない'] },
          { label: 'スクリプトの追加・更新', cells: ['2028年10月1日に停止', '最初からできない'] },
        ]}
      />
      <Callout frame={frame} tone="warn" icon="🏢" label="2028年を待たずに影響を受ける会社">
        <p>テナント統合などで新テナントへ移る場合です。SharePoint Serverから移しても、ページは読み取り専用になります。</p>
      </Callout>
    </Slide>
  )
}

function CustomScriptsSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading
        frame={frame}
        kicker="カスタムスクリプト"
        heading={'止まらない。\nだから気づきにくい'}
        lead="DenyAddAndCustomizePages が True 固定に"
      />
      <ComparisonTable
        frame={frame}
        columns={[{ label: '影響' }]}
        rows={[
          { label: '入っているスクリプト', cells: ['動き続ける'] },
          { label: 'スクリプトの追加・更新', cells: ['できなくなる'] },
          { label: 'リストのビューに埋め込んだもの', cells: ['ページは対象外でも、スクリプトは規制の対象'] },
          { label: 'モダンページ・SPFx', cells: ['影響なし'] },
        ]}
      />
      <Callout frame={frame} tone="warn" icon="🛠️" label="困るのは壊れたとき">
        <p>動いているのに、誰も直せない状態になります。プロパティバッグの更新だけなら別設定で許可できます。</p>
      </Callout>
    </Slide>
  )
}

function WhyNowSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading frame={frame} kicker="なぜ今か" heading={'理由はセキュリティと\nCopilot'} />
      <ComparisonTable
        frame={frame}
        columns={[{ label: 'Microsoftの説明' }]}
        rows={[
          { label: 'セキュリティ', cells: ['スクリプトに頼る古い仕組みはリスクと管理コストが大きい'] },
          { label: 'Copilot', cells: ['クラシックページはCopilotを支える形式に十分反映されない'] },
        ]}
      />
      <Quote
        frame={frame}
        quote="Classic pages are also not fully represented in the content formats that power Microsoft 365 Copilot"
        source="Microsoft SharePoint Blog（2026年8月31日）"
      />
    </Slide>
  )
}

function FindItSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading frame={frame} kicker="まず探す" heading={'「何があるか」と\n「使われているか」'} />
      <ComparisonTable
        frame={frame}
        columns={[{ label: 'Microsoft 365 Assessment Tool' }, { label: 'Purview 監査', accent: true }]}
        rows={[
          { label: '分かること', cells: ['ページの種類・Webパーツ・移行のしやすさ', '実際の作成・編集・閲覧'] },
          { label: '見る場所', cells: ['Classic Pages（v1.15.0以降）', 'SharePoint Classic Activities'] },
          { label: '見る項目', cells: ['移行できないWebパーツ', 'ClassicPageEdited など3イベント'] },
        ]}
      />
      <Callout frame={frame} tone="good" icon="✅" label="公式：見つからなければ対応不要">
        <p>Assessment Toolは調べるだけで、ページの移行はしません。</p>
      </Callout>
    </Slide>
  )
}

function HowToMoveSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading
        frame={frame}
        kicker="移行の考え方"
        heading="全部は移さない。仕分ける"
        lead="モダン化するのは、編集し続けるページ"
      />
      <ComparisonTable
        frame={frame}
        columns={[{ label: '方針', accent: true }]}
        rows={[
          { label: '読むだけのページ', cells: ['読み取り専用のままでよいか判断する'] },
          { label: 'チームサイトのページ', cells: ['ConvertTo-PnPPage で変換して確認'] },
          { label: '発行ポータル', cells: ['新しいコミュニケーションサイトへ作り直す'] },
          { label: '複雑なページ', cells: ['Page Migration Agent（プレビュー）か手作業'] },
        ]}
      />
      <Callout frame={frame} tone="warn" icon="⚠️" label="ツールの注意点">
        <ul>
          <li>オープンソースのツールにMicrosoftのSLAはない</li>
          <li>マッピング100%でも成功とは限らない。1枚ずつ確認</li>
          <li>PnP Frameworkは2027年Q2にアーカイブ予定</li>
        </ul>
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
          {
            label: '1',
            heading: 'Purviewで編集されているページを探す',
            body: 'SharePoint Classic Activities の ClassicPageEdited',
            accent: true,
          },
          {
            label: '2',
            heading: 'Assessment Toolで全体量を出す',
            body: 'Classic Pages をスキャン。何も無ければ対応不要',
          },
          {
            label: '3',
            heading: '編集が必要なページに担当と期限を決める',
            body: '正式な期限は2027年3月1日と2028年10月1日',
          },
        ]}
      />
    </Slide>
  )
}

function SourcesSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading frame={frame} kicker="Sources" heading="出典" lead="最新の日付は自分のテナントのメッセージセンターで確認" />
      <Callout frame={frame} icon="📘" label="公式情報">
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
