import { useState } from 'react'
import { useUniversal } from '@unisim/sdk'
import { mobileSignChannel, type MobileSignResult } from '../../lib/mobileSign'
import { randomHex } from '../../lib/signature'
import { useInkCanvas } from '../../lib/useInkCanvas'

type Status = 'idle' | 'sending' | 'sent' | 'unconfirmed' | 'invalid' | 'wrongPin' | 'refused' | 'error'

// How long to wait for the computer to say it took the signature.
const REPLY_TIMEOUT_MS = 6000

const MESSAGES: Partial<Record<Status, string>> = {
  invalid: 'Draw a signature and enter the 6-digit PIN shown on your computer.',
  wrongPin: 'That PIN doesn’t match. Check the 6 digits on your computer and send again.',
  refused: 'Your computer couldn’t use that drawing. Clear it, draw again and send.',
  error: 'Couldn’t reach your computer. Check your connection and try again.',
}

/**
 * Mobile signing handoff (opened via `?sign=<token>` from the QR on desktop).
 * The signer draws on their phone, enters the PIN shown on the desktop to prove
 * line-of-sight, and the signature is broadcast over a Supabase Realtime
 * channel back to the desktop — which validates the PIN and loads it as the
 * active signature. Mirrors Universal PDF's SignMobilePage.
 */
export default function SignMobilePage({ token }: { token: string }) {
  const { supabase } = useUniversal()
  // Transparent canvas (dark ink), matching the desktop draw pad so the phone
  // signature places identically. The white look comes from the CSS background.
  const ink = useInkCanvas()
  const [pin, setPin] = useState('')
  const [status, setStatus] = useState<Status>('idle')

  async function submit() {
    const signature = ink.toDataUrl()
    if (!signature || pin.length !== 6) { setStatus('invalid'); return }
    setStatus('sending')
    const nonce = randomHex(8)
    const channel = supabase.channel(mobileSignChannel(token))
    try {
      // Listen for the desktop's reply before sending, so it can't be missed.
      const reply = new Promise<MobileSignResult | null>((resolve) => {
        const timer = window.setTimeout(() => resolve(null), REPLY_TIMEOUT_MS)
        channel.on('broadcast', { event: 'result' }, (msg: { payload: MobileSignResult }) => {
          if (msg.payload?.nonce !== nonce) return
          window.clearTimeout(timer)
          resolve(msg.payload)
        })
      })
      await new Promise<void>((resolve, reject) => {
        channel.subscribe((s) => {
          if (s === 'SUBSCRIBED') resolve()
          if (s === 'CHANNEL_ERROR' || s === 'TIMED_OUT') reject(new Error(s))
        })
      })
      await channel.send({ type: 'broadcast', event: 'signature', payload: { pin, signature, nonce } })
      const result = await reply
      // No reply: an older desktop build, or the code was closed. Don't claim
      // it worked; don't claim it failed either.
      if (!result) setStatus('unconfirmed')
      else if (result.ok) setStatus('sent')
      else setStatus(result.reason === 'image' ? 'refused' : 'wrongPin')
    } catch {
      setStatus('error')
    } finally {
      window.setTimeout(() => { supabase.removeChannel(channel) }, 500)
    }
  }

  if (status === 'sent' || status === 'unconfirmed') {
    return (
      <main className="flex min-h-svh flex-col items-center justify-center gap-3 bg-slate-900 p-6 text-center text-white">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-600/20 text-3xl">✓</div>
        <h1 className="text-lg font-semibold">Signature sent</h1>
        <p className="text-sm text-slate-400">
          {status === 'sent'
            ? 'Go back to the page you scanned the code from — your signature is ready there.'
            : 'Go back to the page you scanned the code from. If your signature isn’t there, check the code is still showing and scan it again.'}
        </p>
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
        ref={ink.canvasRef}
        role="img"
        aria-label="Signature pad. Draw your signature with your finger or a stylus."
        className="h-56 w-full touch-none rounded-lg bg-white"
        {...ink.handlers}
      />

      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center">
          <button type="button" onClick={ink.undo} disabled={!ink.canUndo} className="rounded-lg px-3 py-2 text-sm text-slate-400 hover:text-white disabled:opacity-40">Undo</button>
          <button type="button" onClick={ink.clear} disabled={!ink.hasInk} className="rounded-lg px-3 py-2 text-sm text-slate-400 hover:text-white disabled:opacity-40">Clear</button>
        </div>
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

      {MESSAGES[status] && (
        <p role="alert" className="text-sm text-rose-400">{MESSAGES[status]}</p>
      )}

      <button
        type="button"
        onClick={submit}
        disabled={status === 'sending'}
        className="mt-1 rounded-xl bg-orange-700 py-3 text-sm font-semibold hover:bg-orange-800 disabled:opacity-60"
      >
        {status === 'sending' ? 'Sending…' : 'Send signature to my computer'}
      </button>
    </main>
  )
}
