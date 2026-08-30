import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import './styles.css'
import { onOwnerChange } from './edit/owner-signal'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)

// Click-to-edit slide copy. On the dev server the editor is always available.
// On the published site the copy cannot be edited in place, so the owner gets a
// link to the same page on the local dev server instead — and the full editor
// only if a commit backend is configured.
function mount(node: React.ReactNode) {
  const host = document.createElement('div')
  document.body.appendChild(host)
  const root = createRoot(host)
  root.render(node)

  return () => {
    root.unmount()
    host.remove()
  }
}

async function mountEditor() {
  const { TextEditOverlay } = await import('./edit/TextEditOverlay')
  mount(<TextEditOverlay />)
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

async function ownerUi() {
  const { LocalEditorLink } = await import('./edit/LocalEditorLink')
  const nodes: React.ReactNode[] = [<LocalEditorLink key="local-editor-link" />]

  if (await canCommitFromProduction()) {
    const { TextEditOverlay } = await import('./edit/TextEditOverlay')
    nodes.push(<TextEditOverlay key="text-edit-overlay" />)
  }

  return nodes
}

if (import.meta.env.DEV) {
  void mountEditor()
} else {
  // The sign-in state is not known at load and can change afterwards, so the
  // owner UI follows it instead of being decided once. Mounting is async, so a
  // single in-flight sync loops until the DOM matches the latest state rather
  // than racing a second call.
  let wanted = false
  let unmount: (() => void) | null = null
  let syncing = false

  async function syncOwnerUi() {
    if (syncing) return
    syncing = true

    try {
      while (wanted !== Boolean(unmount)) {
        if (!wanted) {
          unmount?.()
          unmount = null
          continue
        }

        const nodes = await ownerUi()
        if (!wanted) continue
        unmount = mount(<>{nodes}</>)
      }
    } finally {
      syncing = false
    }
  }

  onOwnerChange((canRecord) => {
    wanted = canRecord
    void syncOwnerUi()
  })

  void isOwner().then((owner) => {
    wanted = owner
    return syncOwnerUi()
  })
}
