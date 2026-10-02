import { useSigStore } from '../../stores/sigStore'
import type { MainSignature } from '../../lib/cloud'

// "Your main signature" — the one kept on your Universal ID (platform 0224),
// saved here or on the hub's Me page. One tap loads it into the studio as the
// drawn signature, ready to sign a PDF with on any device.
export default function MainSignatureBar({ main }: { main: MainSignature }) {
  const setMode = useSigStore((s) => s.setMode)
  const setDrawn = useSigStore((s) => s.setDrawn)
  const drawnDataUrl = useSigStore((s) => s.drawnDataUrl)
  const inUse = drawnDataUrl === main.image_data

  return (
    <div className="mb-4 flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-2" data-testid="main-signature">
      <span className="flex h-12 w-24 shrink-0 items-center justify-center overflow-hidden rounded bg-white ring-1 ring-slate-200">
        <img src={main.image_data} alt="Your main signature" className="max-h-11 max-w-[5.5rem] object-contain" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-xs font-semibold text-slate-700">Your main signature</span>
        <span className="block text-[11px] text-slate-500">Saved to your Universal ID</span>
      </span>
      <button
        type="button"
        onClick={() => { setMode('draw'); setDrawn(main.image_data) }}
        disabled={inUse}
        className="shrink-0 rounded-md bg-orange-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-orange-800 disabled:bg-emerald-600 disabled:opacity-100"
      >
        {inUse ? 'In use ✓' : 'Use it'}
      </button>
    </div>
  )
}
