import { useEffect, useRef, useState } from 'react'
import { useSigStore } from '../../stores/sigStore'
import { fontById, fontFamilyCss } from '../../lib/fonts'
import { initialsFrom, rasterizeTyped, trimToInk } from '../../lib/signature'
import { useInkCanvas } from '../../lib/useInkCanvas'
import type { Anchor } from '../../lib/pdf'
import { useT, type MessageKey } from '../../i18n'

const CORNERS: { id: Anchor; label: MessageKey }[] = [
  { id: 'top-left', label: 'create.corner_top_left' }, { id: 'top-center', label: 'create.corner_top_center' }, { id: 'top-right', label: 'create.corner_top_right' },
  { id: 'bottom-left', label: 'create.corner_bottom_left' }, { id: 'bottom-center', label: 'create.corner_bottom_center' }, { id: 'bottom-right', label: 'create.corner_bottom_right' },
]

export interface InitialsChoice {
  /** The initials as a transparent PNG cropped to their ink, or null until there are some. */
  png: string | null
  anchor: Anchor
  widthPct: number
  includeLast: boolean
}

/**
 * Initials for "initials on every page, signature on the last". Typed in the
 * font chosen for the typed signature (pre-filled from the name, when there is
 * one) or drawn on a small pad of their own — the main pad holds the full
 * signature, which is still what goes on the last page.
 */
export default function InitialsPanel({ value, onChange }: { value: InitialsChoice; onChange: (v: InitialsChoice) => void }) {
  const t = useT()
  const signerName = useSigStore((s) => s.signerName)
  const fontId = useSigStore((s) => s.fontId)
  const importedFonts = useSigStore((s) => s.importedFonts)
  const font = fontById(fontId, importedFonts)

  const [mode, setMode] = useState<'type' | 'draw'>('type')
  const [text, setText] = useState(() => initialsFrom(signerName))
  // Follow the name until the initials are edited by hand.
  const edited = useRef(false)
  useEffect(() => {
    if (!edited.current) setText(initialsFrom(signerName))
  }, [signerName])

  const [drawn, setDrawn] = useState<string | null>(null)
  const ink = useInkCanvas(setDrawn)

  // Keep the latest choice for the async rasterise below.
  const latest = useRef(value)
  latest.current = value

  // Rasterise whichever is in use into the PNG that gets stamped.
  useEffect(() => {
    let cancelled = false
    const source = mode === 'draw'
      ? Promise.resolve(drawn)
      : text.trim()
        ? ((document as Document & { fonts?: FontFaceSet }).fonts?.ready ?? Promise.resolve()).then(() => rasterizeTyped(text.trim(), font.family))
        : Promise.resolve(null)
    source
      .then((png) => (png ? trimToInk(png) : null))
      .then((png) => { if (!cancelled) onChange({ ...latest.current, png }) })
      .catch(() => { if (!cancelled) onChange({ ...latest.current, png: null }) })
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, text, drawn, font.family])

  const set = (patch: Partial<InitialsChoice>) => onChange({ ...value, ...patch })

  return (
    <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50/60 p-3" data-testid="initials-panel">
      <div className="flex items-center justify-between gap-2">
        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{t('create.initials_title')}</div>
        <div className="inline-flex rounded-md bg-slate-200/70 p-0.5">
          {(['type', 'draw'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              aria-pressed={mode === m}
              className={`rounded px-2.5 py-1 text-xs font-semibold ${mode === m ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
            >
              {m === 'type' ? t('create.initials_mode_type') : t('create.initials_mode_draw')}
            </button>
          ))}
        </div>
      </div>

      {/* Both stay mounted — the pad is only hidden — so drawn initials survive
          a look at Type, and the canvas sizes itself (via its ResizeObserver)
          the moment it is shown. */}
      <div className={`mt-2 flex items-center gap-3 ${mode === 'type' ? '' : 'hidden'}`}>
        <label className="sr-only" htmlFor="initials-text">{t('create.initials_title')}</label>
        <input
          id="initials-text"
          value={text}
          maxLength={6}
          onChange={(e) => { edited.current = true; setText(e.target.value) }}
          placeholder={t('create.initials_placeholder')}
          className="w-24 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
        />
        <span
          className="flex h-12 min-w-0 flex-1 items-center justify-center overflow-hidden rounded-md border border-dashed border-slate-300 bg-white px-2 text-3xl text-slate-900"
          style={{ fontFamily: fontFamilyCss(font) }}
          aria-hidden="true"
        >
          {text.trim() || <span className="font-sans text-xs text-slate-300">{t('create.initials_preview')}</span>}
        </span>
      </div>
      <div className={`mt-2 ${mode === 'draw' ? '' : 'hidden'}`}>
        <canvas
          ref={ink.canvasRef}
          role="img"
          aria-label={t('create.initials_pad_aria')}
          className="block h-20 w-full touch-none rounded-md border border-dashed border-slate-300 bg-white"
          {...ink.handlers}
        />
        <div className="mt-1 flex justify-end gap-1">
          <button type="button" onClick={ink.undo} disabled={!ink.canUndo} className="rounded-md px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-40">{t('create.initials_undo')}</button>
          <button type="button" onClick={ink.clear} disabled={!ink.hasInk} className="rounded-md px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-40">{t('create.initials_clear')}</button>
        </div>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div>
          <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">{t('create.initials_position')}</div>
          <div role="group" aria-label={t('create.initials_position_aria')} className="grid grid-cols-3 gap-1.5">
            {CORNERS.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => set({ anchor: c.id })}
                aria-label={t(c.label)}
                aria-pressed={value.anchor === c.id}
                title={t(c.label)}
                className={`h-7 rounded-md ring-1 transition ${value.anchor === c.id ? 'bg-orange-600 ring-orange-600' : 'bg-white ring-slate-200 hover:bg-slate-50'}`}
              >
                <span className={`mx-auto block h-1.5 w-1.5 rounded-full ${value.anchor === c.id ? 'bg-white' : 'bg-slate-300'}`} />
              </button>
            ))}
          </div>
        </div>
        <div>
          <label htmlFor="initials-size" className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            {t('create.initials_size', { pct: value.widthPct })}
          </label>
          <input
            id="initials-size"
            type="range"
            min={4}
            max={20}
            value={value.widthPct}
            onChange={(e) => set({ widthPct: Number(e.target.value) })}
            className="w-full accent-orange-600"
          />
        </div>
      </div>

      <label className="mt-3 flex cursor-pointer items-start gap-2 text-xs text-slate-600">
        <input
          type="checkbox"
          checked={value.includeLast}
          onChange={(e) => set({ includeLast: e.target.checked })}
          className="mt-0.5 h-4 w-4 accent-orange-600"
        />
        <span>{t('create.initials_include_last')}</span>
      </label>
    </div>
  )
}
