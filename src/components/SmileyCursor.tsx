import { useEffect } from 'react'

/** Soft custom cursor: circular yellow smiley following the pointer */
export function SmileyCursor() {
  useEffect(() => {
    const el = document.createElement('div')
    el.className = 'smiley-cursor'
    el.setAttribute('aria-hidden', 'true')
    document.body.appendChild(el)
    document.documentElement.classList.add('has-smiley-cursor')

    const move = (e: PointerEvent) => {
      el.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`
      el.classList.add('is-on')
    }
    const down = () => el.classList.add('is-down')
    const up = () => el.classList.remove('is-down')
    const leave = () => el.classList.remove('is-on')

    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerdown', down)
    window.addEventListener('pointerup', up)
    window.addEventListener('pointerleave', leave)

    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerdown', down)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointerleave', leave)
      el.remove()
      document.documentElement.classList.remove('has-smiley-cursor')
    }
  }, [])

  return null
}
