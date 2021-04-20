import React, { useEffect } from 'react'
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react'
import Router, { useRouter } from 'next/router'
import CircularProgress from '@material-ui/core/CircularProgress'
import Backdrop from '@material-ui/core/Backdrop'
import { LmApp, LmAppProps } from './_app'

export { reportWebVitals } from './_appDefault'

const onRedirectCallback = (appState: any) => {
  return Router.replace(appState?.returnTo || '/home')
}

function AppContainer(props: LmAppProps) {
  const { locales, asPath, locale, push } = useRouter()
  const { user, error, isLoading } = useAuth0()

  useEffect(() => {
    if (user && (asPath === '/' || asPath === '/home')) {
      const currentUserLocale = (user.lang || user.locale || 'en').substr(0, 2)
      if (
        currentUserLocale &&
        locale !== currentUserLocale &&
        locales?.includes(currentUserLocale)
      ) {
        push(asPath, undefined, { locale: currentUserLocale })
      }
    }
  }, [user, locales, asPath, locale, push])

  const newProps = {
    ...props,
    pageProps: {
      ...props.pageProps,
      user
    }
  }
  if (error) {
    console.error(error)
  }
  return (
    <>
      {isLoading && (
        <Backdrop open>
          <CircularProgress color="primary" />
        </Backdrop>
      )}
      <LmApp {...newProps} />
    </>
  )
}

export function Auth0App(props: LmAppProps) {
  if (props.router?.isPreview) {
    return <LmApp {...props} />
  }
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
      <AppContainer {...props} />
    </Auth0Provider>
  )
}
