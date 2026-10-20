import { useEffect, useId, useRef, useState } from 'react'
import { Chip, TRANSFER_ACCEPT, transferErrorText, useFileDrop, type TransferErrorReason } from '@unisim/sdk'
import { useSigStore } from '../../stores/sigStore'
import {
  loadLocalSignatures,
  saveLocalSignature,
  removeLocalSignature,
  renameLocalSignature,
  importLocalSignatures,
  MAX_LOCAL_SIGNATURES,
  type LocalSignature,
} from '../../lib/localSignatures'
import { packSavedSignatures, readSavedSignatures } from '../../lib/signatureFile'
import { useT } from '../../i18n'

// Free, no-account "Save on this device": keep a few signatures in this
// browser and reuse them later. "Save to a file" / "Open a file" carry them to
// another browser or device (the suite transfer file, lib/signatureFile.ts).
// That replaced saving a signature to the cloud with a Universal ID
// (2026-10-20, Docs_UNI_SIM/login-free-plan.md): no sign-in anywhere here.
export default function LocalSavePanel({ bare = false }: { bare?: boolean }) {
  const t = useT()
  const mode = useSigStore((s) => s.mode)
  const fontId = useSigStore((s) => s.fontId)
  const signerName = useSigStore((s) => s.signerName)
  const currentImage = useSigStore((s) => s.currentImage())
  const baseImage = useSigStore((s) => s.baseImage())
  const setMode = useSigStore((s) => s.setMode)
  const setDrawn = useSigStore((s) => s.setDrawn)
  const setTyped = useSigStore((s) => s.setTyped)
  const setFontId = useSigStore((s) => s.setFontId)
  const setSignerName = useSigStore((s) => s.setSignerName)

  const [saved, setSaved] = useState<LocalSignature[]>([])
  const [justSaved, setJustSaved] = useState(false)
  const [saveName, setSaveName] = useState('')
  const [renamingId, setRenamingId] = useState<string | null>(null)
  const [renameDraft, setRenameDraft] = useState('')
  const didInit = useRef(false)

  useEffect(() => {
    const list = loadLocalSignatures()
    setSaved(list)
    // Default the most recently saved signature to "in use" — but only once,
    // and only if the user hasn't already started a signature this session.
    if (!didInit.current) {
      didInit.current = true
      if (list.length > 0 && !useSigStore.getState().baseImage()) {
        onUse(list[0])
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Which saved entry (if any) is currently loaded as the active signature.
  const inUseId = baseImage ? saved.find((s) => s.imageDataUrl === baseImage)?.id ?? null : null

  function onSave() {
    if (!currentImage) return
    setSaved(
      saveLocalSignature({
        signerName,
        label: saveName,
        style: mode === 'type' ? 'type' : 'draw',
        font: mode === 'type' ? fontId : null,
        imageDataUrl: currentImage,
      }),
    )
    setSaveName('')
    setJustSaved(true)
    window.setTimeout(() => setJustSaved(false), 1800)
  }

  function startRename(sig: LocalSignature) {
    setRenamingId(sig.id)
    setRenameDraft(sig.label ?? sig.signerName ?? '')
  }
  function cancelRename() { setRenamingId(null); setRenameDraft('') }
  function saveRename(id: string) {
    // Guard against Enter + the ensuing blur both firing (the second would run
    // after renamingId is cleared, with an empty draft, wiping the name).
    if (renamingId !== id) return
    setSaved(renameLocalSignature(id, renameDraft))
    cancelRename()
  }

  // Display name for a saved entry: its label, else the signer name, else a
  // style default.
  function displayName(sig: LocalSignature): string {
    return sig.label || sig.signerName || (sig.style === 'type' ? t('save.typed_signature') : t('save.drawn_signature'))
  }

  function onUse(sig: LocalSignature) {
    setSignerName(sig.signerName ?? '')
    if (sig.style === 'type') {
      setFontId(sig.font ?? fontId)
      setMode('type')
      setTyped(sig.imageDataUrl)
    } else {
      setMode('draw')
      setDrawn(sig.imageDataUrl)
    }
  }

  function onRemove(id: string) {
    setSaved(removeLocalSignature(id))
  }

  const content = (
    <>
      {!bare && (
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold text-slate-900">{t('save.local_title')}</h2>
          <Chip size="sm">{t('save.local_no_account')}</Chip>
        </div>
      )}
      <p className={`text-xs text-slate-500 ${bare ? '' : 'mt-1'}`}>
        {t('save.local_intro')}
      </p>

      <div className="mt-4 space-y-2">
        <input
          value={saveName}
          onChange={(e) => setSaveName(e.target.value)}
          placeholder={t('save.local_name_placeholder')}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none"
        />
        <button
          onClick={onSave}
          disabled={!currentImage}
          className="w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-black disabled:opacity-50"
        >
          {justSaved ? t('save.local_saved') : !currentImage ? t('save.create_first') : t('save.local_save')}
        </button>
      </div>

      {saved.length > 0 && (
        <ul className="mt-4 space-y-2">
          {saved.map((sig) => (
            <li
              key={sig.id}
              className={`flex items-center gap-3 rounded-lg border p-2 ${sig.id === inUseId ? 'border-orange-300 bg-orange-50/60 ring-1 ring-orange-200' : 'border-slate-200 bg-slate-50'}`}
            >
              <span className="flex h-12 w-24 shrink-0 items-center justify-center overflow-hidden rounded bg-white ring-1 ring-slate-200">
                <img src={sig.imageDataUrl} alt={t('save.local_saved_alt')} className="max-h-11 max-w-[5.5rem] object-contain" />
              </span>
              <span className="min-w-0 flex-1">
                {renamingId === sig.id ? (
                  <input
                    autoFocus
                    value={renameDraft}
                    onChange={(e) => setRenameDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveRename(sig.id)
                      else if (e.key === 'Escape') cancelRename()
                    }}
                    onBlur={() => saveRename(sig.id)}
                    placeholder={t('save.local_rename_placeholder')}
                    className="w-full rounded-md border border-slate-300 px-2 py-1 text-xs focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                ) : (
                  <button
                    onClick={() => startRename(sig)}
                    className="block max-w-full truncate text-left text-xs font-medium text-slate-700 hover:text-orange-700"
                    title={t('save.local_rename')}
                  >
                    {displayName(sig)}
                  </button>
                )}
                <span className="text-[10px] uppercase tracking-wide text-slate-400">{sig.style === 'type' ? t('save.style_type') : t('save.style_draw')}</span>
              </span>
              {sig.id === inUseId ? (
                <span className="shrink-0 rounded-md bg-orange-100 px-3 py-1.5 text-xs font-semibold text-orange-700">
                  {t('save.local_in_use')}
                </span>
              ) : (
                <button
                  onClick={() => onUse(sig)}
                  className="shrink-0 rounded-md bg-orange-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-orange-800"
                >
                  {t('save.local_use')}
                </button>
              )}
              <button
                onClick={() => onRemove(sig.id)}
                aria-label={t('save.local_remove_aria')}
                className="shrink-0 rounded-md px-2 py-1.5 text-xs font-medium text-slate-400 hover:text-rose-600"
              >
                {t('save.remove')}
              </button>
            </li>
          ))}
        </ul>
      )}

      <SignatureFile saved={saved} onImported={setSaved} />
    </>
  )

  if (bare) return content
  return <div className="rounded-xl border border-slate-200 bg-white p-5">{content}</div>
}

// Save to a file / Open a file, with an optional password. A signature is
// personal, so the password is offered, but empty by default.
function SignatureFile({ saved, onImported }: { saved: LocalSignature[]; onImported: (list: LocalSignature[]) => void }) {
  const t = useT()
  const passwordId = useId()
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState<'save' | 'open' | null>(null)
  // `seq` numbers each answer, so a repeat of the same one still reads as new
  // (to a screen reader, and to e2e/signature-file.e2e.mjs).
  const [note, setNoteState] = useState<{ tone: 'ok' | 'error'; text: string; seq: number } | null>(null)
  const seq = useRef(0)
  const setNote = (n: { tone: 'ok' | 'error'; text: string } | null) => setNoteState(n && { ...n, seq: ++seq.current })
  // A file that needs (another try at) its password, kept so "Open it" can
  // re-read it once the password is typed.
  const [pending, setPending] = useState<File | null>(null)

  const drop = useFileDrop({
    onFiles: (files) => { if (files[0]) void open(files[0]) },
    accept: TRANSFER_ACCEPT,
    multiple: false,
    clickToBrowse: false,
    label: t('save.file_open'),
  })

  async function save() {
    if (saved.length === 0 || busy) return
    setBusy('save'); setNote(null)
    try {
      const packed = await packSavedSignatures(saved, password)
      const url = URL.createObjectURL(packed.blob)
      const a = document.createElement('a')
      a.href = url
      a.download = packed.fileName
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.setTimeout(() => URL.revokeObjectURL(url), 10_000)
      setNote({ tone: 'ok', text: t('save.file_saved', { name: packed.fileName }) })
    } catch {
      setNote({ tone: 'error', text: t('save.file_error_save') })
    } finally {
      setBusy(null)
    }
  }

  async function open(file: File) {
    if (busy) return
    setBusy('open'); setNote(null)
    try {
      const res = await readSavedSignatures(file, password)
      if (!res.ok) {
        const wantsPassword = res.reason === 'needs-password' || res.reason === 'wrong-password'
        setPending(wantsPassword ? file : null)
        setNote({ tone: 'error', text: errorText(res.reason) })
        return
      }
      setPending(null)
      if (res.signatures.length === 0) {
        setNote({ tone: 'error', text: t('save.file_none_usable') })
        return
      }
      const r = importLocalSignatures(res.signatures)
      onImported(r.list)
      const parts: string[] = []
      parts.push(r.added > 0 ? t.plural('save.file_added', r.added) : t('save.file_already_here'))
      if (r.didNotFit > 0) parts.push(t.plural('save.file_not_fit', r.didNotFit, { max: MAX_LOCAL_SIGNATURES }))
      if (res.skipped > 0) parts.push(t.plural('save.file_skipped', res.skipped))
      setNote({ tone: r.added > 0 ? 'ok' : 'error', text: parts.join(' ') })
    } catch {
      setNote({ tone: 'error', text: errorText('damaged') })
    } finally {
      setBusy(null)
    }
  }

  function errorText(reason: TransferErrorReason): string {
    return transferErrorText(reason, t.lang)
  }

  return (
    <div className="mt-5 border-t border-slate-100 pt-4" data-testid="signature-file" {...drop.dropzoneProps}>
      <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">{t('save.file_title')}</h3>
      <p className="mt-1 text-xs text-slate-500">{t('save.file_intro')}</p>

      <label htmlFor={passwordId} className="mt-3 block text-[11px] font-medium text-slate-600">{t('save.file_password_label')}</label>
      <input
        id={passwordId}
        type="password"
        autoComplete="new-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none"
      />
      <p className="mt-1 text-[11px] text-slate-400">{t('save.file_password_hint')}</p>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={save}
          disabled={saved.length === 0 || busy !== null}
          className="rounded-lg bg-white px-3.5 py-2 text-sm font-semibold text-slate-800 ring-1 ring-slate-300 hover:bg-slate-50 disabled:opacity-50"
        >
          {busy === 'save' ? t('save.saving') : saved.length === 0 ? t('save.file_nothing_to_save') : t('save.file_save')}
        </button>
        <button
          type="button"
          onClick={drop.open}
          disabled={busy !== null}
          className="rounded-lg bg-white px-3.5 py-2 text-sm font-semibold text-slate-800 ring-1 ring-slate-300 hover:bg-slate-50 disabled:opacity-50"
        >
          {busy === 'open' ? t('save.file_opening') : t('save.file_open')}
        </button>
        {pending && (
          <button
            type="button"
            onClick={() => void open(pending)}
            disabled={busy !== null || !password}
            className="rounded-lg bg-orange-700 px-3.5 py-2 text-sm font-semibold text-white hover:bg-orange-800 disabled:opacity-50"
          >
            {t('save.file_try_again')}
          </button>
        )}
        <input {...drop.inputProps} className="hidden" data-testid="signature-file-input" />
      </div>
      {note && (
        <p key={note.seq} data-note={note.seq} role={note.tone === 'error' ? 'alert' : 'status'} className={`mt-2 text-sm ${note.tone === 'ok' ? 'text-emerald-700' : 'text-rose-700'}`}>
          {note.text}
        </p>
      )}
    </div>
  )
}
