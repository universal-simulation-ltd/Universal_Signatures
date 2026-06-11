import QRCode from 'qrcode'

// Render a QR code to a PNG data URL (client-side; nothing leaves the browser).
// Used to stamp a verification link onto a signed PDF — scanning it opens the
// public verify page for the signing's cert_id.
export async function makeQrPng(text: string): Promise<string> {
  return QRCode.toDataURL(text, {
    errorCorrectionLevel: 'M',
    margin: 1,
    scale: 8,
    color: { dark: '#0f172a', light: '#ffffff' },
  })
}
