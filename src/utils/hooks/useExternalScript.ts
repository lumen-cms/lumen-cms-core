import { useEffect } from 'react'
import { useScript } from '@charlietango/hooks/use-script'
import { trackPendingScriptStatus } from './scriptStatusOwner'

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
    // Transfer status recording to the document owner. The upstream hook still
    // owns and cleans up this component's state-update listeners on unmount.
    if (script) trackPendingScriptStatus(script)
  }, [url])
  return status
}
