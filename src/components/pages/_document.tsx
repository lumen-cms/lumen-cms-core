import Document, {
  DocumentContext,
  Head,
  Html,
  Main,
  NextScript
} from 'next/document'
import React from 'react'
import { ServerStyleSheets } from '@material-ui/core/styles'
import { LmStoryblokService } from '../../utils/initial-props/StoryblokService'

export default class AppDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const sheets = new ServerStyleSheets()
    const originalRenderPage = ctx.renderPage
    ctx.renderPage = () =>
      originalRenderPage({
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
        <Head />
        <body className="lm-body__root">
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

    // return <LmCoreDocument props={this.props.__NEXT_DATA__.props.pageProps} />
  }
}
