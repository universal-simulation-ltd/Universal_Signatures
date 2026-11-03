import { useEffect, useId, useRef, useState } from 'react'
import { renderPageToCanvas } from '../../lib/pdfjs'
import type { Anchor, PlacePoint } from '../../lib/pdf'
import { useT } from '../../i18n'

interface Props {
  file: File
  /** 0-based; -1 = the last page. */
  pageIndex: number
  /** Null until there is a signature: the page shows on its own. */
  sigPng: string | null
  widthPct: number
  /** The signature's centre as page fractions (0–1, top-left origin). Null = where signPdf puts it with no point: the bottom-right corner, 24 pt in. */
  pos: PlacePoint | null
  onChange: (pos: PlacePoint) => void
  /** CSS pixels across; rendered sharper than that for high-density screens. */
  displayWidth?: number
  /** Initials this page gets, drawn where signPdf stamps them (not draggable: their corner is chosen in the InitialsPanel). */
  initials?: PreviewInitials | null
}

export interface PreviewInitials {
  png: string
  anchor: Anchor
  widthPct: number
}

// signPdf's corner margin, in PDF points.
const MARGIN_PT = 24

// The PDF page with the signature on it, to drag where it goes (James,
// 2026-11-03: "just show a preview of PDF immediately with the signature to be
// dragged to position"). Inline under Sign it myself, and inside the
// PositionPicker dialog for Send to be signed.
//
// ⚠️ A finger only drags from the signature itself (`touch-none` is on it
// alone) and a tap on the page moves it there: inline, a page-sized
// `touch-none` surface would be a dead patch the phone cannot scroll past. A
// mouse drags from anywhere on the page, as the dialog always did.
export default function PagePlacer({ file, pageIndex, sigPng, widthPct, pos, onChange, displayWidth = 520, initials = null }: Props) {
  const t = useT()
  const [page, setPage] = useState<{ url: string; w: number; h: number; ptW: number; ptH: number } | null>(null)
  const [sigAspect, setSigAspect] = useState(3) // width / height fallback
  const [iniAspect, setIniAspect] = useState(1.5)
  const [error, setError] = useState<string | null>(null)
  const surfaceRef = useRef<HTMLDivElement>(null)
  // While dragging: where in the signature it was picked up, as page fractions from its centre.
  const grab = useRef<{ dx: number; dy: number } | null>(null)
  const liveId = useId()

  useEffect(() => {
    let cancelled = false
    setPage(null); setError(null)
    const scale = Math.min(2, Math.max(1, window.devicePixelRatio || 1))
    file.arrayBuffer()
      .then((buf) => renderPageToCanvas(buf, pageIndex, Math.round(displayWidth * scale)))
      .then(({ canvas, pageWidth, pageHeight }) => {
        if (cancelled) return
        setPage({ url: canvas.toDataURL('image/png'), w: canvas.width, h: canvas.height, ptW: pageWidth, ptH: pageHeight })
      })
      .catch(() => { if (!cancelled) setError(t('sign.picker_error')) })
    return () => { cancelled = true }
    // Not on `t`: a language change needs no new render of the page.
  }, [file, pageIndex, displayWidth])

  useEffect(() => {
    if (!sigPng) return
    const img = new Image()
    img.onload = () => { if (img.width && img.height) setSigAspect(img.width / img.height) }
    img.src = sigPng
  }, [sigPng])

  const iniPng = initials?.png
  useEffect(() => {
    if (!iniPng) return
    const img = new Image()
    img.onload = () => { if (img.width && img.height) setIniAspect(img.width / img.height) }
    img.src = iniPng
  }, [iniPng])

  // Keep the signature wholly on the page, as signPdf does when it stamps it —
  // otherwise a point near an edge previewed hanging off the page and then
  // landed somewhere else. Half the signature's size, as page fractions.
  const halfW = widthPct / 200
  const halfH = page ? (widthPct / 100) * (page.w / sigAspect) / page.h / 2 : 0
  const clampPos = (p: PlacePoint): PlacePoint => ({
    xPct: Math.max(halfW, Math.min(1 - halfW, p.xPct)),
    yPct: Math.max(Math.min(0.5, halfH), Math.min(1 - Math.min(0.5, halfH), p.yPct)),
  })
  const corner: PlacePoint = page
    ? { xPct: 1 - MARGIN_PT / page.ptW - halfW, yPct: 1 - MARGIN_PT / page.ptH - halfH }
    : { xPct: 0.75, yPct: 0.85 }
  const shown = clampPos(pos ?? corner)

  function pointAt(clientX: number, clientY: number) {
    const rect = surfaceRef.current!.getBoundingClientRect()
    return { xPct: (clientX - rect.left) / rect.width, yPct: (clientY - rect.top) / rect.height }
  }

  // Arrow keys move the signature 1% of the page (10% with Shift), so the
  // position can be chosen without a pointer.
  function onKeyDown(e: React.KeyboardEvent) {
    const step = e.shiftKey ? 0.1 : 0.01
    const d: Record<string, [number, number]> = {
      ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step],
    }
    const m = d[e.key]
    if (!m || !sigPng) return
    e.preventDefault()
    onChange(clampPos({ xPct: shown.xPct + m[0], yPct: shown.yPct + m[1] }))
  }

  if (error) return <p className="py-16 text-center text-sm text-rose-600">{error}</p>
  if (!page) {
    return (
      <div className="mx-auto flex aspect-[1/1.414] w-full animate-pulse items-center justify-center rounded-lg bg-slate-100 text-sm text-slate-400" style={{ maxWidth: displayWidth }}>
        {t('sign.picker_rendering')}
      </div>
    )
  }

  // Where the initials land, worked out as signPdf does (in PDF points,
  // bottom-left origin), so the preview and the signed copy agree — including
  // the hop above (or below) the signature when they would overlap.
  let initialsStyle: React.CSSProperties | null = null
  if (initials) {
    const { ptW: pw, ptH: ph } = page
    const w = (Math.max(3, Math.min(30, initials.widthPct)) / 100) * pw
    const h = w / iniAspect
    const [vert, horiz] = initials.anchor.split('-')
    let x = horiz === 'center' ? (pw - w) / 2 : horiz === 'right' ? pw - w - MARGIN_PT : MARGIN_PT
    let y = vert === 'mid' ? (ph - h) / 2 : vert === 'top' ? ph - h - MARGIN_PT : MARGIN_PT
    if (sigPng) {
      const sw = (Math.max(5, Math.min(60, widthPct)) / 100) * pw
      const sh = sw / sigAspect
      const sx = Math.max(0, Math.min(pw - sw, shown.xPct * pw - sw / 2))
      const sy = Math.max(0, Math.min(ph - sh, ph - shown.yPct * ph - sh / 2))
      if (x < sx + sw && x + w > sx && y < sy + sh && y + h > sy) {
        const gap = 6
        y = sy + sh + gap + h <= ph ? sy + sh + gap : Math.max(0, sy - gap - h)
      }
    }
    x = Math.max(0, x)
    initialsStyle = { left: `${(x / pw) * 100}%`, top: `${((ph - y - h) / ph) * 100}%`, width: `${(w / pw) * 100}%`, aspectRatio: `${iniAspect}` }
  }

  // Percentages, not canvas pixels. The page image is capped at `maxWidth: 100%`
  // so on a phone it renders narrower than its canvas, and an offset computed in
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

  return (
    <div
      ref={surfaceRef}
      tabIndex={sigPng ? 0 : -1}
      role={sigPng ? 'application' : undefined}
      aria-label={sigPng ? t('sign.picker_surface_label') : undefined}
      aria-describedby={sigPng ? liveId : undefined}
      onKeyDown={onKeyDown}
      className={`relative mx-auto select-none rounded-lg shadow ring-1 ring-slate-200 outline-none focus-visible:ring-2 focus-visible:ring-orange-600 ${sigPng ? 'cursor-crosshair' : ''}`}
      // Not `width: displayWidth` + `maxWidth: 100%`: in the studio's one-column
      // grid on a phone, a fixed 520px width sized the grid track itself, and the
      // whole page laid out 578px wide.
      style={{ width: '100%', maxWidth: displayWidth }}
      onPointerDown={(e) => {
        if (!sigPng) return
        const onSig = (e.target as HTMLElement).dataset.handle === 'sig'
        if (!onSig && e.pointerType !== 'mouse') return
        e.preventDefault()
        const p = pointAt(e.clientX, e.clientY)
        // From the signature: it keeps where it was picked up. From the page: its centre jumps to the pointer.
        grab.current = onSig ? { dx: p.xPct - shown.xPct, dy: p.yPct - shown.yPct } : { dx: 0, dy: 0 }
        surfaceRef.current?.setPointerCapture(e.pointerId)
        if (!onSig) onChange(clampPos(p))
      }}
      onPointerMove={(e) => {
        if (!grab.current) return
        const p = pointAt(e.clientX, e.clientY)
        onChange(clampPos({ xPct: p.xPct - grab.current.dx, yPct: p.yPct - grab.current.dy }))
      }}
      onPointerUp={() => { grab.current = null }}
      onPointerCancel={() => { grab.current = null }}
      // A tap on the page (not a scroll) moves the signature there. A mouse
      // already placed it on the way down, and a drag ends where it was let go.
      onClick={(e) => {
        if (!sigPng || (e.target as HTMLElement).dataset.handle === 'sig') return
        if (e.nativeEvent instanceof PointerEvent && e.nativeEvent.pointerType === 'mouse') return
        onChange(clampPos(pointAt(e.clientX, e.clientY)))
      }}
    >
      <img src={page.url} alt={t('sign.picker_page_alt')} className="block w-full rounded-lg" draggable={false} />
      {initials && initialsStyle && (
        <img
          src={initials.png}
          alt={t('sign.picker_initials_alt')}
          draggable={false}
          className="pointer-events-none absolute rounded-sm ring-1 ring-orange-300/60"
          style={initialsStyle}
        />
      )}
      {sigPng && (
        <img
          src={sigPng}
          alt={t('sign.picker_sig_alt')}
          data-handle="sig"
          draggable={false}
          className="absolute cursor-grab touch-none rounded-sm ring-1 ring-orange-400/70 active:cursor-grabbing"
          style={overlayStyle}
        />
      )}
      {sigPng && (
        <span id={liveId} className="sr-only" aria-live="polite">
          {t('sign.picker_live', { x: Math.round(shown.xPct * 100), y: Math.round(shown.yPct * 100) })}
        </span>
      )}
    </div>
  )
}
