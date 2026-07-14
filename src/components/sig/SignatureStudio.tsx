import { useEffect } from 'react'
import { useSigStore } from '../../stores/sigStore'
import type { StudioMode } from '../../lib/types'
import { composeSignatureWithLabels, formatSigningDate } from '../../lib/signature'
import SignaturePad from './SignaturePad'
import TypeSignature from './TypeSignature'
import PhoneSignPanel from './PhoneSignPanel'
import ApplyToPdf from './ApplyToPdf'
import SaveTabs from './SaveTabs'

const MODES: { id: StudioMode; label: string }[] = [
  { id: 'draw', label: 'Draw' },
  { id: 'type', label: 'Type' },
  { id: 'phone', label: 'Sign on phone' },
]

export default function SignatureStudio() {
  const mode = useSigStore((s) => s.mode)
  const setMode = useSigStore((s) => s.setMode)

  // Name/date extras.
  const drawnDataUrl = useSigStore((s) => s.drawnDataUrl)
  const typedDataUrl = useSigStore((s) => s.typedDataUrl)
  const signerName = useSigStore((s) => s.signerName)
  const includeName = useSigStore((s) => s.includeName)
  const includeDate = useSigStore((s) => s.includeDate)
  const setSignerName = useSigStore((s) => s.setSignerName)
  const setIncludeName = useSigStore((s) => s.setIncludeName)
  const setIncludeDate = useSigStore((s) => s.setIncludeDate)
  const setComposed = useSigStore((s) => s.setComposed)

  const base = mode === 'type' ? typedDataUrl : drawnDataUrl

  // Recompose the base signature with the name/date labels whenever any input
  // changes, so currentImage() (used by save + sign) reflects the choice.
  useEffect(() => {
    let cancelled = false
    const labels: { text: string; scale: number }[] = []
    if (includeName && signerName.trim()) labels.push({ text: signerName.trim(), scale: 1 })
    if (includeDate) labels.push({ text: formatSigningDate(), scale: 0.8 })
    if (!base || labels.length === 0) { setComposed(null); return }
    composeSignatureWithLabels(base, labels).then((url) => { if (!cancelled) setComposed(url) })
    return () => { cancelled = true }
  }, [base, includeName, includeDate, signerName, setComposed])

  return (
    <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left column: create your signature, then save it */}
        <div className="space-y-6">
        <section className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">Create your signature</h2>
            <div className="inline-flex rounded-md bg-slate-100 p-0.5">
              {MODES.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className={`rounded px-3 py-1 text-xs font-semibold ${mode === m.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-4">
            {mode === 'type' ? <TypeSignature /> : mode === 'phone' ? <PhoneSignPanel /> : <SignaturePad />}
          </div>

          {/* Optional name / date stamped beneath the signature. */}
          <div className="mt-4 space-y-2 border-t border-slate-100 pt-3">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Add name &amp; date</div>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" checked={includeName} onChange={(e) => setIncludeName(e.target.checked)} className="h-4 w-4 accent-orange-600" />
              Add your name
            </label>
            {includeName && (
              <input
                value={signerName}
                onChange={(e) => setSignerName(e.target.value)}
                placeholder="Your name"
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none"
              />
            )}
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" checked={includeDate} onChange={(e) => setIncludeDate(e.target.checked)} className="h-4 w-4 accent-orange-600" />
              Add today's date <span className="text-slate-400">({formatSigningDate()})</span>
            </label>
            {(includeName || includeDate) && (
              <p className="text-[11px] text-slate-400">
                Appears beneath your signature. When signing a PDF you can choose whether to include it.
              </p>
            )}
          </div>

          <p className="mt-3 text-xs text-slate-500">
            Everything here runs in your browser. Use your signature to sign a PDF on the right — for free, no account
            needed.
          </p>
        </section>

          <SaveTabs />
        </div>

        {/* Right column: sign a PDF */}
        <div className="space-y-6">
          <ApplyToPdf />
        </div>
      </div>
    </div>
  )
}
