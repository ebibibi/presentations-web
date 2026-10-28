/* eslint-disable react-refresh/only-export-components */
import type { SlideModule, SlideRenderContext } from '../../../src/types'
import {
  Callout,
  CodeSlide,
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
  { id: 'confession', render: (props) => <ConfessionSlide {...props} /> },
  { id: 'overview', render: (props) => <OverviewSlide {...props} /> },
  { id: 'hole-1', render: (props) => <HoleOneSlide {...props} /> },
  { id: 'hole-2', render: (props) => <HoleTwoSlide {...props} /> },
  { id: 'hole-3', render: (props) => <HoleThreeSlide {...props} /> },
  { id: 'hole-4', render: (props) => <HoleFourSlide {...props} /> },
  { id: 'self-check', render: (props) => <SelfCheckSlide {...props} /> },
  { id: 'scopes', render: (props) => <ScopesSlide {...props} /> },
  { id: 'common', render: (props) => <CommonSlide {...props} /> },
  { id: 'versions', render: (props) => <VersionsSlide {...props} /> },
  { id: 'user-actions', render: (props) => <UserActionsSlide {...props} /> },
  { id: 'admin-actions', render: (props) => <AdminActionsSlide {...props} /> },
  { id: 'closing', render: (props) => <ClosingSlide {...props} /> },
  { id: 'cta-outro', render: (props) => <CtaSlide {...props} /> },
]

const SOURCES = [
  {
    label: 'Microsoft セキュリティ更新ガイド（CVE-2026-26123 / 41615 / 41100 / 41101 / 41102 / 42832 / 80097）',
    url: 'https://msrc.microsoft.com/update-guide/vulnerability/CVE-2026-80097',
  },
  {
    label: 'Enclave: FlagLeft（Office 系 Android アプリのデバッグフラグ）',
    url: 'https://enclave.ai/blog/flagleft-microsoft-365-android-forgotten-flag-account-takeover',
  },
  {
    label: 'Enclave: AuthMask（Authenticator が偽 Teams にトークンを渡した件）',
    url: 'https://enclave.ai/blog/authmask-we-made-microsoft-authenticator-hand-over-tokens',
  },
]

function OpeningSlide({ frame }: SlideRenderContext) {
  return (
    <TitleSlide
      frame={frame}
      kicker="2026年・Authenticator と Office の Android 版"
      heading={'スマホの Microsoft アプリ\n今年4回の\n「横取りされる穴」'}
      lead="利用者がやることは4つ。まず自動更新"
      points={[
        { step: '01', heading: '4件の穴', body: '3月・5月・6月・9月' },
        { step: '02', heading: '共通点', body: 'MFA を通った「あと」が渡る' },
        { step: '03', heading: 'やること', body: '利用者4つ・管理者向けも' },
      ]}
    />
  )
}

function AnswerSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading frame={frame} kicker="答えを先に" heading="結局やることは4つ" />
      <Timeline
        frame={frame}
        orientation="vertical"
        steps={[
          { label: '1', heading: '自動更新をオンにして最新版へ', body: 'Authenticator も Office アプリも。4件全部に効く', accent: true },
          { label: '2', heading: 'ストア外のアプリを入れない', body: '見覚えのないアプリは消す' },
          { label: '3', heading: '開くアプリは Authenticator を選ぶ', body: 'QRコード・サインインリンクを開くとき' },
          { label: '4', heading: '身に覚えのない承認は押さない', body: '自分で始めたサインインだけ承認する' },
        ]}
      />
    </Slide>
  )
}

function ConfessionSlide({ frame }: SlideRenderContext) {
  return (
    <Slide center>
      <SlideHeading
        frame={frame}
        kicker="正直に言うと"
        heading={'「MFA は\nAuthenticator で」と\n勧めてきた側です'}
      />
      <Callout frame={frame} tone="warn" icon="🔑" label="スマホのアプリはトークンを融通し合っている">
        <p>Authenticator は MFA の通知アプリであり、ほかの Microsoft アプリにトークンを配る係でもある。今年壊れたのは、その受け渡しの部分</p>
      </Callout>
    </Slide>
  )
}

function OverviewSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading frame={frame} kicker="Microsoft セキュリティ更新ガイドより" heading="4件の一覧" />
      <ComparisonTable
        frame={frame}
        columns={[{ label: '対象' }, { label: '何が起きたか' }]}
        rows={[
          { label: '3月 26123', cells: ['Authenticator（Android・iOS）', 'QR・リンクのサインイン情報を偽アプリが受け取る'] },
          { label: '5月 41615', cells: ['Authenticator（Android・iOS）', '承認させたトークンを攻撃者へ送らせる'] },
          { label: '6月 FlagLeft', cells: ['Word・Excel など6アプリ（Android）', '消し忘れたデバッグフラグで他アプリへトークン'] },
          { label: '9月 80097', cells: ['Authenticator（Android）', '偽 Teams を名乗るアプリへトークン'] },
        ]}
      />
      <Callout frame={frame} tone="good" icon="✅" label="4件とも修正済み・公開時点で悪用は未確認">
        <p>ただし6月と9月の件は、研究者が手順まで公開している</p>
      </Callout>
    </Slide>
  )
}

function HoleOneSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading frame={frame} kicker="3月｜CVE-2026-26123（CVSS 5.5）" heading="QRコードとリンクの横取り" />
      <DiagramFrame frame={frame} caption="Microsoft の説明" note="修正: Android 6.2511.7533／iOS 6.8.40">
        <FlowDiagram
          frame={frame}
          items={[
            { heading: 'QR・リンク', body: 'サインインを始める' },
            { heading: '開くアプリは？', body: '偽アプリも候補に出る' },
            { heading: '偽アプリを選ぶ', body: 'うっかり選んでしまう', accent: true },
            { heading: '横取り', body: 'サインインコードが渡る' },
          ]}
        />
      </DiagramFrame>
    </Slide>
  )
}

function HoleTwoSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading frame={frame} kicker="5月｜CVE-2026-41615（CVSS 9.6）" heading={'承認したら\nトークンが外へ'} />
      <Timeline
        frame={frame}
        steps={[
          { label: '1', heading: '偽の要求', body: '本物に見える' },
          { label: '2', heading: '承認する', body: '中身は示されない', accent: true },
          { label: '3', heading: 'トークン取得', body: '職場アカウント' },
          { label: '4', heading: '外へ送信', body: '攻撃者の管理先' },
        ]}
      />
      <Callout frame={frame} icon="📌" label="技術的な詳細は非公開">
        <p>Microsoft の FAQ が説明する流れ。修正: Android 6.2605.2973／iOS 6.8.47</p>
      </Callout>
    </Slide>
  )
}

function HoleThreeSlide({ frame }: SlideRenderContext) {
  return (
    <CodeSlide
      frame={frame}
      kicker="6月｜Enclave「FlagLeft」（CVE-2026-41100 ほか）"
      heading={'消し忘れた\nデバッグフラグ'}
      lead="Word・Excel・PowerPoint・OneNote・Loop・M365 Copilot"
      caption="Android 版の本番ビルド"
      lines={[
        { kind: 'comment', body: '開発用の設定が本番に残っていた' },
        { kind: 'output', body: 'setIsDebugMode(true)' },
        { kind: 'comment', body: '→ 信頼しないアプリを拒む検査が飛ぶ' },
      ]}
    >
      <Callout frame={frame} tone="warn" icon="🚩" label="権限も操作も要らなかった">
        <p>同じ端末のアプリがトークンを要求するだけで渡った。長く使い回せる種類のトークン</p>
      </Callout>
      <Callout frame={frame} icon="🔧" label="修正版">
        <p>16.0.19822.20190（5月12日）</p>
      </Callout>
    </CodeSlide>
  )
}

function HoleFourSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading frame={frame} kicker="9月｜CVE-2026-80097（CVSS 8.6）・Enclave「AuthMask」" heading={'偽 Teams に\nトークンを渡した'} />
      <DiagramFrame
        frame={frame}
        caption="Enclave の検証の流れ"
        note="修正: Android 6.2606.4246（iOS は対象外）"
      >
        <FlowDiagram
          frame={frame}
          items={[
            { heading: '偽アプリ', body: '権限ゼロで「私は Teams」' },
            { heading: '受付画面', body: 'どのアプリからも起動できた' },
            { heading: '検査', body: '申告どおりか？→通る' },
            { heading: 'トークン', body: '偽アプリへ平文で', accent: true },
          ]}
        />
      </DiagramFrame>
    </Slide>
  )
}

function SelfCheckSlide({ frame }: SlideRenderContext) {
  return (
    <CodeSlide
      frame={frame}
      kicker="9月の穴｜署名チェックはあった"
      heading={'自分で自分を\n確かめていた'}
      lead="本当の呼び出し元は分かっていたのに、使わなかった"
      caption="Enclave の記事より抜粋"
      lines={[
        { kind: 'comment', body: '申告されたパッケージの署名から URI を作る' },
        { kind: 'output', body: 'brokerRedirectUri = getBrokerRedirectUri(ctx, claimedPackage)' },
        { kind: 'comment', body: '申告された URI と比べる' },
        { kind: 'output', body: 'return equalsIgnoreCase(claimedRedirect, brokerRedirectUri)' },
      ]}
    >
      <Callout frame={frame} tone="warn" icon="🪞" label="必ず通る検査">
        <p>本物の Teams の署名は誰でも読める。偽アプリも同じ URI を作って送れる</p>
      </Callout>
    </CodeSlide>
  )
}

function ScopesSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading frame={frame} kicker="9月の穴｜Enclave が得たトークン" heading={'名乗る相手を変えれば\n取れる権限も変わる'} />
      <ComparisonTable
        frame={frame}
        columns={[{ label: '取れた主な権限' }]}
        rows={[
          { label: 'Teams として Graph へ', cells: ['メール読み書き・送信、ファイル、予定表、チャット送信、SharePoint'] },
          { label: 'Teams のチャット基盤へ', cells: ['user_impersonation（本人として操作）'] },
          { label: 'Authenticator 自身として', cells: ['認証方法の読み書き、パスキーの作成・削除'] },
        ]}
      />
      <Callout frame={frame} tone="warn" icon="🗝️" label="いちばん怖いのは最後の行（私の見立て）">
        <p>認証方法を書き換えられるなら、トークンが切れたあとも入り直す足場になりうる。記事が実証したのはスコープの取得まで</p>
      </Callout>
    </Slide>
  )
}

function CommonSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading frame={frame} kicker="4件を並べると" heading="共通点は3つ" />
      <ComparisonTable
        frame={frame}
        columns={[{ label: '4件に共通すること', accent: true }]}
        rows={[
          { label: '入口', cells: ['3件は同じ端末の悪意あるアプリ、1件は偽の承認要求'] },
          { label: '渡るもの', cells: ['MFA を通ったあとのトークンやサインインコード'] },
          { label: '効く対策', cells: ['4件すべてに効くのは、アプリを最新にすることだけ'] },
        ]}
      />
      <Callout frame={frame} icon="💡" label="だから「MFA があるから大丈夫」は成り立たない">
        <p>MFA は入口の鍵。今年抜けたのは、鍵を開けたあとに配る通行証の受け渡し</p>
      </Callout>
    </Slide>
  )
}

function VersionsSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading frame={frame} kicker="確認のしかた: 設定 → アプリ → 該当アプリ" heading="この版以上なら安全" />
      <ComparisonTable
        frame={frame}
        columns={[{ label: '安全な版', accent: true }, { label: '直る穴' }]}
        rows={[
          { label: 'Authenticator（Android）', cells: ['6.2606.4246 以上', '3月・5月・9月'] },
          { label: 'Authenticator（iOS）', cells: ['6.8.47 以上', '3月・5月'] },
          { label: 'Office 系6アプリ（Android）', cells: ['16.0.19822.20190 以上', '6月'] },
        ]}
      />
      <Callout frame={frame} icon="📱" label="Office 系6アプリ">
        <p>Word・Excel・PowerPoint・OneNote・Loop・Microsoft 365 Copilot</p>
      </Callout>
    </Slide>
  )
}

function UserActionsSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading frame={frame} kicker="チェックリスト" heading="利用者がやる4つ" />
      <ComparisonTable
        frame={frame}
        columns={[{ label: 'やること', accent: true }, { label: '塞ぐ穴' }]}
        rows={[
          { label: '1', cells: ['自動更新をオンにして最新版にする', '4件すべて'] },
          { label: '2', cells: ['ストア外のアプリを入れない・見覚えのないアプリを消す', '3月・6月・9月'] },
          { label: '3', cells: ['QR・リンクを開くアプリを聞かれたら Authenticator を選ぶ', '3月'] },
          { label: '4', cells: ['自分で始めていないサインインや承認は押さない', '5月'] },
        ]}
      />
    </Slide>
  )
}

function AdminActionsSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading frame={frame} kicker="管理者向け（私の提案。Microsoft の公式手順ではない）" heading="管理者がやること" />
      <Timeline
        frame={frame}
        orientation="vertical"
        steps={[
          { label: '1', heading: '更新を高優先度で配る', body: 'Intune の管理対象 Google Play で Authenticator と Office アプリ', accent: true },
          { label: '2', heading: '古い版では開かせない', body: 'アプリ保護ポリシーの条件付き起動で最小バージョンを指定' },
          { label: '3', heading: '版を確かめる', body: 'アプリのインベントリで確認。管理外の BYOD は周知で補う' },
          { label: '4', heading: '疑わしければ止める', body: 'サインインログ確認 → セッション取り消し → 認証方法を見直す' },
        ]}
      />
    </Slide>
  )
}

function ClosingSlide({ frame }: SlideRenderContext) {
  return (
    <Slide center>
      <SlideHeading
        frame={frame}
        kicker="まとめ"
        heading={'MFA の「後ろ」も守る'}
        lead="通ったあとのトークンを、どのアプリが持ち、どこへ渡すか"
      />
      <Callout frame={frame} icon="📘" label="出典">
        {SOURCES.map((source) => (
          <p key={source.url}>
            <a href={source.url} target="_blank" rel="noreferrer">
              {source.label}
            </a>
          </p>
        ))}
      </Callout>
    </Slide>
  )
}
