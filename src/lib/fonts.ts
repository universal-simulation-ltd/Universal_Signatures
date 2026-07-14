// Cursive faces offered for typed signatures. `family` is the CSS font-family
// (self-hosted via @font-face in index.css, or registered at runtime for an
// imported font). `imported` marks a user-supplied face loaded this session.
export interface SigFont {
  id: string
  label: string
  family: string
  imported?: boolean
}

export const SIG_FONTS: SigFont[] = [
  { id: 'dancing', label: 'Flowing', family: 'Dancing Script' },
  { id: 'greatvibes', label: 'Elegant', family: 'Great Vibes' },
  { id: 'sacramento', label: 'Fine', family: 'Sacramento' },
  { id: 'pacifico', label: 'Bold', family: 'Pacifico' },
]

export const DEFAULT_FONT = SIG_FONTS[0]

// CSS font-family value for previewing a face (falls back to cursive).
export function fontFamilyCss(font: SigFont): string {
  return `'${font.family}', cursive`
}

// Look a font up across the built-ins and any session-imported faces.
export function fontById(id: string | null, extra: SigFont[] = []): SigFont {
  return [...SIG_FONTS, ...extra].find((f) => f.id === id) ?? DEFAULT_FONT
}
