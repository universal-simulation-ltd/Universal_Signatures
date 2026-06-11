export type SignatureMode = 'draw' | 'type'

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
  created_at: string
  verified: boolean
}

// The verify page resolves a cert id to either kind of record.
export type AnyVerifyResult =
  | { kind: 'signing'; data: SigningEventResult }
  | { kind: 'signature'; data: VerifyResult }

// Why the cloud-save action is or isn't available for the current visitor.
export type CloudGate =
  | { state: 'loading' }
  | { state: 'signed_out' }
  | { state: 'entitled'; via: 'subscription' | 'token' | 'project' }
  | { state: 'blocked' }
