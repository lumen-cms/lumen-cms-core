import Error from 'next/error'
import React from 'react'
import { LmComponentRender } from '@LmComponentRender'
import { AppPageProps } from '../../typings/app'
import { AppSeo } from '../layout/AppSeo'
import Layout from '../layout/Layout'
import { NotFound } from './404'

export type LmPagesIndexProps = AppPageProps & Record<string, unknown>

export function LmDefaultPage(props: LmPagesIndexProps): JSX.Element {
  const { settings, page, error, locale } = props

  if (error || !settings) {
    return <Error statusCode={500} />
  }
  return (
    <>
      <AppSeo
        settings={settings}
        page={page}
        previewImage={page?.preview_image}
      />
      <Layout settings={settings}>
        {page ? (
          <LmComponentRender content={page} />
        ) : (
          <NotFound locale={locale} statusCode={404} />
        )}
      </Layout>
    </>
  )
}
