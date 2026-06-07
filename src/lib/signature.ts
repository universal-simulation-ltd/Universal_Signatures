// Pure signature helpers: hashing (for the tamper-evident cert), typed-text
// rasterisation, and data-URL ↔ bytes conversion. No React, no network.

export async function sha256Hex(input: string): Promise<string> {
  const bytes = new TextEncoder().encode(input)
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
