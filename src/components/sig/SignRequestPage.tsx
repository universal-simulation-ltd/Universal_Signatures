import { useEffect, useRef, useState } from 'react'
import { useUniversal } from '@unisim/sdk'
import { useSigStore } from '../../stores/sigStore'
import type { StudioMode } from '../../lib/types'
import type { StoredSignField } from '../../lib/pdf'
import { trimToInk } from '../../lib/signature'
import {
  beginSigning,
  certificateLink,
  loadSigning,
  requestSigningCode,
  submitSigned,
  verifySigningCode,
} from '../../lib/signRequests'
import SignaturePad from './SignaturePad'
import TypeSignature from './TypeSignature'
import PhoneSignPanel from './PhoneSignPanel'
import { CONTAINER } from '../../lib/layout'
import { getT, useT, type MessageKey } from '../../i18n'

const loadPdf = () => import('../../lib/pdf')
const loadPdfjs = () => import('../../lib/pdfjs')
const loadQr = () => import('../../lib/qr')

// Pages rendered for reading. A longer document can still be downloaded whole.
const PAGE_LIMIT = 30
const UUID_RE = /^[0-9a-f-]{36}$/i

type Phase =
  | { kind: 'starting' }
  | { kind: 'failed'; message: string; retry?: boolean }
  | { kind: 'done-before' }
  | { kind: 'verify'; maskedEmail: string | null }
  | { kind: 'loading' }
  | { kind: 'ready' }
  | { kind: 'signed'; certId: string | null; completed: boolean }

interface Doc {
  name: string
  bytes: ArrayBuffer
  field: StoredSignField
  pageCount: number
  certId: string | null
  pages: { src: string; width: number; height: number }[]
}

const MODES: { id: StudioMode; label: MessageKey }[] = [
  { id: 'draw', label: 'send.mode_draw' },
  { id: 'type', label: 'send.mode_type' },
  { id: 'phone', label: 'send.mode_phone' },
]

// Where to sign when a request carries no field (one minted by another app):
// bottom right of the last page.
const DEFAULT_FIELD: StoredSignField = { page: -1, xPct: 0.75, yPct: 0.88, widthPct: 25 }

function messageFor(code: string | undefined, fallback?: string): string {
  const t = getT()
  switch (code) {
    case 'invalid_token': return t('send.req_invalid_token')
    case 'expired': return t('send.req_expired')
    case 'deleted': return t('send.req_deleted')
    case 'completed': return t('send.req_completed')
    case 'already_signed': return t('send.req_already_signed')
    case 'network': return t('send.req_network')
    case 'verification_expired': return t('send.req_verification_expired')
    default: return fallback || t('send.req_generic')
  }
}

/**
 * The signer's page for a "Send to be signed" request (`?signdoc=<token>`).
 * No account: the link is the key — plus, if the sender asked, a code emailed
 * to the address they sent it to. The signer reads the document, signs where
 * it's marked (drawn, typed or on their phone), and it goes back signed, with a
 * verification code on it, to the certificate both of them can open.
 */
