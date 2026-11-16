/* eslint-disable react-refresh/only-export-components */
import type { SlideModule, SlideRenderContext } from '../../../src/types'
import {
  Callout,
  ComparisonTable,
  DiagramFrame,
  FlowDiagram,
  HookSlide,
  KineticTitle,
  Quote,
  Slide,
  SlideHeading,
  useEnter,
} from '../../../src/slide-kit'

export const slides: SlideModule['slides'] = [
  { id: 'opening', render: (props) => <OpeningSlide {...props} /> },
  { id: 'last-time', render: (props) => <LastTimeSlide {...props} /> },
  { id: 'not-studied', render: (props) => <NotStudiedSlide {...props} /> },
  { id: 'comment', render: (props) => <CommentSlide {...props} /> },
  { id: 'what-is', render: (props) => <WhatIsSlide {...props} /> },
  { id: 'app-shape', render: (props) => <AppShapeSlide {...props} /> },
  { id: 'two-walls', render: (props) => <TwoWallsSlide {...props} /> },
  { id: 'defaults', render: (props) => <DefaultsSlide {...props} /> },
  { id: 'vs-azure', render: (props) => <VsAzureSlide {...props} /> },
  { id: 'ms-aim', render: (props) => <MsAimSlide {...props} /> },
  { id: 'money', render: (props) => <MoneySlide {...props} /> },
  { id: 'weak-points', render: (props) => <WeakPointsSlide {...props} /> },
  { id: 'summary', render: (props) => <SummarySlide {...props} /> },
  { id: 'sources', render: (props) => <SourcesSlide {...props} /> },
]

const ASSET = '/decks/copilot-managed-runtime'

type Pose = 'standing' | 'face-up' | 'dark' | 'glasses-flash' | 'ageage'

const SOURCES = [
  {
    label: 'What is Microsoft Copilot Managed Runtime (preview)',
    url: 'https://learn.microsoft.com/en-us/microsoft-365/copilot-managed-runtime/',
  },
  {
    label: 'Copilot Managed Runtime overview and key concepts for admins (preview)',
    url: 'https://learn.microsoft.com/en-us/microsoft-365/admin/manage/apps/',
  },
  {
    label: 'Review default governance settings for apps (preview)',
    url: 'https://learn.microsoft.com/en-us/microsoft-365/admin/manage/apps/governance',
  },
  {
    label: 'Manage licensing and Copilot Credits for apps on Copilot Managed Runtime',
    url: 'https://learn.microsoft.com/en-us/microsoft-365/admin/manage/apps/licensing-credits',
  },
  {
    label: 'FAQ about Microsoft Copilot Managed Runtime (preview)',
    url: 'https://learn.microsoft.com/en-us/microsoft-365/admin/manage/apps/faq-about-apps',
  },
  {
    label: 'Build apps with the Copilot Managed Runtime SDK (preview)',
    url: 'https://learn.microsoft.com/en-us/microsoft-365/copilot-managed-runtime/developer/apps/',
  },
  {
    label: '前回の動画：Power Automateは役割を終えつつある、と私は思う',
    url: 'https://www.youtube.com/watch?v=KZuRTHY17J0',
  },
]

/** The channel mascot with a speech bubble; it plays the MC in the opening. */
function EbiFry({ frame, pose, quote, delay = 24 }: { frame: number; pose: Pose; quote: string; delay?: number }) {
  const style = useEnter(frame, delay, 24)
  return (
    <div className="cmr-mc" style={style}>
      <img className="cmr-mc-img" src={`${ASSET}/ebifry-${pose}.webp`} alt="えびフライ" />
      <p className="cmr-mc-bubble">
        <span className="cmr-mc-name">えびフライ</span>
        {quote}
      </p>
    </div>
  )
}

function OpeningSlide({ frame }: SlideRenderContext) {
  return (
    <HookSlide
      frame={frame}
      kicker="前回の続き ─ えびフライの司会でお送りします"
      heading={'「誰か作って」と\n言った基盤、もうあった'}
      lead="Copilot Managed Runtime ─ Microsoft が2026年9月からプレビュー提供"
    >
      <EbiFry
        frame={frame}
        pose="face-up"
        quote="胡田さん、前回の最後で「誰か作ってみませんか」って言ってたよね？ それ、もうあるらしいよ！"
        delay={40}
      />
    </HookSlide>
  )
}

function LastTimeSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading frame={frame} kicker="前回の動画の最後（12:00ごろ）" heading="こんなことを言っていました" />
      <Quote
        frame={frame}
        quote="裏で何かが動いているんだけど、危ないことは全部できないようになって、安全弁がついて、お金も使いすぎないで済む。インターフェースはAI。そういうものが求められている気がする。誰か作ってみませんか"
        source="胡田 ─「Power Automateは役割を終えつつある、と私は思う」"
      />
      <EbiFry frame={frame} pose="ageage" quote="ぼく、作っちゃおうかな？…いや、無理！（前回）" delay={48} />
    </Slide>
  )
}

