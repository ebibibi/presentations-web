/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext } from 'react'
import type { ReactNode } from 'react'
import { AbsoluteFill, useCurrentFrame } from 'remotion'
import { useAmbientClockValue } from './ambient-clock'
import { getTheme } from './registry'
import type { DeckTheme } from './registry'

const ThemeContext = createContext<DeckTheme>(getTheme(undefined))

/** The theme of the deck being rendered; `classic` outside a ThemeRoot. */
export function useDeckTheme(): DeckTheme {
  return useContext(ThemeContext)
}

/**
 * Frame number for ambient motion: the viewer's ambient clock when it runs,
 * otherwise the composition frame (a plain Remotion render).
 */
export function useAmbientFrame(): number {
  const clock = useAmbientClockValue()
  const frame = useCurrentFrame()
  return clock ?? frame
}

/**
 * Wraps a composition in its theme: the class the theme stylesheet is scoped
 * to, and the context slide-kit components read their motion profile from.
 */
export function ThemeRoot({ theme, children }: { theme: DeckTheme; children: ReactNode }) {
  const classes = ['deck-theme', theme.className]
  if (theme.ambient) classes.push('deck-theme-ambient')

  return (
    <ThemeContext.Provider value={theme}>
      <AbsoluteFill className={classes.join(' ')}>{children}</AbsoluteFill>
    </ThemeContext.Provider>
  )
}
