import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import './styles.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)

// Click-to-edit slide copy. On the dev server the editor is always available.
// On the published site the copy cannot be edited in place, so the owner gets a
// link to the same page on the local dev server instead — and the full editor
// only if a commit backend is configured.
async function mount(node: React.ReactNode) {
  const host = document.createElement('div')
  document.body.appendChild(host)
  createRoot(host).render(node)
}

async function mountEditor() {
  const { TextEditOverlay } = await import('./edit/TextEditOverlay')
  await mount(<TextEditOverlay />)
}

async function mountLocalEditorLink() {
  const { LocalEditorLink } = await import('./edit/LocalEditorLink')
  await mount(<LocalEditorLink />)
}

async function isOwner() {
  try {
    const response = await fetch('/api/auth/session', { cache: 'no-store' })
    if (!response.ok) return false
    return Boolean(((await response.json()) as { canRecord?: boolean }).canRecord)
  } catch {
    return false
  }
}

/** Whether a production save could reach GitHub; off unless it is configured. */
async function canCommitFromProduction() {
  try {
    const response = await fetch('/api/deck-text/patch', { cache: 'no-store' })
    if (!response.ok) return false
    return Boolean(((await response.json()) as { configured?: boolean }).configured)
  } catch {
    return false
  }
}

if (import.meta.env.DEV) {
  void mountEditor()
} else {
  void isOwner().then(async (owner) => {
    if (!owner) return
    await mountLocalEditorLink()
    if (await canCommitFromProduction()) await mountEditor()
  })
}
