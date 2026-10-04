export type SignatureMode = 'draw' | 'type'

/**
 * Sign a PDF's `pageIndex` value that stamps the signature on every page. Kept
 * here rather than in lib/pdf so the UI can use it without pulling pdf-lib
 * into the first-load bundle.
 */
export const ALL_PAGES = -2

/**
 * Sign a PDF's `pageIndex` value for "initials on every page, the full
 * signature on the last" — the way a multi-page contract is usually signed.
 */
export const INITIAL_PAGES = -3

// The create-signature tab. 'phone' is a capture method (draw on your phone via
// a QR handoff) that yields a drawn image — once received the studio drops back
// to 'draw', so a saved signature's `style` is only ever 'draw' | 'type'.
export type StudioMode = SignatureMode | 'phone'

export interface SavedSignature {
  id: string
  signer_name: string | null
  style: SignatureMode
  font: string | null
  signature_hash: string
  cert_id: string
  created_at: string
}

// Public fields returned by the saved-signature verify RPC (no org/user internals).
export interface VerifyResult {
  cert_id: string
  signer_name: string | null
  org_name: string | null
  signature_hash: string
  created_at: string
  verified: boolean
}

// Public fields returned by the signing-event verify RPC — what a QR scan
// resolves to: who signed which document, and when.
export interface SigningEventResult {
  cert_id: string
  signer_email: string
  org_name: string | null
  original_filename: string
  document_hash: string
  /** SHA-256 of the signed copy as it was produced (platform 0242); null for
   *  records made before that, or whose signer's browser couldn't store it. */
  signed_hash: string | null
  created_at: string
  verified: boolean
}

// A "Send to be signed" request's public certificate (verify_pdf_sign_cert,
// platform 0058) — shared with Universal PDF's send-to-sign.
export interface RequestCertResult {
  cert_id: string
  doc_name: string
  status: 'pending' | 'signed' | 'partially_signed' | 'completed'
  created_at: string
  original_sha256: string | null
  latest_sha256: string | null
  bytes_available: boolean
  parties: { role: string; email: string | null; status: string; signed_at: string | null }[]
  events: { action: string; actor_email: string | null; occurred_at: string; ip_country: string | null }[]
}

// The verify page resolves a cert id to any of the three kinds of record.
export type AnyVerifyResult =
  | { kind: 'signing'; data: SigningEventResult }
  | { kind: 'request'; data: RequestCertResult }
  | { kind: 'signature'; data: VerifyResult }

// Why the cloud-save action is or isn't available for the current visitor.
export type CloudGate =
  | { state: 'loading' }
  | { state: 'signed_out' }
  | { state: 'entitled'; via: 'subscription' | 'token' | 'project' }
  | { state: 'blocked' }
  // Signed in, but the Universal ID belongs to no company yet, so there is
  // nowhere to store a signature (signatures.org_id is required).
  | { state: 'no_company' }
