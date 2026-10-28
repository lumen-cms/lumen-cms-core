import { Head, Html, Main, NextScript } from 'next/document'
import type { DocumentContext, DocumentProps } from 'next/document'
import createCache from '@emotion/cache'
import { documentGetInitialProps } from '@mui/material-nextjs/v16-pagesRouter'
import { SSR_CONFIG } from '@SSR_CONFIG'
import { DocumentGoogleFonts } from './DocumentGoogleFonts'
import type { AppPageProps } from '../../typings/app'

// build of storybook fails..
SSR_CONFIG.ssrHooks.componentData = {
  ...SSR_CONFIG.ssrHooks.componentData
}

function AppDocument(props: DocumentProps) {
  const pageProps = props.__NEXT_DATA__?.props?.pageProps as
    | AppPageProps
    | undefined
  return (
    <Html>
      <Head>
        <DocumentGoogleFonts
          settings={pageProps?.settings}
          nonce={props.nonce}
        />
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
        <NextScript />
      </body>
    </Html>
  )
}

AppDocument.getInitialProps = async (ctx: DocumentContext) => {
  const { emotionStyleTags, ...initialProps } = await documentGetInitialProps(
    ctx,
    { emotionCache: createCache({ key: 'css' }) }
  )
  return {
    ...initialProps,
    // Next renders `styles` after its stylesheet links, so emotion keeps
    // precedence over consumer CSS. DocumentHeadTags is not used because React
    // hoists its insertion-point <meta> to the top of <head>.
    styles: (
      <>
        {initialProps.styles}
        {emotionStyleTags}
      </>
    )
  }
}

export default AppDocument
