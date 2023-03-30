import { useEffect } from 'react'
import { AppProps } from 'next/app'
import NProgress from 'nprogress'
import { CONFIG } from '@CONFIG'
import Head from 'next/head'
import { AppPageProps } from '../../typings/app'
import { LmAppContainer } from '../layout/AppContainer'
import { analyticsOnPageChange } from '../../utils/analyticsHelper'
import { EmotionCache } from '@emotion/react'
import { withAppEmotionCache_mui } from '../global-theme/muiCache'

// Client-side cache, shared for the whole session of the user in the browser.

export type LmAppProps = AppProps<AppPageProps> & {
  emotionCache: EmotionCache
}

function MyApp(appProps: LmAppProps) {
  const { Component, pageProps, router } = appProps
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
    router.events.on('routeChangeComplete', handleRouteChange)
    router.events.on('routeChangeStart', handleRouteStart)
    router.events.on('routeChangeError', handleRouteError)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
      router.events.off('routeChangeStart', handleRouteStart)
      router.events.off('routeChangeError', handleRouteError)
    }
  }, [router.events, googleAnaliyticsId, facebookPixelId])

  if (router.isFallback) {
    return <div>loading..</div>
  }

  return (
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
  )
}

export const LmApp = withAppEmotionCache_mui(MyApp)
