import React from 'react'
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react'
import Error from 'next/error'
import { LmDefaultPage, LmPagesIndexProps } from './DefaultPage'

function MyPage(props: LmPagesIndexProps) {
  const { error, isLoading } = useAuth0()

  if (isLoading) {
    return <h3>loading...</h3>
  }
  if (error) {
    return <Error statusCode={500} title={error.message} />
  }
  return <LmDefaultPage {...props} />
}

export const Auth0Page = withAuthenticationRequired(MyPage)
