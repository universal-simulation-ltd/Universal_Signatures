'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useUniversal, useOrg, useSubscription, useCredits, useProjects, useAppFreeToken } from '@unisim/sdk'
import type { SupabaseClient } from '@supabase/supabase-js'
import { sha256Hex } from './signature'
import type { AnyVerifyResult, CloudGate, RequestCertResult, SavedSignature, SignatureMode, VerifyResult } from './types'

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
  const { org, orgs, loading: orgLoading, error: orgError } = useOrg()
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
  // No company at all. Since 2026-10-02 the hub no longer makes every new ID
  // create one at sign-in, so this is a normal state, not a broken one — say
  // so, instead of falling through to "you've used your free storage". Only a
  // SUCCESSFUL empty read counts: an org query error is "unknown" (SDK rule).
  if (!orgError && orgs.length === 0) return { state: 'no_company', refresh }
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
    return 'You’ve used your free signature storage. Remove a stored signature to make room.'
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
  if (!userId) return { ok: false, error: 'Sign in with your Universal ID to create a verifiable record.' }
  // Signed in with no company: records are kept per company (signing_events.org_id).
  if (!orgId) return { ok: false, error: 'Set up a company on your Universal ID (it’s free) at app.unisim.co.uk to create a verifiable record.' }
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

/**
 * Store the SHA-256 of the signed copy against its record (platform 0242), so
 * the verify page can confirm a copy someone was sent is byte for byte the one
 * that was produced. Write-once, owner only — the server enforces both. Best
 * effort: a failure just leaves the record without it.
 */
export async function recordSignedCopyHash(supabase: SupabaseClient, certId: string, signedHash: string): Promise<boolean> {
  const { data, error } = await supabase.rpc('record_signing_event_signed_hash', { p_cert: certId, p_hash: signedHash })
  return !error && data === true
}

// ── Verify (public) ──────────────────────────────────────────────────────────
// Reads minimal public fields via SECURITY DEFINER RPCs so a cert can be
// verified by anyone holding the (unguessable) cert id, without opening RLS.
// Both return null for "no such record" and THROW when the lookup itself
// failed, so the verify page doesn't tell someone with a genuine certificate
// that it doesn't exist just because they were offline.
export async function verifyCert(supabase: SupabaseClient, certId: string): Promise<VerifyResult | null> {
  const { data, error } = await supabase.rpc('verify_signature_cert', { p_cert: certId })
  if (error) throw new Error(error.message)
  if (!data) return null
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
  // Cert ids are 32 hex characters (gen_random_uuid without its dashes); a
  // mangled link can't match one, so don't spend two round trips finding out.
  if (!/^[0-9a-f]{32}$/i.test(certId)) return null
  const { data, error } = await supabase.rpc('verify_signing_event_cert', { p_cert: certId })
  if (error) throw new Error(error.message)
  const row = Array.isArray(data) ? data[0] : data
  if (row) {
    // The signed copy's hash comes from a second, newer function (0242). Its
    // failure is not the record's: without it the page still verifies, and
    // only the byte-for-byte check of a signed copy is unavailable.
    const signed = await supabase.rpc('verify_signing_event_signed_hash', { p_cert: certId })
    const signedHash = !signed.error && typeof signed.data === 'string' ? signed.data : null
    return {
      kind: 'signing',
      data: {
        cert_id: certId,
        signer_email: row.signer_email ?? '',
        org_name: row.org_name ?? null,
        original_filename: row.original_filename ?? '',
        document_hash: row.document_hash ?? '',
        signed_hash: signedHash,
        created_at: row.created_at ?? '',
        verified: true,
      },
    }
  }
  // A document sent to be signed (this app's or Universal PDF's).
  const req = await supabase.rpc('verify_pdf_sign_cert', { p_cert: certId })
  if (req.error) throw new Error(req.error.message)
  const r = req.data as Partial<RequestCertResult> & { ok?: boolean } | null
  if (r?.ok) {
    return {
      kind: 'request',
      data: {
        cert_id: certId,
        doc_name: r.doc_name ?? 'document.pdf',
        status: r.status ?? 'pending',
        created_at: r.created_at ?? '',
        original_sha256: r.original_sha256 ?? null,
        latest_sha256: r.latest_sha256 ?? null,
        bytes_available: !!r.bytes_available,
        parties: Array.isArray(r.parties) ? r.parties : [],
        events: Array.isArray(r.events) ? r.events : [],
      },
    }
  }
  const sig = await verifyCert(supabase, certId)
  return sig ? { kind: 'signature', data: sig } : null
}

// ── Your main signature (one per Universal ID) ───────────────────────────────
// Platform 0224: every Universal ID can keep ONE main signature, with or
// without a company — a row in the same `signatures` table (is_main = true,
// org_id = null) written only through save_main_signature(), which replaces
// any previous main. It takes no free-allowance token. The hub's Me page saves
// it in place; this app reads it (to sign with) and can save it too.
export interface MainSignature {
  id: string
  cert_id: string
  image_data: string
  created_at: string
}

const MAIN_CHANGED = 'unisim:main-signature-changed'

export function useMainSignature() {
  const { supabase, session } = useUniversal()
  const userId = session?.user && session.user.is_anonymous !== true ? session.user.id : null
  const [main, setMain] = useState<MainSignature | null>(null)
  const [loading, setLoading] = useState(false)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    if (!userId) {
      setMain(null)
      setLoading(false)
      return
    }
    let cancelled = false
    setLoading(true)
    supabase
      .from('signatures')
      .select('id, cert_id, image_data, created_at')
      .eq('user_id', userId)
      .eq('is_main', true)
      .maybeSingle()
      .then(({ data, error }) => {
        if (cancelled) return
        setMain(error ? null : ((data as MainSignature | null) ?? null))
        setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [supabase, userId, tick])

  // Every reader of the main signature re-reads when any of them saves one
  // (the studio's "Use it" bar and the save panel are separate components).
  useEffect(() => {
    const on = () => setTick((t) => t + 1)
    window.addEventListener(MAIN_CHANGED, on)
    return () => window.removeEventListener(MAIN_CHANGED, on)
  }, [])

  const refresh = useCallback(() => setTick((t) => t + 1), [])
  return { main, loading, refresh, signedIn: !!userId }
}

export async function saveMainSignature(
  supabase: SupabaseClient,
  input: SaveInput,
): Promise<{ ok: boolean; certId?: string; error?: string }> {
  const { data, error } = await supabase.rpc('save_main_signature', {
    p_image_data: input.imageDataUrl,
    p_signer_name: input.signerName.trim() || null,
    p_style: input.style,
    p_font: input.font,
  })
  if (error) return { ok: false, error: error.message }
  const d = data as { ok: boolean; cert_id?: string; error?: string } | null
  if (!d?.ok || !d.cert_id) {
    return { ok: false, error: d?.error === 'too_large' ? 'That signature image is too large to store.' : 'Could not save your main signature.' }
  }
  window.dispatchEvent(new Event(MAIN_CHANGED))
  return { ok: true, certId: d.cert_id }
}
