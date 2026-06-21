import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Film,
  Fullscreen,
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
  const slideStarts = useMemo(() => getSlideStarts(deck), [deck])
  const totalFrames = useMemo(
    () =>
      deck.meta.slides.reduce(
        (sum, slide) => sum + (slide.durationInFrames ?? 120),
        0
      ),
    [deck]
  )

  const goToSlide = useCallback(
    (index: number) => {
      const nextIndex = Math.max(0, Math.min(deck.meta.slides.length - 1, index))
      setSlideIndex(nextIndex)
      playerRef.current?.seekTo(slideStarts[nextIndex] ?? 0)
      window.history.replaceState(null, '', `#${nextIndex + 1}`)
    },
    [deck.meta.slides.length, slideStarts]
  )

  useEffect(() => {
    playerRef.current?.seekTo(slideStarts[slideIndex] ?? 0)
  }, [slideIndex, slideStarts])

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
