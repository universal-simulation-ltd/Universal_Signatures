import { PDFDocument, PDFHexString, PDFName, PDFString, StandardFonts, rgb, type PDFDict, type PDFFont } from 'pdf-lib'
import { appendSigningAuditPage, type SigningAuditFields } from '@unisim/sdk'
import { dataUrlToBytes } from './signature'
import { ALL_PAGES, INITIAL_PAGES } from './types'
import { getT } from '../i18n'
import { en } from '../i18n/en'
import type { PhoneAttestation } from './phoneAttest'
import { printPhoneAttest } from './phoneAttestPdf'

export type Anchor =
  | 'top-left' | 'top-center' | 'top-right'
  | 'mid-left' | 'mid-center' | 'mid-right'
  | 'bottom-left' | 'bottom-center' | 'bottom-right'

// A custom placement point chosen on the visual picker. Fractions of the page
// (0–1) with a top-left origin (y grows downward, like the screen); the point
// is the CENTRE of the signature. Overrides `anchor` when present.
export interface PlacePoint {
  xPct: number
  yPct: number
}

/** Initials for INITIAL_PAGES: stamped at a corner/grid anchor of each page. */
export interface InitialsOpts {
  png: string
  anchor: Anchor
  widthPct: number    // initials width as % of page width
  includeLast: boolean // also initial the last page (the one carrying the signature)
}

export interface PlaceOpts {
  pageIndex: number   // 0-based; -1 = last page; ALL_PAGES = every page; INITIAL_PAGES = initials + signature on the last
  // Required with INITIAL_PAGES, ignored otherwise.
  initials?: InitialsOpts
  anchor: Anchor
  widthPct: number    // signature width as % of page width (5–60)
  // When set (from the "Choose position" picker), the signature is centred on
  // this point instead of snapping to the 9-grid anchor.
  pos?: PlacePoint
  // Optional QR PNG (data URL) stamped beside the signature, linking to the
  // public verify page. Present only when the user opts into a verifiable record.
  qrPng?: string
  // When set, a signing certificate page is appended to the document. Same
  // opt-in as the QR — the page is what a recipient actually reads, the QR is
  // just the shortcut to the online copy. Composed by the SDK so Universal PDF
  // renders an identical page.
  audit?: SigningAuditFields
  // Several places, each with its own page, point and size (a Send-to-be-
  // signed request with more than one "Sign here"). When present it replaces
  // pageIndex / pos / widthPct for the signature itself; the QR goes beside
  // the last one. Not combined with INITIAL_PAGES.
  placements?: { pageIndex: number; pos: PlacePoint; widthPct: number }[]
  // Scan to sign (platform 0306): the signature came from the UNI·SIM Hub app
  // and its attestation checked out (lib/phoneAttest.ts). Printed on the
  // certificate page — so only together with `audit` — with a QR to the hub's
  // /check page (`qrPng`), and only if `signature` is still the very image the
  // attestation is about (lib/phoneAttestPdf.ts re-checks).
  phoneAttest?: { attestation: PhoneAttestation; signature: string | null; qrPng?: string }
}

// Thrown for a password-protected PDF, so the UI can say so rather than
// "could not read". pdf-lib can't decrypt, and saving one it loaded with
// ignoreEncryption produces a file no viewer opens.
// Checked by `name` in the UI, which only imports this module on demand.
export class EncryptedPdfError extends Error {
  name = 'EncryptedPdfError'
}

async function load(pdfBytes: ArrayBuffer): Promise<PDFDocument> {
  try {
    return await PDFDocument.load(pdfBytes)
  } catch (err) {
    if (err instanceof Error && /encrypt/i.test(err.message)) throw new EncryptedPdfError(err.message)
    throw err
  }
}

export async function pageCount(pdfBytes: ArrayBuffer): Promise<number> {
  return (await load(pdfBytes)).getPageCount()
}

// ── Where a signer signs (Send to be signed) ────────────────────────────────
// The signing field travels INSIDE the PDF that is stored for the signer — a
// private entry in the document information dictionary — so the request needs
// no column of its own and the field can't drift from the document it
// describes. signPdf removes it again, so no signed copy carries it.
//
// Since 2026-10-12 a request can mark several places (all must be signed).
// They go under SIGN_FIELDS_KEY as a JSON array; the FIRST also stays under
// the original single-field key, so a signer page from before the change
// still finds somewhere to sign rather than nothing.
const SIGN_FIELD_KEY = 'UnisimSignField'
const SIGN_FIELDS_KEY = 'UnisimSignFields'
/** The most places one request can mark. */
export const MAX_SIGN_FIELDS = 10

// pdf-lib's own accessor for the information dictionary (it creates one when
// the file has none) — public in behaviour, private in its typings.
const infoDict = (doc: PDFDocument): PDFDict => (doc as unknown as { getInfoDict(): PDFDict }).getInfoDict()

