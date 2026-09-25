import { useEffect, useMemo, useRef, useState } from 'react'
import { useVideoConfig } from 'remotion'
import { DEFAULT_BPM, beatToFrame, clamp01 } from './beat'
import { particlePosition, sampleGlyphPoints, scatterParticles } from './particles'
import type { Particle } from './particles'

export type ParticleTextProps = {
  frame: number
  /** A short word — one to a dozen characters — drawn as particles. */
  heading: string
  bpm?: number
  /** Beat the particles leave on. */
  start?: number
  /** Beats until the last particle is in place. */
  length?: number
  /** Number of particles. 2,000–4,000 reads as a word and stays cheap to draw. */
  count?: number
  /** Changes the scatter pattern; the same seed always gives the same flight. */
  seed?: number
}

type Stage = { width: number; height: number; font: string; colors: string[] }

/** Bitmap pixels per canvas pixel, fixed so the result does not depend on the screen. */
const BITMAP_SCALE = 2
const MAX_COUNT = 6000
const DOT_SIZES = [3.4, 2.8, 2.3]
/** Fraction of one frame's travel drawn as a trail, and the longest trail in canvas pixels. */
const SHUTTER = 0.5
const MAX_TRAIL = 22
/** Outline added around the glyphs, as a fraction of the font size. */
const GLYPH_OUTLINE = 0.045
const FALLBACK_COLORS = ['#14756f', '#d85d4a', '#d9a21b']

function readStage(element: HTMLElement): Stage {
  const style = window.getComputedStyle(element)
  const colors = ['--sk-particle-a', '--sk-particle-b', '--sk-particle-c'].map(
    (name, index) => style.getPropertyValue(name).trim() || FALLBACK_COLORS[index]
  )

  return {
    width: Math.round(element.clientWidth),
    height: Math.round(element.clientHeight),
    font: style.fontFamily,
    colors
  }
}

/** Draws the word on an offscreen canvas and samples its opaque pixels. */
function buildParticles(stage: Stage, word: string, count: number, seed: number): Particle[] {
  const { width, height } = stage
  if (width < 8 || height < 8 || !word.trim()) return []

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d', { willReadFrequently: true })
  if (!context) return []

  const probe = 100
  context.font = `800 ${probe}px ${stage.font}`
  const measured = context.measureText(word).width || probe
  const size = Math.min(height * 0.78, (probe * width * 0.9) / measured)

  context.font = `800 ${size}px ${stage.font}`
  context.textAlign = 'center'
  context.textBaseline = 'middle'
  context.fillStyle = '#000'
  context.fillText(word, width / 2, height / 2)
  // Faces without a heavy weight render thin strokes that too few particles
  // can outline; an outline around the glyphs gives them body.
  context.strokeStyle = '#000'
  context.lineJoin = 'round'
  context.lineWidth = size * GLYPH_OUTLINE
  context.strokeText(word, width / 2, height / 2)

  const pixels = context.getImageData(0, 0, width, height).data
  const targets = sampleGlyphPoints(pixels, width, height, count, seed)
  return scatterParticles(targets, width, height, seed, DOT_SIZES.length)
}

function drawFrame(canvas: HTMLCanvasElement, stage: Stage, particles: Particle[], flight: number, previous: number) {
  const bitmapWidth = stage.width * BITMAP_SCALE
  const bitmapHeight = stage.height * BITMAP_SCALE
  if (canvas.width !== bitmapWidth) canvas.width = bitmapWidth
  if (canvas.height !== bitmapHeight) canvas.height = bitmapHeight

  const context = canvas.getContext('2d')
  if (!context) return

  context.setTransform(BITMAP_SCALE, 0, 0, BITMAP_SCALE, 0, 0)
  context.clearRect(0, 0, stage.width, stage.height)
  context.lineCap = 'round'

  // One path per colour. A short stroke trailing back toward last frame's
  // position is the particle's motion blur (a half-open shutter, capped so a
  // fast particle stays a streak rather than a line); at rest the stroke has no
  // length, and a zero-length stroke with round caps is a dot.
  DOT_SIZES.forEach((size, bucket) => {
    context.beginPath()
    for (const particle of particles) {
      if (particle.bucket !== bucket) continue
      const before = particlePosition(particle, previous)
      const to = particlePosition(particle, flight)
      const dx = (before.x - to.x) * SHUTTER
      const dy = (before.y - to.y) * SHUTTER
      const trail = Math.hypot(dx, dy)
      const fit = trail > MAX_TRAIL ? MAX_TRAIL / trail : 1
      context.moveTo(to.x + dx * fit, to.y + dy * fit)
      context.lineTo(to.x, to.y)
    }
    context.strokeStyle = stage.colors[bucket] ?? FALLBACK_COLORS[0]
    context.lineWidth = size
    context.stroke()
  })
}

/**
 * A word assembled from particles: points sampled from the word's own glyphs
 * fly in from a seeded scatter and settle into the letters.
 *
 * Everything is a function of `frame`, so scrubbing backwards un-assembles the
 * word exactly as it came together. The canvas is redrawn only when the frame,
 * the size, or the word changes.
 */
export function ParticleText({
  frame,
  heading,
  bpm = DEFAULT_BPM,
  start = 0,
  length = 6,
  count = 2800,
  seed = 7
}: ParticleTextProps) {
  const { fps } = useVideoConfig()
  const stageRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [stage, setStage] = useState<Stage | null>(null)
  const safeCount = Math.max(0, Math.min(MAX_COUNT, Math.round(count)))

  useEffect(() => {
    const element = stageRef.current
    if (!element) return undefined

    let cancelled = false
    const measure = () => {
      if (!cancelled) setStage(readStage(element))
    }
    const observer = new ResizeObserver(measure)
    observer.observe(element)
    // Glyphs sampled before the web font loads would be the fallback face.
    void document.fonts.ready.then(measure)

    return () => {
      cancelled = true
      observer.disconnect()
    }
  }, [])

  const particles = useMemo(
    () => (stage ? buildParticles(stage, heading, safeCount, seed) : []),
    [stage, heading, safeCount, seed]
  )

  const startFrame = beatToFrame(start, bpm, fps)
  const flightFrames = Math.max(1, beatToFrame(length, bpm, fps))
  const flight = clamp01((frame - startFrame) / flightFrames)
  const previous = clamp01((frame - 1 - startFrame) / flightFrames)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !stage) return
    drawFrame(canvas, stage, particles, flight, previous)
  }, [stage, particles, flight, previous])

  return (
    <div className="sk-particle-stage" ref={stageRef}>
      <canvas ref={canvasRef} className="sk-particle-canvas" role="img" aria-label={heading} />
    </div>
  )
}
