import React from 'react'
import Error from 'next/error'
import { LmPagesIndexProps } from './DefaultPage'
import { AppSeo } from '../layout/AppSeo'
import Layout from '../layout/Layout'
import AppHead from '../layout/AppHead'
import { LmPage } from '../page/Page'
import dynamic from 'next/dynamic'

const PageAuthContainer = dynamic(() => import('./Auth0PageContainer'), {
  ssr: false
})

export function Auth0Page(props: LmPagesIndexProps) {
  const { settings, page, error, needAuth } = props
  // const { asPath, query, locale, defaultLocale } = useRouter()
  // const needAuth = getAuth0RoleOnPath(asPath, { locale, defaultLocale })
  if (error || !settings || !page) {
    return <Error statusCode={500} title="Error occured or no settings found" />
  }

  return (
    <>
      <AppSeo />
      <AppHead />
      <Layout>
        {!needAuth ? (
          <LmPage />
        ) : (
          <PageAuthContainer>
            <LmPage />
          </PageAuthContainer>
        )}
      </Layout>
    </>
  )
}
