'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useUniversal, useOrg, useSubscription, useCredits, useProjects, useAppFreeToken } from '@unisim/sdk'
import type { SupabaseClient } from '@supabase/supabase-js'
import { sha256Hex } from './signature'
import type { AnyVerifyResult, CloudGate, SavedSignature, SignatureMode, VerifyResult } from './types'

// ── The gate ────────────────────────────────────────────────────────────────
// Saving a verified signature to the cloud costs us hosting, so it's gated on
// the org having ANY of: an active paid subscription, this app's free token
// (migration 0045 — a missing row means available), a positive purchased
// token/credit balance, or at least one project. Otherwise the free allowance
// is used up and CloudSavePanel says so. Anonymous visitors are asked to create /
// sign in with a Universal ID first.
//
// `refresh` re-reads the free token and the credit balance — after a stored
// signature is saved or removed, so a blocked panel becomes entitled again (and
// vice versa) without a reload.
export function useCloudGate(): CloudGate & { refresh: () => void } {
  const { session, loading: provLoading } = useUniversal()
  const { org, loading: orgLoading } = useOrg()
  const { subscription, loading: subLoading } = useSubscription()
  const { credits, loading: creditsLoading, refresh: refreshCredits } = useCredits()
  const { projects, loading: projLoading } = useProjects()
  const { status: freeToken, loading: freeLoading, refresh: refreshFreeToken } = useAppFreeToken('signatures')
  const refresh = useCallback(() => {
    refreshFreeToken()
    refreshCredits()
  }, [refreshFreeToken, refreshCredits])

  const signedIn = !!session?.user && session.user.is_anonymous !== true
  const orgId = org?.id ?? null
  const anyDataLoading = subLoading || creditsLoading || projLoading || freeLoading

  // Know when the subscription/credits/projects data has actually been fetched
  // for the CURRENT org. Those hooks short-circuit to `loading:false` with empty
  // data while `org` is still null, and lag one render after `org` resolves — so
  // a bare `!loading` check can't tell "stale/not-yet-fetched" from "checked and
  // genuinely empty". We only trust the data once we've seen its loading flip
  // true→false for this org; otherwise the gate would momentarily read `blocked`
  // and flash the "self-host / sign up" placeholder before the check completes.
  const fetchStartedForOrg = useRef<string | null>(null)
  if (anyDataLoading && orgId) fetchStartedForOrg.current = orgId
  const dataReady = !!orgId && !anyDataLoading && fetchStartedForOrg.current === orgId
  // The last settled answer for this org: a refresh re-checks in the background
  // instead of flashing "Checking your account…" over the panel.
  const settled = useRef<{ orgId: string; gate: CloudGate } | null>(null)

  if (provLoading) return { state: 'loading', refresh }
  if (!signedIn) return { state: 'signed_out', refresh }
  // Signed in but the account isn't checked yet: keep showing "Checking your
  // account…" until the org resolves and its entitlement data is in.
  if (orgLoading) return { state: 'loading', refresh }
  if (orgId && !dataReady) {
    const last = settled.current
    return last && last.orgId === orgId ? { ...last.gate, refresh } : { state: 'loading', refresh }
  }

  const gate = decideGate()
  if (orgId) settled.current = { orgId, gate }
  return { ...gate, refresh }

  function decideGate(): CloudGate {
    const hasSub = !!subscription && subscription.status === 'active' && subscription.tier !== 'free'
    if (hasSub) return { state: 'entitled', via: 'subscription' }
    // acquire_token_hold spends the free token before purchased credits, so both
    // take the same 'token' path in CloudSavePanel.
    if (freeToken === 'available') return { state: 'entitled', via: 'token' }
    if ((credits ?? 0) > 0) return { state: 'entitled', via: 'token' }
    if ((projects?.length ?? 0) > 0) return { state: 'entitled', via: 'project' }
    return { state: 'blocked' }
  }
}

// ── Your stored signatures ───────────────────────────────────────────────────
// Every signature stored against the workspace, newest first, so one saved in
// an earlier session can still be seen and removed. RLS (platform 0028) lets
// any member read the org's rows but only the owner delete one, so a
// colleague's row is listed without a Remove button.
export type StoredSignature = SavedSignature & { user_id: string; image_data: string }

const STORED_COLUMNS = 'id, user_id, signer_name, style, font, image_data, signature_hash, cert_id, created_at'

export function useStoredSignatures(orgId: string | null | undefined, signedIn: boolean) {
  const { supabase } = useUniversal()
  const [rows, setRows] = useState<StoredSignature[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    if (!orgId || !signedIn) {
      setRows([])
      setLoading(false)
      setError(null)
      return
    }
    let cancelled = false
    setLoading(true)
    supabase
      .from('signatures')
      .select(STORED_COLUMNS)
      .eq('org_id', orgId)
      .order('created_at', { ascending: false })
      .then(({ data, error: err }) => {
        if (cancelled) return
        setRows(err ? [] : ((data ?? []) as StoredSignature[]))
        setError(err ? 'Could not load your stored signatures.' : null)
        setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [supabase, orgId, signedIn, tick])

  const refresh = useCallback(() => setTick((t) => t + 1), [])
  return { rows, loading, error, refresh }
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
  // Only reached at the limit, so this is the one place the allowance is
  // mentioned — number-free, as the free limits are set to change.
  if (msg.includes('token_in_use') || msg.includes('no_credits')) {
    return 'You’ve used your free signature storage. Remove a stored signature to make room, or get more.'
  }
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
): Promise<{ ok: boolean; certId?: string; recordedAt?: string; error?: string }> {
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
    // created_at comes back too: it is the SERVER's timestamp, the only
    // trustworthy time in the record. The certificate page prints it as such,
    // with the signer's own clock shown separately and labelled self-reported.
    .select('cert_id, created_at')
    .single()
  if (error) return { ok: false, error: error.message }
  const row = data as { cert_id: string; created_at: string }
  return { ok: true, certId: row.cert_id, recordedAt: row.created_at }
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
