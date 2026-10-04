import { useSigStore } from '../../stores/sigStore'
import type { MainSignature } from '../../lib/cloud'
import { useT } from '../../i18n'

// "Your main signature" — the one kept on your Universal ID (platform 0224),
// saved here or on the hub's Me page. One tap loads it into the studio as the
// drawn signature, ready to sign a PDF with on any device.
export default function MainSignatureBar({ main }: { main: MainSignature }) {
  const t = useT()
  const setMode = useSigStore((s) => s.setMode)
  const setDrawn = useSigStore((s) => s.setDrawn)
  const drawnDataUrl = useSigStore((s) => s.drawnDataUrl)
  const inUse = drawnDataUrl === main.image_data

  return (
    <div className="mb-4 flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-2" data-testid="main-signature">
      <span className="flex h-12 w-24 shrink-0 items-center justify-center overflow-hidden rounded bg-white ring-1 ring-slate-200">
        <img src={main.image_data} alt={t('create.main_alt')} className="max-h-11 max-w-[5.5rem] object-contain" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-xs font-semibold text-slate-700">{t('create.main_title')}</span>
        <span className="block text-[11px] text-slate-500">{t('create.main_saved')}</span>
      </span>
      <button
        type="button"
        onClick={() => { setMode('draw'); setDrawn(main.image_data) }}
        disabled={inUse}
        className="shrink-0 rounded-md bg-orange-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-orange-800 disabled:bg-emerald-600 disabled:opacity-100"
      >
        {inUse ? t('create.main_in_use') : t('create.main_use')}
      </button>
    </div>
  )
}
