// Two phone-sized regressions, pinned in a real browser (2026-08-30).
//
//   npm run build && npx vite preview --port 5186 --strictPort
//   npm run test:modal                 # in another terminal
//
// 1. **The dialog behind the nav bar.** The SDK's <UniversalAppsNavBar> wraps
//    its header in `position: relative; z-index: 1000` so the suite switcher
//    beats host content. The position picker was on Tailwind's `z-50`, so the
//    bar painted OVER it: at 844×390 the dialog's title and its × close button
//    were completely hidden behind the bar and `elementFromPoint` over the ×
//    returned the SDK <header> — you could neither see what you were in nor
//    shut it. The fix portals the dialog to <body>, lifts it to z-index 1100,
//    and pins the header and the action row outside the scrolling body.
//
// 2. **iOS input zoom.** Any input/textarea/select computing under 16px makes
//    iOS Safari and WKWebView zoom the page in on focus and never zoom back.
//    Fixed by flooring the size on `(pointer: coarse)` only, NOT by locking the
//    viewport with `maximum-scale=1` — pinch-zoom is an accessibility feature,
//    so the test also asserts the meta tag stays unlocked.
//
// Negative control (2026-08-30, run): rebuilt from the pre-fix source — `z-50`
// on the overlay, one scroll container for the whole panel, no coarse-pointer
// floor — this file reports 11 failures, including the two the owner described
// (`× is clickable` in landscape, and `no text control computes under 16px`).
// So the harness is not merely agreeing with whatever renders.
//
// ⚠️ Note what did NOT go red there: "the title is on screen" passed in
// landscape while the title was completely hidden behind the nav bar. A
// bounding box says nothing about what is painted on top of it — the
// `elementFromPoint` checks are the ones that catch occlusion, and a geometry
// assertion on its own would have called this bug fixed.

import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const BASE = process.env.E2E_BASE_URL ?? 'http://localhost:5186/signatures/'
const PDF = join(HERE, 'fixtures', 'sample.pdf')

// Sibling repos that carry a Playwright install — this app has none of its own.
// Launch a probe rather than trusting the first import that resolves: an
// install with no downloaded browser imports fine and fails at launch.
const PLAYWRIGHT_CANDIDATES = [
  '../../Universal_Video/node_modules/playwright/index.js',
  '../../Universal_Exports/node_modules/playwright/index.js',
  '../../Universal_PDF/node_modules/playwright/index.js',
  '../node_modules/playwright/index.js',
]

async function loadPlaywright() {
  const problems = []
  for (const rel of PLAYWRIGHT_CANDIDATES) {
    let mod
    try {
      mod = (await import(pathToFileURL(join(HERE, rel)).href)).default
    } catch {
      continue
    }
    try {
      const probe = await mod.chromium.launch()
      await probe.close()
      return mod
    } catch (err) {
      problems.push(`  ${rel}\n    ${String(err).split('\n')[0]}`)
    }
  }
  console.error(
    'No usable Playwright found. Candidates that imported but could not launch:\n' +
      (problems.join('\n') || '  (none imported at all)') +
      '\n\nInstall it in a sibling Universal app, or run:\n' +
      '  npm i -D playwright && npx playwright install chromium',
  )
  process.exit(2)
}

// ⚠️ Never measure anything after `page.screenshot({ fullPage: true })` in a
// mobile-emulated context. Capturing beyond the viewport drops Chromium's
// device-metrics override, so `(pointer: coarse)` stops matching and every
// font-size read after it comes back at the DESKTOP value — this file's own
// scratch version reported 14px for fields that were rendering at 16px, twice,
// before the order was swapped. Measure first, screenshot last.

const failures = []
function check(label, condition, detail) {
  if (condition) {
    console.log(`  ✓ ${label}`)
  } else {
    console.log(`  ✗ ${label}${detail ? ` — ${detail}` : ''}`)
    failures.push(label)
  }
}

