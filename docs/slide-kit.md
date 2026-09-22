# Slide Kit

Reusable slide components for decks under `content/decks`. Source lives in
`src/slide-kit`; the live example is the `slide-kit-showcase` deck, which
renders every component in this document.

Read [ai-deck-authoring.md](ai-deck-authoring.md) first for the deck file layout
and the metadata schema. This document covers the components only.

## Why it exists

Before the kit, 24 of 29 decks carried an identical copy of the same `entrance`
and `lift` helpers, `slide-kicker` appeared 143 times, and `content/decks`
totalled 17,567 lines of slide code. Each deck also invented its own class
prefix, so a spacing decision could not be changed anywhere except one deck at a
time. The kit moves the layout and the motion into one place and leaves the deck
file holding the words.

`AGENTS.md` states the rule this implements: *prefer reusable slide components
before adding one-off patterns.*

## Two rules that are not negotiable

**Copy travels under registered prop names.** Slide copy on this site is
editable from the browser. The extractor (`scripts/deck-text-core.mjs`) reads
string literals out of `slides.tsx`, and for JSX attributes it only accepts the
names in `COPY_ATTRIBUTES`: `alt`, `title`, `aria-label`, `label`, `caption`,
`placeholder`, `kicker`, `lead`, `heading`, `body`, `note`, `quote`, `source`,
`step`, `steps`, `items`, `lines`, `rows`, `columns`, `points`.

A headline handed to a component under any other prop name still renders, and
then vanishes from the editor permanently. Keep to the vocabulary above, or add
the new name to `COPY_ATTRIBUTES` in the same change. `npm run check:slide-kit`
fails on an unregistered prop.

**Nothing sets a width, a height, or a viewport unit.** A deck picks its canvas
with `canvas: standard` (1280 x 1080) or `canvas: wide` (1920 x 1080). Kit
layout is flex and percentages so the same slide fits both, and font sizes are
absolute pixels against the canvas so the browser can scale the whole slide as
one piece. `npm run check:slide-kit` measures every showcase slide and fails on
an overflow of a single pixel.

## Getting started

```tsx
import type { SlideModule, SlideRenderContext } from '../../../src/types'
import { Slide, SlideHeading, Timeline } from '../../../src/slide-kit'

export const slides: SlideModule['slides'] = [
  { id: 'opening', render: (props) => <OpeningSlide {...props} /> }
]

function OpeningSlide({ frame }: SlideRenderContext) {
  return (
    <Slide>
      <SlideHeading frame={frame} kicker="第1回" heading="今日の話" />
    </Slide>
  )
}
```

Importing from `../../../src/slide-kit` pulls in the stylesheet; a deck does not
import `slide-kit.css` itself. Every component takes `frame` from the render
context and drives its own entrance from it.

## Components

### Slide

The surface. Wraps `.remotion-slide`, so it is what preserves the canvas.

```tsx
<Slide tone="paper" grid logo center className="my-deck-slide">
  …
</Slide>
```

| prop | values | effect |
| --- | --- | --- |
| `tone` | `paper` (default), `ink`, `accent` | background treatment; `ink` inverts for a chapter break |
| `grid` | boolean | faint motion grid behind the content |
| `logo` | boolean | corner logo mark, for opening and closing slides |
| `center` | boolean | centres the content block vertically |
| `className` | string | a deck-specific class, for the rare thing the kit does not cover |

### SlideHeading

Kicker, headline and lead — the block that opens most slides.

```tsx
<SlideHeading
  frame={frame}
  kicker="なぜ今か"
  heading={'手動のループから\n次へ'}
  lead="止まる条件まで設計する"
/>
```

A `\n` inside `heading` becomes a real line break, so a Japanese headline breaks
where the author decided and stays one editable string.

### TitleSlide

Opening slide: title, promise, and up to three things the viewer will get.

```tsx
<TitleSlide
  frame={frame}
  kicker="Claude Codeの使い方コース ─ 第19回"
  heading={'ループ設計'}
  lead="仕事を回させる"
  points={[
    { step: '01', heading: '4種類を使い分ける', body: '作業に合わせて選ぶ' },
    { step: '02', heading: '止まり方まで設計する', body: '停止条件をセットで渡す' }
  ]}
/>
```

### SectionDivider

Chapter break. Inverted, so it reads as a pause rather than another content
slide.

```tsx
<SectionDivider
  frame={frame}
  step="02"
  kicker="Section"
  heading="ここから実装の話"
  lead="設定ではなく、コードの話に入る"
/>
```

