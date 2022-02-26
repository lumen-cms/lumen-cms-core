import { useEffect, useMemo } from 'react'
import { AppProps } from 'next/app'
import NProgress from 'nprogress'
import { CONFIG } from '@CONFIG'
import Head from 'next/head'
import { AppPageProps } from '../../typings/app'
import { LmAppContainer } from '../layout/AppContainer'
import { analyticsOnPageChange } from '../../utils/analyticsHelper'

export type LmAppProps = AppProps<AppPageProps>

export function LmApp(appProps: LmAppProps) {
  const {
    Component,
    pageProps,
    router: { events, isFallback }
  } = appProps
  const { settings } = pageProps as AppPageProps

  const googleAnaliyticsId = CONFIG.GA || settings?.setup_google_analytics
  const facebookPixelId = settings?.setup_facebook_pixel

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      NProgress.done()
      analyticsOnPageChange({ googleAnaliyticsId, url, facebookPixelId })
    }
    const handleRouteStart = () => {
      NProgress.start()
    }
    const handleRouteError = () => {
      NProgress.done()
    }
    events.on('routeChangeComplete', handleRouteChange)
    events.on('routeChangeStart', handleRouteStart)
    events.on('routeChangeError', handleRouteError)
    return () => {
      events.off('routeChangeComplete', handleRouteChange)
      events.off('routeChangeStart', handleRouteStart)
      events.off('routeChangeError', handleRouteError)
    }
  }, [events, googleAnaliyticsId, facebookPixelId])

  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles && jssStyles.parentElement) {
      jssStyles.parentElement.removeChild(jssStyles)
    }
  }, [])

  return useMemo(
    () =>
      isFallback ? (
        <div>loading..</div>
      ) : (
        <LmAppContainer content={pageProps}>
          <Head>
            <meta
              name="viewport"
              content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
              key="viewport"
            />
            <meta name="format-detection" content="telephone=no">
          </Head>
          <Component {...pageProps} />
        </LmAppContainer>
      ),
    [pageProps, isFallback]
  )
}
