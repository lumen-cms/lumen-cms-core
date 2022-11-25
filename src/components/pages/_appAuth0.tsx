import React, { PropsWithChildren, useEffect } from 'react'
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react'
import Router, { useRouter } from 'next/router'
import { LmApp, LmAppProps } from './_app'
import { useUserActions } from '../auth/useAuth'

export { reportWebVitals } from './_appDefault'

const onRedirectCallback = (appState: any) => {
  return Router.replace(appState?.returnTo || '/home')
}

function AppContainer({ children }: PropsWithChildren) {
  const { locales, asPath, locale, push } = useRouter()
  const { user, error } = useAuth0()
  const { setUser } = useUserActions()

  useEffect(() => {
    if (user && (asPath === '/' || asPath === '/home')) {
      const currentUserLocale = (user.lang || user.locale || 'en').substring(
        0,
        2
      )
      if (
        currentUserLocale &&
        locale !== currentUserLocale &&
        locales?.includes(currentUserLocale)
      ) {
        push(asPath, undefined, { locale: currentUserLocale })
      }
    }
  }, [user, locales, asPath, locale, push])

  useEffect(() => {
    if (user) {
      setUser({
        id: user.id,
        firstName: user.given_name,
        lastName: user.family_name,
        ...user
      })
    } else {
      setUser(null)
    }
  }, [setUser, user])

  if (error) {
    console.error(error)
  }
  return <>{children}</>
}

function Auth0Wrap({ children }: PropsWithChildren) {
  return (
    <Auth0Provider
      domain={process.env.NEXT_PUBLIC_AUTH0_DOMAIN as string}
      clientId={process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID as string}
      scope="openid profile email"
      audience={process.env.NEXT_PUBLIC_AUTH0_AUDIENCE}
      cacheLocation="memory"
      useRefreshTokens
      redirectUri={
        (typeof window !== 'undefined' && window.location.origin) as string
      }
      onRedirectCallback={onRedirectCallback}
    >
      <AppContainer>{children}</AppContainer>
    </Auth0Provider>
  )
}

export function Auth0App(props: LmAppProps) {
  return (
    <Auth0Wrap>
      <LmApp {...props} />
    </Auth0Wrap>
  )
}
