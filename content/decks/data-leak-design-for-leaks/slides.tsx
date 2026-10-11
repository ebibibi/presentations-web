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
  { id: 'not-new', render: (props) => <NotNewSlide {...props} /> },
  { id: 'hiding-limits', render: (props) => <HidingLimitsSlide {...props} /> },
  { id: 'replaceable', render: (props) => <ReplaceableSlide {...props} /> },
  { id: 'four-principles', render: (props) => <FourPrinciplesSlide {...props} /> },
  { id: 'key-not-number', render: (props) => <KeyNotNumberSlide {...props} /> },
  { id: 'cloud', render: (props) => <CloudSlide {...props} /> },
  { id: 'mechanism-not-location', render: (props) => <MechanismNotLocationSlide {...props} /> },
  { id: 'insurance', render: (props) => <InsuranceSlide {...props} /> },
  { id: 'checklist', render: (props) => <ChecklistSlide {...props} /> },
  { id: 'cta-outro', render: (props) => <CtaSlide {...props} /> },
]

function OpeningSlide({ frame }: SlideRenderContext) {
  return (
    <TitleSlide
      frame={frame}
      kicker="私の見解"
      heading={'情報漏洩は\n防げない'}
      lead="漏れても大丈夫な設計に変えるしかない"
      points={[
        { step: '01', heading: '昔から起きている', body: '違いは気づいているかどうかだけ' },
        { step: '02', heading: '漏れても困らない形に', body: '持たない・暗号化・早く気づく' },
        { step: '03', heading: '最後は仕組みと保険', body: 'クラウドに乗せ、被害を限定する' },
      ]}
    />
  )
}

function AnswerSlide({ frame }: SlideRenderContext) {
  return (
    <Slide center>
      <SlideHeading
        frame={frame}
        kicker="先に結論"
        heading={'情報は漏れる。\n漏れても大丈夫にしておく'}
        lead="「漏れてもいい」ではない。漏れる確率も、漏れたときの被害も、両方下げる"
      />
    </Slide>
  )
}

function NotNewSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading frame={frame} kicker="AIの攻撃が増えたから？" heading="それ以前の問題" />
      <ComparisonTable
        frame={frame}
        columns={[{ label: '多くの組織' }, { label: '対策している組織' }]}
        rows={[
          { label: '添付ファイル', cells: ['自分の権限で外部へ送れる', '禁止・チェック・上司の承認'] },
          { label: '実態', cells: ['持ち出そうと思えば持ち出せる', '全部見ると目視の形だけの承認になる'] },
        ]}
      />
      <Callout frame={frame} tone="warn" icon="👀" label="私の見方">
        <p>漏洩は昔から起きている。違いは「気づいているかどうか」だけ</p>
      </Callout>
    </Slide>
  )
}

function HidingLimitsSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading
        frame={frame}
        kicker="隠し通せるか？"
        heading={'「隠す」で守るには\n限界がある'}
        lead="プライバシーは守る。でも「全部漏れる」前提で考えておく"
      />
      <ComparisonTable
        frame={frame}
        columns={[{ label: '実際どうなっているか', accent: true }]}
        rows={[
          { label: '名簿・連絡網・電話帳', cells: ['名前・住所・電話番号は昔から調べれば分かった'] },
          { label: 'マイナンバー', cells: ['「知られるな」と言いつつ会社などに提出する'] },
          { label: '手本はクレジットカード', cells: ['止めて再発行でき、不正利用は条件付きで補償がある'] },
        ]}
      />
      <Callout frame={frame} tone="warn" icon="🧩" label="ただし昔と違うのは「名寄せ」の規模">
        <p>バラバラに漏れた情報がつなぎ合わされ、AIで一瞬で使える形になる。だから責任は「集める側」が持たないこと</p>
      </Callout>
    </Slide>
  )
}

function ReplaceableSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading
        frame={frame}
        kicker="クレジットカードが強い理由"
        heading={'漏れても「取り替えられる」\nかどうか'}
      />
      <ComparisonTable
        frame={frame}
        columns={[{ label: '取り替えられる', accent: true }, { label: '取り替えられない' }]}
        rows={[
          { label: '例', cells: ['カード番号・パスワード・鍵', '氏名・生年月日・住所・顔・病歴'] },
          { label: '漏れたら', cells: ['止めて新しくすれば守れる', 'あとから取り戻せない'] },
          { label: '守り方', cells: ['取り替えやすい仕組みにしておく', 'そもそも持たない・集めない'] },
        ]}
      />
    </Slide>
  )
}

function FourPrinciplesSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading frame={frame} kicker="漏れても大丈夫にする" heading="5つの方針" lead="＋ 攻撃される面（アタックサーフェス）を減らし続ける" />
      <Timeline
        frame={frame}
        orientation="vertical"
        steps={[
          { label: '1', heading: '持たない', body: 'そもそも危ない情報を保持しない' },
          { label: '2', heading: '暗号化する', body: '鍵を持つ人しか開けない形で持つ' },
          { label: '3', heading: 'パスワードをやめる', body: 'ID＋パスワードは破綻する前提で、パスキーへ' },
          { label: '4', heading: 'いつでも戻せる', body: 'PCは初期化できる状態に。データはクラウド＋バックアップ' },
          { label: '5', heading: '早く気づく', body: 'ログ・監視・持ち出しの検知。差は「気づいているかどうか」', accent: true },
        ]}
      />
    </Slide>
  )
}

function KeyNotNumberSlide({ frame }: SlideRenderContext) {
  return (
    <Slide center>
      <SlideHeading frame={frame} kicker="本人確認の本質" heading={'「番号」ではなく\n「鍵」'} />
      <ComparisonTable
        frame={frame}
        columns={[{ label: '本質ではない' }, { label: '本質', accent: true }]}
        rows={[
          { label: '例', cells: ['カード券面の番号・パスワード', 'カードのICチップの鍵・パスキー'] },
          { label: '漏れたら', cells: ['知っていれば通ってしまう', '鍵の入ったカードや端末がないと通らない'] },
        ]}
      />
    </Slide>
  )
}

function CloudSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading frame={frame} kicker="人間はダメ" heading={'だから人間に頼らない\n仕組みに乗る'} />
      <DiagramFrame
        frame={frame}
        caption="私のおすすめ"
        note="事業者の社員でも顧客データに勝手に触れにくい仕組みと監査がある。ただしクラウドの漏洩の多くは利用者側の設定ミス。だから推奨に追従し続ける"
      >
        <FlowDiagram
          frame={frame}
          items={[
            { heading: 'クラウドに置く', body: '改ざん防止・自動暗号化がそろっている' },
            { heading: '機能を使う', body: 'セキュリティ機能を有効にする' },
            { heading: '推奨に追従', body: 'メーカーの推奨設定にAIなどで自動で合わせる', accent: true },
          ]}
        />
      </DiagramFrame>
    </Slide>
  )
}

function MechanismNotLocationSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading frame={frame} kicker="クラウドかオンプレか？" heading={'場所ではなく\n「仕組み」の話'} />
      <ComparisonTable
        frame={frame}
        columns={[{ label: 'オンプレ＋クラウドの技術' }, { label: 'メガクラウドに置く', accent: true }]}
        rows={[
          { label: '例', cells: ['Azure Arc でオンプレのサーバーをクラウドから管理', 'データそのものをクラウドに置く'] },
          { label: '守り', cells: ['ポリシー・更新・脅威検知をクラウドと同じ仕組みで', '同じ仕組み＋事業者の内部統制'] },
          { label: '場所の分散', cells: ['世界中に拠点を持つのは一企業では難しい', '複数リージョンへ簡単に複製できる'] },
        ]}
      />
      <Callout frame={frame} icon="💡" label="私のおすすめ">
        <p>どこに置くにしても、守りはクラウドの仕組みに乗せる</p>
      </Callout>
    </Slide>
  )
}

function InsuranceSlide({ frame }: SlideRenderContext) {
  return (
    <Slide center>
      <SlideHeading frame={frame} kicker="それでも本気で狙われたら" heading="人は騙される" />
      <Callout frame={frame} icon="🛟" label="最後の備え">
        <p>被害を限定できる「保険」をかけておく</p>
      </Callout>
      <Callout frame={frame} tone="warn" icon="⚠️" label="保険が戻すのはお金だけ">
        <p>信用やプライバシーは戻らない。だから本体はここまでの対策</p>
      </Callout>
    </Slide>
  )
}

function ChecklistSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading frame={frame} kicker="チェックリスト（私の提案）" heading="今日から変える3つの前提" />
      <Timeline
        frame={frame}
        orientation="vertical"
        steps={[
          { label: '1', heading: '漏洩・侵害は「起きる」前提で考える', body: '気づける仕組み（ログ・監視）を持つ' },
          { label: '2', heading: '漏れても困らない形にする', body: '取り替えられない情報は持たない。残りは暗号化・パスキー', accent: true },
          { label: '3', heading: '守りはクラウドの仕組みに乗せる', body: 'オンプレも Azure Arc などで。最後は保険で被害を限定する' },
        ]}
      />
    </Slide>
  )
}
