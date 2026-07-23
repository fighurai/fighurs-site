import { Link } from 'react-router-dom'
import '../styles/interview.css'

const episodes = [
  {
    id: 'Ht9nSV1zKCI',
    title: 'ISSUE 006 - THE ICON',
    subtitle: 'Iconikki',
    duration: '15:12',
  },
  {
    id: 'FoYHtz_8aYU',
    title: 'ISSUE 005 : MASUE KAMARA',
    subtitle: 'Masue Kamara',
    duration: '2:55',
  },
  {
    id: '2iBJqJkJj_4',
    title: 'FIGHURS MAGZINE ISSUE 006 - Teaser',
    subtitle: 'Teaser',
    duration: '0:22',
  },
  {
    id: '9f2CBot5us0',
    title: 'ISSUE 004 : NYFW Edition Trailer',
    subtitle: 'NYFW SS26',
    duration: '0:50',
  },
  {
    id: '1268W5yrWro',
    title: 'ISSUE 002 : The Cole Method',
    subtitle: 'Eddie Cole',
    duration: '8:21',
  },
  {
    id: 'Z4TubxJrWuU',
    title: 'ISSUE 001: The Multifaceted Model',
    subtitle: 'Makenna Onyambu',
    duration: '6:53',
  },
]

export function InterviewPage() {
  const feature = episodes[0]

  return (
    <main className="interview page">
      <div className="interview__dots" aria-hidden />
      <div className="interview__shape interview__shape--a" aria-hidden />
      <div className="interview__shape interview__shape--b" aria-hidden />
      <div className="interview__shape interview__shape--c" aria-hidden />

      <header className="interview__intro">
        <h1 className="display">THE INTERVIEW</h1>
        <div className="interview__cta">
          <a
            className="btn btn--fill"
            href="https://www.youtube.com/@fighursonfilm"
            target="_blank"
            rel="noreferrer"
          >
            Watch on YouTube
          </a>
          <Link className="btn" to="/magazine">
            Read the issues
          </Link>
        </div>
      </header>

      <section className="interview__feature" aria-label="Featured interview">
        <div className="interview__video">
          <iframe
            src={`https://www.youtube.com/embed/${feature.id}`}
            title={feature.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
        <div className="interview__feature-meta">
          {feature.duration ? <p className="eyebrow">{feature.duration}</p> : null}
          <h2 className="interview__feature-title">{feature.title}</h2>
          <p>{feature.subtitle}</p>
        </div>
      </section>

      <section className="interview__more">
        <div className="interview__more-head">
          <p className="eyebrow">More episodes</p>
          <h2 className="display interview__more-title">Watch next</h2>
        </div>

        <ul className="interview__list">
          {episodes.map((ep) => (
            <li key={ep.id}>
              <a
                className="interview__row"
                href={`https://www.youtube.com/watch?v=${ep.id}`}
                target="_blank"
                rel="noreferrer"
              >
                <div className="interview__thumb">
                  <img
                    src={`https://img.youtube.com/vi/${ep.id}/hqdefault.jpg`}
                    alt=""
                    loading="lazy"
                  />
                </div>
                <div className="interview__row-copy">
                  {ep.duration ? <p className="eyebrow">{ep.duration}</p> : (
                    <p className="eyebrow">Episode</p>
                  )}
                  <h3>{ep.title}</h3>
                  <p>{ep.subtitle}</p>
                </div>
                <span className="interview__play">Play</span>
              </a>
            </li>
          ))}
        </ul>

        <a
          className="interview__channel"
          href="https://www.youtube.com/@fighursonfilm"
          target="_blank"
          rel="noreferrer"
        >
          <span className="eyebrow">Channel</span>
          <span className="interview__channel-name">@fighursonfilm</span>
          <span className="interview__channel-go">Subscribe →</span>
        </a>
      </section>
    </main>
  )
}
