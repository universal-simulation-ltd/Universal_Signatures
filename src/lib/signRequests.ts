// "Send to be signed" — the two-party flow (next-products §3), built on the
// suite's existing sign-request machinery rather than a second copy of it:
//
//  • pdf_sign_requests / pdf_sign_parties / pdf_sign_events (platform 0057,
//    0058, 0131, 0228) — the request, a capability token per signer, and the
//    append-only provenance log with its SHA-256 chain;
//  • the `hosted-uploads` bucket, budget `pdf_sign` (0227 — free, uncounted),
//    for the copy the signer opens;
//  • send-sign-request — emails the link (verified, non-anonymous senders only;
//    links must be to our own hosts; a daily per-sender cap) — with
//    `app: 'signatures'` for this app's sender and wording;
//  • pdf-sign-request — the signer's side: begin / request_code / verify (when
//    the sender asked for the signer's address to be confirmed), load, submit.
//
// What this app adds: a request with ONE party, the recipient — the sender
// isn't asked to sign as well, so the recipient's signature completes it — and
// where to sign, carried inside the PDF itself (see SIGN_FIELD_KEY in pdf.ts).

import { consumeHostedUpload, refundHostedUpload, HOSTED_BUCKET, type useUniversal } from '@unisim/sdk'
import { randomHex } from './signature'

type Supabase = ReturnType<typeof useUniversal>['supabase']

const SIGN_PRODUCT = 'pdf_sign'

/** Where the signer signs. Page fractions with a top-left origin; the point is
 *  the CENTRE of the signature (as the position picker produces). */
export interface SignField {
  /** 0-based page, or -1 for the last page. */
  page: number
  xPct: number
  yPct: number
  /** Signature width as % of the page width. */
  widthPct: number
}

/** The link a signer opens. Emailed to someone else, so it uses this page's
 *  public origin — never a local preview's. */
export function signerLink(token: string): string {
  return `${window.location.origin}${import.meta.env.BASE_URL}?signdoc=${token}`
}

export function certificateLink(certId: string): string {
  return `${window.location.origin}${import.meta.env.BASE_URL}verify/${certId}`
}

function safeStem(name: string): string {
  const base = name.replace(/\.pdf$/i, '')
  return base.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'document'
}

function objectId(): string {
  try {
    return crypto.randomUUID()
  } catch {
    return randomHex(16)
  }
}

export function base64FromBytes(bytes: Uint8Array): string {
  // Chunked: String.fromCharCode(...bytes) overflows the argument limit on a
  // multi-megabyte PDF.
  let bin = ''
  const CHUNK = 0x8000
  for (let i = 0; i < bytes.length; i += CHUNK) bin += String.fromCharCode(...bytes.subarray(i, i + CHUNK))
  return btoa(bin)
}

// A non-2xx answer still carries the function's JSON body (code, triesLeft,
// retryAfter …); supabase-js puts the Response on the error's `.context`.
async function functionError(error: unknown): Promise<Record<string, unknown>> {
  const ctx = (error as { context?: Response }).context
  if (ctx && typeof ctx.json === 'function') {
    try {
      const body = await ctx.json()
      if (body && typeof body === 'object' && !Array.isArray(body)) return body as Record<string, unknown>
    } catch {
      // fall through
    }
  }
  return {}
}

async function invoke<T extends { ok: boolean; error?: string; code?: string }>(
  supabase: Supabase,
  fn: 'pdf-sign-request' | 'send-sign-request',
  body: Record<string, unknown>,
): Promise<T> {
  try {
    const { data, error } = await supabase.functions.invoke(fn, { body })
    if (error) {
      const b = await functionError(error)
      return { ...b, ok: false, error: (b.error as string | undefined) ?? error.message, code: (b.code as string | undefined) ?? 'network' } as T
    }
    return (data ?? { ok: false, code: 'network' }) as T
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err), code: 'network' } as T
  }
}

// ── Sender ──────────────────────────────────────────────────────────────────

export interface CreateResult {
  ok: boolean
  error?: string
  requestId?: string
  certId?: string
  token?: string
}

/**
 * Store the PDF (with its signing field written in) and mint a one-signer
 * request. A company's request files under the company; a Universal ID with no
 * company sends a personal one (0228), filed under its own folder.
 */
