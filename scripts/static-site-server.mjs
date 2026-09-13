import { createReadStream } from 'node:fs'
import { readFile } from 'node:fs/promises'
import http from 'node:http'
import { extname, join, normalize } from 'node:path'

// Serves `dist/` the way Cloudflare Pages does (unknown paths fall back to
// index.html) plus the two auth endpoints the app calls on load, so a browser
// check can drive the built site without wrangler.
const contentTypes = new Map([
  ['.html', 'text/html; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.css', 'text/css; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.svg', 'image/svg+xml'],
  ['.png', 'image/png'],
  ['.jpg', 'image/jpeg']
])

export async function startStaticSite({ port, clientId, session, privateDecks }) {
  const baseUrl = `http://127.0.0.1:${port}`
  const root = join(process.cwd(), 'dist')

  const server = http.createServer(async (request, response) => {
    if (!request.url) {
      response.writeHead(400).end()
      return
    }

    const url = new URL(request.url, baseUrl)

    if (url.pathname === '/api/auth/config') {
      sendJson(response, { enabled: true, googleClientId: clientId })
      return
    }

    if (url.pathname === '/api/auth/session') {
      sendJson(response, session ?? { authenticated: false, canRecord: false })
      return
    }

    // Owner-only decks arrive from this API after the page has rendered, which
    // is exactly what makes their placement in the list worth checking.
    if (url.pathname === '/api/private/decks') {
      sendJson(response, { decks: privateDecks ?? [] })
      return
    }

    const requestedPath = normalize(url.pathname).replace(/^\/+/, '')
    const filePath = join(root, requestedPath || 'index.html')

    try {
      await readFile(filePath)
      response.setHeader(
        'content-type',
        contentTypes.get(extname(filePath)) || 'application/octet-stream'
      )
      createReadStream(filePath).pipe(response)
    } catch {
      response.setHeader('content-type', 'text/html; charset=utf-8')
      createReadStream(join(root, 'index.html')).pipe(response)
    }
  })

  await new Promise((resolve) => server.listen(port, '127.0.0.1', resolve))

  return { baseUrl, close: () => server.close() }
}

function sendJson(response, body) {
  response.setHeader('content-type', 'application/json; charset=utf-8')
  response.end(JSON.stringify(body))
}
