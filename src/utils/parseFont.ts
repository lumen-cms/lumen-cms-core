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
  // let isCss2 = false
  settingsFonts.forEach((key) => {
    const fontValue = settings[key]
    if (fontValue) {
      if (fontValue.includes('wght') || !fontValue.includes(':')) {
        loadFonts.push(fontValue.trim())
      } else {
        const [name, weights] = fontValue.trim().split(':')
        loadFonts.push(`${name}:wght@${weights.split(',').join(';')}`)
        // css1
      }
    }
  })
  // Object.keys(settings).forEach((key) => {
  //   if (settingsFonts.includes(key) && settings[key]) {
  //     if (settings[key].includes('wght')) {
  //       isCss2 = true
  //     }
  //     loadFonts.push(settings[key])
  //   }
  // })
  const googleFontsString = loadFonts.join('&family=')
  return `https://fonts.googleapis.com/css2?family=${googleFontsString}${
    process.env.NEXT_PUBLIC_LAZY_FONT_DISABLE ? '' : '&display=swap'
  }`
}
