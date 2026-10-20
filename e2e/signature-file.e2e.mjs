// Saved signatures as a file, with no sign-in anywhere (2026-10-20).
//
//   npm run build && npx vite preview --port 5186 --strictPort
//   npm run test:file                  # in another terminal
//
// What it pins, in a real browser against the production build:
//   1. Draw a signature, save it on this device.
//   2. Save to a file — plain, and with a password (the encrypted file must not
//      carry the image in the clear).
//   3. Clear the browser's storage: the signature is gone.
//   4. Open the encrypted file: refused without a password and with a wrong
//      one, then opened with the right one; the signature is back. Opening the
//      plain file again adds nothing twice.
//   5. Hostile files (not JSON, another app's, an SVG / script dressed as a
//      PNG, a mislabelled data URL, a flood of entries, huge labels with
//      control characters) are refused or cleaned, and run nothing.
//   6. Nothing asks to sign in on load, and the old "Online" save is gone.
//   7. A certificate for a saved signature issued before this change still
//      verifies (mocked RPCs; set E2E_REAL_CERT=<cert id> to also check a
//      real one against production).
//   8. No console errors along the way.

import { readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const BASE = process.env.E2E_BASE_URL ?? 'http://localhost:5186/signatures/'
const REAL_CERT = process.env.E2E_REAL_CERT ?? ''

// This app has no Playwright of its own; borrow a sibling's (as test:modal does).
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
    } catch {
      /* next */
    }
  }
  console.error('No usable Playwright found. Install it in a sibling Universal app (e.g. Universal_Beam).')
  process.exit(2)
}

const failures = []
function check(label, condition, detail) {
  if (condition) console.log(`  ✓ ${label}`)
  else {
    console.log(`  ✗ ${label}${detail ? ` — ${detail}` : ''}`)
    failures.push(label)
  }
}

const LOCAL_KEY = 'unisim.signatures.local.v1'
const PASSWORD = 'correct horse battery'

const { chromium } = await loadPlaywright()
const browser = await chromium.launch()
const context = await browser.newContext({ acceptDownloads: true, viewport: { width: 1280, height: 900 } })
const page = await context.newPage()

const consoleErrors = []
page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()) })
page.on('pageerror', (e) => consoleErrors.push(`pageerror: ${e.message}`))
const dialogs = []
page.on('dialog', async (d) => { dialogs.push(d.message()); await d.dismiss() })

async function openSaveCard() {
  const toggle = page.getByRole('button', { name: 'Save your signature' })
  await toggle.waitFor({ timeout: 20000 })
  if ((await toggle.getAttribute('aria-expanded')) !== 'true') await toggle.click()
  await page.getByTestId('signature-file').waitFor()
}

async function localList() {
  return page.evaluate((k) => JSON.parse(localStorage.getItem(k) || '[]'), LOCAL_KEY)
}

// Each answer carries a growing `data-note` number; wait for one newer than the
// last we read, so a repeat of the same sentence still counts as an answer.
let lastNote = 0
async function note() {
  const handle = await page.waitForFunction((prev) => {
    const el = document.querySelector('[data-testid=signature-file] [data-note]')
    return el && Number(el.getAttribute('data-note')) > prev ? [Number(el.getAttribute('data-note')), el.textContent] : null
  }, lastNote, { timeout: 30000 })
  const [n, text] = await handle.jsonValue()
  lastNote = n
  return text ?? ''
}

async function openFile(spec) {
  await page.getByTestId('signature-file-input').setInputFiles(spec)
  return note()
}

async function download(trigger) {
  const [dl] = await Promise.all([page.waitForEvent('download'), trigger()])
  const path = await dl.path()
  return { name: dl.suggestedFilename(), text: await readFile(path, 'utf8'), path }
}

function jsonFile(name, obj) {
  return { name, mimeType: 'application/json', buffer: Buffer.from(typeof obj === 'string' ? obj : JSON.stringify(obj)) }
}
function envelope(data, extra = {}) {
  return { format: 'unisim-transfer', version: 1, product: 'signatures', kind: 'saved-signatures', schema: 1, exportedAt: new Date().toISOString(), data, ...extra }
}

