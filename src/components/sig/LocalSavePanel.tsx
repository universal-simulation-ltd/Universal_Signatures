import { useEffect, useRef, useState } from 'react'
import { useSigStore } from '../../stores/sigStore'
import {
  loadLocalSignatures,
  saveLocalSignature,
  removeLocalSignature,
  renameLocalSignature,
  type LocalSignature,
} from '../../lib/localSignatures'

// Free, no-account "Save on this device" — the local-first counterpart to the
// cloud save. Guests can keep a few signatures in this browser and reuse them
// without a Universal ID. Sits above the cloud panel so the free option leads.
export default function LocalSavePanel({ bare = false }: { bare?: boolean }) {
  const mode = useSigStore((s) => s.mode)
  const fontId = useSigStore((s) => s.fontId)
  const signerName = useSigStore((s) => s.signerName)
  const currentImage = useSigStore((s) => s.currentImage())
  const baseImage = useSigStore((s) => s.baseImage())
  const setMode = useSigStore((s) => s.setMode)
  const setDrawn = useSigStore((s) => s.setDrawn)
  const setTyped = useSigStore((s) => s.setTyped)
  const setFontId = useSigStore((s) => s.setFontId)
  const setSignerName = useSigStore((s) => s.setSignerName)

  const [saved, setSaved] = useState<LocalSignature[]>([])
  const [justSaved, setJustSaved] = useState(false)
  const [saveName, setSaveName] = useState('')
  const [renamingId, setRenamingId] = useState<string | null>(null)
  const [renameDraft, setRenameDraft] = useState('')
  const didInit = useRef(false)

  useEffect(() => {
    const list = loadLocalSignatures()
    setSaved(list)
    // Default the most recently saved signature to "in use" — but only once,
    // and only if the user hasn't already started a signature this session.
    if (!didInit.current) {
      didInit.current = true
      if (list.length > 0 && !useSigStore.getState().baseImage()) {
        onUse(list[0])
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Which saved entry (if any) is currently loaded as the active signature.
  const inUseId = baseImage ? saved.find((s) => s.imageDataUrl === baseImage)?.id ?? null : null

  function onSave() {
    if (!currentImage) return
    setSaved(
      saveLocalSignature({
        signerName,
        label: saveName,
        style: mode === 'type' ? 'type' : 'draw',
        font: mode === 'type' ? fontId : null,
        imageDataUrl: currentImage,
      }),
    )
    setSaveName('')
    setJustSaved(true)
    window.setTimeout(() => setJustSaved(false), 1800)
  }

  function startRename(sig: LocalSignature) {
    setRenamingId(sig.id)
    setRenameDraft(sig.label ?? sig.signerName ?? '')
  }
  function cancelRename() { setRenamingId(null); setRenameDraft('') }
  function saveRename(id: string) {
    // Guard against Enter + the ensuing blur both firing (the second would run
    // after renamingId is cleared, with an empty draft, wiping the name).
    if (renamingId !== id) return
    setSaved(renameLocalSignature(id, renameDraft))
    cancelRename()
  }

  // Display name for a saved entry: its label, else the signer name, else a
  // style default.
  function displayName(sig: LocalSignature): string {
    return sig.label || sig.signerName || (sig.style === 'type' ? 'Typed signature' : 'Drawn signature')
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

  const content = (
    <>
      {!bare && (
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold text-slate-900">Save on this device</h2>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-600">No account</span>
        </div>
      )}
      <p className={`text-xs text-slate-500 ${bare ? '' : 'mt-1'}`}>
        Keep your signature in this browser and reuse it later — free, no sign-in. It stays on this device and never leaves it.
      </p>

      <div className="mt-4 space-y-2">
        <input
          value={saveName}
          onChange={(e) => setSaveName(e.target.value)}
          placeholder="Name this signature (optional)"
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none"
        />
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
              className={`flex items-center gap-3 rounded-lg border p-2 ${sig.id === inUseId ? 'border-orange-300 bg-orange-50/60 ring-1 ring-orange-200' : 'border-slate-200 bg-slate-50'}`}
            >
              <span className="flex h-12 w-24 shrink-0 items-center justify-center overflow-hidden rounded bg-white ring-1 ring-slate-200">
                <img src={sig.imageDataUrl} alt="Saved signature" className="max-h-11 max-w-[5.5rem] object-contain" />
              </span>
              <span className="min-w-0 flex-1">
                {renamingId === sig.id ? (
                  <input
                    autoFocus
                    value={renameDraft}
                    onChange={(e) => setRenameDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveRename(sig.id)
                      else if (e.key === 'Escape') cancelRename()
                    }}
                    onBlur={() => saveRename(sig.id)}
                    placeholder="Signature name"
                    className="w-full rounded-md border border-slate-300 px-2 py-1 text-xs focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                ) : (
                  <button
                    onClick={() => startRename(sig)}
                    className="block max-w-full truncate text-left text-xs font-medium text-slate-700 hover:text-orange-600"
                    title="Rename"
                  >
                    {displayName(sig)}
                  </button>
                )}
                <span className="text-[10px] uppercase tracking-wide text-slate-400">{sig.style}</span>
              </span>
              {sig.id === inUseId ? (
                <span className="shrink-0 rounded-md bg-orange-100 px-3 py-1.5 text-xs font-semibold text-orange-700">
                  In use ✓
                </span>
              ) : (
                <button
                  onClick={() => onUse(sig)}
                  className="shrink-0 rounded-md bg-orange-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-orange-700"
                >
                  Use
                </button>
              )}
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
    </>
  )

  if (bare) return content
  return <div className="rounded-xl border border-slate-200 bg-white p-5">{content}</div>
}
