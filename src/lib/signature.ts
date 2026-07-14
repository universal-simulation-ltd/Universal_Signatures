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

// Load an image data URL to an <img> element.
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const im = new Image()
    im.onload = () => resolve(im)
    im.onerror = reject
    im.src = src
  })
}

// Stack one or more text lines (name, then date) centred beneath a signature
// PNG, returning a new transparent PNG data URL. Rendered at 2× for crispness.
// Mirrors Universal PDF's composeSignatureWithLabels.
export async function composeSignatureWithLabels(
  sigDataUrl: string,
  labels: { text: string; scale: number }[],
  color = '#0f172a',
): Promise<string> {
  const img = await loadImage(sigDataUrl)
  if (labels.length === 0) return sigDataUrl

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

  ctx.drawImage(img, ((outW - sigW) / 2) * RS, 0, sigW * RS, sigH * RS)
  ctx.fillStyle = color
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'
  let y = sigH + gap
  labels.forEach((l, i) => {
    ctx.font = `${baseFont * l.scale * RS}px ${FONT}`
    ctx.fillText(l.text, (outW / 2) * RS, y * RS)
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
