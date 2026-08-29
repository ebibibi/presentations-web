import { LogOut, Video } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import {
  type AuthState,
  loadGoogleIdentityScript,
  loginWithCredential,
  logout
} from './auth'
import { useMediaQuery } from './useMediaQuery'

/** Matches the header breakpoint in styles.css where the nav runs out of room. */
const COMPACT_HEADER_QUERY = '(max-width: 680px)'

export function AuthControls({
  auth,
  onAuthChange,
  allowCompact = false
}: {
  auth: AuthState
  onAuthChange: (auth: AuthState) => void
  /** Render an icon-only sign-in button when the viewport is too narrow for the wide one. */
  allowCompact?: boolean
}) {
  const buttonRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)
  const compact = useMediaQuery(COMPACT_HEADER_QUERY) && allowCompact

  useEffect(() => {
    if (!auth.enabled || auth.authenticated || !auth.googleClientId || !buttonRef.current) {
      return
    }

    let cancelled = false

    loadGoogleIdentityScript()
      .then(() => {
        if (cancelled || !buttonRef.current || !window.google?.accounts.id) {
          return
        }

        buttonRef.current.innerHTML = ''
        window.google.accounts.id.initialize({
          client_id: auth.googleClientId,
          callback: async (response) => {
            try {
              setError(null)

              if (!response.credential) {
                throw new Error('Google did not return a credential')
              }

              onAuthChange(await loginWithCredential(response.credential))
            } catch (loginError) {
              setError(
                loginError instanceof Error ? loginError.message : 'Login failed'
              )
            }
          },
          auto_select: false,
          cancel_on_tap_outside: true
        })
        window.google.accounts.id.renderButton(
          buttonRef.current,
          compact
            ? {
                theme: 'outline',
                size: 'medium',
                type: 'icon',
                shape: 'circle',
                locale: 'ja'
              }
            : {
                theme: 'outline',
                size: 'medium',
                text: 'signin',
                shape: 'rectangular',
                width: 92,
                locale: 'ja'
              }
        )
      })
      .catch((scriptError) => {
        setError(
          scriptError instanceof Error
            ? scriptError.message
            : 'Failed to load Google login'
        )
      })

    return () => {
      cancelled = true
    }
  }, [auth.authenticated, auth.enabled, auth.googleClientId, compact, onAuthChange])

  if (auth.loading) {
    return <span className="auth-status">確認中</span>
  }

  if (auth.authenticated && auth.user) {
    return (
      <div className="auth-user">
        <span title={auth.user.email}>
          <Video size={16} aria-hidden />
          {auth.canRecord ? '撮影可' : '閲覧'}
        </span>
        <button
          type="button"
          onClick={async () => {
            onAuthChange(await logout())
          }}
          title="ログアウト"
        >
          <LogOut size={16} aria-hidden />
        </button>
      </div>
    )
  }

  if (!auth.enabled) {
    return null
  }

  return (
    <div className={compact ? 'auth-login auth-login-compact' : 'auth-login'}>
      <div ref={buttonRef} title="ログイン" />
      {error ? (
        // The compact header has no room for the message, so surface a marker
        // that still carries the full text rather than dropping the error.
        <span role="alert" title={error} aria-label={`ログインエラー: ${error}`}>
          {compact ? '!' : error}
        </span>
      ) : null}
    </div>
  )
}
