import { useEffect, useRef, useState } from 'react'
import { QrLightbox, UnisimQr, useUniversal } from '@unisim/sdk'
import { useSigStore } from '../../stores/sigStore'
import {
  CODE_TTL_MS,
  MAX_WRONG_PINS,
  formatCountdown,
  isPngDataUrl,
  mobileSignChannel,
  mobileSignUrl,
  randomPin,
  randomToken,
  type MobileSignPayload,
  type MobileSignResult,
} from '../../lib/mobileSign'

// The "Sign on phone" tab of Create your signature. Shows a QR + PIN; the phone
// opens the URL, draws, and broadcasts the image back over a Supabase Realtime
// channel. On receipt (matching PIN) we load it as the drawn signature and stay
// on this panel — showing the received signature inline — so the name/date/time
// options below still apply. (Mirrors the equivalent Universal PDF flow.)
export default function PhoneSignPanel() {
  const { supabase } = useUniversal()
  const setDrawn = useSigStore((s) => s.setDrawn)
  const drawnDataUrl = useSigStore((s) => s.drawnDataUrl)

  const [token, setToken] = useState(randomToken)
  const [pin, setPin] = useState(randomPin)
  // Each code is open for CODE_TTL_MS; the countdown shows what's left and the
  // channel closes when it runs out.
  const [expiresAt, setExpiresAt] = useState(() => Date.now() + CODE_TTL_MS)
  const [now, setNow] = useState(() => Date.now())
  const [status, setStatus] = useState<'waiting' | 'received'>('waiting')
  const [enlarged, setEnlarged] = useState(false)
  // Set when the code was replaced after too many wrong PINs.
  const [replaced, setReplaced] = useState(false)
  const pinRef = useRef(pin)
  pinRef.current = pin

  const expired = status === 'waiting' && now >= expiresAt

  // A fresh token + PIN (so a new QR and a new channel) with a full clock.
  function newCode() {
    setToken(randomToken())
    setPin(randomPin())
    setExpiresAt(Date.now() + CODE_TTL_MS)
    setNow(Date.now())
  }

  // Tick once a second while a code is showing, to drive the countdown.
  useEffect(() => {
    if (status !== 'waiting' || expired) return
    const id = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(id)
  }, [status, expired])

  // An expired code can't be scanned from the enlarged view either.
  useEffect(() => {
    if (expired) setEnlarged(false)
  }, [expired])

  // Supabase Realtime is only available on the real client — the offline mock
  // has no channel(). Sign-on-phone inherently needs a network connection (the
  // phone must reach a server), so we render the QR but skip the subscription
  // and say so, rather than crash.
  const canRealtime = typeof (supabase as { channel?: unknown }).channel === 'function'

  // One code, one signature: the channel is only open while waiting, so once a
  // signature has arrived nothing else posted to it can replace it. Every
  // attempt gets a reply, so the phone can say "wrong PIN" instead of claiming
  // success; after MAX_WRONG_PINS misses the token and PIN are replaced, which
  // makes guessing the PIN by brute force a dead end.
  useEffect(() => {
    if (!canRealtime || status !== 'waiting' || expired) return
    let wrong = 0
    const channel = supabase.channel(mobileSignChannel(token))
    const reply = (result: MobileSignResult) =>
      channel.send({ type: 'broadcast', event: 'result', payload: result })
    channel
      .on('broadcast', { event: 'signature' }, (msg: { payload: MobileSignPayload }) => {
        const payload = msg.payload ?? {}
        const nonce = typeof payload.nonce === 'string' ? payload.nonce.slice(0, 64) : undefined
        if (payload.pin !== pinRef.current) {
          void reply({ nonce, ok: false, reason: 'pin' })
          wrong += 1
          if (wrong >= MAX_WRONG_PINS) {
            setReplaced(true)
            newCode()
          }
          return
        }
        if (!isPngDataUrl(payload.signature)) {
          void reply({ nonce, ok: false, reason: 'image' })
          return
        }
        const signature = payload.signature
        // Reply first: flipping the status closes this channel.
        void reply({ nonce, ok: true }).finally(() => {
          setReplaced(false)
          setStatus('received')
          // Load it as the active (drawn) signature but stay on this panel so
          // the name/date/time + alignment options below still apply to it.
          setDrawn(signature)
        })
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [canRealtime, supabase, token, status, expired, setDrawn])

  // The received signature was cleared or replaced from elsewhere (say, a saved
  // one was loaded): go back to waiting with a fresh code rather than showing a
  // QR whose channel is already closed.
  useEffect(() => {
    if (status === 'received' && !drawnDataUrl) {
      setStatus('waiting')
      newCode()
    }
  }, [status, drawnDataUrl])

  // Fresh token + PIN → new QR + channel, ready to receive a different capture.
  function signAgain() {
    setDrawn(null)
    setStatus('waiting')
    newCode()
  }

  // "New code" — by hand, before or after the old one runs out.
  function refresh() {
    setReplaced(false)
    newCode()
  }

  if (status === 'received' && drawnDataUrl) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border-2 border-dashed border-emerald-300 bg-emerald-50/40 p-4 text-center">
        <img src={drawnDataUrl} alt="Signature received from your phone" className="h-32 w-full rounded-lg bg-white object-contain p-2 ring-1 ring-slate-200" />
        <p className="text-xs font-semibold text-emerald-700">Signature received ✓</p>
        <p className="text-[11px] text-slate-500">Add your name, the date or the time below, then use it to sign a PDF.</p>
        <button
          type="button"
          onClick={signAgain}
          className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-orange-400 hover:bg-orange-50/40"
        >
          Sign again on phone
        </button>
      </div>
    )
  }

  const url = mobileSignUrl(token, expiresAt)
  const left = formatCountdown(expiresAt - now)

  if (expired) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border-2 border-dashed border-slate-300 bg-white p-4 text-center">
        {/* Same footprint as the code, so the panel doesn't jump. */}
        <div className="flex h-[176px] w-[176px] flex-col items-center justify-center gap-2 rounded-lg bg-slate-50 ring-1 ring-slate-200">
          <svg viewBox="0 0 24 24" className="h-8 w-8 text-slate-400" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="13" r="8" /><path d="M12 9v4l2.5 2.5" /><path d="M9 2h6" />
          </svg>
          <p className="px-3 text-xs font-semibold text-slate-700">This code has expired</p>
        </div>
        <p role="status" className="text-xs text-slate-500">
          Codes last {Math.round(CODE_TTL_MS / 60000)} minutes. Get a new one, then scan it with your phone.
        </p>
        <button
          type="button"
          onClick={refresh}
          className="rounded-md bg-orange-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-orange-800"
        >
          Get a new code
        </button>
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-col items-center gap-3 rounded-lg border-2 border-dashed border-slate-300 bg-white p-4 text-center">
        {/* The SDK code enlarges itself on click, but this panel wraps it in a
            button of its own for the hover caption — and a button inside a
            button is not markup — so the code is inert and the lightbox opens
            from here. */}
        <button
          type="button"
          onClick={() => setEnlarged(true)}
          className="group relative rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
          aria-label="Enlarge the QR code"
        >
          <UnisimQr
            value={url}
            size={176}
            enlargeable={false}
            label="signing on your phone"
            className="rounded-lg"
          />
          <span className="pointer-events-none absolute inset-x-0 bottom-0 rounded-b-lg bg-slate-900/70 py-0.5 text-[10px] font-medium text-white opacity-0 transition group-hover:opacity-100">
            Tap to enlarge
          </span>
        </button>
        <p className="text-xs text-slate-600">Scan with your phone camera, then enter this PIN:</p>
        <p className="text-2xl font-bold tracking-[0.3em] text-slate-900">{pin}</p>
        {/* The countdown ticks every second, so it is NOT a live region — a
            screen reader would read it out sixty times a minute. The expired
            state above is the one that announces itself. */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span data-testid="code-countdown">
            Code expires in <span className="font-semibold tabular-nums text-slate-700">{left}</span>
          </span>
          <span aria-hidden="true">·</span>
          <button type="button" onClick={refresh} className="font-semibold text-orange-700 hover:underline">
            New code
          </button>
        </div>
        {replaced && (
          <p className="text-xs text-amber-700" role="status">
            Too many wrong PINs, so this is a new code. Scan it again.
          </p>
        )}
        {canRealtime ? (
          <p className="text-xs text-slate-500">Waiting for your phone…</p>
        ) : (
          <p className="text-xs text-amber-600">
            Offline demo — connect a real session (VITE_REAL_AUTH=1) or use the deployed app to receive from your phone.
          </p>
        )}
      </div>

      {enlarged && (
        <QrLightbox
          value={url}
          label="signing on your phone"
          title="Point your phone's camera at this code"
          hint={
            <>
              Then enter this PIN on your phone:
              <span className="mt-1 block text-2xl font-bold tracking-[0.3em] text-white">{pin}</span>
              <span className="mt-1 block text-xs tabular-nums">Code expires in {left}</span>
            </>
          }
          onClose={() => setEnlarged(false)}
        />
      )}
    </>
  )
}