export interface StoredSignField {
  page: number
  xPct: number
  yPct: number
  widthPct: number
}

export async function withSignFields(pdfBytes: ArrayBuffer, fields: StoredSignField[]): Promise<Uint8Array> {
  if (fields.length === 0) throw new Error('no sign field')
  const doc = await load(pdfBytes)
  const info = infoDict(doc)
  info.set(PDFName.of(SIGN_FIELD_KEY), PDFString.of(JSON.stringify(fields[0])))
  info.set(PDFName.of(SIGN_FIELDS_KEY), PDFString.of(JSON.stringify(fields.slice(0, MAX_SIGN_FIELDS))))
  return doc.save()
}

function asField(f: unknown): StoredSignField | null {
  if (!f || typeof f !== 'object') return null
  const v = f as Partial<StoredSignField>
  const num = (x: unknown, lo: number, hi: number) => typeof x === 'number' && Number.isFinite(x) && x >= lo && x <= hi
  return Number.isInteger(v.page) && num(v.page, -1, 10_000) && num(v.xPct, 0, 1) && num(v.yPct, 0, 1) && num(v.widthPct, 5, 60)
    ? { page: v.page!, xPct: v.xPct!, yPct: v.yPct!, widthPct: v.widthPct! }
    : null
}

function readJson(doc: PDFDocument, key: string): unknown {
  const raw = infoDict(doc).get(PDFName.of(key))
  if (!(raw instanceof PDFString || raw instanceof PDFHexString)) return null
  try { return JSON.parse(raw.decodeText()) } catch { return null }
}

/** The places written by withSignFields — the list when there is one, else
 *  the single field an older request carries — or [] (none, or none valid). */
export async function readSignFields(pdfBytes: ArrayBuffer): Promise<{ fields: StoredSignField[]; pages: number }> {
  const doc = await load(pdfBytes)
  const list = readJson(doc, SIGN_FIELDS_KEY)
  let fields: StoredSignField[] = Array.isArray(list)
    ? list.slice(0, MAX_SIGN_FIELDS).map(asField).filter((f): f is StoredSignField => f !== null)
    : []
  if (fields.length === 0) {
    const one = asField(readJson(doc, SIGN_FIELD_KEY))
    fields = one ? [one] : []
  }
  return { fields, pages: doc.getPageCount() }
}

