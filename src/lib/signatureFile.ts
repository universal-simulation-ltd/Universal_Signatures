import { packTransfer, readTransfer, type TransferErrorReason } from '@unisim/sdk'
import type { LocalSignature } from './localSignatures'
import type { SignatureMode } from './types'

// ── The saved-signatures file ────────────────────────────────────────────────
// "Save to a file" on one device, "Open a file" on another: the login-free way
// to carry your saved signatures between browsers (James, 2026-10-20 — "avoid
// logins except where it really improves experience … introduce an export /
// import function"; Docs_UNI_SIM/login-free-plan.md). It replaced saving a
// signature to the cloud against a Universal ID.
//
// The envelope is the suite transfer file (`packTransfer` / `readTransfer` in
// @unisim/sdk): product 'signatures', kind 'saved-signatures', schema 1, and
// `data: { signatures: [...] }`. An optional password encrypts `data`.
//
// ⚠️ A file is UNTRUSTED on the way in: anyone can write one by hand. Every
// field is checked here, image bytes included, before anything reaches
// localStorage or an <img>. What comes in is a copy with fresh ids.

export const SIGNATURES_PRODUCT = 'signatures'
export const SAVED_SIGNATURES_KIND = 'saved-signatures'
export const SAVED_SIGNATURES_SCHEMA = 1

/** The most signatures one file may hold; anything past it is ignored. */
export const MAX_FILE_SIGNATURES = 50
/** A signature PNG is tens of KB; a data URL past this is not a signature. */
export const MAX_IMAGE_DATA_URL = 1_500_000
/** The whole file. A full file of the largest images still fits under it. */
export const MAX_FILE_BYTES = 20 * 1024 * 1024
const MAX_TEXT = 80
const MAX_SIDE = 4000

/** One signature as it travels in the file. */
export interface FileSignature {
  label: string | null
  signerName: string | null
  style: SignatureMode
  font: string | null
  imageDataUrl: string
  createdAt: string
}

export async function packSavedSignatures(list: LocalSignature[], password?: string) {
  const signatures: FileSignature[] = list.map((s) => ({
    label: s.label,
    signerName: s.signerName,
    style: s.style,
    font: s.font,
    imageDataUrl: s.imageDataUrl,
    createdAt: s.createdAt,
  }))
  return packTransfer({
    product: SIGNATURES_PRODUCT,
    kind: SAVED_SIGNATURES_KIND,
    schema: SAVED_SIGNATURES_SCHEMA,
    data: { signatures },
    app: { name: 'Universal Signatures', version: __APP_VERSION__, platform: 'web' },
    password: password || undefined,
    title: 'my-signatures',
  })
}

export type ReadSignaturesResult =
  | { ok: true; signatures: FileSignature[]; skipped: number }
  | { ok: false; reason: TransferErrorReason }

/** Opens and checks a saved-signatures file. Never throws for a bad file. */
export async function readSavedSignatures(file: Blob, password?: string): Promise<ReadSignaturesResult> {
  const res = await readTransfer(file, {
    product: SIGNATURES_PRODUCT,
    kinds: { [SAVED_SIGNATURES_KIND]: { schema: SAVED_SIGNATURES_SCHEMA } },
    password: password || undefined,
    maxBytes: MAX_FILE_BYTES,
  })
  if (!res.ok) return { ok: false, reason: res.reason }
  const data = res.data
  if (!isRecord(data) || !Array.isArray(data.signatures)) return { ok: false, reason: 'damaged' }

  const raw = data.signatures.slice(0, MAX_FILE_SIGNATURES)
  let skipped = data.signatures.length - raw.length
  const out: FileSignature[] = []
  const seen = new Set<string>()
  for (const item of raw) {
    const sig = await checkOne(item)
    if (!sig) { skipped++; continue }
    if (seen.has(sig.imageDataUrl)) continue
    seen.add(sig.imageDataUrl)
    out.push(sig)
  }
  return { ok: true, signatures: out, skipped }
}

async function checkOne(item: unknown): Promise<FileSignature | null> {
  if (!isRecord(item)) return null
  const image = await checkImage(item.imageDataUrl)
  if (!image) return null
  const font = typeof item.font === 'string' && /^[A-Za-z0-9_-]{1,40}$/.test(item.font) ? item.font : null
  return {
    label: cleanText(item.label),
    signerName: cleanText(item.signerName),
    style: item.style === 'type' ? 'type' : 'draw',
    font,
    imageDataUrl: image,
    createdAt: cleanDate(item.createdAt),
  }
}

// Names and labels: plain text, no control characters, a sensible length.
function cleanText(v: unknown): string | null {
  if (typeof v !== 'string') return null
  // eslint-disable-next-line no-control-regex
  const s = v.replace(/[\u0000-\u001f\u007f-\u009f\u2028\u2029]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, MAX_TEXT)
  return s || null
}

function cleanDate(v: unknown): string {
  if (typeof v === 'string' && v.length <= 40) {
    const d = new Date(v)
    if (!Number.isNaN(d.getTime())) return d.toISOString()
  }
  return new Date().toISOString()
}

const PNG_MAGIC = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]
const JPEG_MAGIC = [0xff, 0xd8, 0xff]

/**
 * A PNG or JPEG data URL whose bytes really are that image, within the size
 * caps, that a browser can actually decode. A PNG comes back as it was (so a
 * signature saved here and opened again is recognised as the same one); a JPEG
 * is redrawn as a PNG, because signing embeds PNGs.
 */
async function checkImage(v: unknown): Promise<string | null> {
  if (typeof v !== 'string' || v.length > MAX_IMAGE_DATA_URL) return null
  const m = /^data:image\/(png|jpeg);base64,([A-Za-z0-9+/]+={0,2})$/.exec(v)
  if (!m) return null
  let bytes: Uint8Array
  try {
    const bin = atob(m[2])
    bytes = new Uint8Array(Math.min(bin.length, 16))
    for (let i = 0; i < bytes.length; i++) bytes[i] = bin.charCodeAt(i)
  } catch {
    return null
  }
  const isPng = PNG_MAGIC.every((b, i) => bytes[i] === b)
  const isJpeg = JPEG_MAGIC.every((b, i) => bytes[i] === b)
  if (m[1] === 'png' ? !isPng : !isJpeg) return null

  const img = await decode(v)
  if (!img || img.naturalWidth < 1 || img.naturalHeight < 1 || img.naturalWidth > MAX_SIDE || img.naturalHeight > MAX_SIDE) return null
  if (isPng) return v
  try {
    const canvas = document.createElement('canvas')
    canvas.width = img.naturalWidth
    canvas.height = img.naturalHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) return null
    ctx.drawImage(img, 0, 0)
    const png = canvas.toDataURL('image/png')
    return png.length <= MAX_IMAGE_DATA_URL ? png : null
  } catch {
    return null
  }
}

function decode(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image()
    const timer = window.setTimeout(() => resolve(null), 5000)
    img.onload = () => { window.clearTimeout(timer); resolve(img) }
    img.onerror = () => { window.clearTimeout(timer); resolve(null) }
    img.src = src
  })
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}