function NotStudiedSlide({ frame }: SlideRenderContext) {
  return (
    <Slide tone="ink" center>
      <KineticTitle
        frame={frame}
        kicker="2026年9月25日ごろ、もう出ていた"
        heading={'気がついたら\nもう あった'}
        lead="自分で「誰か作って」と言っておいて、知らなかった"
        start={1}
        enter={['slide', 'pop']}
      />
      <EbiFry frame={frame} pose="dark" quote="ダメだね胡田さん、勉強を怠ってるぞ！" delay={60} />
    </Slide>
  )
}

function CommentSlide({ frame }: SlideRenderContext) {
  const shot = useEnter(frame, 16, 28)
  return (
    <Slide>
      <SlideHeading
        frame={frame}
        kicker="前回の動画のコメント欄"
        heading={'コメントで\n教えてもらいました'}
        lead="ありがとうございます！ ここから調べた内容をまとめます"
      />
      <img
        className="cmr-comment-shot"
        style={shot}
        src={`${ASSET}/comment-takuyone.webp`}
        alt="前回の動画に寄せられた @TakuYone さんのコメントのスクリーンショット"
      />
      <Callout frame={frame} icon="🔍" label="今回やったこと">
        <p>Microsoft Learn の公式ドキュメントを読んで整理した（実機ではまだ試していない）。「従量課金がもやっと」も確かめる。</p>
      </Callout>
    </Slide>
  )
}

function WhatIsSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading
        frame={frame}
        kicker="Copilot Managed Runtime とは"
        heading={'AIで作った社内アプリを\nMicrosoftがテナント内で預かる'}
      />
      <DiagramFrame frame={frame} caption="作る → 預ける → 使う・管理する" note="対象の商用テナントでは自動で有効。管理者の操作は不要">
        <FlowDiagram
          frame={frame}
          items={[
            { heading: '作る（4つの入口）', body: 'Cowork / Copilot Studio / Copilot Code / CLI（ms）' },
            { heading: 'Managed Runtime', body: 'Microsoftがホスト。Entra認証・テナントの統制つき', accent: true },
            { heading: '使う・管理する', body: '利用者はポータル、管理者はM365管理センター' },
          ]}
        />
      </DiagramFrame>
    </Slide>
  )
}

function AppShapeSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading
        frame={frame}
        kicker="ローコード？ 普通のアプリ？"
        heading={'中身は普通のWebアプリ\n裏はPower Platform'}
      />
      <ComparisonTable
        frame={frame}
        columns={[{ label: '中身' }, { label: 'どちらの流儀か', accent: true }]}
        rows={[
          { label: '画面とロジック', cells: ['React + TypeScript + Vite', '普通のWebアプリ'] },
          { label: 'ソース', cells: ['本物の Git（push でビルド）', '普通のWebアプリ'] },
          { label: 'データ', cells: ['コネクタ（1,500以上）経由', 'Power Platform'] },
          { label: '置き場所', cells: ['作った人の個人開発環境', 'Power Platform'] },
          { label: '統制', cells: ['DLP・コネクタポリシー', 'Power Platform'] },
        ]}
      />
      <Callout frame={frame} icon="🧬" label="前身">
        <p>2025年の Power Apps code apps とほぼ同じ作り。ホストが変わり、Git 内蔵と M365 管理センターでの管理が加わった。</p>
      </Callout>
    </Slide>
  )
}

function TwoWallsSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading
        frame={frame}
        kicker="AIが書いたコードを、信用しなくて済む仕組み"
        heading={'中身は自由、\n出口を一本にして締める'}
      />
      <DiagramFrame frame={frame} caption="アプリからデータへの道" note="外部APIへの fetch はブラウザが止める（CSP の connect-src 'self'）">
        <FlowDiagram
          frame={frame}
          items={[
            { heading: 'AIが書いたアプリ', body: 'ブラウザで動く。外への通信は自分のサーバーだけ' },
            { heading: 'コネクタ（関所）', body: '既定はMicrosoft製・Entra認証のみの18個だけ', accent: true },
            { heading: 'SharePoint ほか', body: '利用者本人の権限で読み書き' },
          ]}
        />
      </DiagramFrame>
      <Callout frame={frame} tone="warn" icon="🚧" label="抜け道の操作も既定で無効">
        <p>許可したコネクタの中でも「HTTP要求を送信」「Office Scripts の実行」「自由に書ける DAX」などは止めてある。</p>
      </Callout>
    </Slide>
  )
}

function DefaultsSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading frame={frame} kicker="作った瞬間から効いている" heading="ほかの既定の統制" />
      <ComparisonTable
        frame={frame}
        columns={[{ label: '既定の状態', accent: true }]}
        rows={[
          { label: '開発環境', cells: ['開発者ごとに隔離された個人のサンドボックス'] },
          { label: 'ID', cells: ['Entra 認証と条件付きアクセス'] },
          { label: 'データ権限', cells: ['アプリを共有しても、データの権限は渡らない'] },
          { label: 'ビルド', cells: ['Git からプラットフォームがビルド・スキャン。外部の成果物は持ち込み禁止'] },
          { label: '共有', cells: ['組織全体・ゲストへの共有をそれぞれオン/オフ'] },
          { label: '棚卸し', cells: ['全アプリが M365 管理センターに出る。利用状況・正常性も'] },
        ]}
      />
    </Slide>
  )
}

function VsAzureSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading
        frame={frame}
        kicker="前回「怖い」と言ったものと比べる"
        heading={'Azureをそのまま渡すより\nはるかに統制されている'}
      />
      <ComparisonTable
        frame={frame}
        columns={[{ label: '1万人にAzureを配る' }, { label: 'Copilot Managed Runtime', accent: true }]}
        rows={[
          { label: '作れるもの', cells: ['何でも', 'ブラウザで動く社内アプリ'] },
          { label: '外への通信', cells: ['どこへでも', 'コネクタだけ'] },
          { label: 'データ', cells: ['設計しだい', '利用者本人の権限'] },
          { label: 'お金', cells: ['予算の仕組みは自分で組む', '1人ごとの月の上限'] },
          { label: '棚卸し', cells: ['自分で作る', '管理センターに全部出る'] },
        ]}
      />
    </Slide>
  )
}

function MsAimSlide({ frame }: SlideRenderContext) {
  return (
    <Slide tone="ink" center>
      <KineticTitle
        frame={frame}
        kicker="胡田の見立て"
        heading={'作るのは AI\n置き場所と 統制は Microsoft'}
        lead="作る画面からCopilotを外し、AIで作ったものの置き場所を用意した。狙いは市民開発者 × AI開発"
        start={1}
        enter={['slide', 'pop']}
      />
    </Slide>
  )
}

function MoneySlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading
        frame={frame}
        kicker="コメントの「従量課金がもやっと」"
        heading={'API 1回 = 0.1クレジット\n（約0.1円）'}
        lead="使う人1人ずつに Power Apps Premium か Copilot Credits が要る"
      />
      <ComparisonTable
        frame={frame}
        columns={[{ label: '公式の試算（月額）', accent: true }]}
        rows={[
          { label: '個人用（1人）', cells: ['0.4〜1ドル'] },
          { label: 'チーム（25人）', cells: ['12〜22ドル'] },
          { label: '部門（300人）', cells: ['59〜119ドル'] },
        ]}
      />
      <Callout frame={frame} tone="warn" icon="💸" label="もやっとする所">
        <ul>
          <li>起動時に読み込む JS・画像も1ファイルずつ課金</li>
          <li>M365 E3/E5 付属の Power Apps 利用権では動かない</li>
          <li>作る側（Cowork・Code・Copilot Studio）は別料金</li>
        </ul>
      </Callout>
    </Slide>
  )
}

function WeakPointsSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading frame={frame} kicker="公平に" heading="まだ弱いところ" lead="どれも公式ドキュメントに書いてある" />
      <ComparisonTable
        frame={frame}
        columns={[{ label: '現時点の制約', accent: true }]}
        rows={[
          { label: '見えない所', cells: ['実際の送信先、実行した操作、利用者ごとのデータ権限'] },
          { label: '環境分け', cells: ['開発・テスト・本番を分ける仕組みはまだない'] },
          { label: 'ゲスト', cells: ['共有をオンにしても、まだ開けない（既知の不具合）'] },
          { label: '状態', cells: ['全体がプレビュー。仕様は変わる'] },
        ]}
      />
    </Slide>
  )
}

function SummarySlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading
        frame={frame}
        kicker="まとめ"
        heading={'本当に良いかは まだ謎\nでも、筋はいい'}
        lead="市民開発者 × AI開発 の置き場所としては、前回欲しいと言ったものにかなり近い"
      />
      <Callout frame={frame} icon="✅" label="管理者が今日確認すること">
        <ul>
          <li>Copilot Studio からアプリを作る経路は既定でオン（CLI は既定でオフ）</li>
          <li>使う人には Power Apps Premium か、支出ポリシーが必要</li>
          <li>どこまで許すか、方針を先に決めておく</li>
        </ul>
      </Callout>
      <EbiFry frame={frame} pose="glasses-flash" quote="ぼくが作らなくてよかった〜。みんなの意見もコメントで教えてね！" delay={56} />
    </Slide>
  )
}

function SourcesSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading frame={frame} kicker="Sources" heading="出典" lead="どれもプレビューの文書。最新は自分で確認を" />
      <Callout frame={frame} icon="📘" label="一次情報（Microsoft Learn）">
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
