import React, { FC, PropsWithChildren, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react'
import { hasAuth0PathCredentials } from '../../utils/auth0/auth0Helpers'
import Error from 'next/error'
import { LinearProgress } from '@mui/material'

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

const Auth0PageContainer: FC<React.PropsWithChildren<unknown>> =
  withAuthenticationRequired(PageContainer)
export default Auth0PageContainer
