import { useEffect } from 'react'
import { useScript } from '@charlietango/hooks/use-script'

const tracked = new WeakSet<HTMLScriptElement>()

export function useExternalScript(
  url: string | undefined,
  options?: Parameters<typeof useScript>[1]
) {
  const status = useScript(url, options)
  useEffect(() => {
    if (!url) return
    const script = Array.from(document.scripts).find(
      (element) => element.getAttribute('src') === url
    )
    if (
      !script ||
      tracked.has(script) ||
      script.getAttribute('data-status') !== 'loading'
    )
      return
    tracked.add(script)
    const settle = (event: Event) => {
      script.setAttribute(
        'data-status',
        event.type === 'load' ? 'ready' : 'error'
      )
      script.removeEventListener('load', settle)
      script.removeEventListener('error', settle)
      tracked.delete(script)
    }
    script.addEventListener('load', settle)
    script.addEventListener('error', settle)
    // The upstream hook keeps scripts in the DOM but removes its listeners on
    // unmount. Keep only this one-shot status recorder until the request settles,
    // so a later mount can recognize scripts loaded while nobody was subscribed.
  }, [url])
  return status
}
