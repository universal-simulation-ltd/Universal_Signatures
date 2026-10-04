// Cursive faces offered for typed signatures. `family` is the CSS font-family
// (self-hosted via @font-face in index.css, or registered at runtime for an
// imported font). `imported` marks a user-supplied face loaded this session.
// `label` is the English name (an imported font's is its file name); a built-in
// face also has `labelKey`, which is what gets shown — see fontLabel().
import type { BasicTranslator, MessageKey } from '../i18n/runtime'

export interface SigFont {
  id: string
  label: string
  labelKey?: MessageKey
  family: string
  imported?: boolean
}

export const SIG_FONTS: SigFont[] = [
  { id: 'dancing', label: 'Flowing', labelKey: 'create.font_flowing', family: 'Dancing Script' },
  { id: 'greatvibes', label: 'Elegant', labelKey: 'create.font_elegant', family: 'Great Vibes' },
  { id: 'sacramento', label: 'Fine', labelKey: 'create.font_fine', family: 'Sacramento' },
  { id: 'pacifico', label: 'Bold', labelKey: 'create.font_bold', family: 'Pacifico' },
]

// The name to show for a face, in the active language for a built-in one.
export function fontLabel(font: SigFont, t: BasicTranslator): string {
  return font.labelKey ? t(font.labelKey) : font.label
}

export const DEFAULT_FONT = SIG_FONTS[0]

// CSS font-family value for previewing a face (falls back to cursive).
export function fontFamilyCss(font: SigFont): string {
  return `'${font.family}', cursive`
}

// Look a font up across the built-ins and any session-imported faces.
export function fontById(id: string | null, extra: SigFont[] = []): SigFont {
  return [...SIG_FONTS, ...extra].find((f) => f.id === id) ?? DEFAULT_FONT
}
