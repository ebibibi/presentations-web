# ADR 0001: Separate Repository and Remotion Player Rendering

## Status

Accepted

## Context

The platform needs to publish browser-based presentations linked to YouTube videos. It must support two first-class modes:

- Studio mode: a 1920 x 1080 recording layout where the left 1280 x 1080 area is the slide and the right 640 x 1080 area is reserved for camera, notes, transcription, and future AI cues.
- Audience mode: a responsive full-width slide reading experience.

The existing `ebisuda.net` site is a Hugo site deployed to Cloudflare Pages with several split projects and Worker routing. Adding a React/Remotion platform directly to that repository would increase coupling and deployment risk.

## Decision

Create this as a separate Vite + React + TypeScript repository for `presentations.ebisuda.net`.

Use `@remotion/player` for in-browser timeline-driven slide rendering. Do not add Remotion video rendering to the MVP.

Use static YAML metadata plus React slide modules:

- YAML keeps archives searchable and easy for agents to update.
- React slide modules allow rich animation, embedded media, code demos, and 3D later.

## Consequences

- The MVP remains deployable as a static Cloudflare Pages site.
- Future authentication can be added at the edge or via a backend without disturbing the main site.
- AI generation can create pull requests that add or modify deck folders.
- If the number of generated files grows, this subdomain can be split into additional Cloudflare Pages projects later.
