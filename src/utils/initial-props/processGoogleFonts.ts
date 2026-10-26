import postcss from 'postcss'
// eslint-disable-next-line
// @ts-ignore
import minifier from 'cssnano-simple'
import { AppPageProps } from '../../typings/app'
import { getFontBasedOnSetting } from '../parseFont'
const fontUserAgents = [
  'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36'
]

async function getFontDefinitionFromNetwork(href: string): Promise<string> {
  const stylesheets = await Promise.all(
    fontUserAgents.map(async (userAgent) => {
      const response = await fetch(href, {
        headers: { 'User-Agent': userAgent }
      })
      if (!response.ok)
        throw new Error(`Google Fonts request failed: ${response.status}`)
      return response.text()
    })
  )
  return stylesheets.join('\n')
}

// cache response
export const googleFontString: { [k: string]: string } = {}

// taken from gathering file https://github.com/vercel/next.js/blob/8fdcc52854007f64f079ce3b4a45f43269b8baec/packages/next/build/webpack/plugins/font-stylesheet-gathering-plugin.ts
function minifyCss(css: string): Promise<string> {
  return postcss([
    minifier({
      excludeAll: true,
      discardComments: true,
      normalizeWhitespace: { exclude: false }
    })
  ])
    .process(css, { from: undefined })
    .then((res) => res.css)
}

export const processGoogleFonts = async (props: AppPageProps) => {
  if (!process.env.NEXT_PUBLIC_DISABLE_GOOGLE_FONTS && props.settings) {
    if (
      googleFontString.css &&
      props.settings.uuid === googleFontString.settingsId
    ) {
      // Object.assign(props, {
      //   googleFontString: googleFontString[href]
      // })
      return
    }
    const href = getFontBasedOnSetting(props.settings || {})

    const res = await getFontDefinitionFromNetwork(href)
    // const res = await fetch(href).then((r) => r.text())
    googleFontString.css = await minifyCss(res)
    googleFontString.settingsId = props.settings.uuid as string
    // Object.assign(props, {
    //   googleFontString: googleFontString[href]
    // })
  }
}
