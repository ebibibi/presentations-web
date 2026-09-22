import type { ReactNode } from 'react'
import { LogoMark } from '../deck-shared'

/**
 * Background treatment. `paper` is the deck default; `ink` inverts for a
 * section break; `accent` tints the paper for a slide that should stand out.
 */
export type SlideTone = 'paper' | 'ink' | 'accent'

export type SlideProps = {
  tone?: SlideTone
  /** Draw the faint motion grid behind the content. */
  grid?: boolean
  /** Place the corner logo mark. Use it on opening and closing slides. */
  logo?: boolean
  /** Centre the content block vertically instead of stacking from the top. */
  center?: boolean
  className?: string
  children: ReactNode
}

/**
 * The slide surface every slide-kit component renders into.
 *
 * It keeps `.remotion-slide`, which is what sizes a slide to the canvas the
 * deck asked for (1280 x 1080 standard, 1920 x 1080 wide). Nothing here sets a
 * width, a height, or a viewport unit, so a slide fits both canvases; layout is
 * flex and percentage based for the same reason.
 */
export function Slide({
  tone = 'paper',
  grid = false,
  logo = false,
  center = false,
  className,
  children
}: SlideProps) {
  const classes = ['remotion-slide', 'sk-slide', `sk-slide-${tone}`]

  if (center) classes.push('sk-slide-center')
  if (className) classes.push(className)

  return (
    <section className={classes.join(' ')}>
      {grid ? <div className="motion-grid" /> : null}
      {logo ? <LogoMark /> : null}
      {children}
    </section>
  )
}
