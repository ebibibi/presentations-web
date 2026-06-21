const sessionCookieName = 'presentation_session'

export async function onRequestGet({ request, env }) {
  const sessionCookie = getCookie(request.headers.get('cookie') || '', sessionCookieName)

  if (!sessionCookie) {
    return json({ authenticated: false, canRecord: false })
  }

  const session = await verifySession(sessionCookie, env.AUTH_SECRET)

  if (!session) {
    return json(
      { authenticated: false, canRecord: false },
      200,
      {
        'set-cookie':
          'presentation_session=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0'
      }
    )
  }

  return json({
    authenticated: true,
    canRecord: Boolean(session.canRecord),
    user: {
      email: session.email,
      name: session.name,
      picture: session.picture
    }
  })
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
