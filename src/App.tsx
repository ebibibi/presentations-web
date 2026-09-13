import { ArrowLeft, LayoutPanelLeft, Presentation } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { AuthControls } from './AuthControls'
import { announceOwner } from './edit/owner-signal'
import { DeckViewer } from './DeckViewer'
import { initializeAnalytics, trackPageView } from './analytics'
import {
  type AuthState,
  loadAuthState
} from './auth'
import { getDecks, loadPrivateDecks } from './content'
import { sortDecksNewestFirst } from './deck-order'
import { Home } from './Home'
import { isDeckAccessible } from './visibility'
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
  const publicDecks = useMemo(() => getDecks(), [])
  const [privateDecks, setPrivateDecks] = useState<DeckBundle[]>([])
  const [privateDecksState, setPrivateDecksState] = useState<{
    loading: boolean
    error?: string
  }>({ loading: false })
  // The owner's private decks are fetched after the page renders, so they have
  // to be merged into the timeline rather than appended to the end of it.
  const decks = useMemo(
    () => sortDecksNewestFirst([...publicDecks, ...privateDecks]),
    [privateDecks, publicDecks]
  )
  const handleAuthChange = useCallback((nextAuth: AuthState) => {
    if (!nextAuth.canRecord) {
      setPrivateDecks([])
      setPrivateDecksState({ loading: false })
    }

    setAuth(nextAuth)
    // The owner-only editing UI lives outside this tree, so it has to be told.
    announceOwner(nextAuth.canRecord)
  }, [])

  useEffect(() => {
    const listener = () => setRoute(getRoute())
    window.addEventListener('popstate', listener)
    return () => window.removeEventListener('popstate', listener)
  }, [])

  useEffect(() => {
    let cancelled = false

    if (!auth.canRecord) {
      return undefined
    }

    Promise.resolve()
      .then(() => {
        if (!cancelled) {
          setPrivateDecksState({ loading: true })
        }
        return loadPrivateDecks()
      })
      .then((nextDecks) => {
        if (!cancelled) {
          setPrivateDecks(nextDecks)
          setPrivateDecksState({ loading: false })
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setPrivateDecks([])
          setPrivateDecksState({
            loading: false,
            error: error instanceof Error ? error.message : 'Failed to load private decks'
          })
        }
      })

    return () => {
      cancelled = true
    }
  }, [auth.canRecord])

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

    if (!deck && (auth.loading || privateDecksState.loading)) {
      return (
        <Shell auth={auth} onAuthChange={handleAuthChange}>
          <EmptyState
            title="資料を確認しています"
            body="公開資料とオーナー専用資料のアクセス権を確認しています。"
          />
        </Shell>
      )
    }

    if (!deck && auth.enabled && !auth.canRecord) {
      return (
        <Shell auth={auth} onAuthChange={handleAuthChange}>
          <EmptyState
            title="ログインが必要な資料です"
            body="このURLはオーナー専用資料の可能性があります。ebibibi@gmail.com でログインすると閲覧できます。"
          />
        </Shell>
      )
    }

    if (!deck) {
      return (
        <Shell auth={auth} onAuthChange={handleAuthChange}>
          <EmptyState
            title="資料が見つかりません"
            body="URLを確認するか、一覧から資料を選んでください。"
          />
        </Shell>
      )
    }

    if (!isDeckAccessible(deck.meta.status, auth.canRecord)) {
      return (
        <Shell auth={auth} onAuthChange={handleAuthChange}>
          <EmptyState
            title={auth.loading ? '確認しています…' : 'この資料はまだ公開されていません'}
            body={
              auth.loading
                ? 'アクセス権を確認しています。'
                : '動画の公開に合わせて公開されます。資料作成者はログインすると閲覧できます。'
            }
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
        onAuthChange={handleAuthChange}
      />
    )
  }

  return (
    <Shell auth={auth} onAuthChange={handleAuthChange}>
      <Home
        decks={decks}
        isOwner={auth.canRecord}
        privateDecksError={privateDecksState.error}
        onOpenDeck={(slug) => navigate(`/decks/${slug}`)}
      />
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
        <button
          className="brand"
          type="button"
          aria-label="Ebisuda Presentations"
          onClick={() => navigate('/')}
        >
          <Presentation size={24} aria-hidden />
          <span>Ebisuda Presentations</span>
        </button>
        <nav aria-label="Primary">
          <a href="https://study.ebisuda.net/" target="_blank" rel="noreferrer">
            Ebi Study
          </a>
          <a href="https://ebisuda.net/">ebisuda.net</a>
          <AuthControls auth={auth} onAuthChange={onAuthChange} allowCompact />
        </nav>
      </header>
      {children}
    </>
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
