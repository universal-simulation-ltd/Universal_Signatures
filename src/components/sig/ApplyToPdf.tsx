import { useState } from 'react'
import { DropAnywhere, DropRing, useFileDrop, useUniversal, useUser, type SigningAuditFields } from '@unisim/sdk'
import { useSigStore } from '../../stores/sigStore'
import { signPdf, pageCount, type Anchor, type PlacePoint } from '../../lib/pdf'
import { sha256Bytes } from '../../lib/signature'
import { makeQrPng } from '../../lib/qr'
import { recordSigningEvent } from '../../lib/cloud'
import PositionPicker from './PositionPicker'

const ANCHORS: Anchor[] = [
  'top-left', 'top-center', 'top-right',
  'mid-left', 'mid-center', 'mid-right',
  'bottom-left', 'bottom-center', 'bottom-right',
]

const SIGNUP_URL = 'https://app.unisim.co.uk/login'

export default function ApplyToPdf() {
  const composedImage = useSigStore((s) => s.currentImage())
  const baseImage = useSigStore((s) => s.baseImage())
  const hasExtras = useSigStore((s) => s.hasExtras())
  const [applyExtras, setApplyExtras] = useState(true)
  // What actually gets stamped: with name/date when the user keeps them applied
  // for this document, otherwise the raw signature.
  const currentImage = hasExtras && applyExtras ? composedImage : baseImage
  const { supabase, session, activeOrgId } = useUniversal()
  const { user } = useUser()
  const signedIn = !!session?.user && session.user.is_anonymous !== true

  const [file, setFile] = useState<File | null>(null)
  const [pages, setPages] = useState(0)
  const [pageIndex, setPageIndex] = useState(0)
  const [anchor, setAnchor] = useState<Anchor>('bottom-right')
  const [pos, setPos] = useState<PlacePoint | null>(null)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [widthPct, setWidthPct] = useState(25)
  const [makeRecord, setMakeRecord] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [verifyUrl, setVerifyUrl] = useState<string | null>(null)

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
    label: file ? 'Drop another PDF here, or click to choose one' : 'Drop a PDF here, or click to choose one',
  })
  // ⚠️ `over`/`pageOver` go true for a page drag whether or not this zone is
  // disabled — the hook lights every page-wide zone and only checks `disabled`
  // when deciding who TAKES the file. Highlighting a target that will not take
  // anything is a lie, so gate the visuals here too.
  const over = drop.over && accepting

  async function onFile(f: File) {
    setError(null)
    setVerifyUrl(null)
    // A page-wide target takes whatever is dropped on the margin, including the
    // font file the "Type" panel wants. Say which thing was wrong rather than
    // letting it fail later as an unreadable PDF.
    if (f.type !== 'application/pdf' && !/\.pdf$/i.test(f.name)) {
      setError(`${f.name} isn't a PDF.`)
      return
    }
    setFile(f)
    try {
      const n = await pageCount(await f.arrayBuffer())
      setPages(n)
      setPageIndex(0)
      setPos(null)
    } catch {
      setError('Could not read that PDF.')
      setFile(null)
      setPages(0)
    }
  }

  async function onSign() {
    if (!file || !currentImage) return
    setBusy(true)
    setError(null)
    setVerifyUrl(null)
    try {
      const buf = await file.arrayBuffer()

      // Opt-in verifiable record (free for any signed-in Universal ID): hash the
      // ORIGINAL bytes, store the metadata-only record, then stamp its QR on and
      // append the certificate page describing it.
      let qrPng: string | undefined
      let audit: SigningAuditFields | undefined
      if (makeRecord && signedIn) {
        if (!user?.email) {
          setError('Your Universal ID has no email on file, so a verifiable record can\'t be created.')
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
          setError(res.error ?? 'Could not create the verifiable record.')
          setBusy(false)
          return
        }
        const url = `${location.origin}${import.meta.env.BASE_URL}verify/${res.certId}`
        qrPng = await makeQrPng(url)
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

      const bytes = await signPdf(buf, currentImage, { pageIndex, anchor, widthPct, pos: pos ?? undefined, qrPng, audit })
      const blob = new Blob([bytes as BlobPart], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = file.name.replace(/\.pdf$/i, '') + '-signed.pdf'
      document.body.appendChild(a); a.click(); a.remove()
      URL.revokeObjectURL(url)
    } catch {
      setError('Could not sign the PDF.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <h2 className="text-sm font-bold text-slate-900">Sign a PDF</h2>
      <p className="mt-1 text-xs text-slate-500">Add your signature to a document — it's processed in your browser and never uploaded.</p>

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
          <DropRing size="100%" over={over} motion={busy ? 'busy' : file ? 'still' : 'idle'}>
            {file ? (
              <>
                <span className="w-full truncate text-[13px] font-bold text-slate-900" title={file.name}>
                  {file.name}
                </span>
                <span className="text-[11.5px] tabular-nums text-slate-500">
                  {pages} page{pages === 1 ? '' : 's'}
                </span>
                <span className="mt-1 text-[11px] text-slate-400">
                  {busy ? 'Signing…' : 'drop another, or click to change'}
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
                  {over ? 'Drop to open' : 'Drop a PDF here'}
                </span>
                <span className="text-[11.5px] leading-relaxed text-slate-500">it stays on your device</span>
                <span className="mt-1 text-[11px] text-slate-400">or click to browse</span>
              </>
            )}
          </DropRing>
        </div>
        {/* Outside the ring, so the picker is never the thing a drop lands on. */}
        <input {...drop.inputProps} className="hidden" />
      </div>

      {file && (
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <div className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">Page</div>
            <select
              value={pageIndex}
              onChange={(e) => setPageIndex(Number(e.target.value))}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm bg-white outline-none"
            >
              {Array.from({ length: pages }).map((_, i) => (
                <option key={i} value={i}>Page {i + 1}{i === pages - 1 ? ' (last)' : ''}</option>
              ))}
            </select>
            <div className="mt-3 mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">Size ({widthPct}%)</div>
            <input type="range" min={8} max={50} value={widthPct} onChange={(e) => setWidthPct(Number(e.target.value))} className="w-full accent-orange-600" />
          </div>
          <div>
            <div className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">Position</div>
            <div className={`grid grid-cols-3 gap-1.5 transition ${pos ? 'opacity-40' : ''}`}>
              {ANCHORS.map((a) => (
                <button
                  key={a}
                  onClick={() => { setPos(null); setAnchor(a) }}
                  aria-label={a}
                  className={`h-9 rounded-md ring-1 transition ${!pos && anchor === a ? 'bg-orange-600 ring-orange-600' : 'bg-white ring-slate-200 hover:bg-slate-50'}`}
                >
                  <span className={`mx-auto block h-2 w-2 rounded-full ${!pos && anchor === a ? 'bg-white' : 'bg-slate-300'}`} />
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
              {pos ? 'Custom position' : 'Choose position…'}
            </button>
            {pos && (
              <div className="mt-1.5 flex items-center justify-between text-[11px] text-emerald-700">
                <span>✓ Custom position set</span>
                <button type="button" onClick={() => setPos(null)} className="font-medium text-slate-500 hover:text-rose-600">Use grid</button>
              </div>
            )}
            {!currentImage && (
              <p className="mt-1 text-[11px] text-slate-400">Create a signature to preview placement.</p>
            )}
          </div>
        </div>
      )}

      {pickerOpen && file && currentImage && (
        <PositionPicker
          file={file}
          pageIndex={pageIndex}
          sigPng={currentImage}
          widthPct={widthPct}
          onWidthChange={setWidthPct}
          initialPos={pos}
          onConfirm={(p) => { setPos(p); setPickerOpen(false) }}
          onClose={() => setPickerOpen(false)}
        />
      )}

      {file && hasExtras && (
        <label className="mt-4 flex cursor-pointer items-start gap-2.5 rounded-lg border border-slate-200 bg-slate-50/60 p-3">
          <input
            type="checkbox"
            checked={applyExtras}
            onChange={(e) => setApplyExtras(e.target.checked)}
            className="mt-0.5 h-4 w-4 accent-orange-600"
          />
          <span className="text-xs text-slate-600">
            <span className="font-semibold text-slate-800">Add name, date &amp; time</span> — stamp the name/date/time you added in
            "Create your signature" beneath the signature on this document.
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
              <span className="font-semibold text-slate-800">Add a signing certificate</span> — appends a certificate page and a
              QR to the PDF, and saves a free, verifiable record (your email, the file name, a document hash and the time). The page also
              shows your device's clock and timezone, marked as self-reported. The document itself is never uploaded.
            </span>
          </label>
          {!signedIn && (
            <p className="mt-2 pl-6 text-[11px] text-slate-500">
              <a href={SIGNUP_URL} className="font-medium text-orange-600 hover:underline">Sign in with a free Universal ID</a> to enable verifiable records.
            </p>
          )}
        </div>
      )}

      {error && <p className="mt-3 text-sm text-rose-600">{error}</p>}

      <button
        onClick={onSign}
        disabled={!file || !currentImage || busy}
        className="mt-4 w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-black disabled:opacity-50"
      >
        {busy ? 'Signing…' : !currentImage ? 'Create a signature first' : 'Sign & download PDF'}
      </button>

      {verifyUrl && (
        <div className="mt-3 rounded-lg bg-emerald-50 p-3">
          <p className="text-xs font-semibold text-emerald-800">✓ Verifiable record created</p>
          <p className="mt-1 text-[11px] text-emerald-700">The signed PDF carries a QR linking here:</p>
          <div className="mt-2 flex items-center gap-2">
            <input readOnly value={verifyUrl} className="flex-1 rounded-md border border-emerald-200 bg-white px-2 py-1.5 text-[11px] text-slate-700" />
            <button
              onClick={() => navigator.clipboard?.writeText(verifyUrl)}
              className="shrink-0 rounded-md bg-emerald-600 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-emerald-700"
            >
              Copy
            </button>
          </div>
        </div>
      )}

      {/* From `pageOver`, not `over`: over the ring itself the ring answers. */}
      <DropAnywhere
        show={drop.pageOver && accepting}
        title="Drop it anywhere"
        hint="A PDF — it's signed in this browser and never uploaded"
      />
    </div>
  )
}
