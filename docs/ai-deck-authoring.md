# AI Deck Authoring Guide

This repository is designed so coding agents can create browser-native presentation decks by adding files under `content/decks`.

## Mental Model

A deck is not a PowerPoint file. It is a small content module:

- `deck.yaml` describes the deck and every slide.
- `slides.tsx` renders the visual slide components.
- The site renders the same deck in audience mode and studio mode.

Audience mode is for viewers reading the material later. Studio mode reserves the right third of the screen for camera, notes, transcription, and future AI guidance while keeping a 1280 x 1080 slide canvas on the left.

## File Layout

Create one directory per deck:

```text
content/decks/{slug}/
  deck.yaml
  slides.tsx
```

Use lowercase kebab-case slugs:

```text
copilot-cowork-ga
claude-code-hooks
azure-local-zero-touch
```

## Metadata

`deck.yaml` must match the schema in `src/schema.ts`.

Minimal example:

```yaml
slug: copilot-cowork-ga
title: Copilot CoWork GA
summary: A concise explanation of Copilot CoWork GA and the operational points creators should understand.
status: draft
visibility: public
createdAt: "2026-06-21"
updatedAt: "2026-06-21"
tags:
  - copilot
  - ai
  - microsoft
youtube:
  id: wCs4irvUGp4
  url: https://www.youtube.com/watch?v=wCs4irvUGp4
  title: Copilot CoWork GA explained
slides:
  - id: opening
    title: Opening
    durationInFrames: 120
    notes: Introduce the core premise in one sentence.
  - id: why-it-matters
    title: Why it matters
    durationInFrames: 150
    notes: Explain the practical change for viewers.
```

Rules:

- Use `status: draft` for new decks.
- Use `visibility: public` unless access control is implemented.
- Keep `slides` in the same order as the rendered components in `slides.tsx`.
- The number of metadata slide entries must equal the number of rendered slide entries.
- Put speaker notes in `notes`; studio mode can display them.

## Slide Module

Each `slides.tsx` exports `slides`.

```tsx
import type { SlideModule, SlideRenderContext } from '../../../src/types'

export const slides: SlideModule['slides'] = [
  {
    render: (props) => <OpeningSlide {...props} />
  },
  {
    render: (props) => <WhyItMattersSlide {...props} />
  }
]

function OpeningSlide({ frame }: SlideRenderContext) {
  return (
    <section className="remotion-slide opening-slide">
      <span className="slide-kicker">Copilot CoWork</span>
      <h1>Copilot CoWork GA</h1>
      <p>What changed, why it matters, and how to use it safely.</p>
    </section>
  )
}

function WhyItMattersSlide({ frame }: SlideRenderContext) {
  return (
    <section className="remotion-slide">
      <span className="slide-kicker">Why it matters</span>
      <h1>AI output becomes an operational artifact</h1>
      <p>Design review, auditability, and cost control around the completed work.</p>
    </section>
  )
}
```

Use the `frame` value when animation adds meaning. If the slide is static, it is fine not to use Remotion animation.

## Slide Design Rules

- Design for a 1280 x 1080 canvas.
- Use short phrases, not article paragraphs.
- Prefer one idea per slide.
- Keep text large enough to survive mobile downscaling.
- Use hard line breaks intentionally for Japanese headlines.
- Avoid negative letter spacing.
- Avoid viewport-width font scaling.
- Avoid nested cards and decorative blobs.
- Use real visual structure: diagrams, timelines, code blocks, comparisons, and screenshots when helpful.
- Do not cover the whole slide with an external click overlay; links and text selection should remain usable.

## Recommended Deck Shape

For a first draft, use this structure:

1. Opening: title and promise.
2. Context: why this topic matters now.
3. Core concept: the main idea in one diagram or sentence.
4. Details: 2-5 slides that explain the mechanism.
5. Practical workflow: what the viewer should do.
6. Risks or caveats.
7. Summary.
8. Links or next steps.

Keep the first draft compact. A good initial AI-generated deck is usually 5-12 slides.

## Studio Mode

Studio mode uses the right-side panel for:

- speaker notes
- future live transcription
- future AI advice
- future camera or recording controls

Do not remove or repurpose that area for the slide itself. The slide should remain in the left-side 1280 x 1080 canvas.

## Audience Mode

Audience mode should be readable after the video is published.

Make sure:

- the deck works without the YouTube video
- slide links open normally
- the URL hash can point to a specific slide
- mobile controls do not dominate the screen

## Assets

Prefer CSS, HTML, and lightweight React components for MVP decks.

If assets are needed:

- place them under the deck directory, for example `content/decks/{slug}/assets/`
- optimize image sizes
- use descriptive filenames
- avoid committing private screenshots or proprietary material

## Safety

This is a public repository and public website.

Do not include:

- family or personal private information
- customer-specific details
- JBS internal or employer-sensitive details
- credentials, tenant IDs, tokens, or private URLs
- unlicensed copyrighted assets

If unsure, omit the detail and add a TODO in the deck notes.

## Verification Checklist

Before finishing:

```bash
npm run lint
npm run build
```

For visual changes, inspect:

- `http://localhost:5179/decks/{slug}`
- `http://localhost:5179/decks/{slug}/studio`
- mobile viewport around `390 x 844`

Check for:

- text cut off inside slides
- mobile overflow
- controls covering content
- slide metadata count mismatch
- missing or incorrect YouTube metadata

## Publication Flow

1. Create or edit deck files.
2. Run verification.
3. Commit to a branch or `main` as appropriate.
4. Push to GitHub.
5. GitHub Actions deploys to Cloudflare Pages.
6. Confirm the public URL after deployment.

Use pull requests for larger decks or generated content that needs review.
