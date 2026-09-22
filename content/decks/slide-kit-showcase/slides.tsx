/* eslint-disable react-refresh/only-export-components */
import type { SlideModule, SlideRenderContext } from '../../../src/types'
import {
  Callout,
  CodeSlide,
  ComparisonTable,
  CtaSlide,
  DiagramFrame,
  FlowDiagram,
  Quote,
  SectionDivider,
  Slide,
  SlideHeading,
  Timeline,
  TitleSlide,
  VideoSlide
} from '../../../src/slide-kit'

/**
 * Live reference for src/slide-kit. Every component appears exactly once, so a
 * change to the kit shows up here before it reaches a real deck.
 */
export const slides: SlideModule['slides'] = [
  { id: 'opening', render: (props) => <OpeningSlide {...props} /> },
  { id: 'why', render: (props) => <WhySlide {...props} /> },
  { id: 'divider-structure', render: (props) => <DividerSlide {...props} /> },
  { id: 'comparison', render: (props) => <ComparisonSlide {...props} /> },
  { id: 'timeline', render: (props) => <TimelineSlide {...props} /> },
  { id: 'terminal', render: (props) => <TerminalSlide {...props} /> },
  { id: 'diagram', render: (props) => <DiagramSlide {...props} /> },
  { id: 'quote', render: (props) => <QuoteSlide {...props} /> },
  { id: 'video', render: (props) => <VideoShowcaseSlide {...props} /> },
  { id: 'cta-outro', render: (props) => <CtaSlide {...props} /> }
]

function OpeningSlide({ frame }: SlideRenderContext) {
  return (
    <TitleSlide
      frame={frame}
      kicker="presentations.ebisuda.net ─ 開発者向け"
      heading={'スライド部品\nライブラリ'}
      lead="同じ見た目を、毎回書き直さずに出す"
      points={[
        { step: '01', heading: '見た目が揃う', body: '余白も文字サイズも部品側が決める' },
        { step: '02', heading: '文言は編集できる', body: 'ブラウザのクリック編集がそのまま効く' },
        { step: '03', heading: '2つのキャンバス', body: '1280x1080 と 1920x1080 の両方で崩れない' }
      ]}
    />
  )
}

function WhySlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading
        frame={frame}
        kicker="出発点 ─ 実測した重複"
        heading={'29デッキが\n同じコードを持っていた'}
        lead="部品にする前の実測値。直すときに全部を触ることになっていた。"
      />
      <Timeline
        frame={frame}
        orientation="horizontal"
        steps={[
          { label: '17,567行', heading: 'slides.tsx の合計', body: 'デッキ29本ぶんのスライド実装' },
          { label: '24 / 29', heading: '同じ entrance と lift', body: 'アニメーションの定義を丸ごとコピー' },
          { label: '143箇所', heading: 'slide-kicker', body: '見出しの上の小さい行だけでこの数' }
        ]}
      />
      <Callout frame={frame} tone="note" icon="🧩" label="部品の置き場">
        <p>src/slide-kit に1部品1ファイルで置く。使う側は import 1行で足りる。</p>
      </Callout>
    </Slide>
  )
}

function DividerSlide({ frame }: SlideRenderContext) {
  return (
    <SectionDivider
      frame={frame}
      step="02"
      kicker="章の区切り ─ SectionDivider"
      heading="話題が変わることを、色で見せる"
      lead="長いデッキほど、区切りがあるほうが見る側は追える"
    />
  )
}

function ComparisonSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading
        frame={frame}
        kicker="比較表 ─ ComparisonTable"
        heading={'手書きと部品、\nどこが変わるか'}
      />
      <ComparisonTable
        frame={frame}
        columns={[{ label: '1枚ずつ手書き' }, { label: '部品を使う', accent: true }]}
        rows={[
          {
            label: '書く量',
            cells: ['スライド1枚ごとにJSXとCSS', '部品を呼んで、文言を渡すだけ']
          },
          {
            label: '見た目の揃い',
            cells: ['デッキごとに余白も文字サイズも違う', '部品側が1箇所で決める']
          },
          {
            label: '直すとき',
            cells: ['同じ修正を全デッキに入れる', '部品を直せば全デッキに届く']
          },
          {
            label: '文言の編集',
            cells: ['書き方しだいで編集画面から消える', '決められたprop名なら必ず残る']
          }
        ]}
      />
    </Slide>
  )
}

function TimelineSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading
        frame={frame}
        kicker="時系列 ─ Timeline"
        heading="デッキを1本作る手順"
        lead="縦向きにすると、ステップが増えても読める"
      />
      <Timeline
        frame={frame}
        orientation="vertical"
        steps={[
          { label: 'STEP 1', heading: 'deck.yaml を書く', body: 'タイトル、要約、スライドのidと順番を先に決める' },
          { label: 'STEP 2', heading: 'slides.tsx で部品を並べる', body: 'deck.yaml のidと1対1で対応させる' },
          { label: 'STEP 3', heading: 'npm run build', body: 'idの不一致も文言の抽出漏れもここで落ちる' },
          { label: 'STEP 4', heading: 'ブラウザで確認する', body: '文字がはみ出していないかを実寸で見る', accent: true }
        ]}
      />
    </Slide>
  )
}

function TerminalSlide({ frame }: SlideRenderContext) {
  return (
    <CodeSlide
      frame={frame}
      kicker="コマンド ─ CodeSlide / Terminal"
      heading={'コマンドは3種類で\n書き分ける'}
      caption="presentations-web"
      lines={[
        { kind: 'comment', body: '新しいデッキを作ったら、まずこれを通す' },
        { kind: 'prompt', body: 'npm run build' },
        { kind: 'output', body: 'Deck check passed (30 decks).' },
        { kind: 'prompt', body: 'npm run check:slide-kit' },
        { kind: 'output', body: 'Slide kit check passed.' }
      ]}
    >
      <Callout frame={frame} tone="note" icon="⌨️" label="行の種類">
        <p>prompt は打ち込む行、output は返ってきた行、comment は説明。</p>
      </Callout>
      <Callout frame={frame} tone="good" icon="✏️" label="あとから直せる">
        <p>行は配列データなので、ブラウザの編集画面から足しても消してもよい。</p>
      </Callout>
    </CodeSlide>
  )
}

function DiagramSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading frame={frame} kicker="構成図 ─ DiagramFrame / FlowDiagram" heading="構成は箱と矢印で足りる" />
      <DiagramFrame
        frame={frame}
        caption="デッキが表示されるまで"
        note="枠もキャプションも部品が持つので、デッキ側は箱の中身だけ考える。"
      >
        <FlowDiagram
          frame={frame}
          items={[
            { heading: 'deck.yaml', body: '順番と speaker notes' },
            { heading: 'slides.tsx', body: '部品を並べる' },
            { heading: 'slide-kit', body: '見た目と動き', accent: true },
            { heading: 'ブラウザ', body: '視聴用と撮影用' }
          ]}
        />
      </DiagramFrame>
    </Slide>
  )
}

function QuoteSlide({ frame }: SlideRenderContext) {
  return (
    <Slide tone="accent">
      <SlideHeading frame={frame} kicker="引用と注意書き ─ Quote / Callout" heading="引用には必ず出典を付ける" />
      <Quote
        frame={frame}
        quote="Prefer reusable slide components before adding one-off patterns."
        source="AGENTS.md ─ Implementation Rules"
      />
      <Callout frame={frame} tone="warn" icon="⚠️" label="公開される前提で書く">
        <p>デッキは動画公開後も読まれる。顧客名・社内情報・個人情報は載せない。</p>
      </Callout>
    </Slide>
  )
}

function VideoShowcaseSlide({ frame }: SlideRenderContext) {
  return (
    <VideoSlide
      frame={frame}
      kicker="動画 ─ VideoSlide"
      heading="動画そのものを1枚にする"
      lead="既定はサムネイルとリンク。撮影中に動くプレイヤーを置かない。"
      videoId="XQAVfYVe5FI"
      caption="クリックすると YouTube が開く。embed を付けたときだけ埋め込みプレイヤーになる。"
    />
  )
}
