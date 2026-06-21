const sessionCookieName = 'presentation_session'
const sessionMaxAgeSeconds = 60 * 60 * 24 * 7

export async function onRequestPost({ request, env }) {
  try {
    const body = await request.json()
    const credential = typeof body.credential === 'string' ? body.credential : ''

    if (!credential) {
      return json({ authenticated: false, error: 'Missing credential' }, 400)
    }

    const profile = await verifyGoogleCredential(credential, env.GOOGLE_CLIENT_ID)
    const allowedEmails = getAllowedEmails(env.ALLOWED_OWNER_EMAILS)
    const canRecord = allowedEmails.includes(profile.email.toLowerCase())

    if (!canRecord) {
      return json({ authenticated: false, error: 'This account is not allowed to record.' }, 403)
    }

    const expiresAt = Math.floor(Date.now() / 1000) + sessionMaxAgeSeconds
    const session = {
      email: profile.email,
      name: profile.name,
      picture: profile.picture,
      canRecord,
      exp: expiresAt
    }
    const cookieValue = await signSession(session, env.AUTH_SECRET)

    return json(
      {
        authenticated: true,
        canRecord,
        user: toPublicUser(session)
      },
      200,
      {
        'set-cookie': `${sessionCookieName}=${cookieValue}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${sessionMaxAgeSeconds}`
      }
    )
  } catch (error) {
    return json(
      {
        authenticated: false,
        error: error instanceof Error ? error.message : 'Authentication failed'
      },
      401
    )
  }
}

async function verifyGoogleCredential(credential, expectedAudience) {
  if (!expectedAudience) {
    throw new Error('GOOGLE_CLIENT_ID is not configured')
  }

  const response = await fetch(
    `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`
  )

  if (!response.ok) {
    throw new Error('Google credential verification failed')
  }

  const token = await response.json()

  if (token.aud !== expectedAudience) {
    throw new Error('Google credential audience mismatch')
  }

  if (token.email_verified !== 'true' && token.email_verified !== true) {
    throw new Error('Google account email is not verified')
  }

  if (!token.email) {
    throw new Error('Google credential does not include an email')
  }

  return {
    email: token.email,
    name: token.name || token.email,
    picture: token.picture || ''
  }
}

function getAllowedEmails(value) {
  return String(value || '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
}

function toPublicUser(session) {
  return {
    email: session.email,
    name: session.name,
    picture: session.picture
  }
}

async function signSession(session, secret) {
  if (!secret) {
    throw new Error('AUTH_SECRET is not configured')
  }

  const payload = base64UrlEncode(JSON.stringify(session))
  const signature = await hmac(payload, secret)
  return `${payload}.${signature}`
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

function base64UrlEncode(value) {
  return base64UrlEncodeBytes(new TextEncoder().encode(value))
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
