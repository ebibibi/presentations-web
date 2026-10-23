/* eslint-disable react-refresh/only-export-components */
import type { SlideModule, SlideRenderContext } from '../../../src/types'
import {
  Callout,
  ComparisonTable,
  CtaSlide,
  DiagramFrame,
  FlowDiagram,
  Quote,
  Slide,
  SlideHeading,
  Timeline,
  TitleSlide,
} from '../../../src/slide-kit'

export const slides: SlideModule['slides'] = [
  { id: 'opening', render: (props) => <OpeningSlide {...props} /> },
  { id: 'cta-intro', render: (props) => <CtaSlide {...props} /> },
  { id: 'confession', render: (props) => <ConfessionSlide {...props} /> },
  { id: 'cant-notice', render: (props) => <CantNoticeSlide {...props} /> },
  { id: 'evidence', render: (props) => <EvidenceSlide {...props} /> },
  { id: 'ncsc', render: (props) => <NcscSlide {...props} /> },
  { id: 'report-paradox', render: (props) => <ReportParadoxSlide {...props} /> },
  { id: 'one-click', render: (props) => <OneClickSlide {...props} /> },
  { id: 'punishment', render: (props) => <PunishmentSlide {...props} /> },
  { id: 'real-fix', render: (props) => <RealFixSlide {...props} /> },
  { id: 'checklist', render: (props) => <ChecklistSlide {...props} /> },
  { id: 'sources', render: (props) => <SourcesSlide {...props} /> },
  { id: 'cta-outro', render: (props) => <CtaSlide {...props} /> },
]

const SOURCES = [
  {
    label: 'Understanding the Efficacy of Phishing Training in Practice（IEEE S&P 2025, UC San Diego）',
    url: 'https://sysnet.ucsd.edu/~voelker/pubs/phishtrain-oakland25.pdf',
  },
  {
    label: 'Cybersecurity training programs don’t prevent employees from falling for phishing scams（UC San Diego Today）',
    url: 'https://today.ucsd.edu/story/cybersecurity-training-programs-dont-prevent-employees-from-falling-for-phishing-scams',
  },
  {
    label: 'Phishing attacks: defending your organisation（NCSC）',
    url: 'https://www.ncsc.gov.uk/guidance/phishing',
  },
  {
    label: 'Conditional Access authentication strengths（Microsoft Learn）',
    url: 'https://learn.microsoft.com/entra/identity/authentication/concept-authentication-strengths',
  },
  {
    label: 'Use the built-in Report button in Outlook（Microsoft Learn）',
    url: 'https://learn.microsoft.com/defender-office-365/submissions-outlook-report-messages',
  },
  {
    label: 'User reported settings（Microsoft Learn）',
    url: 'https://learn.microsoft.com/defender-office-365/submissions-user-reported-messages-custom-mailbox',
  },
]

function OpeningSlide({ frame }: SlideRenderContext) {
  return (
    <TitleSlide
      frame={frame}
      kicker="「怪しいと思ったら報告」はもう通用しない"
      heading={'標的型メール訓練は\n守っているふり'}
      lead="先にやるべきは、フィッシング耐性のある認証の強制"
      points={[
        { step: '01', heading: '気づけない', body: '巧妙な標的型は人間には見抜けない' },
        { step: '02', heading: '効かない', body: '約2万人の実験で効果はほぼゼロ' },
        { step: '03', heading: '先にやること', body: 'だまされても被害が出ない認証' },
      ]}
    />
  )
}

function ConfessionSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading
        frame={frame}
        kicker="正直に言います"
        heading={'報告しなかったら\nトレーニング送り'}
      />
      <Timeline
        frame={frame}
        orientation="vertical"
        steps={[
          { label: '1', heading: '訓練メールが届く', body: 'どう見ても訓練。気づいたのでスルー' },
          { label: '2', heading: '「報告しなかったので受講してください」', body: '見抜いたかではなく、報告したかで判定' },
          { label: '3', heading: '催促メールをフィッシングとして報告', body: '権威・期限・リンク。手口がそっくりだったので', accent: true },
          { label: '4', heading: 'トレーニングは受けました', body: 'そして、この動画を撮っています' },
        ]}
      />
    </Slide>
  )
}

function CantNoticeSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading
        frame={frame}
        kicker="主張 1"
        heading={'巧妙な標的型は\nそもそも気づけない'}
        lead="気づけないから「標的型攻撃」として成立している"
      />
      <ComparisonTable
        frame={frame}
        columns={[{ label: '昔の手がかり' }, { label: '今の攻撃', accent: true }]}
        rows={[
          { label: '文面', cells: ['不自然な日本語・誤字', 'AIで自然。取引先の口調も真似る'] },
          { label: '送信元', cells: ['見知らぬアドレス', '乗っ取った本物のアカウント'] },
          { label: 'ログイン画面', cells: ['見た目がおかしい偽サイト', '本物の画面を中継（AiTM）'] },
        ]}
      />
    </Slide>
  )
}

function EvidenceSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading
        frame={frame}
        kicker="根拠 ─ IEEE S&P 2025"
        heading={'約2万人・8か月の実験で\n訓練の効果はほぼゼロ'}
        lead="UC San Diego Health の従業員 19,500人超、訓練メール10種類"
      />
      <ComparisonTable
        frame={frame}
        columns={[{ label: '結果', accent: true }]}
        rows={[
          { label: '年1回の研修', cells: ['受講の有無と引っかかり率に有意な関係なし'] },
          { label: '引っかかった直後の研修', cells: ['改善は約2%だけ'] },
          { label: '研修ページ', cells: ['3分の1はすぐ閉じ、75%は1分以内'] },
          { label: '8か月後', cells: ['半数以上が少なくとも1回クリック'] },
        ]}
      />
    </Slide>
  )
}

