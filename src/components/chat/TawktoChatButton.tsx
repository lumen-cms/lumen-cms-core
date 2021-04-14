import { useEffect } from 'react'
import useScript, { ScriptStatus } from '@charlietango/use-script'
import { useRouter } from 'next/router'
import { useScrollOnce } from '../../utils/hooks/useScrolledOnce'
import { TawktoProps } from './chatTypings'

declare global {
  interface Window {
    Tawk_API?: {
      hideWidget: () => void
      toggleVisibility: () => void
      showWidget: () => void
      isChatHidden: () => boolean
      [k: string]: any
    }
  }
}

export default function LmTawktoChatButton({ content }: TawktoProps) {
  const { isPreview } = useRouter() || {}

  const tawkToId = content.account

  const isScrolled = useScrollOnce()

  const startInclude = content.disable_lazy || isScrolled

  const tawkToScriptName =
    !isPreview && tawkToId && startInclude
      ? `https://embed.tawk.to/${tawkToId}/default`
      : ''
  const [, status] = useScript(tawkToScriptName)
  if (status === ScriptStatus.ERROR) {
    console.error('Tawkto script could not load')
  }
  useEffect(() => {
    if (window?.Tawk_API?.isChatHidden()) {
      window.Tawk_API?.showWidget()
    }
    return () => {
      if (window?.Tawk_API) {
        window.Tawk_API.hideWidget()
      }
    }
  }, [])
  return null
}
