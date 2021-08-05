import postcss from 'postcss'
// eslint-disable-next-line
// @ts-ignore
import minifier from 'cssnano-simple'

import { getFontDefinitionFromNetwork } from 'next/dist/next-server/server/font-utils'
import { AppPageProps } from '../../typings/app'
import { getFontBasedOnSetting } from '../parseFont'

// cache response
const googleFontString = {}

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
    const href = getFontBasedOnSetting(props.settings || {})
    if (googleFontString[href]) {
      Object.assign(props, {
        googleFontString: googleFontString[href]
      })
      return
    }
    const res = await getFontDefinitionFromNetwork(href)
    // const res = await fetch(href).then((r) => r.text())
    googleFontString[href] = await minifyCss(res)
    Object.assign(props, {
      googleFontString: googleFontString[href]
    })
  }
}
