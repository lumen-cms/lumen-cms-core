import { useEffect } from 'react'
import { useSettings } from '../provider/SettingsPageProvider'
import { getFontBasedOnSetting } from '../../utils/parseFont'
import { GOOGLE_FONTS_ATTRIBUTE } from '../pages/DocumentGoogleFonts'

export const GOOGLE_FONTS_PREVIEW_ID = 'lm-google-fonts-preview'

/**
 * The document renders the fonts once on the server. Inside the Storyblok
 * editor the settings change live, so newly selected fonts are loaded here.
 */
export function GoogleFontsLivePreview(): null {
  const settings = useSettings()
  const href = getFontBasedOnSetting(settings)

  useEffect(() => {
    const rendered = document.querySelector(`[${GOOGLE_FONTS_ATTRIBUTE}]`)
    const existing = document.getElementById(GOOGLE_FONTS_PREVIEW_ID)
    if (rendered?.getAttribute(GOOGLE_FONTS_ATTRIBUTE) === href) {
      existing?.remove()
      return
    }
    if (existing instanceof HTMLLinkElement) {
      if (existing.href !== href) existing.href = href
      return
    }
    const link = document.createElement('link')
    link.id = GOOGLE_FONTS_PREVIEW_ID
    link.rel = 'stylesheet'
    link.href = href
    document.head.appendChild(link)
  }, [href])

  return null
}
