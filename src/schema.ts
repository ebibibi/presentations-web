import { z } from 'zod'
import { THEME_IDS } from './themes/registry'

const slideMetaSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  durationInFrames: z.number().int().positive().optional(),
  notes: z.string().optional()
})

const youtubeSchema = z.object({
  id: z.string().min(1).optional(),
  url: z.string().url().optional(),
  title: z.string().optional(),
  publishedAt: z.string().optional()
})

export const deckMetaSchema = z.object({
  slug: z.string().regex(/^[a-z0-9][a-z0-9-]*$/),
  title: z.string().min(1),
  summary: z.string().min(1),
  status: z.enum(['draft', 'public', 'unlisted', 'private']),
  visibility: z.enum(['public', 'members', 'private']),
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1),
  // Slide canvas shape. 'standard' keeps the 1280x1080 studio canvas used by
  // most decks; 'wide' renders a full 16:9 1920x1080 surface for decks that are
  // projected as-is at an event.
  canvas: z.enum(['standard', 'wide']).default('standard'),
  // Slide theme (src/themes/registry.ts). Leave it out: a deck then takes the
  // theme of the month it was created in, and older decks stay 'classic'. Set
  // it only to pin a deck to a theme other than that one.
  theme: z.enum(THEME_IDS).optional(),
  tags: z.array(z.string()).default([]),
  // Keeps a deck out of the archive list for everyone, the owner included. The
  // deck still builds and opens by URL per `status`; use it for fixture decks
  // that checks depend on but nobody should browse.
  hidden: z.boolean().default(false),
  // Archive card image. Decks linked to a video take their card image from
  // YouTube; a deck with no video of its own needs one supplied here as a
  // site-absolute path under public/ (16:9).
  thumbnail: z.string().startsWith('/').optional(),
  youtube: youtubeSchema.optional(),
  slides: z.array(slideMetaSchema).min(1)
})
