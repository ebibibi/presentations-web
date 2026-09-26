/* eslint-disable react-refresh/only-export-components */
import type { SlideRenderContext, SlideModule } from '../../../src/types'
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
  VideoSlide,
} from '../../../src/slide-kit'

export const slides: SlideModule['slides'] = [
  { id: 'opening', render: (props) => <OpeningSlide {...props} /> },
  { id: 'cta-intro', render: (props) => <CtaSlide {...props} /> },
  { id: 'overview', render: (props) => <OverviewSlide {...props} /> },
  { id: 'official-video', render: (props) => <OfficialVideoSlide {...props} /> },
  { id: 'home', render: (props) => <HomeSlide {...props} /> },
  { id: 'code', render: (props) => <CodeSlide {...props} /> },
  { id: 'managed-runtime', render: (props) => <ManagedRuntimeSlide {...props} /> },
  { id: 'runtime-sdk', render: (props) => <RuntimeSdkSlide {...props} /> },
  { id: 'autopilot', render: (props) => <AutopilotSlide {...props} /> },
  { id: 'work-iq', render: (props) => <WorkIqSlide {...props} /> },
  { id: 'pricing', render: (props) => <PricingSlide {...props} /> },
  { id: 'usl-detail', render: (props) => <UslDetailSlide {...props} /> },
  { id: 'finops', render: (props) => <FinOpsSlide {...props} /> },
  { id: 'timeline', render: (props) => <AvailabilitySlide {...props} /> },
  { id: 'reading', render: (props) => <ReadingSlide {...props} /> },
  { id: 'checklist', render: (props) => <ChecklistSlide {...props} /> },
  { id: 'sources', render: (props) => <SourcesSlide {...props} /> },
  { id: 'cta-outro', render: (props) => <CtaSlide {...props} /> },
]

function OpeningSlide({ frame }: SlideRenderContext) {
  return (
    <TitleSlide
      frame={frame}
      kicker="Microsoft Copilot ─ 2026年9月25日発表"
      heading={'新しいCopilotは\n3本柱になった'}
      lead="課金も「定額」と「従量」の2階建てへ"
      points={[
        { step: '01', heading: 'Home', body: '聞く・任せる' },
        { step: '02', heading: 'Code', body: '誰でもアプリを作る' },
        { step: '03', heading: 'Autopilot', body: '自分のIDで働き続ける' },
      ]}
    />
  )
}

function OverviewSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading frame={frame} kicker="ひと目で" heading={'Copilotアプリの\n新しい3つのタブ'} />
      <ComparisonTable
        frame={frame}
        columns={[{ label: 'Home' }, { label: 'Code' }, { label: 'Autopilot', accent: true }]}
        rows={[
          { label: '役割', cells: ['聞く・任せる', '作る', 'ずっと任せる'] },
          { label: '中身', cells: ['Chat＋Cowork＋Office', 'アプリ・ダッシュボード', '常駐エージェント'] },
          { label: '動き方', cells: ['頼んだら返す', '作って共有する', 'プロンプトを待たない'] },
          { label: '課金', cells: ['Chatは定額', '従量', '従量'] },
        ]}
      />
      <Callout frame={frame} icon="🧭" label="近日：モードを選ばなくてよくなる">
        <p>やりたいことを言えば、Copilotが Chat / Cowork / Code に振り分ける</p>
      </Callout>
    </Slide>
  )
}

function OfficialVideoSlide({ frame }: SlideRenderContext) {
  return (
    <VideoSlide
      frame={frame}
      kicker="公式の発表動画（93秒）"
      heading="1つの題材で3本柱を通して見せる"
      lead="仕入先レビュー：表と資料 → ライブアプリ → Autopilotが会議設定"
      videoId="OgInADh5Tcs"
      caption="The new Copilot: where AI-powered work comes together ─ Microsoft Copilot"
      embed
    />
  )
}

function HomeSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading
        frame={frame}
        kicker="Home"
        heading={'ChatとCoworkが\n1か所に'}
        lead="作るのはプレビューではなく本物のOfficeファイル"
      />
      <DiagramFrame frame={frame} caption="Homeの中身" note="Office in Copilot：チームがそのまま共同編集できる">
        <FlowDiagram
          frame={frame}
          items={[
            { heading: 'Chat', body: '即答・下書き・調べ物' },
            { heading: 'Cowork', body: '完成物まで任せる' },
            { heading: 'Word / Excel / PowerPoint', body: '実ファイルを作って編集', accent: true },
          ]}
        />
      </DiagramFrame>
    </Slide>
  )
}

function CodeSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading
        frame={frame}
        kicker="Code"
        heading={'仕事の単位に\n「小さなアプリ」が加わる'}
        lead="文書・表・スライドに続く4つ目"
      />
      <Timeline
        frame={frame}
        orientation="vertical"
        steps={[
          { label: '頼み方', heading: '自然言語で「こういうものが欲しい」', body: 'ウィジェット・ダッシュボード・共有アプリ' },
          { label: '中身', heading: 'GitHub Copilotと同じ技術', body: '開発者は引き続きGitHub Copilotを使う' },
          { label: '安全', heading: 'サンドボックスで実行、テナント内でホスト', accent: true },
        ]}
      />
    </Slide>
  )
}

function ManagedRuntimeSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading
        frame={frame}
        kicker="Copilot Managed Runtime（パブリックプレビュー）"
        heading={'作ったアプリを\nテナントの中で動かす'}
      />
      <DiagramFrame frame={frame} caption="どこで作っても、同じ場所で動く" note="Entra IDで認証、ポリシーで接続先を制御、Gitで版管理">
        <FlowDiagram
          frame={frame}
          items={[
            { heading: '作る', body: 'Cowork / Code / Copilot Studio / 他社ツール' },
            { heading: '動かす', body: 'Managed Runtime' },
            { heading: '管理する', body: 'M365管理センター「Apps」', accent: true },
          ]}
        />
      </DiagramFrame>
    </Slide>
  )
}

function AutopilotSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading
        frame={frame}
        kicker="Autopilot（旧Scout）"
        heading={'自分のIDを持つ\nデジタルな同僚'}
        lead="名前・役割・目標を渡すと、プロンプトを待たずに働く"
      />
      <Timeline
        frame={frame}
        orientation="vertical"
        steps={[
          { label: '持ち物', heading: '独自のID・記憶・コンピューター・作業場所' },
          { label: '動き方', heading: 'チャネルを見張り、追いかけ、数日後に拾い直す' },
          { label: '居場所', heading: 'Teams・Outlookで@メンションできる' },
          { label: '管理', heading: '権限・監査・ガバナンスの下で動く', accent: true },
        ]}
      />
    </Slide>
  )
}

function RuntimeSdkSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading
        frame={frame}
        kicker="Managed Runtime の中身"
        heading={'作るのは自由、\n動かすのは管理下で'}
      />
      <ComparisonTable
        frame={frame}
        columns={[{ label: '作る人' }, { label: 'IT部門', accent: true }]}
        rows={[
          { label: '道具', cells: ['好きなツール（例：Lovable）', 'SDK・CLIで同じ基盤へ'] },
          { label: '版管理', cells: ['Gitで自動管理', '現行版を止めずに新版を試す'] },
          { label: '見る場所', cells: ['いつもの共有・サインイン', 'M365管理センター「Apps」'] },
        ]}
      />
      <Callout frame={frame} icon="🧩" label="Microsoftの言い方">
        <p>一元的な統制に、作成の一元化は要らない</p>
      </Callout>
    </Slide>
  )
}

function WorkIqSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading
        frame={frame}
        kicker="Work IQ × Dynamics 365 / Power Platform（9月30日からプレビュー）"
        heading={'業務システムのデータも\nCopilotが読む'}
      />
      <Timeline
        frame={frame}
        orientation="vertical"
        steps={[
          { label: '理解', heading: 'セマンティックモデル', body: '既存のビュー・リレーション・用語集から文脈を作る' },
          { label: '手順', heading: 'ビジネススキル', body: '社内の進め方を再利用できる形にする' },
          { label: '実行', heading: '統制されたアクション', body: '承認を経て、利用者の権限内でレコードを更新', accent: true },
        ]}
      />
    </Slide>
  )
}

function UslDetailSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading
        frame={frame}
        kicker="定額（USL）の中身"
        heading={'賢さが要らない仕事は\n定額で回す'}
        lead="根拠は「飽和」：要約に最強のモデルは要らない"
      />
      <Timeline
        frame={frame}
        orientation="vertical"
        steps={[
          { label: '含まれる', heading: 'Auto、GPT-5.6、Sonnet 5', body: 'Opus 5などの新モデルは上限付き' },
          { label: '上限', heading: 'フェアユースに届いたら警告', body: 'Autoへ切替（追加費用なし）か、クレジットへ' },
          { label: '今後', heading: '採算が合えば従量から定額へ移る機能も', accent: true },
        ]}
      />
    </Slide>
  )
}

function PricingSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading frame={frame} kicker="お金の話" heading={'課金は\n2階建てになる'} />
      <ComparisonTable
        frame={frame}
        columns={[{ label: '定額（USL）' }, { label: '従量（UBB）', accent: true }]}
        rows={[
          { label: '対象', cells: ['日常のAI', '任せるAI'] },
          { label: '例', cells: ['Chat・Word・Excel・Teams', 'Cowork・Code・Autopilot'] },
          { label: 'モデル', cells: ['Autoが自動で選ぶ', 'Fable・Astraなど最先端'] },
          { label: '単位', cells: ['ユーザー／月', 'Copilot Credits'] },
        ]}
      />
      <Callout frame={frame} icon="🔋" label="Microsoftの例え：プラグインハイブリッド車">
        <p>USLがバッテリー、UBBがガソリンタンク。UBBを使うにはUSLが前提</p>
      </Callout>
    </Slide>
  )
}

function FinOpsSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading frame={frame} kicker="FinOps for AI" heading={'蛇口を開けるのは\n管理者'} />
      <Callout frame={frame} tone="good" icon="🔒" label="既定はオフ">
        <p>支出ポリシーを作るまでUBBは動かず、課金もされない</p>
      </Callout>
      <Timeline
        frame={frame}
        orientation="vertical"
        steps={[
          { label: '予算', heading: 'テナント・グループ単位＋ユーザー上限・アラート' },
          { label: 'モデル', heading: 'グループごとに使えるモデルを絞る', body: 'Autoが選ぶモデルにも効く' },
          { label: '部門', heading: 'Azureのサブスク・リソースグループに付け替え' },
          { label: '自動化', heading: 'Graph API・既存の承認フローに接続' },
          { label: '利用者', heading: '自分の残りクレジットをCopilotで確認', accent: true },
        ]}
      />
    </Slide>
  )
}

function AvailabilitySlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading
        frame={frame}
        kicker="提供時期"
        heading={'ほとんどが\nFrontierかプレビューから'}
      />
      <Timeline
        frame={frame}
        orientation="vertical"
        steps={[
          { label: '発表日', heading: 'Managed Runtime パブリックプレビュー', body: 'Fabric IQはChat・CoworkでGA' },
          { label: '数週間内', heading: 'Home・Code がFrontierへ', body: 'Codeは月末から、その後広く提供' },
          { label: '9月末', heading: 'Autopilot・Teamsの@Copilot', body: 'プライベートプレビュー' },
          { label: '10月', heading: 'Today プライベートプレビュー' },
          { label: '年内', heading: 'Code：M365 Premium / Pro向けプレビュー', accent: true },
        ]}
      />
    </Slide>
  )
}

function ReadingSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading frame={frame} kicker="読み解き" heading={'本当に変わったのは\nどこか'} />
      <Timeline
        frame={frame}
        orientation="vertical"
        steps={[
          { label: '1', heading: '「使う道具」から「任せて作らせる場所」へ' },
          { label: '2', heading: '任せる仕事ほど従量。予算管理が情シスの仕事に' },
          {
            label: '3',
            heading: '人ではないIDと、人が作っていないアプリがテナントに住む',
            body: 'モデル選択にはGPTとClaudeが並ぶ',
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
      <SlideHeading frame={frame} kicker="チェックリスト" heading="管理者が今日確認すること" />
      <Timeline
        frame={frame}
        orientation="vertical"
        steps={[
          { label: '1', heading: 'Frontierプログラムに参加しているか、誰を対象にするか' },
          {
            label: '2',
            heading: 'UBBの支出ポリシーをどう作るか',
            body: '作らなければ課金されないが、Cowork・Code・Autopilotも使えない',
          },
          { label: '3', heading: 'M365管理センター「Apps」でManaged Runtimeの既定ポリシーを見る' },
          { label: '4', heading: 'AutopilotのIDを、人のIDと同じ目線で権限・監査・棚卸しする', accent: true },
        ]}
      />
    </Slide>
  )
}

function SourcesSlide({ frame }: SlideRenderContext) {
  const links = [
    ['発表本体', 'Introducing the new Copilot with Home, Code and Autopilot', 'https://blogs.microsoft.com/blog/2026/09/25/introducing-the-new-copilot-with-home-code-and-autopilot/'],
    ['課金', 'Evolution of the Copilot pricing model', 'https://techcommunity.microsoft.com/blog/microsoft-copilot-blog/evolution-of-the-copilot-pricing-model/4559416'],
    ['実行基盤', 'Microsoft Copilot Managed Runtime', 'https://www.microsoft.com/en-us/copilot/blog/copilot-studio/build-where-you-want-run-with-confidence-now-microsoft-hosts-and-manages-the-code-created-by-copilot/'],
    ['業務データ', 'Business applications in Work IQ', 'https://aka.ms/BizAppsInWorkIQ/Blog'],
    ['コスト管理', 'New FinOps for AI capabilities', 'https://techcommunity.microsoft.com/blog/ai-finops-blog/new-finops-for-ai-capabilities-control-spend-measure-value-and-optimize-for-impa/4559660'],
  ]
  return (
    <Slide>
      <SlideHeading frame={frame} kicker="出典" heading="一次情報" lead="すべて2026年9月25日公開のMicrosoft公式情報" />
      <Callout frame={frame} icon="📰" label="発表本体と関連記事">
        {links.map(([label, title, href]) => (
          <p key={href}>
            {label}：<a href={href} target="_blank" rel="noreferrer">{title}</a>
          </p>
        ))}
      </Callout>
      <Callout frame={frame} tone="warn" icon="⚠️" label="提供時期と価格は変わりうる">
        <p>判断の前に、一次情報の最新状態を確認してください</p>
      </Callout>
    </Slide>
  )
}
