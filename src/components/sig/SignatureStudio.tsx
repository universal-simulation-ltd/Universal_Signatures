import { useEffect, useId, useState } from 'react'
import { PrivacyNote, useDefaultView, type LocalizedSubject, type LocalizedText } from '@unisim/sdk'
import { useT, type MessageKey } from '../../i18n'
import { en } from '../../i18n/en'
import { STUDIO_MODES, useSigStore } from '../../stores/sigStore'
import type { StudioMode } from '../../lib/types'
import { composeSignatureWithLabels, formatSigningDate, formatSigningTime } from '../../lib/signature'
import type { LabelAlign } from '../../stores/sigStore'
import SignaturePad from './SignaturePad'
import TypeSignature from './TypeSignature'
import PhoneSignPanel from './PhoneSignPanel'
import ApplyToPdf from './ApplyToPdf'
import SaveTabs from './SaveTabs'
import MainSignatureBar from './MainSignatureBar'
import { useMainSignature } from '../../lib/cloud'
import { CONTAINER } from '../../lib/layout'
import { useTouchPhone } from '../../lib/useCoarsePointer'

const MODES: { id: StudioMode; label: MessageKey }[] = [
  { id: 'draw', label: 'create.mode_draw' },
  { id: 'type', label: 'create.mode_type' },
  { id: 'phone', label: 'create.mode_phone' },
]

const ALIGN_LABELS: Record<LabelAlign, MessageKey> = {
  left: 'create.align_left',
  center: 'create.align_center',
  right: 'create.align_right',
}

