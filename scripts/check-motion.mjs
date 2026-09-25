import assert from 'node:assert/strict'
import {
  beatClock,
  beatToFrame,
  clamp01,
  ease,
  frameToBeat,
  mixSeed,
  progress,
  seededRandom
} from '../src/slide-kit/beat.ts'
import { particlePosition, sampleGlyphPoints, scatterParticles } from '../src/slide-kit/particles.ts'

// Unit checks for the pure motion maths behind KineticTitle, ParticleText and
// FilmFinish. Node strips the TypeScript types itself, which is why beat.ts
// and particles.ts must stay free of anything but each other.
const close = (actual, expected, message) =>
  assert.ok(Math.abs(actual - expected) < 1e-9, `${message}: expected ${expected}, got ${actual}`)

// Beats and frames
close(beatToFrame(0, 128, 30), 0, 'beat 0 is frame 0')
close(beatToFrame(4, 120, 30), 60, '4 beats at 120 BPM / 30 fps')
close(beatToFrame(28, 128, 30), 393.75, 'beat 28 at 128 BPM')
close(frameToBeat(beatToFrame(7.5, 128, 30), 128, 30), 7.5, 'frameToBeat inverts beatToFrame')
assert.throws(() => beatToFrame(1, 0, 30), RangeError)
assert.throws(() => beatToFrame(1, 128, Number.NaN), RangeError)

// Easing curves start at 0 and end at 1
for (const [name, curve] of Object.entries(ease)) {
  close(curve(0), 0, `${name}(0)`)
  close(curve(1), 1, `${name}(1)`)
}
assert.ok(ease.backOut(0.6) > 1, 'backOut overshoots')
assert.ok(ease.expoOut(0.2) > 0.7, 'expoOut is fast early')
close(ease.easeInOutCubic(0.5), 0.5, 'easeInOutCubic is symmetric')
for (let t = 0; t <= 1; t += 0.01) {
  assert.ok(ease.bounceOut(t) >= 0 && ease.bounceOut(t) <= 1 + 1e-9, `bounceOut(${t}) stays in range`)
}

// progress clamps the raw fraction
close(progress(-10, 0, 20), 0, 'before start')
close(progress(10, 0, 20), 0.5, 'halfway, linear')
close(progress(99, 0, 20, ease.expoOut), 1, 'after end')
close(progress(5, 5, 0), 1, 'zero duration at start')
close(progress(4, 5, 0), 0, 'zero duration before start')
close(clamp01(Number.NaN), 0, 'NaN clamps to 0')

const clock = beatClock(beatToFrame(4.5, 128, 30), 128, 30)
close(clock.beat, 4.5, 'clock beat')
close(clock.progress(4, 1), 0.5, 'clock progress half a beat in')

// Seeded randomness is repeatable and seed-dependent
const a = seededRandom(42)
const b = seededRandom(42)
const first = Array.from({ length: 5 }, () => a())
assert.deepEqual(first, Array.from({ length: 5 }, () => b()), 'same seed, same sequence')
assert.notDeepEqual(first, Array.from({ length: 5 }, seededRandom(43)), 'other seed, other sequence')
assert.ok(first.every((value) => value >= 0 && value < 1), 'values in [0, 1)')
assert.equal(mixSeed(11, 30), mixSeed(11, 30))
assert.notEqual(mixSeed(11, 30), mixSeed(11, 31))

// Glyph sampling: a 10x10 bitmap with an opaque 4x4 square in the middle
const width = 10
const height = 10
const rgba = new Uint8ClampedArray(width * height * 4)
for (let y = 3; y < 7; y += 1) {
  for (let x = 3; x < 7; x += 1) rgba[(y * width + x) * 4 + 3] = 255
}
const points = sampleGlyphPoints(rgba, width, height, 12, 5, 1)
assert.equal(points.length, 12, 'repeats points when glyphs are small')
assert.ok(points.every(({ x, y }) => x >= 3 && x < 7 && y >= 3 && y < 7), 'only opaque pixels')
assert.deepEqual(points, sampleGlyphPoints(rgba, width, height, 12, 5, 1), 'deterministic')
assert.deepEqual(sampleGlyphPoints(new Uint8ClampedArray(400), width, height, 12, 5, 1), [])

const particles = scatterParticles(points, width, height, 5)
assert.deepEqual(particles, scatterParticles(points, width, height, 5), 'scatter is deterministic')
for (const particle of particles) {
  const start = particlePosition(particle, 0)
  const end = particlePosition(particle, 1)
  close(start.x, particle.from.x, 'flight starts at the scatter point (x)')
  close(start.y, particle.from.y, 'flight starts at the scatter point (y)')
  close(end.x, particle.to.x, 'flight ends on the glyph (x)')
  close(end.y, particle.to.y, 'flight ends on the glyph (y)')
}

console.log('Motion maths check passed.')
