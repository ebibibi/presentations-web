import { ExternalLink, LayoutGrid, List, Play, Presentation, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import {
  buildCategoryFilters,
  deckCategoryId,
  deckCategoryLabel,
  groupDecksByMonth,
  type DeckCategoryId
} from './deck-category'
import { deckTimelineDate, formatDeckDate } from './deck-order'
import { isDeckListed, isPublished } from './visibility'
import type { DeckBundle } from './types'

type ArchiveView = 'list' | 'cards'

// The archive holds every deck ever published, and a card carries a 16:9
// thumbnail, so the card grid shows about three decks per screen. The list is
// the default because the first question is "what is here?"; the cards stay one
// click away for browsing by picture.
const viewStorageKey = 'presentations:archive-view'

export function Home({
  decks,
  isOwner,
  privateDecksError,
  onOpenDeck
}: {
  decks: DeckBundle[]
  isOwner: boolean
  privateDecksError?: string
  onOpenDeck: (slug: string) => void
}) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<DeckCategoryId | 'all'>('all')
  const [view, setView] = useState<ArchiveView>(loadView)

  const listedDecks = useMemo(
    () => decks.filter((deck) => isDeckListed(deck.meta.status, isOwner)),
    [decks, isOwner]
  )
  const hiddenCount = listedDecks.filter((deck) => !isPublished(deck.meta.status)).length
  const categories = useMemo(() => buildCategoryFilters(listedDecks), [listedDecks])
  const visibleDecks = useMemo(
    () => listedDecks.filter((deck) => matchesQuery(deck, query) && matchesCategory(deck, category)),
    [category, listedDecks, query]
  )
  const monthGroups = useMemo(() => groupDecksByMonth(visibleDecks), [visibleDecks])

  const changeView = (next: ArchiveView) => {
    setView(next)
    saveView(next)
  }

  return (
    <main>
      <section className="hero">
        <p className="eyebrow">Video-linked rich presentation archive</p>
        <h1>動画の資料をあとから読む</h1>
        <p className="hero-lead">
          YouTubeで扱ったテーマの資料を、ブラウザでそのまま閲覧できる形で公開します。
          新しい資料が上に並びます。
        </p>
      </section>

      <section className="toolbar" aria-label="Archive tools">
        <label className="search">
          <Search size={18} aria-hidden />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="タイトル、タグ、動画で検索"
          />
        </label>
        <span className="deck-count">{visibleDecks.length} decks・新しい順</span>
        <div className="view-switch" role="group" aria-label="表示方法">
          <button
            type="button"
            aria-pressed={view === 'list'}
            onClick={() => changeView('list')}
            data-view="list"
          >
            <List size={16} aria-hidden />
            リスト
          </button>
          <button
            type="button"
            aria-pressed={view === 'cards'}
            onClick={() => changeView('cards')}
            data-view="cards"
          >
            <LayoutGrid size={16} aria-hidden />
            カード
          </button>
        </div>
        {isOwner && hiddenCount > 0 ? (
          <span className="owner-note">オーナー表示：非公開 {hiddenCount} 件を含む</span>
        ) : null}
        {isOwner && privateDecksError ? (
          <span className="owner-note">非公開資料の取得失敗: {privateDecksError}</span>
        ) : null}
      </section>

      <section className="category-filter" aria-label="カテゴリで絞り込む">
        {categories.map((filter) => (
          <button
            key={filter.id}
            type="button"
            className="category-chip"
            aria-pressed={category === filter.id}
            data-category={filter.id}
            onClick={() => setCategory(filter.id)}
          >
            {filter.label}
            <span className="category-count">{filter.count}</span>
          </button>
        ))}
      </section>

      {visibleDecks.length === 0 ? (
        <p className="archive-empty">条件に合う資料がありません。検索語やカテゴリを変えてください。</p>
      ) : null}

      {monthGroups.map((group) => (
        <section className="deck-month" key={group.key} aria-label={group.label}>
          <h2 className="month-heading">
            <span>{group.label}</span>
            <span className="month-count">{group.decks.length}</span>
          </h2>
          {view === 'cards' ? (
            <div className="deck-grid" aria-label="Presentation archive">
              {group.decks.map((deck) => (
                <DeckCard
                  key={deck.meta.slug}
                  deck={deck}
                  onOpen={() => onOpenDeck(deck.meta.slug)}
                />
              ))}
            </div>
          ) : (
            <ul className="deck-rows" aria-label="Presentation archive">
              {group.decks.map((deck) => (
                <DeckRow
                  key={deck.meta.slug}
                  deck={deck}
                  onOpen={() => onOpenDeck(deck.meta.slug)}
                />
              ))}
            </ul>
          )}
        </section>
      ))}
    </main>
  )
}

