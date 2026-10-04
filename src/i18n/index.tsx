// The app's own translations — the same pattern as Universal PDF's src/i18n.
//
// The language is the SDK's (`useLanguage()`): this app's choice if it has
// one (App preferences), else the suite's global language, else the device's,
// else English. The navbar, the knowledge base and this app therefore always
// agree, and `<html lang>` follows it.
//
// Dictionaries live in `src/i18n/<lang>/<namespace>.ts`. English is the source
// of truth and defines the shape (`Messages`); every other language is typed
// against it, so `tsc` fails on a missing or misspelt key. The app speaks the
// same eight languages as its knowledge base (src/knowledge).
//
// Keys are `<namespace>.<key>`. Placeholders are `{name}`. A plural is two (or
// more) keys sharing a stem — `pages_one`, `pages_other` — read through
// `t.plural('ns.pages', count)`, which picks the form with Intl.PluralRules and
// passes `{count}` for you. A sentence with a link or bold in it is ONE string
// read through `t.rich(key, { link: <a…/> })`, so translators can move it.
import { createContext, Fragment, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useLanguage, SUPPORTED_LANGUAGES } from '@unisim/sdk'
import {
  fill,
  getT,
  intlLocale,
  lookup,
  makeBasicTranslator,
  registerLanguages,
  setActiveLanguage,
  type BasicTranslator,
  type MessageKey,
  type Messages,
  type PluralKey,
  type Vars,
} from './runtime'

export { getT, intlLocale }
export type { BasicTranslator, MessageKey, Messages, PluralKey, Vars }
export type Language = (typeof SUPPORTED_LANGUAGES)[number]

// ⚠️ Each translation is its OWN chunk, loaded when it is the language in use,
// so nobody parses seven other languages before the first paint. English stays
// in the bundle: it is the fallback for every key and what `runtime.ts` reads.
const LOADERS: Record<string, () => Promise<Messages>> = {
  fr: () => import('./fr').then((m) => m.fr),
  es: () => import('./es').then((m) => m.es),
  it: () => import('./it').then((m) => m.it),
  de: () => import('./de').then((m) => m.de),
  'pt-BR': () => import('./pt-BR').then((m) => m.ptBR),
  'pt-PT': () => import('./pt-PT').then((m) => m.ptPT),
  tr: () => import('./tr').then((m) => m.tr),
}
const loadedDicts = new Set<string>()
const loadingDicts = new Map<string, Promise<void>>()

/** The one dictionary `lang` reads first — the same choice `runtime.ts`'s chain makes. */
function dictFor(lang: string): string | null {
  const l = lang.replace('_', '-').toLowerCase()
  if (l === 'pt-br') return 'pt-BR'
  if (l.startsWith('pt')) return 'pt-PT'
  if (LOADERS[l]) return l
  const base = l.split('-')[0]
  return LOADERS[base] ? base : null
}

function languageReady(lang: string): boolean {
  const code = dictFor(lang)
  return !code || loadedDicts.has(code)
}

/** Fetch and register `lang`'s dictionary. Null when there is nothing to wait for. */
function loadLanguage(lang: string): Promise<void> | null {
  const code = dictFor(lang)
  if (!code || loadedDicts.has(code)) return null
  let p = loadingDicts.get(code)
  if (!p) {
    p = LOADERS[code]()
      .then((dict) => {
        registerLanguages({ [code]: dict })
        loadedDicts.add(code)
      })
      .finally(() => loadingDicts.delete(code))
    loadingDicts.set(code, p)
  }
  return p
}

// Start on the likely language while the SDK is still booting, so the chunk is
// usually here before <I18nRoot> first asks. A guess only — the SDK's answer is
// what <I18nRoot> waits on — so it reads the SDK's saved choices (this app's,
// then the suite's) and the device's languages, and loads at most two.
try {
  const guesses = [
    localStorage.getItem('universal:language:signatures'),
    localStorage.getItem('universal:language'),
    ...(navigator.languages ?? [navigator.language]),
  ]
  const first = guesses.find((g) => g && (g.toLowerCase().startsWith('en') || dictFor(g)))
  if (first) loadLanguage(first)?.catch(() => {})
} catch {
  // No storage (private mode, a locked-down WebView): <I18nRoot> loads it anyway.
}

// Bumped each time a dictionary arrives, so every `useT()` re-renders with it.
const DictVersion = createContext(0)

export interface Translator extends BasicTranslator {
  /**
   * A sentence with React nodes in it: `t.rich('menu.contact', { link: <a…/> })`
   * for "{link} to request a language". Text around the nodes stays one string,
   * so a translator can move the link to wherever the sentence needs it.
   */
  rich(key: MessageKey, nodes: Record<string, ReactNode>, vars?: Vars): ReactNode
  lang: Language
}

export function makeTranslator(lang: Language): Translator {
  const t = makeBasicTranslator(lang) as Translator
  t.rich = (key, nodes, vars) => {
    const parts = fill(lookup(lang, key), vars).split(/(\{\w+\})/)
    return parts.map((part, i) => {
      const m = /^\{(\w+)\}$/.exec(part)
      return <Fragment key={i}>{m && m[1] in nodes ? nodes[m[1]] : part}</Fragment>
    })
  }
  return t
}

/** The translator for a component. Re-renders when the language changes. */
export function useT(): Translator {
  const { language } = useLanguage()
  const version = useContext(DictVersion)
  return useMemo(() => makeTranslator(language), [language, version])
}

/**
 * Mount once, just inside <UniversalProvider>. Keeps `getT()` and `<html lang>`
 * on the suite language. Set during render, not in an effect, so the children
 * rendered in this same pass already see it.
 */
export function I18nRoot({ children }: { children: ReactNode }) {
  // `language` is the EFFECTIVE one: this app's override, else the global.
  const { language } = useLanguage()
  setActiveLanguage(language)
  if (typeof document !== 'undefined' && document.documentElement.lang !== language) {
    document.documentElement.lang = language
  }
  // The dictionary for `language`, if it isn't here yet. The FIRST paint waits
  // for it (a few ms: it is precached, or on disk in the native apps) rather
  // than flashing English at a French reader; a switch later on keeps the app
  // mounted and re-renders once it lands. The timeout is for the one case
  // where it can't land — offline before the service worker has it — so the
  // app opens in English rather than not at all.
  const [version, setVersion] = useState(0)
  const [started, setStarted] = useState(() => languageReady(language))
  // Whether THIS render could already read the dictionary. ⚠️ The prefetch
  // above can land between this render and the effect below, which then finds
  // nothing to load — and without a bump the screen stays in the English it
  // was just rendered in (seen with de-DE and pt-BR browsers).
  const readyAtRender = languageReady(language)
  useEffect(() => {
    const pending = loadLanguage(language)
    if (!pending) {
      if (!readyAtRender) setVersion((v) => v + 1)
      setStarted(true)
      return
    }
    let live = true
    const giveUp = window.setTimeout(() => setStarted(true), 4000)
    pending
      .catch((e) => console.warn(`[i18n] ${language} failed to load; using English`, e))
      .finally(() => {
        window.clearTimeout(giveUp)
        if (!live) return
        setVersion((v) => v + 1)
        setStarted(true)
      })
    return () => {
      live = false
      window.clearTimeout(giveUp)
    }
  }, [language, readyAtRender])
  if (!started) return null
  return <DictVersion.Provider value={version}>{children}</DictVersion.Provider>
}
