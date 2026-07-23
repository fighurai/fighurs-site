import { Link } from 'react-router-dom'

type LogoProps = {
  className?: string
  to?: string | false
  label?: boolean
}

/** Official FIGHURS mark — rendered from logo.pdf (no remakes) */
export function Logo({ className = '', to = '/', label = false }: LogoProps) {
  const inner = (
    <>
      <img
        src="/brand/logo-mark.png"
        alt=""
        className="logo__mark"
        width={40}
        height={40}
      />
      {label ? <span className="logo__word">fighurs</span> : <span className="sr-only">FIGHURS</span>}
    </>
  )

  if (to) {
    return (
      <Link to={to} className={`logo ${className}`.trim()} aria-label="FIGHURS home">
        {inner}
      </Link>
    )
  }

  return <div className={`logo ${className}`.trim()}>{inner}</div>
}
