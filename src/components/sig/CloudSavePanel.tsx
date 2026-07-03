import { useState } from 'react'
import { useUniversal, useUser } from '@unisim/sdk'
import { useSigStore } from '../../stores/sigStore'
import { useCloudGate, saveSignature, holdSignatureToken, removeStoredSignature } from '../../lib/cloud'
import { fontById } from '../../lib/fonts'

const REPO_URL = 'https://github.com/universal-simulation-ltd/Universal_Signatures'
const SELFHOST_DOCS = 'https://github.com/universal-simulation-ltd/Universal_Signatures#self-hosting'
const SIGNUP_URL = 'https://app.unisim.co.uk/login'
const BILLING_URL = 'https://app.unisim.co.uk/billing'

export default function CloudSavePanel() {
  const { supabase, activeOrgId } = useUniversal()
  const { user } = useUser()
  const gate = useCloudGate()
  const mode = useSigStore((s) => s.mode)
  const fontId = useSigStore((s) => s.fontId)
  const signerName = useSigStore((s) => s.signerName)
  const currentImage = useSigStore((s) => s.currentImage())

  const [busy, setBusy] = useState(false)
  const [certId, setCertId] = useState<string | null>(null)
  const [heldByToken, setHeldByToken] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const via = gate.state === 'entitled' ? gate.via : null

  const verifyUrl = certId
    ? `${location.origin}${import.meta.env.BASE_URL}verify/${certId}`
    : null

  async function onSave() {
    if (!currentImage) { setError('Create a signature first.'); return }
    setBusy(true); setError(null)
    const res = await saveSignature(supabase, activeOrgId, user?.id ?? null, {
      signerName,
      style: mode,
      font: mode === 'type' ? fontById(fontId).id : null,
      imageDataUrl: currentImage,
    })
    if (!res.ok || !res.certId) { setBusy(false); setError(res.error ?? 'Could not save.'); return }

    // On a free account, storing the signature uses the one complimentary token
    // (cross-app: Date Polling etc. will see it as in use). Paid / project
    // accounts store it without touching the token.
    if (via === 'token') {
      const held = await holdSignatureToken(supabase, res.certId)
      if (!held.ok) {
        // Couldn't reserve the token — roll the just-saved signature back.
        await removeStoredSignature(supabase, res.certId)
        setBusy(false)
        setError(held.error ?? 'Could not reserve your token.')
        return
      }
      setHeldByToken(true)
    }
    setBusy(false)
    setCertId(res.certId)
  }

  async function onRemove() {
    if (!certId) return
    setBusy(true); setError(null)
    const res = await removeStoredSignature(supabase, certId)
    setBusy(false)
    if (!res.ok) { setError(res.error ?? 'Could not remove.'); return }
    setCertId(null)
    setHeldByToken(false)
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-center gap-2">
        <h2 className="text-sm font-bold text-slate-900">Save a verified signature to the cloud</h2>
        <span className="rounded-full bg-orange-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-orange-700">Universal ID</span>
      </div>
      <p className="mt-1 text-xs text-slate-500">
        Store your signature against your Universal ID with a tamper-evident certificate, so you can reuse and verify it anywhere.
      </p>

      <div className="mt-4">
        {gate.state === 'loading' && (
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-orange-500" /> Checking your account…
          </div>
        )}

        {gate.state === 'signed_out' && (
          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-sm text-slate-700">
              Create a free <strong>Universal ID</strong> (or sign in) to save a verified signature to the cloud.
            </p>
            <a href={SIGNUP_URL} className="mt-3 inline-flex rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700">
              Create / sign in with Universal ID →
            </a>
          </div>
        )}

        {gate.state === 'entitled' && !certId && (
          <div>
            <button
              type="button"
              onClick={onSave}
              disabled={busy || !currentImage}
              className="w-full rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-700 disabled:opacity-50"
            >
              {busy ? 'Saving…' : !currentImage ? 'Create a signature first' : 'Save verified signature ☁'}
            </button>
            <p className="mt-2 text-[11px] text-slate-400">
              {gate.via === 'token'
                ? 'Uses your free Signatures token while stored — remove the signature anytime to get it back.'
                : `Cloud hosting included via your ${gate.via === 'subscription' ? 'subscription' : 'active project'}.`}
            </p>
            {error && <p className="mt-2 text-sm text-rose-600">{error}</p>}
          </div>
        )}

        {certId && verifyUrl && (
          <div className="rounded-lg bg-emerald-50 p-4">
            <p className="text-sm font-semibold text-emerald-800">✓ Saved &amp; verified</p>
            <p className="mt-1 text-xs text-emerald-700">Anyone can confirm this signature with its certificate link:</p>
            <div className="mt-2 flex items-center gap-2">
              <input readOnly value={verifyUrl} className="flex-1 rounded-md border border-emerald-200 bg-white px-2 py-1.5 text-xs text-slate-700" />
              <button
                type="button"
                onClick={() => navigator.clipboard?.writeText(verifyUrl)}
                className="shrink-0 rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
              >
                Copy
              </button>
            </div>
            {heldByToken && (
              <div className="mt-3 border-t border-emerald-200 pt-3">
                <p className="text-[11px] text-emerald-700">
                  This signature is using your free Signatures token. Remove it to get the token straight back.
                </p>
                <button
                  type="button"
                  onClick={onRemove}
                  disabled={busy}
                  className="mt-2 rounded-md bg-white px-3 py-1.5 text-xs font-semibold text-rose-700 ring-1 ring-rose-200 hover:bg-rose-50 disabled:opacity-50"
                >
                  {busy ? 'Removing…' : 'Remove stored signature & free token'}
                </button>
              </div>
            )}
          </div>
        )}

        {gate.state === 'blocked' && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
            <ul className="list-disc space-y-1 pl-5 text-sm text-amber-800">
              <li>Free accounts expire after 30 days</li>
              <li>Self-host yours for free</li>
              <li>Paid accounts don't expire and can be used cross-products</li>
            </ul>
            <div className="mt-3 flex flex-wrap gap-2">
              <a href={SELFHOST_DOCS} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-2 text-sm font-semibold text-white hover:bg-black">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true"><path d="M12 .5C5.65.5.5 5.65.5 12.02c0 5.09 3.29 9.4 7.86 10.92.57.1.78-.25.78-.55 0-.27-.01-1-.02-1.96-3.2.69-3.87-1.54-3.87-1.54-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.7 1.25 3.36.95.1-.74.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.8 1.18 1.82 1.18 3.08 0 4.42-2.69 5.39-5.26 5.68.41.35.77 1.05.77 2.12 0 1.53-.01 2.76-.01 3.14 0 .3.21.66.79.55 4.57-1.52 7.86-5.83 7.86-10.92C23.5 5.65 18.35.5 12 .5z" /></svg>
                Self-host for free
              </a>
              <a href={BILLING_URL} className="inline-flex items-center rounded-lg bg-white px-3.5 py-2 text-sm font-semibold text-amber-900 ring-1 ring-amber-300 hover:bg-amber-100">
                Sign up here →
              </a>
            </div>
            <p className="mt-2 text-[11px] text-amber-700">Source: <a href={REPO_URL} target="_blank" rel="noreferrer" className="underline">{REPO_URL.replace('https://', '')}</a></p>
          </div>
        )}
      </div>
    </div>
  )
}
