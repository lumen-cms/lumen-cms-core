import Document, { DocumentContext } from 'next/document'
import React from 'react'
import { LmCoreDocument } from '../components/CoreDocument'
import { ServerStyleSheets } from '@material-ui/core/styles'

export default class MyDoc extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const sheets = new ServerStyleSheets()
    const originalRenderPage = ctx.renderPage
    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: App => props => sheets.collect(<App {...props} />)
      })
    const initialProps = await Document.getInitialProps(ctx)
    return {
      ...initialProps,
      // Styles fragment is rendered after the app and page rendering finish.
      styles: [...React.Children.toArray(initialProps.styles), sheets.getStyleElement()],
    }
  }

  render() {
    return <LmCoreDocument
      props={this.props.__NEXT_DATA__.props.pageProps}
      isDevelopment={this.props.isDevelopment}
    />
  }
}
