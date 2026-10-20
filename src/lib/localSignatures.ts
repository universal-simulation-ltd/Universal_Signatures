import type { SignatureMode } from './types'

// ── Saved-on-this-device signatures ──────────────────────────────────────────
// Free, no account: anyone can keep a small set of signatures in this browser's
// localStorage and reuse them later. To carry them to another browser or
// device, Save to a file / Open a file (lib/signatureFile.ts) — that replaced
// the old cloud save against a Universal ID (2026-10-20). The image is the same transparent PNG data URL used
// for signing, so a reused local signature applies to a PDF exactly like a fresh
// one. Nothing leaves the device.

const KEY = 'unisim.signatures.local.v1'
// Data URLs are heavy (a drawn PNG is tens of KB), and localStorage is ~5 MB, so
// keep the list short — newest first, oldest dropped past the cap.
export const MAX_LOCAL_SIGNATURES = 6
const MAX = MAX_LOCAL_SIGNATURES

export interface LocalSignature {
  id: string
  signerName: string | null
  /** User-given label for this saved signature (as in Universal PDF). Falls
   *  back to signerName / a style default when absent. */
  label: string | null
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
  label?: string
  style: SignatureMode
  font: string | null
  imageDataUrl: string
}

// Save (or, if an identical image already exists, move it to the front so we
// don't pile up duplicates of the same drawn/typed signature).
export function saveLocalSignature(input: SaveLocalInput): LocalSignature[] {
  const existing = loadLocalSignatures()
  const dupeIdx = existing.findIndex((s) => s.imageDataUrl === input.imageDataUrl)
  const label = input.label?.trim() || null
  const entry: LocalSignature =
    dupeIdx >= 0
      ? {
          ...existing[dupeIdx],
          signerName: input.signerName.trim() || existing[dupeIdx].signerName,
          label: label ?? existing[dupeIdx].label ?? null,
        }
      : {
          id: makeId(),
          signerName: input.signerName.trim() || null,
          label,
          style: input.style,
          font: input.font,
          imageDataUrl: input.imageDataUrl,
          createdAt: new Date().toISOString(),
        }
  const rest = existing.filter((_, i) => i !== dupeIdx)
  return persist([entry, ...rest])
}

export function renameLocalSignature(id: string, label: string): LocalSignature[] {
  const next = loadLocalSignatures().map((s) =>
    s.id === id ? { ...s, label: label.trim() || null } : s,
  )
  return persist(next)
}

export function removeLocalSignature(id: string): LocalSignature[] {
  return persist(loadLocalSignatures().filter((s) => s.id !== id))
}

export interface ImportLocalInput {
  signerName: string | null
  label: string | null
  style: SignatureMode
  font: string | null
  imageDataUrl: string
  createdAt: string
}

/**
 * Adds signatures opened from a file. A copy: each gets a fresh id, nothing
 * already here is replaced or reordered, and one whose image is already saved
 * is left out. New ones go after the existing ones; whatever does not fit
 * under the cap is reported, not saved.
 */
export function importLocalSignatures(items: ImportLocalInput[]): {
  list: LocalSignature[]
  added: number
  duplicates: number
  didNotFit: number
} {
  const existing = loadLocalSignatures()
  const have = new Set(existing.map((s) => s.imageDataUrl))
  const fresh: LocalSignature[] = []
  let duplicates = 0
  for (const it of items) {
    if (have.has(it.imageDataUrl)) { duplicates++; continue }
    have.add(it.imageDataUrl)
    fresh.push({ ...it, id: makeId() })
  }
  const room = Math.max(0, MAX - existing.length)
  const taken = fresh.slice(0, room)
  if (taken.length === 0) return { list: existing, added: 0, duplicates, didNotFit: fresh.length }
  persist([...existing, ...taken])
  // Read back: a full storage quota can drop entries persist() tried to keep.
  const list = loadLocalSignatures()
  const ids = new Set(list.map((s) => s.id))
  const added = taken.filter((s) => ids.has(s.id)).length
  return { list, added, duplicates, didNotFit: fresh.length - added }
}
