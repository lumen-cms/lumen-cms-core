import postcss from 'postcss'
// @ts-ignore
import minifier from 'cssnano-simple'
import { GlobalStoryblok } from '../../typings/generated/components-schema'
import { getFontBasedOnSetting } from '../parseFont'
import { getGoogleFontsCss, setGoogleFontsCss } from './googleFontsCache'

export { getGoogleFontsCss }

// A modern user agent makes Google respond with woff2 + unicode-range subsets.
const FONT_USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36'
const FONT_REQUEST_TIMEOUT_MS = 3000

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

async function fetchGoogleFontsCss(href: string): Promise<string> {
  const response = await fetch(href, {
    headers: { 'User-Agent': FONT_USER_AGENT },
    signal: AbortSignal.timeout(FONT_REQUEST_TIMEOUT_MS)
  })
  if (!response.ok) {
    throw new Error(`Google Fonts request failed: ${response.status}`)
  }
  return response.text()
}

/**
 * Fetches and caches the Google Fonts CSS for the given settings so that
 * `_document` can inline it synchronously. Never throws: on failure the
 * document falls back to a stylesheet link.
 */
export const loadGoogleFontsCss = async (
  settings?: Partial<GlobalStoryblok> | null
): Promise<string | undefined> => {
  if (process.env.NEXT_PUBLIC_DISABLE_GOOGLE_FONTS || !settings) {
    return undefined
  }
  const href = getFontBasedOnSetting(settings)
  const cached = getGoogleFontsCss(href)
  if (cached) {
    return cached
  }
  try {
    const css = await minifyCss(await fetchGoogleFontsCss(href))
    setGoogleFontsCss(href, css)
    return css
  } catch (error) {
    console.warn(
      `[lumen-cms] Could not inline Google Fonts (${href}):`,
      error instanceof Error ? error.message : error
    )
    return undefined
  }
}
