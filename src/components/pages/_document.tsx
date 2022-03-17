import Document, {
  DocumentContext,
  Head,
  Html,
  Main,
  NextScript
} from 'next/document'
import React from 'react'
import ServerStyleSheets from '@mui/styles/ServerStyleSheets';
import { LmStoryblokService } from '../../utils/initial-props/StoryblokService'
import { SSR_CONFIG } from '@SSR_CONFIG'
import {
  googleFontString,
  processGoogleFonts
} from '../../utils/initial-props/processGoogleFonts'
import { listStoriesDataEnriched } from '../../utils/initial-props/component-data/listStoriesDataEnriched'
import { createPlaceholderImages } from '../../utils/initial-props/component-data/createPlaceholderImages'

// build of storybook fails..
SSR_CONFIG.ssrHooks.pageProps.push(processGoogleFonts)
SSR_CONFIG.ssrHooks.componentData = {
  ...SSR_CONFIG.ssrHooks.componentData,
  list_stories: listStoriesDataEnriched,
  parallax_item: createPlaceholderImages,
  background: createPlaceholderImages,
  image: createPlaceholderImages,
  section_video_bg: createPlaceholderImages,
  player: createPlaceholderImages
}

export default class AppDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const sheets = new ServerStyleSheets()
    const originalRenderPage = ctx.renderPage
    ctx.renderPage = () =>
      originalRenderPage({
        // eslint-disable-next-line react/display-name
        enhanceApp: (App) => (props) => sheets.collect(<App {...props} />)
      })
    const initialProps = await Document.getInitialProps(ctx)

    return {
      ...initialProps,
      // Styles fragment is rendered after the app and page rendering finish.
      styles: [
        ...React.Children.toArray(initialProps.styles),
        sheets.getStyleElement()
      ]
    }
  }

  render() {
    const cacheVersion = LmStoryblokService.getCacheVersion()
    return (
      <Html>
        <Head>
          <style dangerouslySetInnerHTML={{ __html: googleFontString }} />
        </Head>
        <body className="lm-body__root">
          {process.env.NEXT_PUBLIC_GTM_CONTAINER && (
            <noscript>
              <iframe
                title="googletagmanager"
                src={`https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GTM_CONTAINER}`}
                height="0"
                width="0"
                style={{ display: 'none', visibility: 'hidden' }}
              />
            </noscript>
          )}
          <Main />
          <script
            dangerouslySetInnerHTML={{
              __html: `var StoryblokCacheVersion = '${cacheVersion}';`
            }}
          />
          <NextScript />
        </body>
      </Html>
    )
  }
}
