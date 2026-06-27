# Repository Instructions

This is the source for `presentations.ebisuda.net`, a public browser-based presentation platform.

## Language

This repository is intended to be public. Use English for code comments, README updates, commits, issues, and pull requests.

## Content Model

- Deck metadata lives in `content/decks/*/deck.yaml`.
- Deck visuals live in `content/decks/*/slides.tsx`.
- Keep metadata and slide component counts in sync.
- `status` drives visibility (see `src/visibility.ts`):
  - `public` — listed in the archive and openable by anyone.
  - `unlisted` — openable by direct URL, hidden from the archive list.
  - `draft` / `private` — hidden from the public; only a signed-in owner (`auth.canRecord`) sees and can open them. Use this for a deck staged before its video airs.
  - **To publish, change `status: draft` to `status: public` and merge — that one line is the switch.**
  - This is UI-level gating: a draft deck's content still ships in the static bundle, so it is not hard access control.
- `visibility` is currently unused metadata; gate on `status`.
- Read [docs/ai-deck-authoring.md](docs/ai-deck-authoring.md) before creating or heavily editing a deck.

## Implementation Rules

- Keep the app static unless a backend is genuinely required.
- Prefer reusable slide components before adding one-off patterns.
- Preserve the 1280 x 1080 slide canvas for studio mode.
- Preserve the right-side studio panel as the future home for notes, live transcription, and AI guidance.
- Preserve the dedicated 1920 x 1080 recording surface: 1280 x 1080 slide area on the left and 640 x 1080 reserved area on the right.
- Public visitors should be guided to audience/read-only deck pages. Studio mode is for the site owner only and should not be promoted in the public archive UI.
- Recording access is controlled by the auth session returned from `/api/auth/session`. Do not show owner recording controls unless `canRecord` is true.
- Links and text selection inside slides should remain usable. Avoid full-screen pointer overlays.
- Treat each deck as public content unless access control is implemented and verified. Do not include private, customer, family, or employer-sensitive details.
- Do not add large binary assets unless they are required for the deck and are reasonably optimized for Cloudflare Pages.
- Keep mobile reading usable. The slide canvas can remain fixed-format, but surrounding controls and archive pages must not overflow on 390px-wide screens.
- Keep the MVP deployment path simple: static build, GitHub Actions, Cloudflare Pages.
- Auth secrets and allowed owner emails belong in Cloudflare Pages environment variables, not in source code.

## AI Deck Creation Flow

When asked to create a new deck:

1. Choose a short lowercase slug, for example `copilot-cowork-ga`.
2. Create `content/decks/{slug}/deck.yaml`.
3. Create `content/decks/{slug}/slides.tsx`.
4. Write metadata first: title, summary, status, visibility, dates, tags, optional YouTube data, and slide entries.
5. Implement exactly one rendered slide component per slide metadata entry.
6. Keep the first version focused. Prefer 5-12 strong slides over many text-heavy slides.
7. Use Remotion only where timing or animation improves the presentation.
8. Verify desktop and mobile layouts before finishing.

If a user asks for a deck from a rough topic, produce a complete first draft without asking for every detail. Use `status: draft` until the user explicitly approves publication.

## Verification

Run before handing off code changes:

```bash
npm run lint
npm run build
```

For visual deck changes, also inspect at least:

- `/decks/{slug}`
- `/decks/{slug}/studio` when changing owner recording workflows
- a mobile viewport around `390 x 844`

When changing the recording workflow, run:

```bash
npm run check:recording
```
