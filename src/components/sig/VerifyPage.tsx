import { useEffect, useState } from 'react'
import { useUniversal } from '@unisim/sdk'
import { verifyCert } from '../../lib/cloud'
import type { VerifyResult } from '../../lib/types'

// Public certificate verification: anyone with a cert link can confirm a saved
// signature is genuine (via the SECURITY DEFINER RPC — no auth needed).
export default function VerifyPage({ certId }: { certId: string }) {
  const { supabase } = useUniversal()
  const [result, setResult] = useState<VerifyResult | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    verifyCert(supabase, certId)
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
        ) : result ? (
          <div className="mt-6">
            <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-3">
              <span className="text-lg" aria-hidden="true">✓</span>
              <span className="text-sm font-semibold text-emerald-800">Verified — this is a genuine saved signature</span>
            </div>
            <dl className="mt-4 divide-y divide-slate-100 text-sm">
              <Row k="Signer" v={result.signer_name ?? '—'} />
              <Row k="Organisation" v={result.org_name ?? '—'} />
              <Row k="Saved" v={fmt(result.created_at)} />
              <Row k="Document hash (SHA-256)" v={result.signature_hash} mono />
            </dl>
          </div>
        ) : (
          <div className="mt-6 rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700">
            ✗ No signature found for this certificate. The link may be wrong, or the signature was removed.
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
