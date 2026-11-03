import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { openForViewing } from '../../lib/pdfjs'
import type { PlacePoint } from '../../lib/pdf'
import { initialsBox, loadAspect, sigCentre, type PreviewInitials } from '../../lib/placement'
import { useT } from '../../i18n'

export type StripLayout = 'once' | 'every' | 'initial-once' | 'initial-every'

interface Props {
  file: File
  layout: StripLayout
  /** Null until there is a signature: the pages show on their own. */
  sigPng: string | null
  /** The page carrying the signature with Sign once / Initial all, sign once. */
  sigPage: number
  /** The signature's centre as page fractions; null = signPdf's bottom-right corner. */
  pos: PlacePoint | null
  widthPct: number
  initials: PreviewInitials | null
  /** Initial all, sign once: the signed page is initialled too. */
  includeSigned: boolean
  onPlace: (page: number, pos: PlacePoint) => void
  onResize: (widthPct: number) => void
}

// How far the next page shows on a narrow screen, so it's plain there's more
// to swipe to — the same peek as Universal PDF's row of pages.
const PEEK = 28
const GAP = 12
const MIN_WIDTH = 8
const MAX_WIDTH = 50

// The whole document, a row of pages to swipe or scroll along, as Universal
// PDF shows one (its default "horizontal" page scrolling), without its
// toolbar (James, 2026-11-03: "use a universal PDF viewer without the header
// so you can scroll / swipe through the pages and sign where you want"). Tap
// a page to put the signature there, drag it to move it, pull its corner to
// size it. Not Universal PDF's own viewer: that is ~2,400 lines bound to its
// stores and annotation layer, for a job this does in one file.
//
// A tap places the signature only the first time (`pos` still null). After
// that a tap selects it (its corner to pull shows) or, off it, deselects it,
// and it moves only by dragging — onto another page too with the sign-once
// layouts (James, 2026-11-03: "after the initial placement then click to
// select not click to place so they have to click and drag").
//
// ⚠️ A finger only drags from the signature or its handle (`touch-none` is on
// those alone); everywhere else a finger swipes the row. A drag listens on the
// window, not the signature: dropping it on another page remounts it there.
export default function PageStrip({ file, layout, sigPng, sigPage, pos, widthPct, initials, includeSigned, onPlace, onResize }: Props) {
  const t = useT()
  const rowRef = useRef<HTMLDivElement>(null)
  const [doc, setDoc] = useState<Awaited<ReturnType<typeof openForViewing>> | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [rowWidth, setRowWidth] = useState(0)
  const [images, setImages] = useState<Record<number, string>>({})
  const [current, setCurrent] = useState(0)
  const [sigAspect, setSigAspect] = useState(3)
  const [iniAspect, setIniAspect] = useState(1.5)
  // While dragging: what (move or resize), on which page, and where in the
  // signature it was picked up (page fractions from its centre).
  const drag = useRef<{ kind: 'move' | 'size'; page: number; dx: number; dy: number } | null>(null)
  // When the last drag ended: the click that follows it is not a tap.
  const dragEnded = useRef(0)
  const [selected, setSelected] = useState(true)
  // The window's listeners outlive the render that started the drag.
  const live = useRef({ layout, pos, widthPct, sigAspect, onPlace, onResize })
  live.current = { layout, pos, widthPct, sigAspect, onPlace, onResize }

  useEffect(() => {
    let cancelled = false
    let opened: Awaited<ReturnType<typeof openForViewing>> | null = null
    setDoc(null); setImages({}); setError(null); setCurrent(0)
    file.arrayBuffer()
      .then(openForViewing)
      .then((d) => { if (cancelled) d.destroy(); else { opened = d; setDoc(d) } })
      .catch(() => { if (!cancelled) setError(t('sign.picker_error')) })
    return () => { cancelled = true; opened?.destroy() }
    // Not on `t`: a language change needs no new document.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file])

  useEffect(() => { if (sigPng) loadAspect(sigPng, setSigAspect) }, [sigPng])
  useEffect(() => { if (initials?.png) loadAspect(initials.png, setIniAspect) }, [initials?.png])

  useLayoutEffect(() => {
    const el = rowRef.current
    if (!el) return
    const ro = new ResizeObserver(() => setRowWidth(el.clientWidth))
    ro.observe(el)
    setRowWidth(el.clientWidth)
    return () => ro.disconnect()
  }, [doc])

  // One height for the row: on a narrow screen a page fills it less a peek of
  // the next; on a wide one it is capped to most of the window.
  const first = doc?.sizes[0]
  const narrow = rowWidth < 640
  const rowHeight = first && rowWidth
    ? Math.round(narrow
      ? (rowWidth - PEEK - GAP) * (first.height / first.width)
      : Math.min(window.innerHeight * 0.7, 720, (rowWidth - PEEK - GAP) * (first.height / first.width)))
    : 0
  const widthOf = (i: number) => doc ? Math.round(rowHeight * doc.sizes[i].width / doc.sizes[i].height) : 0

  // Draw a page when it comes within a screen of view; keep it once drawn.
  useEffect(() => {
    const row = rowRef.current
    if (!doc || !row || !rowHeight) return
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    const pending = new Set<number>()
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        const i = Number((e.target as HTMLElement).dataset.page)
        if (!e.isIntersecting || pending.has(i)) continue
        pending.add(i)
        doc.render(i, widthOf(i) * dpr)
          .then((url) => setImages((m) => (m[i] ? m : { ...m, [i]: url })))
          .catch(() => pending.delete(i))
      }
    }, { root: row, rootMargin: '0px 100% 0px 100%' })
    row.querySelectorAll<HTMLElement>('[data-page]').forEach((el) => io.observe(el))
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doc, rowHeight])

  // The page nearest the row's left edge, for the counter.
  function onScroll() {
    const row = rowRef.current
    if (!row || !doc) return
    let x = 0
    for (let i = 0; i < doc.sizes.length; i++) {
      x += widthOf(i) + GAP
      if (x > row.scrollLeft + widthOf(i) / 2) { setCurrent(i); return }
    }
  }

  // A mouse wheel's up/down carries on along the row while there is row left
  // to go (as in Universal PDF), then lets the page scroll as usual.
  useEffect(() => {
    const row = rowRef.current
    if (!row) return
    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return
      const atStart = row.scrollLeft <= 0
      const atEnd = row.scrollLeft + row.clientWidth >= row.scrollWidth - 1
      if ((e.deltaY < 0 && atStart) || (e.deltaY > 0 && atEnd)) return
      e.preventDefault()
      row.scrollLeft += e.deltaY
    }
    row.addEventListener('wheel', onWheel, { passive: false })
    return () => row.removeEventListener('wheel', onWheel)
  }, [doc])

  function goTo(i: number) {
    const row = rowRef.current
    if (!row || !doc) return
    const n = Math.max(0, Math.min(doc.sizes.length - 1, i))
    let x = 0
    for (let k = 0; k < n; k++) x += widthOf(k) + GAP
    row.scrollTo({ left: x, behavior: 'smooth' })
  }

  if (error) return <p className="py-16 text-center text-sm text-rose-600">{error}</p>

  const total = doc?.sizes.length ?? 0
  const sigOn = (i: number) => !!sigPng && (layout === 'every' || layout === 'initial-every' || i === sigPage)
  // One tab stop for the signature, however many pages show it.
  const focusPage = layout === 'every' || layout === 'initial-every' ? 0 : sigPage
  const initialsOn = (i: number) => !!initials && (layout === 'initial-every' || (layout === 'initial-once' && (i !== sigPage || includeSigned)))

  const pointIn = (el: HTMLElement, x: number, y: number): PlacePoint => {
    const r = el.getBoundingClientRect()
    return { xPct: (x - r.left) / r.width, yPct: (y - r.top) / r.height }
  }
  const pageAt = (i: number) => rowRef.current?.querySelector<HTMLElement>(`[data-page="${i}"]`) ?? null
  // The page under a pointer's x, or null over a gap.
  const pageUnder = (x: number) => {
    for (const el of rowRef.current?.querySelectorAll<HTMLElement>('[data-page]') ?? []) {
      const r = el.getBoundingClientRect()
      if (x >= r.left && x <= r.right) return Number(el.dataset.page)
    }
    return null
  }

  function startDrag(e: React.PointerEvent, kind: 'move' | 'size', page: number, centre: PlacePoint) {
    e.preventDefault()
    e.stopPropagation()
    setSelected(true)
    const p = pointIn(pageAt(page)!, e.clientX, e.clientY)
    drag.current = kind === 'move' ? { kind, page, dx: p.xPct - centre.xPct, dy: p.yPct - centre.yPct } : { kind, page, dx: 0, dy: 0 }
    const id = e.pointerId
    const move = (ev: PointerEvent) => {
      const d = drag.current
      if (ev.pointerId !== id || !d || !doc) return
      const { layout, pos, widthPct, sigAspect, onPlace, onResize } = live.current
      if (d.kind === 'size') {
        const size = doc.sizes[d.page]
        const c = sigCentre(size.width, size.height, widthPct, sigAspect, pos)
        const q = pointIn(pageAt(d.page)!, ev.clientX, ev.clientY)
        onResize(Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, Math.round(Math.abs(q.xPct - c.xPct) * 200))))
        return
      }
      const once = layout === 'once' || layout === 'initial-once'
      if (once) d.page = pageUnder(ev.clientX) ?? d.page
      const el = pageAt(d.page)
      if (!el) return
      const size = doc.sizes[d.page]
      const q = pointIn(el, ev.clientX, ev.clientY)
      onPlace(d.page, sigCentre(size.width, size.height, widthPct, sigAspect, { xPct: q.xPct - d.dx, yPct: q.yPct - d.dy }))
      // Held near the row's edge, the row carries on, so a page off screen can be reached.
      const row = rowRef.current
      if (once && row) {
        const r = row.getBoundingClientRect()
        if (ev.clientX > r.right - 32) row.scrollLeft += 16
        else if (ev.clientX < r.left + 32) row.scrollLeft -= 16
      }
    }
    const end = (ev: PointerEvent) => {
      if (ev.pointerId !== id) return
      drag.current = null
      dragEnded.current = Date.now()
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', end)
      window.removeEventListener('pointercancel', end)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', end)
    window.addEventListener('pointercancel', end)
  }

  return (
    <div>
      <div
        ref={rowRef}
        onScroll={onScroll}
        className="flex overflow-x-auto overscroll-x-contain rounded-lg bg-slate-100 p-3"
        // `width: 0; min-width: 100%`: a scroll box still offers its content's
        // full width when the layout around it is sized to content, and the
        // studio's grid is — the whole row of pages widened the page on a
        // phone. At 0 it offers nothing and still fills its column.
        style={{ gap: GAP, minHeight: rowHeight ? rowHeight + 24 : 320, width: 0, minWidth: '100%' }}
      >
        {!doc && <div className="flex w-full animate-pulse items-center justify-center text-sm text-slate-400">{t('sign.picker_rendering')}</div>}
        {doc && rowHeight > 0 && doc.sizes.map((size, i) => {
          const centre = sigCentre(size.width, size.height, widthPct, sigAspect, pos)
          const box = initialsOn(i) && initials
            ? initialsBox(size.width, size.height, initials, iniAspect, sigOn(i) ? { widthPct, sigAspect, centre } : null)
            : null
          return (
            <div
              key={i}
              data-page={i}
              role="img"
              aria-label={t('sign.viewer_page', { n: i + 1, total })}
              className={`relative shrink-0 select-none overflow-hidden rounded-sm bg-white shadow ring-1 ring-slate-200 ${sigPng && !pos ? 'cursor-crosshair' : ''}`}
              style={{ width: widthOf(i), height: rowHeight }}
              onClick={(e) => {
                if (!sigPng || (e.target as HTMLElement).dataset.handle || Date.now() - dragEnded.current < 300) return
                if (pos) { setSelected(false); return }
                onPlace(i, sigCentre(size.width, size.height, widthPct, sigAspect, pointIn(e.currentTarget, e.clientX, e.clientY)))
                setSelected(true)
              }}
            >
              {images[i] && <img src={images[i]} alt="" className="block h-full w-full" draggable={false} />}
              {box && (
                <img
                  src={initials!.png}
                  alt={t('sign.picker_initials_alt')}
                  draggable={false}
                  className="pointer-events-none absolute rounded-sm ring-1 ring-orange-300/60"
                  style={{ left: `${box.left * 100}%`, top: `${box.top * 100}%`, width: `${box.width * 100}%`, aspectRatio: `${iniAspect}` }}
                />
              )}
              {sigOn(i) && (
                <div
                  className="absolute"
                  style={{ left: `${centre.xPct * 100}%`, top: `${centre.yPct * 100}%`, width: `${widthPct}%`, aspectRatio: `${sigAspect}`, transform: 'translate(-50%, -50%)' }}
                >
                  <img
                    src={sigPng!}
                    alt={t('sign.viewer_sig_label')}
                    data-handle="sig"
                    tabIndex={i === focusPage ? 0 : -1}
                    draggable={false}
                    className={`block h-full w-full cursor-grab touch-none rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-orange-600 active:cursor-grabbing ${selected ? 'ring-2 ring-orange-500' : 'ring-1 ring-orange-400/70'}`}
                    onFocus={() => setSelected(true)}
                    onKeyDown={(e) => {
                      // Arrows move it 1% of the page (10% with Shift); + and − size it.
                      const step = e.shiftKey ? 0.1 : 0.01
                      const d: Record<string, [number, number]> = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }
                      if (d[e.key]) {
                        e.preventDefault()
                        onPlace(i, sigCentre(size.width, size.height, widthPct, sigAspect, { xPct: centre.xPct + d[e.key][0], yPct: centre.yPct + d[e.key][1] }))
                      } else if (e.key === '+' || e.key === '=' || e.key === '-' || e.key === '−') {
                        e.preventDefault()
                        onResize(Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, widthPct + (e.key === '-' || e.key === '−' ? -1 : 1))))
                      }
                    }}
                    onPointerDown={(e) => startDrag(e, 'move', i, centre)}
                  />
                  {/* The corner to pull, once it is selected: the signature grows or shrinks about its centre. */}
                  {selected && (
                    <span
                      data-handle="size"
                      role="presentation"
                      className="absolute -bottom-2 -right-2 h-5 w-5 cursor-nwse-resize touch-none rounded-full border-2 border-white bg-orange-600 shadow"
                      onPointerDown={(e) => startDrag(e, 'size', i, centre)}
                    />
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {total > 1 && (
        <div className="mt-2 flex items-center justify-center gap-3 text-xs text-slate-500">
          <button type="button" onClick={() => goTo(current - 1)} disabled={current === 0} aria-label={t('sign.viewer_prev')} className="rounded-md px-2 py-1 hover:bg-slate-100 disabled:opacity-30">‹</button>
          <span className="tabular-nums">{t('sign.viewer_page', { n: current + 1, total })}</span>
          <button type="button" onClick={() => goTo(current + 1)} disabled={current >= total - 1} aria-label={t('sign.viewer_next')} className="rounded-md px-2 py-1 hover:bg-slate-100 disabled:opacity-30">›</button>
        </div>
      )}
    </div>
  )
}
