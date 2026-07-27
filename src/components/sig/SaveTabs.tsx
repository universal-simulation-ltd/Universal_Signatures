import { useEffect, useRef, useState } from 'react'
import { useUniversal } from '@unisim/sdk'
import LocalSavePanel from './LocalSavePanel'
import CloudSavePanel from './CloudSavePanel'

type Tab = 'local' | 'online'

// Save your signature — a collapsed-by-default card with two tabs. "Local
// (temporary)" keeps it in this browser (no account); "Online" saves a verified
// copy to the cloud against a Universal ID. Defaults to Online when signed in,
// Local otherwise.
export default function SaveTabs() {
  const { session, loading } = useUniversal()
  const signedIn = !!session?.user && session.user.is_anonymous !== true

  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<Tab>('local')
  const touched = useRef(false)

  // Pick the sensible default once auth resolves — but never override a tab the
  // user has clicked themselves.
  useEffect(() => {
    if (loading || touched.current) return
    setTab(signedIn ? 'online' : 'local')
  }, [loading, signedIn])

  const choose = (t: Tab) => { touched.current = true; setTab(t) }

  const TABS: { id: Tab; label: string }[] = [
    { id: 'local', label: 'Local (temporary)' },
    { id: 'online', label: 'Online' },
  ]

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="-m-1 flex items-center gap-1.5 rounded p-1 text-sm font-bold text-slate-900"
        >
          Save your signature
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
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => choose(t.id)}
                className={`rounded px-3 py-1 text-xs font-semibold ${tab === t.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        )}
      </div>
      {open && (
        <div className="mt-4">
          {tab === 'local' ? <LocalSavePanel bare /> : <CloudSavePanel bare />}
        </div>
      )}
    </div>
  )
}
