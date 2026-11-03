// Signing inside another Universal App (Universal Invoices' Sign button,
// James 2026-11-03: "Try Universal Signatures with a link to Open in
// Universal PDF also for full options"). The app is framed at
// `/signatures/?embed`; the page that framed it posts the PDF in, and the
// signed copy goes back to it instead of downloading.
//
// ⚠️ Only a parent page on this same site is listened to or answered: this
// app can be framed by anyone (no frame-ancestors), and a signed PDF carries
// the signature saved in this browser. In development the apps run on
// different ports, so any origin is accepted there.

export const EMBEDDED = typeof window !== 'undefined' && window.parent !== window && new URLSearchParams(window.location.search).has('embed')

const trusted = (origin: string) => origin === window.location.origin || import.meta.env.DEV

let parentOrigin: string | null = null

/** Calls `onPdf` with each PDF the parent sends; tells the parent it is ready. Returns the unsubscribe. */
export function receivePdfs(onPdf: (file: File) => void): () => void {
  const onMessage = (e: MessageEvent) => {
    const m = e.data as { type?: string; name?: string; bytes?: ArrayBuffer } | null
    if (e.source !== window.parent || !trusted(e.origin) || m?.type !== 'unisim-sign/pdf' || !(m.bytes instanceof ArrayBuffer)) return
    parentOrigin = e.origin
    onPdf(new File([m.bytes], m.name || 'document.pdf', { type: 'application/pdf' }))
  }
  window.addEventListener('message', onMessage)
  window.parent.postMessage({ type: 'unisim-sign/ready' }, import.meta.env.DEV ? '*' : window.location.origin)
  return () => window.removeEventListener('message', onMessage)
}

/** The signed copy, back to the page that sent the PDF. False if no such page. */
export function sendSigned(name: string, bytes: Uint8Array, verifyUrl: string | null): boolean {
  if (!parentOrigin) return false
  const copy = bytes.slice().buffer
  window.parent.postMessage({ type: 'unisim-sign/signed', name, bytes: copy, verifyUrl }, parentOrigin, [copy])
  return true
}
