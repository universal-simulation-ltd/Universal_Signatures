/**
 * The drop circle's backdrop — a page being signed.
 *
 * Same rule as the other Universal apps' versions: STROKE ONLY, no fills. The
 * ring's interior is an opaque white circle, so pale fills have nothing left to
 * show once knocked back to a fraction of opacity; thin lines survive.
 *
 * ⚠️ Render as a CHILD of <DropRing>, never behind it — DropRing paints that
 * white interior itself, so anything behind the ring is simply covered.
 *
 * ⚠️ Only drawn while the ring is EMPTY. Once a document is loaded the ring
 * fills with its filename, page count and state, and a drawing behind three
 * lines of live detail is noise rather than backdrop. The app already switches
 * the ring's own motion for that state; this follows it.
 */

const LOOP_MS = 9000

// pathLength={100} on every animated path, so the dash values are PERCENTAGES
// of each stroke and survive a curve being moved.
const CSS = `
  .sw-page, .sw-fold, .sw-rule, .sw-sig {
    stroke-dasharray: 100;
    stroke-dashoffset: 100;
    animation-duration: ${LOOP_MS}ms;
    animation-iteration-count: infinite;
    animation-timing-function: ease-in-out;
  }
  @keyframes sw-draw {
    0%        { stroke-dashoffset: 100; opacity: 0; }
    4%        { opacity: 1; }
    22%, 82%  { stroke-dashoffset: 0; opacity: 1; }
    94%, 100% { stroke-dashoffset: 0; opacity: 0; }
  }
  .sw-page { animation-name: sw-draw; animation-delay: 0ms; }
  .sw-fold { animation-name: sw-draw; animation-delay: 500ms; }
  .sw-rule { animation-name: sw-draw; animation-delay: 1500ms; }
  .sw-sig  { animation-name: sw-draw; animation-delay: 2100ms; }

  /* ⚠️ Reduced motion gets the FINISHED page, not a slower loop and not frame
     0 — frame 0 is a blank rectangle, the least useful still of the set. */
  @media (prefers-reduced-motion: reduce) {
    .sw-page, .sw-fold, .sw-rule, .sw-sig {
      animation: none;
      stroke-dashoffset: 0;
      opacity: 1;
    }
  }
`

const INK = '#94a3b8'
const ACCENT = '#f97316'

export default function DropWatermark() {
  return (
    <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden="true" focusable="false">
      <style>{CSS}</style>
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        {/* The page, drawn from the fold so it arrives in one gesture. */}
        <path className="sw-page" pathLength={100} d="M74 12 H36 a4 4 0 0 0-4 4 v88 a4 4 0 0 0 4 4 h48 a4 4 0 0 0 4-4 V26 Z" stroke={INK} strokeWidth="1.6" />
        <path className="sw-fold" pathLength={100} d="M74 12 v14 h14" stroke={INK} strokeWidth="1.6" />

        {/* The signature line and the signature on it — this app's whole job,
            so the ink takes the accent and the longest draw. */}
        <path className="sw-rule" pathLength={100} d="M42 98 H78" stroke={INK} strokeWidth="1.3" strokeOpacity="0.7" />
        <path className="sw-sig" pathLength={100} d="M43 93 c5-8 9 6 14 0 s9-7 13 1 s6 4 10-3" stroke={ACCENT} strokeWidth="2.1" />
      </g>
    </svg>
  )
}
