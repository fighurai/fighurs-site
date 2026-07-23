import { Logo } from './Logo'
import { social } from './SocialLinks'

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <Logo label />
          <p>there&apos;s just so much to smile about.</p>
        </div>

        <div className="site-footer__cols">
          <div>
            <p className="eyebrow">Follow</p>
            <a href={social.IG} target="_blank" rel="noreferrer">
              @fighurs
            </a>
            <a href={social.YT} target="_blank" rel="noreferrer">
              @fighursonfilm
            </a>
          </div>
          <div>
            <p className="eyebrow">More</p>
            <a href="https://fighurs.com/shop/" target="_blank" rel="noreferrer">
              Buy print
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
