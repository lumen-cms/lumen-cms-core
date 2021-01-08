import Error from 'next/error'
import React, { memo } from 'react'
import { AppPageProps } from '../../typings/app'
import { AppSeo } from '../layout/AppSeo'
import Layout from '../layout/Layout'
import AppHead from '../layout/AppHead'
import { LmPage } from '../page/Page'
import { settingsSelector, useAppStore } from '../../utils/state/appState'

export type LmPagesIndexProps = AppPageProps & Record<string, unknown>

const Test = memo(() => {
  const store = useAppStore(settingsSelector)
  console.log('im test hings')
  // const ctx = useAppSettings()
  console.log(store)
  return <div />
})
Test.displayName = 'TestComponent'

export function LmDefaultPage(props: LmPagesIndexProps): JSX.Element {
  const { settings, page, error } = props
  if (error || !settings || !page) {
    return <Error statusCode={500} />
  }
  return (
    <>
      <Test />
      <AppSeo />
      <AppHead />
      <Layout>
        <LmPage />
      </Layout>
    </>
  )
}
