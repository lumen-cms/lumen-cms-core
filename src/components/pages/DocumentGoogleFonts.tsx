import { GlobalStoryblok } from '../../typings/generated/components-schema'
import { getFontBasedOnSetting } from '../../utils/parseFont'
import { getGoogleFontsCss } from '../../utils/initial-props/googleFontsCache'

export const GOOGLE_FONTS_ATTRIBUTE = 'data-lm-google-fonts'

export function DocumentGoogleFonts({
  settings,
  nonce
}: {
  settings?: Partial<GlobalStoryblok> | null
  nonce?: string
}): React.JSX.Element | null {
  if (process.env.NEXT_PUBLIC_DISABLE_GOOGLE_FONTS || !settings) {
    return null
  }
  const href = getFontBasedOnSetting(settings)
  const css = getGoogleFontsCss(href)
  const attributes = { [GOOGLE_FONTS_ATTRIBUTE]: href }

  return (
    <>
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      {css ? (
        <style
          {...attributes}
          nonce={nonce}
          dangerouslySetInnerHTML={{ __html: css }}
        />
      ) : (
        <>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link {...attributes} rel="stylesheet" href={href} />
        </>
      )}
    </>
  )
}