export default function SignatureStudio() {
  const t = useT()
  const storedMode = useSigStore((s) => s.mode)
  const setMode = useSigStore((s) => s.setMode)
  // "Sign on phone" hands the drawing to a phone by QR code. On a phone you are
  // already holding the thing you would sign on — the Draw pad takes a finger —
  // so the tab only confused people there and is not shown, and a saved
  // "phone" default opens on Draw instead. A tablet keeps it (James,
  // 2026-10-09): from an iPad, signing on the phone in your pocket is a real
  // choice. It used to go on every touch screen, iPads included.
  const phone = useTouchPhone()
  const modes = phone ? MODES.filter((m) => m.id !== 'phone') : MODES
  const mode: StudioMode = phone && storedMode === 'phone' ? 'draw' : storedMode
  // Double-tap a mode to have the studio open on it (James, 2026-09-30) — Type
  // for somebody who never draws, say. The store read the same default at
  // start-up; Tune this app has the same choice.
  const dv = useDefaultView<StudioMode>('mode', 'draw', { views: STUDIO_MODES })

  // Name/date extras.
  const drawnDataUrl = useSigStore((s) => s.drawnDataUrl)
  const typedDataUrl = useSigStore((s) => s.typedDataUrl)
  const signerName = useSigStore((s) => s.signerName)
  const includeName = useSigStore((s) => s.includeName)
  const includeDate = useSigStore((s) => s.includeDate)
  const includeTime = useSigStore((s) => s.includeTime)
  const labelAlign = useSigStore((s) => s.labelAlign)
  const composedDataUrl = useSigStore((s) => s.composedDataUrl)
  const setSignerName = useSigStore((s) => s.setSignerName)
  const setIncludeName = useSigStore((s) => s.setIncludeName)
  const setIncludeDate = useSigStore((s) => s.setIncludeDate)
  const setIncludeTime = useSigStore((s) => s.setIncludeTime)
  const setLabelAlign = useSigStore((s) => s.setLabelAlign)
  const setComposed = useSigStore((s) => s.setComposed)
  const { main } = useMainSignature()

  // "Send to be signed" needs no signature of your own, so in that mode this
  // whole column folds to its title and the send flow leads (James,
  // 2026-10-09). It still opens on a tap — to make one to keep, say. Folds
  // again every time send mode is chosen. Hidden with a class rather than
  // unmounted, so a signature drawn before the switch is still there after.
  const applyMode = useSigStore((s) => s.applyMode)
  const [openInSend, setOpenInSend] = useState(false)
  useEffect(() => { if (applyMode === 'send') setOpenInSend(false) }, [applyMode])
  const sending = applyMode === 'send'
  const folded = sending && !openInSend
  const bodyId = useId()

  const base = mode === 'type' ? typedDataUrl : drawnDataUrl
  const hasLabels = (includeName && signerName.trim().length > 0) || includeDate || includeTime

  // Recompose the base signature with the name/date/time labels whenever any
  // input changes, so currentImage() (used by save + sign) reflects the choice.
  useEffect(() => {
    let cancelled = false
    const labels: { text: string; scale: number }[] = []
    if (includeName && signerName.trim()) labels.push({ text: signerName.trim(), scale: 1 })
    if (includeDate && includeTime) labels.push({ text: `${formatSigningDate()} · ${formatSigningTime()}`, scale: 0.8 })
    else if (includeDate) labels.push({ text: formatSigningDate(), scale: 0.8 })
    else if (includeTime) labels.push({ text: formatSigningTime(), scale: 0.8 })
    if (!base || labels.length === 0) { setComposed(null); return }
    composeSignatureWithLabels(base, labels, { align: labelAlign }).then((url) => { if (!cancelled) setComposed(url) })
    return () => { cancelled = true }
    // t.lang: the stamped date and time are written in the active language.
  }, [base, includeName, includeDate, includeTime, labelAlign, signerName, setComposed, t.lang])

  return (
    <div className={`${CONTAINER} py-6`}>

      {/* What this page is for and what to do first, before the two cards —
          a stranger otherwise lands on "Create your signature" and "Sign a
          PDF" side by side with nothing saying which comes first. */}
      <div className="mb-5">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">{t('create.page_headline')}</h1>
        <p className="mt-1.5 max-w-3xl text-sm sm:text-base text-slate-600">{t('create.page_lead')}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left column: create your signature, then save it */}
        {/* flex + gap, not space-y: space-y puts its margin on every child but the
            LAST, and the last is the SaveTabs wrapper, hidden while folded, so
            the folded card kept a 24px margin under it for nothing. */}
        <div className="flex flex-col gap-6">
        <section className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-bold text-slate-900">
              {sending ? (
                // `aria-expanded` + `aria-controls`: the SDK's reveal-on-expand
                // brings the opened column into view by itself.
                <button
                  type="button"
                  onClick={() => setOpenInSend((o) => !o)}
                  aria-expanded={!folded}
                  aria-controls={bodyId}
                  className="inline-flex items-center gap-1.5 text-left hover:text-orange-700"
                >
                  {t('create.studio_title')}
                  <svg viewBox="0 0 24 24" className={`h-4 w-4 shrink-0 text-slate-500 transition-transform ${folded ? '' : 'rotate-180'}`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>
              ) : t('create.studio_title')}
            </h2>
            <div className={`${folded ? 'hidden' : 'inline-flex'} rounded-md bg-slate-100 p-0.5`}>
              {modes.map((m) => {
                const label = t(m.label)
                const dvProps = dv.buttonProps(m.id, label)
                // The mode it opens on is orange: filled while you are on it,
                // outlined while you are not — Jukebox's library tabs.
                const isDefault = dvProps['data-default-view'] === 'true'
                return (
                  <button
                    key={m.id}
                    type="button"
                    aria-pressed={mode === m.id}
                    {...dvProps}
                    onClick={() => { dv.tap(m.id); setMode(m.id) }}
                    className={`rounded px-3 py-1 text-xs font-semibold ${
                      mode === m.id
                        ? isDefault
                          ? 'bg-gradient-to-br from-[#FE8C01] to-[#E05504] text-white shadow-sm'
                          : 'bg-white text-slate-900 shadow-sm'
                        : isDefault
                          ? 'text-orange-700 ring-1 ring-inset ring-orange-400/70'
                          : 'text-slate-500'
                    }`}
                  >
                    {label}
                  </button>
                )
              })}
            </div>
          </div>
          {folded && <p className="mt-1 text-xs text-slate-500">{t('create.studio_folded_hint')}</p>}
          <div id={bodyId} className={folded ? 'hidden' : undefined}>
          <div className="mt-4">
            {main && <MainSignatureBar main={main} />}
            {mode === 'type' ? <TypeSignature /> : mode === 'phone' ? <PhoneSignPanel /> : <SignaturePad />}
          </div>

          {/* Optional name / date / time stamped beneath the signature. */}
          <div className="mt-4 space-y-2 border-t border-slate-100 pt-3">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{t('create.labels_heading')}</div>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" checked={includeName} onChange={(e) => setIncludeName(e.target.checked)} className="h-4 w-4 accent-orange-600" />
              {t('create.labels_add_name')}
            </label>
            {includeName && (
              <input
                value={signerName}
                onChange={(e) => setSignerName(e.target.value)}
                placeholder={t('create.labels_name_placeholder')}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none"
              />
            )}
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" checked={includeDate} onChange={(e) => setIncludeDate(e.target.checked)} className="h-4 w-4 accent-orange-600" />
              <span>{t.rich('create.labels_add_date', { date: <span className="text-slate-400">({formatSigningDate()})</span> })}</span>
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" checked={includeTime} onChange={(e) => setIncludeTime(e.target.checked)} className="h-4 w-4 accent-orange-600" />
              <span>{t.rich('create.labels_add_time', { time: <span className="text-slate-400">({formatSigningTime()})</span> })}</span>
            </label>
            {hasLabels && (
              <div className="flex items-center gap-2 pt-0.5">
                <span className="text-[11px] font-medium text-slate-500">{t('create.labels_align')}</span>
                <div className="inline-flex rounded-md bg-slate-100 p-0.5">
                  {(['left', 'center', 'right'] as LabelAlign[]).map((a) => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => setLabelAlign(a)}
                      aria-pressed={labelAlign === a}
                      className={`rounded px-2.5 py-1 text-xs font-semibold ${labelAlign === a ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
                    >
                      {t(ALIGN_LABELS[a])}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {/* Live preview of exactly what gets stamped — the same composed
                image used for saving and signing. */}
            {hasLabels && (
              <div className="pt-1">
                <div className="mb-1 text-[11px] font-medium text-slate-500">{t('create.labels_preview')}</div>
                <div className="flex min-h-[76px] items-center justify-center rounded-md border border-dashed border-slate-300 bg-slate-50 p-3">
                  {composedDataUrl ? (
                    <img
                      src={composedDataUrl}
                      alt={t('create.labels_preview_alt')}
                      className="max-h-24 max-w-full object-contain"
                    />
                  ) : (
                    <span className="text-center text-[11px] text-slate-400">
                      {base ? t('create.labels_preview_building') : t('create.labels_preview_empty')}
                    </span>
                  )}
                </div>
              </div>
            )}
            {hasLabels && (
              <p className="text-[11px] text-slate-400">
                {t('create.labels_note')}
              </p>
            )}
          </div>
          </div>
        </section>

          <div className={folded ? 'hidden' : undefined}>
            <SaveTabs />
          </div>
        </div>

        {/* Right column: sign a PDF */}
        <div className="space-y-6">
          <ApplyToPdf />

          {/* Under the box in the right column — the suite's placement (James,
              2026-08-28). It sat above both columns until then.

              ⚠️ `except` names BOTH network paths. Cloud save is the one people
              expect; "Sign on your phone" relays the drawing over a Supabase
              realtime channel, which is just as much a departure from this
              device and far less obvious from the button. Leaving it out would
              have made the sentence false for the feature most likely to be
              used by someone who read the sentence and trusted it. */}
          <PrivacyNote
            repo="https://github.com/universal-simulation-ltd/Universal_Signatures"
            proof="https://github.com/universal-simulation-ltd/Universal_Signatures/blob/main/PRIVACY.md"
            subject={{ en: en.create.privacy_subject, [t.lang]: t('create.privacy_subject') } as LocalizedSubject}
            except={{ en: en.create.privacy_except, [t.lang]: t('create.privacy_except') } as LocalizedText}
          />
        </div>
      </div>
    </div>
  )
}
