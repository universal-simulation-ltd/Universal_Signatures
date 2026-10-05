import { lazy, Suspense, useEffect, useState } from 'react'
import { DropAnywhere, DropRing, useFileDrop, useUniversal, useUser, type SigningAuditFields } from '@unisim/sdk'
import { useSigStore } from '../../stores/sigStore'
import type { Anchor, PlacePoint } from '../../lib/pdf'
import { sha256Bytes, trimToInk } from '../../lib/signature'
import { ALL_PAGES, INITIAL_PAGES } from '../../lib/types'
import { recordSignedCopyHash, recordSigningEvent } from '../../lib/cloud'
import { useT, type MessageKey } from '../../i18n'
import DropWatermark from './DropWatermark'
import { useCoarsePointer } from '../../lib/useCoarsePointer'
import InitialsPanel, { type InitialsChoice } from './InitialsPanel'
import SendForSigning from './SendForSigning'

// pdf-lib (~500 kB), pdf.js (+ its 1.3 MB worker) and the QR encoder are only
// needed once a PDF is in play, so they load on demand rather than in the
// first-load bundle. The picker pulls pdf.js in with it, and pdf.js spins up
// its worker the moment its module runs — before this split, every visit to
// the studio started that worker whether or not a PDF was ever opened.
const PositionPicker = lazy(() => import('./PositionPicker'))
const loadPdf = () => import('../../lib/pdf')
const loadQr = () => import('../../lib/qr')

const ANCHORS: { id: Anchor; label: MessageKey }[] = [
  { id: 'top-left', label: 'sign.anchor_top_left' }, { id: 'top-center', label: 'sign.anchor_top_center' }, { id: 'top-right', label: 'sign.anchor_top_right' },
  { id: 'mid-left', label: 'sign.anchor_mid_left' }, { id: 'mid-center', label: 'sign.anchor_mid_center' }, { id: 'mid-right', label: 'sign.anchor_mid_right' },
  { id: 'bottom-left', label: 'sign.anchor_bottom_left' }, { id: 'bottom-center', label: 'sign.anchor_bottom_center' }, { id: 'bottom-right', label: 'sign.anchor_bottom_right' },
]

const SIGNUP_URL = 'https://app.unisim.co.uk/login'

