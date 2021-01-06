import React, { FunctionComponent } from 'react'
import Error from 'next/error'
import AppSetupProvider from '../provider/AppSetupProvider'
import GlobalTheme from '../global-theme/GlobalTheme'
import AppProvider from '../provider/AppProvider'
import { LmAppProvidersContainer } from './LmAppProvidersContainer'
import { AppContainerProps } from './layoutTypes'
import AppSettingsProvider from '../provider/AppSettingsProvider'
import AppPageProvider from '../provider/AppPageProvider'

export const AppContainer: FunctionComponent<AppContainerProps> = ({
  content,
  children
}) => {
  const { page, settings, error, ...rest } = content
  if (error) {
    return <Error statusCode={500} />
  }
  if (!settings) {
    return <Error statusCode={500} />
  }
  return (
    <AppSettingsProvider settings={settings}>
      <AppProvider content={{ ...rest }}>
        <AppPageProvider page={page || null}>
          <AppSetupProvider>
            <GlobalTheme>
              <LmAppProvidersContainer>{children}</LmAppProvidersContainer>
            </GlobalTheme>
          </AppSetupProvider>
        </AppPageProvider>
      </AppProvider>
    </AppSettingsProvider>
  )
}

AppContainer.displayName = 'AppContainer'
