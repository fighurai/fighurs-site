import { Link } from 'react-router-dom'
import { HeroFilm } from '../components/HeroFilm'
import { issues } from '../data/issues'
import '../styles/home.css'

export function HomePage() {
  const loop = [...issues, ...issues]

  return (
    <main className="home page home--film">
      <HeroFilm />

      <section className="home__figures home__figures--after-film">
        <div className="home__figures-head">
          <div>
            <h2 className="display">The figures</h2>
          </div>
          <Link className="btn" to="/magazine">
            View all issues
          </Link>
        </div>
        <div className="home__marquee" aria-label="Featured issues">
          {loop.map((issue, idx) => (
            <Link
              className="home__card"
              to={`/magazine/${issue.slug}`}
              key={`${issue.slug}-${idx}`}
            >
              <img src={issue.cover} alt={issue.title} loading="lazy" />
              <div className="home__card-meta">
                <span>No.{issue.number}</span>
                <span>{issue.subject}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="home__close">
        <p className="eyebrow" style={{ color: '#6b675f' }}>
          Keep going
        </p>
        <h2 className="display">Read. Watch. Collect.</h2>
        <div className="home__cta-row" style={{ justifyContent: 'center' }}>
          <Link className="btn" to="/magazine">
            Magazine
          </Link>
          <Link className="btn btn--magenta" to="/interview">
            Interview
          </Link>
          <a
            className="btn btn--cyan"
            href="https://www.instagram.com/fighurs/"
            target="_blank"
            rel="noreferrer"
          >
            @fighurs
          </a>
        </div>
      </section>
    </main>
  )
}
