import { useCallback, useEffect, useRef, useState } from 'react'

// The drawing surface shared by the desktop pad and the phone signing page.
//
// Strokes are kept as points (CSS pixels), not just as pixels on the canvas,
// which is what makes three things possible:
//  • Undo — drop the last stroke and repaint.
//  • Resizing — rotating a phone or resizing the window used to leave the
//    backing store at its old size, so the drawing was stretched and new
//    strokes landed away from the pointer. Now the canvas is re-sized and the
//    strokes are repainted, scaled to fit.
//  • Smooth lines — each stroke is drawn as quadratic curves through the
//    midpoints between samples rather than straight segments, so a fast curve
//    doesn't come out as a polygon.
//  • Pressure — with a stylus that reports it, the line is thinner where the
//    pen is light and thicker where it presses. Mouse and finger strokes are
//    drawn as before.
//
// The backing store is at least 2× the CSS size even on a 1× screen: the PNG
// is what gets stamped onto the PDF, and a PDF is zoomed far more often than a
// web page is.

// `p` is the pen's pressure (0–1) at that sample. It is only recorded for a
// stylus (`pointerType === 'pen'`) that reports one: a mouse reports a constant
// 0.5 while a button is down and most touch screens report 0 or 1, so for them
// `p` stays undefined and the stroke is drawn exactly as it always was — one
// path at LINE_WIDTH.
type Pt = { x: number; y: number; p?: number }
type Stroke = Pt[]

const LINE_WIDTH = 2.5
const INK = '#0f172a'

// Width for a pressure: a light touch draws at 0.4x, a firm press at 1.6x, and
// a half press (0.5 — the value a mouse reports) at exactly LINE_WIDTH, so the
// two kinds of stroke look alike at an ordinary grip.
function widthFor(p: number | undefined): number {
  return p === undefined ? LINE_WIDTH : LINE_WIDTH * (0.4 + 1.2 * p)
}

/** The pressure to record for this event, or undefined when it isn't a pen's. */
function penPressure(e: React.PointerEvent): number | undefined {
  return e.pointerType === 'pen' && e.pressure > 0 ? Math.min(1, e.pressure) : undefined
}

function strokePath(ctx: CanvasRenderingContext2D, s: Stroke, k: number) {
  if (s.length === 1) {
    ctx.beginPath()
    ctx.arc(s[0].x * k, s[0].y * k, (widthFor(s[0].p) * k) / 2, 0, Math.PI * 2)
    ctx.fill()
    return
  }
  // A pen stroke changes width along its length, so it is drawn piece by piece
  // — each curve from one midpoint, through a sample, to the next midpoint,
  // at that sample's width. Round caps hide the joins.
  if (s[0].p !== undefined) {
    let from = s[0]
    for (let i = 1; i < s.length - 1; i++) {
      const mid = { x: (s[i].x + s[i + 1].x) / 2, y: (s[i].y + s[i + 1].y) / 2 }
      ctx.lineWidth = widthFor(s[i].p)
      ctx.beginPath()
      ctx.moveTo(from.x * k, from.y * k)
      ctx.quadraticCurveTo(s[i].x * k, s[i].y * k, mid.x * k, mid.y * k)
      ctx.stroke()
      from = mid
    }
    const end = s[s.length - 1]
    ctx.lineWidth = widthFor(end.p)
    ctx.beginPath()
    ctx.moveTo(from.x * k, from.y * k)
    ctx.lineTo(end.x * k, end.y * k)
    ctx.stroke()
    ctx.lineWidth = LINE_WIDTH
    return
  }
  ctx.beginPath()
  ctx.moveTo(s[0].x * k, s[0].y * k)
  for (let i = 1; i < s.length - 1; i++) {
    const mx = ((s[i].x + s[i + 1].x) / 2) * k
    const my = ((s[i].y + s[i + 1].y) / 2) * k
    ctx.quadraticCurveTo(s[i].x * k, s[i].y * k, mx, my)
  }
  const end = s[s.length - 1]
  ctx.lineTo(end.x * k, end.y * k)
  ctx.stroke()
}

export interface InkCanvas {
  canvasRef: React.RefObject<HTMLCanvasElement>
  handlers: {
    onPointerDown: (e: React.PointerEvent<HTMLCanvasElement>) => void
    onPointerMove: (e: React.PointerEvent<HTMLCanvasElement>) => void
    onPointerUp: (e: React.PointerEvent<HTMLCanvasElement>) => void
    onPointerCancel: (e: React.PointerEvent<HTMLCanvasElement>) => void
  }
  /** Anything on the pad — strokes or a loaded image. */
  hasInk: boolean
  canUndo: boolean
  undo: () => void
  clear: () => void
  /** Show an existing signature (fitted, not stretched) as the pad's starting point. */
  showImage: (dataUrl: string) => void
  toDataUrl: () => string | null
}

