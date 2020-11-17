import { GlobalStoryblok } from '../typings/generated/components-schema'

export default function parseFont(string?: string) {
  if (!string) return null
  const name = string.split(':')[0]
  return name.replace(/\+/g, ' ')
}

export const getFontBasedOnSetting = (settings: Partial<GlobalStoryblok>) => {
  const settingsFonts = [
    'theme_font_default',
    'theme_font_alt1',
    'theme_font_alt2',
    'theme_font_alt3',
    'theme_font_alt4'
  ]
  const loadFonts: string[] = []
  let isCss2 = false
  Object.keys(settings).forEach((key) => {
    if (settingsFonts.includes(key) && settings[key]) {
      if (settings[key].includes('wght')) {
        isCss2 = true
      }
      loadFonts.push(settings[key])
    }
  })
  const googleFontsString = loadFonts.join(isCss2 ? '&family=' : '|')
  return `https://fonts.googleapis.com/${
    isCss2 ? 'css2' : 'css'
  }?family=${googleFontsString}&display=swap`
}
