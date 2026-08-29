/**
 * Owner-only jump from the public site to the local editing server.
 *
 * The published site is static, so the copy is edited on the machine running
 * `npm run dev`. This keeps that one tap away from wherever the deck is being
 * read, carrying the current path across.
 *
 * The link is a plain navigation on purpose: an HTTPS page may not *fetch* a
 * private address (mixed content), so the site cannot check whether the server
 * is up — it can only offer the door.
 */
import { useState } from 'react'
import { localServers, localUrl, rememberPreferred } from './local-server'

export function LocalEditorLink() {
  const [servers] = useState(localServers)
  const [isOpen, setIsOpen] = useState(false)

  if (!servers.length) return null

  const [primary, ...alternates] = servers

  return (
    <div
      data-local-editor-ui="root"
      style={{
        position: 'fixed',
        // Bottom right: the dev-server editor's own toggle sits bottom left, so
        // the two never collide when both are on screen.
        right: 16,
        bottom: 16,
        zIndex: 2147482000,
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        alignItems: 'flex-end'
      }}
    >
      {isOpen &&
        alternates.map((server) => (
          <a
            key={server.origin}
            href={localUrl(server.origin)}
            onClick={() => rememberPreferred(server.origin)}
            style={{ ...pillStyle, background: 'rgba(20,26,48,0.9)', color: '#e8ecff' }}
          >
            🖥 {server.label} で編集
          </a>
        ))}

      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <a
          href={localUrl(primary.origin)}
          onClick={() => rememberPreferred(primary.origin)}
          style={pillStyle}
        >
          ✏️ ローカルで編集
        </a>
        {alternates.length > 0 && (
          <button
            aria-label="編集サーバーを選ぶ"
            onClick={() => setIsOpen((value) => !value)}
            style={{
              ...pillStyle,
              padding: '0 14px',
              border: 'none',
              cursor: 'pointer',
              fontSize: 14
            }}
          >
            {isOpen ? '▾' : '▴'}
          </button>
        )}
      </div>
    </div>
  )
}

const pillStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: 44,
  padding: '0 16px',
  borderRadius: 999,
  textDecoration: 'none',
  fontSize: 13,
  fontWeight: 700,
  color: '#0b1020',
  background: '#7cf5c4',
  boxShadow: '0 6px 20px rgba(0,0,0,0.35)'
} as const
