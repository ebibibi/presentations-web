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
  { id: 'facts', render: (props) => <FactsSlide {...props} /> },
  { id: 'confession', render: (props) => <ConfessionSlide {...props} /> },
  { id: 'timeline', render: (props) => <TimelineSlide {...props} /> },
  { id: 'mechanism', render: (props) => <MechanismSlide {...props} /> },
  { id: 'self-check', render: (props) => <SelfCheckSlide {...props} /> },
  { id: 'scopes', render: (props) => <ScopesSlide {...props} /> },
  { id: 'mfa', render: (props) => <MfaSlide {...props} /> },
  { id: 'disagreement', render: (props) => <DisagreementSlide {...props} /> },
  { id: 'checklist', render: (props) => <ChecklistSlide {...props} /> },
  { id: 'closing', render: (props) => <ClosingSlide {...props} /> },
  { id: 'cta-outro', render: (props) => <CtaSlide {...props} /> },
]

const SOURCES = [
  {
    label: 'Enclave: AuthMask: We Made Microsoft Authenticator Hand Over Tokens to an App With Zero Permissions',
    url: 'https://enclave.ai/blog/authmask-we-made-microsoft-authenticator-hand-over-tokens',
  },
  {
    label: 'Microsoft セキュリティ更新ガイド: CVE-2026-80097',
    url: 'https://msrc.microsoft.com/update-guide/vulnerability/CVE-2026-80097',
  },
]

function OpeningSlide({ frame }: SlideRenderContext) {
  return (
    <TitleSlide
      frame={frame}
      kicker="CVE-2026-80097｜AuthMask"
      heading={'Authenticatorが\n偽Teamsに\nトークンを渡した'}
      lead="Android版は 6.2606.4246 以上へ"
      points={[
        { step: '01', heading: '権限ゼロのアプリで', body: '「私は Teams です」と名乗るだけ' },
        { step: '02', heading: 'MFA の後ろが抜けた', body: 'アクセス／リフレッシュトークンを平文で返す' },
        { step: '03', heading: '今日やること', body: '利用者と管理者に分けて' },
      ]}
    />
  )
}

function FactsSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading frame={frame} kicker="Microsoft セキュリティ更新ガイドより" heading="事実だけ先に" />
      <ComparisonTable
        frame={frame}
        columns={[{ label: 'CVE-2026-80097', accent: true }]}
        rows={[
          { label: '対象', cells: ['Microsoft Authenticator for Android（iOS版は対象外）'] },
          { label: '影響', cells: ['6.0.0 以上 6.2606.4246 未満'] },
          { label: '修正', cells: ['6.2606.4246（Google Play で配信）'] },
          { label: '深刻度', cells: ['CVSS 8.6／Important／特権の昇格（CWE-287）'] },
          { label: '公開', cells: ['2026年9月8日（9月15日にビルド番号を訂正）'] },
          { label: '悪用', cells: ['公開時点では未確認。10月に技術詳細が公開'] },
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
      <Callout frame={frame} tone="warn" icon="🔑" label="Authenticator には顔が2つある">
        <p>MFA の通知アプリであり、Android では他の Microsoft アプリにトークンを配る「認証ブローカー」でもある。今回壊れたのは後者</p>
      </Callout>
    </Slide>
  )
}

function TimelineSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading frame={frame} kicker="2026年・Android" heading={'トークン系の穴が\n続いている'} />
      <ComparisonTable
        frame={frame}
        columns={[{ label: '番号' }, { label: '何が起きたか' }]}
        rows={[
          { label: '3月', cells: ['CVE-2026-26123（5.5）', 'サインイン用のリンクを偽アプリが受け取る'] },
          { label: '5月', cells: ['CVE-2026-41615（9.6）', '承認させたリクエストでトークンを外へ送らせる'] },
          { label: '6月', cells: ['Office 系アプリ', '本番に残ったデバッグフラグで他アプリへトークン'] },
          { label: '9月', cells: ['CVE-2026-80097（8.6）', 'Authenticator のブローカーが偽アプリへトークン'] },
          { label: '10月', cells: ['AuthMask 公開', 'Enclave が手順とコードを公開'] },
        ]}
      />
    </Slide>
  )
}

function MechanismSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading frame={frame} kicker="仕組み" heading="名乗った名前を信じた" />
      <DiagramFrame
        frame={frame}
        caption="Enclave の検証の流れ"
        note="呼び出し元の UID・パッケージ名・リダイレクトURI・スコープは、すべて呼び出し側が書いた値"
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
      kicker="署名チェックはあった"
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
      <SlideHeading frame={frame} kicker="Enclave が得たトークン" heading={'名乗る相手を変えれば\n取れる権限も変わる'} />
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

function MfaSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading frame={frame} kicker="MFA は回避されたのではなく" heading={'MFA を通った\n「あと」が渡された'} />
      <Timeline
        frame={frame}
        steps={[
          { label: '1', heading: 'サインイン', body: 'MFA はここ' },
          { label: '2', heading: 'トークン発行', body: 'ブローカーが保持' },
          { label: '3', heading: '偽アプリへ', body: '更新用も一緒に', accent: true },
          { label: '4', heading: '取り直せる', body: '期限後も更新' },
        ]}
      />
      <Callout frame={frame} icon="💡" label="だから「MFA があるから大丈夫」は成り立たない">
        <p>MFA は入口の鍵。今回抜けたのは、鍵を開けたあとに配る通行証の受け渡し</p>
      </Callout>
    </Slide>
  )
}

function DisagreementSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading frame={frame} kicker="ここは説明が分かれている" heading={'必要なユーザー操作は\nどこまでか'} />
      <ComparisonTable
        frame={frame}
        columns={[{ label: 'Microsoft（FAQ・CVSS）' }, { label: 'Enclave（検証記事）' }]}
        rows={[
          {
            label: '前提',
            cells: ['悪意あるアプリを入れて実行させる', 'サインイン済みの職場アカウントがある'],
          },
          {
            label: '操作',
            cells: ['Authenticator で認証フローを完了するよう説得（UI:R）', 'ブローカーがあるだけで、それ以上の操作は不要だった'],
          },
        ]}
      />
      <Callout frame={frame} tone="good" icon="✅" label="どちらでも同じ結論">
        <p>入口は「悪意あるアプリが端末にあること」。更新と、野良アプリを入れないことの両方が要る</p>
      </Callout>
    </Slide>
  )
}

function ChecklistSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading frame={frame} kicker="チェックリスト（管理者向けは私の提案）" heading="今日やること" />
      <ComparisonTable
        frame={frame}
        columns={[{ label: '利用者', accent: true }, { label: '管理者' }]}
        rows={[
          {
            label: '1',
            cells: ['Play ストアで Authenticator を更新', 'Intune の管理対象 Google Play で更新を高優先度に'],
          },
          {
            label: '2',
            cells: ['アプリ情報で 6.2606.4246 以上か確認', 'アプリのインベントリで版を確認（非管理の BYOD は周知で補う）'],
          },
          {
            label: '3',
            cells: ['ストア外のアプリを入れない・見覚えのないアプリを消す', '疑わしければ非対話型サインインを確認→セッション取り消し→認証方法（パスキー）を見直す'],
          },
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
        lead="MFA を通ったあとのトークンを、誰が持ち、誰に渡すか"
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
