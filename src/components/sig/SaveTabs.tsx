import { useId, useState } from 'react'
import { Chip } from '@unisim/sdk'
import LocalSavePanel from './LocalSavePanel'
import { useT } from '../../i18n'

// Save your signature — a collapsed-by-default card. It keeps signatures in
// this browser, and Save to a file / Open a file carries them to another
// device. No account: the "Online" tab that saved a signature against a
// Universal ID was removed on 2026-10-20 (Docs_UNI_SIM/login-free-plan.md).
// The file keeps its old name so history and links to it still find it.
export default function SaveTabs() {
  const t = useT()
  const [open, setOpen] = useState(false)
  const panelId = useId()

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
        <Chip size="sm">{t('save.local_no_account')}</Chip>
      </div>
      {open && (
        <div id={panelId} className="mt-4">
          <LocalSavePanel bare />
        </div>
      )}
    </div>
  )
}
