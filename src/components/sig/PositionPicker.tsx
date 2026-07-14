import { useEffect, useRef, useState } from 'react'
import { renderPageToCanvas } from '../../lib/pdfjs'
import type { PlacePoint } from '../../lib/pdf'

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
  const [pageUrl, setPageUrl] = useState<string | null>(null)
  const [dims, setDims] = useState<{ w: number; h: number } | null>(null)
  const [sigAspect, setSigAspect] = useState(3) // width / height fallback
  const [pos, setPos] = useState<PlacePoint>(initialPos ?? { xPct: 0.75, yPct: 0.85 })
  const [error, setError] = useState<string | null>(null)
  const surfaceRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

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
      .catch(() => { if (!cancelled) setError('Could not render this page.') })
    return () => { cancelled = true }
  }, [file, pageIndex])

  // Signature aspect ratio for the overlay size.
  useEffect(() => {
    const img = new Image()
    img.onload = () => { if (img.width && img.height) setSigAspect(img.width / img.height) }
    img.src = sigPng
  }, [sigPng])

  function pointToPos(clientX: number, clientY: number): PlacePoint {
    const rect = surfaceRef.current!.getBoundingClientRect()
    const xPct = (clientX - rect.left) / rect.width
    const yPct = (clientY - rect.top) / rect.height
    return {
      xPct: Math.max(0, Math.min(1, xPct)),
      yPct: Math.max(0, Math.min(1, yPct)),
    }
  }

  const overlay = dims
    ? (() => {
        const wPx = (widthPct / 100) * dims.w
        const hPx = wPx / sigAspect
        return {
          left: pos.xPct * dims.w - wPx / 2,
          top: pos.yPct * dims.h - hPx / 2,
          width: wPx,
          height: hPx,
        }
      })()
    : null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-5 shadow-2xl">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Choose signature position</h2>
            <p className="text-xs text-slate-500">Click or drag on the page to place your signature.</p>
          </div>
          <button onClick={onClose} aria-label="Close" className="flex h-8 w-8 items-center justify-center text-xl leading-none text-slate-400 hover:text-slate-700">×</button>
        </div>

        <div className="flex justify-center">
          {error ? (
            <p className="py-16 text-sm text-rose-600">{error}</p>
          ) : !pageUrl || !dims ? (
            <div className="flex h-96 w-full max-w-[520px] animate-pulse items-center justify-center rounded-lg bg-slate-100 text-sm text-slate-400">
              Rendering page…
            </div>
          ) : (
            <div
              ref={surfaceRef}
              className="relative cursor-crosshair select-none touch-none rounded-lg shadow ring-1 ring-slate-200"
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
              <img src={pageUrl} alt="PDF page" className="block w-full rounded-lg" draggable={false} />
              {overlay && (
                <img
                  src={sigPng}
                  alt="Signature preview"
                  draggable={false}
                  className="pointer-events-none absolute rounded-sm ring-1 ring-orange-400/70"
                  style={{ left: overlay.left, top: overlay.top, width: overlay.width, height: overlay.height }}
                />
              )}
            </div>
          )}
        </div>

        <div className="mt-4 flex flex-col gap-1">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Size ({widthPct}%)</div>
          <input
            type="range" min={8} max={50} value={widthPct}
            onChange={(e) => onWidthChange(Number(e.target.value))}
            className="w-full accent-orange-600"
          />
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">Cancel</button>
          <button
            onClick={() => onConfirm(pos)}
            disabled={!pageUrl}
            className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700 disabled:opacity-50"
          >
            Use this position
          </button>
        </div>
      </div>
    </div>
  )
}
