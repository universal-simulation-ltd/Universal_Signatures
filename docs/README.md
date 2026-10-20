# Universal Signatures — docs

## What this repo is

Universal Signatures lets you **draw or type a signature and sign PDFs
entirely in the browser** — documents never leave the device. Signing is free
forever and needs no account; anyone can save signatures in the browser for
reuse, and carry them to another device as a file (`src/lib/signatureFile.ts`,
the suite transfer file, optional password). A Universal ID is asked for only
by the signing certificate and Send to be signed, at the moment they are
chosen (login-free plan, 2026-10-20; the cloud save against a Universal ID was
removed then, and its certificate links still verify).

- **Live:** [opensource.unisim.co.uk/signatures](https://opensource.unisim.co.uk/signatures)
  — served by path via the `opensource-portal` Worker, which proxies
  `/signatures` to the Git-connected `universal-signatures` Cloudflare Pages
  project.
- **Stack:** Vite 6 + React 18 + TypeScript, Tailwind v4, zustand; `pdf-lib`
  for client-side signing and `pdfjs-dist` for rendering; `@unisim/sdk` for
  the shared navbar, SSO and entitlements (with an offline mock-auth mode for
  local dev).
- **Local save:** `src/lib/localSignatures.ts` keeps a capped localStorage
  list so guests can save/reuse signatures with no account;
  `src/lib/signatureFile.ts` saves it to / opens it from a file.
- **Tests:** `npm run test:file` (Playwright, against `vite preview`) and
  `npm run test:modal`.

MIT licensed — free and open source, like all Universal Apps.

## Suite context

This repo is one part of the **Universal Simulation suite** (the open-source
Universal Apps family). For cross-repo context — how the `@unisim/sdk`, edge
routing, and the suite changelog wire together — see the suite docs repo:
[`universal-simulation-ltd/docs`](https://github.com/universal-simulation-ltd/docs)
(private; checked out at the umbrella root as `Docs_UNI_SIM/` for suite
contributors). Start with `ARCHITECTURE.md` (the cross-repo map).

## Tests

`npm run test:modal` drives the built app in a real browser at phone portrait,
phone landscape and desktop sizes. It pins the two things that are invisible to
a type-check: that the position-picker dialog stays above the SDK nav bar with
its header and action row reachable, and that no text control computes under
16px on a touch device (which is what makes iOS Safari zoom in on focus and
never zoom back). Build first, then serve — the test drives `dist`, not `src`:

```
npm run build
npx vite preview --port 5186 --strictPort
npm run test:modal
```

Playwright is not a dependency of this repo; the test borrows the install from
a sibling Universal App, or `npm i -D playwright && npx playwright install
chromium` if you have none.
