import type { Anchor, PlacePoint } from './pdf'

// Where signPdf puts things, as fractions of the page (top-left origin), for
// the previews. Kept beside nothing heavier than types so the previews don't
// pull pdf-lib in with them; signPdf works the same sums in PDF points.

/** signPdf's corner margin, in PDF points. */
export const MARGIN_PT = 24

export interface PreviewInitials {
  png: string
  anchor: Anchor
  widthPct: number
}

/** The signature's centre, kept wholly on the page as signPdf keeps it. `pos` null = the bottom-right corner. */
export function sigCentre(ptW: number, ptH: number, widthPct: number, sigAspect: number, pos: PlacePoint | null): PlacePoint {
  const halfW = widthPct / 200
  const halfH = ((widthPct / 100) * ptW / sigAspect) / ptH / 2
  const p = pos ?? { xPct: 1 - MARGIN_PT / ptW - halfW, yPct: 1 - MARGIN_PT / ptH - halfH }
  return {
    xPct: Math.max(halfW, Math.min(1 - halfW, p.xPct)),
    yPct: Math.max(Math.min(0.5, halfH), Math.min(1 - Math.min(0.5, halfH), p.yPct)),
  }
}

/**
 * The initials' box as page fractions, as signPdf stamps them — including the
 * hop above (or below) a signature on the same page they would sit under.
 */
export function initialsBox(
  ptW: number, ptH: number, ini: PreviewInitials, iniAspect: number,
  sig: { widthPct: number; sigAspect: number; centre: PlacePoint } | null,
): { left: number; top: number; width: number } {
  const pw = ptW, ph = ptH
  const w = (Math.max(3, Math.min(30, ini.widthPct)) / 100) * pw
  const h = w / iniAspect
  const [vert, horiz] = ini.anchor.split('-')
  const x = horiz === 'center' ? (pw - w) / 2 : horiz === 'right' ? pw - w - MARGIN_PT : MARGIN_PT
  // PDF space from here (bottom-left origin), as in signPdf.
  let y = vert === 'mid' ? (ph - h) / 2 : vert === 'top' ? ph - h - MARGIN_PT : MARGIN_PT
  if (sig) {
    const sw = (Math.max(5, Math.min(60, sig.widthPct)) / 100) * pw
    const sh = sw / sig.sigAspect
    const sx = Math.max(0, Math.min(pw - sw, sig.centre.xPct * pw - sw / 2))
    const sy = Math.max(0, Math.min(ph - sh, ph - sig.centre.yPct * ph - sh / 2))
    if (x < sx + sw && x + w > sx && y < sy + sh && y + h > sy) {
      const gap = 6
      y = sy + sh + gap + h <= ph ? sy + sh + gap : Math.max(0, sy - gap - h)
    }
  }
  return { left: Math.max(0, x) / pw, top: (ph - y - h) / ph, width: w / pw }
}

/** Hands `set` the natural width / height of an image data URL once it loads. */
export function loadAspect(src: string, set: (aspect: number) => void): void {
  const img = new Image()
  img.onload = () => { if (img.width && img.height) set(img.width / img.height) }
  img.src = src
}
