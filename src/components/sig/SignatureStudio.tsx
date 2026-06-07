import { useSigStore } from '../../stores/sigStore'
import SignaturePad from './SignaturePad'
import TypeSignature from './TypeSignature'
import ApplyToPdf from './ApplyToPdf'
import CloudSavePanel from './CloudSavePanel'

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
              {(['draw', 'type'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`rounded px-3 py-1 text-xs font-semibold capitalize ${mode === m ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-4">
            {mode === 'draw' ? <SignaturePad /> : <TypeSignature />}
          </div>
          <p className="mt-3 text-xs text-slate-500">
            Everything here runs in your browser. Use your signature to sign a PDF on the right — for free, no account
            needed.
          </p>
        </section>

        {/* Use + save */}
        <div className="space-y-6">
          <ApplyToPdf />
          <CloudSavePanel />
        </div>
      </div>
    </div>
  )
}
