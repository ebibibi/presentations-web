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
  /** What deleting this copy would take out, or null when only the text can go. */
  removeLabel: string | null
  /** The list entry duplicating this copy would repeat, or null when there is none. */
  duplicateLabel: string | null
  /** deck.yaml keys the schema requires: editable, but never empty and never gone. */
  required: boolean
}

export type SaveRequest = { text: string; publish: boolean; remove: boolean; duplicate?: boolean }

/** One slide as the structural editor sees it. */
export type SlideEntry = { id: string; canDuplicate: boolean }

export type SlideAction = 'duplicate' | 'delete' | 'move'

type DevRef = { mode: 'dev'; slug: string; source: 'tsx' | 'yaml'; index: number }
type ProductionRef = { mode: 'production'; slug: string; id: string }

export type SaveOutcome = { tone: 'info' | 'error'; message: string }

/** One whole source file of a deck, as the dev server holds it on disk. */
export type DeckSource = { name: string; path: string; text: string; hash: string }

export type EditorBackend = {
  mode: 'dev' | 'production'
  find: (text: string, slug?: string) => Promise<Candidate[]>
  /** How many source strings match each rendered string, in the same order. */
  countMatches: (texts: string[], slug?: string) => Promise<number[]>
  save: (candidates: Candidate[], request: SaveRequest) => Promise<SaveOutcome>
  /**
   * The deck's slides in running order, or null when the deck builds them from
   * data and cannot be edited a slide at a time.
   */
  listSlides: (slug: string) => Promise<SlideEntry[] | null>
  /** Duplicates, deletes or reorders one slide, rewriting deck.yaml and slides.tsx. */
  editSlide: (
    slug: string,
    id: string,
    action: SlideAction,
    options: { offset?: -1 | 1; publish: boolean }
  ) => Promise<SaveOutcome>
  /**
   * Whole-file editing, or null where there is no checkout behind the page.
   *
   * The copy editor can only reach strings it resolves back to a source range,
   * so anything it cannot resolve needs a way out that does not depend on
   * resolving anything. Only the dev server has one.
   */
  source: {
    read: (slug: string) => Promise<DeckSource[]>
    save: (
      slug: string,
      file: DeckSource,
      text: string,
      publish: boolean
    ) => Promise<{ outcome: SaveOutcome; hash: string }>
  } | null
}

const normalize = (value: string) => value.replace(/\s+/g, ' ').trim()

const slideVerb = (action: SlideAction) =>
  action === 'duplicate' ? '複製' : action === 'delete' ? '削除' : '移動'

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
  removeLabel: string | null
  duplicateLabel?: string | null
  required?: boolean
}

