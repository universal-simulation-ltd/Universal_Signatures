import { useState } from 'react'
import { Chip, useUniversal, useUser } from '@unisim/sdk'
import { useSigStore } from '../../stores/sigStore'
import {
  useCloudGate,
  useStoredSignatures,
  saveSignature,
  holdSignatureToken,
  removeStoredSignature,
  saveMainSignature,
  useMainSignature,
  type StoredSignature,
} from '../../lib/cloud'
import { useFreeAllowance } from '../../lib/useFreeAllowance'

const REPO_URL = 'https://github.com/universal-simulation-ltd/Universal_Signatures'
const SELFHOST_DOCS = 'https://github.com/universal-simulation-ltd/Universal_Signatures#self-hosting'
const SIGNUP_URL = 'https://app.unisim.co.uk/login'
const NEED_MORE_URL = 'https://www.unisim.co.uk/support'
const SET_UP_COMPANY_URL = 'https://app.unisim.co.uk/branding'

export default function CloudSavePanel({ bare = false }: { bare?: boolean }) {
  const { supabase, activeOrgId, session } = useUniversal()
  const { user } = useUser()
  const gate = useCloudGate()
  const signedIn = !!session?.user && session.user.is_anonymous !== true
  const stored = useStoredSignatures(activeOrgId, signedIn)
  const { status: allowance, refresh: refreshAllowance } = useFreeAllowance('signatures')
  const mode = useSigStore((s) => s.mode)
  const fontId = useSigStore((s) => s.fontId)
  const signerName = useSigStore((s) => s.signerName)
  const currentImage = useSigStore((s) => s.currentImage())

  const [busy, setBusy] = useState(false)
  const [certId, setCertId] = useState<string | null>(null)
  const [heldByToken, setHeldByToken] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [removingCert, setRemovingCert] = useState<string | null>(null)
  const [listError, setListError] = useState<string | null>(null)

  // After anything that changes what is stored: the list, the usage numbers
  // and the gate (a blocked panel turns entitled again once there is room).
  function refreshAll() {
    stored.refresh()
    refreshAllowance()
    gate.refresh()
  }

  const myUserId = user?.id ?? null
  const myRows = stored.rows.filter((r) => r.user_id === myUserId)

  // Free-allowance numbers, straight from free_allowance_status (0199) — never
  // hardcoded, as the limits are set to change.
  const freeLimit = allowance && !allowance.unlimited && allowance.limit ? allowance.limit : null
  const nearFreeLimit =
    !!allowance && freeLimit !== null && allowance.has_room && allowance.used / freeLimit >= 0.8

  const via = gate.state === 'entitled' ? gate.via : null

  const verifyUrl = certId
    ? `${location.origin}${import.meta.env.BASE_URL}verify/${certId}`
    : null

  async function onSave() {
    if (!currentImage) { setError('Create a signature first.'); return }
    setBusy(true); setError(null)
    const res = await saveSignature(supabase, activeOrgId, user?.id ?? null, {
      signerName,
      style: mode === 'type' ? 'type' : 'draw',
      font: mode === 'type' ? fontId : null,
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
        setError(held.error ?? 'Could not store your signature.')
        return
      }
      setHeldByToken(true)
    }
    setBusy(false)
    setCertId(res.certId)
    refreshAll()
  }

  async function onRemove() {
    if (!certId) return
    setBusy(true); setError(null)
    const res = await removeStoredSignature(supabase, certId)
    setBusy(false)
    if (!res.ok) { setError(res.error ?? 'Could not remove.'); return }
    setCertId(null)
    setHeldByToken(false)
    refreshAll()
  }

  // Remove one from "Your stored signatures" — the same delete + token release
  // as above, for a signature saved in any session.
  async function onRemoveStored(row: StoredSignature) {
    if (removingCert) return
    setRemovingCert(row.cert_id); setListError(null)
    const res = await removeStoredSignature(supabase, row.cert_id)
    setRemovingCert(null)
    if (!res.ok) { setListError(res.error ?? 'Could not remove.'); return }
    if (row.cert_id === certId) { setCertId(null); setHeldByToken(false) }
    refreshAll()
  }

  const content = (
    <>
      {!bare && (
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold text-slate-900">Save a verified signature to the cloud</h2>
          <Chip size="sm">Universal ID</Chip>
        </div>
      )}
      <p className={`text-xs text-slate-500 ${bare ? '' : 'mt-1'}`}>
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
              Create a <strong>Universal ID</strong> to store your signature online for FREE.
            </p>
            <a href={SIGNUP_URL} className="mt-3 inline-flex rounded-lg bg-orange-700 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-800">
              Create / sign in with Universal ID →
            </a>
          </div>
        )}

        {gate.state === 'no_company' && (
          <div className="space-y-3">
            <MainSignatureSave primary />
            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-sm text-slate-700">
                To store more signatures, with a certificate for each, set up a company on your <strong>Universal ID</strong> (it’s free).
              </p>
              <a href={SET_UP_COMPANY_URL} className="mt-3 inline-flex rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-800 ring-1 ring-slate-300 hover:bg-slate-100">
                Set up a company →
              </a>
            </div>
          </div>
        )}

        {(gate.state === 'entitled' || gate.state === 'blocked') && (
          <div className="mb-3">
            <MainSignatureSave />
          </div>
        )}

        {gate.state === 'entitled' && !certId && (
          <div>
            <button
              type="button"
              onClick={onSave}
              disabled={busy || !currentImage}
              className="w-full rounded-lg bg-orange-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-800 disabled:opacity-50"
            >
              {busy ? 'Saving…' : !currentImage ? 'Create a signature first' : 'Save verified signature ☁'}
            </button>
            <p className="mt-2 text-[11px] text-slate-400">
              {gate.via === 'token'
                ? 'Stored against your Universal ID — remove it any time.'
                : `Cloud hosting included via your ${gate.via === 'subscription' ? 'subscription' : 'active project'}.`}
            </p>
            {gate.via === 'token' && nearFreeLimit && allowance && (
              <p className="mt-1 text-[11px] text-slate-500" data-testid="free-allowance-usage">
                You’ve used {allowance.used} of your {freeLimit} free stored signatures.
              </p>
            )}
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
                  You can remove this stored signature at any time.
                </p>
                <button
                  type="button"
                  onClick={onRemove}
                  disabled={busy}
                  className="mt-2 rounded-md bg-white px-3 py-1.5 text-xs font-semibold text-rose-700 ring-1 ring-rose-200 hover:bg-rose-50 disabled:opacity-50"
                >
                  {busy ? 'Removing…' : 'Remove stored signature'}
                </button>
              </div>
            )}
          </div>
        )}

        {gate.state === 'blocked' && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
            {/* Only reached once the free allowance is used (useCloudGate counts
                the app's free token), so this is where the limit is mentioned. */}
            <p className="text-sm text-amber-800">
              {freeLimit !== null
                ? myRows.length > 0
                  ? `You’ve used all ${freeLimit} of your free stored signatures. Remove one below to make room, or self-host your own copy for free.`
                  : `You’ve used all ${freeLimit} of your free stored signatures. You can self-host your own copy for free.`
                : 'You’ve used your free signature storage. You can self-host your own copy for free.'}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <a href={SELFHOST_DOCS} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-2 text-sm font-semibold text-white hover:bg-black">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true"><path d="M12 .5C5.65.5.5 5.65.5 12.02c0 5.09 3.29 9.4 7.86 10.92.57.1.78-.25.78-.55 0-.27-.01-1-.02-1.96-3.2.69-3.87-1.54-3.87-1.54-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.7 1.25 3.36.95.1-.74.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.8 1.18 1.82 1.18 3.08 0 4.42-2.69 5.39-5.26 5.68.41.35.77 1.05.77 2.12 0 1.53-.01 2.76-.01 3.14 0 .3.21.66.79.55 4.57-1.52 7.86-5.83 7.86-10.92C23.5 5.65 18.35.5 12 .5z" /></svg>
                Self-host for free
              </a>
            </div>
            {/* Nothing is for sale for the everyday apps (2026-10-03). One quiet
                link asks people who need more to tell us — that is the signal
                for when a paid tier is worth building. */}
            <a href={NEED_MORE_URL} target="_blank" rel="noreferrer" className="mt-2 inline-block text-xs text-amber-800 underline underline-offset-2 hover:text-amber-950">
              Need more? Tell us
            </a>
            <p className="mt-2 text-[11px] text-amber-700">Source: <a href={REPO_URL} target="_blank" rel="noreferrer" className="underline">{REPO_URL.replace('https://', '')}</a></p>
          </div>
        )}

        {signedIn && gate.state !== 'loading' && (
          <StoredSignatureList
            rows={stored.rows}
            loading={stored.loading}
            error={listError ?? stored.error}
            myUserId={myUserId}
            removingCert={removingCert}
            onRemove={onRemoveStored}
          />
        )}
      </div>
    </>
  )

  if (bare) return content
  return <div className="rounded-xl border border-slate-200 bg-white p-5">{content}</div>
}

