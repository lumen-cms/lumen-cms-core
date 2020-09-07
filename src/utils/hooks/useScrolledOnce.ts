import { useEffect, useState } from 'react'

export function useScrollOnce() {
  const [isScrolled, setState] = useState<boolean>(false)

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined
    }
    const handler = () => {
      setState(true)
    }

    window.addEventListener('scroll', handler, {
      capture: false,
      passive: true,
      once: true
    })

    return () => {
      window.removeEventListener('scroll', handler)
    }
  }, [])

  return isScrolled
}
