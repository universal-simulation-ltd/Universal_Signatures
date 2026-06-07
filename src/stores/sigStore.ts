import { create } from 'zustand'
import type { SignatureMode } from '../lib/types'
import { DEFAULT_FONT } from '../lib/fonts'

interface SigState {
  mode: SignatureMode
  signerName: string
  fontId: string
  drawnDataUrl: string | null   // from the canvas pad
  typedDataUrl: string | null   // rasterised typed text

  setMode: (m: SignatureMode) => void
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
    return s.mode === 'draw' ? s.drawnDataUrl : s.typedDataUrl
  },
}))
