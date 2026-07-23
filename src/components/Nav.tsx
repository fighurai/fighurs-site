import { NavLink } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Logo } from './Logo'
import { SocialLinks } from './SocialLinks'

function useClock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(id)
  }, [])
  return now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  })
}

export function Nav() {
  const clock = useClock()

  return (
    <header className="nav">
      <Logo label />
      <nav className="nav__links" aria-label="Primary">
        <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : undefined)}>
          Home
        </NavLink>
        <NavLink
          to="/interview"
          className={({ isActive }) => (isActive ? 'active' : undefined)}
        >
          Interview
        </NavLink>
        <NavLink
          to="/magazine"
          className={({ isActive }) => (isActive ? 'active' : undefined)}
        >
          Magazine
        </NavLink>
        <NavLink to="/shop" className={({ isActive }) => (isActive ? 'active' : undefined)}>
          Shop
        </NavLink>
        <NavLink to="/about" className={({ isActive }) => (isActive ? 'active' : undefined)}>
          About
        </NavLink>
      </nav>
      <div className="nav__meta">
        <SocialLinks showClock clock={clock} />
      </div>
    </header>
  )
}
