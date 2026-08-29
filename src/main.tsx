import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import './styles.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)

// Click-to-edit slide copy. On the dev server it is always available; in
// production it is for the signed-in owner only, so the session is checked
// before the editor chunk is even fetched.
async function mountEditor() {
  const { TextEditOverlay } = await import('./edit/TextEditOverlay')
  const host = document.createElement('div')
  document.body.appendChild(host)
  createRoot(host).render(<TextEditOverlay />)
}

/** Owner session plus a backend that can actually commit the edit. */
async function canEditInProduction() {
  try {
    const session = await fetch('/api/auth/session', { cache: 'no-store' })
    if (!session.ok || !((await session.json()) as { canRecord?: boolean }).canRecord) return false

    const backend = await fetch('/api/deck-text/patch', { cache: 'no-store' })
    if (!backend.ok) return false
    return Boolean(((await backend.json()) as { configured?: boolean }).configured)
  } catch {
    return false
  }
}

if (import.meta.env.DEV) {
  void mountEditor()
} else {
  void canEditInProduction().then((allowed) => {
    if (allowed) void mountEditor()
  })
}
