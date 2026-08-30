/**
 * Tells the owner-only UI that the sign-in state changed.
 *
 * That UI (the local-editor link, the in-place editor) is mounted outside the
 * React tree by main.tsx so it can sit above the deck, which means it cannot
 * read the auth state through props. Without this signal it is decided once at
 * page load: signing in from the header would leave the owner staring at a page
 * with no editing affordance until they reloaded by hand.
 */
const EVENT = 'deck-owner-change'

export function announceOwner(canRecord: boolean) {
  window.dispatchEvent(new CustomEvent(EVENT, { detail: canRecord }))
}

export function onOwnerChange(listener: (canRecord: boolean) => void) {
  window.addEventListener(EVENT, (event) => {
    listener(Boolean((event as CustomEvent<boolean>).detail))
  })
}
