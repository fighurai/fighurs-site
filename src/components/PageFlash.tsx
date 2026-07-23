import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { allHeroPages } from '../data/heroManifest'
import '../styles/pageFlash.css'

type Props = {
  autoPlay?: boolean
  /** ms between page advances */
  speedMs?: number
  className?: string
}

/**
 * Flip the Archive — left/right page viewer.
 * Auto-advances slowly; drag/tap edges to take control.
 */
export function PageFlash({
  autoPlay = true,
  speedMs = 1100,
  className = '',
}: Props) {
  const pages = useMemo(() => allHeroPages, [])
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(!autoPlay)
  const [ready, setReady] = useState(false)
  const touchX = useRef<number | null>(null)
  const pausedRef = useRef(paused)
  const indexRef = useRef(0)

  useEffect(() => {
    pausedRef.current = paused
  }, [paused])
  useEffect(() => {
    indexRef.current = index
  }, [index])

  useEffect(() => {
    let cancelled = false
    const warm = pages.slice(0, 12)
    Promise.all(
      warm.map(
        (src) =>
          new Promise<void>((resolve) => {
            const img = new Image()
            img.onload = () => resolve()
            img.onerror = () => resolve()
            img.src = src
          }),
      ),
    ).then(() => {
      if (!cancelled) setReady(true)
    })
    return () => {
      cancelled = true
    }
  }, [pages])

  // Prefetch ahead
  useEffect(() => {
    if (!ready) return
    for (let d = 0; d < 8; d++) {
      const img = new Image()
      img.src = pages[(index + d) % pages.length]
    }
  }, [index, pages, ready])

  const go = useCallback(
    (dir: 1 | -1) => {
      setIndex((i) => (i + dir + pages.length) % pages.length)
    },
    [pages.length],
  )

  useEffect(() => {
    if (!ready || pages.length < 2) return
    const id = window.setInterval(() => {
      if (pausedRef.current) return
      setIndex((i) => (i + 1) % pages.length)
    }, speedMs)
    return () => window.clearInterval(id)
  }, [ready, pages.length, speedMs])

  const pauseForUser = () => {
    if (!pausedRef.current) setPaused(true)
  }

  const left = pages[index % pages.length]
  const right = pages[(index + 1) % pages.length]

  return (
    <div
      className={`page-flash ${!ready ? 'is-warming' : ''} ${className}`.trim()}
      onPointerDown={(e) => {
        touchX.current = e.clientX
        pauseForUser()
      }}
      onPointerUp={(e) => {
        if (touchX.current == null) return
        const dx = e.clientX - touchX.current
        touchX.current = null
        if (dx < -48) go(1)
        else if (dx > 48) go(-1)
      }}
    >
      <div className="page-flash__stage">
        <button
          type="button"
          className="page-flash__hit page-flash__hit--left"
          onClick={() => {
            pauseForUser()
            go(-1)
          }}
          aria-label="Previous page"
        />
        <div className="page-flash__panel">
          {ready && (
            <img key={`L-${left}`} src={left} alt="" draggable={false} decoding="async" />
          )}
        </div>
        <div className="page-flash__seam" aria-hidden />
        <div className="page-flash__panel">
          {ready && (
            <img key={`R-${right}`} src={right} alt="" draggable={false} decoding="async" />
          )}
        </div>
        <button
          type="button"
          className="page-flash__hit page-flash__hit--right"
          onClick={() => {
            pauseForUser()
            go(1)
          }}
          aria-label="Next page"
        />
      </div>

      <div className="page-flash__meta">
        <span>{ready ? `${index + 1} / ${pages.length}` : 'Loading pages…'}</span>
        <button
          type="button"
          className="page-flash__toggle"
          onClick={() => setPaused((p) => !p)}
        >
          {paused ? 'Resume auto-flip' : 'Pause'}
        </button>
      </div>
    </div>
  )
}
