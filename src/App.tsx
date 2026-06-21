import {
  ArrowLeft,
  ExternalLink,
  LayoutPanelLeft,
  Play,
  Presentation,
  Search
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { AuthControls } from './AuthControls'
import { DeckViewer } from './DeckViewer'
import { initializeAnalytics, trackPageView } from './analytics'
import {
  type AuthState,
  loadAuthState
} from './auth'
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
  const [auth, setAuth] = useState<AuthState>(initialAuthState)
  const decks = useMemo(() => getDecks(), [])

  useEffect(() => {
    const listener = () => setRoute(getRoute())
    window.addEventListener('popstate', listener)
    return () => window.removeEventListener('popstate', listener)
  }, [])

  useEffect(() => {
    let cancelled = false

    loadAuthState()
      .then((nextAuth) => {
        if (!cancelled) {
          setAuth(nextAuth)
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setAuth({
            ...initialAuthState,
            loading: false,
            error: error instanceof Error ? error.message : 'Failed to load auth state'
          })
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  if (route.name === 'deck') {
    const deck = decks.find((candidate) => candidate.meta.slug === route.slug)

    if (!deck) {
      return (
        <Shell auth={auth} onAuthChange={setAuth}>
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
        auth={auth}
        onBack={() => navigate('/')}
        onOpenStudio={() => navigate(`/decks/${deck.meta.slug}/studio${window.location.hash}`)}
        onAuthChange={setAuth}
      />
    )
  }

  return (
    <Shell auth={auth} onAuthChange={setAuth}>
      <Home decks={decks} onOpenDeck={(slug) => navigate(`/decks/${slug}`)} />
    </Shell>
  )
}

const initialAuthState: AuthState = {
  loading: true,
  enabled: false,
  googleClientId: '',
  authenticated: false,
  canRecord: false
}

function Shell({
  auth,
  onAuthChange,
  children
}: {
  auth: AuthState
  onAuthChange: (auth: AuthState) => void
  children: React.ReactNode
}) {
  return (
    <>
      <header className="site-header">
        <button className="brand" type="button" onClick={() => navigate('/')}>
          <Presentation size={24} aria-hidden />
          <span>Ebisuda Presentations</span>
        </button>
        <nav aria-label="Primary">
          <a href="https://ebisuda.net/">ebisuda.net</a>
          <AuthControls auth={auth} onAuthChange={onAuthChange} />
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
          <h1>動画の資料をあとから読む</h1>
          <p>
            YouTubeで扱ったテーマの資料を、ブラウザでそのまま閲覧できる形で公開します。
          </p>
        </div>
        <div className="hero-panel audience-preview" aria-label="Presentation preview">
          <div className="preview-window">
            <div className="preview-window-bar">
              <span />
              <span />
              <span />
            </div>
            <div className="preview-window-body">
              <span className="preview-label">web deck</span>
              <strong>動画と連動した<br />プレゼン資料</strong>
              <p>スライド単位のURLで共有できます。</p>
            </div>
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
          <div className="deck-thumb-fallback">
            <Presentation size={34} aria-hidden />
            <strong>{deck.meta.title}</strong>
            <span>1280 x 1080 web deck</span>
          </div>
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
