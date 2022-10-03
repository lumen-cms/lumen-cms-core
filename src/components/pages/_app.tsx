import { useEffect, useMemo } from 'react'
import { AppProps } from 'next/app'
import NProgress from 'nprogress'
import { CONFIG } from '@CONFIG'
import Head from 'next/head'
import { AppPageProps } from '../../typings/app'
import { LmAppContainer } from '../layout/AppContainer'
import { analyticsOnPageChange } from '../../utils/analyticsHelper'
import { CacheProvider } from '@emotion/react'
import createEmotionCache from '../global-theme/muiCache'

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache()

export type LmAppProps = AppProps<AppPageProps>

export function LmApp(appProps: LmAppProps) {
  const {
    Component,
    pageProps,
    router: { events, isFallback }
  } = appProps
  const { settings, emotionCache = clientSideEmotionCache } =
    pageProps as AppPageProps

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

  const Child = useMemo(
    () => (
      <LmAppContainer content={pageProps}>
        <Head>
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
            key="viewport"
          />
          <meta name="format-detection" content="telephone=no" />
        </Head>
        <Component {...pageProps} />
      </LmAppContainer>
    ),
    [pageProps, Component]
  )
  if (isFallback) {
    return <div>loading..</div>
  }

  return <CacheProvider value={emotionCache}>{Child}</CacheProvider>
}
