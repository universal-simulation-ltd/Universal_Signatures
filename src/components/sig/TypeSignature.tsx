import { useEffect } from 'react'
import { useSigStore } from '../../stores/sigStore'
import { SIG_FONTS, fontById } from '../../lib/fonts'
import { rasterizeTyped } from '../../lib/signature'

export default function TypeSignature() {
  const signerName = useSigStore((s) => s.signerName)
  const fontId = useSigStore((s) => s.fontId)
  const setSignerName = useSigStore((s) => s.setSignerName)
  const setFontId = useSigStore((s) => s.setFontId)
  const setTyped = useSigStore((s) => s.setTyped)

  const font = fontById(fontId)

  // Rasterise the typed signature whenever the name or font changes (once the
  // web font is ready), so the cloud save / PDF embed always have a PNG.
  useEffect(() => {
    let cancelled = false
    if (!signerName.trim()) { setTyped(null); return }
    const ready = (document as Document & { fonts?: FontFaceSet }).fonts?.ready ?? Promise.resolve()
    ready.then(() => {
      if (cancelled) return
      setTyped(rasterizeTyped(signerName, font.family))
    })
    return () => { cancelled = true }
  }, [signerName, font.family, setTyped])

  return (
    <div className="space-y-3">
      <input
        value={signerName}
        onChange={(e) => setSignerName(e.target.value)}
        placeholder="Type your name"
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none"
      />
      <div className="flex flex-wrap gap-2">
        {SIG_FONTS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFontId(f.id)}
            className={`rounded-md px-3 py-1.5 text-base ${f.css} ring-1 transition ${
              fontId === f.id ? 'bg-orange-600 text-white ring-orange-600' : 'bg-white text-slate-700 ring-slate-200 hover:bg-slate-50'
            }`}
            title={f.label}
          >
            {signerName.trim() ? signerName.slice(0, 10) : f.label}
          </button>
        ))}
      </div>
      <div className="flex h-44 items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-white">
        {signerName.trim() ? (
          <span className={`${font.css} text-5xl text-slate-900`}>{signerName}</span>
        ) : (
          <span className="text-sm text-slate-300">Your typed signature previews here</span>
        )}
      </div>
    </div>
  )
}
