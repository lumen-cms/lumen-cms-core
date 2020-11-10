import Error from 'next/error'
import React from 'react'
import { LmComponentRender } from '@LmComponentRender'
import { AppPageProps } from '../../typings/app'
import { AppSeo } from '../layout/AppSeo'
import Layout from '../layout/Layout'
import AppHead from '../layout/AppHead'

export type LmPagesIndexProps = AppPageProps & Record<string, unknown>

export function LmDefaultPage(props: LmPagesIndexProps): JSX.Element {
  const { settings, page, error } = props
  if (error || !settings || !page) {
    return <Error statusCode={500} />
  }
  return (
    <>
      <AppSeo
        settings={settings}
        page={page}
        previewImage={page?.preview_image}
      />
      <AppHead settings={settings} />
      <Layout settings={settings}>
        <LmComponentRender content={page} />
      </Layout>
    </>
  )
}
