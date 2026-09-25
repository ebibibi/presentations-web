import { useEffect, useId, useRef } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { clamp01, mixSeed, seededRandom } from './beat'

export type FilmFinishProps = {
  frame: number
  children: ReactNode
  /** Strength of the film grain, 0..1. The default is barely there on purpose. */
  grain?: number
  /** Darkening at the corners, 0..1. */
  vignette?: number
  /** Frames on which a short RGB-split glitch starts. Empty by default. */
  glitch?: number[]
  /** How many frames one glitch lasts. */
  glitchLength?: number
  seed?: number
}

const GRAIN_TILE = 160
/** Grain is drawn at half the canvas resolution, which reads as film rather than noise. */
const GRAIN_SCALE = 0.5
const MAX_SPLIT = 8
const MAX_SLICE_SHIFT = 48

/** One tile of monochrome noise; a new tile each frame, the same tile for the same frame. */
function drawGrain(canvas: HTMLCanvasElement, frame: number, seed: number) {
  const width = Math.max(1, Math.round(canvas.clientWidth * GRAIN_SCALE))
  const height = Math.max(1, Math.round(canvas.clientHeight * GRAIN_SCALE))
  if (canvas.width !== width) canvas.width = width
  if (canvas.height !== height) canvas.height = height

  const context = canvas.getContext('2d')
  if (!context) return

  const random = seededRandom(mixSeed(seed, frame))
  const tile = context.createImageData(GRAIN_TILE, GRAIN_TILE)

  for (let offset = 0; offset < tile.data.length; offset += 4) {
    const value = random() < 0.5 ? 0 : 255
    tile.data[offset] = value
    tile.data[offset + 1] = value
    tile.data[offset + 2] = value
    tile.data[offset + 3] = Math.round(random() * 255)
  }

  const shiftX = Math.floor(random() * GRAIN_TILE)
  const shiftY = Math.floor(random() * GRAIN_TILE)
  context.clearRect(0, 0, width, height)
  for (let y = -shiftY; y < height; y += GRAIN_TILE) {
    for (let x = -shiftX; x < width; x += GRAIN_TILE) {
      context.putImageData(tile, x, y)
    }
  }
}

/** 0 outside a glitch; inside one, at least 0.5, peaking at 1 mid-window. */
function glitchStrength(frame: number, starts: number[], length: number): number {
  const span = Math.max(1, length)

  for (const start of starts) {
    const t = (frame - start) / span
    if (t >= 0 && t < 1) return 0.5 + 0.5 * Math.sin(Math.PI * (t + 0.5 / span))
  }

  return 0
}

type GlitchFilterProps = { id: string; frame: number; seed: number; strength: number }

const SLICE_COUNT = 7

/**
 * A displacement map of hard horizontal bands: red above 128 pushes a slice
 * right, below 128 pushes it left, and green stays at 128 so nothing moves
 * vertically. Built as an SVG image so the slices have clean edges.
 */
function sliceMap(random: () => number): string {
  const bands = Array.from({ length: SLICE_COUNT }, () => {
    const y = (random() * 100).toFixed(2)
    const height = (1.5 + random() * 9).toFixed(2)
    const red = Math.round(128 + (random() - 0.5) * 254)
    return `<rect x="0" y="${y}" width="100" height="${height}" fill="rgb(${red},128,0)"/>`
  })
  const svg =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none">' +
    `<rect width="100" height="100" fill="rgb(128,128,0)"/>${bands.join('')}</svg>`

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

/**
 * An SVG filter that cuts the picture into horizontal slices, shifts each one
 * sideways, and pulls the red channel apart from green and blue. It is applied
 * to the real slide, so there is no second copy of the text to keep in sync.
 */
function GlitchFilter({ id, frame, seed, strength }: GlitchFilterProps) {
  const random = seededRandom(mixSeed(seed, frame, 0x61))
  const split = (MAX_SPLIT * strength * (0.6 + random() * 0.4)).toFixed(2)
  const map = sliceMap(random)

  return (
    <svg className="sk-film-defs" aria-hidden="true" focusable="false">
      <filter id={id} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
        <feImage href={map} preserveAspectRatio="none" result="bands" />
        <feDisplacementMap
          in="SourceGraphic"
          in2="bands"
          scale={(MAX_SLICE_SHIFT * 2 * strength).toFixed(2)}
          xChannelSelector="R"
          yChannelSelector="G"
          result="sliced"
        />
        <feColorMatrix
          in="sliced"
          type="matrix"
          values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
          result="red"
        />
        <feColorMatrix
          in="sliced"
          type="matrix"
          values="0 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0"
          result="cyan"
        />
        <feOffset in="red" dx={split} result="redShift" />
        <feOffset in="cyan" dx={`-${split}`} result="cyanShift" />
        <feComposite in="redShift" in2="cyanShift" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="split" />
        {/* Gaps a slice leaves behind show the untouched slide, not a hole. */}
        <feMerge>
          <feMergeNode in="SourceGraphic" />
          <feMergeNode in="split" />
        </feMerge>
      </filter>
    </svg>
  )
}

/**
 * Finishing texture for a slide: film grain that changes every frame, a soft
 * vignette, and an optional RGB-split glitch on chosen frames.
 *
 * Wrap the slide in it. The texture layers sit on top with pointer events off,
 * so links and text selection still work; the glitch filters the slide itself
 * for a few frames and is otherwise absent. Viewers who ask for reduced motion
 * get the vignette only (see slide-kit.css).
 */
export function FilmFinish({
  frame,
  children,
  grain = 0.08,
  vignette = 0.25,
  glitch = [],
  glitchLength = 5,
  seed = 11
}: FilmFinishProps) {
  const filterId = `sk-glitch-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`
  const grainRef = useRef<HTMLCanvasElement>(null)
  const strength = glitchStrength(frame, glitch, glitchLength)
  const grainLevel = clamp01(grain)
  const vignetteLevel = clamp01(vignette)

  useEffect(() => {
    const canvas = grainRef.current
    if (!canvas || grainLevel <= 0) return
    drawGrain(canvas, frame, seed)
  }, [frame, seed, grainLevel])

  const layers = {
    '--sk-grain-alpha': grainLevel,
    '--sk-vignette-alpha': vignetteLevel
  } as CSSProperties

  return (
    <div className="sk-film" style={layers}>
      <div
        className={strength > 0 ? 'sk-film-content sk-film-glitching' : 'sk-film-content'}
        style={strength > 0 ? { filter: `url(#${filterId})` } : undefined}
      >
        {children}
      </div>
      {strength > 0 ? <GlitchFilter id={filterId} frame={frame} seed={seed} strength={strength} /> : null}
      {vignetteLevel > 0 ? <div className="sk-film-vignette" aria-hidden="true" /> : null}
      {grainLevel > 0 ? <canvas ref={grainRef} className="sk-film-grain" aria-hidden="true" /> : null}
    </div>
  )
}
