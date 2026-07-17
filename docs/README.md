# Universal Signatures — docs

## What this repo is

Universal Signatures lets you **draw or type a signature and sign PDFs
entirely in the browser** — documents never leave the device. Signing is free
forever and needs no account; guests can also save signatures device-locally
for reuse. Optionally, a **verified signature** can be stored in the cloud
against a Universal ID (SHA-256 hash + a public certificate link anyone can
verify) — that hosted feature is gated behind a token, project, or
subscription, and the whole app can be self-hosted for free instead.

- **Live:** [opensource.unisim.co.uk/signatures](https://opensource.unisim.co.uk/signatures)
  — served by path via the `opensource-portal` Worker, which proxies
  `/signatures` to the Git-connected `universal-signatures` Cloudflare Pages
  project.
- **Stack:** Vite 6 + React 18 + TypeScript, Tailwind v4, zustand; `pdf-lib`
  for client-side signing and `pdfjs-dist` for rendering; `@unisim/sdk` for
  the shared navbar, SSO and entitlements (with an offline mock-auth mode for
  local dev).
- **Local save:** `src/lib/localSignatures.ts` keeps a capped localStorage
  list so guests can save/reuse signatures with no account.

MIT licensed — free and open source, like all Universal Apps.

## Suite context

This repo is one part of the **Universal Simulation suite** (the open-source
Universal Apps family). For cross-repo context — how the `@unisim/sdk`, edge
routing, and the suite changelog wire together — see the suite docs repo:
[`universal-simulation-ltd/docs`](https://github.com/universal-simulation-ltd/docs)
(private; checked out at the umbrella root as `Docs_UNI_SIM/` for suite
contributors). Start with `ARCHITECTURE.md` (the cross-repo map).
