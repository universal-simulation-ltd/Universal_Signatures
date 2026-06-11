import { useEffect, useState } from 'react'
import { useUniversal } from '@unisim/sdk'
import { verifyAny } from '../../lib/cloud'
import type { AnyVerifyResult } from '../../lib/types'

// Public certificate verification: anyone with a cert link (typically by
// scanning the QR on a signed PDF) can confirm the record is genuine, via a
// SECURITY DEFINER RPC — no auth needed.
export default function VerifyPage({ certId }: { certId: string }) {
  const { supabase } = useUniversal()
  const [result, setResult] = useState<AnyVerifyResult | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    verifyAny(supabase, certId)
      .then((r) => { if (!cancelled) setResult(r) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [supabase, certId])

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
              <Row k="Document hash (SHA-256)" v={result.data.document_hash} mono />
            </dl>
            <p className="mt-4 text-xs text-slate-500">
              The hash above fingerprints the <strong>original</strong> document. To confirm a copy is the one
              that was signed, hash the original PDF (before the signature was added) and compare.
            </p>
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
        ) : (
          <div className="mt-6 rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700">
            ✗ No record found for this certificate. The link may be wrong, or the record was removed.
          </div>
        )}

        <a href={import.meta.env.BASE_URL} className="mt-6 inline-block text-sm font-medium text-orange-600 hover:underline">
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
