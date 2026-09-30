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

const SOURCES = [
  { label: '胡田のX投稿（2026年9月29日）', url: 'https://x.com/ebi/status/2104891831091925063' },
  { label: 'Cloudflare Plans', url: 'https://www.cloudflare.com/plans/' },
  { label: 'Cloudflare Network', url: 'https://www.cloudflare.com/network/' },
  { label: 'Cloudflare Pages Limits', url: 'https://developers.cloudflare.com/pages/platform/limits/' },
  { label: 'Cloudflare Workers Pricing', url: 'https://developers.cloudflare.com/workers/platform/pricing/' },
  { label: 'Workers Static Assets Billing', url: 'https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/' },
  { label: 'Azure Static Web Apps Pricing', url: 'https://azure.microsoft.com/pricing/details/app-service/static/' },
  { label: 'Azure Static Web Apps Plans / Quotas', url: 'https://learn.microsoft.com/azure/static-web-apps/plans' },
  { label: 'Microsoft Online Services SLA（2026年9月版）', url: 'https://www.microsoft.com/licensing/docs/view/Service-Level-Agreements-SLA-for-Online-Services' },
  { label: 'エックスサーバー 料金・機能', url: 'https://www.xserver.ne.jp/price/' },
]

export const slides: SlideModule['slides'] = [
  { id: 'opening', render: (props) => <OpeningSlide {...props} /> },
  { id: 'x-posts', render: (props) => <XPostsSlide {...props} /> },
  { id: 'answer', render: (props) => <AnswerSlide {...props} /> },
  { id: 'old-picture', render: (props) => <OldPictureSlide {...props} /> },
  { id: 'rental-server', render: (props) => <RentalServerSlide {...props} /> },
  { id: 'paas-big', render: (props) => <PaasBigSlide {...props} /> },
  { id: 'responsibility', render: (props) => <ResponsibilitySlide {...props} /> },
  { id: 'easier', render: (props) => <EasierSlide {...props} /> },
  { id: 'global-big', render: (props) => <GlobalBigSlide {...props} /> },
  { id: 'performance', render: (props) => <PerformanceSlide {...props} /> },
  { id: 'ai', render: (props) => <AiSlide {...props} /> },
  { id: 'zero-yen', render: (props) => <ZeroYenSlide {...props} /> },
  { id: 'free-plan', render: (props) => <FreePlanSlide {...props} /> },
  { id: 'dynamic', render: (props) => <DynamicSlide {...props} /> },
  { id: 'my-setup', render: (props) => <MySetupSlide {...props} /> },
  { id: 'official-plans', render: (props) => <OfficialPlansSlide {...props} /> },
  { id: 'real-price', render: (props) => <RealPriceSlide {...props} /> },
  { id: 'azure-swa', render: (props) => <AzureSwaSlide {...props} /> },
  { id: 'both-true', render: (props) => <BothTrueSlide {...props} /> },
  { id: 'opinion-price', render: (props) => <OpinionPriceSlide {...props} /> },
  { id: 'judge', render: (props) => <JudgeSlide {...props} /> },
  { id: 'checklist', render: (props) => <ChecklistSlide {...props} /> },
  { id: 'conclusion', render: (props) => <ConclusionSlide {...props} /> },
  { id: 'sources', render: (props) => <SourcesSlide {...props} /> },
  { id: 'cta', render: (props) => <CtaSlide {...props} /> },
]

function OpeningSlide({ frame }: SlideRenderContext) {
  return (
    <TitleSlide
      frame={frame}
      kicker="Cloudflare・Azure Static Web Apps の公式料金で確かめる"
      heading={'「サイトの運用は大変」は\nもう古い'}
      lead="PaaS＋AIの時代に、何にお金を払うべきか"
      points={[
        { step: '01', heading: '静的サイトなら月0円', body: '配信もSSLも無料プランに入っている' },
        { step: '02', heading: '業務なら払う', body: '保証が付くのはどのプランからか' },
        { step: '03', heading: '今、価値があるか', body: '何のお金を払っているかを分けて見る' },
      ]}
    />
  )
}

