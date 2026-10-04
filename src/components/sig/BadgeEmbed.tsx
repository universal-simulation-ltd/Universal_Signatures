import { useEffect, useId, useState } from 'react'

type Format = 'live' | 'image' | 'markdown'

declare global {
  interface Window {
    UnisimSignatureBadges?: { scan: () => void }
  }
}

/**
 * "Show it on a website" — the embeddable badge for a certificate. Three ways
 * to paste it:
 *  • live: a link plus public/badge.js, which looks the certificate up from the
 *    visitor's browser and only then says "Signed and verified ✓";
 *  • image + link, for email and site builders that strip scripts;
 *  • the same in Markdown, for READMEs.
 * The image is a fixed picture that says "click to verify" — it can't check
 * anything — so the live one is offered first.
 */
export default function BadgeEmbed({ certId }: { certId: string }) {
  const [format, setFormat] = useState<Format>('live')
  const [copied, setCopied] = useState(false)
  const codeId = useId()

  const base = `${window.location.origin}${import.meta.env.BASE_URL}`
  const verifyUrl = `${base}verify/${certId}`
  const snippets: Record<Format, string> = {
    live:
      `<a class="unisim-sig-badge" data-cert="${certId}" href="${verifyUrl}">Verify this signature</a>\n` +
      `<script async src="${base}badge.js"></script>`,
    image: `<a href="${verifyUrl}"><img src="${base}badge.svg" alt="Signed with Universal Signatures — click to verify" width="280" height="44"></a>`,
    markdown: `[![Signed with Universal Signatures — click to verify](${base}badge.svg)](${verifyUrl})`,
  }

  // The preview is the real badge: load badge.js once and let it upgrade the
  // link below (it scans on load; later renders ask it to scan again).
  useEffect(() => {
    if (format !== 'live') return
    if (window.UnisimSignatureBadges) { window.UnisimSignatureBadges.scan(); return }
    const existing = document.querySelector<HTMLScriptElement>('script[data-unisim-badge-preview]')
    if (existing) return
    const s = document.createElement('script')
    s.src = `${import.meta.env.BASE_URL}badge.js`
    s.async = true
    s.dataset.unisimBadgePreview = ''
    document.body.appendChild(s)
  }, [format])

  async function copy() {
    try {
      await navigator.clipboard.writeText(snippets[format])
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  const TABS: { id: Format; label: string }[] = [
    { id: 'live', label: 'Live badge' },
    { id: 'image', label: 'Image + link' },
    { id: 'markdown', label: 'Markdown' },
  ]

  return (
    <details className="group mt-4 rounded-lg border border-slate-200 bg-white p-3" data-testid="badge-embed">
      <summary className="cursor-pointer list-none text-sm font-semibold text-slate-800 [&::-webkit-details-marker]:hidden">
        <span className="inline-flex items-center gap-1.5">
          Show it on a website
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="text-slate-400 transition-transform group-open:rotate-180">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </span>
        <span className="mt-0.5 block text-xs font-normal text-slate-500">
          Embed a badge that links to this certificate.
        </span>
      </summary>

      <div className="mt-3">
        <div className="inline-flex rounded-md bg-slate-100 p-0.5" role="group" aria-label="Badge format">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => { setFormat(t.id); setCopied(false) }}
              aria-pressed={format === t.id}
              className={`rounded px-2.5 py-1 text-xs font-semibold ${format === t.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <p className="mt-2 text-xs text-slate-500">
          {format === 'live'
            ? 'Checks this certificate each time the page is viewed and only then shows “✓ Signed and verified”. Needs a page that allows scripts.'
            : format === 'image'
              ? 'For email and sites that don’t allow scripts. The picture can’t check anything itself, so it says “click to verify” — the check happens on this page.'
              : 'For a README or anywhere else that takes Markdown. A fixed picture, like the image version.'}
        </p>

        <div className="mt-3 flex min-h-[52px] items-center justify-center rounded-md border border-dashed border-slate-300 bg-slate-50 p-3" aria-label="Preview">
          {format === 'live' ? (
            // badge.js puts its badge in BESIDE the link, in DOM React doesn't
            // know about — so the link sits in a wrapper of its own, and leaving
            // this tab removes the wrapper and the badge with it.
            <span key={`live-${certId}`}>
              <a className="unisim-sig-badge text-xs text-orange-700 underline" data-cert={certId} href={verifyUrl}>
                Verify this signature
              </a>
            </span>
          ) : (
            <img src={`${import.meta.env.BASE_URL}badge.svg`} alt="Signed with Universal Signatures — click to verify" width={280} height={44} />
          )}
        </div>

        <label htmlFor={codeId} className="mt-3 block text-[11px] font-semibold uppercase tracking-wide text-slate-500">
          Paste this into your page
        </label>
        <textarea
          id={codeId}
          readOnly
          value={snippets[format]}
          rows={format === 'live' ? 5 : 3}
          onFocus={(e) => e.currentTarget.select()}
          className="mt-1 w-full resize-none rounded-md border border-slate-300 bg-white px-2 py-1.5 font-mono text-[11px] text-slate-700"
        />
        <button
          type="button"
          onClick={copy}
          className="mt-1.5 rounded-md bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-black"
        >
          {copied ? 'Copied ✓' : 'Copy'}
        </button>
      </div>
    </details>
  )
}
