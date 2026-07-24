import { useEffect, useMemo, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Logo } from '../components/Logo'
import { heroManifest } from '../data/heroManifest'
import { issues } from '../data/issues'
import '../styles/magazine.css'

gsap.registerPlugin(ScrollTrigger)

/** S-curve point in viewport space (0–1 normalized). Matches Getty Tracing Art wave. */
function curvePoint(t: number) {
  const x = 0.06 + t * 0.88
  // lazy S: up, down, up
  const y = 0.42 + Math.sin(t * Math.PI * 2.05) * 0.26 - Math.cos(t * Math.PI * 1.1) * 0.04
  return { x, y }
}

export function MagazinePage() {
  const root = useRef<HTMLElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const trail = useRef<HTMLDivElement>(null)

  const trailSrcs = useMemo(() => {
    const pages = heroManifest.flatMap((h) => h.pages.slice(0, 8))
    const covers = issues.map((i) => i.cover)
    const mixed: string[] = []
    // Dense ribbon like the reference (~48 cards)
    for (let i = 0; i < 48; i++) {
      mixed.push(i % 3 === 0 ? covers[i % covers.length] : pages[i % pages.length])
    }
    return mixed
  }, [])

  useEffect(() => {
    const stageEl = stage.current
    const trailEl = trail.current
    if (!stageEl || !trailEl) return

    const items = Array.from(stageEl.querySelectorAll<HTMLElement>('.works__item'))
    const cards = Array.from(trailEl.querySelectorAll<HTMLElement>('.works__trail-card'))
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const mobile = window.matchMedia('(max-width: 900px)').matches

    const ctx = gsap.context(() => {
      const enableParallax = () => {
        if (mobile || reduce) return
        items.forEach((el, i) => {
          gsap.to(el, {
            y: i % 2 === 0 ? -40 : 30,
            ease: 'none',
            scrollTrigger: {
              trigger: stageEl,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          })
        })
      }

      if (reduce) {
        gsap.from(items, {
          y: 48,
          opacity: 0,
          duration: 0.7,
          stagger: 0.06,
          ease: 'power3.out',
        })
        gsap.set(trailEl, { autoAlpha: 0 })
        return
      }

      const vw = window.innerWidth
      const vh = window.innerHeight
      // On mobile, keep the S-curve entrance but use a shorter viewport band
      const curveScaleY = mobile ? 0.55 : 1
      const curveOffsetY = mobile ? 0.18 : 0

      // Place trail cards along the S-curve
      cards.forEach((card, i) => {
        const t = i / Math.max(1, cards.length - 1)
        const { x, y } = curvePoint(t)
        const w = gsap.utils.interpolate(mobile ? 48 : 72, mobile ? 78 : 110, Math.sin(t * Math.PI))
        gsap.set(card, {
          left: x * vw - w / 2,
          top: (y * curveScaleY + curveOffsetY) * vh - (w * 1.3) / 2,
          width: w,
          height: w * 1.3,
          rotation: gsap.utils.interpolate(-8, 8, Math.sin(t * Math.PI * 2)),
          zIndex: i,
        })
      })

      // Measure final item centers, then offset from curve → identity
      const fromStates = items.map((el, i) => {
        const rect = el.getBoundingClientRect()
        const t = i / Math.max(1, items.length - 1)
        const { x, y } = curvePoint(0.12 + t * 0.76)
        const startX = x * vw
        const startY = (y * curveScaleY + curveOffsetY) * vh
        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2
        return {
          el,
          x: startX - cx,
          y: startY - cy,
          rotation: gsap.utils.interpolate(-14, 14, Math.sin(t * Math.PI * 2)),
          scale: mobile ? 0.7 : 0.55,
        }
      })

      gsap.set(items, { autoAlpha: 0 })
      fromStates.forEach(({ el, x, y, rotation, scale }) => {
        gsap.set(el, { x, y, rotation, scale, autoAlpha: 0 })
      })

      gsap.set(['.works__top', '.works__rail'], { autoAlpha: 0, y: 16 })
      gsap.set(trailEl, { autoAlpha: 1 })

      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        onComplete: enableParallax,
      })

      // 1) Ribbon streams in along the curve
      tl.from(
        cards,
        {
          x: (i: number) => (i < cards.length / 2 ? -vw * 0.35 : vw * 0.2),
          y: (i: number) => Math.sin(i) * (mobile ? 40 : 80),
          opacity: 0,
          scale: 0.7,
          duration: mobile ? 0.85 : 1.05,
          stagger: {
            each: mobile ? 0.012 : 0.018,
            from: 'start',
          },
          ease: 'power2.out',
        },
        0.05,
      )

      // 2) Ribbon breathes / slides slightly along path
      tl.to(
        cards,
        {
          x: '+=18',
          y: (i: number) => `+=${Math.sin(i * 0.45) * 12}`,
          duration: 0.55,
          stagger: 0.008,
          ease: 'sine.inOut',
        },
        '-=0.2',
      )

      // 3) Real covers appear on the curve, ribbon fades
      tl.to(
        items,
        {
          autoAlpha: 1,
          duration: 0.2,
          stagger: 0.04,
        },
        '-=0.15',
      )

      tl.to(
        trailEl,
        {
          autoAlpha: 0,
          duration: 0.55,
          ease: 'power2.inOut',
        },
        '-=0.05',
      )

      // 4) Covers fly from curve → final collage seats
      tl.to(
        items,
        {
          x: 0,
          y: 0,
          rotation: 0,
          scale: 1,
          duration: mobile ? 0.95 : 1.15,
          stagger: {
            each: 0.07,
            from: 'center',
          },
          ease: 'power3.inOut',
        },
        '-=0.35',
      )

      // 5) Chrome in
      tl.to(
        ['.works__top', '.works__rail'],
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: 'power2.out',
        },
        '-=0.45',
      )
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <main className="works page" ref={root}>
      <div className="works__trail" ref={trail} aria-hidden>
        {trailSrcs.map((src, i) => (
          <div key={`${src}-${i}`} className="works__trail-card">
            <img src={src} alt="" loading="eager" decoding="async" />
          </div>
        ))}
      </div>

      <div className="works__top">
        <div>
          <div className="works__brand">
            <Logo />
          </div>
          <p className="eyebrow">Archive / Works</p>
          <h1 className="display">Magazine</h1>
        </div>
        <p className="works__count">{issues.length} issues · 2025—2026</p>
      </div>

      <div className="works__stage" ref={stage}>
        {issues.map((issue, index) => (
          <Link
            key={issue.slug}
            to={`/magazine/${issue.slug}`}
            className={`works__item works__item--${index}`}
          >
            <img src={issue.cover} alt={`${issue.title} cover`} loading="eager" />
            <div className="works__item-label">
              <strong>{issue.subject}</strong>
              <span>{issue.year}</span>
            </div>
          </Link>
        ))}
      </div>

      <div className="works__rail">
        {issues.map((issue) => (
          <Link key={issue.slug} to={`/magazine/${issue.slug}`} className="works__rail-row">
            <span>No.{issue.number}</span>
            <strong>{issue.title}</strong>
            <span>{issue.subject}</span>
            <span>{issue.year}</span>
          </Link>
        ))}
      </div>
    </main>
  )
}
