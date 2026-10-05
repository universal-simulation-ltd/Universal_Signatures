import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import { SignInDialog, useOrg, useSignRequests, useUniversal, useUser, type SignRequest } from '@unisim/sdk'
import ErrorBoundary from '../ErrorBoundary'
import type { Anchor, PlacePoint } from '../../lib/pdf'
import {
  certificateLink,
  createSignatureRequest,
  emailSignRequest,
  recipientToken,
  revokeSignatureRequest,
  signerLink,
  type SignField,
} from '../../lib/signRequests'
import { intlLocale, useT, type MessageKey } from '../../i18n'

const PositionPicker = lazy(() => import('./PositionPicker'))
const loadPdf = () => import('../../lib/pdf')

// Only its origin is used, by the in-app sign-in's "manage your account" link.
// Sign-in itself happens in <SignInDialog /> right here: linking to the hub's
// /login navigated away from the signature (and PDF) being worked on, and the
// hub then sent a newcomer on to the Assess portal, not back here.
const SIGNUP_URL = 'https://app.unisim.co.uk/login'
const HUB_URL = 'https://app.unisim.co.uk/'
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const ANCHORS: { id: Anchor; label: MessageKey }[] = [
  { id: 'top-left', label: 'send.anchor_top_left' }, { id: 'top-center', label: 'send.anchor_top_center' }, { id: 'top-right', label: 'send.anchor_top_right' },
  { id: 'mid-left', label: 'send.anchor_mid_left' }, { id: 'mid-center', label: 'send.anchor_mid_center' }, { id: 'mid-right', label: 'send.anchor_mid_right' },
  { id: 'bottom-left', label: 'send.anchor_bottom_left' }, { id: 'bottom-center', label: 'send.anchor_bottom_center' }, { id: 'bottom-right', label: 'send.anchor_bottom_right' },
]

// The 9-grid as a centre point, for a box `widthPct` wide and about a third as
// tall. Close enough: the stamp is clamped onto the page whatever the shape.
function anchorPoint(a: Anchor, widthPct: number): PlacePoint {
  const [v, h] = a.split('-')
  const w = widthPct / 100
  const margin = 0.04
  const xPct = h === 'left' ? margin + w / 2 : h === 'right' ? 1 - margin - w / 2 : 0.5
  const hh = (w * 0.71) / 3 // a third of the width, on an A4-ish page
  const yPct = v === 'top' ? margin + hh / 2 : v === 'bottom' ? 1 - margin - hh / 2 : 0.5
  return { xPct, yPct }
}

// The "Sign here" box shown in the position picker in place of a signature.
function signHereImage(label: string): string {
  const c = document.createElement('canvas')
  c.width = 600
  c.height = 200
  const ctx = c.getContext('2d')!
  ctx.fillStyle = 'rgba(255, 237, 213, 0.85)'
  ctx.strokeStyle = '#ea580c'
  ctx.lineWidth = 6
  ctx.setLineDash([18, 12])
  ctx.beginPath()
  ctx.roundRect(6, 6, 588, 188, 18)
  ctx.fill()
  ctx.stroke()
  ctx.fillStyle = '#c2410c'
  ctx.font = 'bold 64px Helvetica, Arial, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(label, 300, 104)
  return c.toDataURL('image/png')
}

/**
 * "Send it to be signed": the two-party flow. The PDF in the drop circle is
 * stored for the signer with where to sign written into it, a one-signer
 * request is minted, and the link is emailed (or copied). The signer signs in
 * their browser, no account needed; both sides get the certificate.
 */
