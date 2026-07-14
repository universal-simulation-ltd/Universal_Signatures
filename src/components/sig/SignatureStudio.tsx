import { useSigStore } from '../../stores/sigStore'
import type { StudioMode } from '../../lib/types'
import SignaturePad from './SignaturePad'
import TypeSignature from './TypeSignature'
import PhoneSignPanel from './PhoneSignPanel'
import ApplyToPdf from './ApplyToPdf'
import LocalSavePanel from './LocalSavePanel'
import CloudSavePanel from './CloudSavePanel'

const MODES: { id: StudioMode; label: string }[] = [
  { id: 'draw', label: 'Draw' },
  { id: 'type', label: 'Type' },
  { id: 'phone', label: 'Sign on phone' },
]

export default function SignatureStudio() {
  const mode = useSigStore((s) => s.mode)
  const setMode = useSigStore((s) => s.setMode)

  return (
    <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Create signature */}
        <section className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">Create your signature</h2>
            <div className="inline-flex rounded-md bg-slate-100 p-0.5">
              {MODES.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className={`rounded px-3 py-1 text-xs font-semibold ${mode === m.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-4">
            {mode === 'type' ? <TypeSignature /> : mode === 'phone' ? <PhoneSignPanel /> : <SignaturePad />}
          </div>
          <p className="mt-3 text-xs text-slate-500">
            Everything here runs in your browser. Use your signature to sign a PDF on the right — for free, no account
            needed.
          </p>
        </section>

        {/* Use + save */}
        <div className="space-y-6">
          <ApplyToPdf />
          <LocalSavePanel />
          <CloudSavePanel />
        </div>
      </div>
    </div>
  )
}
