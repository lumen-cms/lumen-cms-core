import React from 'react'
import { AppProps } from 'next/app'
import { AppPageProps } from '../../typings/app'
import { AppContainer } from '../layout/AppContainer'
import { getGlobalState, setGlobalState } from '../../utils/state/state'
import hasWebpSupport from '../../utils/detectWebpSupport'
import { useStoryblokComposer } from '../../utils/hooks/useStoryblokComposer'

export type LmAppProps = AppProps<AppPageProps>

export function LmApp({ Component, pageProps, router }: LmAppProps) {
  const { locale, settings, page } = pageProps as AppPageProps
  const [statePage, stateSettings] = useStoryblokComposer({ settings, page })

  if (locale && getGlobalState('locale') !== locale) {
    setGlobalState('locale', locale)
  }
  if (typeof getGlobalState('hasWebpSupport') === 'undefined') {
    hasWebpSupport().then((has) => setGlobalState('hasWebpSupport', has))
  }

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
