import { useScrollOnce } from '../../utils/hooks/useScrolledOnce'
import useScript, { ScriptStatus } from '../../utils/hooks/useScript'
import { TawktoProps } from './chatTypings'
import { useAppContext } from '../provider/context/AppContext'

export function TawktoChatButton({ content }: TawktoProps) {
  const { insideStoryblok } = useAppContext()
  const tawkToId = content.account

  const isScrolled = useScrollOnce()

  const startInclude = content.disable_lazy || isScrolled

  const tawkToScriptName =
    !insideStoryblok && tawkToId && startInclude
      ? `https://embed.tawk.to/${tawkToId}/default`
      : ''
  const [, status] = useScript(tawkToScriptName)
  if (status === ScriptStatus.ERROR) {
    console.error('Tawkto script could not load')
  }
  return null
}
