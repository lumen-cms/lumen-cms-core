import Error from 'next/error'
import React from 'react'
import { AppPageProps } from '../../typings/app'
import { AppSeo } from '../layout/AppSeo'
import Layout from '../layout/Layout'
import AppHead from '../layout/AppHead'
import { LmPage } from '../page/Page'

export type LmPagesIndexProps = AppPageProps & Record<string, unknown>

export function LmDefaultPage(props: LmPagesIndexProps): JSX.Element {
  const { settings, page, error } = props
  if (error || !settings || !page) {
    return <Error statusCode={500} />
  }
  return (
    <>
      <AppSeo />
      <Layout>
        <LmPage />
      </Layout>
      <AppHead />
    </>
  )
}
