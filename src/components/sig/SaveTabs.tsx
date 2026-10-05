import { useEffect, useId, useRef, useState } from 'react'
import { useUniversal } from '@unisim/sdk'
import LocalSavePanel from './LocalSavePanel'
import CloudSavePanel from './CloudSavePanel'
import { useT } from '../../i18n'

type Tab = 'local' | 'online'

// Save your signature — a collapsed-by-default card with two tabs. "On this
// device" keeps it in this browser (no account); "Online" saves a verified
// copy to the cloud against a Universal ID. Defaults to Online when signed in,
// Local otherwise.
export default function SaveTabs() {
  const t = useT()
  const { session, loading } = useUniversal()
  const signedIn = !!session?.user && session.user.is_anonymous !== true

  const [open, setOpen] = useState(false)
  const panelId = useId()
  const [tab, setTab] = useState<Tab>('local')
  const touched = useRef(false)

  // Pick the sensible default once auth resolves — but never override a tab the
  // user has clicked themselves.
  useEffect(() => {
    if (loading || touched.current) return
    setTab(signedIn ? 'online' : 'local')
  }, [loading, signedIn])

  const choose = (next: Tab) => { touched.current = true; setTab(next) }

  const TABS: { id: Tab; label: string }[] = [
    { id: 'local', label: t('save.tabs_local') },
    { id: 'online', label: t('save.tabs_online') },
  ]

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls={panelId}
          className="-m-1 flex items-center gap-1.5 rounded p-1 text-sm font-bold text-slate-900"
        >
          {t('save.tabs_title')}
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className={`text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
        {open && (
          <div className="inline-flex rounded-md bg-slate-100 p-0.5">
            {TABS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => choose(item.id)}
                aria-pressed={tab === item.id}
                className={`rounded px-3 py-1 text-xs font-semibold ${tab === item.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
      {open && (
        <div id={panelId} className="mt-4">
          {tab === 'local' ? <LocalSavePanel bare /> : <CloudSavePanel bare />}
        </div>
      )}
    </div>
  )
}
