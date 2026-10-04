import { useEffect, useRef, useState } from 'react'
import { useUniversal } from '@unisim/sdk'
import { verifyAny } from '../../lib/cloud'
import { sha256Bytes } from '../../lib/signature'
import type { AnyVerifyResult } from '../../lib/types'

// Public certificate verification: anyone with a cert link (typically by
// scanning the QR on a signed PDF) can confirm the record is genuine, via a
// SECURITY DEFINER RPC — no auth needed.
export default function VerifyPage({ certId }: { certId: string }) {
  const { supabase } = useUniversal()
  const [result, setResult] = useState<AnyVerifyResult | null>(null)
  const [loading, setLoading] = useState(true)
  // The lookup itself failed (offline, service down) — not the same as "no
  // such certificate", and must not be reported as one.
  const [failed, setFailed] = useState(false)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setFailed(false)
    verifyAny(supabase, certId)
      .then((r) => { if (!cancelled) setResult(r) })
      .catch(() => { if (!cancelled) setFailed(true) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [supabase, certId, attempt])

  function fmt(iso: string) {
    try { return new Date(iso).toLocaleString('en-GB') } catch { return iso }
  }

  return (
    <div className="mx-auto w-full max-w-xl px-4 sm:px-6 py-10">
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h1 className="text-lg font-bold text-slate-900">Signature certificate</h1>
        <p className="mt-1 text-xs text-slate-500">Certificate <code>{certId}</code></p>

        {loading ? (
          <div className="mt-6 flex items-center gap-2 text-sm text-slate-500">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-orange-500" /> Verifying…
          </div>
        ) : result?.kind === 'signing' ? (
          <div className="mt-6">
            <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-3">
              <span className="text-lg" aria-hidden="true">✓</span>
              <span className="text-sm font-semibold text-emerald-800">Verified — this document was signed via Universal Signatures</span>
            </div>
            <dl className="mt-4 divide-y divide-slate-100 text-sm">
              <Row k="Signed by" v={result.data.signer_email} />
              <Row k="Organisation" v={result.data.org_name ?? '—'} />
              <Row k="Document" v={result.data.original_filename} />
              <Row k="Signed" v={fmt(result.data.created_at)} />
              <Row k="Original document hash (SHA-256)" v={result.data.document_hash} mono />
              {result.data.signed_hash && <Row k="Signed copy hash (SHA-256)" v={result.data.signed_hash} mono />}
            </dl>
            <p className="mt-4 text-xs text-slate-500">
              {result.data.signed_hash
                ? <>The first hash fingerprints the <strong>original</strong> document, before it was signed; the second, the <strong>signed copy</strong> exactly as it was produced.</>
                : <>The hash above fingerprints the <strong>original</strong> document, before the signature was added.</>}
            </p>
            <CheckPdf original={result.data.document_hash} signed={result.data.signed_hash} />
          </div>
        ) : result?.kind === 'signature' ? (
          <div className="mt-6">
            <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-3">
              <span className="text-lg" aria-hidden="true">✓</span>
              <span className="text-sm font-semibold text-emerald-800">Verified — this is a genuine saved signature</span>
            </div>
            <dl className="mt-4 divide-y divide-slate-100 text-sm">
              <Row k="Signer" v={result.data.signer_name ?? '—'} />
              <Row k="Organisation" v={result.data.org_name ?? '—'} />
              <Row k="Saved" v={fmt(result.data.created_at)} />
              <Row k="Signature hash (SHA-256)" v={result.data.signature_hash} mono />
            </dl>
          </div>
        ) : failed ? (
          <div role="alert" className="mt-6 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Couldn’t reach the verification service, so this certificate hasn’t been checked yet. Check your
            connection and try again.
            <button
              type="button"
              onClick={() => setAttempt((n) => n + 1)}
              className="mt-2 block rounded-md bg-white px-3 py-1.5 text-xs font-semibold text-amber-900 ring-1 ring-amber-200 hover:bg-amber-100"
            >
              Try again
            </button>
          </div>
        ) : (
          <div className="mt-6 rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700">
            ✗ No record found for this certificate. The link may be wrong, or the record was removed.
          </div>
        )}

        <a href={import.meta.env.BASE_URL} className="mt-6 inline-block text-sm font-medium text-orange-700 hover:underline">
          ← Universal Signatures
        </a>
      </div>
    </div>
  )
}

function Row({ k, v, mono = false }: { k: string; v: string; mono?: boolean }) {
  return (
    <div className="flex justify-between gap-4 py-2">
      <dt className="text-slate-500">{k}</dt>
      <dd className={`text-right text-slate-900 ${mono ? 'font-mono text-xs break-all' : ''}`}>{v}</dd>
    </div>
  )
}

// "Is this the document that was signed?" — hash a PDF in the browser and
// compare it with the record, which can hold two fingerprints: the ORIGINAL
// (before anything was stamped on) and, for records made since platform 0242,
// the SIGNED COPY as it was produced. Each match says which one it is — they
// prove different things — and a file that matches neither says so.
function CheckPdf({ original, signed }: { original: string; signed: string | null }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [state, setState] = useState<
    | { kind: 'idle' }
    | { kind: 'busy' }
    | { kind: 'done'; name: string; match: 'signed' | 'original' | 'none' }
    | { kind: 'error' }
  >({ kind: 'idle' })

  async function onPick(file: File | undefined) {
    if (!file) return
    setState({ kind: 'busy' })
    try {
      const hash = (await sha256Bytes(await file.arrayBuffer())).toLowerCase()
      const match = signed && hash === signed.toLowerCase() ? 'signed' : hash === original.toLowerCase() ? 'original' : 'none'
      setState({ kind: 'done', name: file.name, match })
    } catch {
      setState({ kind: 'error' })
    } finally {
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3">
      <p className="text-xs text-slate-600">
        {signed
          ? 'Have the signed copy, or the original? Check it against this record — it’s fingerprinted in your browser and never uploaded.'
          : 'Have the original PDF? Check it against this record — it’s fingerprinted in your browser and never uploaded.'}
      </p>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={state.kind === 'busy'}
        className="mt-2 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-orange-400 hover:bg-orange-50/40 disabled:opacity-60"
      >
        {state.kind === 'busy' ? 'Checking…' : 'Check a PDF'}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        className="hidden"
        onChange={(e) => void onPick(e.target.files?.[0])}
      />
      <div role="status" className="text-xs [&>p]:mt-2" data-testid="check-result">
        {state.kind === 'done' && state.match === 'signed' && (
          <p className="font-semibold text-emerald-700">
            ✓ {state.name} is the signed copy, byte for byte, exactly as it was produced. Nothing in it has changed since.
          </p>
        )}
        {state.kind === 'done' && state.match === 'original' && (
          <p className="font-semibold text-emerald-700">
            ✓ {state.name} is the original document this record was made for, as it was before it was signed.
          </p>
        )}
        {state.kind === 'done' && state.match === 'none' && (
          <p className="text-rose-700">
            {signed
              ? <>✗ {state.name} is neither the signed copy nor the original. If it’s meant to be the signed copy, it has been changed since it was signed — even re-saving or printing it to PDF counts.</>
              : <>✗ {state.name} doesn’t match this record. A signed copy won’t match either — the record fingerprints the
                original before the signature went on — so check the unsigned original.</>}
          </p>
        )}
        {state.kind === 'error' && <p className="text-rose-700">Couldn’t read that file.</p>}
      </div>
    </div>
  )
}
