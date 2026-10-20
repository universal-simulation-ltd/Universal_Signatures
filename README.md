# Universal Signatures

Draw or type a signature and **sign PDFs entirely in your browser** — free, open
source, documents never leave your device, no account needed. Save your
signatures on this device, or **to a file** to use them on another one. Part of the
[Universal Apps](https://opensource.unisim.co.uk) family from UNI·SIM.

Live at **`opensource.unisim.co.uk/signatures`**.

## Features

- **Create a signature** — draw with mouse/touch/stylus (a pen that reports
  pressure draws a thinner or thicker line), type your name in a cursive font,
  or **draw it on your phone** by scanning a QR code (a 6-digit PIN, and the code
  expires after 5 minutes).
- **Sign a PDF** — pick the page (or every page), position and size, and download
  the signed copy. Or **initial each page and sign the last**. 100% client-side
  via `pdf-lib`; the document is never uploaded.
- **Signing certificate** *(optional, free with a Universal ID)* — a QR and a
  certificate page on the PDF, and a public record holding fingerprints of the
  original and of the signed copy, so anyone can check a copy byte for byte.
- **Send to be signed** — ask someone else to sign a PDF. They sign in their
  browser with no account (optionally after confirming their email address with
  a code); you both get the certificate. This is the one flow that uploads a PDF
  — see [PRIVACY.md](PRIVACY.md).
- **Verification badge** — put "✓ Signed and verified" on any website: a link
  plus `badge.js`, which checks the certificate live, or a picture + link for
  email and Markdown.
- **Save your signatures** — keep up to six in this browser, no account. **Save
  to a file** (optionally with a password: AES-256-GCM) and **Open a file** on
  another browser or device to carry them over; nothing is uploaded. The file
  is the suite's transfer file (`@unisim/sdk` `packTransfer` / `readTransfer`),
  product `signatures`, kind `saved-signatures`.
- **Eight languages** — English, French, Spanish, Italian, German, Portuguese
  (Brazil and Portugal) and Turkish, following the suite's language setting.

### Embedding a badge

```html
<a class="unisim-sig-badge" data-cert="CERTIFICATE_ID"
   href="https://opensource.unisim.co.uk/signatures/verify/CERTIFICATE_ID">Verify this signature</a>
<script async src="https://opensource.unisim.co.uk/signatures/badge.js"></script>
```

The certificate page's "Show it on a website" fills the ID in for you.

## When you need a Universal ID

Signing PDFs and saving or moving your signatures need **no account**. A
Universal ID is asked for only by the two features that involve somebody else,
at the moment you choose them: a **signing certificate** others can check, and
**Send to be signed**. (Saving a signature to the cloud against a Universal ID
was removed on 2026-10-20 in favour of the file; certificate links for
signatures saved that way still verify.)

## Stack

Vite 6 · React 18 · TypeScript · Tailwind v4 · zustand · pdf-lib ·
`@unisim/sdk` (shared navbar, SSO + entitlements).

## Develop

```
cd /Users/jamesmarkey/Github/UNISIM/Universal_Apps/Universal_Signatures
npm install
npm run dev -- --port 5186
```

`npm run build` runs `tsc -b && vite build` (strict TypeScript). Output is a
static `dist/` served by Cloudflare Pages under `/signatures/`.

Each build bakes the commit SHA into a `<meta name="build-sha">` tag and logs
`build: <sha>` to the console at startup, so you can tell which build is live
in-browser. On Cloudflare Pages the SHA comes from `CF_PAGES_COMMIT_SHA`; locally
it falls back to the git short SHA (or `dev`).

### Offline "dummy account"

In local dev the app runs against an **offline mock** of the Universal ID by
default — no network, no real Supabase. Open the profile menu → **Sign in** and
use the demo credentials:

```
demo@example.invalid / offline-demo
```

You'll get a seeded signed-in world (owner of a demo org with one free token) so
the navbar profile, the signing certificate and the verify page all work offline. To test
against the **real** Supabase project instead, set `VITE_REAL_AUTH=1` in
`.env.local`. The mock lives in `@unisim/sdk` (`mockAuth`) and is hard-guarded
off in production.

## Self-hosting

Universal Signatures is AGPL-3.0-licensed and self-contained. Signing and saving
signatures need no backend at all. To run your own copy with the signing
certificate and the verify page against **your own** Supabase:

1. Clone this repo and `npm install`.
2. Create a Supabase project and apply the `signing_events` table and the
   `verify_*_cert` RPCs (see `0028_signatures.sql` and `0030_signing_events.sql`
   in the platform repo).
3. Set `VITE_PLATFORM_SUPABASE_URL` / `VITE_PLATFORM_SUPABASE_ANON_KEY` to your
   project in `.env.local`.
4. `npm run build` and host `dist/` anywhere static (Cloudflare Pages, Netlify,
   nginx, …).

That's it — you get the full app for the cost of your own hosting.

## Privacy

PDFs are parsed and signed locally and never uploaded (except a PDF you choose to
send to somebody else to sign). Saved signatures stay in your browser or in a
file you save. [PRIVACY.md](PRIVACY.md) names everything that can leave the device.
