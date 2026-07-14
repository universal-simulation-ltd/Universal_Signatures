// Sign-on-phone handoff, mirroring Universal PDF / Ergo Assess: the desktop
// shows a QR (one-time token in the URL) plus a 6-digit PIN; the phone opens
// the page, draws a signature and broadcasts it back over a Supabase Realtime
// channel; the desktop only accepts the payload if the PIN matches. Broadcast
// messages are ephemeral — no DB rows are written, so this works the same for
// signed-in and guest users.

export function randomToken(): string {
  return (crypto.randomUUID?.() ?? `${Date.now()}-${Math.random()}`).replace(/-/g, '')
}

export function randomPin(): string {
  return String(Math.floor(Math.random() * 1_000_000)).padStart(6, '0')
}

export function mobileSignChannel(token: string): string {
  return `mobile-sig:${token}`
}

/**
 * URL the phone opens. Uses the current origin + app base path so it works on
 * every host that serves the app (signatures.unisim.co.uk and
 * opensource.unisim.co.uk/signatures). The token rides in the query string;
 * App.tsx routes `?sign=<token>` to the mobile signing page.
 */
export function mobileSignUrl(token: string): string {
  return `${window.location.origin}${import.meta.env.BASE_URL}?sign=${token}`
}

export interface MobileSignPayload {
  pin?: string
  /** PNG data URL of the signature drawn on the phone (transparent background). */
  signature?: string
}
