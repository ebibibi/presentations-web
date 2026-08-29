import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { deckTextEditor } from './vite-plugins/deck-text-editor.mjs'

export default defineConfig({
  // Dev-only: click-to-edit slide copy. Resolves paths from the Vite root.
  plugins: [react(), deckTextEditor()],
  server: {
    // Vite answers 403 to any Host header that is not a literal IP or localhost,
    // so reaching the dev server by machine name needs that name listed here.
    // The unit binds 0.0.0.0, so the names below are how the owner-only link on
    // the public site actually arrives: plain `moviegen` over MagicDNS or LAN
    // name resolution, `.local` over mDNS, the tailnet FQDN from anywhere else.
    // Listed explicitly rather than `true`: the check exists to stop a hostile
    // page from resolving a name to this port and reading the source, and
    // allowing everything would simply switch that off.
    allowedHosts: ['moviegen', 'moviegen.local', 'moviegen.tail954a8f.ts.net']
  },
  build: {
    sourcemap: true,
    chunkSizeWarningLimit: 700
  }
})
