/**
 * Where a slide copy edit goes.
 *
 * Two very different environments, one editor UI:
 *
 * - dev server: the repo is on disk, so the extractor resolves the string and
 *   the file is rewritten (and optionally committed) in place, with hot reload.
 * - production: there is no checkout, so the string is resolved against the copy
 *   index published with the build, and the save is a commit on GitHub. The page
 *   only shows the new text once the deploy finishes, a minute or two later.
 */
export type Candidate = {
  ref: DevRef | ProductionRef
  label: string
  text: string
}

type DevRef = { mode: 'dev'; slug: string; source: 'tsx' | 'yaml'; index: number }
type ProductionRef = { mode: 'production'; slug: string; id: string }

export type SaveOutcome = { tone: 'info' | 'error'; message: string }

export type EditorBackend = {
  mode: 'dev' | 'production'
  find: (text: string, slug?: string) => Promise<Candidate[]>
  /** How many source strings match each rendered string, in the same order. */
  countMatches: (texts: string[], slug?: string) => Promise<number[]>
  save: (candidates: Candidate[], text: string, publish: boolean) => Promise<SaveOutcome>
}

const normalize = (value: string) => value.replace(/\s+/g, ' ').trim()

async function postJson<T>(url: string, body: unknown, headers: Record<string, string> = {}): Promise<T> {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body)
  })
  const result = await response.json().catch(() => ({ error: '応答を読み取れませんでした' }))
  if (!response.ok) throw new Error((result as { error?: string }).error ?? '不明なエラー')
  return result as T
}

type DevCandidate = {
  slug: string
  source: 'tsx' | 'yaml'
  index: number
  component: string
  line: number | null
  text: string
}

function devBackend(): EditorBackend {
  // The dev endpoints reject anything a page could send without a CORS preflight.
  const headers = { 'X-Deck-Text-Editor': '1' }

  const toCandidate = (candidate: DevCandidate): Candidate => ({
    ref: { mode: 'dev', slug: candidate.slug, source: candidate.source, index: candidate.index },
    label: `${candidate.source === 'yaml' ? 'deck.yaml' : 'slides.tsx'} · ${candidate.component}${
      candidate.line ? ` · L${candidate.line}` : ''
    }`,
    text: candidate.text
  })

  return {
    mode: 'dev',
    async find(text, slug) {
      const { candidates } = await postJson<{ candidates: DevCandidate[] }>(
        '/__deck-text/find',
        { text, slug },
        headers
      )
      return candidates.map(toCandidate)
    },
    async countMatches(texts, slug) {
      const { matches } = await postJson<{ matches: number[] }>(
        '/__deck-text/find',
        { texts, slug },
        headers
      )
      return matches
    },
    async save(candidates, text, publish) {
      const result = await postJson<{
        files: string[]
        published?: { branch: string; commit?: string; pushed: boolean }
        publishError?: string
      }>(
        '/__deck-text/patch',
        {
          text,
          publish,
          targets: candidates.map((candidate) => {
            const ref = candidate.ref as DevRef
            return {
              slug: ref.slug,
              source: ref.source,
              index: ref.index,
              original: candidate.text
            }
          })
        },
        headers
      )

      if (result.publishError) {
        return { tone: 'error', message: `保存はできましたが公開に失敗しました: ${result.publishError}` }
      }
      if (result.published?.pushed) {
        const deploying = result.published.branch === 'main' ? '（1〜2分で本番に反映）' : ''
        return {
          tone: 'info',
          message: `公開しました: ${result.published.branch} ${result.published.commit}${deploying}`
        }
      }
      return { tone: 'info', message: `保存しました: ${result.files.join(', ')}` }
    }
  }
}

type IndexItem = {
  id: string
  file: string
  component: string
  text: string
}

function productionBackend(): EditorBackend {
  const indexes = new Map<string, Promise<IndexItem[]>>()

  const loadIndex = (slug: string) => {
    if (!indexes.has(slug)) {
      indexes.set(
        slug,
        fetch(`/deck-text/${slug}.json`)
          .then((response) => (response.ok ? response.json() : { items: [] }))
          .then((index: { items?: IndexItem[] }) => index.items ?? [])
          .catch(() => [])
      )
    }
    return indexes.get(slug)!
  }

  const matchesIn = async (text: string, slug: string) => {
    const target = normalize(text)
    return (await loadIndex(slug)).filter((item) => normalize(item.text) === target)
  }

  return {
    mode: 'production',
    async find(text, slug) {
      if (!slug) return []
      return (await matchesIn(text, slug)).map((item) => ({
        ref: { mode: 'production', slug, id: item.id },
        label: `${item.file.endsWith('.yaml') ? 'deck.yaml' : 'slides.tsx'} · ${item.component}`,
        text: item.text
      }))
    },
    async countMatches(texts, slug) {
      if (!slug) return texts.map(() => 0)
      const items = await loadIndex(slug)
      const known = new Set(items.map((item) => normalize(item.text)))
      return texts.map((text) => (known.has(normalize(text)) ? 1 : 0))
    },
    async save(candidates, text) {
      const slug = (candidates[0].ref as ProductionRef).slug
      const result = await postJson<{ commit: { shortSha: string; branch: string } }>(
        '/api/deck-text/patch',
        {
          slug,
          text,
          ids: candidates.map((candidate) => (candidate.ref as ProductionRef).id)
        }
      )
      return {
        tone: 'info',
        message: `公開しました: ${result.commit.shortSha}（1〜2分で反映されます）`
      }
    }
  }
}

export function createBackend(): EditorBackend {
  return import.meta.env.DEV ? devBackend() : productionBackend()
}
