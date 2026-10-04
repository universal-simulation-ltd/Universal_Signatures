import { useEffect, useRef, useState } from 'react'
import type { RealtimeChannel } from '@supabase/supabase-js'
import { useUniversal } from '@unisim/sdk'
import { mobileSignChannel, type MobileSignResult } from '../../lib/mobileSign'
import { randomHex } from '../../lib/signature'
import { useInkCanvas } from '../../lib/useInkCanvas'

type Status = 'idle' | 'sending' | 'sent' | 'unconfirmed' | 'invalid' | 'wrongPin' | 'refused' | 'error' | 'expired'

// How long to wait for the computer to say it took the signature.
const REPLY_TIMEOUT_MS = 6000
// How long to wait to join the channel before calling it a connection problem.
const JOIN_TIMEOUT_MS = 10000

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
export default function SignMobilePage({ token, expiresAt = null }: { token: string; expiresAt?: number | null }) {
  const { supabase } = useUniversal()
  // Transparent canvas (dark ink), matching the desktop draw pad so the phone
  // signature places identically. The white look comes from the CSS background.
  const ink = useInkCanvas()
  const [pin, setPin] = useState('')
  // A code past its expiry: the computer has stopped listening, so say so
  // before anyone draws, rather than after they press Send.
  const [status, setStatus] = useState<Status>(() => (expiresAt !== null && Date.now() >= expiresAt ? 'expired' : 'idle'))

  // One channel for the life of the page, joined on the first send. A fresh
  // channel per send re-joined the same topic while the last one was still
  // leaving, and the second attempt (say, after a wrong PIN) hung on
  // "Sending…" for ever. Replies are routed to the send that asked, by nonce.
  const chan = useRef<{
    channel: RealtimeChannel
    ready: Promise<void>
    waiters: Map<string, (r: MobileSignResult) => void>
  } | null>(null)

  useEffect(() => () => {
    if (chan.current) void supabase.removeChannel(chan.current.channel)
    chan.current = null
  }, [supabase])

  function join() {
    if (chan.current) return chan.current
    const waiters = new Map<string, (r: MobileSignResult) => void>()
    const channel = supabase.channel(mobileSignChannel(token))
    channel.on('broadcast', { event: 'result' }, (msg: { payload: MobileSignResult }) => {
      const nonce = msg.payload?.nonce
      const waiter = nonce ? waiters.get(nonce) : undefined
      if (!nonce || !waiter) return
      waiters.delete(nonce)
      waiter(msg.payload)
    })
    const ready = new Promise<void>((resolve, reject) => {
      const timer = window.setTimeout(() => reject(new Error('TIMED_OUT')), JOIN_TIMEOUT_MS)
      channel.subscribe((s) => {
        if (s === 'SUBSCRIBED') { window.clearTimeout(timer); resolve() }
        if (s === 'CHANNEL_ERROR' || s === 'TIMED_OUT' || s === 'CLOSED') { window.clearTimeout(timer); reject(new Error(s)) }
      })
    })
    const joined = { channel, ready, waiters }
    chan.current = joined
    // A failed join is thrown away, so the next send starts a clean one.
    ready.catch(() => {
      if (chan.current === joined) chan.current = null
      void supabase.removeChannel(channel)
    })
    return joined
  }

  async function submit() {
    const signature = ink.toDataUrl()
    if (!signature || pin.length !== 6) { setStatus('invalid'); return }
    if (expiresAt !== null && Date.now() >= expiresAt) { setStatus('expired'); return }
    setStatus('sending')
    const nonce = randomHex(8)
    try {
      const { channel, ready, waiters } = join()
      await ready
      // Wait for the desktop's reply — registered before sending, so it can't
      // be missed.
      const reply = new Promise<MobileSignResult | null>((resolve) => {
        const timer = window.setTimeout(() => { waiters.delete(nonce); resolve(null) }, REPLY_TIMEOUT_MS)
        waiters.set(nonce, (r) => { window.clearTimeout(timer); resolve(r) })
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
    }
  }

  if (status === 'expired') {
    return (
      <main className="flex min-h-svh flex-col items-center justify-center gap-3 bg-slate-900 p-6 text-center text-white">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/20 text-3xl" aria-hidden="true">⏱</div>
        <h1 className="text-lg font-semibold">This code has expired</h1>
        <p className="text-sm text-slate-400">
          On your computer, press “Get a new code”, then scan the new code with your phone.
        </p>
      </main>
    )
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
