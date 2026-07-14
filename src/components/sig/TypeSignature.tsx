import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useSigStore } from '../../stores/sigStore'
import { SIG_FONTS, fontById, fontFamilyCss, type SigFont } from '../../lib/fonts'
import { rasterizeTyped } from '../../lib/signature'

// Preview label for a font button: the first 5 characters of the typed name
// (with an ellipsis when longer), or the font's own label before anything's typed.
function previewText(name: string, label: string): string {
  const n = name.trim()
  if (!n) return label
  return n.length > 5 ? n.slice(0, 5) + '…' : n
}

export default function TypeSignature() {
  const signerName = useSigStore((s) => s.signerName)
  const fontId = useSigStore((s) => s.fontId)
  const importedFonts = useSigStore((s) => s.importedFonts)
  const setSignerName = useSigStore((s) => s.setSignerName)
  const setFontId = useSigStore((s) => s.setFontId)
  const setTyped = useSigStore((s) => s.setTyped)
  const addImportedFont = useSigStore((s) => s.addImportedFont)

  const fileRef = useRef<HTMLInputElement>(null)
  const [importError, setImportError] = useState<string | null>(null)

  const previewBoxRef = useRef<HTMLDivElement>(null)
  const previewTextRef = useRef<HTMLSpanElement>(null)

  const fonts = [...SIG_FONTS, ...importedFonts]
  const font = fontById(fontId, importedFonts)

  // Keep the live preview inside the pad: shrink the font until the name fits
  // the box width so a long name never spills out of bounds (mirrors how the
  // rasterised PNG is fit to width).
  useLayoutEffect(() => {
    const box = previewBoxRef.current
    const el = previewTextRef.current
    if (!box || !el) return
    const BASE = 48 // text-5xl
    const avail = box.clientWidth - 24 // horizontal padding breathing room
    el.style.fontSize = `${BASE}px`
    const natural = el.scrollWidth
    if (natural > avail) {
      el.style.fontSize = `${Math.max(14, BASE * (avail / natural))}px`
    }
  }, [signerName, font.family])

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

  async function onImportFont(file: File) {
    setImportError(null)
    try {
      const family = `Imported-${Date.now().toString(36)}`
      const buf = await file.arrayBuffer()
      const face = new FontFace(family, buf)
      await face.load()
      ;(document as Document & { fonts: FontFaceSet }).fonts.add(face)
      const label = file.name.replace(/\.[^.]+$/, '').slice(0, 16) || 'Imported'
      const imported: SigFont = { id: `imp_${family}`, label, family, imported: true }
      addImportedFont(imported)
      setFontId(imported.id)
    } catch {
      setImportError('Could not load that font. Use a .woff2, .woff, .ttf or .otf file.')
    }
  }

  return (
    <div className="space-y-3">
      <input
        value={signerName}
        onChange={(e) => setSignerName(e.target.value)}
        placeholder="Type your name"
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none"
      />
      <div className="flex flex-wrap gap-2">
        {fonts.map((f) => (
          <button
            key={f.id}
            onClick={() => setFontId(f.id)}
            style={{ fontFamily: fontFamilyCss(f) }}
            className={`rounded-md px-3 py-1.5 text-base ring-1 transition ${
              fontId === f.id ? 'bg-orange-600 text-white ring-orange-600' : 'bg-white text-slate-700 ring-slate-200 hover:bg-slate-50'
            }`}
            title={f.label}
          >
            {previewText(signerName, f.label)}
          </button>
        ))}
        {/* Import a custom font from the user's device. */}
        <button
          onClick={() => fileRef.current?.click()}
          className="inline-flex items-center gap-1 rounded-md border border-dashed border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-500 hover:border-orange-400 hover:text-orange-600"
          title="Import a font file"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Import font
        </button>
        <input
          ref={fileRef}
          type="file"
          accept=".woff2,.woff,.ttf,.otf,font/woff2,font/woff,font/ttf,font/otf"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) onImportFont(f); e.target.value = '' }}
        />
      </div>
      {importError && <p className="text-xs text-rose-600">{importError}</p>}
      <div ref={previewBoxRef} className="flex h-44 items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-slate-300 bg-white px-3">
        {signerName.trim() ? (
          <span ref={previewTextRef} style={{ fontFamily: fontFamilyCss(font) }} className="whitespace-nowrap leading-tight text-slate-900">{signerName}</span>
        ) : (
          <span className="text-sm text-slate-300">Your typed signature previews here</span>
        )}
      </div>
    </div>
  )
}
