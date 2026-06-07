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

// Public fields returned by the verify RPC (no org/user internals).
export interface VerifyResult {
  cert_id: string
  signer_name: string | null
  org_name: string | null
  signature_hash: string
  created_at: string
  verified: boolean
}

// Why the cloud-save action is or isn't available for the current visitor.
export type CloudGate =
  | { state: 'loading' }
  | { state: 'signed_out' }
  | { state: 'entitled'; via: 'subscription' | 'token' | 'project' }
  | { state: 'blocked' }
