import type { SignatureMode } from './types'

// ── Saved-on-this-device signatures ──────────────────────────────────────────
// A free, no-account counterpart to the cloud save: guests (and anyone) can keep
// a small set of signatures in this browser's localStorage and reuse them later
// without a Universal ID. The image is the same transparent PNG data URL used
// for signing, so a reused local signature applies to a PDF exactly like a fresh
// one. Nothing leaves the device.

const KEY = 'unisim.signatures.local.v1'
// Data URLs are heavy (a drawn PNG is tens of KB), and localStorage is ~5 MB, so
// keep the list short — newest first, oldest dropped past the cap.
const MAX = 6

export interface LocalSignature {
  id: string
  signerName: string | null
  style: SignatureMode
  font: string | null
  imageDataUrl: string
  createdAt: string // ISO
}

export function loadLocalSignatures(): LocalSignature[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as LocalSignature[]) : []
  } catch {
    return []
  }
}

function persist(list: LocalSignature[]): LocalSignature[] {
  const capped = list.slice(0, MAX)
  try {
    localStorage.setItem(KEY, JSON.stringify(capped))
  } catch {
    // Quota exceeded (or storage disabled) — drop the oldest and retry once.
    try {
      localStorage.setItem(KEY, JSON.stringify(capped.slice(0, Math.max(1, MAX - 2))))
    } catch {
      /* give up silently — the in-memory signature still works for signing */
    }
  }
  return capped
}

// A short device-local id — no crypto identity needed, just a list key.
function makeId(): string {
  return `loc_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}

export interface SaveLocalInput {
  signerName: string
  style: SignatureMode
  font: string | null
  imageDataUrl: string
}

// Save (or, if an identical image already exists, move it to the front so we
// don't pile up duplicates of the same drawn/typed signature).
export function saveLocalSignature(input: SaveLocalInput): LocalSignature[] {
  const existing = loadLocalSignatures()
  const dupeIdx = existing.findIndex((s) => s.imageDataUrl === input.imageDataUrl)
  const entry: LocalSignature =
    dupeIdx >= 0
      ? { ...existing[dupeIdx], signerName: input.signerName.trim() || existing[dupeIdx].signerName }
      : {
          id: makeId(),
          signerName: input.signerName.trim() || null,
          style: input.style,
          font: input.font,
          imageDataUrl: input.imageDataUrl,
          createdAt: new Date().toISOString(),
        }
  const rest = existing.filter((_, i) => i !== dupeIdx)
  return persist([entry, ...rest])
}

export function removeLocalSignature(id: string): LocalSignature[] {
  return persist(loadLocalSignatures().filter((s) => s.id !== id))
}
