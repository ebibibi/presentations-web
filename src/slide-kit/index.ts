/**
 * Slide kit — the reusable slide components decks are built from.
 *
 * Read docs/slide-kit.md before using these. The short version:
 *
 * - Copy travels as string props (`kicker`, `heading`, `lead`, `body`, `items`,
 *   `rows`, …) or as JSX children. Those prop names are registered in
 *   COPY_ATTRIBUTES (scripts/deck-text-core.mjs); copy passed under any other
 *   prop name disappears from the click-to-edit layer for good.
 * - Nothing here fixes a width, a height, or a viewport unit, so a slide fits
 *   both the 1280 x 1080 studio canvas and the 1920 x 1080 wide canvas.
 *
 * The stylesheet is imported here so a deck gets it by importing a component.
 */
import './slide-kit.css'

export { BRAND, CtaSlide, LogoMark } from '../deck-shared'
export type { CtaAction } from '../deck-shared'

export { STAGGER_STEP, entrance, lift, useBeat, useEnter, useStagger } from './motion'
export type { StaggerOptions } from './motion'

export {
  DEFAULT_BPM,
  beatClock,
  beatToFrame,
  clamp01,
  ease,
  frameToBeat,
  mixSeed,
  progress,
  seededRandom
} from './beat'
export type { BeatClock, Ease, EaseName } from './beat'

export { Slide } from './Slide'
export type { SlideProps, SlideTone } from './Slide'

export { renderLines } from './lines'
export { SlideHeading } from './SlideHeading'
export type { SlideHeadingProps } from './SlideHeading'

export { TitleSlide } from './TitleSlide'
export type { TitlePoint, TitleSlideProps } from './TitleSlide'

export { SectionDivider } from './SectionDivider'
export type { SectionDividerProps } from './SectionDivider'

export { Terminal } from './Terminal'
export type { TerminalLine, TerminalLineKind, TerminalProps } from './Terminal'

export { CodeSlide } from './CodeSlide'
export type { CodeSlideProps } from './CodeSlide'

export { ComparisonTable } from './ComparisonTable'
export type { ComparisonColumn, ComparisonRow, ComparisonTableProps } from './ComparisonTable'

export { Timeline } from './Timeline'
export type { TimelineProps, TimelineStep } from './Timeline'

export { DiagramFrame, FlowDiagram } from './DiagramFrame'
export type { DiagramFrameProps, FlowDiagramProps, FlowNode } from './DiagramFrame'

export { Callout, Quote } from './Callout'
export type { CalloutProps, CalloutTone, QuoteProps } from './Callout'

export { VideoSlide } from './VideoSlide'
export type { VideoSlideProps } from './VideoSlide'

export { KineticTitle } from './KineticTitle'
export type { KineticEnter, KineticTitleProps } from './KineticTitle'

export { ParticleText } from './ParticleText'
export type { ParticleTextProps } from './ParticleText'

export { FilmFinish } from './FilmFinish'
export type { FilmFinishProps } from './FilmFinish'
