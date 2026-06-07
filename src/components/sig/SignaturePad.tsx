import { useEffect, useRef } from 'react'
import { useSigStore } from '../../stores/sigStore'

// A pointer-driven drawing pad. Emits a transparent PNG data URL to the store
// on every stroke end. Handles mouse, touch and stylus via Pointer Events.
export default function SignaturePad() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const drawing = useRef(false)
  const last = useRef<{ x: number; y: number } | null>(null)
  const setDrawn = useSigStore((s) => s.setDrawn)

  // Size the canvas backing store to its CSS box (crisp on HiDPI).
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ratio = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = Math.round(rect.width * ratio)
    canvas.height = Math.round(rect.height * ratio)
    const ctx = canvas.getContext('2d')!
    ctx.scale(ratio, ratio)
    ctx.lineWidth = 2.5
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.strokeStyle = '#0f172a'
  }, [])

  function pos(e: React.PointerEvent): { x: number; y: number } {
    const rect = canvasRef.current!.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  function start(e: React.PointerEvent) {
    e.preventDefault()
    drawing.current = true
    last.current = pos(e)
    canvasRef.current?.setPointerCapture(e.pointerId)
  }

  function move(e: React.PointerEvent) {
    if (!drawing.current || !last.current) return
    const ctx = canvasRef.current!.getContext('2d')!
    const p = pos(e)
    ctx.beginPath()
    ctx.moveTo(last.current.x, last.current.y)
    ctx.lineTo(p.x, p.y)
    ctx.stroke()
    last.current = p
  }

  function end() {
    if (!drawing.current) return
    drawing.current = false
    last.current = null
    const url = canvasRef.current?.toDataURL('image/png') ?? null
    setDrawn(url)
  }

  function clear() {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setDrawn(null)
  }

  return (
    <div>
      <div className="relative rounded-lg border-2 border-dashed border-slate-300 bg-white">
        <canvas
          ref={canvasRef}
          className="sig-pad block h-44 w-full rounded-lg"
          onPointerDown={start}
          onPointerMove={move}
          onPointerUp={end}
          onPointerLeave={end}
        />
        <span className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 text-[11px] text-slate-300">
          Sign above
        </span>
      </div>
      <div className="mt-2 flex justify-end">
        <button onClick={clear} className="text-xs font-medium text-slate-500 hover:text-rose-600">Clear</button>
      </div>
    </div>
  )
}