// Drive the studio far enough to have a signature and a loaded PDF, which is
// what the "Choose position…" button needs before it will open.
async function openPositionPicker(page) {
  await page.goto(BASE, { waitUntil: 'domcontentloaded' })
  await page.getByRole('heading', { name: 'Create your signature' }).waitFor({ timeout: 20000 })
  await page.getByRole('button', { name: 'Type', exact: true }).click()
  await page.getByPlaceholder('Type your name').fill('Alex Morgan')
  // The typed name is rasterised to a PNG after document.fonts.ready.
  await page.waitForFunction(() => !!document.querySelector('input[type=file][accept*="pdf"]'))
  await page.waitForTimeout(1200)
  await page.locator('input[type=file][accept*="pdf"]').first().setInputFiles(PDF)
  const choose = page.getByRole('button', { name: /Choose position/ })
  await choose.waitFor({ state: 'visible', timeout: 10000 })
  await choose.scrollIntoViewIfNeeded()
  await choose.click()
  await page.locator('img[alt="PDF page"]').waitFor({ state: 'visible', timeout: 20000 })
}

// Everything measured with the page scrolled back to the top, because that is
// where the nav bar is on screen and therefore where it can cover the dialog.
// The overlay is fixed, so a user scrolling behind an open dialog gets here.
async function measureDialog(page) {
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(300)
  return page.evaluate(() => {
    const dialog = document.querySelector('[role="dialog"]')
    const title = [...document.querySelectorAll('h2')].find((e) =>
      e.textContent.includes('Choose signature position'))
    const close = document.querySelector('button[aria-label="Close"]')
    const confirm = [...document.querySelectorAll('button')].find((e) =>
      e.textContent.trim() === 'Use this position')
    const hitAt = (el) => {
      if (!el) return null
      const r = el.getBoundingClientRect()
      return document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2)
    }
    const box = (el) => (el ? (({ top, bottom, left, right }) =>
      ({ top, bottom, left, right }))(el.getBoundingClientRect()) : null)
    return {
      innerHeight: window.innerHeight,
      portalled: dialog?.parentElement === document.body,
      overlayZ: dialog ? Number(getComputedStyle(dialog).zIndex) : null,
      navZ: Number(getComputedStyle(document.querySelector('header').parentElement).zIndex),
      title: box(title),
      close: box(close),
      confirm: box(confirm),
      closeReachable: !!close && close.contains(hitAt(close)),
      confirmReachable: !!confirm && confirm.contains(hitAt(confirm)),
      // The one element inside the panel that is allowed to scroll.
      scrollers: [...document.querySelectorAll('[role="dialog"] *')]
        .filter((e) => e.scrollHeight > e.clientHeight + 1 &&
          /auto|scroll/.test(getComputedStyle(e).overflowY)).length,
    }
  })
}

const playwright = await loadPlaywright()
const browser = await playwright.chromium.launch()

