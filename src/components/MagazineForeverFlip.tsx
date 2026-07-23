import { useEffect, useMemo, useRef, useState } from 'react'
import { allHeroPages } from '../data/heroManifest'
import '../styles/magazineFlip.css'

type Props = {
  autoPlay?: boolean
  speedMs?: number
  className?: string
  onUserControl?: () => void
}

function preload(src: string) {
  return new Promise<boolean>((resolve) => {
    const img = new Image()
    img.decoding = 'async'
    img.onload = () => resolve(true)
    img.onerror = () => resolve(false)
    img.src = src
  })
}

/**
 * Flip-the-archive viewer — left / spine / right, page-turn, counter + pause.
 * Only advances once nearby pages have loaded (no broken-image flashes).
 */
export function MagazineForeverFlip({
  autoPlay = true,
  speedMs = 450,
  className = '',
  onUserControl,
}: Props) {
  const pages = useMemo(() => allHeroPages, [])
  const [index, setIndex] = useState(0)
  const [flipping, setFlipping] = useState(false)
  const [paused, setPaused] = useState(!autoPlay)
  const [ready, setReady] = useState(false)
  const [ok, setOk] = useState(pages)
  const touchX = useRef<number | null>(null)
  const loaded = useRef(new Set<string>())

  // Drop any pages that fail to load from the working list
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const first = pages.slice(0, 8)
      const results = await Promise.all(first.map(async (src) => {
        const good = await preload(src)
        if (good) loaded.current.add(src)
        return good ? src : null
      }))
      const surviving = results.filter(Boolean) as string[]
      // Keep the rest of the list; we'll skip failures live
      if (!cancelled) {
        setOk(pages)
        if (surviving.length >= 2) setReady(true)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [pages])

  useEffect(() => {
    if (!ready) return
    let cancelled = false
    ;(async () => {
      for (let d = 0; d <= 4; d++) {
        const src = ok[(index + d) % ok.length]
        if (!src || loaded.current.has(src)) continue
        const good = await preload(src)
        if (cancelled) return
        if (good) loaded.current.add(src)
        else {
          setOk((prev) => prev.filter((p) => p !== src))
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [index, ok, ready])

  useEffect(() => {
    if (!ready || paused || ok.length < 2) return
    const id = window.setInterval(() => {
      setFlipping(true)
      window.setTimeout(() => {
        setIndex((i) => (i + 1) % ok.length)
        setFlipping(false)
      }, 70)
    }, speedMs)
    return () => window.clearInterval(id)
  }, [paused, ok.length, speedMs, ready])

  const pauseForUser = () => {
    if (!paused) {
      setPaused(true)
      onUserControl?.()
    }
  }

  const next = () => {
    pauseForUser()
    setFlipping(true)
    window.setTimeout(() => {
      setIndex((i) => (i + 1) % ok.length)
      setFlipping(false)
    }, 160)
  }

  const prev = () => {
    pauseForUser()
    setFlipping(true)
    window.setTimeout(() => {
      setIndex((i) => (i - 1 + ok.length) % ok.length)
      setFlipping(false)
    }, 160)
  }

  if (!ready || ok.length < 2) {
    return (
      <div className={`mag-flip is-warming ${className}`.trim()}>
        <div className="mag-flip__meta">
          <span>Loading pages…</span>
        </div>
      </div>
    )
  }

  const left = ok[index % ok.length]
  const right = ok[(index + 1) % ok.length]
  const peek = ok[(index + 2) % ok.length]

  return (
    <div
      className={`mag-flip ${flipping ? 'is-flipping' : ''} ${className}`.trim()}
      onPointerDown={(e) => {
        touchX.current = e.clientX
        pauseForUser()
      }}
      onPointerUp={(e) => {
        if (touchX.current == null) return
        const dx = e.clientX - touchX.current
        touchX.current = null
        if (dx < -40) next()
        else if (dx > 40) prev()
      }}
    >
      <div className="mag-flip__shadow" aria-hidden />
      <div className="mag-flip__book">
        <button
          type="button"
          className="mag-flip__hit mag-flip__hit--left"
          onClick={prev}
          aria-label="Previous page"
        />
        <div className="mag-flip__leaf mag-flip__leaf--left">
          <img src={left} alt="" draggable={false} decoding="async" />
        </div>
        <div className="mag-flip__spine" aria-hidden />
        <div className={`mag-flip__leaf mag-flip__leaf--right ${flipping ? 'turn' : ''}`}>
          <img src={right} alt="" draggable={false} decoding="async" />
          <div className="mag-flip__back">
            <img src={peek} alt="" draggable={false} decoding="async" />
          </div>
        </div>
        <button
          type="button"
          className="mag-flip__hit mag-flip__hit--right"
          onClick={next}
          aria-label="Next page"
        />
      </div>
      <div className="mag-flip__meta">
        <span>
          {index + 1} / {ok.length}
        </span>
        <button type="button" className="mag-flip__toggle" onClick={() => setPaused((p) => !p)}>
          {paused ? 'Resume auto-flip' : 'Pause'}
        </button>
      </div>
    </div>
  )
}