// "Your stored signatures" — every signature kept online for this workspace,
// newest first. Styled like the on-device list in LocalSavePanel. Only your
// own rows can be removed (RLS: owner delete); a colleague's is shown as such.
function StoredSignatureList({
  rows,
  loading,
  error,
  myUserId,
  removingCert,
  onRemove,
}: {
  rows: StoredSignature[]
  loading: boolean
  error: string | null
  myUserId: string | null
  removingCert: string | null
  onRemove: (row: StoredSignature) => void
}) {
  return (
    <div className="mt-5 border-t border-slate-100 pt-4" data-testid="stored-signatures">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Your stored signatures</h3>
      {loading && rows.length === 0 ? (
        <p className="mt-2 text-xs text-slate-400">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="mt-2 text-xs text-slate-400">None stored online yet.</p>
      ) : (
        <ul className="mt-2 space-y-2">
          {rows.map((row) => {
            const mine = row.user_id === myUserId
            return (
              <li key={row.id} className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-2">
                <span className="flex h-12 w-24 shrink-0 items-center justify-center overflow-hidden rounded bg-white ring-1 ring-slate-200">
                  <img src={row.image_data} alt="Stored signature" className="max-h-11 max-w-[5.5rem] object-contain" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-xs font-medium text-slate-700">
                    {row.signer_name || (row.style === 'type' ? 'Typed signature' : 'Drawn signature')}
                  </span>
                  <span className="block text-[10px] uppercase tracking-wide text-slate-400">
                    {row.style} · {new Date(row.created_at).toLocaleDateString()}
                    {!mine && ' · Saved by a colleague'}
                  </span>
                </span>
                {mine && (
                  <button
                    type="button"
                    onClick={() => onRemove(row)}
                    disabled={removingCert !== null}
                    aria-label="Remove stored signature"
                    className="shrink-0 rounded-md px-2 py-1.5 text-xs font-medium text-slate-400 hover:text-rose-600 disabled:opacity-50"
                  >
                    {removingCert === row.cert_id ? 'Removing…' : 'Remove'}
                  </button>
                )}
              </li>
            )
          })}
        </ul>
      )}
      {error && <p className="mt-2 text-sm text-rose-600">{error}</p>}
    </div>
  )
}

