# 0002. Private Deck Storage

Date: 2026-07-05

## Status

Accepted

## Context

The site is a public Cloudflare Pages application backed by a public GitHub
repository. Draft decks under `content/decks` are hidden from public navigation,
but their React components are still included in the static JavaScript bundle.
That is acceptable for pre-release public material, but not for private or paid
article material that must not be visible to public visitors.

The platform needs owner-only decks for recording workflows while preserving the
static public archive and simple Pages deployment path.

## Decision

Private deck text is stored outside the public repository and static bundle.

- Cloudflare KV namespace `PRIVATE_DECKS` stores private deck JSON under key
  `decks`.
- Cloudflare Pages Function `/api/private/decks` verifies the signed
  `presentation_session` cookie using `AUTH_SECRET`.
- The API returns private deck data only when the verified session has
  `canRecord: true`.
- `ALLOWED_OWNER_EMAILS` remains a Pages secret. For production, it is set to
  `ebibibi@gmail.com`.
- The React app fetches private decks only after owner auth succeeds, then merges
  them into the existing deck routing/listing model.
- The public bundle contains only a generic data-driven private deck renderer,
  not private deck text.

## Consequences

- Public visitors and unauthenticated requests cannot fetch private deck data.
- Private deck text is not committed to the public repository and does not ship
  in static JavaScript assets.
- Public static decks keep the existing `content/decks/{slug}` authoring model.
- Private decks need an operational step to update KV key `decks`.
- `status: draft` remains UI-level gating. Use `status: private` and the KV
  storage path for hard access control.

## Verification

- Local lint and build passed.
- API unit check confirmed unauthenticated requests return 403 and signed owner
  sessions return the private deck.
- Production check confirmed
  `https://presentations.ebisuda.net/api/private/decks` returns 403 without a
  session.
- Production deployment `f2a64048-3001-4a5b-872e-c8a286c310fa` serves commit
  `ef66ba48488f17851043ee71a1a15d95c8fefe59`.