function NcscSlide({ frame }: SlideRenderContext) {
  return (
    <Slide center>
      <SlideHeading frame={frame} kicker="英国の国家サイバーセキュリティセンター" heading={'公的機関も\n同じことを言っている'} />
      <Quote
        frame={frame}
        quote="No training package, including phishing simulations, can teach users to spot every phishing attempt."
        source="NCSC ─ Phishing attacks: defending your organisation"
      />
      <Callout frame={frame} icon="🇯🇵" label="訳">
        <p>訓練メールを含め、どんな研修でも、すべてのフィッシングを見抜けるようにはならない。</p>
      </Callout>
    </Slide>
  )
}

function ReportParadoxSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading
        frame={frame}
        kicker="主張 2"
        heading={'「気づいたら報告」は\n動作として矛盾している'}
      />
      <ComparisonTable
        frame={frame}
        columns={[{ label: '人が気づける攻撃' }, { label: '本当に危ない攻撃', accent: true }]}
        rows={[
          { label: '中身', cells: ['雑な文面・怪しい送信元', '本物のスレッド・本物の画面'] },
          { label: '報告', cells: ['集まる', '気づけないので集まらない'] },
          { label: '価値', cells: ['フィルターでも止まる', '一番知りたいのはこっち'] },
        ]}
      />
      <Callout frame={frame} tone="warn" icon="🤔" label="そもそも">
        <p>「標的型かどうか」は、同じメールが何人に届いたかを見られる側にしか判定できない。</p>
      </Callout>
    </Slide>
  )
}

function OneClickSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading
        frame={frame}
        kicker="主張 3"
        heading={'やるなら\nM365の標準ボタン1つで'}
        lead="Outlook の「報告」ボタンは最初から付いている"
      />
      <ComparisonTable
        frame={frame}
        columns={[{ label: '手入力のフォーム' }, { label: 'Outlook の報告ボタン', accent: true }]}
        rows={[
          { label: '手間', cells: ['送信者・件名・日時を書き写す', 'クリック1回'] },
          { label: '届くもの', cells: ['人が写したテキスト', 'ヘッダーごとのメール本体'] },
          { label: '届く先', cells: ['担当者の受信箱', '指定のメールボックスとMicrosoft'] },
          { label: 'その後', cells: ['人が読んで判断', '調査・一括削除につなげられる'] },
        ]}
      />
    </Slide>
  )
}

function PunishmentSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading
        frame={frame}
        kicker="主張 4"
        heading={'罰の研修が\n人を攻撃に弱くする'}
        lead="「報告しなかったので受講を」はフィッシングと同じ形"
      />
      <ComparisonTable
        frame={frame}
        columns={[{ label: 'フィッシングの手口' }, { label: '受講の催促メール', accent: true }]}
        rows={[
          { label: '権威', cells: ['情シスや管理部門をかたる', '情報セキュリティの部署から'] },
          { label: '不安', cells: ['あなたに問題があります', 'あなたは報告しませんでした'] },
          { label: '期限', cells: ['○日までに対応を', '○日までに受講を'] },
          { label: '行動', cells: ['リンクからサインイン', 'リンクからサインイン'] },
        ]}
      />
      <Callout frame={frame} tone="warn" icon="⚠️" label="NCSC">
        <p>罰を恐れる人はミスを報告しない、と明記されている。</p>
      </Callout>
    </Slide>
  )
}

function RealFixSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading
        frame={frame}
        kicker="本命"
        heading={'だまされても\n被害が出ない認証へ'}
        lead="パスキー・FIDO2・Windows Hello for Business"
      />
      <DiagramFrame
        frame={frame}
        caption="偽サイトに誘導されても"
        note="鍵がサインイン先のドメインに紐づくので、偽のドメインでは認証が成立しない"
      >
        <FlowDiagram
          frame={frame}
          items={[
            { heading: '偽のログイン画面', body: '本物そっくりでも' },
            { heading: 'パスキー', body: 'ドメインが違うので応答しない' },
            { heading: '盗めるものがない', body: 'パスワードもトークンも渡らない', accent: true },
          ]}
        />
      </DiagramFrame>
      <Callout frame={frame} tone="good" icon="🔐" label="Entra ID でやること">
        <p>条件付きアクセスで、認証強度「フィッシング耐性のある MFA」を要求する。</p>
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
          {
            label: '1',
            heading: 'フィッシング耐性のある MFA を強制しているか',
            body: 'まず管理者から。条件付きアクセスの認証強度で',
            accent: true,
          },
          { label: '2', heading: '報告はボタン1つで済むか', body: 'Outlook の標準の報告ボタンを有効にする' },
          { label: '3', heading: '報告した人を責めていないか', body: '罰ではなく「ありがとう」を返す' },
        ]}
      />
    </Slide>
  )
}

function SourcesSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading frame={frame} kicker="Sources" heading="出典" lead="2026年10月23日時点で確認" />
      <Callout frame={frame} icon="📘" label="研究・公式ページ">
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
