import { useCallback, useSyncExternalStore } from 'react'

/**
 * Subscribes to a CSS media query so layout-dependent rendering (for example the
 * compact Google sign-in button) can follow the same breakpoints as styles.css.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      if (!window.matchMedia) {
        return () => undefined
      }

      const mediaQuery = window.matchMedia(query)
      mediaQuery.addEventListener('change', onChange)

      return () => mediaQuery.removeEventListener('change', onChange)
    },
    [query]
  )

  const getSnapshot = useCallback(
    () => window.matchMedia?.(query).matches ?? false,
    [query]
  )

  return useSyncExternalStore(subscribe, getSnapshot, () => false)
}
