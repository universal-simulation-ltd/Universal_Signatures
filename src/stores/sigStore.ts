import { create } from 'zustand'
import type { StudioMode } from '../lib/types'
import { DEFAULT_FONT } from '../lib/fonts'

interface SigState {
  mode: StudioMode
  signerName: string
  fontId: string
  drawnDataUrl: string | null   // from the canvas pad (or a phone handoff)
  typedDataUrl: string | null   // rasterised typed text

  setMode: (m: StudioMode) => void
  setSignerName: (n: string) => void
  setFontId: (id: string) => void
  setDrawn: (url: string | null) => void
  setTyped: (url: string | null) => void
  clear: () => void
  /** The active signature PNG for the current mode, or null if none yet. */
  currentImage: () => string | null
}

export const useSigStore = create<SigState>((set, get) => ({
  mode: 'draw',
  signerName: '',
  fontId: DEFAULT_FONT.id,
  drawnDataUrl: null,
  typedDataUrl: null,

  setMode: (mode) => set({ mode }),
  setSignerName: (signerName) => set({ signerName }),
  setFontId: (fontId) => set({ fontId }),
  setDrawn: (drawnDataUrl) => set({ drawnDataUrl }),
  setTyped: (typedDataUrl) => set({ typedDataUrl }),
  clear: () => set({ drawnDataUrl: null, typedDataUrl: null }),

  currentImage: () => {
    const s = get()
    // 'phone' produces a drawn image; only 'type' uses the rasterised text.
    return s.mode === 'type' ? s.typedDataUrl : s.drawnDataUrl
  },
}))
