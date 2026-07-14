import { useEffect, useRef, useState } from 'react'
import { useUniversal } from '@unisim/sdk'
import LocalSavePanel from './LocalSavePanel'
import CloudSavePanel from './CloudSavePanel'

type Tab = 'local' | 'online'

// Save your signature — a single card with two tabs. "Local (temporary)" keeps
// it in this browser (no account); "Online" saves a verified copy to the cloud
// against a Universal ID. Defaults to Online when signed in, Local otherwise.
export default function SaveTabs() {
  const { session, loading } = useUniversal()
  const signedIn = !!session?.user && session.user.is_anonymous !== true

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
      <div className="mb-4 flex items-center justify-between gap-2">
        <h2 className="text-sm font-bold text-slate-900">Save your signature</h2>
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
      </div>
      {tab === 'local' ? <LocalSavePanel bare /> : <CloudSavePanel bare />}
    </div>
  )
}
