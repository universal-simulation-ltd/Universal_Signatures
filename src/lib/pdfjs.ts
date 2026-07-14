import * as pdfjsLib from 'pdfjs-dist'
// ?worker (IIFE format, see vite.config.ts) so iOS Safari gets a classic
// blob-URL worker instead of an ES-module worker it can't import.
import PdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?worker'

pdfjsLib.GlobalWorkerOptions.workerPort = new PdfjsWorker()

/**
 * Render one page of a PDF to a canvas for the position picker. Returns the
 * canvas plus the page's logical size (PDF points) so callers can map a click
 * on the canvas back to a fraction of the page. `maxWidth` caps the render
 * width; the height follows the page aspect.
 */
export async function renderPageToCanvas(
  data: ArrayBuffer,
  pageIndex: number,
  maxWidth: number,
): Promise<{ canvas: HTMLCanvasElement; pageWidth: number; pageHeight: number }> {
  // getDocument transfers/detaches the buffer, so hand it a copy — the caller
  // keeps the original bytes for signing.
  const doc = await pdfjsLib.getDocument({ data: data.slice(0) }).promise
  try {
    const idx = pageIndex < 0 ? doc.numPages : Math.min(pageIndex + 1, doc.numPages)
    const page = await doc.getPage(idx)
    const base = page.getViewport({ scale: 1 })
    const scale = Math.min(maxWidth / base.width, 2)
    const viewport = page.getViewport({ scale })

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    canvas.width = Math.ceil(viewport.width)
    canvas.height = Math.ceil(viewport.height)
    await page.render({ canvasContext: ctx, viewport }).promise

    return { canvas, pageWidth: base.width, pageHeight: base.height }
  } finally {
    doc.destroy()
  }
}