export default function SignRequestPage({ token }: { token: string }) {
  const t = useT()
  const { supabase } = useUniversal()
  const [phase, setPhase] = useState<Phase>({ kind: 'starting' })
  const [session, setSession] = useState<string | undefined>(undefined)
  const [doc, setDoc] = useState<Doc | null>(null)
  const [attempt, setAttempt] = useState(0)

  // 1) What sort of link is this? (Inert on the server.)
  useEffect(() => {
    let cancelled = false
    if (!UUID_RE.test(token)) { setPhase({ kind: 'failed', message: messageFor('invalid_token') }); return }
    setPhase({ kind: 'starting' })
    beginSigning(supabase, token).then((b) => {
      if (cancelled) return
      if (!b.ok) { setPhase({ kind: 'failed', message: messageFor(b.code, b.error), retry: b.code === 'network' }); return }
      if (b.alreadySigned || b.completed) { setPhase({ kind: 'done-before' }); return }
      if (b.requireVerification) { setPhase({ kind: 'verify', maskedEmail: b.maskedEmail ?? null }); return }
      setPhase({ kind: 'loading' })
    })
    return () => { cancelled = true }
  }, [supabase, token, attempt])

  // 2) Fetch the document (once allowed), read where to sign, render the pages.
  useEffect(() => {
    if (phase.kind !== 'loading') return
    let cancelled = false
    ;(async () => {
      const l = await loadSigning(supabase, token, session)
      if (cancelled) return
      if (!l.ok || !l.signedUrl) {
        if (l.code === 'verification_required' || l.code === 'verification_expired') {
          setSession(undefined)
          setPhase({ kind: 'verify', maskedEmail: null })
          return
        }
        setPhase({ kind: 'failed', message: messageFor(l.code, l.error), retry: l.code === 'network' })
        return
      }
      if (l.alreadySigned) { setPhase({ kind: 'done-before' }); return }
      try {
        const res = await fetch(l.signedUrl)
        if (!res.ok) throw new Error(String(res.status))
        const bytes = await res.arrayBuffer()
        const [{ readSignField }, { renderPages }] = await Promise.all([loadPdf(), loadPdfjs()])
        const { field, pages: pageCount } = await readSignField(bytes)
        const { pages } = await renderPages(bytes, 760, PAGE_LIMIT)
        if (cancelled) return
        setDoc({ name: l.docName ?? 'document.pdf', bytes, field: field ?? DEFAULT_FIELD, pageCount, certId: l.certId ?? null, pages })
        setPhase({ kind: 'ready' })
      } catch {
        if (!cancelled) setPhase({ kind: 'failed', message: getT()('send.req_open_failed'), retry: true })
      }
    })()
    return () => { cancelled = true }
  }, [phase.kind, supabase, token, session])

  return (
    <div className={`${CONTAINER} py-6`}>
      <div className="mx-auto max-w-3xl">
        {phase.kind === 'starting' || phase.kind === 'loading' ? (
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-orange-500" />
            {phase.kind === 'starting' ? t('send.req_opening_link') : t('send.req_opening_doc')}
          </div>
        ) : phase.kind === 'failed' ? (
          <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-800">
            {phase.message}
            {phase.retry && (
              <button type="button" onClick={() => setAttempt((n) => n + 1)} className="mt-3 block rounded-md bg-white px-3 py-1.5 text-xs font-semibold text-rose-900 ring-1 ring-rose-200 hover:bg-rose-100">
                {t('send.req_try_again')}
              </button>
            )}
          </div>
        ) : phase.kind === 'done-before' ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-sm text-emerald-800">
            {t('send.req_done_before')}
          </div>
        ) : phase.kind === 'verify' ? (
          <VerifyGate
            token={token}
            maskedEmail={phase.maskedEmail}
            onVerified={(s) => { setSession(s); setPhase({ kind: 'loading' }) }}
          />
        ) : phase.kind === 'signed' ? (
          <Signed phase={phase} />
        ) : doc ? (
          <SignDocument
            doc={doc}
            onSigned={async (bytes, page) => {
              const r = await submitSigned(supabase, token, bytes, page, session)
              if (!r.ok) return messageFor(r.code, r.error)
              setPhase({ kind: 'signed', certId: r.cert_id ?? doc.certId, completed: !!r.completed })
              // The signer keeps exactly what was sent back.
              download(bytes, doc.name.replace(/\.pdf$/i, '') + '-signed.pdf')
              return null
            }}
          />
        ) : null}
      </div>
    </div>
  )
}

function download(bytes: Uint8Array, name: string) {
  const url = URL.createObjectURL(new Blob([bytes as BlobPart], { type: 'application/pdf' }))
  const a = document.createElement('a')
  a.href = url
  a.download = name
  document.body.appendChild(a)
  a.click()
  a.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}

