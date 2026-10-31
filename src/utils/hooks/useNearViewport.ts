import { useEffect, useLayoutEffect, useRef, useState } from 'react'

export const useBrowserLayoutEffect =
  typeof window === 'undefined' ? useEffect : useLayoutEffect

// Activate before scrolling reveals the component; never deactivate it again.
export function useNearViewport<T extends HTMLElement>(eager = false) {
  const ref = useRef<T>(null)
  const [isNear, setNear] = useState(eager)

  useBrowserLayoutEffect(() => {
    if (isNear) return
    const element = ref.current
    if (!element) return
    const margin = 400
    const rect = element.getBoundingClientRect()
    if (
      eager ||
      (rect.bottom >= -margin &&
        rect.top <= window.innerHeight + margin &&
        rect.right >= 0 &&
        rect.left <= window.innerWidth) ||
      typeof IntersectionObserver === 'undefined'
    ) {
      setNear(true)
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect()
          setNear(true)
        }
      },
      { rootMargin: `${margin}px 0px` }
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [eager, isNear])

  return { ref, isNear }
}
