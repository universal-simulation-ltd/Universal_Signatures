import { useState } from 'react'
import { useSigStore } from '../../stores/sigStore'
import { signPdf, pageCount, type Anchor } from '../../lib/pdf'

const ANCHORS: Anchor[] = [
  'top-left', 'top-center', 'top-right',
  'mid-left', 'mid-center', 'mid-right',
  'bottom-left', 'bottom-center', 'bottom-right',
]

export default function ApplyToPdf() {
  const currentImage = useSigStore((s) => s.currentImage())
  const [file, setFile] = useState<File | null>(null)
  const [pages, setPages] = useState(0)
  const [pageIndex, setPageIndex] = useState(0)
  const [anchor, setAnchor] = useState<Anchor>('bottom-right')
  const [widthPct, setWidthPct] = useState(25)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onFile(f: File) {
    setError(null)
    setFile(f)
    try {
      const n = await pageCount(await f.arrayBuffer())
      setPages(n)
      setPageIndex(0)
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
    try {
      const bytes = await signPdf(await file.arrayBuffer(), currentImage, { pageIndex, anchor, widthPct })
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
            <div className="grid grid-cols-3 gap-1.5">
              {ANCHORS.map((a) => (
                <button
                  key={a}
                  onClick={() => setAnchor(a)}
                  aria-label={a}
                  className={`h-9 rounded-md ring-1 transition ${anchor === a ? 'bg-orange-600 ring-orange-600' : 'bg-white ring-slate-200 hover:bg-slate-50'}`}
                >
                  <span className={`mx-auto block h-2 w-2 rounded-full ${anchor === a ? 'bg-white' : 'bg-slate-300'}`} />
                </button>
              ))}
            </div>
          </div>
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
    </div>
  )
}
