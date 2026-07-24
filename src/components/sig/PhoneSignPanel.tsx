import { useEffect, useRef, useState } from 'react'
import { useUniversal } from '@unisim/sdk'
import { useSigStore } from '../../stores/sigStore'
import { brandedQrPngDataUrl } from '../../lib/brandedQr'
import {
  mobileSignChannel,
  mobileSignUrl,
  randomPin,
  randomToken,
  type MobileSignPayload,
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
  const [qrUrl, setQrUrl] = useState<string | null>(null)
  const [status, setStatus] = useState<'waiting' | 'received'>('waiting')
  const [enlarged, setEnlarged] = useState(false)
  const pinRef = useRef(pin)
  pinRef.current = pin

  // Supabase Realtime is only available on the real client — the offline mock
  // has no channel(). Sign-on-phone inherently needs a network connection (the
  // phone must reach a server), so we render the QR but skip the subscription
  // and say so, rather than crash.
  const canRealtime = typeof (supabase as { channel?: unknown }).channel === 'function'

  useEffect(() => {
    brandedQrPngDataUrl(mobileSignUrl(token), 240).then(setQrUrl).catch(() => setQrUrl(null))
  }, [token])

  useEffect(() => {
    if (!canRealtime) return
    const channel = supabase.channel(mobileSignChannel(token))
    channel
      .on('broadcast', { event: 'signature' }, (msg: { payload: MobileSignPayload }) => {
        const payload = msg.payload
        if (payload?.pin !== pinRef.current || !payload.signature) return
        setStatus('received')
        // Load it as the active (drawn) signature but stay on this panel so the
        // name/date/time + alignment options below still apply to it.
        setDrawn(payload.signature)
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [canRealtime, supabase, token, setDrawn])

  // Fresh token + PIN → new QR + channel, ready to receive a different capture.
  function signAgain() {
    setDrawn(null)
    setStatus('waiting')
    setToken(randomToken())
    setPin(randomPin())
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

  return (
    <>
      <div className="flex flex-col items-center gap-3 rounded-lg border-2 border-dashed border-slate-300 bg-white p-4 text-center">
        {qrUrl
          ? (
            <button
              type="button"
              onClick={() => setEnlarged(true)}
              className="group relative rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
              aria-label="Enlarge the QR code"
            >
              <img src={qrUrl} alt="Scan to sign on your phone" className="h-44 w-44 rounded-lg" />
              <span className="pointer-events-none absolute inset-x-0 bottom-0 rounded-b-lg bg-slate-900/70 py-0.5 text-[10px] font-medium text-white opacity-0 transition group-hover:opacity-100">
                Tap to enlarge
              </span>
            </button>
          )
          : <div className="h-44 w-44 animate-pulse rounded-lg bg-slate-100" />}
        <p className="text-xs text-slate-600">Scan with your phone camera, then enter this PIN:</p>
        <p className="text-2xl font-bold tracking-[0.3em] text-slate-900">{pin}</p>
        {canRealtime ? (
          <p className="text-xs text-slate-400">Waiting for your phone…</p>
        ) : (
          <p className="text-xs text-amber-600">
            Offline demo — connect a real session (VITE_REAL_AUTH=1) or use the deployed app to receive from your phone.
          </p>
        )}
      </div>

      {enlarged && qrUrl && (
        <QrEnlargeModal src={qrUrl} pin={pin} onClose={() => setEnlarged(false)} />
      )}
    </>
  )
}

// Full-screen lightbox for the sign-on-phone QR — easier to scan from a small
// window or to hold a phone up to. Matches the QR app's EnlargeModal pattern
// (click / Escape to dismiss, clicks on the code itself don't close it).
function QrEnlargeModal({ src, pin, onClose }: { src: string; pin: string; onClose: () => void }) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-5 bg-slate-900/80 p-4 backdrop-blur-sm sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Enlarged QR code to sign on your phone"
    >
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-xl leading-none text-white hover:bg-white/25"
      >
        ×
      </button>

      {/* Clicking the code itself shouldn't dismiss it (a phone held to the
          screen mustn't close the modal). */}
      <div
        className="w-full max-w-[min(88vw,70vh)] rounded-2xl bg-white p-4 shadow-lg ring-1 ring-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        <img src={src} alt="QR code to sign on your phone" className="block h-auto w-full" />
      </div>

      <div className="max-w-md text-center">
        <p className="text-sm font-semibold text-white">Point your phone's camera at this code</p>
        <p className="mt-1 text-xs text-white/70">Then enter this PIN on your phone:</p>
        <p className="mt-1 text-2xl font-bold tracking-[0.3em] text-white">{pin}</p>
      </div>
    </div>
  )
}
