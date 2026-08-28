# What Universal Signatures does with your signature and your PDF

You landed here from the word **Guaranteed**, so this page owes you something
better than a privacy policy. It is written to be checked: every claim below
names the file in this repository that makes it true, and you are welcome to
go and read it.

The short version: **your signature is drawn, and your PDF is signed, by your
own browser.** The PDF you sign is never uploaded — not to be rendered, not to
be stamped, not at all. There are three things in this app that *can* send
something out, all of them optional, and this page names all three, because
this is an app about trust and a vague privacy page would be self-defeating.

---

## What happens when you sign a PDF

| Step | Where it happens | The code |
|---|---|---|
| Drawing or typing your signature | your browser's canvas | [`src/components/sig/SignaturePad.tsx`](src/components/sig/SignaturePad.tsx), [`src/components/sig/TypeSignature.tsx`](src/components/sig/TypeSignature.tsx) |
| Reading the PDF and showing the pages | your browser, via Mozilla's PDF.js | [`src/lib/pdfjs.ts`](src/lib/pdfjs.ts) |
| Stamping the signature onto the page | your browser, via pdf-lib | [`src/lib/pdf.ts`](src/lib/pdf.ts), [`src/components/sig/ApplyToPdf.tsx`](src/components/sig/ApplyToPdf.tsx) |
| Saving the signed PDF | your browser's download | [`src/lib/pdf.ts`](src/lib/pdf.ts) |

**The PDF you sign never leaves your device, in any of the flows below.** Even
when you make a verifiable record (see below), what is sent is a fingerprint of
the document, never the document.

**Signatures saved "on this device" really are.** They live in your browser's
localStorage and no account is involved — see
[`src/lib/localSignatures.ts`](src/lib/localSignatures.ts). Clearing your
browser data deletes them.

---

## The three things that *can* send something — all optional

### 1. "Save to the cloud"

If you are signed in and choose it, your signature image is stored against your
Universal ID so it is there on your other devices.

- The code: [`src/lib/cloud.ts`](src/lib/cloud.ts)
- The panel that asks you: [`src/components/sig/CloudSavePanel.tsx`](src/components/sig/CloudSavePanel.tsx)
- What travels: the signature image. **Not the PDF.**

⚠️ **This is ordinary cloud storage, not end-to-end encryption.** We hold the
keys, so this is a promise about our conduct rather than a mathematical
guarantee. The free "on this device" option exists precisely so you never have
to make that trade.

### 2. "Sign on your phone"

This is the one people don't expect, and it is the reason this page exists.

Scanning the QR code to draw your signature on your phone means the signature
has to get from the phone back to the computer — and it does that over the
internet, through a relay, because the two devices have no other way to talk to
each other.

- The code: [`src/lib/mobileSign.ts`](src/lib/mobileSign.ts),
  [`src/components/sig/PhoneSignPanel.tsx`](src/components/sig/PhoneSignPanel.tsx)
- What travels: **the signature image you drew on the phone.** Not the PDF —
  the PDF stays on the computer the whole time.
- It is protected by a one-time token in the QR link plus a 6-digit PIN shown
  on the desktop; the desktop rejects a payload whose PIN doesn't match.
- ⚠️ **It is a live relay, not storage.** The message is a broadcast on a
  realtime channel and **no database rows are written** — which is why this
  works identically whether or not you have an account. That is stated at the
  top of [`src/lib/mobileSign.ts`](src/lib/mobileSign.ts), and it is checkable.

### 3. "Create a verifiable record" (the certificate page)

If you are signed in and tick this, the app creates a record that lets anyone
holding the signed PDF confirm it hasn't been altered since you signed it.

- The code: [`src/components/sig/ApplyToPdf.tsx`](src/components/sig/ApplyToPdf.tsx)
  and the shared [`signingAudit.ts`](https://github.com/universal-simulation-ltd/universal-platform/blob/main/packages/sdk/src/signingAudit.ts)
- What travels: **a SHA-256 hash of the document**, the **original filename**,
  and the **email address on your Universal ID**. A hash is a fingerprint — it
  cannot be turned back into the document, which is the entire point: it proves
  a file matches without anyone needing to hold the file.
- ⚠️ **The filename is real information and we are not going to pretend
  otherwise.** "Redundancy_letter_Sam.pdf" says something even when its
  contents don't travel. If that matters for a particular document, don't tick
  the box — the signature works exactly the same without it.
- The certificate page is deliberately careful about what it claims: it
  separates facts our server holds (the record's timestamp, your verified
  email) from facts your own machine reported (its clock, its timezone), and
  says so on the page, because presenting the second kind with the authority of
  the first would be a lie of layout. There is no geolocation.

---

## What the app talks to a server for otherwise

- **Signing in.** Only if you choose to. The app signs PDFs without an account.
- **"You opened the app".** When you are signed in, the app records one event
  saying the app was opened, so your account's activity page is accurate. It
  does not include anything about your document.
  See [`src/UsageTracker.tsx`](src/UsageTracker.tsx).
- **The changelog and update notice.**

**There is no third-party analytics, no tracking pixel, and no advertising
script.**

---

## How to prove it to yourself in about a minute

1. Open the app, then open your browser's developer tools (F12) on the
   **Network** tab.
2. Drop a PDF in, draw a signature, place it, and export the signed file —
   without touching cloud save, phone signing or the verifiable record.
3. Watch the list. Your PDF is never in it.

Or, more conclusively: **turn off your Wi-Fi and sign a PDF.** It works. Only
the three optional features above need a connection, and each of them tells you
so by failing rather than by silently doing nothing.

---

## If you find this page is wrong

That is worth more to us than it costs. Open an issue on
[the repository](https://github.com/universal-simulation-ltd/Universal_Signatures/issues).
A claim nobody can correct isn't a guarantee either.
