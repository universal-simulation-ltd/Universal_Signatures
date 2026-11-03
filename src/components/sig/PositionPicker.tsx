import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import type { PlacePoint } from '../../lib/pdf'
import { useT } from '../../i18n'
import PagePlacer from './PagePlacer'

interface Props {
  file: File
  pageIndex: number
  sigPng: string
  widthPct: number
  onWidthChange: (pct: number) => void
  initialPos: PlacePoint | null
  onConfirm: (pos: PlacePoint) => void
  onClose: () => void
}

// Where the RECIPIENT signs, for Send to be signed: the page and its "Sign
// here" box (PagePlacer) in a dialog, confirmed with "Use this position".
// Sign it myself shows the same page inline instead, with no dialog.
export default function PositionPicker({
  file, pageIndex, sigPng, widthPct, onWidthChange, initialPos, onConfirm, onClose,
}: Props) {
  const t = useT()
  const [pos, setPos] = useState<PlacePoint>(initialPos ?? { xPct: 0.75, yPct: 0.85 })

  // Escape closes it. The × is the obvious exit, but a keyboard user on a
  // dialog this tall shouldn't have to scroll back up to find it.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  // Portalled to <body> and lifted above the SDK nav bar's z-index: 1000 — see
  // the `.uni-modal-*` block in index.css for why both are needed. The header
  // and the action row sit OUTSIDE the scrolling body, so they stay put however
  // tall the rendered page is.
  return createPortal(
    <div
      className="uni-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={t('sign.picker_title')}
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="uni-modal-panel w-full max-w-2xl rounded-xl bg-white shadow-2xl">
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-slate-100 px-5 py-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900">{t('sign.picker_title')}</h2>
            <p className="text-xs text-slate-500">{t('sign.picker_hint')}</p>
          </div>
          <button onClick={onClose} aria-label={t('sign.picker_close')} className="-mr-1 flex h-8 w-8 shrink-0 items-center justify-center text-xl leading-none text-slate-400 hover:text-slate-700">×</button>
        </div>

        <div className="uni-modal-body px-5 py-4">
          <PagePlacer file={file} pageIndex={pageIndex} sigPng={sigPng} widthPct={widthPct} pos={pos} onChange={setPos} />

          <div className="mt-4 flex flex-col gap-1">
            <label htmlFor="picker-size" className="text-xs font-semibold uppercase tracking-wide text-slate-500">{t('sign.size_label', { pct: widthPct })}</label>
            <input
              id="picker-size"
              type="range" min={8} max={50} value={widthPct}
              onChange={(e) => onWidthChange(Number(e.target.value))}
              className="w-full accent-orange-600"
            />
          </div>
        </div>

        <div className="flex shrink-0 justify-end gap-2 border-t border-slate-100 px-5 py-3">
          <button onClick={onClose} className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">{t('sign.picker_cancel')}</button>
          <button
            onClick={() => onConfirm(pos)}
            className="rounded-lg bg-orange-700 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-800 disabled:opacity-50"
          >
            {t('sign.picker_confirm')}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
