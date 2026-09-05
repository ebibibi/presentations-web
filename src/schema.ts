import { z } from 'zod'

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
  // Sort key for the archive list (ascending). Lower shows first; decks
  // without an order fall back to newest-first after the ordered ones.
  order: z.number().optional(),
  // Slide canvas shape. 'standard' keeps the 1280x1080 studio canvas used by
  // most decks; 'wide' renders a full 16:9 1920x1080 surface for decks that are
  // projected as-is at an event.
  canvas: z.enum(['standard', 'wide']).default('standard'),
  tags: z.array(z.string()).default([]),
  youtube: youtubeSchema.optional(),
  slides: z.array(slideMetaSchema).min(1)
})
