import { useState, type ReactNode } from 'react'
import { useUniversal } from '@unisim/sdk'
import type { RequestCertResult } from '../../lib/types'
import { certificateDownload } from '../../lib/signRequests'
import BadgeEmbed from './BadgeEmbed'
import Row from './Row'

const ACTIONS: Record<string, string> = {
  opened: 'Opened',
  verified: 'Confirmed their email address',
  signature: 'Signed',
  annotation: 'Added marks',
  highlight: 'Highlighted',
  text: 'Added text',
  other: 'Made other changes',
  completed: 'Completed',
}

/**
 * The certificate for a document sent to be signed: who it went to, whether
 * and when they signed, the fingerprints of the original and of the signed
 * copy, the activity log, and the signed copy to download. Everything here
 * comes from the public verify_pdf_sign_cert function — no secrets, and only
 * the country of each IP address.
 */
export default function RequestCertificate({
  data,
  fmt,
  checkPdf,
}: {
  data: RequestCertResult
  fmt: (iso: string) => string
  checkPdf: (original: string, signed: string | null) => ReactNode
}) {
  const { supabase } = useUniversal()
  const done = data.status === 'completed' || data.status === 'signed'
  const [downloading, setDownloading] = useState(false)
  const [downloadError, setDownloadError] = useState<string | null>(null)

  async function onDownload() {
    setDownloading(true)
    setDownloadError(null)
    const r = await certificateDownload(supabase, data.cert_id)
    setDownloading(false)
    if (!r.ok || !r.signedUrl) {
      setDownloadError(r.code === 'deleted' ? 'The stored copy has been removed.' : 'Couldn’t fetch the signed copy. Try again in a moment.')
      return
    }
    window.location.href = r.signedUrl
  }

  return (
    <div className="mt-6" data-testid="request-certificate">
      {done ? (
        <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-3">
          <span className="text-lg" aria-hidden="true">✓</span>
          <span className="text-sm font-semibold text-emerald-800">Verified — this document was signed by everyone it was sent to</span>
        </div>
      ) : (
        <div className="flex items-center gap-2 rounded-lg bg-amber-50 px-4 py-3">
          <span className="text-lg" aria-hidden="true">…</span>
          <span className="text-sm font-semibold text-amber-800">Sent, and still waiting to be signed</span>
        </div>
      )}
      <dl className="mt-4 divide-y divide-slate-100 text-sm">
        <Row k="Document" v={data.doc_name} />
        <Row k="Sent" v={fmt(data.created_at)} />
        {data.parties.map((p, i) => (
          <Row
            key={i}
            k={p.status === 'signed' ? 'Signed by' : 'Waiting for'}
            v={`${p.email ?? '—'}${p.signed_at ? ` · ${fmt(p.signed_at)}` : ''}`}
          />
        ))}
        {data.original_sha256 && <Row k="Document as sent (SHA-256)" v={data.original_sha256} mono />}
        {done && data.latest_sha256 && <Row k="Signed copy hash (SHA-256)" v={data.latest_sha256} mono />}
      </dl>

      {data.events.length > 0 && (
        <div className="mt-4">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Activity</h2>
          <ol className="mt-2 space-y-1 text-xs text-slate-600">
            {data.events.map((e, i) => (
              <li key={i} className="flex flex-wrap gap-x-2">
                <span className="tabular-nums text-slate-400">{fmt(e.occurred_at)}</span>
                <span className="font-medium text-slate-700">{ACTIONS[e.action] ?? e.action}</span>
                {e.actor_email && <span>{e.actor_email}</span>}
                {e.ip_country && <span className="text-slate-400">({e.ip_country})</span>}
              </li>
            ))}
          </ol>
        </div>
      )}

      {done && data.bytes_available && (
        <div className="mt-4">
          <button
            type="button"
            onClick={onDownload}
            disabled={downloading}
            className="rounded-md bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-black disabled:opacity-60"
          >
            {downloading ? 'Fetching…' : 'Download the signed copy'}
          </button>
          {downloadError && <p role="alert" className="mt-1 text-xs text-rose-700">{downloadError}</p>}
        </div>
      )}

      {(data.original_sha256 || (done && data.latest_sha256)) && checkPdf(data.original_sha256 ?? '', done ? data.latest_sha256 : null)}
      {done && <BadgeEmbed certId={data.cert_id.toLowerCase()} />}
    </div>
  )
}
