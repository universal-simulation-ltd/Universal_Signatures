import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { EMBEDDED, receivePdfs, sendSigned } from '../../lib/embed'
import { DropAnywhere, DropRing, SignInDialog, useFileDrop, useUniversal, useUser, type SigningAuditFields } from '@unisim/sdk'
import { useSigStore } from '../../stores/sigStore'
import type { PlacePoint } from '../../lib/pdf'
import { sha256Bytes, trimToInk } from '../../lib/signature'
import { ALL_PAGES, INITIAL_ALL_PAGES, INITIAL_PAGES } from '../../lib/types'
import { recordSignedCopyHash, recordSigningEvent } from '../../lib/cloud'
import type { PhoneAttestation } from '../../lib/phoneAttest'
import { useT, type MessageKey } from '../../i18n'
import DropWatermark from './DropWatermark'
import { useCoarsePointer } from '../../lib/useCoarsePointer'
import InitialsPanel, { InitialsPlacement, type InitialsChoice } from './InitialsPanel'
import SendForSigning from './SendForSigning'
import { btnPrimary, btnSecondarySm, btnSoftSm, Key, PenIcon } from '../ui'

// pdf-lib (~500 kB), pdf.js (+ its 1.3 MB worker) and the QR encoder are only
// needed once a PDF is in play, so they load on demand rather than in the
// first-load bundle. The page viewer pulls pdf.js in with it, and pdf.js spins up
// its worker the moment its module runs — before this split, every visit to
// the studio started that worker whether or not a PDF was ever opened.
const PageStrip = lazy(() => import('./PageStrip'))
const loadPdf = () => import('../../lib/pdf')
const loadQr = () => import('../../lib/qr')

// Only its origin is used, by the in-app sign-in's "manage your account" link.
// Sign-in itself happens in <SignInDialog /> right here: linking to the hub's
// /login navigated away from the signature (and PDF) being worked on, and the
// hub then sent a newcomer on to the Assess portal, not back here.
const SIGNUP_URL = 'https://app.unisim.co.uk/login'

// How the signature goes on (James, 2026-11-03), sign once first as the
// default. Each maps to a signPdf `pageIndex`; a one-page PDF only gets once.
type Layout = 'once' | 'every' | 'initial-once' | 'initial-every'
const LAYOUTS: { id: Layout; label: MessageKey }[] = [
  { id: 'once', label: 'sign.layout_once' },
  { id: 'every', label: 'sign.layout_every' },
  { id: 'initial-once', label: 'sign.layout_initial_once' },
  { id: 'initial-every', label: 'sign.layout_initial_every' },
]

const verifyUrlFor = (certId: string | null) => (certId ? `${location.origin}${import.meta.env.BASE_URL}verify/${certId}` : null)

