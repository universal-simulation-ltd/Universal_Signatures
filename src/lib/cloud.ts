import { useEffect, useState } from 'react'
import { useUniversal } from '@unisim/sdk'
import type { SupabaseClient } from '@supabase/supabase-js'
import { getT } from '../i18n'
import type { AnyVerifyResult, RequestCertResult, VerifyResult } from './types'

// What this app still asks the platform for. Since 2026-10-20 nothing here
// SAVES a signature to reuse: that is a file now (lib/signatureFile.ts,
// Docs_UNI_SIM/login-free-plan.md). Left are the two things shared with
// somebody else, and their public verification:
//   • the signing certificate (a signing_events record, below), which needs a
//     Universal ID and offers sign-in only when its box is ticked;
//   • reading a signature's certificate (verifyCert / verifyAny), which needs
//     nobody signed in. ⚠️ Saved signatures already issued (`signatures`,
//     platform 0028 / 0224) keep their certificate links, so verifyCert stays
//     even though this app no longer writes those rows;
//   • reading your MAIN signature (platform 0224) when you happen to be signed
//     in — saved on the hub's Me page. Read only; never a prompt.

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
  if (!userId) return { ok: false, error: getT()('save.error_sign_in_to_record') }
  // A Universal ID alone is enough for a record (privacy audit 2026-10-12): no
  // company needed, so nobody has to hand over a company name to get one. With
  // no company the row goes in with org_id null and belongs to the user.
  //
  // ⚠️ Needs the platform change that makes signing_events.org_id nullable and
  // lets the owner insert/read an org-less row (and left-joins organisations in
  // verify_signing_event_cert). Until it lands the server refuses the row —
  // not-null (23502) or RLS (42501) — and we show the old "set up a company"
  // message, so nothing changes for anyone in the meantime.
  const { data, error } = await supabase
    .from('signing_events')
    .insert({
      org_id: orgId ?? null,
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
  if (error) {
    if (!orgId && (error.code === '23502' || error.code === '42501')) {
      return { ok: false, error: getT()('save.error_no_company_record') }
    }
    return { ok: false, error: error.message }
  }
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
        retain_until: r.retain_until ?? null,
        parties: Array.isArray(r.parties) ? r.parties : [],
        events: Array.isArray(r.events) ? r.events : [],
      },
    }
  }
  const sig = await verifyCert(supabase, certId)
  return sig ? { kind: 'signature', data: sig } : null
}

// ── Your main signature (one per Universal ID) ───────────────────────────────
// Platform 0224: every Universal ID can keep ONE main signature, saved on the
// hub's Me page (this app saved one too until 2026-10-20). When you are signed
// in anyway, the studio offers it to sign with. Nothing asks you to sign in
// for it.
export interface MainSignature {
  id: string
  cert_id: string
  image_data: string
  created_at: string
}

export function useMainSignature() {
  const { supabase, session } = useUniversal()
  const userId = session?.user && session.user.is_anonymous !== true ? session.user.id : null
  const [main, setMain] = useState<MainSignature | null>(null)

  useEffect(() => {
    if (!userId) {
      setMain(null)
      return
    }
    let cancelled = false
    supabase
      .from('signatures')
      .select('id, cert_id, image_data, created_at')
      .eq('user_id', userId)
      .eq('is_main', true)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!cancelled) setMain(error ? null : ((data as MainSignature | null) ?? null))
      })
    return () => {
      cancelled = true
    }
  }, [supabase, userId])

  return { main }
}
