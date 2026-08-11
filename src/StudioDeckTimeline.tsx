import { AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion'
import { DeckTimeline } from './DeckTimeline'
import {
  getDeckDuration,
  studioIntroFrames,
  studioOutroFrames
} from './studio-timeline'
import type { DeckBundle } from './types'

export function StudioDeckTimeline({ deck }: { deck: DeckBundle }) {
  const frame = useCurrentFrame()
  const deckDuration = getDeckDuration(deck)
  const outroStart = studioIntroFrames + deckDuration

  return (
    <AbsoluteFill style={{ background: '#071426' }}>
      {frame < studioIntroFrames ? (
        <StudioBookend
          kind="hook"
          frame={frame}
          durationInFrames={studioIntroFrames}
          deckTitle={deck.meta.title}
        />
      ) : null}
      <Sequence from={studioIntroFrames} durationInFrames={deckDuration}>
        <DeckTimeline deck={deck} />
      </Sequence>
      {frame >= outroStart ? (
        <StudioBookend
          kind="signoff"
          frame={frame - outroStart}
          durationInFrames={studioOutroFrames}
          deckTitle={deck.meta.title}
        />
      ) : null}
    </AbsoluteFill>
  )
}

function StudioBookend({
  kind,
  frame,
  durationInFrames,
  deckTitle
}: {
  kind: 'hook' | 'signoff'
  frame: number
  durationInFrames: number
  deckTitle: string
}) {
  const { fps } = useVideoConfig()
  const reveal = spring({ frame, fps, config: { damping: 18, stiffness: 90 } })
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 20, durationInFrames - 1],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  )
  const isHook = kind === 'hook'

  return (
    <AbsoluteFill
      className={`studio-bookend studio-bookend-${kind}`}
      data-studio-bookend={kind}
      style={{
        alignItems: 'center',
        background:
          'radial-gradient(circle at 50% 42%, rgba(73, 207, 255, 0.18), transparent 38%), linear-gradient(145deg, #06101d, #0d2844)',
        color: '#f4f8ff',
        display: 'flex',
        fontFamily: '"Noto Sans JP", "Yu Gothic UI", "Segoe UI", sans-serif',
        justifyContent: 'center',
        opacity: fadeOut,
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
          maxWidth: 1040,
          opacity: reveal,
          textAlign: 'center',
          transform: `translateY(${(1 - reveal) * 30}px)`
        }}
      >
        <span
          style={{
            color: '#64e9ff',
            fontSize: 22,
            fontWeight: 900,
            letterSpacing: '0.2em'
          }}
        >
          {isHook ? 'PRIVATE STUDIO CUE · OPENING' : 'PRIVATE STUDIO CUE · SIGN-OFF'}
        </span>
        <h1
          style={{
            fontSize: isHook ? 96 : 78,
            lineHeight: 1.15,
            margin: '40px 0 28px'
          }}
        >
          {isHook ? '冒頭フック' : 'stay hungry, stay foolish.'}
        </h1>
        <p
          style={{
            color: '#b8cae0',
            fontSize: 30,
            lineHeight: 1.6,
            margin: 0
          }}
        >
          {isHook
            ? '最初の一言で「なぜ続きを見るべきか」を伝える'
            : 'それでは、また次の動画で。'}
        </p>
        <span
          style={{
            borderTop: '1px solid rgba(100, 233, 255, 0.24)',
            color: '#8fa8c1',
            fontSize: 20,
            marginTop: 48,
            paddingTop: 22
          }}
        >
          {deckTitle}
        </span>
      </div>
    </AbsoluteFill>
  )
}