// Save the current signature as your MAIN signature (platform 0224): one per
// Universal ID, with or without a company, free (no allowance token), and the
// one the hub's Me page and Universal PDF pick up. Saving replaces the old
// one, so an existing main asks first.
function MainSignatureSave({ primary = false }: { primary?: boolean }) {
  const { supabase } = useUniversal()
  const { main, refresh } = useMainSignature()
  const mode = useSigStore((s) => s.mode)
  const fontId = useSigStore((s) => s.fontId)
  const signerName = useSigStore((s) => s.signerName)
  const currentImage = useSigStore((s) => s.currentImage())
  const [busy, setBusy] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isMain = !!main && !!currentImage && main.image_data === currentImage

  async function save() {
    if (!currentImage) return
    if (main && !confirming) { setConfirming(true); return }
    setBusy(true); setError(null)
    const res = await saveMainSignature(supabase, {
      signerName,
      style: mode === 'type' ? 'type' : 'draw',
      font: mode === 'type' ? fontId : null,
      imageDataUrl: currentImage,
    })
    setBusy(false)
    setConfirming(false)
    if (!res.ok) { setError(res.error ?? 'Could not save your main signature.'); return }
    setSaved(true)
    refresh()
  }

  const btn = primary
    ? 'w-full rounded-lg bg-orange-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-800 disabled:opacity-50'
    : 'w-full rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-800 ring-1 ring-slate-300 hover:bg-slate-50 disabled:opacity-50'

  return (
    <div data-testid="main-signature-save">
      {confirming ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
          <p className="text-sm text-amber-900">Your Universal ID keeps one main signature. Replace the one you have now?</p>
          <div className="mt-2 flex gap-2">
            <button type="button" onClick={save} disabled={busy} className="rounded-md bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-black disabled:opacity-50">
              {busy ? 'Saving…' : 'Replace it'}
            </button>
            <button type="button" onClick={() => setConfirming(false)} disabled={busy} className="rounded-md bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 ring-1 ring-slate-300">
              Keep the current one
            </button>
          </div>
        </div>
      ) : (
        <button type="button" onClick={save} disabled={busy || !currentImage || isMain} className={btn}>
          {busy ? 'Saving…' : !currentImage ? 'Create a signature first' : isMain ? 'This is your main signature ✓' : 'Save as my main signature'}
        </button>
      )}
      <p className="mt-1.5 text-[11px] text-slate-400">
        {saved
          ? 'Saved to your Universal ID — use it here, in Universal PDF and on any device.'
          : 'One per Universal ID, free, with or without a company. Use it here, in Universal PDF and on any device.'}
      </p>
      {error && <p className="mt-1 text-sm text-rose-600">{error}</p>}
    </div>
  )
}