export default function ApplyToPdf() {
  const t = useT()
  const [signInOpen, setSignInOpen] = useState(false)
  // "Click to browse" means nothing under a finger.
  const touch = useCoarsePointer()
  const composedImage = useSigStore((s) => s.currentImage())
  const baseImage = useSigStore((s) => s.baseImage())
  const hasExtras = useSigStore((s) => s.hasExtras())
  // Unticked by default (suite rule), so the box is worded as the exception:
  // the name/date/time chosen on the left go on unless you leave them off.
  const [omitExtras, setOmitExtras] = useState(false)
  // What actually gets stamped: with name/date unless left off for this
  // document, otherwise the raw signature.
  const currentImage = hasExtras && !omitExtras ? composedImage : baseImage
  // …cropped to its ink, so the size slider sizes the signature and a corner
  // position puts the ink in the corner (see trimToInk).
  const [trimmed, setTrimmed] = useState<{ src: string; png: string } | null>(null)
  const stampImage = currentImage && trimmed?.src === currentImage ? trimmed.png : null
  useEffect(() => {
    if (!currentImage) return
    let cancelled = false
    trimToInk(currentImage)
      .then((png) => { if (!cancelled) setTrimmed({ src: currentImage, png }) })
      .catch(() => { if (!cancelled) setTrimmed({ src: currentImage, png: currentImage }) })
    return () => { cancelled = true }
  }, [currentImage])
  const { supabase, session, activeOrgId } = useUniversal()
  const { user } = useUser()
  const signedIn = !!session?.user && session.user.is_anonymous !== true

  // Sign it yourself, or send it to someone else to sign. In the store, because
  // the studio beside (or, on a phone, above) this card folds away in send mode.
  const mode = useSigStore((s) => s.applyMode)
  const setApplyMode = useSigStore((s) => s.setApplyMode)
  // ⚠️ On a phone the studio sits ABOVE this card, so folding it moves this
  // switch up the page from under the finger that just tapped it. So a switch
  // notes where the switch was on screen, and once the fold has laid out the
  // page is scrolled by the difference: the switch stays put, the send flow
  // arrives under it. (Side by side on a wide screen, the difference is 0.)
  const switchRef = useRef<HTMLDivElement>(null)
  const switchTopRef = useRef<number | null>(null)
  function setMode(next: typeof mode) {
    if (next === mode) return
    switchTopRef.current = switchRef.current?.getBoundingClientRect().top ?? null
    setApplyMode(next)
  }
  useLayoutEffect(() => {
    const before = switchTopRef.current
    switchTopRef.current = null
    const el = switchRef.current
    if (before === null || !el) return
    const delta = el.getBoundingClientRect().top - before
    if (Math.abs(delta) > 1) window.scrollBy({ top: delta, behavior: 'instant' as ScrollBehavior })
  }, [mode])
  const [file, setFile] = useState<File | null>(null)
  const [pages, setPages] = useState(0)
  const [layout, setLayout] = useState<Layout>('once')
  const shownLayout: Layout = pages > 1 ? layout : 'once'
  // The page carrying the signature with Sign once / Initial all, sign once:
  // whichever page it was last put on in the viewer, else the first page for
  // Sign once and the last for Initial all, sign once.
  const [chosenPage, setChosenPage] = useState<number | null>(null)
  const sigPage = chosenPage ?? (shownLayout === 'initial-once' ? Math.max(0, pages - 1) : 0)
  const pageIndex = shownLayout === 'every' ? ALL_PAGES
    : shownLayout === 'initial-once' ? INITIAL_PAGES
      : shownLayout === 'initial-every' ? INITIAL_ALL_PAGES
        : sigPage
  // Where the signature goes: null is signPdf's bottom-right corner, which
  // the page preview shows it in until it is dragged somewhere else.
  const [pos, setPos] = useState<PlacePoint | null>(null)
  const [widthPct, setWidthPct] = useState(25)
  // For "initials on every page, signature on the last".
  const [initials, setInitials] = useState<InitialsChoice>({ png: null, anchor: 'bottom-right', widthPct: 10, includeLast: false })
  const initialling = shownLayout === 'initial-once' || shownLayout === 'initial-every'
  const needsInitials = initialling && !initials.png
  // The initials as the viewer draws them (James, 2026-11-03), on every page
  // that gets them.
  const previewInitials = initialling && initials.png
    ? { png: initials.png, anchor: initials.anchor, widthPct: initials.widthPct }
    : null
  const [makeRecord, setMakeRecord] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [verifyUrl, setVerifyUrl] = useState<string | null>(null)
  // Whether the signed copy's own fingerprint made it onto the record.
  const [copyRecorded, setCopyRecorded] = useState(false)
  // The file name of the last download, for the "Signed" confirmation.
  const [savedAs, setSavedAs] = useState<string | null>(null)

  // Not mid-signing.
  const accepting = !busy
  // Sign it myself takes a PDF only once there is a signature to put on it
  // (James, 2026-11-03): the circle is greyed out until then, and a PDF
  // dropped anyway is turned away with a note. Send to be signed needs no
  // signature of your own, so it is open from the start.
  const signatureFirst = mode === 'self' && !currentImage
  const [turnedAway, setTurnedAway] = useState(false)

  // `pageWide`: the circle is where to aim, not where you have to land. It also
  // closes a real trap in this app specifically — a PDF let go just outside the
  // ring used to be handed to the browser, which navigates away from the tab and
  // takes the signature drawn in the left-hand column with it, unsaved.
  const drop = useFileDrop({
    onFiles: (files) => {
      if (!files[0]) return
      if (signatureFirst) setTurnedAway(true)
      else void onFile(files[0])
    },
    accept: 'application/pdf',
    multiple: false,
    pageWide: true,
    clickToBrowse: !signatureFirst,
    disabled: !accepting,
    label: file ? t('sign.drop_label_another') : t('sign.drop_label'),
  })
  // ⚠️ `over`/`pageOver` go true for a page drag whether or not this zone is
  // disabled — the hook lights every page-wide zone and only checks `disabled`
  // when deciding who TAKES the file. Highlighting a target that will not take
  // anything is a lie, so gate the visuals here too.
  const over = drop.over && accepting && !signatureFirst

  // Embedded (lib/embed.ts): the PDF comes from the app that framed this one.
  useEffect(() => {
    if (!EMBEDDED) return
    return receivePdfs((f) => void onFile(f))
    // eslint-disable-next-line react-hooks/exhaustive-deps -- once; onFile reads state through setters
  }, [])

  async function onFile(f: File) {
    setError(null)
    setTurnedAway(false)
    setVerifyUrl(null)
    setSavedAs(null)
    // A page-wide target takes whatever is dropped on the margin, including the
    // font file the "Type" panel wants. Say which thing was wrong rather than
    // letting it fail later as an unreadable PDF.
    if (f.type !== 'application/pdf' && !/\.pdf$/i.test(f.name)) {
      setError(t('sign.error_not_pdf', { name: f.name }))
      return
    }
    setFile(f)
    try {
      const { pageCount } = await loadPdf()
      const n = await pageCount(await f.arrayBuffer())
      setPages(n)
      setChosenPage(null)
      setPos(null)
    } catch (err) {
      setError(
        err instanceof Error && err.name === 'EncryptedPdfError'
          ? t('sign.error_encrypted', { name: f.name })
          : t('sign.error_unreadable', { name: f.name }),
      )
      setFile(null)
      setPages(0)
    }
  }

  async function onSign() {
    if (!file || !currentImage || needsInitials) return
    setBusy(true)
    setError(null)
    setVerifyUrl(null)
    setCopyRecorded(false)
    setSavedAs(null)
    // Where the signature came from, as it is at this moment: your main
    // signature's id, or a checked Scan to sign attestation (sigStore DrawnMeta).
    const meta = useSigStore.getState().currentMeta()
    try {
      const buf = await file.arrayBuffer()

      // Opt-in verifiable record (free for any signed-in Universal ID): hash the
      // ORIGINAL bytes, store the metadata-only record, then stamp its QR on and
      // append the certificate page describing it.
      let qrPng: string | undefined
      let audit: SigningAuditFields | undefined
      let certId: string | null = null
      if (makeRecord && signedIn) {
        if (!user?.email) {
          setError(t('sign.error_no_email'))
          setBusy(false)
          return
        }
        const documentHash = await sha256Bytes(buf)
        const res = await recordSigningEvent(supabase, activeOrgId, user.id, {
          signerEmail: user.email,
          originalFilename: file.name,
          documentHash,
          // The server keeps it only if it is the signer's own (platform 0306).
          signatureId: meta?.signatureId ?? null,
        })
        if (!res.ok || !res.certId) {
          setError(res.error ?? t('sign.error_record'))
          setBusy(false)
          return
        }
        certId = res.certId
        const url = `${location.origin}${import.meta.env.BASE_URL}verify/${res.certId}`
        qrPng = await (await loadQr()).makeQrPng(url)
        setVerifyUrl(url)

        // Everything on the certificate page is either already in the record
        // the user just consented to, or their own device's clock/zone — which
        // the page prints under a heading saying it is self-reported. No
        // geolocation: that needs its own prompt and its own opt-in.
        audit = {
          signerEmail: user.email,
          originalFilename: file.name,
          documentHash,
          recordedAt: res.recordedAt,
          certId: res.certId,
          verifyUrl: url,
          localSignedAt: new Date().toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          productName: 'Universal Signatures',
        }
      }

      // Signed on a phone through the UNI·SIM Hub app by a confirmed Universal
      // ID: the certificate page says so, with a QR to check it. The printer
      // re-checks it against the image in use; anything off and the page is
      // as before.
      let phoneAttest: { attestation: PhoneAttestation; signature: string | null; qrPng?: string } | undefined
      if (audit && meta?.attest) {
        let attestQr: string | undefined
        try { attestQr = await (await loadQr()).makeQrPng(meta.attest.checkUrl) } catch { attestQr = undefined }
        phoneAttest = { attestation: meta.attest, signature: baseImage, qrPng: attestQr }
      }

      const { signPdf } = await loadPdf()
      const sigPng = stampImage ?? await trimToInk(currentImage)
      const bytes = await signPdf(buf, sigPng, {
        pageIndex, sigPage, anchor: 'bottom-right', widthPct, pos: pos ?? undefined, qrPng, audit, phoneAttest,
        initials: initialling && initials.png
          ? { png: initials.png, anchor: initials.anchor, widthPct: initials.widthPct, includeLast: initials.includeLast }
          : undefined,
      })
      // The signed copy's own fingerprint, so whoever receives it can check it
      // is byte for byte what was produced (the record's document hash is of
      // the unsigned original). Taken from the exact bytes about to download.
      if (certId) setCopyRecorded(await recordSignedCopyHash(supabase, certId, await sha256Bytes(bytes.slice().buffer as ArrayBuffer)))
      const name = file.name.replace(/\.pdf$/i, '') + '-signed.pdf'
      // Embedded: back to the app that asked, not to Downloads.
      if (EMBEDDED && sendSigned(name, bytes, verifyUrlFor(certId))) {
        setSavedAs(name)
        return
      }
      const blob = new Blob([bytes as BlobPart], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = name
      document.body.appendChild(a); a.click(); a.remove()
      // Revoked on the next tick: some browsers start the download after
      // click() returns, and a URL revoked synchronously can cancel it.
      window.setTimeout(() => URL.revokeObjectURL(url), 1000)
      setSavedAs(name)
    } catch {
      setError(t('sign.error_sign'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-bold text-slate-900">{t('sign.title')}</h2>
        <div ref={switchRef} className="u-tabs inline-flex" role="group" aria-label={t('sign.mode_group_label')}>
          {([['self', t('sign.mode_self')], ['send', t('sign.mode_send')]] as const).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setMode(id)}
              aria-pressed={mode === id}
              className="u-tab"
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <p className="mt-1 text-xs text-slate-500">
        {mode === 'self'
          ? t('sign.intro_self')
          : t('sign.intro_send')}
      </p>

      {/* Until there is a PDF: the suite's shared drop circle (`DropRing` + `useFileDrop` from
          @unisim/sdk), not a dashed rectangle of this app's own: Universal PDF,
          Images, Compress and Video all take a document through this same ring,
          and someone arriving from one of them shouldn't have to learn a second
          front door.

          Two things to know before editing the middle of it:
           • The centre has `pointer-events: none` so nothing there can swallow a
             drop — which means a button in there would be dead to the mouse. The
             whole circle is the control ("or click to browse" is words, not a
             link), and the accessible name lives on the ring.
           • The interior is painted `#ffffff` by the SDK, so the text inside is
             fixed dark and carries no `dark:` variant.
          Once a PDF is in, the circle goes and the page itself shows (James,
          2026-11-03); another PDF is still taken by a drop anywhere on the
          page, or "Change PDF". */}
      {file ? (
        <div className="mt-4 flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50/60 px-3 py-2">
          <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-slate-400" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
            <path d="M14 3v5h5" />
          </svg>
          <span className="min-w-0 truncate text-xs font-semibold text-slate-900" title={file.name}>{file.name}</span>
          <span className="shrink-0 text-[11px] tabular-nums text-slate-500">{t.plural('sign.drop_pages', pages)}</span>
          <button
            type="button"
            onClick={drop.open}
            disabled={!accepting}
            className={`${btnSoftSm} ml-auto shrink-0`}
          >
            {t('sign.change_pdf')}
          </button>
        </div>
      ) : (
      <div className={`mt-4 flex flex-col items-center ${signatureFirst ? 'cursor-not-allowed opacity-50 grayscale' : ''}`}>
        <div
          {...drop.dropzoneProps}
          aria-disabled={signatureFirst || undefined}
          className={`w-full max-w-[260px] rounded-full ${signatureFirst ? 'pointer-events-none' : 'cursor-pointer'} transition-transform focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-600 ${
            over ? 'scale-[1.02]' : ''
          }`}
        >
          <DropRing size="100%" over={over} motion={signatureFirst ? 'still' : 'idle'} watermark={<DropWatermark />}>
                <svg
                  viewBox="0 0 24 24"
                  className={`mb-1 h-9 w-9 ${over ? 'text-orange-500' : 'text-slate-400'}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  {/* A page with its corner turned — the thing you drop, not an
                      upload tray. Nothing is uploaded. */}
                  <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
                  <path d="M14 3v5h5" />
                  <path d="M9 13h6" />
                  <path d="M9 17h4" />
                </svg>
                <span className="text-[15px] font-bold text-slate-900">
                  {over ? t('sign.drop_over') : t('sign.drop_here')}
                </span>
                <span className="text-[11.5px] leading-relaxed text-slate-500">
                  {mode === 'self' ? t('sign.drop_stays_local') : t('sign.drop_uploaded_on_send')}
                </span>
                {!signatureFirst && <span className="mt-1 text-[11px] text-slate-400">{touch ? t('sign.drop_browse_tap') : t('sign.drop_browse')}</span>}
          </DropRing>
        </div>
      </div>
      )}
      {/* Outside the greyed-out circle so it reads at full strength; red once
          a PDF has been dropped on it anyway. */}
      {!file && signatureFirst && (
        <p role={turnedAway ? 'alert' : undefined} className={`mt-3 text-center text-sm font-medium ${turnedAway ? 'text-rose-700' : 'text-slate-600'}`}>
          {t('sign.signature_first')}
        </p>
      )}
      {/* Outside the ring, so the picker is never the thing a drop lands on. */}
      <input {...drop.inputProps} className="hidden" />

      {/* The drop circle's own errors (not a PDF, password-protected) belong
          to both modes; the rest of this card's are the sign-it-myself ones. */}
      {mode === 'send' && error && <p role="alert" className="mt-3 text-sm text-rose-700">{error}</p>}
      {mode === 'send' && <SendForSigning file={file} pages={pages} />}

      {mode === 'self' && (<>
      {file && pages > 1 && (
        <div className="mt-4">
          <label htmlFor="sig-layout" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">{t('sign.layout_label')}</label>
          <select
            id="sig-layout"
            value={layout}
            onChange={(e) => setLayout(e.target.value as Layout)}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none"
          >
            {LAYOUTS.map((l) => <option key={l.id} value={l.id}>{t(l.label)}</option>)}
          </select>
        </div>
      )}

      {/* The initials' box above the pages, not under them (James,
          2026-11-03): type "JM" and it is on the pages straight away. Where
          they go and how big stays under the pages (InitialsPlacement). */}
      {file && initialling && <InitialsPanel value={initials} onChange={setInitials} />}

      {/* The whole document, to swipe through and sign where it goes (James,
          2026-11-03): no page list, no size slider — tap a page to put the
          signature there, then drag it, pull its corner to size it. */}
      {file && (
        <div className="mt-4">
          <Suspense fallback={<div className="h-80 w-full animate-pulse rounded-lg bg-slate-100" />}>
            <PageStrip
              file={file}
              layout={shownLayout}
              sigPng={currentImage ? stampImage ?? currentImage : null}
              sigPage={sigPage}
              pos={pos}
              widthPct={widthPct}
              initials={previewInitials}
              includeSigned={initials.includeLast}
              onPlace={(page, p) => { setChosenPage(page); setPos(p) }}
              onResize={setWidthPct}
            />
          </Suspense>
          <p className="mt-1 text-center text-[11px] text-slate-400">
            {currentImage ? t('sign.viewer_hint') : t('sign.position_needs_signature')}
          </p>
        </div>
      )}

      {file && initialling && <InitialsPlacement value={initials} onChange={setInitials} everyPage={shownLayout === 'initial-every'} />}

      {file && hasExtras && (
        <label className="mt-4 flex cursor-pointer items-start gap-2.5 rounded-lg border border-slate-200 bg-slate-50/60 p-3">
          <input
            type="checkbox"
            checked={omitExtras}
            onChange={(e) => setOmitExtras(e.target.checked)}
            className="mt-0.5 h-4 w-4 accent-orange-600"
          />
          <span className="text-xs text-slate-600">
            {t.rich('sign.omit_extras', { bold: <span className="font-semibold text-slate-800">{t('sign.omit_extras_bold')}</span> })}
          </span>
        </label>
      )}

      {file && (
        <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50/60 p-3">
          <label className={`flex items-start gap-2.5 ${signedIn ? 'cursor-pointer' : 'cursor-not-allowed opacity-70'}`}>
            <input
              type="checkbox"
              checked={makeRecord && signedIn}
              disabled={!signedIn}
              onChange={(e) => setMakeRecord(e.target.checked)}
              className="mt-0.5 h-4 w-4 accent-orange-600"
            />
            <span className="text-xs text-slate-600">
              {t.rich('sign.certificate', { bold: <span className="font-semibold text-slate-800">{t('sign.certificate_bold')}</span> })}
            </span>
          </label>
          {!signedIn && (
            <>
              <p className="mt-2 pl-6 text-[11px] text-slate-500">
                {t.rich('sign.certificate_sign_in', { link: <button type="button" onClick={() => setSignInOpen(true)} className="font-medium text-orange-700 hover:underline">{t('sign.certificate_sign_in_link')}</button> })}
              </p>
              <SignInDialog open={signInOpen} onClose={() => setSignInOpen(false)} hubLoginHref={SIGNUP_URL} />
            </>
          )}
        </div>
      )}

      {error && <p role="alert" className="mt-3 text-sm text-rose-700">{error}</p>}

      <button
        onClick={onSign}
        disabled={!file || !currentImage || needsInitials || busy}
        className={`${btnPrimary} mt-4 w-full justify-start`}
      >
        <Key><PenIcon /></Key>
        {busy ? t('sign.signing') : !currentImage ? t('sign.button_needs_signature') : needsInitials ? t('sign.button_needs_initials') : t(EMBEDDED ? 'sign.button_sign_embedded' : 'sign.button_sign')}
      </button>

      {/* Always in the tree (not empty:hidden) so screen readers announce it. */}
      <div role="status" className="text-center text-xs text-emerald-700">
        {savedAs && !busy && <p className="mt-2">{t('sign.signed_as', { name: savedAs })}</p>}
      </div>

      {verifyUrl && (
        <div className="mt-3 rounded-lg bg-emerald-50 p-3">
          <p className="text-xs font-semibold text-emerald-800">{t('sign.record_created')}</p>
          <p className="mt-1 text-[11px] text-emerald-700">{t('sign.record_qr_links_here')}</p>
          <div className="mt-2 flex items-center gap-2">
            <input readOnly value={verifyUrl} className="flex-1 rounded-md border border-emerald-200 bg-white px-2 py-1.5 text-[11px] text-slate-700" />
            <button
              onClick={() => navigator.clipboard?.writeText(verifyUrl)}
              className={`${btnSecondarySm} shrink-0`}
            >
              {t('sign.record_copy')}
            </button>
          </div>
          {copyRecorded && (
            <p className="mt-2 text-[11px] text-emerald-700">
              {t('sign.record_copy_hash')}
            </p>
          )}
        </div>
      )}

      </>)}

      {/* From `pageOver`, not `over`: over the ring itself the ring answers. */}
      <DropAnywhere
        show={drop.pageOver && accepting && !signatureFirst}
        title={t('sign.drop_anywhere_title')}
        hint={t('sign.drop_anywhere_hint')}
      />
    </div>
  )
}