// ── Confirm the address first (when the sender asked) ───────────────────────
function VerifyGate({ token, maskedEmail, onVerified }: { token: string; maskedEmail: string | null; onVerified: (session: string) => void }) {
  const t = useT()
  const { supabase } = useUniversal()
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [sentTo, setSentTo] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function sendCode() {
    if (busy || !email.trim()) return
    setBusy(true); setError(null)
    const r = await requestSigningCode(supabase, token, email.trim())
    setBusy(false)
    if (!r.ok) {
      setError(r.code === 'email_mismatch'
        ? t('send.gate_err_mismatch')
        : r.code === 'too_soon'
          ? t.plural('send.gate_err_too_soon', r.retryAfter ?? 60)
          : r.code === 'too_many_sends'
            ? t('send.gate_err_too_many_sends')
            : r.error ?? t('send.gate_err_send'))
      return
    }
    setSentTo(r.maskedEmail ?? email.trim())
  }

  async function checkCode() {
    if (busy || code.replace(/\D/g, '').length < 6) return
    setBusy(true); setError(null)
    const r = await verifySigningCode(supabase, token, code.replace(/\D/g, ''))
    setBusy(false)
    if (!r.ok || !r.session) {
      setError(r.code === 'bad_credentials'
        ? (r.triesLeft ? t.plural('send.gate_err_tries_left', r.triesLeft) : t('send.gate_err_no_match'))
        : r.code === 'code_expired'
          ? t('send.gate_err_code_expired')
          : r.code === 'too_many_attempts'
            ? t('send.gate_err_too_many_attempts')
            : r.error ?? t('send.gate_err_check'))
      return
    }
    onVerified(r.session)
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6" data-testid="verify-gate">
      <h1 className="text-lg font-bold text-slate-900">{t('send.gate_title')}</h1>
      <p className="mt-1 text-sm text-slate-600">
        {maskedEmail
          ? t.rich('send.gate_intro_masked', { email: <span className="font-mono">{maskedEmail}</span> })
          : t('send.gate_intro')}
      </p>
      {!sentTo ? (
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <label htmlFor="gate-email" className="sr-only">{t('send.gate_email_label')}</label>
          <input
            id="gate-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') void sendCode() }}
            placeholder={t('send.gate_email_placeholder')}
            className="min-w-0 flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
          />
          <button type="button" onClick={sendCode} disabled={busy || !email.trim()} className="rounded-md bg-orange-700 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-800 disabled:opacity-50">
            {busy ? t('send.gate_sending') : t('send.gate_send_code')}
          </button>
        </div>
      ) : (
        <div className="mt-4">
          <p className="text-sm text-slate-700">{t.rich('send.gate_code_sent', { email: <span className="font-mono">{sentTo}</span> })}</p>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row">
            <label htmlFor="gate-code" className="sr-only">{t('send.gate_code_label')}</label>
            <input
              id="gate-code"
              inputMode="numeric"
              autoComplete="one-time-code"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              onKeyDown={(e) => { if (e.key === 'Enter') void checkCode() }}
              placeholder="123456"
              className="w-40 rounded-md border border-slate-300 px-3 py-2 text-sm tracking-widest outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            />
            <button type="button" onClick={checkCode} disabled={busy || code.length < 6} className="rounded-md bg-orange-700 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-800 disabled:opacity-50">
              {busy ? t('send.gate_checking') : t('send.gate_open')}
            </button>
          </div>
          <button type="button" onClick={() => { setSentTo(null); setCode('') }} className="mt-2 text-xs font-medium text-slate-500 hover:text-orange-700">
            {t('send.gate_send_another')}
          </button>
        </div>
      )}
      {error && <p role="alert" className="mt-3 text-sm text-rose-700">{error}</p>}
    </div>
  )
}

