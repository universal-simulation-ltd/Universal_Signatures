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
//
// The backing store is at least 2× the CSS size even on a 1× screen: the PNG
// is what gets stamped onto the PDF, and a PDF is zoomed far more often than a
// web page is.

type Pt = { x: number; y: number }
type Stroke = Pt[]

const LINE_WIDTH = 2.5
const INK = '#0f172a'

function strokePath(ctx: CanvasRenderingContext2D, s: Stroke, k: number) {
  if (s.length === 1) {
    ctx.beginPath()
    ctx.arc(s[0].x * k, s[0].y * k, (LINE_WIDTH * k) / 2, 0, Math.PI * 2)
    ctx.fill()
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

  const pointAt = (e: React.PointerEvent<HTMLCanvasElement>): Pt => {
    const rect = canvasRef.current!.getBoundingClientRect()
    const at = drawnAt.current
    // Strokes are stored in the coordinates of the size they were first drawn
    // at; a stroke added after a resize is mapped back into that space.
    const k = at ? Math.min(rect.width / at.w, rect.height / at.h) : 1
    return { x: (e.clientX - rect.left) / k, y: (e.clientY - rect.top) / k }
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
    const p = pointAt(e)
    const prev = s[s.length - 1]
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
