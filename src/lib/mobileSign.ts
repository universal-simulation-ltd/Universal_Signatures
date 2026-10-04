// Sign-on-phone handoff, mirroring Universal PDF / Ergo Assess: the desktop
// shows a QR (one-time token in the URL) plus a 6-digit PIN; the phone opens
// the page, draws a signature and broadcasts it back over a Supabase Realtime
// channel; the desktop only accepts the payload if the PIN matches. Broadcast
// messages are ephemeral — no DB rows are written, so this works the same for
// signed-in and guest users.
//
// The token is the channel name, so it is the secret that keeps strangers off
// the channel: 128 bits from the CSPRNG (the old fallback was Math.random). The
// PIN proves line of sight to the desktop screen; it is also drawn from the
// CSPRNG, and the desktop replaces the whole code after MAX_WRONG_PINS misses so
// it can't be guessed by brute force.

import { randomHex } from './signature'

/** Wrong PINs the desktop will take before it replaces the token and PIN. */
export const MAX_WRONG_PINS = 5

/**
 * How long one code (QR + PIN) stays open. Long enough to find a phone, scan,
 * draw and type six digits; short enough that a photo of the screen or a code
 * left open on an unattended desk is soon worth nothing. The desktop stops
 * listening when it runs out, which is what actually enforces it.
 */
export const CODE_TTL_MS = 5 * 60 * 1000

/** Largest signature image the desktop will accept from a phone (characters of data URL). */
const MAX_SIGNATURE_CHARS = 1_500_000

export function randomToken(): string {
  return randomHex(16)
}

export function randomPin(): string {
  // Rejection sampling keeps all 1,000,000 PINs equally likely.
  const buf = new Uint32Array(1)
  const limit = Math.floor(0x1_0000_0000 / 1_000_000) * 1_000_000
  do crypto.getRandomValues(buf)
  while (buf[0] >= limit)
  return String(buf[0] % 1_000_000).padStart(6, '0')
}

/**
 * True for a PNG data URL of a sane size — the only thing the desktop will load
 * from the channel. Anyone holding the token can post to it, so the payload is
 * checked before it reaches an <img> or pdf-lib.
 */
export function isPngDataUrl(v: unknown): v is string {
  return (
    typeof v === 'string' &&
    v.length <= MAX_SIGNATURE_CHARS &&
    /^data:image\/png;base64,[A-Za-z0-9+/]+=*$/.test(v)
  )
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
export function mobileSignUrl(token: string, expiresAt?: number): string {
  const exp = expiresAt ? `&exp=${Math.floor(expiresAt / 1000)}` : ''
  return `${window.location.origin}${import.meta.env.BASE_URL}?sign=${token}${exp}`
}

/**
 * The expiry the phone was told about (`&exp=<unix seconds>`), in ms — or null
 * for a link without one. Only used to tell the person holding the phone that
 * the code ran out before they draw: the desktop has stopped listening by then
 * either way, so a doctored `exp` gains nothing.
 */
export function parseExpiry(raw: string | null): number | null {
  if (!raw || !/^\d{9,11}$/.test(raw)) return null
  return Number(raw) * 1000
}

/** "4:07" — minutes and seconds left, for the countdown under the code. */
export function formatCountdown(ms: number): string {
  const total = Math.max(0, Math.ceil(ms / 1000))
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`
}

export interface MobileSignPayload {
  pin?: string
  /** PNG data URL of the signature drawn on the phone (transparent background). */
  signature?: string
  /** Echoed back in the desktop's `result`, so the phone matches the reply to its send. */
  nonce?: string
}

/**
 * The desktop's reply to a `signature` broadcast. `ok: false` means the PIN
 * didn't match (`reason: 'pin'`) or the image was refused (`reason: 'image'`).
 * Older desktop builds don't reply at all — the phone treats silence as
 * "sent, unconfirmed" rather than as a failure.
 */
export interface MobileSignResult {
  nonce?: string
  ok: boolean
  reason?: 'pin' | 'image'
}
