import React, { FC, PropsWithChildren, useEffect } from 'react'
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react'
import Error from 'next/error'
import { useRouter } from 'next/router'
import { LinearProgress } from '@mui/material'
import { LmPagesIndexProps } from './DefaultPage'
import { hasAuth0PathCredentials } from '../../utils/auth0/auth0Helpers'
import { AppSeo } from '../layout/AppSeo'
import Layout from '../layout/Layout'
import AppHead from '../layout/AppHead'
import { LmPage } from '../page/Page'

function PageContainer({ children }: PropsWithChildren) {
  const { asPath, replace, locale, defaultLocale, isReady } = useRouter()
  const { error, isLoading, user } = useAuth0()
  useEffect(() => {
    if (
      user &&
      !hasAuth0PathCredentials(asPath, user, {
        locale,
        defaultLocale
      })
    ) {
      replace('/')
    }
  }, [asPath, user, replace, locale, defaultLocale])
  if (error) {
    return <Error statusCode={401} title={error?.message || 'Error occured'} />
  }

  if (isLoading || !isReady) {
    return (
      <div style={{ minHeight: '30vh' }}>
        <LinearProgress />
      </div>
    )
  }
  return <>{children}</>
}

const PageAuthContainer: FC<React.PropsWithChildren<unknown>> =
  withAuthenticationRequired(PageContainer)

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
