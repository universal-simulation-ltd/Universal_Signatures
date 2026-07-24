# Signing provenance / evidence-of-signing — scope-out

**Status:** recommendation only. No backend, schema, or capture code is built by
this document. This exists to decide *whether* and *how* Universal Signatures
should capture an audit trail of signing metadata (IP, VPN/proxy detection,
coarse geolocation, machine timezone, local date/time), the way DocuSign and
Adobe Sign attach a "Certificate of Completion" / audit page to a signed
document.

---

## 1. What DocuSign / Adobe Sign actually attach

Their audit trail (the appended "Certificate of Completion") records, per
signer and event: signer name + email, a signature/document hash, timestamps
(server time, usually UTC), the signer's **public IP address**, and often a
coarse IP-derived location. Adobe Sign adds authentication method and a
per-transaction ID. The load-bearing property is not the richness of the fields
— it is that they are **collected server-side by the vendor and bound to the
document**, so the signer cannot self-report them and the record cannot be
edited after the fact.

That last point is the whole game, and it is exactly where our current
architecture is in tension.

---

## 2. The local-first tension (the central issue)

Universal Signatures' promise today is **nothing is uploaded** — the PDF is
signed with `pdf-lib` in the browser and the bytes never leave the device. The
only server touch is the optional, opt-in "verifiable record" (metadata-only:
email, filename, document hash, time — see `ApplyToPdf.tsx` +
`recordSigningEvent` in `lib/cloud.ts`).

Split the desired metadata by **where it can be known**:

| Signal | Knowable where? | Trustworthy? |
|---|---|---|
| **Public IP address** | **Server only** | Yes — the client cannot see or forge the IP the server observes |
| **VPN / proxy / Tor detection** | **Server only** (needs the IP + a reputation/ASN lookup) | Yes, within the accuracy of the reputation dataset |
| **IP-based coarse geolocation** (city / country) | **Server only** (derived from the observed IP) | Yes, as a *network* location — not where the person physically is |
| **Precise geolocation** (GPS lat/long) | **Client only**, `navigator.geolocation`, **hard permission prompt** | Self-reported — the browser can be told to lie; only as good as the device |
| **Machine timezone** | **Client only**, `Intl.DateTimeFormat().resolvedOptions().timeZone` | Self-reported, but cheap and no prompt |
| **Local date/time at signing** | **Client only**, `new Date()` | Self-reported (clock can be wrong/set) |

**Key conclusion:** the fields that make a DocuSign audit trail *evidential* —
IP, VPN/proxy flag, IP-geolocation — are **only obtainable server-side**. There
is no client-side trick for them: any IP the browser reports about itself is
either wrong (LAN address) or trivially spoofable. Capturing them is therefore
a **genuine, material shift away from the no-upload promise** — the signing
event (at minimum a request carrying the document hash) must reach one of our
servers so the server can observe the connecting IP from the request headers.

The suite already has the right primitive for this: the future two-party
send-to-signer flow (next-products.md §3) is specced with **a small Worker that
captures the signer IP using the service-role key**, and Universal PDF's
`SignCertificatePage` already references a `verify_pdf_sign_cert` RPC that
deliberately withholds the "full IP" from the public verify view. So the
edge-Worker-captures-IP pattern is a known quantity in the suite; this is about
whether to bring a slice of it into Signatures' *single-party* flow.

Only **timezone + local date/time + (with an explicit permission prompt)
precise geolocation** are purely client-side and can be embedded without any
server ever seeing the document or the connection. These are worth capturing as
a "soft" provenance layer, but they are **self-attested**, not independent
evidence — a determined signer can set them to anything.

---

## 3. Consent / GDPR

All of this is **personal data** under UK GDPR: an IP address is explicitly
treated as personal data (identifiable via the ISP), and precise geolocation is
arguably special-category-adjacent. Implications:

- **Never silent.** Capture must be explicit and opt-in, presented *before*
  signing, with a plain statement of exactly what is recorded and why. The
  existing "Add a verification QR code" checkbox is the right UX precedent — an
  unchecked, clearly-labelled opt-in — and any provenance capture should sit
  behind the same kind of gate, not be bundled invisibly into it.
- **Lawful basis + purpose limitation.** The basis is most cleanly *consent*
  (or legitimate interest for fraud-prevention, but consent is safer given the
  self-serve, no-contract context). Data captured for "proof of signing" must
  not be reused for anything else.
- **Transparency + retention.** Needs a specific privacy-notice line, a stated
  retention period, and a deletion path. The signer must be able to see what
  was attached to *their* signature (it is literally on the audit page, which
  helps).
- **Data minimisation.** Coarse (country/city) IP-geolocation is far more
  defensible than storing precise GPS. Prefer storing a **VPN/proxy boolean +
  country**, not a raw lat/long, unless there is a concrete need.
- **The free tier makes consent friction worse, not better.** A guest with no
  account has no relationship to fall back on; the opt-in and notice have to
  carry the whole weight. This argues for keeping provenance capture on the
  *authenticated/hosted* path (see §5).

---

## 4. Tamper-evidence — provenance is worthless unless bound to the signature

Metadata sitting in a database row next to a signature proves nothing if it can
be edited or if it can't be tied back to *this* document. To be evidential it
must be **bound and tamper-evident**:

