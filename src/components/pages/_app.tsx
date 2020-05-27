import React from 'react'
import { AppProps } from 'next/app'
import { AppPageProps, ComponentRenderProps } from '../../typings/app'
import { AppContainer } from '../layout/AppContainer'
import { useStoryblok } from '../../utils/hooks/useStoryblok'
import { getGlobalState, setGlobalState } from '../../utils/state/state'
import hasWebpSupport from '../../utils/detectWebpSupport'


export type LmAppProps = AppProps<AppPageProps> & {
  ComponentRender: ComponentRenderProps
}

export function LmApp({ Component, pageProps, ComponentRender, router }: LmAppProps) {
  const { locale, settings, page } = pageProps as AppPageProps
  const { stateSettings, statePage } = useStoryblok({ settings, page })
  if (locale && getGlobalState('locale') !== locale) {
    setGlobalState('locale', locale)
  }
  if (typeof getGlobalState('hasWebpSupport') === 'undefined') {
    hasWebpSupport()
      .then((has) => setGlobalState('hasWebpSupport', has))
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
    <AppContainer content={appProps} ComponentRender={ComponentRender}>
      <Component {...appProps} ComponentRender={ComponentRender} />
    </AppContainer>
  )
}