try {
  // ────────────────────────────────────────────────────────────────────────
  console.log('\nPosition picker — stays inside the viewport, above the nav bar')

  // Landscape is where this first went wrong: the viewport is short enough that
  // a centred dialog's top edge lands under the 64px-tall bar.
  for (const vp of [
    { label: 'phone portrait 390×844', width: 390, height: 844 },
    { label: 'phone landscape 844×390', width: 844, height: 390 },
    { label: 'desktop 1440×900', width: 1440, height: 900 },
  ]) {
    const ctx = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      hasTouch: vp.width < 1000,
      isMobile: vp.width < 1000,
    })
    const page = await ctx.newPage()
    await openPositionPicker(page)
    const m = await measureDialog(page)

    check(`${vp.label}: the dialog outranks the nav bar`,
      m.overlayZ > m.navZ, `dialog z-index ${m.overlayZ}, nav bar ${m.navZ}`)
    check(`${vp.label}: it is portalled to <body>`, m.portalled === true)
    check(`${vp.label}: the title is on screen`,
      m.title && m.title.top >= 0 && m.title.bottom <= m.innerHeight,
      JSON.stringify(m.title))
    check(`${vp.label}: the × is clickable, not buried under the bar`,
      m.closeReachable, `elementFromPoint over the × was outside it`)
    check(`${vp.label}: "Use this position" is on screen and clickable`,
      m.confirmReachable && m.confirm.bottom <= m.innerHeight,
      JSON.stringify(m.confirm))
    check(`${vp.label}: exactly one scrolling region (the body, not the panel)`,
      m.scrollers <= 1, `${m.scrollers} scrollers`)

    await ctx.close()
  }

  // ────────────────────────────────────────────────────────────────────────
  console.log('\nPosition picker — the placement preview tracks the page image')

  {
    const ctx = await browser.newContext({
      viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true,
    })
    const page = await ctx.newPage()
    await openPositionPicker(page)
    const geom = await page.evaluate(() => {
      const b = (s) => {
        const e = document.querySelector(s)
        return e ? (({ top, bottom, left, right, width }) =>
          ({ top, bottom, left, right, width }))(e.getBoundingClientRect()) : null
      }
      return { page: b('img[alt="PDF page"]'), sig: b('img[alt="Signature preview"]') }
    })
    // Placed in canvas pixels it used to sit outside the scaled-down image
    // entirely — invisible on every phone.
    check('the signature preview sits on the page image',
      geom.sig && geom.page &&
        geom.sig.left >= geom.page.left - 1 && geom.sig.right <= geom.page.right + 1 &&
        geom.sig.top >= geom.page.top - 1 && geom.sig.bottom <= geom.page.bottom + 1,
      JSON.stringify(geom))
    await ctx.close()
  }

  // ────────────────────────────────────────────────────────────────────────
  console.log('\niOS input zoom — every text control is ≥16px on a coarse pointer')

  {
    const ctx = await browser.newContext({
      viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true,
    })
    const page = await ctx.newPage()
    await openPositionPicker(page)
    // The studio's own fields plus the ones only the dialog renders.
    const small = await page.evaluate(() => {
      const coarse = matchMedia('(pointer: coarse)').matches
      const offenders = []
      for (const el of document.querySelectorAll('input, textarea, select')) {
        const type = (el.getAttribute('type') || 'text').toLowerCase()
        if (['checkbox', 'radio', 'range', 'file', 'color'].includes(type)) continue
        const size = parseFloat(getComputedStyle(el).fontSize)
        if (size < 16) offenders.push(`${el.tagName}[${type}] ${size}px`)
      }
      return { coarse, offenders }
    })
    check('the browser is emulating a coarse pointer', small.coarse === true)
    check('no text control computes under 16px',
      small.offenders.length === 0, small.offenders.join(', '))

    const viewportMeta = await page.getAttribute('meta[name="viewport"]', 'content')
    check('pinch-zoom is not locked out',
      !/maximum-scale|user-scalable\s*=\s*no/i.test(viewportMeta ?? ''),
      viewportMeta)
    await ctx.close()
  }

  // A desktop pointer must be untouched — the floor is for touch only, and an
  // absent-check like this is worthless without the positive one above.
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
    const page = await ctx.newPage()
    await page.goto(BASE, { waitUntil: 'domcontentloaded' })
    await page.getByRole('heading', { name: 'Create your signature' }).waitFor({ timeout: 20000 })
    // The name field only exists in "Type" mode; the studio opens on "Draw".
    await page.getByRole('button', { name: 'Type', exact: true }).click()
    const field = page.getByPlaceholder('Type your name')
    await field.waitFor({ state: 'visible', timeout: 10000 })
    const size = await field.evaluate((el) => parseFloat(getComputedStyle(el).fontSize))
    check('the desktop type scale is unchanged (text-sm stays 14px)',
      size > 0 && size < 16, `${size}px`)
    await ctx.close()
  }
} finally {
  await browser.close()
}

if (failures.length) {
  console.log(`\n${failures.length} failed:\n  - ${failures.join('\n  - ')}\n`)
  process.exit(1)
}
console.log('\nAll checks passed.\n')
