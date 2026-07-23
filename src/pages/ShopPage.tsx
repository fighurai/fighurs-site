import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { issues } from '../data/issues'
import '../styles/shop.css'

const MIN_GAP = 12

/** Pink polka dots that paint and stay as the cursor moves. */
function ShopCursorDots() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const prev = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = window.innerWidth
      const h = window.innerHeight
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    resize()
    window.addEventListener('resize', resize)

    const paint = (x: number, y: number) => {
      const last = prev.current
      if (last) {
        const dx = x - last.x
        const dy = y - last.y
        if (dx * dx + dy * dy < MIN_GAP * MIN_GAP) return
      }
      prev.current = { x, y }

      const r = 5 + Math.random() * 11
      ctx.beginPath()
      ctx.fillStyle = '#e2007c'
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.fill()
    }

    const onMove = (e: PointerEvent) => paint(e.clientX, e.clientY)
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0]
      if (t) paint(t.clientX, t.clientY)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('touchmove', onTouch, { passive: true })

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('touchmove', onTouch)
    }
  }, [])

  return createPortal(
    <canvas ref={canvasRef} className="shop__draw" aria-hidden />,
    document.body,
  )
}

export function ShopPage() {
  return (
    <main className="shop page">
      <ShopCursorDots />

      <div className="shop__inner">
        <div className="shop__intro">
          <p className="eyebrow">Print editions</p>
          <p>
            Purchase a physical copy of every issue, every story, and every muse that shaped the
            movement.
          </p>
        </div>

        <div className="shop__grid">
          {issues.map((issue) => (
            <article className="shop__card" key={issue.slug}>
              <Link to={`/magazine/${issue.slug}`} className="shop__cover">
                <img src={issue.cover} alt="" />
              </Link>
              <div className="shop__meta">
                <p className="eyebrow">
                  Issue {issue.number} · {issue.year}
                </p>
                <h2>{issue.title}</h2>
                <p>{issue.subject}</p>
                <div className="shop__row">
                  <strong>{issue.price}</strong>
                  <div className="shop__actions">
                    <Link className="btn" to={`/magazine/${issue.slug}`}>
                      Flip digital
                    </Link>
                    <a
                      className="btn btn--fill"
                      href="https://fighurs.com/shop/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Buy print
                    </a>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  )
}