export async function createSignatureRequest(
  supabase: Supabase,
  input: {
    owner: { orgId: string } | { userId: string }
    bytes: Uint8Array
    fileName: string
    senderEmail: string
    recipientEmail: string
    protect: boolean
  },
): Promise<CreateResult> {
  const path = 'orgId' in input.owner
    ? `${input.owner.orgId}/${SIGN_PRODUCT}/${objectId()}-${safeStem(input.fileName)}.pdf`
    : `personal/${input.owner.userId}/${SIGN_PRODUCT}/${objectId()}-${safeStem(input.fileName)}.pdf`

  // 1) The ledger row first (the bucket only takes paths it has recorded),
  //    then the bytes; a failed upload refunds the row.
  const consumed = await consumeHostedUpload(supabase, {
    product: SIGN_PRODUCT,
    storagePath: path,
    fileName: input.fileName,
    sizeBytes: input.bytes.byteLength,
  })
  if (!consumed.ok || !consumed.upload_id) return { ok: false, error: consumed.error ?? 'store_failed' }
  const { error: upErr } = await supabase.storage
    .from(HOSTED_BUCKET)
    .upload(path, new Blob([input.bytes as BlobPart], { type: 'application/pdf' }), { contentType: 'application/pdf', upsert: true })
  if (upErr) {
    await refundHostedUpload(supabase, consumed.upload_id)
    return { ok: false, error: upErr.message }
  }

  // 2) The request and its one party.
  const orgId = 'orgId' in input.owner ? input.owner.orgId : null
  const { data: req, error: reqErr } = await supabase
    .from('pdf_sign_requests')
    .insert({
      org_id: orgId,
      upload_id: consumed.upload_id,
      doc_name: input.fileName,
      recipient_email: input.recipientEmail,
      sender_email: input.senderEmail,
    })
    .select('id, cert_id')
    .single()
  if (reqErr || !req) {
    await abandon(supabase, null, consumed.upload_id, path)
    return { ok: false, error: reqErr?.message ?? 'create_failed' }
  }
  const requestId = (req as { id: string }).id
  const certId = (req as { cert_id: string }).cert_id

  const { data: party, error: partyErr } = await supabase
    .from('pdf_sign_parties')
    .insert({ request_id: requestId, org_id: orgId, role: 'recipient', email: input.recipientEmail })
    .select('party_token')
    .single()
  if (partyErr || !party) {
    await abandon(supabase, requestId, consumed.upload_id, path)
    return { ok: false, error: partyErr?.message ?? 'create_failed' }
  }

  // 3) "Ask them to confirm their email address first" (0131). Applied before
  //    the link exists anywhere; if it can't be, the whole request goes rather
  //    than leaving an unprotected link the sender thinks is protected.
  if (input.protect) {
    const { error } = await supabase
      .from('pdf_sign_requests')
      .update({ require_verification: true, has_access_pin: false, access_pin_hash: null, access_pin_salt: null })
      .eq('id', requestId)
    if (error) {
      await abandon(supabase, requestId, consumed.upload_id, path)
      return { ok: false, error: error.message }
    }
  }

  return { ok: true, requestId, certId, token: (party as { party_token: string }).party_token }
}

async function abandon(supabase: Supabase, requestId: string | null, uploadId: string, path: string) {
  if (requestId) await supabase.from('pdf_sign_requests').delete().eq('id', requestId)
  await supabase.storage.from(HOSTED_BUCKET).remove([path])
  await refundHostedUpload(supabase, uploadId)
}

export interface SendEmailResult {
  ok: boolean
  error?: string
  /** 'not_configured' ⇒ open a mail draft instead; 'rate_limited' ⇒ the daily cap. */
  code?: string
}

/** Email the signer their link through send-sign-request — inside its guards:
 *  verified sender, our own hosts only, a daily cap. The PDF rides along only
 *  on an unprotected request (attaching it to a protected one would hand the
 *  document to whoever the email is forwarded to, gate or no gate). */
export function emailSignRequest(
  supabase: Supabase,
  input: { to: string; link: string; docName: string; senderName?: string; bytes?: Uint8Array },
): Promise<SendEmailResult> {
  return invoke<SendEmailResult>(supabase, 'send-sign-request', {
    app: 'signatures',
    to: input.to,
    link: input.link,
    docName: input.docName,
    senderName: input.senderName,
    pdfBase64: input.bytes ? base64FromBytes(input.bytes) : undefined,
  })
}

