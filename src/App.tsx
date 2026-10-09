import { DefaultViewSelect, UniversalAppsNavBar, UpdateNotice } from '@unisim/sdk'
// Generated — `npm run credits` after any dependency change. Never edit it by
// hand: it is read off the installed tree, so a hand-kept list drifts from the
// lockfile the first time anyone upgrades anything, and a credits list naming a
// package we removed is worse than no list at all.
import credits from './generated/credits.json'
import ProductLogo from './components/Header/ProductLogo'
import SignatureStudio from './components/sig/SignatureStudio'
import { CONTAINER } from './lib/layout'
import SignMobilePage from './components/sig/SignMobilePage'
import VerifyPage from './components/sig/VerifyPage'
import SignRequestPage from './components/sig/SignRequestPage'
import { parseExpiry } from './lib/mobileSign'
import { KNOWLEDGE_BASE } from './knowledge'
import { useT } from './i18n'
import { useTouchPhone } from './lib/useCoarsePointer'

const REPO_URL = 'https://github.com/universal-simulation-ltd/Universal_Signatures'

// Tiny path router: /signatures/verify/<cert> → verify page; `?sign=<token>` →
// the phone signing page (opened from the desktop QR); `?signdoc=<token>` → the
// page for someone asked to sign a document; everything else → the studio. These links are opened fresh, so a load-time check is enough (no
// client-router dependency).
function route():
  | { name: 'verify'; certId: string }
  | { name: 'signMobile'; token: string; expiresAt: number | null }
  | { name: 'signRequest'; token: string }
  | { name: 'studio' } {
  const params = new URLSearchParams(window.location.search)
  const token = params.get('sign')
  if (token) return { name: 'signMobile', token, expiresAt: parseExpiry(params.get('exp')) }
  // A "Send to be signed" link, opened by the person asked to sign.
  const signdoc = params.get('signdoc')
  if (signdoc) return { name: 'signRequest', token: signdoc }

  const base = import.meta.env.BASE_URL
  const path = window.location.pathname
  const rel = (path.startsWith(base) ? path.slice(base.length) : path.replace(/^\//, ''))
  const m = rel.match(/^verify\/(.+)$/)
  if (m) return { name: 'verify', certId: decodeURIComponent(m[1]) }
  return { name: 'studio' }
}

export default function App() {
  const t = useT()
  const r = route()
  // The studio has no "Sign on phone" on a phone (see SignatureStudio), so this
  // row does not offer it there either. A tablet keeps it.
  const phone = useTouchPhone()

  // The phone signing page is a standalone full-screen view — no navbar/footer.
  if (r.name === 'signMobile') return <SignMobilePage token={r.token} expiresAt={r.expiresAt} />
  return (
    <div className="flex flex-col min-h-screen bg-slate-100">
      <UniversalAppsNavBar
        product="signatures"
        productLogo={<ProductLogo />}
        // "About this app" — drawn by the SDK at the foot of "Tune this app"
        // (SDK 0.161.0+). It was the only row of the Advanced actions menu, which
        // now holds the knowledge base instead (below).
        about={{
          repo:    REPO_URL,
          proof:   `${REPO_URL}/blob/main/PRIVACY.md`,
          subject: t('app.about_subject'),
          except:  t('app.about_except'),
          version: __APP_VERSION__,
          credits,
          noticesHref: `${REPO_URL}/blob/main/THIRD-PARTY-NOTICES.md`,
        }}
        // Actions ▸ Advanced ▸ Knowledge base (SDK 0.163.0): this app's own
        // articles, bundled from ./knowledge so they read offline.
        knowledgeBase={KNOWLEDGE_BASE}
        productHomeHref={import.meta.env.BASE_URL}
        suiteSwitcherIconSrc={`${import.meta.env.BASE_URL}unisim-icon.png`}
        contentClassName={CONTAINER}
        // The mode Create your signature opens on — the twin of double-tapping
        // a mode, for anybody who cannot double-tap (James, 2026-09-30). No
        // onResetDefaults: nothing of this app's own persists, and the SDK's
        // Reset clears this row by itself.
        appPreferences={
          <DefaultViewSelect
            id="mode"
            label={t('app.pref_opens_on')}
            fallback="draw"
            views={[
              { value: 'draw', label: t('create.mode_draw') },
              { value: 'type', label: t('create.mode_type') },
              ...(phone ? [] : [{ value: 'phone' as const, label: t('create.mode_phone') }]),
            ]}
          />
        }
      />

      {/* Renders nothing until this tab is genuinely running superseded code.
          See the SDK's useAppUpdate: an autoUpdate PWA hands the new worker
          control but leaves the running page on its old JavaScript. */}
      {/* ⚠️ `empty:hidden` is load-bearing, not tidiness. UpdateNotice renders
          null unless this tab is genuinely running superseded code — which is
          almost always — so the `pt-4` sat there permanently as a dead ~16px
          band between the nav bar's bottom stroke and the page content. The
          owner spotted it on the phone (2026-08-30) and was right that the
          bar's own border is the separator. React puts no whitespace text
          nodes between JSX children, so with the notice gone the div genuinely
          matches `:empty` and collapses, padding and all; when a notice does
          render, the padding comes back. */}
      <div className={`${CONTAINER} pt-4 empty:hidden`}>
        <UpdateNotice />
      </div>

      <main className="flex-1">
        {r.name === 'verify'
          ? <VerifyPage certId={r.certId} />
          : r.name === 'signRequest'
            ? <SignRequestPage token={r.token} />
            : <SignatureStudio />}
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className={`${CONTAINER} py-4 flex flex-row items-center gap-3 text-xs text-slate-500`}>
          <span>
            {t.rich('app.footer_with_love', {
              heart: (
                <>
                  <span aria-hidden="true" className="text-orange-600">&hearts;</span>
                  <span className="sr-only">{t('app.footer_love_sr')}</span>
                </>
              ),
              link: (
                <a href="https://www.unisim.co.uk" target="_blank" rel="noreferrer" className="text-slate-700 hover:text-orange-700 underline-offset-2 hover:underline">
                  UNISIM.co.uk
                </a>
              ),
            })}
          </span>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noreferrer"
            aria-label={t('app.github_aria')}
            className="ml-auto shrink-0 inline-flex items-center gap-1.5 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
              <path d="M12 .5C5.65.5.5 5.65.5 12.02c0 5.09 3.29 9.4 7.86 10.92.57.1.78-.25.78-.55 0-.27-.01-1-.02-1.96-3.2.69-3.87-1.54-3.87-1.54-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.7 1.25 3.36.95.1-.74.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.18 1.18.92-.26 1.91-.39 2.89-.39.98 0 1.97.13 2.89.39 2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.8 1.18 1.82 1.18 3.08 0 4.42-2.69 5.39-5.26 5.68.41.35.77 1.05.77 2.12 0 1.53-.01 2.76-.01 3.14 0 .3.21.66.79.55 4.57-1.52 7.86-5.83 7.86-10.92C23.5 5.65 18.35.5 12 .5z" />
            </svg>
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </footer>
    </div>
  )
}
