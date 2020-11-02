import React, { useEffect } from 'react'
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react'
import Error from 'next/error'
import { useRouter } from 'next/router'
import { LmDefaultPage, LmPagesIndexProps } from './DefaultPage'
import { hasAuth0PathCredentials } from '../../utils/auth0/auth0Helpers'

function MyPage(props: LmPagesIndexProps) {
  const { asPath, replace } = useRouter()
  const { error, isLoading, user } = useAuth0()

  useEffect(() => {}, [])

  useEffect(() => {
    if (!hasAuth0PathCredentials(asPath, user)) {
      replace('/')
    }
  }, [asPath, user, replace])
  if (isLoading) {
    return <h3>loading...</h3>
  }
  if (error) {
    return <Error statusCode={500} title={error.message} />
  }

  return <LmDefaultPage {...props} />
}

export const Auth0Page = withAuthenticationRequired(MyPage)