function matchesQuery(deck: DeckBundle, query: string): boolean {
  const needle = query.trim().toLowerCase()

  if (!needle) {
    return true
  }

  return [deck.meta.title, deck.meta.summary, deck.meta.youtube?.title, ...deck.meta.tags]
    .join(' ')
    .toLowerCase()
    .includes(needle)
}

function matchesCategory(deck: DeckBundle, category: DeckCategoryId | 'all'): boolean {
  return category === 'all' || deckCategoryId(deck.meta) === category
}

function loadView(): ArchiveView {
  try {
    return window.localStorage.getItem(viewStorageKey) === 'cards' ? 'cards' : 'list'
  } catch {
    // Private-mode browsers throw on storage access; the default view is fine.
    return 'list'
  }
}

function saveView(view: ArchiveView) {
  try {
    window.localStorage.setItem(viewStorageKey, view)
  } catch {
    // Remembering the choice is a convenience, never a reason to break the page.
  }
}

// An explicit thumbnail wins: a deck can be linked to someone else's stream and
// still want its own card image. `size` picks the YouTube still to ask for.
function deckThumbnail(deck: DeckBundle, size: 'default' | 'hqdefault'): string | null {
  const youtubeId = deck.meta.youtube?.id
  return deck.meta.thumbnail ?? (youtubeId ? `https://img.youtube.com/vi/${youtubeId}/${size}.jpg` : null)
}

function DeckRow({ deck, onOpen }: { deck: DeckBundle; onOpen: () => void }) {
  const youtube = deck.meta.youtube
  const thumbnail = deckThumbnail(deck, 'default')

  return (
    <li className="deck-row">
      <button type="button" className="deck-row-open" onClick={onOpen}>
        <span className="row-thumb">
          {thumbnail ? (
            <img src={thumbnail} alt="" loading="lazy" />
          ) : (
            <Presentation size={18} aria-hidden />
          )}
        </span>
        <span className="row-date">{formatDeckDate(deckTimelineDate(deck.meta))}</span>
        <span className="row-title">{deck.meta.title}</span>
        <span className="row-category">{deckCategoryLabel(deckCategoryId(deck.meta))}</span>
        <span className="row-slides">{deck.meta.slides.length} slides</span>
        {isPublished(deck.meta.status) ? null : (
          <span className="card-status-hidden">{deck.meta.status}</span>
        )}
      </button>
      {youtube?.url ? (
        <a className="row-youtube" href={youtube.url} target="_blank" rel="noreferrer">
          <ExternalLink size={15} aria-hidden />
          <span className="sr-only">{deck.meta.title} のYouTube動画</span>
        </a>
      ) : (
        // Keeps every row the same width, so the titles line up whether or not
        // the deck has a video.
        <span className="row-youtube row-youtube-empty" aria-hidden />
      )}
    </li>
  )
}

function DeckCard({ deck, onOpen }: { deck: DeckBundle; onOpen: () => void }) {
  const youtube = deck.meta.youtube
  const thumbnail = deckThumbnail(deck, 'hqdefault')

  return (
    <article className="deck-card">
      <div className="deck-thumb">
        {thumbnail ? (
          <img src={thumbnail} alt="" loading="lazy" />
        ) : (
          <div className="deck-thumb-fallback">
            <Presentation size={34} aria-hidden />
            <strong>{deck.meta.title}</strong>
            <span>1280 x 1080 web deck</span>
          </div>
        )}
      </div>
      <div className="deck-card-body">
        <div className="card-meta">
          <span className="card-date">{formatDeckDate(deckTimelineDate(deck.meta))}</span>
          <span className="card-category">{deckCategoryLabel(deckCategoryId(deck.meta))}</span>
          <span>{deck.meta.slides.length} slides</span>
          {isPublished(deck.meta.status) ? null : (
            <span className="card-status-hidden">{deck.meta.status}</span>
          )}
        </div>
        <h3>{deck.meta.title}</h3>
        <p>{deck.meta.summary}</p>
        <div className="tag-row">
          {deck.meta.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </div>
      <div className="card-actions">
        <button type="button" onClick={onOpen}>
          <Play size={17} aria-hidden />
          開く
        </button>
        {youtube?.url ? (
          <a href={youtube.url} target="_blank" rel="noreferrer">
            <ExternalLink size={17} aria-hidden />
            YouTube
          </a>
        ) : null}
      </div>
    </article>
  )
}
