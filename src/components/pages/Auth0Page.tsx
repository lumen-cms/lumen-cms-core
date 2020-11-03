import React, { useEffect } from 'react'
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react'
import Error from 'next/error'
import { useRouter } from 'next/router'
import { LmComponentRender } from '@LmComponentRender'
import { LmPagesIndexProps } from './DefaultPage'
import { hasAuth0PathCredentials } from '../../utils/auth0/auth0Helpers'
import { AppSeo } from '../layout/AppSeo'
import Layout from '../layout/Layout'
import { NotFound } from './404'

function MyPage(props: LmPagesIndexProps) {
  const { settings, page, locale } = props
  const { asPath, replace } = useRouter()
  const { error, isLoading, user } = useAuth0()

  useEffect(() => {
    if (!hasAuth0PathCredentials(asPath, user)) {
      replace('/')
    }
  }, [asPath, user, replace])

  if (error || props.error || !settings) {
    return (
      <Error
        statusCode={500}
        title={error?.message || 'Error occured or no settings found'}
      />
    )
  }

  return (
    <>
      <AppSeo
        settings={settings}
        page={page}
        previewImage={page?.preview_image}
      />
      <Layout settings={settings}>
        {isLoading ? (
          <h3>loading...</h3>
        ) : page ? (
          <LmComponentRender content={page} />
        ) : (
          <NotFound locale={locale} statusCode={404} />
        )}
      </Layout>
    </>
  )
}

export const Auth0Page = withAuthenticationRequired(MyPage)