/** The recipient's link for a request already sent (to copy it again). */
export async function recipientToken(supabase: Supabase, requestId: string): Promise<string | null> {
  const { data } = await supabase
    .from('pdf_sign_parties')
    .select('party_token')
    .eq('request_id', requestId)
    .eq('role', 'recipient')
    .maybeSingle()
  return (data as { party_token?: string } | null)?.party_token ?? null
}

/** Revoke: end every link, then tidy away the stored copies (best effort —
 *  the request row goes first, so a signer is never shown a missing file). */
export async function revokeSignatureRequest(
  supabase: Supabase,
  req: { id: string; upload_id: string | null },
): Promise<{ ok: boolean; error?: string }> {
  const { data: row } = await supabase.from('pdf_sign_requests').select('latest_storage_path').eq('id', req.id).maybeSingle()
  const signedPath = (row as { latest_storage_path?: string | null } | null)?.latest_storage_path ?? null
  const { error } = await supabase.from('pdf_sign_requests').delete().eq('id', req.id)
  if (error) return { ok: false, error: error.message }
  try {
    const paths: string[] = signedPath ? [signedPath] : []
    if (req.upload_id) {
      const { data: up } = await supabase.from('hosted_uploads').select('storage_path').eq('id', req.upload_id).maybeSingle()
      const p = (up as { storage_path?: string } | null)?.storage_path
      if (p) paths.push(p)
    }
    if (paths.length) await supabase.storage.from(HOSTED_BUCKET).remove(paths)
    if (req.upload_id) await refundHostedUpload(supabase, req.upload_id)
  } catch {
    // A leftover file is a tidy-up miss, not a failed revoke.
  }
  return { ok: true }
}

// ── Signer ──────────────────────────────────────────────────────────────────

export interface BeginResult {
  ok: boolean
  error?: string
  code?: string
  docName?: string
  requireVerification?: boolean
  hasPin?: boolean
  maskedEmail?: string | null
  alreadySigned?: boolean
  completed?: boolean
}

/** What the holding page needs. Inert on the server — no document, no
 *  "opened" event — so a link scanner fetching the email's URL moves nothing. */
export function beginSigning(supabase: Supabase, token: string): Promise<BeginResult> {
  return invoke<BeginResult>(supabase, 'pdf-sign-request', { action: 'begin', token })
}

export interface CodeResult {
  ok: boolean
  error?: string
  code?: string
  maskedEmail?: string
  retryAfter?: number
}

/** "This is my address — send me a code." The address is compared with the one
 *  the sender typed; the code always goes to the stored one. */
export function requestSigningCode(supabase: Supabase, token: string, email: string): Promise<CodeResult> {
  return invoke<CodeResult>(supabase, 'pdf-sign-request', { action: 'request_code', token, email })
}

export interface VerifyCodeResult {
  ok: boolean
  error?: string
  code?: string
  session?: string
  triesLeft?: number
}

export function verifySigningCode(supabase: Supabase, token: string, code: string): Promise<VerifyCodeResult> {
  return invoke<VerifyCodeResult>(supabase, 'pdf-sign-request', { action: 'verify', token, code })
}

export interface LoadResult {
  ok: boolean
  error?: string
  code?: string
  docName?: string
  signedUrl?: string
  alreadySigned?: boolean
  certId?: string | null
}

export function loadSigning(supabase: Supabase, token: string, session?: string): Promise<LoadResult> {
  return invoke<LoadResult>(supabase, 'pdf-sign-request', { action: 'load', token, session })
}

export interface SubmitResult {
  ok: boolean
  error?: string
  code?: string
  completed?: boolean
  cert_id?: string
  notified?: boolean
}

export function submitSigned(
  supabase: Supabase,
  token: string,
  bytes: Uint8Array,
  page: number,
  session?: string,
): Promise<SubmitResult> {
  return invoke<SubmitResult>(supabase, 'pdf-sign-request', {
    action: 'submit',
    app: 'signatures',
    token,
    session,
    pdfBase64: base64FromBytes(bytes),
    // What was added, for the provenance log's label (the hash chain records
    // the change regardless): one signature.
    annotations: [{ type: 'signature', pageIndex: page }],
  })
}

export interface DownloadResult {
  ok: boolean
  error?: string
  code?: string
  docName?: string
  signedUrl?: string
}

/** The certificate page's "Download the signed copy". */
export function certificateDownload(supabase: Supabase, certId: string): Promise<DownloadResult> {
  return invoke<DownloadResult>(supabase, 'pdf-sign-request', { action: 'download', cert_id: certId })
}
