/**
 * Where the local editing server lives.
 *
 * The public site cannot edit anything by itself, so for the owner it offers a
 * jump to the same page served by `npm run dev`, where the click-to-edit layer
 * runs. These are private-range addresses: unreachable from the internet, and
 * useless to anyone who is not on the network or the tailnet.
 *
 * Override at build time with VITE_LOCAL_EDITOR_HOSTS ("label|url,label|url"),
 * or from the browser with the `deck-local-editor-hosts` localStorage key when a
 * machine moves and a redeploy would be silly.
 */
export type LocalServer = { label: string; origin: string }

const DEFAULT_HOSTS: LocalServer[] = [
  { label: '自宅LAN', origin: 'http://192.168.1.2:5173' },
  { label: 'Tailscale', origin: 'http://100.107.90.23:5173' }
]

const PREFERENCE_KEY = 'deck-local-editor-preferred'
const OVERRIDE_KEY = 'deck-local-editor-hosts'

function parseHosts(value: string | null | undefined): LocalServer[] {
  if (!value) return []
  return value
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const [label, origin] = entry.split('|')
      return origin ? { label: label.trim(), origin: origin.trim() } : null
    })
    .filter((host): host is LocalServer => Boolean(host))
}

export function localServers(): LocalServer[] {
  const override = parseHosts(window.localStorage.getItem(OVERRIDE_KEY))
  if (override.length) return override

  const configured = parseHosts(import.meta.env.VITE_LOCAL_EDITOR_HOSTS)
  const hosts = configured.length ? configured : DEFAULT_HOSTS
  const preferred = window.localStorage.getItem(PREFERENCE_KEY)

  return [...hosts].sort((left, right) =>
    left.origin === preferred ? -1 : right.origin === preferred ? 1 : 0
  )
}

export function rememberPreferred(origin: string) {
  window.localStorage.setItem(PREFERENCE_KEY, origin)
}

/** The same page, on the local server. */
export function localUrl(origin: string) {
  return `${origin}${window.location.pathname}${window.location.search}`
}
