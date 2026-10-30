/**
 * Slide themes. See registry.ts for how a deck picks one and
 * docs/ai-deck-authoring.md ("Themes") for adding next month's.
 *
 * Every theme stylesheet is imported here so a theme only needs a registry
 * entry and its CSS file to be available to every deck.
 */
import './ambient.css'
import './sumi.css'

export { AmbientBackdrop } from './AmbientBackdrop'
export { isManualAmbient, setAmbientFrame, useAmbientClockDriver } from './ambient-clock'
export { DEFAULT_THEME_ID, THEMES, THEME_IDS, getTheme, resolveTheme, resolveThemeId } from './registry'
export type { DeckTheme, ThemeId, ThemeMotion } from './registry'
export { ThemeRoot, useAmbientFrame, useDeckTheme } from './ThemeRoot'
