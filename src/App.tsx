import {
  ArrowLeft,
  ExternalLink,
  Film,
  Fullscreen,
  LayoutPanelLeft,
  Play,
  Presentation,
  Search
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { DeckViewer } from './DeckViewer'
import { initializeAnalytics, trackPageView } from './analytics'
import { getDecks } from './content'
import type { DeckBundle } from './types'

initializeAnalytics()

type Route =
  | { name: 'home' }
  | { name: 'deck'; slug: string; mode: 'audience' | 'studio' }

function getRoute(): Route {
  const path = window.location.pathname.replace(/\/+$/, '') || '/'
  const deckMatch = path.match(/^\/decks\/([^/]+)(?:\/(studio))?$/)

  if (deckMatch) {
    return {
      name: 'deck',
      slug: decodeURIComponent(deckMatch[1]),
      mode: deckMatch[2] === 'studio' ? 'studio' : 'audience'
    }
  }

  return { name: 'home' }
}

function navigate(path: string) {
  window.history.pushState(null, '', path)
  window.dispatchEvent(new PopStateEvent('popstate'))
  trackPageView(path)
}

export function App() {
  const [route, setRoute] = useState<Route>(getRoute)
  const decks = useMemo(() => getDecks(), [])

  useEffect(() => {
    const listener = () => setRoute(getRoute())
    window.addEventListener('popstate', listener)
    return () => window.removeEventListener('popstate', listener)
  }, [])

  if (route.name === 'deck') {
    const deck = decks.find((candidate) => candidate.meta.slug === route.slug)

    if (!deck) {
      return (
        <Shell>
          <EmptyState
            title="資料が見つかりません"
            body="URLを確認するか、一覧から資料を選んでください。"
          />
        </Shell>
      )
    }

    return (
      <DeckViewer
        deck={deck}
        initialMode={route.mode}
        onBack={() => navigate('/')}
      />
    )
  }

  return (
    <Shell>
      <Home decks={decks} onOpenDeck={(slug) => navigate(`/decks/${slug}`)} />
    </Shell>
  )
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="site-header">
        <button className="brand" type="button" onClick={() => navigate('/')}>
          <Presentation size={24} aria-hidden />
          <span>Ebisuda Presentations</span>
        </button>
        <nav aria-label="Primary">
          <a href="https://ebisuda.net/">ebisuda.net</a>
        </nav>
      </header>
      {children}
    </>
  )
}

function Home({
  decks,
  onOpenDeck
}: {
  decks: DeckBundle[]
  onOpenDeck: (slug: string) => void
}) {
  const [query, setQuery] = useState('')
  const visibleDecks = decks.filter((deck) => {
    const text = [
      deck.meta.title,
      deck.meta.summary,
      deck.meta.youtube?.title,
      ...deck.meta.tags
    ]
      .join(' ')
      .toLowerCase()

    return text.includes(query.trim().toLowerCase())
  })

  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Video-linked rich presentation archive</p>
          <h1>動画と資料をひとつのURLで届ける</h1>
          <p>
            撮影用の右1/3領域を確保したWebプレゼンと、視聴者が後から読める全幅ビューを同じ資料から提供します。
          </p>
        </div>
        <div className="hero-panel" aria-label="Layout preview">
          <div className="preview-slide">
            <span>1280 x 1080 slide</span>
          </div>
          <div className="preview-sidecar">
            <span>Future studio panel</span>
          </div>
        </div>
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
        <span>{visibleDecks.length} decks</span>
      </section>

      <section className="deck-grid" aria-label="Presentation archive">
        {visibleDecks.map((deck) => (
          <DeckCard
            key={deck.meta.slug}
            deck={deck}
            onOpen={() => onOpenDeck(deck.meta.slug)}
          />
        ))}
      </section>
    </main>
  )
}

function DeckCard({ deck, onOpen }: { deck: DeckBundle; onOpen: () => void }) {
  const youtube = deck.meta.youtube

  return (
    <article className="deck-card">
      <div className="deck-thumb">
        {youtube?.id ? (
          <img
            src={`https://img.youtube.com/vi/${youtube.id}/hqdefault.jpg`}
            alt=""
            loading="lazy"
          />
        ) : (
          <Presentation size={44} aria-hidden />
        )}
      </div>
      <div className="deck-card-body">
        <div className="card-meta">
          <span>{deck.meta.status}</span>
          <span>{deck.meta.slides.length} slides</span>
        </div>
        <h2>{deck.meta.title}</h2>
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

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <main className="empty-state">
      <button className="ghost-button" type="button" onClick={() => navigate('/')}>
        <ArrowLeft size={18} aria-hidden />
        一覧へ
      </button>
      <LayoutPanelLeft size={48} aria-hidden />
      <h1>{title}</h1>
      <p>{body}</p>
    </main>
  )
}

export function ModeIcon({ mode }: { mode: 'audience' | 'studio' }) {
  return mode === 'audience' ? (
    <Fullscreen size={18} aria-hidden />
  ) : (
    <Film size={18} aria-hidden />
  )
}
