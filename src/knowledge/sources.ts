import type { Source } from './types'

// The research, standards and reports behind each article, keyed by article
// id. The same in every language, so kept once here and attached by index.ts.
//
// Original research papers first, then the standards, then guidance — and
// only sources for what the app really does (checked against src/ on
// 2026-09-29: pdf.js draws the pages, pdf-lib embeds the signature PNG with
// embedPng/drawImage, every signature is a transparent canvas PNG
// (toDataURL('image/png')), the certificate fingerprint is Web Crypto
// SHA-256 of the unsigned original (lib/signature.ts), the QR is the `qrcode`
// package, sign-on-phone is a Supabase Realtime broadcast keyed by a
// crypto.randomUUID token (lib/mobileSign.ts), and saved signatures sit in
// localStorage). The app never adds a certificate-based digital signature, so
// RSA/PAdES are deliberately not cited; Diffie–Hellman is there only to
// define the term the first article contrasts with.
//
// ⚠️ `pdf` (our hosted copy at opensource.unisim.co.uk/kb/papers/) ONLY where
// the licence allows redistribution: US Government works, UK Crown copyright
// under the Open Government Licence, EU acts under Decision 2011/833/EU, and
// IETF RFCs. ACM, IEEE, ISO, ITU, W3C and Springer documents link to the
// publisher's or the authors' own free copy instead. iso.org, pdfa.org and
// link.springer.com bot-block curl, so those pages were confirmed through
// Wayback Machine captures; the links point at the publishers themselves.

const LAW_COM_386: Source = {
  kind: 'report',
  title: 'Electronic execution of documents (Law Com No 386)',
  authors: 'Law Commission of England and Wales',
  publisher: 'Law Commission',
  year: 2019,
  href: 'https://cdn.websitebuilder.service.justice.gov.uk/uploads/sites/54/2025/12/Electronic-Execution-Report.pdf',
  pdf: 'papers/law-com-386-electronic-execution.pdf',
  licence: 'Crown copyright 2019, Open Government Licence v3.0',
}

const FIPS_180_4: Source = {
  kind: 'standard',
  title: 'FIPS 180-4: Secure Hash Standard (SHA-256)',
  publisher: 'NIST',
  year: 2015,
  href: 'https://doi.org/10.6028/NIST.FIPS.180-4',
  pdf: 'papers/fips-180-4-sha.pdf',
  licence: 'Public domain (US Government work)',
}

const LOCAL_FIRST: Source = {
  kind: 'paper',
  title: 'Local-first software: You own your data, in spite of the cloud',
  authors: 'Martin Kleppmann, Adam Wiggins, Peter van Hardenberg, Mark McGranaghan',
  publisher: 'ACM Onward!',
  year: 2019,
  href: 'https://www.inkandswitch.com/local-first/static/local-first.pdf',
}

