/**
 * Owner session verification, shared by Pages Functions.
 *
 * Must stay byte compatible with the cookie written by
 * `functions/api/auth/login.js`: a base64url payload with a base64url
 * HMAC-SHA256 signature over it, keyed by AUTH_SECRET.
 */
const SESSION_COOKIE = 'presentation_session'

export function getCookie(header, name) {
  return (header || '')
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`))
    ?.slice(name.length + 1)
}

/** The verified session, or null when absent, tampered with, or expired. */
export async function readSession(request, secret) {
  const cookie = getCookie(request.headers.get('cookie') || '', SESSION_COOKIE)
  if (!cookie || !secret) return null

  const [payload, signature] = cookie.split('.')
  if (!payload || !signature) return null
  if (signature !== (await hmac(payload, secret))) return null

  try {
    const session = JSON.parse(base64UrlDecode(payload))
    if (!session.exp || session.exp < Math.floor(Date.now() / 1000)) return null
    return session
  } catch {
    return null
  }
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
  let binary = ''
  for (const byte of new Uint8Array(signature)) binary += String.fromCharCode(byte)
  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '')
}

function base64UrlDecode(value) {
  const normalized = value.replaceAll('-', '+').replaceAll('_', '/')
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=')
  return new TextDecoder().decode(
    Uint8Array.from(atob(padded), (character) => character.charCodeAt(0))
  )
}
