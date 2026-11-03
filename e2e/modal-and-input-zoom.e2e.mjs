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
const PDF_3 = join(HERE, 'fixtures', 'three-pages.pdf')

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

// Drive the studio far enough to have a signature and a loaded PDF. Since
// 2026-11-03 that alone shows the document (PageStrip, a row of pages) with
// the signature on it — no "Choose position…" button, no dialog. The dialog is Send to be signed's
// only now, which needs a signed-in Universal ID this harness doesn't have,
// so the nav-bar checks below are on the inline preview instead.
async function openPositionPicker(page) {
  await page.goto(BASE, { waitUntil: 'domcontentloaded' })
  await page.getByRole('heading', { name: 'Create your signature' }).waitFor({ timeout: 20000 })
  await page.getByRole('button', { name: 'Type', exact: true }).click()
  await page.getByPlaceholder('Type your name').fill('Alex Morgan')
  // The typed name is rasterised to a PNG after document.fonts.ready.
  await page.waitForFunction(() => !!document.querySelector('input[type=file][accept*="pdf"]'))
  await page.waitForTimeout(1200)
  await page.locator('input[type=file][accept*="pdf"]').first().setInputFiles(PDF)
  await page.locator('[data-page="0"] > img').first().waitFor({ state: 'visible', timeout: 20000 })
  await page.locator('img[data-handle="sig"]').waitFor({ state: 'visible', timeout: 10000 })
}

const playwright = await loadPlaywright()
const browser = await playwright.chromium.launch()

try {
  // ────────────────────────────────────────────────────────────────────────
  console.log('\nPage viewer — shows on its own, the signature drags and resizes')

  for (const vp of [
    { label: 'phone portrait 390×844', width: 390, height: 844 },
    { label: 'desktop 1440×900', width: 1440, height: 900 },
  ]) {
    const ctx = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      hasTouch: vp.width < 1000,
      isMobile: vp.width < 1000,
    })
    const page = await ctx.newPage()
    await openPositionPicker(page)
    check(`${vp.label}: no dialog opened`, (await page.locator('[role="dialog"]').count()) === 0)
    const sig = page.locator('img[data-handle="sig"]')
    await sig.scrollIntoViewIfNeeded()
    const before = await sig.boundingBox()
    await page.mouse.move(before.x + before.width / 2, before.y + before.height / 2)
    await page.mouse.down()
    await page.mouse.move(before.x - 120, before.y - 200, { steps: 8 })
    await page.mouse.up()
    const after = await sig.boundingBox()
    check(`${vp.label}: dragging moves the signature up and left`,
      after.x < before.x - 40 && after.y < before.y - 40, JSON.stringify({ before, after }))
    const handle = page.locator('[data-handle="size"]')
    const h = await handle.boundingBox()
    const w0 = (await sig.boundingBox()).width
    await page.mouse.move(h.x + h.width / 2, h.y + h.height / 2)
    await page.mouse.down()
    await page.mouse.move(h.x + h.width / 2 + 40, h.y + h.height / 2, { steps: 6 })
    await page.mouse.up()
    const w1 = (await sig.boundingBox()).width
    check(`${vp.label}: pulling the corner makes the signature bigger`, w1 > w0 + 20, JSON.stringify({ w0, w1 }))
    // A row of several pages: a scroll box still offers its content's width to
    // a content-sized layout, and once widened the whole page on a phone.
    await page.locator('input[type=file][accept*="pdf"]').first().setInputFiles(PDF_3)
    await page.locator('[data-page="2"]').waitFor({ timeout: 20000 })
    check(`${vp.label}: three pages side by side are no wider than the screen`,
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
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
      return { page: b('[data-page="0"]'), sig: b('img[data-handle="sig"]') }
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
