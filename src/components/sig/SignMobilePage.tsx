import { useEffect, useRef, useState } from 'react'
import { useUniversal } from '@unisim/sdk'
import { mobileSignChannel } from '../../lib/mobileSign'

/**
 * Mobile signing handoff (opened via `?sign=<token>` from the QR on desktop).
 * The signer draws on their phone, enters the PIN shown on the desktop to prove
 * line-of-sight, and the signature is broadcast over a Supabase Realtime
 * channel back to the desktop — which validates the PIN and loads it as the
 * active signature. Mirrors Universal PDF's SignMobilePage.
 */
export default function SignMobilePage({ token }: { token: string }) {
  const { supabase } = useUniversal()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const drawing = useRef(false)
  const last = useRef<{ x: number; y: number } | null>(null)
  const [hasInk, setHasInk] = useState(false)
  const [pin, setPin] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  // Transparent canvas (dark ink), matching the desktop draw pad so the phone
  // signature places identically. The white look comes from the CSS background.
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const rect = canvas.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)
    ctx.lineWidth = 2.5
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.strokeStyle = '#0f172a'
  }, [])

  const pointAt = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }
  const start = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    canvasRef.current!.setPointerCapture(e.pointerId)
    drawing.current = true
    last.current = pointAt(e)
  }
  const move = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current || !last.current) return
    e.preventDefault()
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return
    const p = pointAt(e)
    ctx.beginPath()
    ctx.moveTo(last.current.x, last.current.y)
    ctx.lineTo(p.x, p.y)
    ctx.stroke()
    last.current = p
    if (!hasInk) setHasInk(true)
  }
  const end = (e: React.PointerEvent<HTMLCanvasElement>) => {
    drawing.current = false
    last.current = null
    try { canvasRef.current?.releasePointerCapture(e.pointerId) } catch { /* ignore */ }
  }
  const clear = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setHasInk(false)
  }

  async function submit() {
    if (!hasInk || pin.trim().length < 4) { setStatus('error'); return }
    setStatus('sending')
    const signature = canvasRef.current!.toDataURL('image/png')
    try {
      const channel = supabase.channel(mobileSignChannel(token))
      await new Promise<void>((resolve, reject) => {
        channel.subscribe((s) => {
          if (s === 'SUBSCRIBED') resolve()
          if (s === 'CHANNEL_ERROR' || s === 'TIMED_OUT') reject(new Error(s))
        })
      })
      await channel.send({ type: 'broadcast', event: 'signature', payload: { pin: pin.trim(), signature } })
      setStatus('sent')
      setTimeout(() => { supabase.removeChannel(channel) }, 1000)
    } catch {
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <main className="flex min-h-svh flex-col items-center justify-center gap-3 bg-slate-900 p-6 text-center text-white">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-600/20 text-3xl">✓</div>
        <h1 className="text-lg font-semibold">Signature sent</h1>
        <p className="text-sm text-slate-400">You can return to Universal Signatures — your signature is ready there.</p>
      </main>
    )
  }

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-md flex-col gap-4 bg-slate-900 p-5 text-white">
      <div>
        <h1 className="text-lg font-semibold">Sign on your phone</h1>
        <p className="mt-1 text-sm text-slate-400">Draw your signature, enter the PIN shown on your computer, then send.</p>
      </div>

      <canvas
        ref={canvasRef}
        className="h-56 w-full touch-none rounded-lg bg-white"
        onPointerDown={start}
        onPointerMove={move}
        onPointerUp={end}
        onPointerLeave={end}
        onPointerCancel={end}
      />

      <div className="flex items-center justify-between">
        <button type="button" onClick={clear} className="rounded-lg px-3 py-2 text-sm text-slate-400 hover:text-white">Clear</button>
        <label className="flex items-center gap-2 text-sm">
          <span className="text-slate-400">PIN</span>
          <input
            inputMode="numeric"
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="123456"
            className="w-28 rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 tracking-widest"
          />
        </label>
      </div>

      {status === 'error' && (
        <p className="text-sm text-rose-400">Draw a signature and enter the 6-digit PIN shown on your computer.</p>
      )}

      <button
        type="button"
        onClick={submit}
        disabled={status === 'sending'}
        className="mt-1 rounded-xl bg-orange-600 py-3 text-sm font-semibold hover:bg-orange-500 disabled:opacity-60"
      >
        {status === 'sending' ? 'Sending…' : 'Send signature to my computer'}
      </button>
    </main>
  )
}