// ── Read and sign ───────────────────────────────────────────────────────────
function SignDocument({ doc, onSigned }: { doc: Doc; onSigned: (bytes: Uint8Array, page: number) => Promise<string | null> }) {
  const t = useT()
  const mode = useSigStore((s) => s.mode)
  const setMode = useSigStore((s) => s.setMode)
  const sig = useSigStore((s) => s.baseImage())
  const [trimmed, setTrimmed] = useState<{ src: string; png: string } | null>(null)
  const [agree, setAgree] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fieldRef = useRef<HTMLDivElement>(null)

  const stamp = sig && trimmed?.src === sig ? trimmed.png : null
  useEffect(() => {
    if (!sig) return
    let cancelled = false
    trimToInk(sig).then((png) => { if (!cancelled) setTrimmed({ src: sig, png }) }).catch(() => { if (!cancelled) setTrimmed({ src: sig, png: sig }) })
    return () => { cancelled = true }
  }, [sig])

  const fieldPage = doc.field.page < 0 ? doc.pageCount - 1 : Math.min(doc.field.page, doc.pageCount - 1)
  const fieldShown = fieldPage < doc.pages.length

  async function sign() {
    if (!sig || !agree || busy) return
    setBusy(true); setError(null)
    try {
      const { signPdf } = await loadPdf()
      const qrPng = doc.certId ? await (await loadQr()).makeQrPng(certificateLink(doc.certId)) : undefined
      const bytes = await signPdf(doc.bytes, stamp ?? await trimToInk(sig), {
        pageIndex: fieldPage,
        anchor: 'bottom-right',
        widthPct: doc.field.widthPct,
        pos: { xPct: doc.field.xPct, yPct: doc.field.yPct },
        qrPng,
      })
      const problem = await onSigned(bytes, fieldPage)
      if (problem) setError(problem)
    } catch {
      setError(t('send.doc_err_sign'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <h1 className="text-lg font-bold text-slate-900">{t('send.doc_title', { name: doc.name })}</h1>
        <p className="mt-1 text-sm text-slate-600">
          {t.rich('send.doc_intro', {
            link: (
              <button type="button" onClick={() => fieldRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })} className="font-semibold text-orange-700 hover:underline">
                {t('send.doc_intro_link', { page: fieldPage + 1 })}
              </button>
            ),
          })}
        </p>
        <button
          type="button"
          onClick={() => download(new Uint8Array(doc.bytes), doc.name)}
          className="mt-2 text-xs font-medium text-slate-500 hover:text-orange-700"
        >
          {t('send.doc_download')}
        </button>
      </div>

      <div className="space-y-4" aria-label={t('send.doc_aria')}>
        {doc.pages.map((p, i) => (
          <div key={i} className="relative mx-auto overflow-hidden rounded-lg bg-white shadow ring-1 ring-slate-200" style={{ maxWidth: p.width }}>
            <img src={p.src} alt={t('send.doc_page_alt', { n: i + 1, total: doc.pageCount })} className="block w-full" draggable={false} />
            {i === fieldPage && (
              <div
                ref={fieldRef}
                data-testid="sign-field"
                className="absolute flex items-center justify-center rounded-md border-2 border-dashed border-orange-500 bg-orange-100/60"
                style={{
                  left: `${doc.field.xPct * 100}%`,
                  top: `${doc.field.yPct * 100}%`,
                  width: `${doc.field.widthPct}%`,
                  aspectRatio: '3',
                  transform: 'translate(-50%, -50%)',
                }}
              >
                {stamp ? (
                  <img src={stamp} alt={t('send.doc_stamp_alt')} className="max-h-full max-w-full object-contain" />
                ) : (
                  <span className="text-[11px] font-bold text-orange-800">{t('send.sign_here')}</span>
                )}
              </div>
            )}
          </div>
        ))}
        {doc.pageCount > doc.pages.length && (
          <p className="text-center text-xs text-slate-500">
            {t('send.doc_showing_first', { shown: doc.pages.length, total: doc.pageCount })}
          </p>
        )}
        {!fieldShown && (
          <p className="text-center text-xs text-slate-500">{t('send.doc_field_page', { page: fieldPage + 1 })}</p>
        )}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">{t('send.doc_your_signature')}</h2>
          <div className="inline-flex rounded-md bg-slate-100 p-0.5">
            {MODES.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setMode(m.id)}
                aria-pressed={mode === m.id}
                className={`rounded px-3 py-1 text-xs font-semibold ${mode === m.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
              >
                {t(m.label)}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-4">
          {mode === 'type' ? <TypeSignature /> : mode === 'phone' ? <PhoneSignPanel /> : <SignaturePad />}
        </div>

        <label className="mt-4 flex cursor-pointer items-start gap-2.5 rounded-lg border border-slate-200 bg-slate-50/60 p-3">
          <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-0.5 h-4 w-4 accent-orange-600" />
          <span className="text-xs text-slate-700">
            {t('send.doc_agree')}
          </span>
        </label>

        {error && <p role="alert" className="mt-3 text-sm text-rose-700">{error}</p>}

        <button
          type="button"
          onClick={sign}
          disabled={!sig || !agree || busy}
          className="mt-3 w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-black disabled:opacity-50"
        >
          {busy ? t('send.doc_btn_signing') : !sig ? t('send.doc_btn_add_first') : !agree ? t('send.doc_btn_tick') : t('send.doc_btn_sign')}
        </button>
        <p className="mt-2 text-[11px] text-slate-500">
          {t('send.doc_privacy')}
        </p>
      </div>
    </div>
  )
}

function Signed({ phase }: { phase: { certId: string | null; completed: boolean } }) {
  const t = useT()
  return (
    <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6" data-testid="signed">
      <h1 className="text-lg font-bold text-emerald-900">{t('send.signed_title')}</h1>
      <p className="mt-1 text-sm text-emerald-800">
        {phase.completed
          ? t('send.signed_completed')
          : t('send.signed_partial')}
      </p>
      {phase.certId && (
        <a href={certificateLink(phase.certId)} className="mt-3 inline-flex rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800">
          {t('send.signed_open_cert')}
        </a>
      )}
    </div>
  )
}
