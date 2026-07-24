import { useState } from 'react'
import { useUniversal, useUser } from '@unisim/sdk'
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

  async function onFile(f: File) {
    setError(null)
    setVerifyUrl(null)
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
      // ORIGINAL bytes, store the metadata-only record, then stamp its QR on.
      let qrPng: string | undefined
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
      }

      const bytes = await signPdf(buf, currentImage, { pageIndex, anchor, widthPct, pos: pos ?? undefined, qrPng })
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

      <label className="mt-3 flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-300 px-4 py-5 text-sm text-slate-600 hover:border-orange-400 hover:bg-orange-50/40">
        <span aria-hidden="true">📄</span>
        {file ? `${file.name} · ${pages} page${pages === 1 ? '' : 's'}` : 'Choose a PDF…'}
        <input type="file" accept="application/pdf" className="hidden" onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
      </label>

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
              <span className="font-semibold text-slate-800">Add a verification QR code</span> — stamps a QR on the PDF and saves a
              free, verifiable record (your email, the file name, a document hash and the time). The document itself is never uploaded.
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
    </div>
  )
}
