import Document, { Head, Html, Main, NextScript } from 'next/document'
import React from 'react'
import { LmStoryblokService } from '../../utils/initial-props/StoryblokService'
import { SSR_CONFIG } from '@SSR_CONFIG'
import {
  googleFontString,
  processGoogleFonts
} from '../../utils/initial-props/processGoogleFonts'
import createEmotionCache from '../global-theme/muiCache'
import createEmotionServer from '@emotion/server/create-instance'

// build of storybook fails..
SSR_CONFIG.ssrHooks.pageProps.push(processGoogleFonts)
SSR_CONFIG.ssrHooks.componentData = {
  ...SSR_CONFIG.ssrHooks.componentData
}

export default class AppDocument extends Document {
  render() {
    const cacheVersion = LmStoryblokService.getCacheVersion()
    return (
      <Html>
        <Head>
          {googleFontString.css && (
            <style dangerouslySetInnerHTML={{ __html: googleFontString.css }} />
          )}
          <meta name="emotion-insertion-point" content="" />
          {(this.props as any).emotionStyleTags}
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

AppDocument.getInitialProps = async (ctx) => {
  const originalRenderPage = ctx.renderPage
  const cache = createEmotionCache()
  const { extractCriticalToChunks } = createEmotionServer(cache)

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App: any) =>
        function EnhanceApp(props) {
          console.log('server:::', cache)
          return <App emotionCache={cache} {...props} />
        }
    })

  const initialProps = await Document.getInitialProps(ctx)
  // This is important. It prevents Emotion to render invalid HTML.
  // See https://github.com/mui/material-ui/issues/26561#issuecomment-855286153
  const emotionStyles = extractCriticalToChunks(initialProps.html)
  const emotionStyleTags = emotionStyles.styles.map((style) => (
    <style
      data-emotion={`${style.key} ${style.ids.join(' ')}`}
      key={style.key}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: style.css }}
    />
  ))

  return {
    ...initialProps,
    emotionStyleTags
  }
}
