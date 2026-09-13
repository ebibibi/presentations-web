import type { DeckBundle, DeckMeta } from './types'
import { deckTimelineDate } from './deck-order'

// The archive is browsed with two questions: "what kind of talk is this?" and
// "when was it?". Tags answer the first one, but there are already ~60 of them
// across 25 decks, so a tag chip row is longer than the list it filters.
//
// Categories are therefore derived from the tags a deck already carries instead
// of adding a `category` field to every deck.yaml: a new deck is filed the
// moment it is tagged, and there is one table to read when the filing looks
// wrong. A deck belongs to the category that matches the most of its tags;
// ties go to the category listed first here.

export type DeckCategoryId =
  | 'claude-code'
  | 'identity-security'
  | 'azure'
  | 'microsoft-365'
  | 'ai-automation'
  | 'other'

type CategoryDefinition = {
  id: DeckCategoryId
  label: string
  tags: readonly string[]
}

const categoryDefinitions: readonly CategoryDefinition[] = [
  {
    id: 'claude-code',
    label: 'Claude Code・AI開発',
    tags: [
      'claude-code',
      'codex',
      'mcp',
      'agents',
      'ai-agent',
      'ag-ui',
      'skills',
      'context',
      'loops',
      'memory',
      'obsidian',
      'course',
      'api'
    ]
  },
  {
    id: 'identity-security',
    label: 'ID・セキュリティ',
    tags: [
      'security',
      'identity',
      'entra-id',
      'mfa',
      'conditional-access',
      'workload-identity',
      'phishing-resistant',
      'passkey',
      'fido2',
      'windows-hello',
      'device-code-flow',
      'teams-rooms',
      'active-directory',
      'kerberos',
      'ntlm',
      'oauth',
      'vulnerability',
      'patch-tuesday',
      'media-literacy'
    ]
  },
  {
    id: 'azure',
    label: 'Azure・クラウド',
    tags: [
      'azure',
      'azure-arc',
      'azure-policy',
      'azure-update-manager',
      'azure-ai-search',
      'guest-configuration',
      'hybrid-cloud',
      'managed-identity',
      'hccjp'
    ]
  },
  {
    id: 'microsoft-365',
    label: 'Microsoft 365',
    tags: [
      'microsoft-365',
      'microsoft-teams',
      'microsoft-graph',
      'outlook',
      'calendar',
      'discord',
      'windows-server',
      'microsoft'
    ]
  },
  {
    id: 'ai-automation',
    label: 'AI活用・自動化',
    tags: [
      'ai',
      'automation',
      'workflow',
      'dx',
      'management',
      'legacy',
      'video',
      'youtube',
      'showcase',
      'language-learning'
    ]
  }
]

const otherCategoryLabel = 'その他'

export function deckCategoryId(meta: DeckMeta): DeckCategoryId {
  const tags = new Set(meta.tags)
  let best: { id: DeckCategoryId; score: number } = { id: 'other', score: 0 }

  for (const definition of categoryDefinitions) {
    const score = definition.tags.filter((tag) => tags.has(tag)).length

    if (score > best.score) {
      best = { id: definition.id, score }
    }
  }

  return best.id
}

export function deckCategoryLabel(id: DeckCategoryId): string {
  return categoryDefinitions.find((definition) => definition.id === id)?.label ?? otherCategoryLabel
}

export type CategoryFilter = {
  id: DeckCategoryId | 'all'
  label: string
  count: number
}

/** Chips for the decks actually on screen: a category nobody can open is not offered. */
export function buildCategoryFilters(decks: readonly DeckBundle[]): CategoryFilter[] {
  const counts = new Map<DeckCategoryId, number>()

  for (const deck of decks) {
    const id = deckCategoryId(deck.meta)
    counts.set(id, (counts.get(id) ?? 0) + 1)
  }

  const ordered: CategoryFilter[] = [{ id: 'all', label: 'すべて', count: decks.length }]

  for (const definition of categoryDefinitions) {
    const count = counts.get(definition.id) ?? 0

    if (count > 0) {
      ordered.push({ id: definition.id, label: definition.label, count })
    }
  }

  const otherCount = counts.get('other') ?? 0

  if (otherCount > 0) {
    ordered.push({ id: 'other', label: otherCategoryLabel, count: otherCount })
  }

  return ordered
}

export type DeckMonthGroup = {
  key: string
  label: string
  decks: DeckBundle[]
}

/** `2026-09-10` → `2026-09`. Anything unparsed keeps its own bucket. */
export function deckMonthKey(meta: DeckMeta): string {
  return deckTimelineDate(meta).slice(0, 7)
}

export function formatDeckMonth(key: string): string {
  const match = key.match(/^(\d{4})-(\d{2})$/)
  return match ? `${match[1]}年${Number(match[2])}月` : key
}

/**
 * Groups an already newest-first list into months without re-sorting it, so the
 * headings follow the same timeline the list itself is ordered by.
 */
export function groupDecksByMonth(decks: readonly DeckBundle[]): DeckMonthGroup[] {
  const groups: DeckMonthGroup[] = []

  for (const deck of decks) {
    const key = deckMonthKey(deck.meta)
    const current = groups.at(-1)

    if (current?.key === key) {
      current.decks.push(deck)
    } else {
      groups.push({ key, label: formatDeckMonth(key), decks: [deck] })
    }
  }

  return groups
}
