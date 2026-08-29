import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import './styles.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)

// Click-to-edit slide copy, dev server only. The import is inside the DEV
// branch so the whole editor is dropped from production builds.
if (import.meta.env.DEV) {
  void import('./dev/TextEditOverlay').then(({ TextEditOverlay }) => {
    const host = document.createElement('div')
    document.body.appendChild(host)
    createRoot(host).render(<TextEditOverlay />)
  })
}
