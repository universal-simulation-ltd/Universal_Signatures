import { useEffect, useRef } from 'react'
import { useSigStore } from '../../stores/sigStore'
import { useInkCanvas } from '../../lib/useInkCanvas'

// A pointer-driven drawing pad. Emits a transparent PNG data URL to the store
// at the end of every stroke (and on undo/clear). Handles mouse, touch and
// stylus via Pointer Events; the drawing itself lives in useInkCanvas.
export default function SignaturePad() {
  const setDrawn = useSigStore((s) => s.setDrawn)
  const setMode = useSigStore((s) => s.setMode)
  const drawnDataUrl = useSigStore((s) => s.drawnDataUrl)
  // The last data URL this pad itself emitted — lets us tell our own strokes
  // apart from an externally restored signature (a reused "Save on this device"
  // entry, or your main signature), which we paint onto the canvas so it's
  // visible here too.
  const emitted = useRef<string | null>(null)
  const ink = useInkCanvas((url) => {
    emitted.current = url
    setDrawn(url)
  })
  const { showImage, clear } = ink

  // Paint a signature set from outside this pad so it shows in the box. Fitted,
  // not stretched: a main signature (0224) is cropped to its ink, so its shape
  // is nothing like the pad's. A full-pad image fits exactly.
  useEffect(() => {
    if (drawnDataUrl === emitted.current) return
    emitted.current = drawnDataUrl
    if (drawnDataUrl) showImage(drawnDataUrl)
    // Cleared from elsewhere: wipe the pad without echoing back to the store.
    else if (ink.hasInk) clear()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drawnDataUrl, showImage])

  return (
    <div>
      <div className="relative rounded-lg border-2 border-dashed border-slate-300 bg-white">
        <canvas
          ref={ink.canvasRef}
          role="img"
          aria-label="Signature pad. Draw your signature with a mouse, finger or stylus. To use the keyboard instead, choose Type."
          className="sig-pad block h-44 w-full rounded-lg"
          {...ink.handlers}
        />
        {!ink.hasInk && (
          <span className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 text-[11px] text-slate-400">
            Sign above
          </span>
        )}
      </div>
      <div className="mt-1 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setMode('type')}
          className="rounded-md px-2 py-1.5 text-xs font-medium text-slate-500 hover:text-orange-700"
        >
          Rather type it?
        </button>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={ink.undo}
            disabled={!ink.canUndo}
            className="rounded-md px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent"
          >
            Undo
          </button>
          <button
            type="button"
            onClick={ink.clear}
            disabled={!ink.hasInk}
            className="rounded-md px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-rose-700 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-slate-600"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  )
}
