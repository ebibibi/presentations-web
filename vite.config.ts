import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { deckTextEditor } from './vite-plugins/deck-text-editor.mjs'

export default defineConfig({
  // Dev-only: click-to-edit slide copy. Resolves paths from the Vite root.
  plugins: [react(), deckTextEditor()],
  build: {
    sourcemap: true,
    chunkSizeWarningLimit: 700
  }
})
