import { useEffect, useMemo, useRef, useState } from 'react'
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

  const flipBy = (dir: 'prev' | 'next') => {
    const flip = bookRef.current?.pageFlip?.()
    if (!flip) return
    try {
      if (dir === 'next') flip.flipNext('top')
      else flip.flipPrev('top')
    } catch {
      const i = flip.getCurrentPageIndex?.() ?? current
      const total = flip.getPageCount?.() ?? pages.length
      const target = dir === 'next' ? Math.min(i + 1, total - 1) : Math.max(i - 1, 0)
      flip.turnToPage?.(target)
    }
  }

  const bookSize = useMemo(() => {
    const w = Math.min(920, typeof window !== 'undefined' ? window.innerWidth * 0.96 : 920)
    const h = Math.min(640, typeof window !== 'undefined' ? window.innerHeight * 0.72 : 640)
    return { width: Math.floor(w), height: Math.floor(h) }
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
            key={issue.slug}
            ref={bookRef as never}
            className="reader__book"
            width={Math.floor(bookSize.width / 2)}
            height={bookSize.height}
            size="stretch"
            minWidth={280}
            maxWidth={560}
            minHeight={360}
            maxHeight={720}
            showCover
            mobileScrollSupport
            drawShadow
            flippingTime={900}
            usePortrait={typeof window !== 'undefined' ? window.innerWidth < 800 : false}
            startPage={0}
            maxShadowOpacity={0.45}
            useMouseEvents
            clickEventForward={false}
            disableFlipByClick={false}
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
