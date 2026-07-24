import { useEffect, useMemo, useRef, useState } from 'react'
import { MagazineForeverFlip } from './MagazineForeverFlip'
import { montagePages, youtubeClips } from '../data/heroManifest'
import '../styles/heroFilm.css'

type Phase = 'film' | 'magazine'

/**
 * Short muted film → auto-flipping archive pages.
 */
export function HeroFilm() {
  const [phase, setPhase] = useState<Phase>('film')
  const [cut, setCut] = useState(0)
  const [ytIndex, setYtIndex] = useState(0)
  const [showYt, setShowYt] = useState(false)
  const bgRef = useRef<HTMLVideoElement>(null)

  const cuts = useMemo(() => {
    const pool = [...montagePages]
    const out: string[] = []
    for (let i = 0; i < Math.min(72, pool.length); i++) {
      out.push(pool[(i * 11) % pool.length])
    }
    return out
  }, [])

  useEffect(() => {
    if (phase !== 'film') return

    let cutIdx = 0
    const cutTimer = window.setInterval(() => {
      cutIdx += 1
      setCut(cutIdx % cuts.length)
      const t = cutIdx % 18
      if (t === 8 || t === 9) {
        setShowYt(true)
        setYtIndex(0)
      } else if (t === 14 || t === 15) {
        setShowYt(true)
        setYtIndex(1)
      } else {
        setShowYt(false)
      }
    }, 140)

    const endTimer = window.setTimeout(() => {
      setPhase('magazine')
      setShowYt(false)
    }, 11000)

    return () => {
      window.clearInterval(cutTimer)
      window.clearTimeout(endTimer)
    }
  }, [phase, cuts.length])

  useEffect(() => {
    if (phase !== 'magazine') return
    const el = bgRef.current
    if (!el) return

    el.muted = true
    el.defaultMuted = true
    el.playsInline = true
    el.setAttribute('muted', '')
    el.setAttribute('playsinline', '')

    const tryPlay = () => {
      void el.play().catch(() => {})
    }

    tryPlay()
    el.addEventListener('canplay', tryPlay)
    el.addEventListener('loadeddata', tryPlay)
    return () => {
      el.removeEventListener('canplay', tryPlay)
      el.removeEventListener('loadeddata', tryPlay)
    }
  }, [phase])

  return (
    <section className={`hero-film hero-film--${phase}`}>
      {phase === 'film' && (
        <div className="hero-film__stage">
          <img
            key={cuts[cut]}
            className="hero-film__cut"
            src={cuts[cut]}
            alt=""
          />
          <div className="hero-film__grain" aria-hidden />
          <div className="hero-film__flash" key={`f-${cut}`} aria-hidden />

          {showYt && (
            <div className="hero-film__yt">
              <iframe
                title={youtubeClips[ytIndex].title}
                src={`https://www.youtube.com/embed/${youtubeClips[ytIndex].id}?autoplay=1&mute=1&controls=0&loop=1&playlist=${youtubeClips[ytIndex].id}&playsinline=1&rel=0`}
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}

          <div className="hero-film__chrome">
            <button type="button" className="btn" onClick={() => setPhase('magazine')}>
              Skip to magazine
            </button>
          </div>
        </div>
      )}

      {phase === 'magazine' && (
        <>
          <video
            ref={bgRef}
            className="hero-film__magazine-bg"
            src="/hero/flipbook-bg.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden
          />
          <div className="hero-film__magazine">
            <MagazineForeverFlip autoPlay speedMs={450} />
          </div>
        </>
      )}
    </section>
  )
}
