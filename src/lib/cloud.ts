'use client'

import { useUniversal, useSubscription, useCredits, useProjects } from '@unisim/sdk'
import type { SupabaseClient } from '@supabase/supabase-js'
import { sha256Hex } from './signature'
import type { AnyVerifyResult, CloudGate, SignatureMode, VerifyResult } from './types'

// ── The gate ────────────────────────────────────────────────────────────────
// Saving a verified signature to the cloud costs us hosting, so it's gated on
// the org having ANY of: an active paid subscription, a positive token/credit
// balance, or at least one project. Otherwise the user is shown the "self-host
// for free" block (CloudSavePanel). Anonymous visitors are asked to create /
// sign in with a Universal ID first.
export function useCloudGate(): CloudGate {
  const { session, loading: provLoading } = useUniversal()
  const { subscription, loading: subLoading } = useSubscription()
  const { credits, loading: creditsLoading } = useCredits()
  const { projects, loading: projLoading } = useProjects()

  const signedIn = !!session?.user && session.user.is_anonymous !== true

  if (provLoading) return { state: 'loading' }
  if (!signedIn) return { state: 'signed_out' }
  if (subLoading || creditsLoading || projLoading) return { state: 'loading' }

  const hasSub = !!subscription && subscription.status === 'active' && subscription.tier !== 'free'
  if (hasSub) return { state: 'entitled', via: 'subscription' }
  if ((credits ?? 0) > 0) return { state: 'entitled', via: 'token' }
  if ((projects?.length ?? 0) > 0) return { state: 'entitled', via: 'project' }
  return { state: 'blocked' }
}

// ── Save ────────────────────────────────────────────────────────────────────
export interface SaveInput {
  signerName: string
  style: SignatureMode
  font: string | null
  imageDataUrl: string
}

export async function saveSignature(
  supabase: SupabaseClient,
  orgId: string | null,
  userId: string | null,
  input: SaveInput,
): Promise<{ ok: boolean; certId?: string; error?: string }> {
  if (!orgId || !userId) return { ok: false, error: 'Sign in with your Universal ID to save.' }
  const signature_hash = await sha256Hex(input.imageDataUrl)
  const { data, error } = await supabase
    .from('signatures')
    .insert({
      org_id: orgId,
      user_id: userId,
      signer_name: input.signerName.trim() || null,
      style: input.style,
      font: input.font,
      image_data: input.imageDataUrl,
      signature_hash,
    })
    .select('cert_id')
    .single()
  if (error) return { ok: false, error: error.message }
  return { ok: true, certId: (data as { cert_id: string }).cert_id }
}

// ── Free token hold ──────────────────────────────────────────────────────────
// Storing a signature on a FREE account uses the app's own free token while
// it's kept (one free returnable token PER Universal App — universal-platform
// migration 0045; the RPC spends it before any purchased wallet credits).
// Removing the signature releases + refunds it. Paid/project-entitled accounts
// don't touch the token, so the caller only holds when entitled `via: 'token'`.
export function friendlyTokenError(msg: string): string {
  if (msg.includes('token_in_use:')) {
    const what = msg.split('token_in_use:')[1]?.trim() || 'a stored signature'
    return `Your free Signatures token is already in use (${what}). Remove it or add a token to store another signature.`
  }
  if (msg.includes('no_credits')) return 'No tokens available — add a token to store a signature on the cloud.'
  return msg
}

export async function holdSignatureToken(
  supabase: SupabaseClient,
  certId: string,
): Promise<{ ok: boolean; error?: string }> {
  const { error } = await supabase.rpc('acquire_token_hold', {
    p_app: 'signatures',
    p_resource_id: certId,
    p_label: 'Universal Signature',
    p_refundable: true,
  })
  if (error) return { ok: false, error: friendlyTokenError(error.message) }
  return { ok: true }
}

// Delete a stored signature and return the token it was holding (if any). We
// delete the row first; the release/refund is best-effort after.
export async function removeStoredSignature(
  supabase: SupabaseClient,
  certId: string,
): Promise<{ ok: boolean; error?: string }> {
  const { error } = await supabase.from('signatures').delete().eq('cert_id', certId)
  if (error) return { ok: false, error: error.message }
  await supabase.rpc('release_token_hold', { p_app: 'signatures', p_resource_id: certId })
  return { ok: true }
}

// ── Signing-event record (free for any signed-in Universal ID) ────────────────
// A verifiable "this PDF was signed via Universal Signatures" record. We store
// only the metadata (signer email, filename, document hash, time) — never the
// PDF — so this is free for signed-in users and isn't behind the cloud gate.
export interface SigningRecordInput {
  signerEmail: string
  originalFilename: string
  documentHash: string   // SHA-256 of the ORIGINAL PDF bytes (pre-stamp)
  signatureId?: string | null
}

export async function recordSigningEvent(
  supabase: SupabaseClient,
  orgId: string | null,
  userId: string | null,
  input: SigningRecordInput,
): Promise<{ ok: boolean; certId?: string; error?: string }> {
  if (!orgId || !userId) return { ok: false, error: 'Sign in with your Universal ID to create a verifiable record.' }
  const { data, error } = await supabase
    .from('signing_events')
    .insert({
      org_id: orgId,
      user_id: userId,
      signer_email: input.signerEmail,
      original_filename: input.originalFilename,
      document_hash: input.documentHash,
      signature_id: input.signatureId ?? null,
    })
    .select('cert_id')
    .single()
  if (error) return { ok: false, error: error.message }
  return { ok: true, certId: (data as { cert_id: string }).cert_id }
}

// ── Verify (public) ──────────────────────────────────────────────────────────
// Reads minimal public fields via SECURITY DEFINER RPCs so a cert can be
// verified by anyone holding the (unguessable) cert id, without opening RLS.
export async function verifyCert(supabase: SupabaseClient, certId: string): Promise<VerifyResult | null> {
  const { data, error } = await supabase.rpc('verify_signature_cert', { p_cert: certId })
  if (error || !data) return null
  const row = Array.isArray(data) ? data[0] : data
  if (!row) return null
  return {
    cert_id: certId,
    signer_name: row.signer_name ?? null,
    org_name: row.org_name ?? null,
    signature_hash: row.signature_hash ?? '',
    created_at: row.created_at ?? '',
    verified: true,
  }
}

// A cert link (e.g. from a scanned QR) can point at either a signing event or a
// saved signature. Resolve signing events first (the QR case), then fall back.
export async function verifyAny(supabase: SupabaseClient, certId: string): Promise<AnyVerifyResult | null> {
  const { data } = await supabase.rpc('verify_signing_event_cert', { p_cert: certId })
  const row = Array.isArray(data) ? data[0] : data
  if (row) {
    return {
      kind: 'signing',
      data: {
        cert_id: certId,
        signer_email: row.signer_email ?? '',
        org_name: row.org_name ?? null,
        original_filename: row.original_filename ?? '',
        document_hash: row.document_hash ?? '',
        created_at: row.created_at ?? '',
        verified: true,
      },
    }
  }
  const sig = await verifyCert(supabase, certId)
  return sig ? { kind: 'signature', data: sig } : null
}
