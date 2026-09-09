export type AuthUser = {
  email: string
  name: string
  picture?: string
}

export type AuthState = {
  loading: boolean
  enabled: boolean
  googleClientId: string
  authenticated: boolean
  canRecord: boolean
  user?: AuthUser
  error?: string
}

type GoogleCredentialResponse = {
  credential?: string
}

type GoogleButtonParent = HTMLElement

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (options: {
            client_id: string
            callback: (response: GoogleCredentialResponse) => void
            auto_select?: boolean
            cancel_on_tap_outside?: boolean
          }) => void
          renderButton: (
            parent: GoogleButtonParent,
            options: {
              theme?: 'outline' | 'filled_blue' | 'filled_black'
              size?: 'large' | 'medium' | 'small'
              type?: 'standard' | 'icon'
              text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin'
              shape?: 'rectangular' | 'pill' | 'circle' | 'square'
              width?: number
              locale?: string
            }
          ) => void
          disableAutoSelect: () => void
        }
      }
    }
  }
}

// `/api/auth/*` is a Cloudflare Function, so it only exists on the deployed
// site: the Vite dev server answers those paths with index.html and no one can
// ever sign in here. Without an owner session the local server hides exactly
// the decks it exists to edit (drafts), so a dev session is the owner by
// default. Set `VITE_DEV_OWNER=false` to browse the dev server the way a public
// visitor sees the site. `import.meta.env.DEV` is replaced at build time, so
// this branch is dropped from the production bundle rather than shipped.
const devOwner = import.meta.env.DEV && import.meta.env.VITE_DEV_OWNER !== 'false'

function devOwnerState(): AuthState {
  return {
    loading: false,
    // No auth backend to sign in or out of; the header renders a plain marker.
    enabled: false,
    googleClientId: '',
    authenticated: true,
    canRecord: true,
    user: { email: 'local dev server', name: 'ローカル編集' }
  }
}

let googleScriptPromise: Promise<void> | null = null

export async function loadAuthState(): Promise<AuthState> {
  if (devOwner) {
    return devOwnerState()
  }

  const config = await getAuthConfig()
  const session = config.enabled
    ? await getSession()
    : { authenticated: false, canRecord: false }

  return {
    loading: false,
    enabled: config.enabled,
    googleClientId: config.googleClientId,
    authenticated: session.authenticated,
    canRecord: session.canRecord,
    user: session.user
  }
}

export async function loadGoogleIdentityScript() {
  if (window.google?.accounts?.id) {
    return
  }

  if (!googleScriptPromise) {
    googleScriptPromise = new Promise((resolve, reject) => {
      const existingScript = document.querySelector<HTMLScriptElement>(
        'script[src="https://accounts.google.com/gsi/client"]'
      )

      if (existingScript) {
        existingScript.addEventListener('load', () => resolve(), { once: true })
        existingScript.addEventListener('error', () => reject(new Error('Failed to load Google Identity Services')), {
          once: true
        })
        return
      }

      const script = document.createElement('script')
      script.src = 'https://accounts.google.com/gsi/client'
      script.async = true
      script.defer = true
      script.addEventListener('load', () => resolve(), { once: true })
      script.addEventListener('error', () => reject(new Error('Failed to load Google Identity Services')), {
        once: true
      })
      document.head.appendChild(script)
    })
  }

  await googleScriptPromise
}

export async function loginWithCredential(credential: string): Promise<AuthState> {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({ credential })
  })
  const result = (await response.json()) as AuthResponse

  if (!response.ok) {
    throw new Error(result.error || 'Login failed')
  }

  const config = await getAuthConfig()

  return {
    loading: false,
    enabled: config.enabled,
    googleClientId: config.googleClientId,
    authenticated: result.authenticated,
    canRecord: result.canRecord,
    user: result.user
  }
}

export async function logout(): Promise<AuthState> {
  if (devOwner) {
    return devOwnerState()
  }

  await fetch('/api/auth/logout', { method: 'POST' })
  window.google?.accounts.id.disableAutoSelect()
  const config = await getAuthConfig()

  return {
    loading: false,
    enabled: config.enabled,
    googleClientId: config.googleClientId,
    authenticated: false,
    canRecord: false
  }
}

async function getAuthConfig() {
  try {
    const response = await fetch('/api/auth/config', { cache: 'no-store' })

    if (!response.ok || !isJsonResponse(response)) {
      return { enabled: false, googleClientId: '' }
    }

    return (await response.json()) as { enabled: boolean; googleClientId: string }
  } catch {
    return { enabled: false, googleClientId: '' }
  }
}

async function getSession() {
  try {
    const response = await fetch('/api/auth/session', { cache: 'no-store' })

    if (!response.ok || !isJsonResponse(response)) {
      return { authenticated: false, canRecord: false }
    }

    return (await response.json()) as AuthResponse
  } catch {
    return { authenticated: false, canRecord: false }
  }
}

function isJsonResponse(response: Response) {
  return response.headers.get('content-type')?.includes('application/json') ?? false
}

type AuthResponse = {
  authenticated: boolean
  canRecord: boolean
  user?: AuthUser
  error?: string
}
