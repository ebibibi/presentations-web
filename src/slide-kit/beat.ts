/**
 * Beat timing and easing — the arithmetic behind the kit's motion-graphics
 * components (KineticTitle, ParticleText, FilmFinish).
 *
 * Motion is authored in beats rather than frames: "the third word lands on beat
 * 3" stays true when the frame rate changes, and a soundtrack at the same BPM
 * lines up with the picture without anyone converting by hand. Everything here
 * is a pure function of its arguments, so a slide scrubbed to frame N always
 * looks the same, and the maths is checked by `scripts/check-motion.mjs`.
 *
 * This file must stay free of imports: the check runs it directly under Node.
 */

/** Tempo the kit uses when a component is not given one. */
export const DEFAULT_BPM = 128

/** An easing curve: 0 → 1 in, 0 → 1 out (overshoot allowed for `backOut`). */
export type Ease = (t: number) => number

const BACK_OVERSHOOT = 1.70158

function bounceOut(t: number): number {
  const n1 = 7.5625
  const d1 = 2.75

  if (t < 1 / d1) return n1 * t * t
  if (t < 2 / d1) {
    const u = t - 1.5 / d1
    return n1 * u * u + 0.75
  }
  if (t < 2.5 / d1) {
    const u = t - 2.25 / d1
    return n1 * u * u + 0.9375
  }
  const u = t - 2.625 / d1
  return n1 * u * u + 0.984375
}

/**
 * Named curves. `expoOut` is fast then gently stops (a slide-in), `backOut`
 * overshoots and settles (a pop), `bounceOut` drops and bounces.
 */
export const ease = {
  linear: (t: number) => t,
  expoOut: (t: number) => (t >= 1 ? 1 : 1 - 2 ** (-10 * t)),
  backOut: (t: number) => {
    const u = t - 1
    return 1 + (BACK_OVERSHOOT + 1) * u ** 3 + BACK_OVERSHOOT * u ** 2
  },
  bounceOut,
  easeInOutCubic: (t: number) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2)
} satisfies Record<string, Ease>

export type EaseName = keyof typeof ease

function assertPositive(name: string, value: number) {
  if (!Number.isFinite(value) || value <= 0) {
    throw new RangeError(`${name} must be a positive number, got ${value}`)
  }
}

/** Clamps to 0..1. */
export function clamp01(value: number): number {
  if (Number.isNaN(value)) return 0
  return Math.min(1, Math.max(0, value))
}

/** Frame at which a beat lands. Beat 0 is frame 0 of the slide. */
export function beatToFrame(beat: number, bpm: number, fps: number): number {
  assertPositive('bpm', bpm)
  assertPositive('fps', fps)
  return (beat * 60 * fps) / bpm
}

/** The beat a frame falls on, fractional between beats. */
export function frameToBeat(frame: number, bpm: number, fps: number): number {
  assertPositive('bpm', bpm)
  assertPositive('fps', fps)
  return (frame * bpm) / (60 * fps)
}

/**
 * Eased progress of an animation that starts at `startFrame` and lasts
 * `durationFrames`. The raw fraction is clamped to 0..1 before easing, so the
 * result is 0 before the start and exactly `curve(1)` after the end; only an
 * overshooting curve such as `backOut` leaves 0..1 in between.
 */
export function progress(
  frame: number,
  startFrame: number,
  durationFrames: number,
  curve: Ease = ease.linear
): number {
  if (durationFrames <= 0) return frame >= startFrame ? curve(1) : curve(0)
  return curve(clamp01((frame - startFrame) / durationFrames))
}

export type BeatClock = {
  /** Current beat, fractional. */
  beat: number
  /** Frame at which `beat` lands. */
  frameOf: (beat: number) => number
  /** Eased progress of an animation starting on `beat` and lasting `beats`. */
  progress: (beat: number, beats: number, curve?: Ease) => number
}

/** Beat arithmetic bound to one tempo and one frame. `useBeat` wraps this. */
export function beatClock(frame: number, bpm: number, fps: number): BeatClock {
  const frameOf = (beat: number) => beatToFrame(beat, bpm, fps)

  return {
    beat: frameToBeat(frame, bpm, fps),
    frameOf,
    progress: (beat, beats, curve = ease.linear) =>
      progress(frame, frameOf(beat), frameOf(beats), curve)
  }
}

/**
 * Seeded pseudo-random generator (mulberry32). Motion must not call
 * Math.random: a scrubbed or re-rendered frame has to come out identical.
 */
export function seededRandom(seed: number): () => number {
  let state = seed >>> 0

  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Mixes several integers into one seed, e.g. a base seed and a frame. */
export function mixSeed(...parts: number[]): number {
  let hash = 0x811c9dc5

  for (const part of parts) {
    hash = Math.imul(hash ^ (Math.floor(part) >>> 0), 0x01000193) >>> 0
    hash ^= hash >>> 13
  }

  return hash >>> 0
}