// Embed a signature PNG onto one page of the PDF (or every page) and return the
// signed bytes.
export async function signPdf(pdfBytes: ArrayBuffer, sigPng: string, opts: PlaceOpts): Promise<Uint8Array> {
  const doc = await load(pdfBytes)
  // A Send-to-be-signed copy's field marker has done its job once signed.
  infoDict(doc).delete(PDFName.of(SIGN_FIELD_KEY))
  infoDict(doc).delete(PDFName.of(SIGN_FIELDS_KEY))
  const pages = doc.getPages()
  const targets = opts.pageIndex === ALL_PAGES
    ? pages
    : opts.pageIndex === INITIAL_PAGES
      ? [pages[pages.length - 1]]
      : [pages[opts.pageIndex < 0 ? pages.length - 1 : Math.min(opts.pageIndex, pages.length - 1)]]

  const png = await doc.embedPng(dataUrlToBytes(sigPng))
  const margin = 24

  // Where the signature sits on one page, in pdf-lib's bottom-left-origin space.
  const place = (pw: number, ph: number, pos: PlacePoint | undefined = opts.pos, widthPct: number = opts.widthPct) => {
    const w = (Math.max(5, Math.min(60, widthPct)) / 100) * pw
    const h = (png.height / png.width) * w
    let x: number
    let y: number
    if (pos) {
      // Click point is the signature centre, in top-left-origin page fractions.
      // pdf-lib's origin is bottom-left, so flip Y. Clamp so it can't clip off.
      const cx = pos.xPct * pw
      const cyTop = pos.yPct * ph
      x = Math.max(0, Math.min(pw - w, cx - w / 2))
      y = Math.max(0, Math.min(ph - h, ph - cyTop - h / 2))
    } else {
      const [vert, horiz] = anchorParts(opts.anchor)
      x = margin
      if (horiz === 'center') x = (pw - w) / 2
      else if (horiz === 'right') x = pw - w - margin
      // pdf-lib origin is bottom-left.
      y = margin
      if (vert === 'mid') y = (ph - h) / 2
      else if (vert === 'top') y = ph - h - margin
    }
    return { x, y, w, h }
  }

  // Initials first, so on a last page that carries both the signature is drawn
  // over them rather than under. One embedded image however many pages.
  if (opts.pageIndex === INITIAL_PAGES && opts.initials) {
    const ini = opts.initials
    const iniPng = await doc.embedPng(dataUrlToBytes(ini.png))
    const lastPage = pages[pages.length - 1]
    const initialled = ini.includeLast ? pages : pages.slice(0, -1)
    for (const page of initialled) {
      const { width: pw, height: ph } = page.getSize()
      const w = (Math.max(3, Math.min(30, ini.widthPct)) / 100) * pw
      const h = (iniPng.height / iniPng.width) * w
      const [vert, horiz] = anchorParts(ini.anchor)
      let x = margin
      if (horiz === 'center') x = (pw - w) / 2
      else if (horiz === 'right') x = pw - w - margin
      let y = margin
      if (vert === 'mid') y = (ph - h) / 2
      else if (vert === 'top') y = ph - h - margin
      // On the signed page, initials that would sit under the signature (both
      // in the same corner, say) go just above it instead — or below, if
      // there's no room above.
      if (page === lastPage) {
        const sig = place(pw, ph)
        const overlaps = x < sig.x + sig.w && x + w > sig.x && y < sig.y + sig.h && y + h > sig.y
        if (overlaps) {
          const gap = 6
          y = sig.y + sig.h + gap + h <= ph ? sig.y + sig.h + gap : Math.max(0, sig.y - gap - h)
        }
      }
      page.drawImage(iniPng, { x, y, width: w, height: h })
    }
  }

  // The same embedded image on each page: one copy in the file however many
  // pages carry it.
  const pageAt = (i: number) => pages[i < 0 ? pages.length - 1 : Math.min(i, pages.length - 1)]
  const spots = opts.placements?.length
    ? opts.placements.map((p) => ({ page: pageAt(p.pageIndex), pos: p.pos as PlacePoint | undefined, widthPct: p.widthPct }))
    : targets.map((page) => ({ page, pos: opts.pos, widthPct: opts.widthPct }))
  let last = { x: 0, y: 0, w: 0, h: 0, pw: 0 }
  for (const spot of spots) {
    const { width: pw, height: ph } = spot.page.getSize()
    const r = place(pw, ph, spot.pos, spot.widthPct)
    spot.page.drawImage(png, { x: r.x, y: r.y, width: r.w, height: r.h })
    last = { ...r, pw }
  }
  const page = spots[spots.length - 1].page
  const { x, y, w, h, pw } = last

  // Optional verification QR, stamped just below the signature (or above, if
  // there isn't room) and right-aligned to the signature's edge, with a small
  // "scan to verify" caption beneath it. Once per document — on the last
  // signed page — however many pages carry the signature.
  if (opts.qrPng) {
    const qr = await doc.embedPng(dataUrlToBytes(opts.qrPng))
    const qrSize = Math.max(48, Math.min(96, w * 0.5))
    const font = await doc.embedFont(StandardFonts.Helvetica)
    // In the reader's language when Helvetica can draw it, otherwise English.
    const translated = getT()('sign.qr_caption')
    const caption = canEncode(font, translated) ? translated : en.sign.qr_caption
    const fontSize = 6
    const capH = fontSize + 2
    const gap = 6
    const qrX = Math.min(x + w - qrSize, pw - margin - qrSize)
    // Prefer below the signature; flip above if it would clip the bottom margin.
    let qrY = y - gap - qrSize - capH
    if (qrY < margin) qrY = y + h + gap + capH
    page.drawImage(qr, { x: qrX, y: qrY + capH, width: qrSize, height: qrSize })
    const capW = font.widthOfTextAtSize(caption, fontSize)
    page.drawText(caption, {
      x: qrX + (qrSize - capW) / 2,
      y: qrY,
      size: fontSize,
      font,
      color: rgb(0.39, 0.45, 0.55),
    })
  }

  // The certificate page goes last, after the signature is stamped, so it
  // reads as an appendix rather than interrupting the document. `rgb` is
  // passed in because the SDK holds no runtime dependency on pdf-lib.
  if (opts.audit) {
    const auditPage = await appendSigningAuditPage({ pdf: doc, fields: opts.audit, rgb, qrPng: opts.qrPng })
    if (opts.phoneAttest) {
      const t = getT()
      await printPhoneAttest(doc, auditPage, {
        ...opts.phoneAttest,
        texts: (vars) => ({ heading: t('sign.attest_heading'), line: t('sign.attest_line', vars) }),
        english: { heading: en.sign.attest_heading, line: en.sign.attest_line },
      })
    }
  }

  return doc.save()
}

// The standard fonts only cover WinAnsi (Western European), so a caption with,
// say, Turkish ğ or ı would throw when drawn.
function canEncode(font: PDFFont, text: string): boolean {
  try {
    font.encodeText(text)
    return true
  } catch {
    return false
  }
}

function anchorParts(a: Anchor): ['top' | 'mid' | 'bottom', 'left' | 'center' | 'right'] {
  const [v, h] = a.split('-') as ['top' | 'mid' | 'bottom', 'left' | 'center' | 'right']
  return [v, h]
}
