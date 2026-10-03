// Pure signature helpers: hashing (for the tamper-evident cert), typed-text
// rasterisation, and data-URL ↔ bytes conversion. No React, no network.

export async function sha256Hex(input: string): Promise<string> {
  const bytes = new TextEncoder().encode(input)
  return digestHex(bytes)
}

// SHA-256 over raw bytes — used to fingerprint the ORIGINAL PDF (before the
// signature/QR are stamped on) so the document can be matched at verify time.
export async function sha256Bytes(bytes: ArrayBuffer): Promise<string> {
  return digestHex(bytes)
}

async function digestHex(bytes: BufferSource): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

export function randomHex(byteLength: number): string {
  const buf = new Uint8Array(byteLength)
  crypto.getRandomValues(buf)
  return [...buf].map((b) => b.toString(16).padStart(2, '0')).join('')
}

// Render typed text in a cursive font to a transparent PNG data URL. The caller
// must `await document.fonts.ready` first so the web font is loaded.
export function rasterizeTyped(text: string, fontFamily: string, color = '#0f172a'): string {
  const width = 600
  const height = 200
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!
  ctx.clearRect(0, 0, width, height)
  ctx.fillStyle = color
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  // Shrink the font until the text fits the canvas width.
  let size = 96
  ctx.font = `${size}px "${fontFamily}", cursive`
  while (size > 24 && ctx.measureText(text).width > width - 40) {
    size -= 4
    ctx.font = `${size}px "${fontFamily}", cursive`
  }
  ctx.fillText(text || ' ', width / 2, height / 2)
  return canvas.toDataURL('image/png')
}

// Today's date formatted for stamping beneath a signature (e.g. "14 Jul 2026").
export function formatSigningDate(d = new Date()): string {
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

// Local time formatted for stamping beneath a signature (e.g. "14:32"). This is
// the machine's local time at the moment of signing — see the signing-provenance
// scope-out for why local time is one of the few purely client-side signals.
export function formatSigningTime(d = new Date()): string {
  return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}

// Load an image data URL to an <img> element.
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const im = new Image()
    im.onload = () => resolve(im)
    im.onerror = reject
    im.src = src
  })
}

// Crop a signature image to its ink: the bounding box of every pixel that isn't
// (near-)transparent, plus a small margin. The pad's PNG is the whole pad, so
// without this a left-aligned name lines up with the pad's edge rather than the
// first stroke, leaving dead space (James, 2026-10-03). Returns the image as-is
// when nothing is drawn. 6px margin matches Universal PDF's renderInkSignature.
function cropToInk(img: HTMLImageElement): HTMLCanvasElement | HTMLImageElement {
  const w = img.width
  const h = img.height
  const src = document.createElement('canvas')
  src.width = w
  src.height = h
  const sctx = src.getContext('2d')!
  sctx.drawImage(img, 0, 0)
  const px = sctx.getImageData(0, 0, w, h).data
  let minX = w, minY = h, maxX = -1, maxY = -1
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (px[(y * w + x) * 4 + 3] > 16) {
        if (x < minX) minX = x
        if (x > maxX) maxX = x
        if (y < minY) minY = y
        if (y > maxY) maxY = y
      }
    }
  }
  if (maxX < 0) return img
  const PAD = 6
  minX = Math.max(0, minX - PAD)
  minY = Math.max(0, minY - PAD)
  maxX = Math.min(w - 1, maxX + PAD)
  maxY = Math.min(h - 1, maxY + PAD)
  const out = document.createElement('canvas')
  out.width = maxX - minX + 1
  out.height = maxY - minY + 1
  out.getContext('2d')!.drawImage(src, minX, minY, out.width, out.height, 0, 0, out.width, out.height)
  return out
}

/**
 * The signature cropped to its ink, as a PNG data URL. The pad and the typed
 * rasteriser both hand over the whole box, so a signature stamped as-is
 * carried its empty margins onto the page: the size slider sized the box, not
 * the signature, and a corner position sat the ink well in from the corner.
 */
export async function trimToInk(dataUrl: string): Promise<string> {
  const out = cropToInk(await loadImage(dataUrl))
  return out instanceof HTMLCanvasElement ? out.toDataURL('image/png') : dataUrl
}

export type LabelAlign = 'left' | 'center' | 'right'

// Stack one or more text lines (name, then date/time) beneath a signature PNG,
// returning a new transparent PNG data URL. Rendered at 2× for crispness.
// The signature is first cropped to its ink, so `align` places the labels
// against the first stroke, the ink's centre, or the last stroke — not the pad's
// edges. Mirrors Universal PDF's composeSignatureWithLabels.
export async function composeSignatureWithLabels(
  sigDataUrl: string,
  labels: { text: string; scale: number }[],
  opts: { color?: string; align?: LabelAlign } = {},
): Promise<string> {
  const { color = '#0f172a', align = 'center' } = opts
  if (labels.length === 0) return sigDataUrl
  const img = cropToInk(await loadImage(sigDataUrl))

  const RS = 2
  const FONT = 'Helvetica, Arial, sans-serif'
  const sigW = img.width
  const sigH = img.height
  const baseFont = Math.min(46, Math.max(22, sigH * 0.18))
  const gap = Math.max(6, sigH * 0.06)

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!

  let maxTextW = 0
  const lineHeights = labels.map((l) => {
    const fs = baseFont * l.scale
    ctx.font = `${fs * RS}px ${FONT}`
    maxTextW = Math.max(maxTextW, ctx.measureText(l.text).width / RS)
    return fs * 1.3
  })
  const outW = Math.max(sigW, maxTextW)
  const outH = sigH + gap + lineHeights.reduce((a, b) => a + b, 0)
  canvas.width = Math.ceil(outW * RS)
  canvas.height = Math.ceil(outH * RS)

  // When a label is wider than the ink, the ink follows the alignment (flush
  // left / centred / flush right) so the text still starts or ends at its edge.
  const sigLeft = align === 'left' ? 0 : align === 'right' ? outW - sigW : (outW - sigW) / 2
  const textX = align === 'left' ? 0 : align === 'right' ? outW : outW / 2

  ctx.drawImage(img, sigLeft * RS, 0, sigW * RS, sigH * RS)
  ctx.fillStyle = color
  ctx.textAlign = align === 'left' ? 'left' : align === 'right' ? 'right' : 'center'
  ctx.textBaseline = 'top'
  let y = sigH + gap
  labels.forEach((l, i) => {
    ctx.font = `${baseFont * l.scale * RS}px ${FONT}`
    ctx.fillText(l.text, textX * RS, y * RS)
    y += lineHeights[i]
  })

  return canvas.toDataURL('image/png')
}

export function dataUrlToBytes(dataUrl: string): Uint8Array {
  const base64 = dataUrl.split(',')[1] ?? ''
  const bin = atob(base64)
  const bytes = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
  return bytes
}

// True when a drawn-canvas data URL is effectively empty (nothing drawn).
export function isBlankDataUrl(dataUrl: string | null): boolean {
  return !dataUrl || dataUrl.length < 2500
}
