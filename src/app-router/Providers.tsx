'use client'

import './registry'
import { useEffect, type PropsWithChildren } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Auth0Provider, useAuth0, type AppState } from '@auth0/auth0-react'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter'
import AppProvider from '../components/provider/AppProvider'
import SettingsPageProvider from '../components/provider/SettingsPageProvider'
import AppSetupProvider from '../components/provider/AppSetupProvider'
import GlobalTheme from '../components/global-theme/GlobalTheme'
import { SearchPaletteProvider } from '../components/list-widget/SearchPaletteProvider'
import { useUserActions, type AuthUser } from '../components/auth/useAuth'
import { useAppContext } from '../components/provider/context/AppContext'
import { useSettings } from '../components/provider/SettingsPageProvider'
import { analyticsOnPageChange } from '../utils/analyticsHelper'
import { RouteProgress } from '../utils/routeProgress'
import { CONFIG } from '../utils/config'
import type { AppPageProps } from '../typings/app'
import { StaticTextStyles } from './StaticTextStyles'

function Session({ children }: PropsWithChildren) {
  const { user, error } = useAuth0<AuthUser>()
  const { setUser } = useUserActions()
  const { locale, locales } = useAppContext()
  const pathname = usePathname()
  const router = useRouter()
  useEffect(() => {
    setUser(
      user
        ? {
            id: user.id,
            firstName: user.given_name,
            lastName: user.family_name,
            ...user
          }
        : null
    )
  }, [user, setUser])
  useEffect(() => {
    if (user && (pathname === '/' || pathname === '/home')) {
      const language = (user.lang || user.locale || 'en').substring(0, 2)
      if (language !== locale && locales?.includes(language))
        router.push(`/${language}`)
    }
  }, [user, pathname, locale, locales, router])
  useEffect(() => {
    if (error) console.error(error)
  }, [error])
  return children
}

function NavigationEffects() {
  const pathname = usePathname()
  const settings = useSettings()
  useEffect(() => {
    RouteProgress.done()
    analyticsOnPageChange({
      googleAnaliyticsId: CONFIG.GA || settings.setup_google_analytics,
      facebookPixelId: settings.setup_facebook_pixel,
      url: pathname
    })
  }, [pathname, settings.setup_google_analytics, settings.setup_facebook_pixel])
  return null
}

export function Providers({
  content,
  children
}: PropsWithChildren<{ content: AppPageProps }>) {
  const { page, settings, ...context } = content
  const router = useRouter()
  if (!settings) throw new Error('App Router pilot requires site settings')
  function onRedirectCallback(state?: AppState) {
    router.replace(state?.returnTo || '/home')
  }
  return (
    <AppRouterCacheProvider options={{ key: 'css' }}>
      <AppProvider content={context}>
        <Auth0Provider
          domain={process.env.NEXT_PUBLIC_AUTH0_DOMAIN as string}
          clientId={process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID as string}
          authorizationParams={{
            scope: 'openid profile email',
            audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
            redirect_uri:
              typeof window !== 'undefined' ? window.location.origin : undefined
          }}
          useRefreshTokens
          onRedirectCallback={onRedirectCallback}
        >
          <Session>
            <SettingsPageProvider page={page} settings={settings}>
              <AppSetupProvider>
                <GlobalTheme>
                  <StaticTextStyles />
                  <SearchPaletteProvider>
                    <NavigationEffects />
                    {children}
                  </SearchPaletteProvider>
                </GlobalTheme>
              </AppSetupProvider>
            </SettingsPageProvider>
          </Session>
        </Auth0Provider>
      </AppProvider>
    </AppRouterCacheProvider>
  )
}
