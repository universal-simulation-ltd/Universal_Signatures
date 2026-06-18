import { useEffect, useState } from 'react'
import { useSigStore } from '../../stores/sigStore'
import {
  loadLocalSignatures,
  saveLocalSignature,
  removeLocalSignature,
  type LocalSignature,
} from '../../lib/localSignatures'
import { fontById } from '../../lib/fonts'

// Free, no-account "Save on this device" — the local-first counterpart to the
// cloud save. Guests can keep a few signatures in this browser and reuse them
// without a Universal ID. Sits above the cloud panel so the free option leads.
export default function LocalSavePanel() {
  const mode = useSigStore((s) => s.mode)
  const fontId = useSigStore((s) => s.fontId)
  const signerName = useSigStore((s) => s.signerName)
  const currentImage = useSigStore((s) => s.currentImage())
  const setMode = useSigStore((s) => s.setMode)
  const setDrawn = useSigStore((s) => s.setDrawn)
  const setTyped = useSigStore((s) => s.setTyped)
  const setFontId = useSigStore((s) => s.setFontId)
  const setSignerName = useSigStore((s) => s.setSignerName)

  const [saved, setSaved] = useState<LocalSignature[]>([])
  const [justSaved, setJustSaved] = useState(false)

  useEffect(() => {
    setSaved(loadLocalSignatures())
  }, [])

  function onSave() {
    if (!currentImage) return
    setSaved(
      saveLocalSignature({
        signerName,
        style: mode,
        font: mode === 'type' ? fontById(fontId).id : null,
        imageDataUrl: currentImage,
      }),
    )
    setJustSaved(true)
    window.setTimeout(() => setJustSaved(false), 1800)
  }

  function onUse(sig: LocalSignature) {
    setSignerName(sig.signerName ?? '')
    if (sig.style === 'type') {
      setFontId(sig.font ?? fontId)
      setMode('type')
      setTyped(sig.imageDataUrl)
    } else {
      setMode('draw')
      setDrawn(sig.imageDataUrl)
    }
  }

  function onRemove(id: string) {
    setSaved(removeLocalSignature(id))
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-center gap-2">
        <h2 className="text-sm font-bold text-slate-900">Save on this device</h2>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-600">No account</span>
      </div>
      <p className="mt-1 text-xs text-slate-500">
        Keep your signature in this browser and reuse it later — free, no sign-in. It stays on this device and never leaves it.
      </p>

      <div className="mt-4">
        <button
          onClick={onSave}
          disabled={!currentImage}
          className="w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-black disabled:opacity-50"
        >
          {justSaved ? '✓ Saved to this device' : !currentImage ? 'Create a signature first' : 'Save to this device'}
        </button>
      </div>

      {saved.length > 0 && (
        <ul className="mt-4 space-y-2">
          {saved.map((sig) => (
            <li
              key={sig.id}
              className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-2"
            >
              <span className="flex h-12 w-24 shrink-0 items-center justify-center overflow-hidden rounded bg-white ring-1 ring-slate-200">
                <img src={sig.imageDataUrl} alt="Saved signature" className="max-h-11 max-w-[5.5rem] object-contain" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-xs font-medium text-slate-700">
                  {sig.signerName || (sig.style === 'type' ? 'Typed signature' : 'Drawn signature')}
                </span>
                <span className="text-[10px] uppercase tracking-wide text-slate-400">{sig.style}</span>
              </span>
              <button
                onClick={() => onUse(sig)}
                className="shrink-0 rounded-md bg-orange-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-orange-700"
              >
                Use
              </button>
              <button
                onClick={() => onRemove(sig.id)}
                aria-label="Remove saved signature"
                className="shrink-0 rounded-md px-2 py-1.5 text-xs font-medium text-slate-400 hover:text-rose-600"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