export default function ApplyToPdf() {
  const t = useT()
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

  // Sign it yourself, or send it to someone else to sign.
  const [mode, setMode] = useState<'self' | 'send'>('self')
  const [file, setFile] = useState<File | null>(null)
  const [pages, setPages] = useState(0)
  const [pageIndex, setPageIndex] = useState(0)
  const [anchor, setAnchor] = useState<Anchor>('bottom-right')
  const [pos, setPos] = useState<PlacePoint | null>(null)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [widthPct, setWidthPct] = useState(25)
  // For "initials on every page, signature on the last".
  const [initials, setInitials] = useState<InitialsChoice>({ png: null, anchor: 'bottom-right', widthPct: 10, includeLast: false })
  const initialling = pageIndex === INITIAL_PAGES
  const needsInitials = initialling && !initials.png
  const [makeRecord, setMakeRecord] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [verifyUrl, setVerifyUrl] = useState<string | null>(null)
  // Whether the signed copy's own fingerprint made it onto the record.
  const [copyRecorded, setCopyRecorded] = useState(false)
  // The file name of the last download, for the "Signed" confirmation.
  const [savedAs, setSavedAs] = useState<string | null>(null)

  // Not while the position picker is up (it would swap the document behind a
  // modal still showing the old one), and not mid-signing.
  const accepting = !pickerOpen && !busy

  // `pageWide`: the circle is where to aim, not where you have to land. It also
  // closes a real trap in this app specifically — a PDF let go just outside the
  // ring used to be handed to the browser, which navigates away from the tab and
  // takes the signature drawn in the left-hand column with it, unsaved.
  const drop = useFileDrop({
    onFiles: (files) => { if (files[0]) void onFile(files[0]) },
    accept: 'application/pdf',
    multiple: false,
    pageWide: true,
    disabled: !accepting,
    label: file ? t('sign.drop_label_another') : t('sign.drop_label'),
  })
  // ⚠️ `over`/`pageOver` go true for a page drag whether or not this zone is
  // disabled — the hook lights every page-wide zone and only checks `disabled`
  // when deciding who TAKES the file. Highlighting a target that will not take
  // anything is a lie, so gate the visuals here too.
  const over = drop.over && accepting

  async function onFile(f: File) {
    setError(null)
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
      setPageIndex(0)
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

      const { signPdf } = await loadPdf()
      const sigPng = stampImage ?? await trimToInk(currentImage)
      const bytes = await signPdf(buf, sigPng, {
        pageIndex, anchor, widthPct, pos: pos ?? undefined, qrPng, audit,
        initials: initialling && initials.png
          ? { png: initials.png, anchor: initials.anchor, widthPct: initials.widthPct, includeLast: initials.includeLast }
          : undefined,
      })
      // The signed copy's own fingerprint, so whoever receives it can check it
      // is byte for byte what was produced (the record's document hash is of
      // the unsigned original). Taken from the exact bytes about to download.
      if (certId) setCopyRecorded(await recordSignedCopyHash(supabase, certId, await sha256Bytes(bytes.slice().buffer as ArrayBuffer)))
      const blob = new Blob([bytes as BlobPart], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      const name = file.name.replace(/\.pdf$/i, '') + '-signed.pdf'
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
        <div className="inline-flex rounded-md bg-slate-100 p-0.5" role="group" aria-label={t('sign.mode_group_label')}>
          {([['self', t('sign.mode_self')], ['send', t('sign.mode_send')]] as const).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setMode(id)}
              aria-pressed={mode === id}
              className={`rounded px-3 py-1 text-xs font-semibold ${mode === id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
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

      {/* The suite's shared drop circle (`DropRing` + `useFileDrop` from
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
             fixed dark and carries no `dark:` variant. */}
      <div className="mt-4 flex flex-col items-center">
        <div
          {...drop.dropzoneProps}
          className={`w-full max-w-[260px] cursor-pointer rounded-full transition-transform focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-600 ${
            over ? 'scale-[1.02]' : ''
          }`}
        >
          {/* `still` once a document is loaded: neither the idle twinkle ("alive
              and waiting") nor the busy chase ("working") is true then. */}
          <DropRing size="100%" over={over} motion={busy ? 'busy' : file ? 'still' : 'idle'} watermark={file ? false : <DropWatermark />}>
            {file ? (
              <>
                <span className="w-full truncate text-[13px] font-bold text-slate-900" title={file.name}>
                  {file.name}
                </span>
                <span className="text-[11.5px] tabular-nums text-slate-500">
                  {t.plural('sign.drop_pages', pages)}
                </span>
                <span className="mt-1 text-[11px] text-slate-400">
                  {busy ? t('sign.signing') : t('sign.drop_change')}
                </span>
              </>
            ) : (
              <>
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
                <span className="mt-1 text-[11px] text-slate-400">{touch ? t('sign.drop_browse_tap') : t('sign.drop_browse')}</span>
              </>
            )}
          </DropRing>
        </div>
        {/* Outside the ring, so the picker is never the thing a drop lands on. */}
        <input {...drop.inputProps} className="hidden" />
      </div>

      {/* The drop circle's own errors (not a PDF, password-protected) belong
          to both modes; the rest of this card's are the sign-it-myself ones. */}
      {mode === 'send' && error && <p role="alert" className="mt-3 text-sm text-rose-700">{error}</p>}
      {mode === 'send' && <SendForSigning file={file} pages={pages} />}

      {mode === 'self' && (<>
      {file && (
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="sig-page" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">{t('sign.page_label')}</label>
            <select
              id="sig-page"
              value={pageIndex}
              onChange={(e) => setPageIndex(Number(e.target.value))}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm bg-white outline-none"
            >
              {Array.from({ length: pages }).map((_, i) => (
                <option key={i} value={i}>{t(i === pages - 1 && pages > 1 ? 'sign.page_option_last' : 'sign.page_option', { n: i + 1 })}</option>
              ))}
              {pages > 1 && <option value={ALL_PAGES}>{t('sign.page_every', { count: pages })}</option>}
              {pages > 1 && <option value={INITIAL_PAGES}>{t('sign.page_initial_each')}</option>}
            </select>
            <label htmlFor="sig-size" className="mt-3 mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">{t('sign.size_label', { pct: widthPct })}</label>
            <input id="sig-size" type="range" min={8} max={50} value={widthPct} onChange={(e) => setWidthPct(Number(e.target.value))} className="w-full accent-orange-600" />
          </div>
          <div>
            <div className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
              {initialling ? t('sign.position_label_initials') : t('sign.position_label')}
            </div>
            <div role="group" aria-label={t('sign.position_group_label')} className={`grid grid-cols-3 gap-1.5 transition ${pos ? 'opacity-40' : ''}`}>
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
              disabled={!currentImage}
              className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:border-orange-400 hover:bg-orange-50/40 disabled:opacity-50"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 21s-7-5.2-7-11a7 7 0 0 1 14 0c0 5.8-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" />
              </svg>
              {pos ? t('sign.position_custom') : t('sign.position_choose')}
            </button>
            {pos && (
              <div className="mt-1.5 flex items-center justify-between text-[11px] text-emerald-700">
                <span>{t('sign.position_custom_set')}</span>
                <button type="button" onClick={() => setPos(null)} className="font-medium text-slate-500 hover:text-rose-600">{t('sign.position_use_grid')}</button>
              </div>
            )}
            {!currentImage && (
              <p className="mt-1 text-[11px] text-slate-400">{t('sign.position_needs_signature')}</p>
            )}
          </div>
        </div>
      )}

      {file && initialling && <InitialsPanel value={initials} onChange={setInitials} />}

      {pickerOpen && file && currentImage && (
        <Suspense fallback={null}>
        <PositionPicker
          file={file}
          // Every page: preview the first. Initials mode: the signature goes on the last.
          pageIndex={pageIndex === ALL_PAGES ? 0 : pageIndex === INITIAL_PAGES ? -1 : pageIndex}
          sigPng={stampImage ?? currentImage}
          widthPct={widthPct}
          onWidthChange={setWidthPct}
          initialPos={pos}
          onConfirm={(p) => { setPos(p); setPickerOpen(false) }}
          onClose={() => setPickerOpen(false)}
        />
        </Suspense>
      )}

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
            <p className="mt-2 pl-6 text-[11px] text-slate-500">
              {t.rich('sign.certificate_sign_in', { link: <a href={SIGNUP_URL} className="font-medium text-orange-700 hover:underline">{t('sign.certificate_sign_in_link')}</a> })}
            </p>
          )}
        </div>
      )}

      {error && <p role="alert" className="mt-3 text-sm text-rose-700">{error}</p>}

      <button
        onClick={onSign}
        disabled={!file || !currentImage || needsInitials || busy}
        className="mt-4 w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-black disabled:opacity-50"
      >
        {busy ? t('sign.signing') : !currentImage ? t('sign.button_needs_signature') : needsInitials ? t('sign.button_needs_initials') : t('sign.button_sign')}
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
              className="shrink-0 rounded-md bg-emerald-600 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-emerald-700"
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
        show={drop.pageOver && accepting}
        title={t('sign.drop_anywhere_title')}
        hint={t('sign.drop_anywhere_hint')}
      />
    </div>
  )
}
