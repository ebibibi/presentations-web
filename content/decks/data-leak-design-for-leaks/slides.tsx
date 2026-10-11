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
  { id: 'four-principles', render: (props) => <FourPrinciplesSlide {...props} /> },
  { id: 'key-not-number', render: (props) => <KeyNotNumberSlide {...props} /> },
  { id: 'cloud', render: (props) => <CloudSlide {...props} /> },
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
        { step: '02', heading: '漏れても困らない形に', body: '持たない・暗号化・パスキー' },
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
        lead="システムは侵入される。データは持ち出される。それを前提に対策を組み立てる"
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
    </Slide>
  )
}

function FourPrinciplesSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading frame={frame} kicker="漏れても大丈夫にする" heading="4つの方針" lead="＋ 攻撃される面（アタックサーフェス）を減らし続ける" />
      <Timeline
        frame={frame}
        orientation="vertical"
        steps={[
          { label: '1', heading: '持たない', body: 'そもそも危ない情報を保持しない' },
          { label: '2', heading: '暗号化する', body: '鍵を持つ人しか開けない形で持つ' },
          { label: '3', heading: 'パスワードをやめる', body: 'ID＋パスワードは破綻する前提で、パスキーへ', accent: true },
          { label: '4', heading: 'いつでも戻せる', body: 'PCは初期化できる状態に。データはクラウド＋バックアップ' },
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
        note="AWS・GCP・Azure は、事業者の社員でも顧客データに勝手に触れにくい仕組みと監査を持つ。自前で同じことをするのは無理"
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

function InsuranceSlide({ frame }: SlideRenderContext) {
  return (
    <Slide center>
      <SlideHeading frame={frame} kicker="それでも本気で狙われたら" heading="人は騙される" />
      <Callout frame={frame} icon="🛟" label="最後の備え">
        <p>被害を限定できる「保険」をかけておく</p>
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
          { label: '1', heading: '漏洩・侵害は「起きる」前提で考える', body: '気づいていないだけ、を疑う' },
          { label: '2', heading: '漏れても困らない形にする', body: '持たない・暗号化・パスキー', accent: true },
          { label: '3', heading: '守りはクラウドの仕組みに乗せる', body: '最後は保険で被害を限定する' },
        ]}
      />
    </Slide>
  )
}
