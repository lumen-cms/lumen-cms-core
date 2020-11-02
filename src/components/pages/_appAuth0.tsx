import React from 'react'
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react'
import Router from 'next/router'
import { LmApp, LmAppProps } from './_app'

export { reportWebVitals } from './_appDefault'

const onRedirectCallback = (appState: any) => {
  console.log('inside of redirect callbck')
  Router.replace(appState?.returnTo || '/')
}

function AppContainer(props: LmAppProps) {
  const { user } = useAuth0()
  const newProps = {
    ...props,
    pageProps: {
      ...props.pageProps,
      user
    }
  }
  return <LmApp {...newProps} />
}

export function Auth0App(props: LmAppProps) {
  console.log('inside of app')
  return (
    <Auth0Provider
      domain={process.env.NEXT_PUBLIC_AUTH0_DOMAIN as string}
      clientId={process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID as string}
      scope="openid profile email"
      redirectUri={
        (typeof window !== 'undefined' && window.location.origin) as string
      }
      onRedirectCallback={onRedirectCallback}
    >
      <AppContainer {...props} />
    </Auth0Provider>
  )
}
