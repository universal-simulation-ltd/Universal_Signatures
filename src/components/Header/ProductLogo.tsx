// GENERATED FILE — do not edit by hand.
// Source: backoffice/universal-platform/scripts/app-marks/marks.mjs
// Regenerate: node scripts/app-marks/build.mjs (from backoffice/universal-platform)
// Mark: Universal Signatures — A signature on a ruled line.
// Hover: The signature writes itself.
//
// Icon-only by design: the SDK's UniversalAppsNavBar renders the product name
// from its catalogue beside this slot, so a wordmark here would print it twice.

const CSS = `
  /* Resting states */
  .uam-signatures-sign { stroke-dashoffset: 66; transition: stroke-dashoffset .75s cubic-bezier(0.33,1,0.68,1); }

  /* Active states */
  .uam-host-signatures:hover .uam-signatures-sign,
  .uam-host-signatures:focus-visible .uam-signatures-sign { stroke-dashoffset: 0; }

  @media (prefers-reduced-motion: reduce) {
    .uam-signatures-sign { transition: none !important; }
  }
`

export default function ProductLogo() {
  return (
    <span
      className="uam-host-signatures inline-flex h-6 w-6 shrink-0 items-center justify-center"
      aria-hidden="true"
    >
      <style>{CSS}</style>
      <svg viewBox="0 0 64 64" className="h-6 w-6" aria-hidden="true">
        <defs>
          <linearGradient id="uam-nav-signatures-tile" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fe8c01" />
            <stop offset="1" stopColor="#e05504" />
          </linearGradient>
        </defs>
        <rect width="64" height="64" rx="14" fill="url(#uam-nav-signatures-tile)" />
        <path d="M12 42c6-2 8-18 12-18s2 14 6 14 6-12 10-12 2 6 6 6" fill="none" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={66} stroke="#ffffff" className="uam-signatures-sign" />
        <path d="M12 50h40" strokeWidth={3.2} strokeLinecap="round" stroke="#fed7aa" fill="none" />
      </svg>
    </span>
  )
}
