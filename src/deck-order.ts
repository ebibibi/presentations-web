import type { DeckMeta } from './types'

// The archive is read as a timeline: "what is new, and what did I miss?".
// Ordering it by hand (the old `order` field) drifted the moment a deck was
// added without touching every other deck, so the order is derived instead.
//
// A deck exists because of the talk or video it was written for, so the
// video's publish date wins when there is one. `updatedAt` is deliberately
// not used: fixing a typo must not throw a deck back to the top.

export function deckTimelineDate(meta: DeckMeta): string {
  const published = meta.youtube?.publishedAt?.slice(0, 10)
  return published && published >= meta.createdAt ? published : meta.createdAt
}

/** Newest first, with the slug as a tiebreaker so the order never wobbles. */
export function compareDecksNewestFirst(left: DeckMeta, right: DeckMeta): number {
  const byDate = deckTimelineDate(right).localeCompare(deckTimelineDate(left))
  return byDate !== 0 ? byDate : left.slug.localeCompare(right.slug)
}

/** `2026-09-10` → `2026.09.10`. Anything unparsed is shown as written. */
export function formatDeckDate(value: string): string {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})/)
  return match ? `${match[1]}.${match[2]}.${match[3]}` : value
}
