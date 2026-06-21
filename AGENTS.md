# Repository Instructions

This is the source for `presentations.ebisuda.net`, a public browser-based presentation platform.

## Language

This repository is intended to be public. Use English for code comments, README updates, commits, issues, and pull requests.

## Content Model

- Deck metadata lives in `content/decks/*/deck.yaml`.
- Deck visuals live in `content/decks/*/slides.tsx`.
- Keep metadata and slide component counts in sync.
- Use `status: draft` for unpublished work.
- Use `visibility: public | members | private` even though access control is not implemented yet.

## Implementation Rules

- Keep the app static unless a backend is genuinely required.
- Prefer reusable slide components before adding one-off patterns.
- Preserve the 1280 x 1080 slide canvas for studio mode.
- Preserve the right-side studio panel as the future home for notes, live transcription, and AI guidance.
- Links and text selection inside slides should remain usable. Avoid full-screen pointer overlays.

## Verification

Run before handing off code changes:

```bash
npm run lint
npm run build
```
