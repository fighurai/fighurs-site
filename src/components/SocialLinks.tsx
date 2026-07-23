const IG = 'https://www.instagram.com/fighurs/'
const YT = 'https://www.youtube.com/@fighursonfilm'

type SocialLinksProps = {
  className?: string
  showClock?: boolean
  clock?: string
}

export function SocialLinks({ className = '', showClock = false, clock }: SocialLinksProps) {
  return (
    <div className={`social-links ${className}`.trim()}>
      <a href={IG} target="_blank" rel="noreferrer">
        Instagram
      </a>
      <a href={YT} target="_blank" rel="noreferrer">
        YouTube
      </a>
      {showClock && clock ? <span className="social-links__clock">{clock}</span> : null}
    </div>
  )
}

export const social = { IG, YT }
