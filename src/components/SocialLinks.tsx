const IG = 'https://www.instagram.com/fighurs/'
const YT = 'https://www.youtube.com/@fighursonfilm'

type SocialLinksProps = {
  className?: string
  showClock?: boolean
  clock?: string
}

function InstagramIcon() {
  return (
    <svg className="social-links__icon" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2zm-.2 2A3.6 3.6 0 0 0 4 7.6v8.8A3.6 3.6 0 0 0 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6A3.6 3.6 0 0 0 16.4 4H7.6zm9.65 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"
      />
    </svg>
  )
}

function YouTubeIcon() {
  return (
    <svg className="social-links__icon" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.5 31.5 0 0 0 0 12a31.5 31.5 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.5 31.5 0 0 0 24 12a31.5 31.5 0 0 0-.5-5.8zM9.8 15.5v-7l6.2 3.5-6.2 3.5z"
      />
    </svg>
  )
}

export function SocialLinks({ className = '', showClock = false, clock }: SocialLinksProps) {
  return (
    <div className={`social-links ${className}`.trim()}>
      <a href={IG} target="_blank" rel="noreferrer" aria-label="Instagram" title="Instagram">
        <InstagramIcon />
      </a>
      <a href={YT} target="_blank" rel="noreferrer" aria-label="YouTube" title="YouTube">
        <YouTubeIcon />
      </a>
      {showClock && clock ? <span className="social-links__clock">{clock}</span> : null}
    </div>
  )
}

export const social = { IG, YT }
