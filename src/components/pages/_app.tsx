import React, { useEffect, useState } from 'react'
import { AppProps } from 'next/app'
import { AppPageProps } from '../../typings/app'
import { AppContainer } from '../layout/AppContainer'
import { getGlobalState, setGlobalState } from '../../utils/state/state'
import hasWebpSupport from '../../utils/detectWebpSupport'
import StoryblokService from '../../utils/StoryblokService'

export type LmAppProps = AppProps<AppPageProps>

export function LmApp({
  Component,
  pageProps,
  router
}: LmAppProps) {
  const { locale, settings, page } = pageProps as AppPageProps

  const settingsUid = settings?.uuid
  const pageUid = page?.uuid

  const [statePage, setPage] = useState<AppPageProps['page']>(page)
  const [stateSettings, setSettings] = useState<AppPageProps['settings']>(
    settings
  )

  useEffect(() => {
    if (pageUid !== statePage?.uuid) {
      // console.log('different page', pageUid, statePage.uuid)
      setPage(page)
    }
  }, [pageUid, statePage, page])

  useEffect(() => {
    if (settingsUid !== stateSettings?.uuid) {
      // console.log('different settings', settingsUid, stateSettings.uuid)
      setSettings(settings)
    }
  }, [settingsUid, stateSettings, settings])

  useEffect(() => {
    StoryblokService.initEditor({ page, setPage, settings, setSettings })
    /* eslint-disable-next-line */
  }, [])

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
    <AppContainer
      content={appProps}
    >
      <Component {...appProps} />
    </AppContainer>
  )
}