export default function SendForSigning({ file, pages }: { file: File | null; pages: number }) {
  const t = useT()
  const { supabase, session, activeOrgId } = useUniversal()
  const { user } = useUser()
  const { orgs, loading: orgsLoading, error: orgsError } = useOrg()
  const signedIn = !!session?.user && session.user.is_anonymous !== true
  const emailVerified = !!session?.user?.email_confirmed_at
  // No company is a normal state (0228): the request is then a personal one.
  // A failed or pending read is NOT "no company" — sending waits for the answer.
  const noCompany = !orgsLoading && !orgsError && orgs.length === 0
  const owner = noCompany && user?.id ? { userId: user.id } : activeOrgId ? { orgId: activeOrgId } : null

  const [page, setPage] = useState(-1)
  const [widthPct, setWidthPct] = useState(25)
  const [anchor, setAnchor] = useState<Anchor>('bottom-right')
  const [pos, setPos] = useState<PlacePoint | null>(null)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [protect, setProtect] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState<{ to: string; link: string; certId: string; emailed: 'sent' | 'draft' | 'failed'; note?: string } | null>(null)
  const [copied, setCopied] = useState<string | null>(null)
  const signHereLabel = t('send.sign_here')
  const signHere = useMemo(() => signHereImage(signHereLabel), [signHereLabel])
  // Bumped after a send, so the list below re-reads.
  const [listVersion, setListVersion] = useState(0)
  const [signInOpen, setSignInOpen] = useState(false)

  if (!signedIn) {
    return (
      <div className="mt-4 rounded-lg bg-slate-50 p-4" data-testid="send-signed-out">
        <p className="text-sm text-slate-700">
          {t.rich('send.signed_out_intro', { id: <strong>Universal ID</strong> })}
        </p>
        <button type="button" onClick={() => setSignInOpen(true)} className="mt-3 inline-flex rounded-lg bg-orange-700 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-800">
          {t('send.signed_out_cta')}
        </button>
        <SignInDialog open={signInOpen} onClose={() => setSignInOpen(false)} hubLoginHref={SIGNUP_URL} initialMode="signup" />
      </div>
    )
  }

  if (!emailVerified) {
    return (
      <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        {t.rich('send.unverified', { link: <a href={HUB_URL} className="font-semibold underline">{t('send.unverified_link')}</a> })}
      </div>
    )
  }

  const field: SignField = { page, widthPct, ...(pos ?? anchorPoint(anchor, widthPct)) }
  const validEmail = EMAIL_RE.test(email.trim())

  async function copy(text: string, key: string) {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(key)
      window.setTimeout(() => setCopied((c) => (c === key ? null : c)), 1800)
    } catch {
      setError(t('send.err_copy'))
    }
  }

  async function onSend() {
    if (!file || !owner || !user?.email || busy) return
    const to = email.trim()
    if (!EMAIL_RE.test(to)) { setError(t('send.err_no_email')); return }
    setBusy(true)
    setError(null)
    setSent(null)
    try {
      const { withSignField } = await loadPdf()
      const bytes = await withSignField(await file.arrayBuffer(), field)
      const created = await createSignatureRequest(supabase, {
        owner, bytes, fileName: file.name, senderEmail: user.email, recipientEmail: to, protect,
      })
      if (!created.ok || !created.token || !created.certId) {
        if (created.error) console.warn('[send for signing]', created.error)
        setError(created.error === 'storage_full'
          ? t('send.err_storage_full')
          : t('send.err_create'))
        return
      }
      const link = signerLink(created.token)
      const res = await emailSignRequest(supabase, {
        to, link, docName: file.name, senderName: user.email, bytes: protect ? undefined : bytes,
      })
      if (res.ok) {
        setSent({ to, link, certId: created.certId, emailed: 'sent' })
      } else if (res.code === 'not_configured') {
        // No email provider on the server: hand over a ready-made draft.
        const subject = t('send.mail_subject', { name: file.name })
        const body = t('send.mail_body', { name: file.name, link })
        window.location.href = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
        setSent({ to, link, certId: created.certId, emailed: 'draft' })
      } else {
        setSent({
          to, link, certId: created.certId, emailed: 'failed',
          note: res.code === 'rate_limited' ? t('send.err_rate_limited') : res.error,
        })
      }
      setListVersion((v) => v + 1)
    } catch (err) {
      setError(err instanceof Error && err.name === 'EncryptedPdfError'
        ? t('send.err_encrypted', { name: file.name })
        : t('send.err_prepare'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mt-4" data-testid="send-for-signing">
      {file ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="send-page" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">{t('send.where_label')}</label>
              <select
                id="send-page"
                value={page}
                onChange={(e) => setPage(Number(e.target.value))}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none"
              >
                <option value={-1}>{pages > 1 ? t('send.page_last_n', { n: pages }) : t('send.page_last')}</option>
                {pages > 1 && Array.from({ length: pages - 1 }).map((_, i) => <option key={i} value={i}>{t('send.page_n', { n: i + 1 })}</option>)}
              </select>
              <label htmlFor="send-size" className="mt-3 mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">{t('send.size_label', { pct: widthPct })}</label>
              <input id="send-size" type="range" min={8} max={50} value={widthPct} onChange={(e) => setWidthPct(Number(e.target.value))} className="w-full accent-orange-600" />
            </div>
            <div>
              <div className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">{t('send.position_label')}</div>
              <div role="group" aria-label={t('send.position_group_aria')} className={`grid grid-cols-3 gap-1.5 transition ${pos ? 'opacity-40' : ''}`}>
                {ANCHORS.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => { setPos(null); setAnchor(a.id) }}
                    aria-label={t(a.label)}
                    aria-pressed={!pos && anchor === a.id}
                    title={t(a.label)}
                    className={`h-9 rounded-md ring-1 transition ${!pos && anchor === a.id ? 'bg-orange-600 ring-orange-600' : 'bg-white ring-slate-200 hover:bg-slate-50'}`}
                  >
                    <span className={`mx-auto block h-2 w-2 rounded-full ${!pos && anchor === a.id ? 'bg-white' : 'bg-slate-300'}`} />
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setPickerOpen(true)}
                className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:border-orange-400 hover:bg-orange-50/40"
              >
                {pos ? t('send.custom_position') : t('send.choose_on_page')}
              </button>
              {pos && (
                <div className="mt-1.5 flex items-center justify-between text-[11px] text-emerald-700">
                  <span>{t('send.custom_set')}</span>
                  <button type="button" onClick={() => setPos(null)} className="font-medium text-slate-500 hover:text-rose-600">{t('send.use_grid')}</button>
                </div>
              )}
            </div>
          </div>

          {pickerOpen && (
            <Suspense fallback={null}>
              <PositionPicker
                file={file}
                pageIndex={page}
                sigPng={signHere}
                widthPct={widthPct}
                onWidthChange={setWidthPct}
                initialPos={pos ?? anchorPoint(anchor, widthPct)}
                onConfirm={(p) => { setPos(p); setPickerOpen(false) }}
                onClose={() => setPickerOpen(false)}
              />
            </Suspense>
          )}

          <label htmlFor="send-email" className="mt-4 mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">{t('send.email_label')}</label>
          <input
            id="send-email"
            type="email"
            inputMode="email"
            autoComplete="off"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('send.email_placeholder')}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
          />

          <label className="mt-3 flex cursor-pointer items-start gap-2.5 rounded-lg border border-slate-200 bg-slate-50/60 p-3">
            <input type="checkbox" checked={protect} onChange={(e) => setProtect(e.target.checked)} className="mt-0.5 h-4 w-4 accent-orange-600" />
            <span className="text-xs text-slate-600">
              {t.rich('send.protect_label', { title: <span className="font-semibold text-slate-800">{t('send.protect_title')}</span> })}
            </span>
          </label>

          <p className="mt-3 text-[11px] text-slate-500">
            {t('send.storage_note')}
          </p>

          {error && <p role="alert" className="mt-3 text-sm text-rose-700">{error}</p>}

          <button
            type="button"
            onClick={onSend}
            disabled={busy || !validEmail || !owner}
            className="mt-3 w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-black disabled:opacity-50"
          >
            {busy ? t('send.btn_sending') : !validEmail ? t('send.btn_enter_email') : t('send.btn_send')}
          </button>
        </>
      ) : (
        <p className="text-center text-xs text-slate-500">{t('send.drop_hint')}</p>
      )}

      <div role="status">
        {sent && (
          <div className={`mt-3 rounded-lg p-3 ${sent.emailed === 'failed' ? 'bg-amber-50' : 'bg-emerald-50'}`} data-testid="send-result">
            <p className={`text-xs font-semibold ${sent.emailed === 'failed' ? 'text-amber-900' : 'text-emerald-800'}`}>
              {sent.emailed === 'sent'
                ? t('send.result_sent', { email: sent.to })
                : sent.emailed === 'draft'
                  ? t('send.result_draft', { email: sent.to })
                  : t('send.result_failed', { email: sent.to, note: sent.note ?? '' })}
            </p>
            <div className="mt-2 flex items-center gap-2">
              <input readOnly value={sent.link} aria-label={t('send.link_aria')} className="min-w-0 flex-1 rounded-md border border-slate-200 bg-white px-2 py-1.5 text-[11px] text-slate-700" />
              <button type="button" onClick={() => copy(sent.link, 'new')} className="shrink-0 rounded-md bg-emerald-600 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-emerald-700">
                {copied === 'new' ? t('send.copied') : t('send.copy_link')}
              </button>
            </div>
            <a href={certificateLink(sent.certId)} target="_blank" rel="noreferrer" className="mt-2 inline-block text-[11px] font-medium text-emerald-800 underline">
              {t('send.cert_page_link')}
            </a>
          </div>
        )}
      </div>

      <ErrorBoundary fallback={<p className="mt-5 text-xs text-slate-400">{t('send.list_load_error')}</p>}>
        <SentList
          version={listVersion}
          copied={copied}
          onCopy={async (r) => {
            const token = await recipientToken(supabase, r.id)
            if (token) await copy(signerLink(token), r.id)
            else setError(t('send.err_link_not_found'))
          }}
          onRevoke={async (r) => {
            const res = await revokeSignatureRequest(supabase, r)
            if (!res.ok) setError(res.error ?? t('send.err_withdraw'))
          }}
        />
      </ErrorBoundary>
    </div>
  )
}

