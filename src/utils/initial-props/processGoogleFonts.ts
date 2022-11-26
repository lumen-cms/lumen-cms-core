import postcss from 'postcss'
// eslint-disable-next-line
// @ts-ignore
import minifier from 'cssnano-simple'
import { AppPageProps } from '../../typings/app'
import { getFontBasedOnSetting } from '../parseFont'
// import { getFontDefinitionFromNetwork } from 'next/dist/next-server/server/font-utils'
import { getFontDefinitionFromNetwork } from 'next/dist/server/font-utils'

// cache response
export const googleFontString: { css: string; settingsId: string } = {
  css: '',
  settingsId: ''
}

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
      props.settings._uid === googleFontString.settingsId
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
    googleFontString.settingsId = props.settings._uid
    // Object.assign(props, {
    //   googleFontString: googleFontString[href]
    // })
  }
}
