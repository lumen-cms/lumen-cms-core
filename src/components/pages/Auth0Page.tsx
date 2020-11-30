import React, { FC, useEffect } from 'react'
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react'
import Error from 'next/error'
import { useRouter } from 'next/router'
import { LmComponentRender } from '@LmComponentRender'
import { LinearProgress } from '@material-ui/core'
import { LmPagesIndexProps } from './DefaultPage'
import { hasAuth0PathCredentials } from '../../utils/auth0/auth0Helpers'
import { AppSeo } from '../layout/AppSeo'
import Layout from '../layout/Layout'
import AppHead from '../layout/AppHead'

function PageContainer({ page }: { page: LmPagesIndexProps['page'] }) {
  const { asPath, replace } = useRouter()
  const { error, isLoading, user } = useAuth0()

  useEffect(() => {
    if (!hasAuth0PathCredentials(asPath, user)) {
      replace('/')
    }
  }, [asPath, user, replace])
  if (error) {
    return <Error statusCode={401} title={error?.message || 'Error occured'} />
  }

  if (isLoading) {
    return (
      <div style={{ minHeight: '30vh' }}>
        <LinearProgress />
      </div>
    )
  }
  return <LmComponentRender content={page} />
}

const PageAuthContainer: FC<{
  page: LmPagesIndexProps['page']
}> = withAuthenticationRequired(PageContainer)

export function Auth0Page(props: LmPagesIndexProps) {
  const { settings, page, error, insideStoryblok } = props

  if (error || !settings || !page) {
    return <Error statusCode={500} title="Error occured or no settings found" />
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
        {insideStoryblok ? (
          <LmComponentRender content={page} />
        ) : (
          <PageAuthContainer page={page} />
        )}
      </Layout>
    </>
  )
}
