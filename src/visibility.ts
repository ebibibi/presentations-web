import type { DeckMeta } from './types'

export type DeckStatus = DeckMeta['status']

// Visibility is driven by the deck's `status` field. The site ships a single
// static bundle shared by everyone, so the "owner" is simply a viewer who is
// signed in with recording rights (auth.canRecord). The owner always sees and
// can open every deck (needed to preview/record before release); the public
// only sees published decks.
//
//   public   → listed in the archive + openable by anyone
//   unlisted → openable by direct URL, but hidden from the archive list
//   draft    → owner only (hidden from the list and not openable publicly)
//   private  → owner only (same as draft here)
//
// To publish a deck, change `status: draft` to `status: public` in its
// deck.yaml and merge. That single line is the publish switch.
//
// Note: this hides drafts from the UI, but a draft deck's content is still
// present in the downloaded JS bundle. That is fine for staging a course
// before its video airs; it is not cryptographic access control.

export function isDeckListed(status: DeckStatus, isOwner: boolean): boolean {
  return isOwner || status === 'public'
}

export function isDeckAccessible(status: DeckStatus, isOwner: boolean): boolean {
  return isOwner || status === 'public' || status === 'unlisted'
}

export function isPublished(status: DeckStatus): boolean {
  return status === 'public' || status === 'unlisted'
}