### CodeSlide and Terminal

`Terminal` is the window; `CodeSlide` is a whole slide built around one, with
optional commentary on the right.

```tsx
<CodeSlide
  frame={frame}
  kicker="実行する"
  heading="まずこれを通す"
  caption="presentations-web"
  lines={[
    { kind: 'comment', body: 'デッキを追加したら' },
    { kind: 'prompt', body: 'npm run build' },
    { kind: 'output', body: 'Deck check passed (30 decks).' }
  ]}
>
  <Callout frame={frame} icon="⌨️" label="行の種類">
    <p>prompt は打ち込む行、output は返ってきた行、comment は説明。</p>
  </Callout>
</CodeSlide>
```

`kind` defaults to `output`. Lines are data, not JSX, so they can be added,
deleted and reordered from the browser editor.

### ComparisonTable

Before/after, or option A against option B.

```tsx
<ComparisonTable
  frame={frame}
  columns={[{ label: '今まで' }, { label: 'これから', accent: true }]}
  rows={[
    { label: '書く量', cells: ['1枚ずつ手書き', '部品を呼ぶだけ'] },
    { label: '直すとき', cells: ['全デッキを触る', '部品を1箇所'] }
  ]}
/>
```

`accent: true` marks the column the viewer should end up choosing. `cells` must
line up with `columns`.

### Timeline

A dated sequence: releases, migration phases, the steps of a workflow.

```tsx
<Timeline
  frame={frame}
  orientation="vertical"
  steps={[
    { label: 'STEP 1', heading: 'deck.yaml を書く', body: '順番を先に決める' },
    { label: 'STEP 2', heading: '部品を並べる', body: 'idと1対1で対応させる', accent: true }
  ]}
/>
```

Use `horizontal` (the default) for three to five steps and `vertical` past that.

### DiagramFrame and FlowDiagram

`DiagramFrame` is the bordered stage with its label and caption. `FlowDiagram`
fills it with boxes joined by arrows; anything else can go inside instead.

```tsx
<DiagramFrame frame={frame} caption="リクエストの流れ" note="Queueで受信と実行を分ける。">
  <FlowDiagram
    frame={frame}
    items={[
      { heading: 'Discord', body: '人が書く' },
      { heading: 'Queue', body: '受け渡し' },
      { heading: 'Worker', body: '実行する', accent: true }
    ]}
  />
</DiagramFrame>
```

### Callout and Quote

```tsx
<Callout frame={frame} tone="warn" icon="⚠️" label="公開される前提で書く">
  <p>デッキは動画公開後も読まれる。顧客名・社内情報・個人情報は載せない。</p>
</Callout>

<Quote
  frame={frame}
  quote="Prefer reusable slide components before adding one-off patterns."
  source="AGENTS.md ─ Implementation Rules"
/>
```

`Callout` tones are `note` (default), `warn` and `good`. Always give `Quote` a
`source`: a deck is read long after the video, and an unattributed quote is the
thing viewers write in to ask about.

### VideoSlide

```tsx
<VideoSlide
  frame={frame}
  kicker="前回の動画"
  heading="どこからでもClaude Code"
  videoId="XQAVfYVe5FI"
  caption="クリックすると YouTube が開く"
/>
```

The default is a still image that links out. Add `embed` only for a deck that is
read rather than recorded: a live iframe competes with the recording and cannot
be scrubbed with the slide. `poster` replaces the YouTube still with an image
under `public/`. Pass the 11-character video id, not the watch URL — anything
else throws at render time rather than showing an empty box.

### CtaSlide and LogoMark

Re-exported from `src/deck-shared.tsx` so a deck has one import. The branding and
the call-to-action copy are shared across every deck and are edited there, not
per deck.

## Motion helpers

```tsx
import { useEnter, useStagger, entrance, lift } from '../../../src/slide-kit'

const style = useEnter(frame, 20)            // one element, 20 frames in
const styles = useStagger(frame, items.length) // one style per list item
```

`entrance` and `lift` are the raw functions behind them, for a slide that needs
its own timing. Hooks cannot run in a loop, which is why `useStagger` returns the
whole array at once.

## Verification

```bash
npm run lint
npm run build
npm run check:slide-kit
```

`check:slide-kit` builds the site, walks the showcase deck one slide at a time,
and fails if a slide is not exactly 1280 x 1080, if its content overflows, or if
a copy prop is not registered with the extractor. Add a slide to the showcase
deck whenever a component is added, or the new component is not covered.
