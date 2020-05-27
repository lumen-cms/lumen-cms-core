import { GlobalStoryblok } from '../typings/generated/components-schema'

export default function parseFont(string?: string) {
  if (!string) return null
  const name = string.split(':')[0]
  return name.replace(/\+/g, ' ')
}

export const getFontBasedOnSetting = (settings: Partial<GlobalStoryblok>) => {
  const settingsFonts = ['theme_font_default', 'theme_font_alt1', 'theme_font_alt2', 'theme_font_alt3', 'theme_font_alt4']
  const loadFonts: string[] = []
  Object.keys(settings).forEach(key => {
    if (settingsFonts.includes(key) && settings[key]) {
      loadFonts.push(settings[key])
    }
  })
  return loadFonts
}

