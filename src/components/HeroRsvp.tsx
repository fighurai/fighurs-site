import '../styles/heroRsvp.css'

const RSVP_URL = 'https://posh.vip/f/e27a1'

const ticker = 'FIGHURS · NEW YORK FASHION WEEK · RSVP NOW · '

export function HeroRsvp() {
  return (
    <section className="hero-rsvp" id="rsvp">
      <div className="hero-rsvp__ticker" aria-hidden>
        <div className="hero-rsvp__ticker-track">
          {Array.from({ length: 6 }, (_, i) => (
            <span key={i}>{ticker}</span>
          ))}
        </div>
      </div>

      <div className="hero-rsvp__inner">
        <p className="eyebrow hero-rsvp__eyebrow">New York Fashion Week</p>

        <h1 className="display hero-rsvp__title">
          <span>You&rsquo;re</span>
          <span>invited</span>
        </h1>

        <img
          className="hero-rsvp__mark"
          src="/brand/logo-mark.png"
          alt=""
          aria-hidden
        />

        <p className="hero-rsvp__copy">
          FIGHURS takes over New York Fashion Week. Limited capacity — reserve your
          spot before the list closes.
        </p>

        <div className="hero-rsvp__cta-row">
          <a
            className="btn btn--fill hero-rsvp__cta"
            href={RSVP_URL}
            target="_blank"
            rel="noreferrer"
          >
            RSVP for NYFW
          </a>
          <a className="btn hero-rsvp__scroll" href="#the-magazine">
            Enter the magazine
          </a>
        </div>
      </div>
    </section>
  )
}
