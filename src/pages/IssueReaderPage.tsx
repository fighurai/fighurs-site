import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import HTMLFlipBook from 'react-pageflip'
import * as pdfjs from 'pdfjs-dist'
import { getIssue } from '../data/issues'
import '../styles/reader.css'

// pdfjs 4.x — avoids Map.getOrInsertComputed (broken in pdfjs 6 on many browsers)
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs'

type FlipApi = {
  pageFlip: () => {
    flipNext: (corner?: string) => void
    flipPrev: (corner?: string) => void
    getCurrentPageIndex: () => number
    turnToPage: (page: number) => void
    getPageCount: () => number
  } | null
}

export function IssueReaderPage() {
  const { slug = '' } = useParams()
  const issue = getIssue(slug)
  const [pages, setPages] = useState<string[]>([])
  const [pageCount, setPageCount] = useState(0)
  const [ready, setReady] = useState(0)
  const [phase, setPhase] = useState<'idle' | 'fetch' | 'render' | 'done' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)
  const [current, setCurrent] = useState(0)
  const bookRef = useRef<FlipApi | null>(null)
  const loadId = useRef(0)
  const lastFlipAt = useRef(0)

  const flipBy = (dir: 'prev' | 'next') => {
    const now = performance.now()
    if (now - lastFlipAt.current < 280) return
    lastFlipAt.current = now

    const flip = bookRef.current?.pageFlip?.()
    if (!flip) return
    const i = flip.getCurrentPageIndex?.() ?? current
    const total = flip.getPageCount?.() ?? pages.length
    try {
      if (dir === 'next') {
        if (i >= total - 1) return
        flip.flipNext('bottom')
      } else {
        if (i <= 0) return
        flip.flipPrev('bottom')
      }
    } catch {
      const target = dir === 'next' ? Math.min(i + 1, total - 1) : Math.max(i - 1, 0)
      flip.turnToPage?.(target)
      setCurrent(target)
    }
  }

  const [bookSize, setBookSize] = useState(() => {
    if (typeof window === 'undefined') {
      return { width: 920, height: 640, minWidth: 280, maxWidth: 560 }
    }
    const vw = window.innerWidth
    const vh = window.innerHeight
    const totalW = Math.min(920, vw * 0.96)
    const pageW = totalW / 2
    const height = Math.min(vh * (vw < 800 ? 0.52 : 0.72), pageW * 1.4)
    return {
      width: Math.floor(totalW),
      height: Math.floor(Math.max(280, height)),
      // Keep minWidth under half the viewport so landscape spread stays enabled on phones
      minWidth: vw < 800 ? Math.max(110, Math.floor(vw * 0.36)) : 280,
      maxWidth: vw < 800 ? Math.floor(vw * 0.48) : 560,
    }
  })

  useEffect(() => {
    const onResize = () => {
      const vw = window.innerWidth
      const vh = window.innerHeight
      const totalW = Math.min(920, vw * 0.96)
      const pageW = totalW / 2
      const height = Math.min(vh * (vw < 800 ? 0.52 : 0.72), pageW * 1.4)
      setBookSize({
        width: Math.floor(totalW),
        height: Math.floor(Math.max(280, height)),
        minWidth: vw < 800 ? Math.max(110, Math.floor(vw * 0.36)) : 280,
        maxWidth: vw < 800 ? Math.floor(vw * 0.48) : 560,
      })
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    if (!issue) return

    const id = ++loadId.current
    let pdf: pdfjs.PDFDocumentProxy | null = null

    async function load() {
      try {
        setError(null)
        setPages([])
        setReady(0)
        setPageCount(0)
        setCurrent(0)
        setPhase('fetch')

        const task = pdfjs.getDocument({
          url: issue!.pdf,
          useSystemFonts: true,
        })
        setPhase('render')
        pdf = await task.promise
        if (id !== loadId.current) {
          await pdf.destroy()
          return
        }

        const total = pdf.numPages
        setPageCount(total)
        const rendered: string[] = []

        for (let i = 1; i <= total; i++) {
          if (id !== loadId.current) return

          const page = await pdf.getPage(i)
          const base = page.getViewport({ scale: 1 })
          const scale = Math.min(850 / base.width, 1.2)
          const viewport = page.getViewport({ scale })
          const canvas = document.createElement('canvas')
          canvas.width = Math.max(1, Math.floor(viewport.width))
          canvas.height = Math.max(1, Math.floor(viewport.height))
          const ctx = canvas.getContext('2d', { alpha: false })
          if (!ctx) throw new Error('Canvas 2D context unavailable')

          // pdfjs 4.x API
          await page.render({
            canvasContext: ctx,
            viewport,
          }).promise

          rendered.push(canvas.toDataURL('image/jpeg', 0.72))
          canvas.width = 0
          canvas.height = 0
          page.cleanup()
          setReady(i)
          await new Promise((r) => requestAnimationFrame(() => r(null)))
        }

        if (id !== loadId.current) return
        setPages(rendered)
        setPhase('done')
      } catch (e) {
        console.error('[FIGHURS flip]', e)
        if (id === loadId.current) {
          setPhase('error')
          setError(e instanceof Error ? e.message : 'Unknown PDF error')
        }
      } finally {
        if (pdf && id !== loadId.current) {
          try {
            await pdf.destroy()
          } catch {
            /* ignore */
          }
        }
      }
    }

    load()
    return () => {
      loadId.current += 1
    }
  }, [issue])

  useEffect(() => {
    if (pages.length === 0) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        e.preventDefault()
        flipBy('next')
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault()
        flipBy('prev')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [pages.length, current])

  if (!issue) {
    return (
      <main className="reader page">
        <div className="reader__error">Issue not found.</div>
        <Link className="btn" to="/magazine">
          Back to magazine
        </Link>
      </main>
    )
  }

  const progress = pageCount ? Math.round((ready / pageCount) * 100) : 0
  const canFlip = pages.length > 0
  const statusLabel =
    phase === 'fetch'
      ? 'Downloading issue…'
      : phase === 'render'
        ? 'Building flip magazine…'
        : 'Preparing…'

  return (
    <main className="reader page">
      <div className="reader__head">
        <div>
          <p className="eyebrow">
            Issue {issue.number} · {issue.year}
          </p>
          <h1>{issue.title}</h1>
          <p className="eyebrow" style={{ marginTop: '0.6rem' }}>
            {issue.subtitle}
          </p>
        </div>
        <div className="reader__actions">
          <Link className="btn" to="/magazine">
            Archive
          </Link>
          <a className="btn" href={issue.pdf} target="_blank" rel="noreferrer">
            Open PDF
          </a>
          <a className="btn btn--fill" href={issue.pdf} download>
            Download
          </a>
        </div>
      </div>

      <div className="reader__stage">
        {!canFlip && phase !== 'error' && (
          <div className="reader__loading">
            <img src={issue.cover} alt="" className="reader__loading-cover" />
            <div>
              {statusLabel}
              <div className="reader__progress">
                <span style={{ width: `${progress}%` }} />
              </div>
              <small>
                {ready}
                {pageCount ? ` / ${pageCount}` : ''} pages · {progress}%
              </small>
            </div>
          </div>
        )}

        {phase === 'error' && (
          <div className="reader__error">
            <p>Could not load this issue PDF.</p>
            <p style={{ textTransform: 'none', letterSpacing: 0, maxWidth: '36ch' }}>{error}</p>
            <a className="btn btn--fill" href={issue.pdf} target="_blank" rel="noreferrer">
              Open PDF directly
            </a>
          </div>
        )}

        {canFlip && (
          <HTMLFlipBook
            key={`${issue.slug}-${bookSize.width}-${bookSize.minWidth}`}
            ref={bookRef as never}
            className="reader__book"
            width={Math.floor(bookSize.width / 2)}
            height={bookSize.height}
            size="stretch"
            minWidth={bookSize.minWidth}
            maxWidth={bookSize.maxWidth}
            minHeight={Math.floor(bookSize.height * 0.85)}
            maxHeight={bookSize.height}
            showCover
            mobileScrollSupport={false}
            drawShadow
            flippingTime={900}
            usePortrait={false}
            startPage={0}
            maxShadowOpacity={0.45}
            useMouseEvents
            clickEventForward={false}
            disableFlipByClick={false}
            swipeDistance={30}
            onFlip={(e: { data: number }) => setCurrent(e.data)}
          >
            {pages.map((src, idx) => (
              <div className="reader__page" key={`${issue.slug}-${idx}`}>
                <img src={src} alt={`Page ${idx + 1}`} draggable={false} />
              </div>
            ))}
          </HTMLFlipBook>
        )}
      </div>

      <div className="reader__controls">
        <button
          className="btn"
          type="button"
          onClick={() => flipBy('prev')}
          disabled={!canFlip || current <= 0}
        >
          Prev
        </button>
        <span>{canFlip ? `Page ${current + 1} / ${pages.length}` : 'Preparing pages'}</span>
        <button
          className="btn"
          type="button"
          onClick={() => flipBy('next')}
          disabled={!canFlip || current >= pages.length - 1}
        >
          Next
        </button>
      </div>

      <p className="reader__blurb">
        <span>{issue.blurb}</span>
      </p>
    </main>
  )
}