try {
  console.log('Studio, signed out')
  await page.goto(BASE, { waitUntil: 'domcontentloaded' })
  await page.getByRole('heading', { name: 'Create your signature' }).waitFor({ timeout: 20000 })
  await page.waitForTimeout(1500)
  check('no dialog is open on load', (await page.locator('[role=dialog]:visible').count()) === 0)

  // 1. Draw a signature.
  const pad = page.locator('canvas[aria-label^="Signature pad"]').first()
  await pad.scrollIntoViewIfNeeded()
  const box = await pad.boundingBox()
  await page.mouse.move(box.x + 30, box.y + box.height * 0.6)
  await page.mouse.down()
  for (let i = 1; i <= 24; i++) {
    await page.mouse.move(box.x + 30 + i * 12, box.y + box.height * (0.6 + 0.2 * Math.sin(i / 2)), { steps: 2 })
  }
  await page.mouse.up()
  await page.waitForTimeout(400)

  await openSaveCard()
  const card = page.getByRole('button', { name: 'Save your signature' }).locator('xpath=ancestor::div[contains(@class,"rounded-xl")][1]')
  const cardText = (await card.textContent()) ?? ''
  check('the save card has no Online tab', (await page.getByRole('button', { name: 'Online', exact: true }).count()) === 0)
  check('the save card does not mention a Universal ID', !/Universal ID/.test(cardText), cardText.slice(0, 120))
  check('"Save to a file" is disabled with nothing saved', await page.getByRole('button', { name: 'Nothing saved here yet' }).isDisabled())

  await page.getByPlaceholder('Name this signature (optional)').fill('E2E signature')
  await page.getByRole('button', { name: 'Save to this device' }).click()
  let list = await localList()
  check('saved on this device', list.length === 1 && list[0].label === 'E2E signature' && list[0].imageDataUrl.startsWith('data:image/png;base64,'))
  const originalImage = list[0]?.imageDataUrl

  // 2. Save to a file: plain, then with a password.
  const plain = await download(() => page.getByRole('button', { name: 'Save to a file' }).click())
  const plainJson = JSON.parse(plain.text)
  check('plain file name', /^my-signatures-\d{4}-\d{2}-\d{2}\.json$/.test(plain.name), plain.name)
  check('plain file is the suite envelope', plainJson.format === 'unisim-transfer' && plainJson.product === 'signatures' && plainJson.kind === 'saved-signatures' && plainJson.schema === 1)
  check('plain file holds the signature', plainJson.data?.signatures?.length === 1 && plainJson.data.signatures[0].imageDataUrl === originalImage && plainJson.data.signatures[0].label === 'E2E signature')

  await page.getByLabel('Password for the file (optional)').fill(PASSWORD)
  const locked = await download(() => page.getByRole('button', { name: 'Save to a file' }).click())
  const lockedJson = JSON.parse(locked.text)
  check('password file is encrypted', !!lockedJson.encrypted && !('data' in lockedJson) && lockedJson.encrypted.cipher === 'AES-256-GCM')
  check('password file does not carry the image or name in the clear', !locked.text.includes(originalImage.slice(30, 90)) && !locked.text.includes('E2E signature'))

  // 3. Clear storage.
  await page.evaluate(() => localStorage.clear())
  await page.reload({ waitUntil: 'domcontentloaded' })
  lastNote = 0
  await openSaveCard()
  check('storage cleared: nothing saved', (await localList()).length === 0)

  // 4. Open the encrypted file.
  let msg = await openFile(locked.path)
  check('encrypted file without a password asks for one', /has a password/.test(msg), msg)
  await page.getByLabel('Password for the file (optional)').fill('wrong password')
  await page.getByRole('button', { name: 'Open it' }).click()
  msg = await note()
  check('a wrong password is refused', /doesn.t open this file/.test(msg), msg)
  check('nothing imported on a wrong password', (await localList()).length === 0)
  await page.getByLabel('Password for the file (optional)').fill(PASSWORD)
  await page.getByRole('button', { name: 'Open it' }).click()
  msg = await note()
  check('the right password opens it', /Added 1 signature from the file/.test(msg), msg)
  list = await localList()
  check('the signature is back, as a copy', list.length === 1 && list[0].imageDataUrl === originalImage && list[0].label === 'E2E signature')
  check('it shows in the list', await page.getByRole('button', { name: 'E2E signature' }).isVisible())

  await page.getByLabel('Password for the file (optional)').fill('')
  msg = await openFile(plain.path)
  check('opening the plain file again adds nothing twice', /already here/.test(msg) && (await localList()).length === 1, msg)

  await page.evaluate(() => localStorage.clear())
  await page.reload({ waitUntil: 'domcontentloaded' })
  lastNote = 0
  await openSaveCard()
  msg = await openFile(plain.path)
  check('the plain file opens with no password', /Added 1 signature/.test(msg) && (await localList()).length === 1, msg)

  // 5. Hostile files.
  console.log('Hostile files')
  await page.evaluate(() => localStorage.clear())
  const svg = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" onload="alert(1)"><script>alert(2)</script></svg>').toString('base64')
  const png = originalImage
  const ctrl = 'Evil\u0000\u0007‮<img src=x onerror=alert(3)>' + 'x'.repeat(10000)

  msg = await openFile(jsonFile('nope.json', 'this is not json {'))
  check('not JSON is refused', /isn.t a file this app saved/.test(msg), msg)
  msg = await openFile(jsonFile('other.json', { ...envelope({ signatures: [] }), product: 'blackbook' }))
  check("another app's file is refused", /different app/.test(msg), msg)
  msg = await openFile(jsonFile('newer.json', envelope({ signatures: [] }, { schema: 9 })))
  check('a newer schema is refused', /newer version/.test(msg), msg)
  msg = await openFile(jsonFile('shape.json', envelope({ signatures: 'all of them' })))
  check('a wrong shape is refused as damaged', /damaged/.test(msg), msg)
  msg = await openFile(jsonFile('svg.json', envelope({ signatures: [
    { imageDataUrl: `data:image/svg+xml;base64,${svg}`, label: 'svg' },
    { imageDataUrl: `data:image/png;base64,${svg}`, label: 'svg dressed as png' },
    { imageDataUrl: `data:image/jpeg;base64,${png.split(',')[1]}`, label: 'png called jpeg' },
    { imageDataUrl: 'javascript:alert(4)', label: 'js' },
    { imageDataUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUg==', label: 'png header, no image' },
    'a string', null, 42,
  ] })))
  check('a file of bad images imports nothing', /no signatures that can be used/.test(msg) && (await localList()).length === 0, msg)
  const flood = Array.from({ length: 500 }, (_, i) => ({ imageDataUrl: png, label: `copy ${i}` }))
  // `"__proto__"` as an own key can only be written as raw JSON text.
  const mixed = JSON.stringify(envelope({ signatures: [
    { imageDataUrl: png, label: ctrl, signerName: ctrl, style: '<b>', font: '../../etc', createdAt: 'not a date' },
    ...flood,
  ] })).replace('{"imageDataUrl"', '{"__proto__":{"polluted":true},"imageDataUrl"').replace('"data":{', '"data":{"__proto__":{"polluted":true},')
  msg = await openFile(jsonFile('mixed.json', mixed))
  list = await localList()
  check('a valid PNG among junk is imported once', list.length === 1, `${list.length} entries — ${msg}`)
  check('entries past the cap are reported, not read', /could not be used/.test(msg), msg)
  check('label and name are capped and cleaned', list[0] && list[0].label.length <= 80 && list[0].signerName.length <= 80 && !/[\u0000-\u001f]/.test(list[0].label))
  check('style, font and date are normalised', list[0] && list[0].style === 'draw' && list[0].font === null && !Number.isNaN(Date.parse(list[0].createdAt)))
  check('no prototype pollution', await page.evaluate(() => ({}).polluted === undefined))
  const big = await openFile(jsonFile('huge.json', envelope({ signatures: [{ imageDataUrl: 'data:image/png;base64,' + 'A'.repeat(2_000_000) }] })))
  check('an oversized image is left out', /no signatures that can be used/.test(big), big)
  await page.waitForTimeout(500)
  check('no hostile file ran script (no alert)', dialogs.length === 0, dialogs.join(' | '))
  check('only PNGs reached storage', (await localList()).every((s) => s.imageDataUrl.startsWith('data:image/png;base64,')))

  // 7. Verify page for an existing saved-signature certificate.
  console.log('Verify page')
  const cert = 'a'.repeat(32)
  await page.route('**/rest/v1/rpc/verify_signing_event_cert*', (r) => r.fulfill({ status: 200, contentType: 'application/json', body: '[]' }))
  await page.route('**/rest/v1/rpc/verify_pdf_sign_cert*', (r) => r.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":false}' }))
  await page.route('**/rest/v1/rpc/verify_signature_cert*', (r) => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([{ signer_name: 'Alex Morgan', org_name: null, signature_hash: 'f'.repeat(64), created_at: '2026-10-05T10:00:00Z' }]) }))
  await page.goto(`${BASE}verify/${cert}`, { waitUntil: 'domcontentloaded' })
  await page.getByText('Verified — this is a genuine saved signature').waitFor({ timeout: 20000 })
  check('a saved-signature certificate still verifies', await page.getByText('Alex Morgan').isVisible())
  await page.unrouteAll({ behavior: 'ignoreErrors' })

  if (REAL_CERT) {
    await page.goto(`${BASE}verify/${REAL_CERT}`, { waitUntil: 'domcontentloaded' })
    const ok = await page.getByText('Verified — this is a genuine saved signature').waitFor({ timeout: 20000 }).then(() => true, () => false)
    check('a real saved-signature certificate verifies against production', ok)
  }

  // 8. Console.
  check('no console errors', consoleErrors.length === 0, consoleErrors.slice(0, 5).join(' | '))
} catch (err) {
  console.log(`  ✗ crashed: ${err?.stack ?? err}`)
  failures.push('crashed')
} finally {
  await browser.close()
}

if (failures.length) {
  console.log(`\n${failures.length} failure(s)`)
  process.exit(1)
}
console.log('\nAll checks passed')
