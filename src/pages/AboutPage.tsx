import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import '../styles/about.css'

type Tone = 'yellow' | 'magenta' | 'blue' | 'accent' | 'white' | 'black'

type Beat =
  | { kind: 'flash'; ms: number; tone: Tone }
  | { kind: 'slam'; ms: number; tone: Tone; word: string }
  | {
      kind: 'build'
      ms: number
      tone: Tone
      words: string[]
      hold?: number
    }
  | { kind: 'photo'; ms: number; src: string; label?: string }

const STILLS = [
  '/covers/nyfw-late2.jpg',
  '/covers/isaiah-bubba-3.jpg',
  '/covers/makenna-2.jpg',
  '/covers/eddie-cole-2.jpg',
  '/covers/iconikki-2.jpg',
  '/covers/masue-kamara-2.jpg',
  '/covers/juhm-2.jpg',
  '/covers/collage-3.jpg',
  '/covers/nyfw-late5.jpg',
  '/covers/isaiah-bubba-1.jpg',
  '/covers/makenna-1.jpg',
  '/covers/eddie-cole-1.jpg',
  '/hero/pages/nyfw-ss26/012.jpg',
  '/hero/pages/iconikki/018.jpg',
  '/hero/pages/makenna/008.jpg',
] as const

function WordMark({ text }: { text: string }) {
  if (!/FIGHURS/i.test(text)) return <>{text}</>
  const parts = text.split(/(FIGHURS)/i)
  return (
    <>
      {parts.map((p, i) =>
        /FIGHURS/i.test(p) ? (
          <em key={i}>FIGHURS</em>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  )
}

/** About = kinetic reel about fighurs.com — type + editorial stills only. */
export function AboutPage() {
  const beats = useMemo<Beat[]>(
    () => [
      { kind: 'flash', ms: 140, tone: 'magenta' },
      {
        kind: 'build',
        ms: 280,
        tone: 'yellow',
        words: ['Welcome', 'to', 'FIGHURS'],
        hold: 520,
      },
      { kind: 'flash', ms: 110, tone: 'blue' },
      { kind: 'photo', ms: 400, src: STILLS[0] },

      {
        kind: 'build',
        ms: 240,
        tone: 'white',
        words: ['a digital', 'and print', 'magazine'],
        hold: 480,
      },
      { kind: 'slam', ms: 480, tone: 'magenta', word: 'spotlighting' },
      {
        kind: 'build',
        ms: 260,
        tone: 'yellow',
        words: ['trailblazing', 'figures'],
        hold: 420,
      },
      { kind: 'photo', ms: 380, src: STILLS[6] },
      { kind: 'photo', ms: 360, src: STILLS[1] },
      {
        kind: 'build',
        ms: 220,
        tone: 'blue',
        words: ['redefining', 'culture', '& innovation', 'their way.'],
        hold: 500,
      },

      { kind: 'flash', ms: 100, tone: 'accent' },
      { kind: 'photo', ms: 320, src: STILLS[2], label: 'fashion' },
      { kind: 'slam', ms: 320, tone: 'magenta', word: 'fashion' },
      { kind: 'photo', ms: 320, src: STILLS[3], label: 'literature' },
      { kind: 'slam', ms: 320, tone: 'blue', word: 'literature' },
      { kind: 'photo', ms: 320, src: STILLS[4], label: 'science' },
      { kind: 'slam', ms: 320, tone: 'yellow', word: 'science' },
      {
        kind: 'build',
        ms: 240,
        tone: 'accent',
        words: ['& countless', 'other fields'],
        hold: 420,
      },
      { kind: 'photo', ms: 380, src: STILLS[5] },

      { kind: 'flash', ms: 130, tone: 'black' },
      {
        kind: 'build',
        ms: 260,
        tone: 'black',
        words: ['FIGHURS is here', 'to tell', 'their stories.'],
        hold: 700,
      },
      { kind: 'photo', ms: 400, src: STILLS[7] },
      { kind: 'photo', ms: 380, src: STILLS[12] },

      {
        kind: 'build',
        ms: 240,
        tone: 'white',
        words: ['easier to compete', 'than to appreciate'],
        hold: 500,
      },
      { kind: 'slam', ms: 420, tone: 'blue', word: 'celebrate' },
      { kind: 'photo', ms: 340, src: STILLS[13] },
      {
        kind: 'build',
        ms: 280,
        tone: 'magenta',
        words: ['creativity.', 'ambition.', 'impact.'],
        hold: 560,
      },
      { kind: 'photo', ms: 360, src: STILLS[8] },
      {
        kind: 'build',
        ms: 240,
        tone: 'yellow',
        words: ['not just', 'recognition —'],
        hold: 360,
      },
      { kind: 'slam', ms: 640, tone: 'accent', word: 'flowers.' },
      { kind: 'photo', ms: 340, src: STILLS[14] },
      {
        kind: 'build',
        ms: 260,
        tone: 'white',
        words: ['well-deserved flowers', 'no longer a figment', 'of their imagination.'],
        hold: 720,
      },
      { kind: 'photo', ms: 380, src: STILLS[9] },
      { kind: 'photo', ms: 360, src: STILLS[10] },

      { kind: 'flash', ms: 120, tone: 'magenta' },
      {
        kind: 'build',
        ms: 260,
        tone: 'magenta',
        words: ['From your', 'ever smiling', 'editor'],
        hold: 480,
      },
      { kind: 'photo', ms: 340, src: STILLS[11] },
      {
        kind: 'build',
        ms: 240,
        tone: 'yellow',
        words: ['that encourages', 'you all', 'to do the same.'],
        hold: 600,
      },
      { kind: 'slam', ms: 820, tone: 'accent', word: 'FIGHURS' },
      { kind: 'flash', ms: 180, tone: 'blue' },
    ],
    [],
  )

  const [i, setI] = useState(0)
  const beat = beats[i % beats.length]
  const [wordN, setWordN] = useState(0)

  useEffect(() => {
    setWordN(0)
  }, [i])

  useEffect(() => {
    if (beat.kind !== 'build') {
      const t = window.setTimeout(() => setI((n) => (n + 1) % beats.length), beat.ms)
      return () => window.clearTimeout(t)
    }

    if (wordN < beat.words.length - 1) {
      const t = window.setTimeout(() => setWordN((n) => n + 1), beat.ms)
      return () => window.clearTimeout(t)
    }

    const hold = beat.hold ?? beat.ms
    const t = window.setTimeout(() => setI((n) => (n + 1) % beats.length), hold)
    return () => window.clearTimeout(t)
  }, [beat, wordN, beats.length])

  useEffect(() => {
    STILLS.forEach((src) => {
      const img = new Image()
      img.src = src
    })
  }, [])

  const buildWords =
    beat.kind === 'build' ? beat.words.slice(0, wordN + 1) : []

  return (
    <main className="about page about--reel">
      <div className="about__phone" aria-label="FIGHURS about reel">
        <div className="about__stage" key={`beat-${i}`}>
          {beat.kind === 'flash' && (
            <div className={`about__frame is-${beat.tone} about__frame--flash`} />
          )}

          {beat.kind === 'slam' && (
            <div className={`about__frame is-${beat.tone} about__frame--slam`}>
              <p className="about__slam">
                <WordMark text={beat.word} />
              </p>
            </div>
          )}

          {beat.kind === 'build' && (
            <div className={`about__frame is-${beat.tone} about__frame--build`}>
              {buildWords.map((w, idx) => (
                <p
                  key={`${w}-${idx}`}
                  className={`about__build-word${idx === wordN ? ' is-new' : ''}`}
                >
                  <WordMark text={w} />
                </p>
              ))}
            </div>
          )}

          {beat.kind === 'photo' && (
            <div className="about__frame about__frame--media">
              <img src={beat.src} alt="" className="about__cut" />
              {beat.label ? <p className="about__caption">{beat.label}</p> : null}
            </div>
          )}
        </div>
      </div>

      <div className="about__chrome">
        <p className="about__chrome-label">about fighurs.com</p>
        <div className="about__chrome-actions">
          <a className="about__chip" href="https://fighurs.com/" target="_blank" rel="noreferrer">
            fighurs.com
          </a>
          <Link className="about__chip about__chip--ghost" to="/magazine">
            magazine
          </Link>
        </div>
      </div>
    </main>
  )
}

