import Document, { DocumentContext } from 'next/document'
import React from 'react'
import { ServerStyleSheets } from '@material-ui/core/styles'
import { LmCoreDocument } from '../components/CoreDocument'

import { getShopifyPageProps } from '../components/ecommerce/shopify/lib/getShopifyPageProps'
import { SSR_CONFIG } from '../utils/initial-props/ssrConfig'

SSR_CONFIG.ssrHooks.pageProps.push(getShopifyPageProps)

export default class MyDoc extends Document {
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
    return <LmCoreDocument props={this.props.__NEXT_DATA__.props.pageProps} />
  }
}
