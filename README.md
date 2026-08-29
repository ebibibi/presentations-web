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

## Editing Slide Copy

Copy lives inline in `slides.tsx` (JSX children and data arrays) and in `deck.yaml`
(title, summary, per-slide title and notes). Fixing a typo should not mean reading
around animation code, so two tools extract the strings and write them back into
the exact source range they came from — layout, indentation and everything else in
the file stay untouched.

**In the browser (dev server only).** Run `npm run dev`, open a deck, click the
`✏️ 文字編集` button in the corner, then click any text on the slide. Retype it,
press save, and the string is written back to source; Vite hot-reloads the slide.
When the same string also appears in `deck.yaml` (slide headings usually do), the
editor offers to change every occurrence at once so the timeline title cannot drift
away from the slide. The editor is behind `import.meta.env.DEV` and is not part of
the production bundle.

**Keeping the editor up.** The local server runs as a system unit so it survives
reboots, the same shape as the machine's other always-on services
(`scheduler.service`, `discord-bot.service`) — a system unit under
`/etc/systemd/system` with `User=ebi`, not a `--user` unit:

```bash
sudo cp presentations-dev.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now presentations-dev
systemctl status presentations-dev
journalctl -u presentations-dev -f
```

The unit pins port 5173 with `--strictPort` so a clash fails loudly rather than
moving the server to a port the link cannot find, and sets `PATH` explicitly
because node lives in `~/.local/bin`, which systemd does not have on its path.

**Getting to the editor from the published site.** The published site cannot edit
its own copy, so a signed-in owner sees a `✏️ ローカルで編集` link that opens the
same path on the local dev server (`src/edit/LocalEditorLink.tsx`). The addresses
are private-range and configurable through `VITE_LOCAL_EDITOR_HOSTS` at build
time or the `deck-local-editor-hosts` localStorage key in the browser. It is a
plain link on purpose: an HTTPS page may not fetch a private address, so the site
cannot tell whether the dev server is up — it only offers the door.

**In production.** Signed in as an owner on `presentations.ebisuda.net`, the same
editor appears. There is no checkout there, so a save is a commit on GitHub
instead of a file write: the copy index published with the build
(`/deck-text/<slug>.json`) locates the string, a Pages Function re-verifies the
range against the file on the default branch, and one commit carries every file
the edit touched. The change appears on the site when that deploy finishes,
usually a minute or two later — the editor says so rather than pretending the
page updated.

Production editing is optional and currently unconfigured, so the editor itself
does not appear there — the link above is the way in. It needs two variables on
the Pages project, and stays hidden until both are set (the editor is never even
downloaded by a visitor):

| variable | value |
| --- | --- |
| `GITHUB_REPO` | `ebibibi/presentations-web` |
| `GITHUB_TOKEN` | fine-grained token, **Contents: Read and write** on this repository only, stored as a secret |

**Saving publishes.** By default a save also commits the touched files and pushes
the current branch, so a fix from a phone is live without going back to a
terminal — on `main` that means a production deploy about a minute later. The
commit is restricted to the files the save wrote (`git commit -- <paths>`), so
unrelated work in the checkout is never swept in. Uncheck "保存したら公開" in the
editor to keep saves local; the choice is remembered. If the push is rejected
because the remote moved, the editor rebases and retries when the checkout is
otherwise clean, and otherwise says so — the copy is already saved and committed
locally either way.

**From a phone.** `npm run dev` already listens on `0.0.0.0`, so open
`http://moviegen:5173/decks/<slug>` from a device on the same network or over
Tailscale — the same address the owner-only link uses. Vite rejects any Host it
was not told about, so a different machine name needs adding to
`server.allowedHosts` in `vite.config.ts`; the IP printed by Vite always works
and needs no entry. At phone scale a slide is scaled down until body copy is a
few pixels tall, so tapping an exact word is not realistic: on narrow screens the
edit button opens a list of the copy on the current slide instead, and the editor
docks to the bottom of the screen. Strings the rewriter cannot resolve (slide
numbering, generated labels) are filtered out of that list.

The dev endpoints rewrite source and can push, so they require a custom request
header and reject a cross-origin `Origin` — a page you happen to be visiting
cannot drive them, because a cross-origin request can only omit the preflight if
it sends no custom headers. That is protection against a drive-by page, not
against the network: a dev server on `0.0.0.0` trusts everyone who can reach it,
so use it on a network you trust.

**From the terminal.**

```bash
npm run text:list                  # deck slugs
npm run text agentic-loops         # dump every editable string to tmp/deck-text/<slug>.txt
npm run text:apply agentic-loops   # write the edited dump back into the deck
```

The dump records a fingerprint of both source files. If the deck changed after the
dump was written, `text:apply` refuses rather than clobbering that change
(`--force` overrides).

`npm run check:text` (part of `npm run build`) proves the rewriter is lossless: for
every deck it re-encodes all strings and verifies that a no-op rewrite is byte
identical, that quote characters survive re-parsing, and that copy containing JSX
syntax still produces a parsable file.

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
npm run check:recording
npm run check:mobile-header
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

## Authentication

The public archive is readable without login. Recording mode is owner-only.
Private decks are also owner-only and are served from Cloudflare KV through
Pages Functions; their text should not be committed into this public repository.

Authentication uses Google Identity Services and Cloudflare Pages Functions:

- Frontend receives a Google ID token.
- `/api/auth/login` verifies the token with Google.
- Only emails in `ALLOWED_OWNER_EMAILS` receive a signed session cookie.
- Users with `canRecord: true` see the recording button.
- Direct access to `/decks/{slug}/studio` shows a login gate unless the session can record.
- `/api/private/decks` returns KV-backed private deck data only when the session has `canRecord: true`.

Runtime configuration:

- `GOOGLE_CLIENT_ID` — Google OAuth web client ID in `wrangler.toml`.
- `ALLOWED_OWNER_EMAILS` — comma-separated Cloudflare Pages secret for emails allowed to record.
- `AUTH_SECRET` — long random Cloudflare Pages secret used to sign session cookies.
- `PRIVATE_DECKS` — Cloudflare KV namespace binding. Key `decks` stores owner-only deck JSON.

The current allowed owner email is configured in Cloudflare, not hard-coded in the app.

## Recording Surface

Owner studio pages include a dedicated recording surface:

- 1920 x 1080 total output.
- 1280 x 1080 slide area on the left.
- 640 x 1080 reserved area on the right.
- The `全画面撮影` button fullscreenes only that recording surface, not the whole studio page.

Run `npm run check:recording` to render the production build in Chromium, enter recording fullscreen, assert the dimensions, and write `tmp/recording-surface.png`.

## Header on small screens

The header keeps the sign-in control at every viewport width. Below `680px` the Google button switches to its icon form and below `430px` the brand drops to its icon, which is what keeps the single 64px row from overflowing on a phone.

Run `npm run check:mobile-header` to assert, from `1280px` down to `320px`, that the sign-in control stays visible, keeps a 44px tap target, and never pushes the header past the viewport.

## Future Work

- YouTube Data API sync for titles, publication dates, and thumbnails.
- Build-time OGP image generation from the first slide.
- Per-user deck ownership and SaaS-grade authorization.
- PR-based AI deck generation workflow.
- Optional Remotion rendering pipeline for generated video assets.
