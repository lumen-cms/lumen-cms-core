import React, { FunctionComponent } from 'react'
import Error from 'next/error'
import AppSetupProvider from '../provider/AppSetupProvider'
import GlobalTheme from '../global-theme/GlobalTheme'
import AppProvider from '../provider/AppProvider'
import { LmAppProvidersContainer } from './LmAppProvidersContainer'
import { AppContainerProps } from './layoutTypes'
import { SettingsPageProvider } from '../provider/SettingsPageProvider'

export const LmAppContainer: FunctionComponent<AppContainerProps> = ({
  content,
  children
}) => {
  // const set = useAppStore.getState().settings
  // const pag = useAppStore.getState().page
  const { page, settings, error, ...rest } = content

  if (error) {
    return <Error statusCode={500} />
  }
  if (!settings) {
    return <Error statusCode={500} />
  }

  return (
    <AppProvider content={{ ...rest }}>
      <SettingsPageProvider settings={settings} page={page}>
        <AppSetupProvider>
          <GlobalTheme>
            <LmAppProvidersContainer>{children}</LmAppProvidersContainer>
          </GlobalTheme>
        </AppSetupProvider>
      </SettingsPageProvider>
    </AppProvider>
  )
}

LmAppContainer.displayName = 'AppContainer'
