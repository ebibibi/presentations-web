import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Film,
  Fullscreen,
  MonitorCheck,
  PanelRight,
  Play,
  StickyNote
} from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Player, type PlayerRef } from '@remotion/player'
import { AuthControls } from './AuthControls'
import { DeckTimeline } from './DeckTimeline'
import type { AuthState } from './auth'
import type { DeckBundle } from './types'

const fps = 30
const seekTransitionFrames = 24
const seekDurationMs = 420
const settledFrameOffset = 112

type ViewerMode = 'audience' | 'studio'

export function DeckViewer({
  deck,
  initialMode,
  auth,
  onBack,
  onOpenStudio,
  onAuthChange
}: {
  deck: DeckBundle
  initialMode: ViewerMode
  auth: AuthState
  onBack: () => void
  onOpenStudio: () => void
  onAuthChange: (auth: AuthState) => void
}) {
  const [slideIndex, setSlideIndex] = useState(() => getInitialSlideIndex(deck))
  const [mode, setMode] = useState<ViewerMode>(initialMode)
  const playerRef = useRef<PlayerRef>(null)
  const recordingPlayerRef = useRef<PlayerRef>(null)
  const recordingSurfaceRef = useRef<HTMLDivElement>(null)
  const smoothSeekRef = useRef<number | null>(null)
  const slideStarts = useMemo(() => getSlideStarts(deck), [deck])
  const totalFrames = useMemo(
    () =>
      deck.meta.slides.reduce(
        (sum, slide) => sum + (slide.durationInFrames ?? 120),
        0
      ),
    [deck]
  )

  const getSlideSettledFrame = useCallback(
    (index: number) => {
      const duration = deck.meta.slides[index]?.durationInFrames ?? 120
      return (slideStarts[index] ?? 0) + Math.min(settledFrameOffset, Math.max(0, duration - 1))
    },
    [deck.meta.slides, slideStarts]
  )

  const setPlayersFrame = useCallback((frame: number) => {
    playerRef.current?.seekTo(frame)
    recordingPlayerRef.current?.seekTo(frame)
  }, [])

  const getCurrentPlayerFrame = useCallback(() => {
    return (
      playerRef.current?.getCurrentFrame() ??
      recordingPlayerRef.current?.getCurrentFrame() ??
      getSlideSettledFrame(slideIndex)
    )
  }, [getSlideSettledFrame, slideIndex])

  const animatePlayersToFrame = useCallback(
    (fromFrame: number, toFrame: number, onComplete: () => void) => {
      if (smoothSeekRef.current !== null) {
        window.cancelAnimationFrame(smoothSeekRef.current)
      }

      setPlayersFrame(fromFrame)
      const startedAt = performance.now()

      const step = (now: number) => {
        const progress = Math.min(1, (now - startedAt) / seekDurationMs)
        const eased = 1 - Math.pow(1 - progress, 3)
        setPlayersFrame(Math.round(fromFrame + (toFrame - fromFrame) * eased))

        if (progress < 1) {
          smoothSeekRef.current = window.requestAnimationFrame(step)
          return
        }

        smoothSeekRef.current = null
        setPlayersFrame(toFrame)
        onComplete()
      }

      smoothSeekRef.current = window.requestAnimationFrame(step)
    },
    [setPlayersFrame]
  )

  const goToSlide = useCallback(
    (index: number) => {
      const nextIndex = Math.max(0, Math.min(deck.meta.slides.length - 1, index))

      if (nextIndex === slideIndex) {
        return
      }

      const targetFrame = getSlideSettledFrame(nextIndex)
      const currentDuration = deck.meta.slides[slideIndex]?.durationInFrames ?? 120
      const forwardTransitionStart =
        (slideStarts[slideIndex] ?? 0) + Math.max(0, currentDuration - seekTransitionFrames)
      const startFrame = nextIndex > slideIndex ? forwardTransitionStart : getCurrentPlayerFrame()

      animatePlayersToFrame(startFrame, targetFrame, () => {
        setSlideIndex(nextIndex)
        window.history.replaceState(null, '', `#${nextIndex + 1}`)
      })
    },
    [
      animatePlayersToFrame,
      deck.meta.slides,
      getCurrentPlayerFrame,
      getSlideSettledFrame,
      slideIndex,
      slideStarts
    ]
  )

  useEffect(() => {
    const settledFrame = getSlideSettledFrame(slideIndex)
    playerRef.current?.seekTo(settledFrame)
    recordingPlayerRef.current?.seekTo(settledFrame)
  }, [getSlideSettledFrame, slideIndex])

  useEffect(() => {
    return () => {
      if (smoothSeekRef.current !== null) {
        window.cancelAnimationFrame(smoothSeekRef.current)
      }
    }
  }, [])

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight' || event.key === 'PageDown' || event.key === ' ') {
        event.preventDefault()
        goToSlide(slideIndex + 1)
      }

      if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
        event.preventDefault()
        goToSlide(slideIndex - 1)
      }

      if (event.key === 'Home') {
        event.preventDefault()
        goToSlide(0)
      }

      if (event.key === 'End') {
        event.preventDefault()
        goToSlide(deck.meta.slides.length - 1)
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [deck.meta.slides.length, goToSlide, slideIndex])

  const currentSlide = deck.meta.slides[slideIndex]
  const isStudio = mode === 'studio'
  const isStudioRoute = initialMode === 'studio'

  const openRecordingFullscreen = useCallback(async () => {
    await recordingSurfaceRef.current?.requestFullscreen()
  }, [])

  return (
    <main className="viewer-page">
      <header className="viewer-header">
        <button className="ghost-button" type="button" onClick={onBack}>
          <ArrowLeft size={18} aria-hidden />
          一覧
        </button>
        <div>
          <p>{deck.meta.status}</p>
          <h1>{deck.meta.title}</h1>
        </div>
        <div className="viewer-actions">
          {isStudioRoute && auth.canRecord ? (
            <>
              <button
                type="button"
                className={mode === 'audience' ? 'active' : ''}
                onClick={() => setMode('audience')}
                title="閲覧表示"
              >
                <Fullscreen size={18} aria-hidden />
                閲覧
              </button>
              <button
                type="button"
                className={mode === 'studio' ? 'active' : ''}
                onClick={() => setMode('studio')}
                title="撮影用レイアウト"
              >
                <Film size={18} aria-hidden />
                撮影
              </button>
              <button
                type="button"
                onClick={openRecordingFullscreen}
                title="撮影サーフェスだけを全画面表示"
              >
                <MonitorCheck size={18} aria-hidden />
                全画面撮影
              </button>
            </>
          ) : null}
          {!isStudioRoute && auth.canRecord ? (
            <button type="button" onClick={onOpenStudio} title="撮影用レイアウト">
              <Film size={18} aria-hidden />
              撮影
            </button>
          ) : null}
          {deck.meta.youtube?.url ? (
            <a href={deck.meta.youtube.url} target="_blank" rel="noreferrer">
              <ExternalLink size={18} aria-hidden />
              動画
            </a>
          ) : null}
        </div>
      </header>

      {isStudioRoute && !auth.canRecord ? (
        <StudioLoginGate auth={auth} onAuthChange={onAuthChange} />
      ) : null}

      {isStudioRoute && !auth.canRecord ? null : (
        <section className={isStudio ? 'stage-shell studio' : 'stage-shell audience'}>
          <div className="slide-frame">
            <Player
              ref={playerRef}
              component={DeckTimeline}
              durationInFrames={Math.max(totalFrames, 1)}
              compositionWidth={1280}
              compositionHeight={1080}
              fps={fps}
              initialFrame={getSlideSettledFrame(slideIndex)}
              controls={false}
              inputProps={{ deck }}
              style={{ width: '100%', height: '100%' }}
            />
            <button
              type="button"
              className="nav-zone nav-zone-left"
              onClick={() => goToSlide(slideIndex - 1)}
              aria-label="前のスライド"
            >
              <ChevronLeft size={28} aria-hidden />
            </button>
            <button
              type="button"
              className="nav-zone nav-zone-right"
              onClick={() => goToSlide(slideIndex + 1)}
              aria-label="次のスライド"
            >
              <ChevronRight size={28} aria-hidden />
            </button>
          </div>

        {isStudio ? (
          <aside className="studio-panel" aria-label="Studio panel">
            <div className="studio-panel-section">
              <PanelRight size={22} aria-hidden />
              <h2>Studio panel</h2>
              <p>
                ここは将来、文字起こし、話者向けアドバイス、台本、撮影キューを表示するために予約しています。
              </p>
            </div>
            <div className="studio-panel-section">
              <StickyNote size={22} aria-hidden />
              <h2>{currentSlide.title}</h2>
              <p>{currentSlide.notes ?? 'このスライドにはまだノートがありません。'}</p>
            </div>
            {deck.meta.youtube?.id ? (
              <div className="video-embed">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${deck.meta.youtube.id}`}
                  title={deck.meta.youtube.title ?? deck.meta.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            ) : null}
          </aside>
        ) : null}
        </section>
      )}

      {isStudioRoute && auth.canRecord ? (
        <section className="recording-inspector" aria-label="Recording output">
          <div className="recording-inspector-header">
            <div>
              <p>Recording output</p>
              <h2>1920 x 1080 capture surface</h2>
            </div>
            <span>
              slide 1280 x 1080 / reserved 640 x 1080
            </span>
          </div>
          <div
            ref={recordingSurfaceRef}
            className="recording-surface"
            aria-label="Fullscreen recording surface"
          >
            <div className="recording-slide-frame">
              <Player
                ref={recordingPlayerRef}
                component={DeckTimeline}
                durationInFrames={Math.max(totalFrames, 1)}
                compositionWidth={1280}
                compositionHeight={1080}
                fps={fps}
                initialFrame={getSlideSettledFrame(slideIndex)}
                controls={false}
                inputProps={{ deck }}
                style={{ width: '100%', height: '100%' }}
              />
              <button
                type="button"
                className="recording-nav-zone recording-nav-zone-left"
                onClick={() => goToSlide(slideIndex - 1)}
                aria-label="前のスライド"
              />
              <button
                type="button"
                className="recording-nav-zone recording-nav-zone-right"
                onClick={() => goToSlide(slideIndex + 1)}
                aria-label="次のスライド"
              />
            </div>
            <aside className="recording-reserved-area" aria-hidden="true" />
          </div>
        </section>
      ) : null}

      {isStudioRoute && !auth.canRecord ? null : (
        <footer className="viewer-footer">
          <button type="button" onClick={() => goToSlide(slideIndex - 1)}>
            <ChevronLeft size={18} aria-hidden />
            前へ
          </button>
          <span>
            {slideIndex + 1} / {deck.meta.slides.length}
          </span>
          <button type="button" onClick={() => goToSlide(slideIndex + 1)}>
            次へ
            <ChevronRight size={18} aria-hidden />
          </button>
          <button type="button" onClick={() => playerRef.current?.play()}>
            <Play size={18} aria-hidden />
            再生
          </button>
        </footer>
      )}
    </main>
  )
}

function StudioLoginGate({
  auth,
  onAuthChange
}: {
  auth: AuthState
  onAuthChange: (auth: AuthState) => void
}) {
  return (
    <section className="studio-login-gate">
      <Film size={42} aria-hidden />
      <h2>{auth.loading ? 'ログイン状態を確認中です' : '撮影モードはログインが必要です'}</h2>
      <p>
        このモードは資料作成者の撮影用です。ログインしていない人は通常の資料閲覧ページを利用できます。
      </p>
      <AuthControls auth={auth} onAuthChange={onAuthChange} />
    </section>
  )
}

function getInitialSlideIndex(deck: DeckBundle) {
  const hash = Number.parseInt(window.location.hash.replace('#', ''), 10)

  if (Number.isFinite(hash)) {
    return Math.max(0, Math.min(deck.meta.slides.length - 1, hash - 1))
  }

  return 0
}

function getSlideStarts(deck: DeckBundle) {
  let cursor = 0

  return deck.meta.slides.map((slide) => {
    const start = cursor
    cursor += slide.durationInFrames ?? 120
    return start
  })
}