export function useInkCanvas(onChange?: (dataUrl: string | null) => void): InkCanvas {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const strokes = useRef<Stroke[]>([])
  const current = useRef<Stroke | null>(null)
  const image = useRef<HTMLImageElement | null>(null)
  // The pad's CSS size when the strokes were drawn, so a resize can scale them.
  const drawnAt = useRef<{ w: number; h: number } | null>(null)
  const [count, setCount] = useState(0) // strokes, for canUndo
  const [hasImage, setHasImage] = useState(false)
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

  const ctxFor = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d')!
    const ratio = canvas.width / Math.max(1, canvas.clientWidth)
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
    ctx.lineWidth = LINE_WIDTH
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.strokeStyle = INK
    ctx.fillStyle = INK
    return ctx
  }

  const repaint = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = ctxFor(canvas)
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    ctx.clearRect(0, 0, w, h)
    const img = image.current
    if (img && img.width && img.height) {
      const k = Math.min(w / img.width, h / img.height)
      const iw = img.width * k
      const ih = img.height * k
      ctx.drawImage(img, (w - iw) / 2, (h - ih) / 2, iw, ih)
    }
    const at = drawnAt.current
    const k = at ? Math.min(w / at.w, h / at.h) : 1
    for (const s of strokes.current) strokePath(ctx, s, k)
  }, [])

  // Size the backing store to the CSS box, and again whenever the box changes.
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const fit = () => {
      const ratio = Math.max(2, window.devicePixelRatio || 1)
      const w = Math.round(canvas.clientWidth * ratio)
      const h = Math.round(canvas.clientHeight * ratio)
      if (!w || !h || (canvas.width === w && canvas.height === h)) return
      canvas.width = w
      canvas.height = h
      repaint()
    }
    fit()
    if (typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(fit)
    ro.observe(canvas)
    return () => ro.disconnect()
  }, [repaint])

  const toDataUrl = useCallback((): string | null => {
    const canvas = canvasRef.current
    if (!canvas || (strokes.current.length === 0 && !image.current)) return null
    return canvas.toDataURL('image/png')
  }, [])

  const emit = () => onChangeRef.current?.(toDataUrl())

  const pointAt = (e: React.PointerEvent<HTMLCanvasElement>, prev?: Pt): Pt => {
    const rect = canvasRef.current!.getBoundingClientRect()
    const at = drawnAt.current
    // Strokes are stored in the coordinates of the size they were first drawn
    // at; a stroke added after a resize is mapped back into that space.
    const k = at ? Math.min(rect.width / at.w, rect.height / at.h) : 1
    const pt: Pt = { x: (e.clientX - rect.left) / k, y: (e.clientY - rect.top) / k }
    const raw = penPressure(e)
    // Eased towards the last sample: pen pressure jitters from one event to the
    // next, and an unsmoothed width makes the line look beaded.
    if (raw !== undefined) pt.p = prev?.p !== undefined ? prev.p * 0.6 + raw * 0.4 : raw
    return pt
  }

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    e.preventDefault()
    try { canvas.setPointerCapture(e.pointerId) } catch { /* ignore */ }
    if (!drawnAt.current) drawnAt.current = { w: canvas.clientWidth, h: canvas.clientHeight }
    const p = pointAt(e)
    current.current = [p]
    // A tap is a dot (the i, the full stop) — it used to draw nothing.
    const at = drawnAt.current
    const k = Math.min(canvas.clientWidth / at.w, canvas.clientHeight / at.h)
    strokePath(ctxFor(canvas), [p], k)
  }

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const s = current.current
    const canvas = canvasRef.current
    if (!s || !canvas) return
    e.preventDefault()
    const prev = s[s.length - 1]
    const p = pointAt(e, prev)
    // A stroke keeps the kind it started as: a pen that stops reporting
    // pressure mid-stroke carries on at its last width rather than switching
    // the whole stroke to the other renderer.
    if (s[0].p !== undefined && p.p === undefined) p.p = prev.p
    if (s[0].p === undefined) delete p.p
    if (Math.hypot(p.x - prev.x, p.y - prev.y) < 0.5) return
    s.push(p)
    // Draw only the newest piece: from the previous midpoint, curving through
    // the previous sample, to the new midpoint.
    const ctx = ctxFor(canvas)
    const at = drawnAt.current!
    const k = Math.min(canvas.clientWidth / at.w, canvas.clientHeight / at.h)
    const a = s.length >= 3 ? s[s.length - 3] : prev
    const from = s.length >= 3 ? { x: (a.x + prev.x) / 2, y: (a.y + prev.y) / 2 } : prev
    const to = { x: (prev.x + p.x) / 2, y: (prev.y + p.y) / 2 }
    if (prev.p !== undefined) ctx.lineWidth = widthFor(prev.p)
    ctx.beginPath()
    ctx.moveTo(from.x * k, from.y * k)
    ctx.quadraticCurveTo(prev.x * k, prev.y * k, to.x * k, to.y * k)
    ctx.stroke()
  }

  const finish = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const s = current.current
    if (!s) return
    current.current = null
    try { canvasRef.current?.releasePointerCapture(e.pointerId) } catch { /* ignore */ }
    strokes.current.push(s)
    setCount(strokes.current.length)
    // Repaint so the stroke's tail (and the dot under its start) match exactly
    // what a redraw would produce.
    repaint()
    emit()
  }

  const undo = () => {
    if (strokes.current.length === 0) return
    strokes.current.pop()
    setCount(strokes.current.length)
    if (strokes.current.length === 0 && !image.current) drawnAt.current = null
    repaint()
    emit()
  }

  const clear = () => {
    strokes.current = []
    current.current = null
    image.current = null
    drawnAt.current = null
    setCount(0)
    setHasImage(false)
    repaint()
    emit()
  }

  const showImage = useCallback((dataUrl: string) => {
    const img = new Image()
    img.onload = () => {
      image.current = img
      strokes.current = []
      drawnAt.current = null
      setCount(0)
      setHasImage(true)
      repaint()
    }
    img.src = dataUrl
  }, [repaint])

  return {
    canvasRef,
    handlers: { onPointerDown, onPointerMove, onPointerUp: finish, onPointerCancel: finish },
    hasInk: count > 0 || hasImage,
    canUndo: count > 0,
    undo,
    clear,
    showImage,
    toDataUrl,
  }
}