function SentList({
  version, copied, onCopy, onRevoke,
}: {
  version: number
  copied: string | null
  onCopy: (r: SignRequest) => Promise<void>
  onRevoke: (r: SignRequest) => Promise<void>
}) {
  // The company's requests plus any personal ones, newest first — including
  // any sent from Universal PDF, which uses the same requests.
  const t = useT()
  const { requests, loading, refresh } = useSignRequests()
  useEffect(() => { if (version > 0) refresh() }, [version, refresh])
  const [confirming, setConfirming] = useState<string | null>(null)
  const [working, setWorking] = useState<string | null>(null)
  return (
    <div className="mt-5 border-t border-slate-100 pt-4" data-testid="sent-list">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">{t('send.list_title')}</h3>
      {loading && requests.length === 0 ? (
        <p className="mt-2 text-xs text-slate-400">{t('send.list_loading')}</p>
      ) : requests.length === 0 ? (
        <p className="mt-2 text-xs text-slate-400">{t('send.list_empty')}</p>
      ) : (
        <ul className="mt-2 space-y-2">
          {requests.map((r) => {
            const done = r.status === 'completed' || r.status === 'signed'
            const expired = !done && new Date(r.expires_at).getTime() < Date.now()
            return (
              <li key={r.id} className="rounded-lg border border-slate-200 bg-slate-50 p-2.5">
                <div className="flex items-start justify-between gap-2">
                  <span className="min-w-0">
                    <span className="block truncate text-xs font-medium text-slate-800" title={r.doc_name ?? ''}>{r.doc_name ?? 'document.pdf'}</span>
                    <span className="block truncate text-[11px] text-slate-500">
                      {r.recipient_email ?? '—'} · {new Date(r.created_at).toLocaleDateString(intlLocale(t.lang))}
                    </span>
                  </span>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${done ? 'bg-emerald-100 text-emerald-800' : expired ? 'bg-slate-200 text-slate-600' : 'bg-amber-100 text-amber-800'}`}>
                    {done ? t('send.status_signed') : expired ? t('send.status_expired') : t('send.status_waiting')}
                  </span>
                </div>
                {confirming === r.id ? (
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px]">
                    <span className="text-slate-600">{t('send.withdraw_confirm')}</span>
                    <button
                      type="button"
                      disabled={working === r.id}
                      onClick={async () => { setWorking(r.id); await onRevoke(r); refresh(); setWorking(null); setConfirming(null) }}
                      className="rounded-md bg-rose-600 px-2 py-1 font-semibold text-white hover:bg-rose-700 disabled:opacity-50"
                    >
                      {working === r.id ? t('send.withdrawing') : t('send.withdraw')}
                    </button>
                    <button type="button" onClick={() => setConfirming(null)} className="rounded-md px-2 py-1 font-semibold text-slate-600 hover:bg-slate-100">
                      {t('send.keep_it')}
                    </button>
                  </div>
                ) : (
                  <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-[11px] font-medium">
                    {done && r.cert_id && (
                      <a href={certificateLink(r.cert_id)} target="_blank" rel="noreferrer" className="text-orange-700 hover:underline">{t('send.certificate')}</a>
                    )}
                    {!done && !expired && (
                      <button type="button" onClick={() => void onCopy(r)} className="text-orange-700 hover:underline">
                        {copied === r.id ? t('send.copied') : t('send.copy_link')}
                      </button>
                    )}
                    {/* A signed request is the proof behind its certificate, so it
                        stays: deleting it would make the certificate page say
                        "no record found". Only one still waiting can go. */}
                    {!done && (
                      <button type="button" onClick={() => setConfirming(r.id)} className="text-slate-500 hover:text-rose-700">
                        {t('send.withdraw')}
                      </button>
                    )}
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
