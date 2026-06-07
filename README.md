# Universal Signatures

Draw or type a signature and **sign PDFs entirely in your browser** — free, open
source, documents never leave your device. Optionally **save a verified
signature to the cloud** with a Universal ID. Part of the
[Universal Apps](https://opensource.unisim.co.uk) family from UNI·SIM.

Live at **`opensource.unisim.co.uk/signatures`**.

## Features

- **Create a signature** — draw with mouse/touch/stylus, or type your name in a
  cursive font (rasterised to PNG).
- **Sign a PDF** — upload a PDF, pick the page, position and size, and download
  the signed copy. 100% client-side via `pdf-lib`; the document is never uploaded.
- **Save a verified signature to the cloud** *(optional, gated)* — store your
  signature against your Universal ID with a SHA-256 hash + a public certificate
  link anyone can verify.

## Free vs. cloud

Signing PDFs is **free forever** and needs no account. Saving a *verified*
signature to our cloud is a hosted feature — it requires a Universal ID plus a
token, an active project, or a subscription, because hosting costs money. Don't
want to pay? **Self-host the whole thing for free** (see below).

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

## Self-hosting

Universal Signatures is MIT-licensed and self-contained. To run your own copy —
including cloud save against **your own** Supabase, with no entitlement gate:

1. Clone this repo and `npm install`.
2. Create a Supabase project and apply the `signatures` table + the
   `verify_signature_cert` RPC (see `0028_signatures.sql` in the platform repo,
   or the SQL in `docs/`).
3. Set `VITE_PLATFORM_SUPABASE_URL` / `VITE_PLATFORM_SUPABASE_ANON_KEY` to your
   project in `.env.local`.
4. Relax or remove the entitlement check in `src/lib/cloud.ts` (`useCloudGate`)
   so cloud save is available to all your signed-in users.
5. `npm run build` and host `dist/` anywhere static (Cloudflare Pages, Netlify,
   nginx, …).

That's it — you get the full app, cloud save included, for the cost of your own
hosting.

## Privacy

PDFs are parsed and signed locally and never uploaded. Only the optional
"save verified signature" feature sends data (your signature image + hash) to the
cloud, and only when you're signed in and choose to.
