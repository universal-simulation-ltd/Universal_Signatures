// Cursive faces offered for typed signatures. `family` matches the Google Font
// loaded in index.html; `css` is the helper class used for live preview.
export interface SigFont {
  id: string
  label: string
  family: string
  css: string
}

export const SIG_FONTS: SigFont[] = [
  { id: 'dancing', label: 'Flowing', family: 'Dancing Script', css: 'font-dancing' },
  { id: 'greatvibes', label: 'Elegant', family: 'Great Vibes', css: 'font-greatvibes' },
  { id: 'sacramento', label: 'Fine', family: 'Sacramento', css: 'font-sacramento' },
  { id: 'pacifico', label: 'Bold', family: 'Pacifico', css: 'font-pacifico' },
]

export const DEFAULT_FONT = SIG_FONTS[0]

export function fontById(id: string | null): SigFont {
  return SIG_FONTS.find((f) => f.id === id) ?? DEFAULT_FONT
}
