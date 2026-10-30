/**
 * Slide themes.
 *
 * A theme is a class on the composition root (see ThemeRoot) plus a stylesheet
 * that sets CSS custom properties under that class. The slide kit and the base
 * `.remotion-slide` rule read those properties and fall back to the `classic`
 * values, so `classic` needs no stylesheet and renders exactly as before.
 *
 * A deck picks its theme with `theme:` in deck.yaml. Without it, the deck gets
 * the newest theme whose `from` date is on or before the deck's `createdAt`;
 * decks older than every dated theme stay `classic`. That is what keeps a
 * published deck from changing when next month's theme lands: give the new
 * theme a `from` date no earlier than the day it is merged.
 *
 * This file is plain TypeScript with no imports so node scripts
 * (scripts/check-decks.mjs) can load it with type stripping.
 */

/** `calm` is the original entrance; `lively` adds blur, a little overshoot and drawn rules. */
export type ThemeMotion = 'calm' | 'lively'

export type DeckTheme = {
  id: string
  /** Human name, shown nowhere on the slide; for docs and capture.json. */
  label: string
  /** First `createdAt` (YYYY-MM-DD) that picks this theme automatically. Omit for opt-in only. */
  from?: string
  /** Class set on the composition root; the theme stylesheet is scoped to it. */
  className: string
  /** Draw the frame-driven ambient backdrop (drifting light, grain) behind kit slides. */
  ambient: boolean
  motion: ThemeMotion
  /** Light sweep drawn across the slide-to-slide transition. */
  transition: { tint: string; blend: 'multiply' | 'screen' }
}

export const THEMES = [
  {
    id: 'classic',
    label: 'Classic paper',
    className: 'theme-classic',
    ambient: false,
    motion: 'calm',
    transition: { tint: 'rgba(20, 117, 111, 0.18)', blend: 'multiply' }
  },
  {
    // November 2026. Sumi ink and vermilion: a warm charcoal ground, warm
    // off-white type, one vermilion accent and a quiet brass secondary.
    // Starts on 2026-10-30, the day it was merged, so the next video gets it.
    id: 'sumi',
    label: 'Sumi (2026-11)',
    from: '2026-10-30',
    className: 'theme-sumi',
    ambient: true,
    motion: 'lively',
    transition: { tint: 'rgba(234, 106, 71, 0.16)', blend: 'screen' }
  }
] as const satisfies readonly DeckTheme[]

export type ThemeId = (typeof THEMES)[number]['id']

export const THEME_IDS = THEMES.map((theme) => theme.id) as [ThemeId, ...ThemeId[]]

export const DEFAULT_THEME_ID: ThemeId = 'classic'

export function getTheme(id: string | undefined): DeckTheme {
  return THEMES.find((theme) => theme.id === id) ?? THEMES[0]
}

/** The theme a deck renders with: its own `theme:`, else the newest dated theme it postdates. */
export function resolveThemeId(meta: { theme?: string; createdAt: string }): ThemeId {
  const explicit = THEMES.find((theme) => theme.id === meta.theme)
  if (explicit) return explicit.id

  const created = meta.createdAt.slice(0, 10)
  let picked: { id: ThemeId; from: string } | null = null

  for (const theme of THEMES) {
    if (!('from' in theme)) continue
    if (theme.from <= created && (!picked || theme.from > picked.from)) {
      picked = { id: theme.id, from: theme.from }
    }
  }

  return picked?.id ?? DEFAULT_THEME_ID
}

export function resolveTheme(meta: { theme?: string; createdAt: string }): DeckTheme {
  return getTheme(resolveThemeId(meta))
}