export const SOURCES: Record<string, Source[]> = {
  'electronic-digital-wet-signatures': [
    {
      kind: 'paper',
      title: 'New Directions in Cryptography',
      authors: 'Whitfield Diffie, Martin E. Hellman',
      publisher: 'IEEE Transactions on Information Theory (the paper that proposed digital signatures)',
      year: 1976,
      href: 'https://ee.stanford.edu/~hellman/publications/24.pdf',
    },
    LAW_COM_386,
    {
      kind: 'law',
      title: 'Electronic Communications Act 2000, section 7: electronic signatures',
      publisher: 'UK Parliament',
      year: 2000,
      href: 'https://www.legislation.gov.uk/ukpga/2000/7/contents',
      pdf: 'papers/electronic-communications-act-2000.pdf',
      licence: 'Crown copyright, Open Government Licence v3.0',
    },
    {
      kind: 'law',
      title: 'Regulation (EU) No 910/2014 on electronic identification and trust services (eIDAS)',
      publisher: 'Official Journal of the European Union, L 257/73',
      year: 2014,
      href: 'https://eur-lex.europa.eu/eli/reg/2014/910/oj',
      pdf: 'papers/eidas-regulation-910-2014.pdf',
      licence: '© European Union, reused under Commission Decision 2011/833/EU',
    },
  ],
  'signature-image-formats': [
    {
      kind: 'paper',
      title: 'Compositing Digital Images',
      authors: 'Thomas Porter, Tom Duff',
      publisher: 'ACM SIGGRAPH (the paper that introduced the alpha channel for transparency)',
      year: 1984,
      href: 'https://keithp.com/~keithp/porterduff/p253-porter.pdf',
    },
    {
      kind: 'standard',
      title: 'Portable Network Graphics (PNG) Specification (Third Edition)',
      publisher: 'W3C',
      year: 2025,
      href: 'https://www.w3.org/TR/png-3/',
    },
    {
      kind: 'standard',
      title: 'DEFLATE Compressed Data Format Specification version 1.3 (RFC 1951) — PNG\'s lossless compression',
      authors: 'L. Peter Deutsch',
      publisher: 'IETF',
      year: 1996,
      href: 'https://www.rfc-editor.org/rfc/rfc1951.html',
      pdf: 'papers/rfc-1951-deflate.pdf',
      licence: 'IETF Trust — RFC, freely redistributable unmodified',
    },
    {
      kind: 'standard',
      title: 'ITU-T T.81 (ISO/IEC 10918-1): Digital compression and coding of continuous-tone still images (JPEG)',
      publisher: 'CCITT / ITU',
      year: 1992,
      href: 'https://www.w3.org/Graphics/JPEG/itu-t81.pdf',
    },
  ],
  'how-signing-works': [
    {
      kind: 'guidance',
      title: 'PDF.js — the open-source PDF renderer this app shows pages with',
      publisher: 'Mozilla',
      href: 'https://mozilla.github.io/pdf.js/',
    },
    {
      kind: 'guidance',
      title: 'pdf-lib — the open-source library this app places the signature with',
      publisher: 'pdf-lib',
      href: 'https://pdf-lib.js.org/',
    },
    {
      kind: 'standard',
      title: 'ISO 32000-2:2020 — Portable document format — Part 2: PDF 2.0',
      publisher: 'ISO, free access sponsored by the PDF Association',
      year: 2020,
      href: 'https://pdfa.org/sponsored-standards/',
    },
    LOCAL_FIRST,
  ],
  'sign-on-your-phone': [
    {
      kind: 'standard',
      title: 'The WebSocket Protocol (RFC 6455)',
      authors: 'Ian Fette, Alexey Melnikov',
      publisher: 'IETF',
      year: 2011,
      href: 'https://www.rfc-editor.org/rfc/rfc6455.html',
    },
    {
      kind: 'guidance',
      title: 'Realtime Broadcast — the live relay the signature travels through',
      publisher: 'Supabase',
      href: 'https://supabase.com/docs/guides/realtime/broadcast',
    },
    {
      kind: 'standard',
      title: 'Universally Unique IDentifiers (UUIDs) (RFC 9562) — the random version 4 behind the one-time code',
      authors: 'Kyzer R. Davis, Brad G. Peabody, Paul J. Leach',
      publisher: 'IETF',
      year: 2024,
      href: 'https://www.rfc-editor.org/rfc/rfc9562.html',
      pdf: 'papers/rfc-9562-uuid.pdf',
      licence: 'IETF Trust — RFC, freely redistributable unmodified',
    },
    {
      kind: 'standard',
      title: 'ISO/IEC 18004:2024 — QR Code bar code symbology specification',
      publisher: 'ISO/IEC',
      year: 2024,
      href: 'https://www.iso.org/standard/83389.html',
    },
  ],
  'signing-certificates': [
    {
      kind: 'paper',
      title: 'How to Time-Stamp a Digital Document',
      authors: 'Stuart Haber, W. Scott Stornetta',
      publisher: 'Journal of Cryptology',
      year: 1991,
      href: 'https://doi.org/10.1007/BF00196791',
    },
    FIPS_180_4,
    {
      kind: 'standard',
      title: 'Web Cryptography API — digest(), which computes the SHA-256 fingerprint on your device',
      publisher: 'W3C',
      href: 'https://www.w3.org/TR/WebCryptoAPI/',
    },
  ],
  'privacy-and-storage': [
    {
      kind: 'standard',
      title: 'HTML Standard, §12: Web storage (localStorage)',
      publisher: 'WHATWG',
      href: 'https://html.spec.whatwg.org/multipage/webstorage.html',
    },
    {
      kind: 'standard',
      title: 'The Transport Layer Security (TLS) Protocol Version 1.3 (RFC 8446)',
      authors: 'Eric Rescorla',
      publisher: 'IETF',
      year: 2018,
      href: 'https://www.rfc-editor.org/rfc/rfc8446.html',
    },
    LOCAL_FIRST,
  ],
}
