import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { renderPageToCanvas } from '../../lib/pdfjs'
import type { PlacePoint } from '../../lib/pdf'
import { useT } from '../../i18n'

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

const RENDER_WIDTH = 520

// A visual placement picker: renders the chosen PDF page and overlays the
// signature so the user can click (or drag) to position it, exactly like
// Universal PDF. The position is stored as page fractions (0–1, top-left
// origin) with the click point as the signature centre.
export default function PositionPicker({
  file, pageIndex, sigPng, widthPct, onWidthChange, initialPos, onConfirm, onClose,
}: Props) {
  const t = useT()
  const [pageUrl, setPageUrl] = useState<string | null>(null)
  const [dims, setDims] = useState<{ w: number; h: number } | null>(null)
  const [sigAspect, setSigAspect] = useState(3) // width / height fallback
  const [pos, setPos] = useState<PlacePoint>(initialPos ?? { xPct: 0.75, yPct: 0.85 })
  const [error, setError] = useState<string | null>(null)
  const surfaceRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)
  const liveId = useId()

  // Render the page whenever the file / page changes.
  useEffect(() => {
    let cancelled = false
    setPageUrl(null); setDims(null); setError(null)
    file.arrayBuffer()
      .then((buf) => renderPageToCanvas(buf, pageIndex, RENDER_WIDTH))
      .then(({ canvas }) => {
        if (cancelled) return
        setPageUrl(canvas.toDataURL('image/png'))
        setDims({ w: canvas.width, h: canvas.height })
      })
      .catch(() => { if (!cancelled) setError(t('sign.picker_error')) })
    return () => { cancelled = true }
  }, [file, pageIndex])

  // Signature aspect ratio for the overlay size.
  useEffect(() => {
    const img = new Image()
    img.onload = () => { if (img.width && img.height) setSigAspect(img.width / img.height) }
    img.src = sigPng
  }, [sigPng])

  // Escape closes it. The × is the obvious exit, but a keyboard user on a
  // dialog this tall shouldn't have to scroll back up to find it.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  // Keep the signature wholly on the page, as signPdf does when it stamps it —
  // otherwise a point near an edge previewed hanging off the page and then
  // landed somewhere else. Half the signature's size, as page fractions.
  const halfW = widthPct / 200
  const halfH = dims ? (widthPct / 100) * (dims.w / sigAspect) / dims.h / 2 : 0
  const clampPos = (p: PlacePoint): PlacePoint => ({
    xPct: Math.max(halfW, Math.min(1 - halfW, p.xPct)),
    yPct: Math.max(Math.min(0.5, halfH), Math.min(1 - Math.min(0.5, halfH), p.yPct)),
  })
  const shown = clampPos(pos)

  function pointToPos(clientX: number, clientY: number): PlacePoint {
    const rect = surfaceRef.current!.getBoundingClientRect()
    return clampPos({
      xPct: (clientX - rect.left) / rect.width,
      yPct: (clientY - rect.top) / rect.height,
    })
  }

  // Arrow keys move the signature 1% of the page (10% with Shift), so the
  // position can be chosen without a pointer.
  function onKeyDown(e: React.KeyboardEvent) {
    const step = e.shiftKey ? 0.1 : 0.01
    const d: Record<string, [number, number]> = {
      ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step],
    }
    const m = d[e.key]
    if (!m) return
    e.preventDefault()
    setPos(clampPos({ xPct: shown.xPct + m[0], yPct: shown.yPct + m[1] }))
  }

  // Percentages, not canvas pixels. The page image is capped at `maxWidth: 100%`
  // so on a phone it renders narrower than `dims.w`, and an offset computed in
  // canvas space then lands off the page altogether — measured at 390px wide, a
  // 130px preview sat at x=361 beside a page whose right edge was 354, i.e. the
  // placement preview was invisible on every phone. Percentages scale with the
  // image, and `aspect-ratio` keeps the signature's shape.
  const overlayStyle = {
    left: `${shown.xPct * 100}%`,
    top: `${shown.yPct * 100}%`,
    width: `${widthPct}%`,
    aspectRatio: `${sigAspect}`,
    transform: 'translate(-50%, -50%)',
  }

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
          <div className="flex justify-center">
            {error ? (
              <p className="py-16 text-sm text-rose-600">{error}</p>
            ) : !pageUrl || !dims ? (
              <div className="flex h-96 w-full max-w-[520px] animate-pulse items-center justify-center rounded-lg bg-slate-100 text-sm text-slate-400">
                {t('sign.picker_rendering')}
              </div>
            ) : (
              <div
                ref={surfaceRef}
                tabIndex={0}
                role="application"
                aria-label={t('sign.picker_surface_label')}
                aria-describedby={liveId}
                onKeyDown={onKeyDown}
                className="relative cursor-crosshair select-none touch-none rounded-lg shadow ring-1 ring-slate-200 outline-none focus-visible:ring-2 focus-visible:ring-orange-600"
                style={{ width: dims.w, maxWidth: '100%' }}
                onPointerDown={(e) => {
                  e.preventDefault()
                  dragging.current = true
                  surfaceRef.current?.setPointerCapture(e.pointerId)
                  setPos(pointToPos(e.clientX, e.clientY))
                }}
                onPointerMove={(e) => { if (dragging.current) setPos(pointToPos(e.clientX, e.clientY)) }}
                onPointerUp={() => { dragging.current = false }}
                onPointerLeave={() => { dragging.current = false }}
              >
                <img src={pageUrl} alt={t('sign.picker_page_alt')} className="block w-full rounded-lg" draggable={false} />
                <img
                  src={sigPng}
                  alt={t('sign.picker_sig_alt')}
                  draggable={false}
                  className="pointer-events-none absolute rounded-sm ring-1 ring-orange-400/70"
                  style={overlayStyle}
                />
                <span id={liveId} className="sr-only" aria-live="polite">
                  {t('sign.picker_live', { x: Math.round(shown.xPct * 100), y: Math.round(shown.yPct * 100) })}
                </span>
              </div>
            )}
          </div>

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
            onClick={() => onConfirm(shown)}
            disabled={!pageUrl}
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
