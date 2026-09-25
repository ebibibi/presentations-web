/**
 * Particle maths for ParticleText, kept apart from the canvas so it can be
 * checked under Node (`scripts/check-motion.mjs`). No DOM, no Math.random:
 * the same inputs always give the same particles, which is what lets a slide
 * be scrubbed backwards and still show the same frame.
 *
 * Like beat.ts, this file must only import other import-free kit modules.
 */
import { clamp01, ease, seededRandom } from './beat.ts'

export type Point = { x: number; y: number }

export type Particle = {
  from: Point
  to: Point
  /** Fraction of the flight time this particle waits before leaving. */
  delay: number
  /** Sideways bend of the flight path, in canvas pixels. */
  swirl: number
  /** Colour bucket, 0..buckets-1. */
  bucket: number
}

/**
 * Picks `count` points from the opaque pixels of an RGBA bitmap (a word drawn
 * on an offscreen canvas). Pixels are read on a `step` grid, then a seeded
 * shuffle chooses which ones become particles. When the glyphs have fewer
 * candidate pixels than particles, points repeat rather than the word thinning.
 */
export function sampleGlyphPoints(
  rgba: ArrayLike<number>,
  width: number,
  height: number,
  count: number,
  seed: number,
  step = 2
): Point[] {
  const candidates: Point[] = []

  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      if (rgba[(y * width + x) * 4 + 3] > 128) candidates.push({ x, y })
    }
  }

  if (!candidates.length || count <= 0) return []

  const random = seededRandom(seed)
  const order = candidates.map((_, index) => index)

  for (let index = order.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1))
    const held = order[index]
    order[index] = order[swap]
    order[swap] = held
  }

  return Array.from({ length: count }, (_, index) => candidates[order[index % order.length]])
}

/**
 * Gives every target point a start position scattered across the stage, a
 * stagger and a bend, all from the seed. Starts stay inside the stage so no
 * particle is cut off at its edge.
 */
export function scatterParticles(
  targets: Point[],
  width: number,
  height: number,
  seed: number,
  buckets = 3
): Particle[] {
  const random = seededRandom(seed ^ 0x9e3779b9)
  const reach = Math.min(width, height)

  return targets.map((to) => {
    return {
      from: { x: random() * width, y: random() * height },
      to,
      delay: random() * 0.35,
      swirl: (random() - 0.5) * reach * 0.3,
      bucket: Math.floor(random() * buckets) % buckets
    }
  })
}

/**
 * Where a particle is at a given overall flight progress (0..1, linear). Each
 * particle runs its own expo-out flight inside that window, after its delay.
 */
export function particlePosition(particle: Particle, flight: number): Point {
  const own = clamp01((flight - particle.delay) / (1 - particle.delay))
  const t = ease.expoOut(own)
  const dx = particle.to.x - particle.from.x
  const dy = particle.to.y - particle.from.y
  const length = Math.hypot(dx, dy) || 1
  const bend = Math.sin(Math.PI * t) * particle.swirl

  return {
    x: particle.from.x + dx * t + (-dy / length) * bend,
    y: particle.from.y + dy * t + (dx / length) * bend
  }
}
