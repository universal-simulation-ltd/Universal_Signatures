// One label/value line of a certificate.
export default function Row({ k, v, mono = false }: { k: string; v: string; mono?: boolean }) {
  return (
    <div className="flex justify-between gap-4 py-2">
      <dt className="text-slate-500">{k}</dt>
      <dd className={`text-right text-slate-900 ${mono ? 'font-mono text-xs break-all' : ''}`}>{v}</dd>
    </div>
  )
}
