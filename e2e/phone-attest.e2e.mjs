// Scan to sign, step 2 (platform 0306), on the desktop side, in a real browser
// against the production build and the real Realtime relay.
//
//   npm run build && npx vite preview --port 5186 --strictPort
//   npm run test:phone-attest          # in another terminal
//
// Plays the UNI·SIM Hub phone: joins the desktop's `mobile-sig:<token>`
// channel (the token read from the page's own Realtime join) and broadcasts a
// signature with the right PIN, three ways. The attestation lookup is mocked —
// a real row needs a signed-in Hub — and answers like the real RPC would.
//   1. No `attest` (this app's phone page, an older Hub): received, no line.
//   2. `attest` whose record is for another image: received, no line.
//   3. `attest` whose record matches this channel and image: received, and
//      "Signed by … via Universal ID" with a Check link to app.unisim.co.uk.

import { createHash } from 'node:crypto'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { createClient } from '@supabase/supabase-js'

const HERE = dirname(fileURLToPath(import.meta.url))
const BASE = process.env.E2E_BASE_URL ?? 'http://localhost:5186/signatures/'
const SUPABASE_URL = 'https://rygfxgalojojppxmhddo.supabase.co'

const PLAYWRIGHT_CANDIDATES = [
  '../../Universal_Beam/node_modules/playwright/index.js',
  '../../Universal_Video/node_modules/playwright/index.js',
  '../../Universal_PDF/node_modules/playwright/index.js',
  '../node_modules/playwright/index.js',
]
async function loadPlaywright() {
  for (const rel of PLAYWRIGHT_CANDIDATES) {
    try {
      const mod = (await import(pathToFileURL(join(HERE, rel)).href)).default
      const probe = await mod.chromium.launch()
      await probe.close()
      return mod
    } catch { /* next */ }
  }
  console.error('No usable Playwright found. Install it in a sibling Universal app (e.g. Universal_Beam).')
  process.exit(2)
}

const failures = []
function check(label, condition, detail) {
  if (condition) console.log(`  ✓ ${label}`)
  else { console.log(`  ✗ ${label}${detail ? ` — ${detail}` : ''}`); failures.push(label) }
}

// Two different real PNGs (a 2×2 red and a 2×2 blue square).
const RED = 'iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAEklEQVR42mP8z8DwnwEIGGEMACgAA/2N7ohyAAAAAElFTkSuQmCC'
const BLUE = 'iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAEklEQVR42mNkYPj/nwEIGGEMAB/0A/3aLDy4AAAAAElFTkSuQmCC'
const sha = (b) => createHash('sha256').update(b).digest('hex')
const CERT = 'c0ffee00c0ffee00c0ffee00c0ffee00'

const { chromium } = await loadPlaywright()
const browser = await chromium.launch()
const page = await (await browser.newContext({ viewport: { width: 1280, height: 900 } })).newPage()
const consoleErrors = []
page.on('pageerror', (e) => consoleErrors.push(`pageerror: ${e.message}`))

// The desktop's channel token, from its own Realtime join.
let token = null
let anonKey = null
page.on('websocket', (ws) => {
  // The anon key rides in the Realtime URL; the "phone" joins with the same one.
  const k = new URL(ws.url()).searchParams.get('apikey')
  if (k) anonKey = k
  ws.on('framesent', (f) => {
  const m = /realtime:mobile-sig:([0-9a-f]+)/.exec(String(f.payload))
  if (m) token = m[1]
  })
})

// What the lookup answers; set per round.
let rpcBody = { ok: false }
let rpcCalls = 0
await page.route('**/rest/v1/rpc/verify_phone_sign_attestation*', (r) => {
  rpcCalls += 1
  r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(rpcBody) })
})


async function freshCode() {
  token = null
  await page.goto(BASE)
  await page.getByRole('button', { name: 'Sign on phone' }).first().click()
  await page.waitForFunction(() => /\b\d{6}\b/.test(document.body.innerText), null, { timeout: 20000 })
  for (let i = 0; i < 100 && !token; i++) await page.waitForTimeout(100)
  const pin = await page.evaluate(() => {
    const el = [...document.querySelectorAll('p')].find((p) => /^\d{6}$/.test(p.textContent.trim()))
    return el?.textContent.trim()
  })
  return { pin, token }
}

async function sendAsPhone(tok, pin, b64, attest) {
  const sb = createClient(SUPABASE_URL, anonKey, { auth: { persistSession: false } })
  const ch = sb.channel(`mobile-sig:${tok}`, { config: { broadcast: { self: false } } })
  const replied = new Promise((resolve) => ch.on('broadcast', { event: 'result' }, (m) => resolve(m.payload)))
  await new Promise((resolve, reject) => ch.subscribe((s) => (s === 'SUBSCRIBED' ? resolve() : s === 'CHANNEL_ERROR' && reject(new Error(s)))))
  const payload = { pin, signature: `data:image/png;base64,${b64}`, nonce: 'e2e' }
  if (attest) payload.attest = attest
  await ch.send({ type: 'broadcast', event: 'signature', payload })
  const result = await Promise.race([replied, new Promise((r) => setTimeout(() => r(null), 10000))])
  await sb.removeChannel(ch)
  return result
}

function row(tok, b64) {
  return {
    ok: true, cert_id: CERT, signer_email: 'hub.signer@example.com', app: 'signatures',
    channel_sha256: sha(tok), png_sha256: sha(Buffer.from(b64, 'base64')), signed_at: '2026-10-22T14:07:00+00:00',
  }
}

try {
  for (const round of ['no attest', 'attest for another image', 'matching attest']) {
    console.log(round)
    const { pin, token: tok } = await freshCode()
    check('code shows a PIN and joins a channel', !!pin && !!tok && !!anonKey, `pin=${pin} token=${tok} key=${!!anonKey}`)
    if (!pin || !tok || !anonKey) continue
    rpcCalls = 0
    rpcBody = round === 'attest for another image' ? row(tok, BLUE) : row(tok, RED)
    const result = await sendAsPhone(tok, pin, RED, round === 'no attest' ? undefined : CERT)
    check('desktop accepts the signature', result?.ok === true, JSON.stringify(result))
    await page.getByText('Signature received ✓').waitFor({ timeout: 10000 }).catch(() => {})
    check('received panel shows', await page.getByText('Signature received ✓').isVisible())
    await page.waitForTimeout(1500)
    const line = page.getByTestId('phone-attested')
    if (round === 'matching attest') {
      check('lookup made once', rpcCalls === 1, String(rpcCalls))
      check('signed-by line shows', await line.isVisible())
      const text = (await line.textContent()) ?? ''
      check('names the signer via Universal ID', /Signed by hub\.signer@example\.com via Universal ID · /.test(text), text)
      const href = await line.getByRole('link').getAttribute('href')
      check('Check links to the hub', href === `https://app.unisim.co.uk/check?attest=${CERT}`, href)
      if (process.env.E2E_SHOT) await line.locator('..').screenshot({ path: process.env.E2E_SHOT })
    } else {
      check(round === 'no attest' ? 'no lookup' : 'lookup made', round === 'no attest' ? rpcCalls === 0 : rpcCalls === 1, String(rpcCalls))
      check('no signed-by line', (await line.count()) === 0)
    }
  }
  check('no page errors', consoleErrors.length === 0, consoleErrors.join(' | '))
} finally {
  await browser.close()
}

if (failures.length) {
  console.log(`\n${failures.length} failed`)
  process.exit(1)
}
console.log('\nall passed')
process.exit(0)
