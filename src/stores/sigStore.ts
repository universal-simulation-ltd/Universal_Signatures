import { create } from 'zustand'
import type { StudioMode } from '../lib/types'
import { DEFAULT_FONT } from '../lib/fonts'

interface SigState {
  mode: StudioMode
  signerName: string
  fontId: string
  drawnDataUrl: string | null   // from the canvas pad (or a phone handoff)
  typedDataUrl: string | null   // rasterised typed text

  // Optional name/date stamped beneath the signature (the "add name & date"
  // choice). `composedDataUrl` is the base image with those labels baked in,
  // recomputed reactively by SignatureStudio.
  includeName: boolean
  includeDate: boolean
  composedDataUrl: string | null

  setMode: (m: StudioMode) => void
  setSignerName: (n: string) => void
  setFontId: (id: string) => void
  setDrawn: (url: string | null) => void
  setTyped: (url: string | null) => void
  setIncludeName: (v: boolean) => void
  setIncludeDate: (v: boolean) => void
  setComposed: (url: string | null) => void
  clear: () => void
  /** True when name/date labels should be applied (choice set + has content). */
  hasExtras: () => boolean
  /** The raw signature PNG for the current mode (no name/date), or null. */
  baseImage: () => string | null
  /** The active signature PNG — composed with name/date when applicable. */
  currentImage: () => string | null
}

export const useSigStore = create<SigState>((set, get) => ({
  mode: 'draw',
  signerName: '',
  fontId: DEFAULT_FONT.id,
  drawnDataUrl: null,
  typedDataUrl: null,
  includeName: false,
  includeDate: false,
  composedDataUrl: null,

  setMode: (mode) => set({ mode }),
  setSignerName: (signerName) => set({ signerName }),
  setFontId: (fontId) => set({ fontId }),
  setDrawn: (drawnDataUrl) => set({ drawnDataUrl }),
  setTyped: (typedDataUrl) => set({ typedDataUrl }),
  setIncludeName: (includeName) => set({ includeName }),
  setIncludeDate: (includeDate) => set({ includeDate }),
  setComposed: (composedDataUrl) => set({ composedDataUrl }),
  clear: () => set({ drawnDataUrl: null, typedDataUrl: null, composedDataUrl: null }),

  hasExtras: () => {
    const s = get()
    return (s.includeName && s.signerName.trim().length > 0) || s.includeDate
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