1. **Bind to the document.** We already SHA-256 the original PDF bytes
   (`sha256Bytes`). The provenance record must include that document hash so it
   is provably about *this* file, not a substituted one.
2. **Embed in the signed PDF.** Append a human-readable **audit page** to the
   output PDF (mirroring DocuSign's certificate) listing the captured fields +
   the document hash + a verify URL/QR. This is the piece a recipient actually
   sees. `pdf-lib` can add the page client-side; the server-only fields (IP,
   VPN, geo) would have to be fetched from the Worker first and then drawn in.
3. **Anchor server-side and sign the record.** The authoritative copy of the
   provenance (including IP/VPN/geo) lives in a server row keyed by a public
   `cert_id`, exactly like `recordSigningEvent` today. Ideally the server
   **hashes-and-signs** the whole provenance bundle (document hash + metadata +
   server timestamp) so the audit page can be checked against an
   independently-held record and any edit is detectable. Server timestamp — not
   client clock — is the trustworthy time.
4. **Don't confuse the two clocks.** Client `new Date()` is "the signer's local
   time" (self-reported, useful context). The server request time is the
   evidential timestamp. The audit page should show both and label them
   honestly.

Without at least (1)+(2)+(3), adding IP/geo fields is theatre — it *looks* like
DocuSign without the property that makes DocuSign's version worth anything.

---

## 5. Free-vs-hosted split, and where this belongs

**Free vs hosted.** The purely client-side signals (timezone, local time,
opt-in precise geolocation) can be embedded on the free, no-account path with no
server and no upload — a nice "soft provenance" upgrade that stays true to the
no-upload promise, as long as it is honestly labelled as *self-attested*. The
server-derived, evidential signals (IP, VPN/proxy, IP-geolocation) **cannot** be
free-and-local by definition; they require a request to our infrastructure and
a stored, signed record. Those belong on the **authenticated + entitled
(hosted)** path — the same gate as the verifiable-record / cloud-save feature —
both because it costs money to run and because an identified user + retention
policy is what makes the consent story coherent.

Recommended tiering:

- **Free / local:** optional, opt-in *self-attested* provenance — timezone,
  local date/time, (with prompt) precise geolocation — embedded as an audit
  page in the client-signed PDF. Clearly marked "self-reported".
- **Hosted / entitled:** *verified* provenance — server-observed IP,
  VPN/proxy flag, coarse IP-geolocation, server timestamp — captured by an edge
  Worker, hashed+signed, stored against a `cert_id`, embedded in the audit page
  and re-checkable at the verify URL.

**Signatures-only vs shared SDK capability.** Do **not** build this as a
Signatures-only feature. Universal PDF has its own sign flow (`SignaturePad`,
`SignCertificatePage`, the two-party send-to-signer path) and will want the
identical audit trail — and the suite already leans on a shared `@unisim/sdk`
plus a shared verify/RPC pattern (`verify_pdf_sign_cert` /
`verify_signing_event`). The right shape is a **shared "signing audit"
capability**:

- an edge Worker (or shared Worker route) that observes the request IP, runs the
  VPN/ASN + geo lookup, writes the signed provenance row, and returns the
  non-secret fields for embedding (the public verify RPC withholds the raw IP,
  exactly as PDF's cert page already does);
- an `@unisim/sdk` helper for the client-side pieces (gather timezone/local
  time/geolocation, request the server capture, compose the audit page) so
  Signatures *and* Universal PDF call one implementation;
- one provenance table / `cert_id` scheme reused across both products (the flat
  prefixed public-schema convention).

Building it once in the SDK avoids two divergent audit-trail implementations and
two privacy-notice variants to keep in sync.

---

## 6. Recommendation (one paragraph)

Ship the **client-side, self-attested** slice (timezone + local date/time +
opt-in precise geolocation, embedded as a labelled audit page in the
already-client-signed PDF) as a free, opt-in enhancement — it is honest, cheap,
and preserves the no-upload promise. Treat **server-observed IP / VPN / coarse
geolocation as a separate, hosted, entitled feature** that is an explicit,
consented departure from no-upload, and **build it as a shared `@unisim/sdk`
"signing audit" capability** (edge Worker captures + signs the provenance,
public RPC withholds the raw IP) so Universal PDF's sign flow reuses the exact
same implementation, table, and privacy notice rather than each product growing
its own. Do not add any IP/geo field anywhere unless it is bound to the document
hash and embedded/hashed so it is tamper-evident — otherwise it is decorative.

---

### Appendix — concrete client-side APIs (for the free slice)

- Timezone (no prompt): `Intl.DateTimeFormat().resolvedOptions().timeZone`
  (e.g. `Europe/London`).
- UTC offset (no prompt): `new Date().getTimezoneOffset()`.
- Local date/time (no prompt): `new Date().toISOString()` +
  `formatSigningDate()` / `formatSigningTime()` (already in `lib/signature.ts`).
- Precise location (**hard permission prompt**, may be denied/blocked by policy):
  `navigator.geolocation.getCurrentPosition(...)`. Handle denial as the default.

None of the above can see the public IP or detect a VPN — those remain
server-only. Any client library claiming to return "your IP" does so by calling
a third-party server, which is itself an upload and defeats the point.
