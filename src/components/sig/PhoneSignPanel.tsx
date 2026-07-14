import { useEffect, useRef, useState } from 'react'
import { useUniversal } from '@unisim/sdk'
import { useSigStore } from '../../stores/sigStore'
import { makeQrPng } from '../../lib/qr'
import {
  mobileSignChannel,
  mobileSignUrl,
  randomPin,
  randomToken,
  type MobileSignPayload,
} from '../../lib/mobileSign'

// The "Sign on phone" tab of Create your signature. Shows a QR + PIN; the phone
// opens the URL, draws, and broadcasts the image back over a Supabase Realtime
// channel. On receipt (matching PIN) we load it as the drawn signature and drop
// back to the Draw tab so it shows in the pad and can be used / saved.
export default function PhoneSignPanel() {
  const { supabase } = useUniversal()
  const setDrawn = useSigStore((s) => s.setDrawn)
  const setMode = useSigStore((s) => s.setMode)

  const [token] = useState(randomToken)
  const [pin] = useState(randomPin)
  const [qrUrl, setQrUrl] = useState<string | null>(null)
  const [status, setStatus] = useState<'waiting' | 'received'>('waiting')
  const pinRef = useRef(pin)

  // Supabase Realtime is only available on the real client — the offline mock
  // has no channel(). Sign-on-phone inherently needs a network connection (the
  // phone must reach a server), so we render the QR but skip the subscription
  // and say so, rather than crash.
  const canRealtime = typeof (supabase as { channel?: unknown }).channel === 'function'

  useEffect(() => {
    makeQrPng(mobileSignUrl(token)).then(setQrUrl).catch(() => setQrUrl(null))
  }, [token])

  useEffect(() => {
    if (!canRealtime) return
    const channel = supabase.channel(mobileSignChannel(token))
    channel
      .on('broadcast', { event: 'signature' }, (msg: { payload: MobileSignPayload }) => {
        const payload = msg.payload
        if (payload?.pin !== pinRef.current || !payload.signature) return
        setStatus('received')
        setDrawn(payload.signature)
        // Hand the signature over to the Draw tab so the pad shows it and the
        // usual use/save flows apply.
        setTimeout(() => setMode('draw'), 600)
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [canRealtime, supabase, token, setDrawn, setMode])

  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border-2 border-dashed border-slate-300 bg-white p-4 text-center">
      {qrUrl
        ? <img src={qrUrl} alt="Scan to sign on your phone" className="h-44 w-44 rounded-lg" />
        : <div className="h-44 w-44 animate-pulse rounded-lg bg-slate-100" />}
      <p className="text-xs text-slate-600">Scan with your phone camera, then enter this PIN:</p>
      <p className="text-2xl font-bold tracking-[0.3em] text-slate-900">{pin}</p>
      {canRealtime ? (
        <p className={`text-xs ${status === 'received' ? 'text-emerald-600' : 'text-slate-400'}`}>
          {status === 'received' ? 'Signature received ✓' : 'Waiting for your phone…'}
        </p>
      ) : (
        <p className="text-xs text-amber-600">
          Offline demo — connect a real session (VITE_REAL_AUTH=1) or use the deployed app to receive from your phone.
        </p>
      )}
    </div>
  )
}
