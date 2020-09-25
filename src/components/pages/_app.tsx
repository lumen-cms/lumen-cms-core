import React, { useEffect } from 'react'
import { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import NProgress from 'nprogress'
import { AppPageProps } from '../../typings/app'
import { AppContainer } from '../layout/AppContainer'
import { getGlobalState, setGlobalState } from '../../utils/state/state'
import hasWebpSupport from '../../utils/detectWebpSupport'
import { useStoryblokComposer } from '../../utils/hooks/useStoryblokComposer'
import { CONFIG } from '../../utils/config'
import { analyticsOnPageChange } from '../../utils/analyticsHelper'

export type LmAppProps = AppProps<AppPageProps>

export function LmApp({ Component, pageProps }: LmAppProps) {
  const { locale, settings, page } = pageProps as AppPageProps
  const router = useRouter()
  const [statePage, stateSettings] = useStoryblokComposer({ settings, page })
  if (locale && getGlobalState('locale') !== locale) {
    setGlobalState('locale', locale)
  }
  if (typeof getGlobalState('hasWebpSupport') === 'undefined') {
    hasWebpSupport().then((has) => setGlobalState('hasWebpSupport', has))
  }
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

  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles && jssStyles.parentElement) {
      jssStyles.parentElement.removeChild(jssStyles)
    }
  }, [])

  if (router.isFallback) {
    return <div>loading...</div>
  }

  const appProps = {
    ...pageProps,
    page: statePage,
    settings: stateSettings
  }
  return (
    <AppContainer content={appProps}>
      <Component {...appProps} />
    </AppContainer>
  )
}
