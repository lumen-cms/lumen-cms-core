import { CONFIG } from '../../utils/config'
import { GlobalStoryblok } from '../../typings/generated/components-schema'
import { useAppContext } from '../provider/context/AppContext'
import useScript, { ScriptStatus } from '../../utils/hooks/useScript'
import { useScrollOnce } from '../../utils/hooks/useScrolledOnce'

type ExternalScriptsProps = { settings: GlobalStoryblok }

function ExternalScripts({
  settings
}: ExternalScriptsProps): JSX.Element | null {
  const { insideStoryblok } = useAppContext()
  const tawkToId = CONFIG.TAWKTO || settings.tawkto

  const isScrolled = useScrollOnce()

  const tawkToScriptName =
    !insideStoryblok && tawkToId && isScrolled
      ? `https://embed.tawk.to/${tawkToId}/default`
      : ''
  const [, status] = useScript(tawkToScriptName)
  if (status === ScriptStatus.ERROR) {
    console.error('Tawkto script could not load')
  }
  return null
}

export default ExternalScripts
