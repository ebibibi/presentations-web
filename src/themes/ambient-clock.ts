import { useEffect, useSyncExternalStore } from 'react'

/**
 * The clock the ambient backdrop runs on.
 *
 * The viewer pauses the Remotion player on each slide's settled frame, so the
 * composition frame stops moving once a slide has entered. Ambient motion has
 * to keep going after that, so it reads this separate frame counter instead.
 * It is still a frame number, not CSS time: the viewer advances it at the deck
 * frame rate, and a capture can set it explicitly (`?ambient=manual`) to render
 * the same picture for the same pair of (slide frame, ambient frame).
 *
 * `null` means nobody drives the clock; the backdrop then falls back to the
 * composition frame, which is what a plain Remotion render would give.
 */
let ambientFrame: number | null = null
const listeners = new Set<() => void>()

function emit() {
  for (const listener of listeners) listener()
}

export function setAmbientFrame(frame: number | null) {
  if (frame === ambientFrame) return
  ambientFrame = frame
  emit()
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

const getSnapshot = () => ambientFrame

export function useAmbientClockValue(): number | null {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
}

/** True when the page was opened for a frame-exact capture (`?ambient=manual`). */
export function isManualAmbient(): boolean {
  return typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('ambient') === 'manual'
}

/**
 * Drives the ambient clock while a themed deck is open.
 *
 * Ticks once per deck frame on requestAnimationFrame. It stays at 0 for a
 * visitor who asked for reduced motion, and under `?ambient=manual` it does
 * not tick at all: the capture script sets it through `window.__deckCapture`
 * (see DeckViewer).
 */
export function useAmbientClockDriver(enabled: boolean, fps: number) {
  useEffect(() => {
    if (!enabled) return undefined

    setAmbientFrame(0)

    if (isManualAmbient() || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      return () => setAmbientFrame(null)
    }

    const startedAt = performance.now()
    let handle = 0
    const tick = (now: number) => {
      setAmbientFrame(Math.floor(((now - startedAt) * fps) / 1000))
      handle = window.requestAnimationFrame(tick)
    }
    handle = window.requestAnimationFrame(tick)

    return () => {
      window.cancelAnimationFrame(handle)
      setAmbientFrame(null)
    }
  }, [enabled, fps])
}