function AnswerSlide({ frame }: SlideRenderContext) {
  return (
    <Slide tone="ink" center>
      <SlideHeading
        frame={frame}
        kicker="私の見立て"
        heading={'Webサイトづくりは\nPaaS＋AIで\n昔とは何もかも違う'}
        lead="公式：配信・SSL・大量アクセス攻撃（DDoS）の防御が、Cloudflareの無料プランに含まれる"
      />
    </Slide>
  )
}

const POST_URL = 'https://x.com/ebi/status/2104891831091925063'

function XPostsSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading frame={frame} kicker="2026年9月29日の私のX投稿" heading="この話です" />
      <div className="paas-post">
        <img
          className="paas-post-shot"
          src="/decks/paas-ai-website-cost/x-post-2026-09-29.webp"
          alt="胡田のX投稿とスレッドのスクリーンショット"
        />
        <div className="paas-post-side">
          <Callout frame={frame} icon="🔗" label="投稿">
            <p>
              <a href={POST_URL} target="_blank" rel="noreferrer">
                x.com/ebi/status/2104891831091925063
              </a>
            </p>
          </Callout>
          <Callout frame={frame} tone="warn" icon="💬" label="言いたかったこと">
            <p>今どきクラウドに置けば下回りはお任せ。Cloudflareの無料枠で静的サイトは捌けるし、更新はAIに頼める</p>
          </Callout>
        </div>
      </div>
    </Slide>
  )
}

function OldPictureSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading frame={frame} kicker="よくある前提" heading={'「Webサイトを作る」\nと聞いて浮かぶ流れ'} />
      <DiagramFrame frame={frame} caption="昔ながらの流れ">
        <FlowDiagram
          frame={frame}
          items={[
            { heading: 'サーバーを借りる', body: 'レンタルサーバーを月額で' },
            { heading: '業者に作ってもらう', body: 'WordPressなどで構築' },
            { heading: '保守契約を結ぶ', body: '更新・障害対応を毎月お金で', accent: true },
          ]}
        />
      </DiagramFrame>
      <Callout frame={frame} tone="warn" icon="🤔" label="その裏にある思い込み">
        <p>サイトは自社で保守するもの。人手とお金がかかり続ける</p>
      </Callout>
    </Slide>
  )
}

function RentalServerSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading
        frame={frame}
        kicker="レンタルサーバー"
        heading={'サーバー代は安い。\n重いのは「中身の面倒」'}
        lead="エックスサーバー スタンダード 月990円〜（税込・36か月契約。12か月なら月1,100円）"
      />
      <Timeline
        frame={frame}
        orientation="vertical"
        steps={[
          { label: '1', heading: '入れたWordPress・プラグインの更新' },
          { label: '2', heading: 'PHPのバージョン切り替えへの追従' },
          { label: '3', heading: '改ざん・不具合が起きたときの対応' },
        ]}
      />
      <Callout frame={frame} tone="warn" icon="🗣️" label="私の意見">
        <p>レンタルサーバーやWordPressを持ち出すこと自体が、もうオーバーヘッド</p>
      </Callout>
    </Slide>
  )
}

function PaasBigSlide({ frame }: SlideRenderContext) {
  return (
    <Slide tone="ink" center>
      <SlideHeading
        frame={frame}
        kicker="サーバーを「借りる」のをやめて"
        heading={'土台ごと任せて\n中身だけ置く\nそれが PaaS'}
        lead="→ 次のスライドで説明"
      />
    </Slide>
  )
}

function ResponsibilitySlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading
        frame={frame}
        kicker="PaaS（Platform as a Service）"
        heading={'土台は事業者任せ、\n自分は中身を置くだけ'}
      />
      <ComparisonTable
        frame={frame}
        columns={[{ label: '自社サーバー' }, { label: 'レンタルサーバー' }, { label: 'Cloudflare Pages', accent: true }]}
        rows={[
          { label: '建物・電源・機械', cells: ['自社', '業者', '事業者'] },
          { label: 'OS・Webサーバーソフト', cells: ['自社', '業者', '事業者'] },
          { label: 'SSL証明書', cells: ['自社', '業者の機能で', '事業者（自動）'] },
          { label: 'アクセス急増', cells: ['自社', 'プラン次第', '事業者'] },
          { label: '中身', cells: ['自社', '自社＋CMS更新', '自社（置くだけ）'] },
        ]}
      />
      <Callout frame={frame} icon="📝" label="注記">
        <p>一般的な例を私が整理したもの。業者・契約によって異なる</p>
      </Callout>
    </Slide>
  )
}

function EasierSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading frame={frame} kicker="Cloudflare Pages" heading={'「やらなくてよくなる」\nこと'} />
      <Timeline
        frame={frame}
        orientation="vertical"
        steps={[
          { label: '公開', heading: '変更をGitに送れば、自動でビルド・公開' },
          { label: '証明書', heading: 'SSL証明書は自動発行・自動更新' },
          { label: '攻撃', heading: '大量アクセス攻撃（DDoS）の防御が無料で付く' },
          { label: '確認', heading: '本番前の確認用URLを何個でも作れる', accent: true },
        ]}
      />
      <Callout frame={frame} icon="☁️" label="Cloudflareだけの話ではない">
        <p>AzureのStatic Web Appsなど、同じ種類のPaaSは各クラウドにある</p>
      </Callout>
    </Slide>
  )
}

function GlobalBigSlide({ frame }: SlideRenderContext) {
  return (
    <Slide tone="ink" center>
      <SlideHeading
        frame={frame}
        kicker="しかも性能が桁違い"
        heading={'世界348都市の拠点から\n配信されるサイトになる'}
        lead="CDN＝世界中の拠点から、近くの人に届ける仕組み（拠点数はCloudflare公式）"
      />
    </Slide>
  )
}

function PerformanceSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading frame={frame} kicker="比較" heading="置いた瞬間の実力が違う" />
      <ComparisonTable
        frame={frame}
        columns={[{ label: '一般的な共用レンタルサーバー' }, { label: 'Cloudflare（PaaS＋CDN）', accent: true }]}
        rows={[
          { label: '配信する場所', cells: ['契約したサーバーから', '世界348都市の拠点から'] },
          { label: '配信の回数', cells: ['他の契約者と分け合う', '静的ファイルは回数無制限'] },
          { label: '大量アクセス攻撃', cells: ['業者の対策・プラン次第', 'DDoS防御 追加料金なし'] },
          { label: 'パッチ当て', cells: ['WordPress等は自分で', '配信基盤は事業者側'] },
          { label: '通信料', cells: ['無制限の業者も多い', '転送料（egress）の追加なし'] },
          { label: 'CDN', cells: ['業者のオプション次第', '最初から込み'] },
        ]}
      />
      <Callout frame={frame} icon="📝" label="公平のために">
        <p>左列は私が整理した一般例。エックスサーバーは転送量無制限・課金なし</p>
      </Callout>
    </Slide>
  )
}

function AiSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading frame={frame} kicker="PaaS＋AI" heading={'作るのも直すのも\nAIに頼める'} />
      <DiagramFrame frame={frame} caption="更新の流れ">
        <FlowDiagram
          frame={frame}
          items={[
            { heading: '頼む', body: '「こういうサイトを作って」「この文言を直して」' },
            { heading: 'AIが作る・直す', body: 'ファイルを直してGitへ送る' },
            { heading: '自動で公開', body: 'PaaSがビルドして本番に反映', accent: true },
          ]}
        />
      </DiagramFrame>
      <Callout frame={frame} tone="good" icon="🤖" label="私の実績と意見">
        <p>連休の6日間でAIが158本の変更（PR）をマージ。人間は最初の指示だけ。人間が作るよりクオリティが高く、保守もしやすい</p>
      </Callout>
    </Slide>
  )
}

function ZeroYenSlide({ frame }: SlideRenderContext) {
  return (
    <Slide tone="ink" center>
      <SlideHeading
        frame={frame}
        kicker="では、いくらかかるのか"
        heading={'静的サイトなら\n月 0円'}
        lead="無料プランの上限内なら。独自ドメイン代は別。業務で使うときの話は後半で"
      />
    </Slide>
  )
}

function FreePlanSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading frame={frame} kicker="Cloudflare Free" heading={'静的サイトは\n無料プランで公開できる'}
        lead="ただし、下の上限の範囲内で" />
      <ComparisonTable
        frame={frame}
        columns={[{ label: 'ドメインごとのFreeプラン $0' }, { label: 'Pages 無料プランの上限', accent: true }]}
        rows={[
          { label: '1', cells: ['DNS', 'ビルド 月500回'] },
          { label: '2', cells: ['CDN（世界中から配信）', '独自ドメイン 1プロジェクト100個'] },
          { label: '3', cells: ['SSL証明書（Universal SSL）', 'ファイル 1サイト2万個・1個25MiB'] },
          { label: '4', cells: ['DDoS防御（量の上限なし）', '静的ファイルの配信は無料（Workers版で明記）'] },
        ]}
      />
    </Slide>
  )
}

function DynamicSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading frame={frame} kicker="プログラムも動かすなら" heading={'フォームやDBにも無料枠。\n超えても月5ドル〜'} />
      <ComparisonTable
        frame={frame}
        columns={[{ label: '無料枠' }, { label: 'Workers Paid', accent: true }]}
        rows={[
          { label: 'Workers', cells: ['1日10万回・1回10msの計算', '月1,000万回込み・超過は従量'] },
          { label: 'D1（DB）', cells: ['5GB', '5GB込み・超過は従量'] },
          { label: 'R2（ファイル）', cells: ['10GB-月・転送料無料', '別の枠（転送料は無料）'] },
          { label: '超えたら', cells: ['処理がエラーになる', 'アカウント単位で月5ドル〜'] },
        ]}
      />
      <Callout frame={frame} tone="good" icon="🧮" label="Cloudflare公式の計算例">
        <p>月1,500万リクエスト（8割が静的ファイル、残りは1回平均7msの計算）→ 合計 月5ドル</p>
      </Callout>
    </Slide>
  )
}

function MySetupSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading frame={frame} kicker="私の場合" heading={'私のサイトも\nここに集めている'} />
      <Timeline
        frame={frame}
        orientation="vertical"
        steps={[
          { label: '10', heading: 'Cloudflare Pagesに10プロジェクト', body: 'ebistudy.net・shogi.ebisuda.net・debate.ebisuda.net・www.hccjp.org など' },
          { label: '9/29', heading: '個人と自分の会社のWebはCloudflareを標準に', body: 'AzureはID・M365連携などの補完に回す', accent: true },
        ]}
      />
      <Callout frame={frame} icon="🧑‍💻" label="Microsoft MVPの私でも">
        <p>Webの置き場所はCloudflareを選んだ</p>
      </Callout>
    </Slide>
  )
}

function OfficialPlansSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading
        frame={frame}
        kicker="Cloudflare公式の言い分"
        heading={'止まったら困るなら\n有料で'}
        lead="SLA＝稼働率の保証。プラン表（ドメイン単位）より"
      />
      <ComparisonTable
        frame={frame}
        columns={[{ label: 'Free' }, { label: 'Pro' }, { label: 'Business', accent: true }, { label: 'Contract' }]}
        rows={[
          { label: '公式の対象', cells: ['個人・趣味（業務上重要でない）', 'プロのサイト（業務上重要でない）', 'オンラインで事業をする中小企業', '事業の中核を担う用途'] },
          { label: '月額', cells: ['$0', '$20（年払い）', '$200（年払い）', '個別見積もり'] },
          { label: 'SLA', cells: ['なし', 'なし', '100%', '100%'] },
        ]}
      />
      <Callout frame={frame} tone="warn" icon="💼" label="私の見方">
        <p>向こうも商売。でも「止まったら困るなら払ってね」は筋が通っている</p>
      </Callout>
    </Slide>
  )
}

function RealPriceSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading frame={frame} kicker="本当の金額" heading={'「業務で使うなら払う」は\n月$5でも$20でもない'} />
      <Timeline
        frame={frame}
        orientation="vertical"
        steps={[
          { label: '$5', heading: 'Workers Paid', body: 'プログラム実行の枠が増える（アカウント単位）' },
          { label: '$20', heading: 'Pro', body: '機能は増えるが、稼働率の保証（SLA）はなし' },
          { label: '$200', heading: 'Business', body: 'ここで初めてSLA 100%が付く', accent: true },
        ]}
      />
      <Callout frame={frame} tone="warn" icon="⚠️" label="Cloudflareで保証まで求めると">
        <p>ドメイン向けプランで月$200（年払い）から。Pages・Workers自体が保証の対象になるかは規約で要確認</p>
      </Callout>
    </Slide>
  )
}

function AzureSwaSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading frame={frame} kicker="Azure Static Web Apps（SWA）" heading={'Azure SWAは\n月$9で保証付き'} />
      <ComparisonTable
        frame={frame}
        columns={[{ label: 'Free（個人・趣味向け）' }, { label: 'Standard（本番向け）', accent: true }]}
        rows={[
          { label: '料金', cells: ['$0', '1アプリ 月$9（東日本）'] },
          { label: 'SLA', cells: ['なし', '99.95%（未達ならSWA料金の10〜25%をクレジット）'] },
          { label: '転送量', cells: ['月100GBまで（契約ごと）・超えると配信停止', '月100GB込み（契約ごと）・超過$0.20/GB'] },
        ]}
      />
      <Callout frame={frame} tone="good" icon="💡" label="私の見方">
        <p>Cloudflare標準の私から見ても、保証付きの業務サイトなら十分に競争力がある（Cloudflare Businessとは性格も保証条件も違う）</p>
      </Callout>
    </Slide>
  )
}

function BothTrueSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading frame={frame} kicker="どちらも事実" heading={'無料でできることと、\n払うべきこと'} />
      <ComparisonTable
        frame={frame}
        columns={[{ label: '無料でここまでできる' }, { label: 'お金を払うべき領域', accent: true }]}
        rows={[
          { label: '1', cells: ['個人なら、かなりのことができる', '無料枠を超えたプログラム処理は止まる'] },
          { label: '2', cells: ['法人サイトも特別なことをしなければ無料枠で捌ける（私の見立て）', '止まったら業務に響くサイト'] },
          { label: '3', cells: ['AIで簡単に作れて、直せる', '稼働率の保証（SLA）が要るとき'] },
        ]}
      />
      <Callout frame={frame} tone="warn" icon="💴" label="結論">
        <p>きちんと業務で使うなら、きちんとお金を払う</p>
      </Callout>
    </Slide>
  )
}

function OpinionPriceSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading frame={frame} kicker="私の意見" heading={'数百万円の見積もりに\n首をかしげてしまう'} />
      <ComparisonTable
        frame={frame}
        columns={[{ label: '分からなくもない事情' }, { label: '自分でできる人から見ると', accent: true }]}
        rows={[
          { label: '1', cells: ['さまざまなリスクへの備え', '実装は1日くらいの感覚'] },
          { label: '2', cells: ['体制の維持', 'それが数百万円の見積もりになる'] },
          { label: '3', cells: ['保守の人件費', '「情弱ぼったくり価格」に見える'] },
        ]}
      />
      <Callout frame={frame} icon="🔍" label="おすすめの見方">
        <p>見積もりの中身を「場所代・作る手間・保守・保証」に分けて見る</p>
      </Callout>
    </Slide>
  )
}

function JudgeSlide({ frame }: SlideRenderContext) {
  return (
    <Slide tone="ink" center>
      <SlideHeading
        frame={frame}
        kicker="見極めるのは"
        heading={'どこに・何のために\n何のお金を払うのか'}
        lead="その価値は「今」本当にあるか"
      />
    </Slide>
  )
}

function ChecklistSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading frame={frame} kicker="自社サイトのチェックリスト" heading={'今日確認する\n3項目'} />
      <Timeline
        frame={frame}
        orientation="vertical"
        steps={[
          { label: '1', heading: 'サイトで特別なことをしているか？', body: 'お知らせ・会社概要・採用情報だけなら、無料枠で足りることが多い' },
          { label: '2', heading: '払っているお金を分けて見たか？', body: 'サーバー代・保守契約・稼働保証。それぞれ何に対して払っているか' },
          { label: '3', heading: '止まったら困る度合いに見合っているか？', body: '業務の中心なら保証付き（Azure SWA Standard／Cloudflare Business など）', accent: true },
        ]}
      />
    </Slide>
  )
}

function ConclusionSlide({ frame }: SlideRenderContext) {
  return (
    <Slide tone="ink" center logo>
      <SlideHeading
        frame={frame}
        kicker="私の結論"
        heading={'PaaS＋AIの威力は\n本物'}
        lead="払うのは「今」価値があるものにだけ"
      />
    </Slide>
  )
}

function SourcesSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading frame={frame} kicker="Sources" heading="出典" lead="料金・上限・SLAは2026年9月30日時点" />
      <Callout frame={frame} icon="📘" label="公式ページ・規約">
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
