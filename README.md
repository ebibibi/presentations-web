# Ebisuda Presentations

Personal web presentation platform for publishing YouTube-linked rich slide decks at `presentations.ebisuda.net`.

## Goals

- Publish video-linked presentation archives with one URL.
- Support both studio recording and audience reading workflows.
- Keep deck creation friendly to code-generation agents.
- Start as a static Cloudflare Pages site, while leaving room for authentication, membership access, and SaaS features later.

## Architecture

- Vite + React + TypeScript for the static web app.
- `@remotion/player` + `remotion` for rich timeline-based slide rendering in the browser.
- YAML deck metadata under `content/decks/*/deck.yaml`.
- React slide components under `content/decks/*/slides.tsx`.
- Cloudflare Pages deployment via GitHub Actions.

The repository is intentionally separate from the existing `ebisuda.net` Hugo repository. The main site already has multiple Cloudflare Pages projects and Worker routing. This project uses a subdomain and can later be split, authenticated, or productized without adding risk to the main site.

## Deck Structure

```text
content/decks/my-deck/
  deck.yaml
  slides.tsx
```

`deck.yaml` owns public metadata:

- `slug`
- `title`
- `summary`
- `status`
- `visibility`
- `youtube`
- `slides`

`slides.tsx` owns the visual implementation. The number of slide components must match the number of slide metadata entries.

## Local Development

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Build

```bash
npm run lint
npm run build
```

## Deployment

GitHub Actions runs lint and build for pull requests and pushes to `main`.

Required repository secrets:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

Cloudflare Pages project name:

- `presentations-ebisuda-net`

Production custom domain:

- `presentations.ebisuda.net`

## Google Analytics

Set `VITE_GA_MEASUREMENT_ID` in the Cloudflare Pages environment.

## Future Work

- YouTube Data API sync for titles, publication dates, and thumbnails.
- Build-time OGP image generation from the first slide.
- Private and members-only decks through an auth layer.
- PR-based AI deck generation workflow.
- Optional Remotion rendering pipeline for generated video assets.
