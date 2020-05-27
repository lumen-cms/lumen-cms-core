import { useEffect, useState } from 'react'
import { CONFIG } from '../../utils/config'
import useScrollTrigger from '@material-ui/core/useScrollTrigger'
import { GlobalStoryblok } from '../../typings/generated/components-schema'
import { useScript } from '../../utils/hooks/useScript'
import { useAppContext } from '../provider/AppProvider'

type ExternalScriptsProps = { settings: GlobalStoryblok }

function ExternalScripts({ settings }: ExternalScriptsProps): JSX.Element | null {
  const { insideStoryblok } = useAppContext()
  const tawkToId = CONFIG.TAWKTO || settings.tawkto

  const scrolled = useScrollTrigger({ disableHysteresis: true })
  const [isScrolled, setIsScrolled] = useState<boolean>(false)

  useEffect(
    () => {
      if (scrolled) {
        setIsScrolled(true)
      }
    },
    [scrolled]
  )
  const tawkToScriptName = !insideStoryblok && tawkToId && isScrolled ? 'https://embed.tawk.to/' + tawkToId + '/default' : ''
  const tawkToScript = useScript(tawkToScriptName)
  if (tawkToScriptName && tawkToScript.error) {
    console.error('Tawkto script could not load')
  }
  return null
}

export default ExternalScripts