function devBackend(): EditorBackend {
  // The dev endpoints reject anything a page could send without a CORS preflight.
  const headers = { 'X-Deck-Text-Editor': '1' }

  const toCandidate = (candidate: DevCandidate): Candidate => ({
    ref: { mode: 'dev', slug: candidate.slug, source: candidate.source, index: candidate.index },
    label: `${candidate.source === 'yaml' ? 'deck.yaml' : 'slides.tsx'} · ${candidate.component}${
      candidate.line ? ` · L${candidate.line}` : ''
    }`,
    text: candidate.text,
    removeLabel: candidate.removeLabel ?? null,
    duplicateLabel: candidate.duplicateLabel ?? null,
    required: Boolean(candidate.required)
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
    async save(candidates, { text, publish, remove, duplicate }) {
      const result = await postJson<{
        files: string[]
        published?: { branch: string; commit?: string; pushed: boolean }
        publishError?: string
      }>(
        '/__deck-text/patch',
        {
          text,
          publish,
          remove,
          duplicate,
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
      return {
        tone: 'info',
        message: `${duplicate ? '複製' : remove ? '削除' : '保存'}しました: ${result.files.join(', ')}`
      }
    },
    async listSlides(slug) {
      const { slides } = await postJson<{ slides: SlideEntry[] | null }>(
        '/__deck-text/slides',
        { slug },
        headers
      )
      return slides
    },
    async editSlide(slug, id, action, { offset, publish }) {
      const result = await postJson<{
        files: string[]
        published?: { branch: string; commit?: string; pushed: boolean }
        publishError?: string
      }>('/__deck-text/slide', { slug, id, action, offset, publish }, headers)

      if (result.publishError) {
        return { tone: 'error', message: `保存はできましたが公開に失敗しました: ${result.publishError}` }
      }
      if (result.published?.pushed) {
        const deploying = result.published.branch === 'main' ? '（1〜2分で本番に反映）' : ''
        return {
          tone: 'info',
          message: `${slideVerb(action)}しました: ${result.published.branch} ${result.published.commit}${deploying}`
        }
      }
      return { tone: 'info', message: `${slideVerb(action)}しました: ${result.files.join(', ')}` }
    },
    source: {
      async read(slug) {
        const { files } = await postJson<{ files: DeckSource[] }>('/__deck-text/source', { slug }, headers)
        return files
      },
      async save(slug, file, text, publish) {
        const result = await postJson<{
          file: string
          changed: boolean
          hash: string
          published?: { branch: string; commit?: string; pushed: boolean }
          publishError?: string
        }>('/__deck-text/source-save', { slug, name: file.name, text, hash: file.hash, publish }, headers)

        if (result.publishError) {
          return {
            hash: result.hash,
            outcome: { tone: 'error', message: `保存はできましたが公開に失敗しました: ${result.publishError}` }
          }
        }
        if (!result.changed) {
          return { hash: result.hash, outcome: { tone: 'info', message: '変更はありませんでした' } }
        }
        if (result.published?.pushed) {
          const deploying = result.published.branch === 'main' ? '（1〜2分で本番に反映）' : ''
          return {
            hash: result.hash,
            outcome: {
              tone: 'info',
              message: `公開しました: ${result.published.branch} ${result.published.commit}${deploying}`
            }
          }
        }
        return { hash: result.hash, outcome: { tone: 'info', message: `保存しました: ${result.file}` } }
      }
    }
  }
}

type DeckIndex = {
  items?: IndexItem[]
  slides?: Array<{ id: string; component: { name: string } | null }> | null
}

type IndexItem = {
  id: string
  file: string
  component: string
  text: string
  remove?: { label: string } | null
  /** `1` means "the same span as remove", which is how the index keeps its size down. */
  duplicate?: { label: string } | 1 | null
}

function productionBackend(): EditorBackend {
  const indexes = new Map<string, Promise<DeckIndex>>()

  const loadDeckIndex = (slug: string) => {
    if (!indexes.has(slug)) {
      indexes.set(
        slug,
        fetch(`/deck-text/${slug}.json`)
          .then((response) => (response.ok ? response.json() : {}))
          .then((index: DeckIndex) => index ?? {})
          .catch(() => ({}) as DeckIndex)
      )
    }
    return indexes.get(slug)!
  }

  const loadIndex = async (slug: string) => (await loadDeckIndex(slug)).items ?? []

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
        text: item.text,
        removeLabel: item.remove?.label ?? null,
        duplicateLabel:
          item.duplicate === 1 ? (item.remove?.label ?? null) : (item.duplicate?.label ?? null),
        required: item.file.endsWith('.yaml') && !item.remove
      }))
    },
    async countMatches(texts, slug) {
      if (!slug) return texts.map(() => 0)
      const items = await loadIndex(slug)
      const known = new Set(items.map((item) => normalize(item.text)))
      return texts.map((text) => (known.has(normalize(text)) ? 1 : 0))
    },
    async save(candidates, { text, remove, duplicate }) {
      const slug = (candidates[0].ref as ProductionRef).slug
      const result = await postJson<{ commit: { shortSha: string; branch: string } }>(
        '/api/deck-text/patch',
        {
          slug,
          text,
          remove,
          duplicate,
          ids: candidates.map((candidate) => (candidate.ref as ProductionRef).id)
        }
      )
      return {
        tone: 'info',
        message: `${duplicate ? '複製' : remove ? '削除' : '公開'}しました: ${result.commit.shortSha}（1〜2分で反映されます）`
      }
    },
    async listSlides(slug) {
      const index = await loadDeckIndex(slug)
      if (!index?.slides) return null
      return index.slides.map((slide) => ({ id: slide.id, canDuplicate: Boolean(slide.component) }))
    },
    async editSlide(slug, id, action, { offset }) {
      const result = await postJson<{ commit: { shortSha: string; branch: string } }>(
        '/api/deck-slide/edit',
        { slug, id, action, offset }
      )
      return {
        tone: 'info',
        message: `${slideVerb(action)}しました: ${result.commit.shortSha}（1〜2分で反映されます）`
      }
    },
    // Production commits through GitHub and has no checkout to open, so the
    // escape hatch is the local editor link, not a textarea over the repo.
    source: null
  }
}

export function createBackend(): EditorBackend {
  return import.meta.env.DEV ? devBackend() : productionBackend()
}
