import { create } from 'zustand'
import { readDefaultView } from '@unisim/sdk'
import type { StudioMode } from '../lib/types'
import { DEFAULT_FONT, type SigFont } from '../lib/fonts'

/** Where the name/date/time labels sit relative to the signature box. */
export type LabelAlign = 'left' | 'center' | 'right'

/** Who signs the PDF in the "Sign a PDF" card. */
export type ApplyMode = 'self' | 'send'

interface SigState {
  mode: StudioMode
  signerName: string
  fontId: string
  importedFonts: SigFont[]   // user-supplied faces loaded this session
  drawnDataUrl: string | null   // from the canvas pad (or a phone handoff)
  typedDataUrl: string | null   // rasterised typed text

  // Optional name/date stamped beneath the signature (the "add name & date"
  // choice). `composedDataUrl` is the base image with those labels baked in,
  // recomputed reactively by SignatureStudio.
  includeName: boolean
  includeDate: boolean
  includeTime: boolean
  labelAlign: LabelAlign
  composedDataUrl: string | null

  // The "Sign a PDF" card's switch: sign it yourself, or send it to someone
  // else. Here rather than in that card because the studio reads it too: in
  // send mode it folds away, since sending needs no signature of your own.
  applyMode: ApplyMode

  setMode: (m: StudioMode) => void
  setSignerName: (n: string) => void
  setFontId: (id: string) => void
  addImportedFont: (f: SigFont) => void
  setDrawn: (url: string | null) => void
  setTyped: (url: string | null) => void
  setIncludeName: (v: boolean) => void
  setIncludeDate: (v: boolean) => void
  setIncludeTime: (v: boolean) => void
  setLabelAlign: (a: LabelAlign) => void
  setComposed: (url: string | null) => void
  setApplyMode: (m: ApplyMode) => void
  clear: () => void
  /** True when name/date labels should be applied (choice set + has content). */
  hasExtras: () => boolean
  /** The raw signature PNG for the current mode (no name/date), or null. */
  baseImage: () => string | null
  /** The active signature PNG — composed with name/date when applicable. */
  currentImage: () => string | null
}

/** Every way to create a signature — also what the "Opens on" default may name. */
export const STUDIO_MODES: readonly StudioMode[] = ['draw', 'type', 'phone']

/**
 * The mode the studio opens on: Draw, unless the person double-tapped another
 * (James, 2026-09-30: "allow the user to double click the button to set that as
 * their default view"). The SDK owns the key and its Reset to defaults clears it.
 */
function openingMode(): StudioMode {
  const stored = readDefaultView('signatures', 'mode')
  return stored && (STUDIO_MODES as readonly string[]).includes(stored) ? (stored as StudioMode) : 'draw'
}

export const useSigStore = create<SigState>((set, get) => ({
  mode: openingMode(),
  signerName: '',
  fontId: DEFAULT_FONT.id,
  importedFonts: [],
  drawnDataUrl: null,
  typedDataUrl: null,
  includeName: false,
  includeDate: false,
  includeTime: false,
  labelAlign: 'center',
  composedDataUrl: null,
  applyMode: 'self',

  setMode: (mode) => set({ mode }),
  setSignerName: (signerName) => set({ signerName }),
  setFontId: (fontId) => set({ fontId }),
  addImportedFont: (f) => set((s) => ({ importedFonts: [...s.importedFonts, f] })),
  setDrawn: (drawnDataUrl) => set({ drawnDataUrl }),
  setTyped: (typedDataUrl) => set({ typedDataUrl }),
  setIncludeName: (includeName) => set({ includeName }),
  setIncludeDate: (includeDate) => set({ includeDate }),
  setIncludeTime: (includeTime) => set({ includeTime }),
  setLabelAlign: (labelAlign) => set({ labelAlign }),
  setComposed: (composedDataUrl) => set({ composedDataUrl }),
  setApplyMode: (applyMode) => set({ applyMode }),
  clear: () => set({ drawnDataUrl: null, typedDataUrl: null, composedDataUrl: null }),

  hasExtras: () => {
    const s = get()
    return (s.includeName && s.signerName.trim().length > 0) || s.includeDate || s.includeTime
  },

  baseImage: () => {
    const s = get()
    // 'phone' produces a drawn image; only 'type' uses the rasterised text.
    return s.mode === 'type' ? s.typedDataUrl : s.drawnDataUrl
  },

  currentImage: () => {
    const s = get()
    const base = get().baseImage()
    if (!base) return null
    // When extras are chosen, use the composed image (may briefly be null while
    // it's being generated — callers treat that as "not ready yet").
    return get().hasExtras() ? s.composedDataUrl : base
  },
}))
