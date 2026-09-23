/* eslint-disable react-refresh/only-export-components */
import type { SlideModule, SlideRenderContext } from '../../../src/types'
import {
  Callout,
  ComparisonTable,
  DiagramFrame,
  FlowDiagram,
  Slide,
  SlideHeading,
  Timeline,
  TitleSlide
} from '../../../src/slide-kit'

export const slides: SlideModule['slides'] = [
  { id: 'opening', render: (props) => <Opening {...props} /> },
  { id: 'premise', render: (props) => <Premise {...props} /> },
  { id: 'three-primitives', render: (props) => <Primitives {...props} /> },
  { id: 'example', render: (props) => <Example {...props} /> },
  { id: 'training', render: (props) => <Training {...props} /> },
  { id: 'performance', render: (props) => <Performance {...props} /> },
  { id: 'benchmark', render: (props) => <Benchmark {...props} /> },
  { id: 'limitations', render: (props) => <Limitations {...props} /> },
  { id: 'division', render: (props) => <Division {...props} /> },
  { id: 'outlook', render: (props) => <Outlook {...props} /> },
  { id: 'sources', render: (props) => <Sources {...props} /> }
]

function Opening({ frame }: SlideRenderContext) {
  return <TitleSlide frame={frame} kicker="TYPESAFE / SYSTEM ONE" heading={'Jevは\n「文章を書かないAI」'} lead="何がすごくて、何は新しくないのか" points={[
    { step: '01', heading: '判断はLLMでもできる', body: '新発明ではなく、設計の焦点が違う' },
    { step: '02', heading: '桁違いの速度と低価格', body: 'ただし公式値と実測を分けて読む' },
    { step: '03', heading: '結局は組み合わせる', body: '判断はJev、文章と深い推論はLLM' }
  ]} />
}

function Premise({ frame }: SlideRenderContext) {
  return <Slide><SlideHeading frame={frame} kicker="THE POINT" heading={'判断という仕事は\nLLMにもできる'} lead="分類・採点・構造化出力そのものは新しくない" />
    <ComparisonTable frame={frame} columns={[{ label: '通常のLLM' }, { label: 'Jev', accent: true }]} rows={[
      { label: 'お願い', cells: ['文章を読んでJSONで答えて', '状態と質問・選択肢を渡す'] },
      { label: '返り値', cells: ['生成した文字列を検証', '型の決まった値と確率'] },
      { label: '得意', cells: ['説明・作文・複雑な推論', '限定された判断を高速に繰り返す'] }
    ]} />
    <Callout frame={frame} label="技術的な新しさの位置" icon="💡">新しいのは「判断できる」ことではなく、判断に特化した学習・API・出力方式の組み合わせ。</Callout>
  </Slide>
}

function Primitives({ frame }: SlideRenderContext) {
  return <Slide><SlideHeading frame={frame} kicker="HOW IT WORKS" heading="入力は状態、出力は判断" lead="同じ state に複数の独立した質問をまとめて渡す" />
    <DiagramFrame frame={frame} caption="3つのプリミティブ" note="並列に答え、コード側が答えを組み立てる">
      <FlowDiagram frame={frame} items={[
        { heading: 'Choice', body: '選択肢から1つ選ぶ' },
        { heading: 'Score', body: '尺度に沿って評価する', accent: true },
        { heading: 'Noul', body: '真である確率を返す' }
      ]} />
    </DiagramFrame>
    <Callout frame={frame} tone="warn" icon="⚠️" label="重要">返り値の型が合っていても、判断そのものが正しいとは限らない。</Callout>
  </Slide>
}

function Example({ frame }: SlideRenderContext) {
  return <Slide><SlideHeading frame={frame} kicker="EXAMPLE" heading="問い合わせの一次振り分け" lead="「返金したい」の一文から、次のアクションを選ぶ" />
    <Timeline frame={frame} steps={[
      { label: '入力', heading: '顧客の文面', body: '「二重請求された。返金してほしい」' },
      { label: 'Jev', heading: '3つの判断', body: '返金希望？／問い合わせ種別？／緊急度？', accent: true },
      { label: 'コード', heading: '分岐する', body: '確信度が低ければ人に確認を回す' }
    ]} />
    <Callout frame={frame} label="返信は別の仕事" icon="✍️">返金の可否は業務ルールで判定し、返信文が必要ならLLMへ渡す。</Callout>
  </Slide>
}

function Training({ frame }: SlideRenderContext) {
  return <Slide><SlideHeading frame={frame} kicker="WHY IT MATTERS" heading={'毎回専用モデルを\n作らなくていい'} lead="事前学習したモデルを、判断に向けて追加学習" />
    <Timeline frame={frame} steps={[
      { label: '基盤', heading: '事前学習', body: '幅広い文章の知識を獲得' },
      { label: '後学習', heading: 'RLCD', body: '確率を伴う判断向けに調整', accent: true },
      { label: '利用', heading: '質問を指定', body: '業務ごとに選択肢と条件を変える' }
    ]} />
    <Callout frame={frame} tone="warn" icon="🔎" label="言い過ぎない">大規模事前学習は公式説明で確認可能。ただし学習データ量・パラメータ数は未公表。「LLMと同じ量」とは断言しない。</Callout>
  </Slide>
}

