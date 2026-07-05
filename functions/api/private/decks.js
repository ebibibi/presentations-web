const sessionCookieName = 'presentation_session'
const privateDecksKey = 'decks'

export async function onRequestGet({ request, env }) {
  const sessionCookie = getCookie(request.headers.get('cookie') || '', sessionCookieName)
  const session = sessionCookie ? await verifySession(sessionCookie, env.AUTH_SECRET) : null

  if (!session?.canRecord) {
    return json({ error: 'Owner login required' }, 403)
  }

  const rawDecks = await loadPrivateDecksJson(env)

  if (!rawDecks) {
    return json({ decks: [] })
  }

  try {
    const parsed = JSON.parse(rawDecks)
    const decks = Array.isArray(parsed) ? parsed : parsed.decks

    if (!Array.isArray(decks)) {
      return json({ error: 'Private deck storage must contain an array or { decks: [] }' }, 500)
    }

    return json({ decks })
  } catch (error) {
    return json(
      {
        error: error instanceof Error ? error.message : 'Failed to parse private deck storage'
      },
      500
    )
  }
}

async function loadPrivateDecksJson(env) {
  if (env.PRIVATE_DECKS?.get) {
    const value = await env.PRIVATE_DECKS.get(privateDecksKey)

    if (value) {
      return value
    }
  }

  return env.PRIVATE_DECKS_JSON || ''
}

async function verifySession(cookieValue, secret) {
  if (!secret) {
    return null
  }

  const [payload, signature] = cookieValue.split('.')

  if (!payload || !signature) {
    return null
  }

  const expectedSignature = await hmac(payload, secret)

  if (signature !== expectedSignature) {
    return null
  }

  try {
    const session = JSON.parse(base64UrlDecode(payload))
    const now = Math.floor(Date.now() / 1000)

    if (!session.exp || session.exp < now) {
      return null
    }

    return session
  } catch {
    return null
  }
}

function getCookie(cookieHeader, name) {
  return cookieHeader
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`))
    ?.slice(name.length + 1)
}

async function hmac(value, secret) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(value))
  return base64UrlEncodeBytes(new Uint8Array(signature))
}

function base64UrlDecode(value) {
  const normalized = value.replaceAll('-', '+').replaceAll('_', '/')
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=')
  const binary = atob(padded)
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

function base64UrlEncodeBytes(bytes) {
  let binary = ''
  for (const byte of bytes) {
    binary += String.fromCharCode(byte)
  }

  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '')
}

function json(body, status = 200, headers = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      ...headers
    }
  })
}
