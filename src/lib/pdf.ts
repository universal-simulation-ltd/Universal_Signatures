import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import { dataUrlToBytes } from './signature'

export type Anchor =
  | 'top-left' | 'top-center' | 'top-right'
  | 'mid-left' | 'mid-center' | 'mid-right'
  | 'bottom-left' | 'bottom-center' | 'bottom-right'

export interface PlaceOpts {
  pageIndex: number   // 0-based; -1 = last page
  anchor: Anchor
  widthPct: number    // signature width as % of page width (5–60)
  // Optional QR PNG (data URL) stamped beside the signature, linking to the
  // public verify page. Present only when the user opts into a verifiable record.
  qrPng?: string
}

export async function pageCount(pdfBytes: ArrayBuffer): Promise<number> {
  const doc = await PDFDocument.load(pdfBytes)
  return doc.getPageCount()
}

// Embed a signature PNG onto one page of the PDF and return the signed bytes.
export async function signPdf(pdfBytes: ArrayBuffer, sigPng: string, opts: PlaceOpts): Promise<Uint8Array> {
  const doc = await PDFDocument.load(pdfBytes)
  const pages = doc.getPages()
  const idx = opts.pageIndex < 0 ? pages.length - 1 : Math.min(opts.pageIndex, pages.length - 1)
  const page = pages[idx]
  const { width: pw, height: ph } = page.getSize()

  const png = await doc.embedPng(dataUrlToBytes(sigPng))
  const w = (Math.max(5, Math.min(60, opts.widthPct)) / 100) * pw
  const h = (png.height / png.width) * w

  const margin = 24
  const [vert, horiz] = anchorParts(opts.anchor)
  let x = margin
  if (horiz === 'center') x = (pw - w) / 2
  else if (horiz === 'right') x = pw - w - margin
  // pdf-lib origin is bottom-left.
  let y = margin
  if (vert === 'mid') y = (ph - h) / 2
  else if (vert === 'top') y = ph - h - margin

  page.drawImage(png, { x, y, width: w, height: h })

  // Optional verification QR, stamped just below the signature (or above, if
  // there isn't room) and right-aligned to the signature's edge, with a small
  // "scan to verify" caption beneath it.
  if (opts.qrPng) {
    const qr = await doc.embedPng(dataUrlToBytes(opts.qrPng))
    const qrSize = Math.max(48, Math.min(96, w * 0.5))
    const caption = 'Scan to verify · Universal Signatures'
    const font = await doc.embedFont(StandardFonts.Helvetica)
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

  return doc.save()
}

function anchorParts(a: Anchor): ['top' | 'mid' | 'bottom', 'left' | 'center' | 'right'] {
  const [v, h] = a.split('-') as ['top' | 'mid' | 'bottom', 'left' | 'center' | 'right']
  return [v, h]
}