function Performance({ frame }: SlideRenderContext) {
  return <Slide><SlideHeading frame={frame} kicker="SPEED & PRICE" heading="いちばん強い主張は速さと単価" lead="2026年9月のTypeSafe公表値。私自身の計測値ではない" />
    <ComparisonTable frame={frame} columns={[{ label: '観点' }, { label: '公表値', accent: true }]} rows={[
      { label: '応答', cells: ['エンドツーエンド', '70〜500 ms'] },
      { label: '入力単価', cells: ['100万トークンあたり', '$0.042'] },
      { label: '出力単価', cells: ['従量課金', '無料（計測対象外）'] }
    ]} />
    <Callout frame={frame} tone="warn" icon="📏" label="倍率は条件付き">「20〜200倍速い」は提供元の比較。入力長・比較するLLM・地域・再試行で差が変わる。</Callout>
  </Slide>
}

function Benchmark({ frame }: SlideRenderContext) {
  return <Slide><SlideHeading frame={frame} kicker="READ THE EVALS" heading="ベンチマークの読み方" lead="4つの業務フローでLLMと比較。速度・コスト・結果を公開" />
    <ComparisonTable frame={frame} columns={[{ label: '評価できる点' }, { label: '留保', accent: true }]} rows={[
      { label: '設計', cells: ['同じワークフローにLLMも参加', '問いの設計はTypeSafeチーム'] },
      { label: '正解', cells: ['複数モデルの回答を参照', '独立した真の正解ラベルではない'] },
      { label: '使い方', cells: ['速さ・単価の差を知る', '自社データで精度を検証する'] }
    ]} />
    <Callout frame={frame} label="現場で決める" icon="🧪">自社の誤判定コストと必要な応答時間で評価しよう。</Callout>
  </Slide>
}

function Limitations({ frame }: SlideRenderContext) {
  return <Slide><SlideHeading frame={frame} kicker="BOUNDARIES" heading="万能の代替品ではない" lead="型の保証と、正しい判断の保証は別物" />
    <ComparisonTable frame={frame} columns={[{ label: 'できる' }, { label: '要注意', accent: true }]} rows={[
      { label: '出力', cells: ['指定した形式だけを返す', '選択肢の中で間違えることはある'] },
      { label: '入力', cells: ['自然言語の状態を読む', '画像・音声は事前に変換が必要'] },
      { label: '精度', cells: ['短い意味判断に強い', '計算・日付・長い無関係な文脈は弱い'] }
    ]} />
    <Callout frame={frame} tone="warn" icon="🌏" label="日本語も要検証">公式には英語が最も高精度。日本語で業務利用するなら必ず試験する。</Callout>
  </Slide>
}

function Division({ frame }: SlideRenderContext) {
  return <Slide><SlideHeading frame={frame} kicker="ARCHITECTURE" heading="LLMと分業するのが自然" lead="遅延とコストをかけるべき場所だけに、LLMを使う" />
    <DiagramFrame frame={frame} caption="高頻度の判断 → 必要なら深い処理" note="低確信度と高リスクは自動確定しない">
      <FlowDiagram frame={frame} items={[
        { heading: 'イベント', body: 'ログ・問い合わせ・操作' },
        { heading: 'Jev', body: '高速な分類・優先順位', accent: true },
        { heading: 'LLM / 人', body: '文章・推論・承認' }
      ]} />
    </DiagramFrame>
    <Callout frame={frame} tone="good" icon="⚡" label="向いている場面">「LLMでもできるが、回数が多く、もっとリアルタイムにしたい」判断。</Callout>
  </Slide>
}

function Outlook({ frame }: SlideRenderContext) {
  return <Slide><SlideHeading frame={frame} kicker="MY TAKE" heading={'Jevが変えるのは\n「AIを呼ぶ頻度」'} lead="小さな判断を、これまでより多くの場所に置ける" />
    <Timeline frame={frame} steps={[
      { label: 'いま', heading: 'Jevを使い分ける', body: '応答時間・精度・コストを測る' },
      { label: '私見', heading: '競合も追随しうる', body: 'OpenAI・Anthropicの同種サービスは予想であり未確認', accent: true },
      { label: '備え', heading: '交換可能にする', body: '同じ質問セットで複数モデルを評価する' }
    ]} />
    <Callout frame={frame} label="結論" icon="🎯">発明は「判断」そのものではない。汎用の判断を、速く・安く・組み込みやすくしたこと。</Callout>
  </Slide>
}

function Sources({ frame }: SlideRenderContext) {
  return <Slide><SlideHeading frame={frame} kicker="SOURCES / 2026-09-23" heading="一次情報と読み方" lead="数値は公開資料に基づく。利用前に最新版を再確認" />
    <ul style={{ fontSize: 29, lineHeight: 1.75, overflowWrap: 'anywhere' }}>
      <li><a href="https://typesafe.ai/blog/introducing-system-one-models-and-jev" target="_blank" rel="noreferrer">TypeSafe: Introducing System One Models & Jev</a></li>
      <li><a href="https://docs.typesafe.ai/introduction" target="_blank" rel="noreferrer">公式ドキュメント：概要・3種類の判断</a></li>
      <li><a href="https://docs.typesafe.ai/model-jaggedness/jev-1.13" target="_blank" rel="noreferrer">公式ドキュメント：現行モデルの弱点</a></li>
      <li><a href="https://evals.typesafe.ai/" target="_blank" rel="noreferrer">TypeSafe公開の業務フロー評価</a></li>
      <li><a href="https://gihyo.jp/article/2026/09/jev-early-access" target="_blank" rel="noreferrer">技術評論社：提供状況と価格の報道</a></li>
    </ul>
    <Callout frame={frame} tone="warn" icon="🧭" label="情報の区別">性能値＝提供元の主張／競合の追随＝私見。どちらも事実認定とは分けて読む。</Callout>
  </Slide>
}
