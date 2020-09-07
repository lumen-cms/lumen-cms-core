import React, { FunctionComponent } from 'react'
import Error from 'next/error'
import AppSetupProvider from '../provider/AppSetupProvider'
import GlobalTheme from '../global-theme/GlobalTheme'
import AppProvider from '../provider/AppProvider'
import { LmAppProvidersContainer } from './LmAppProvidersContainer'
import { AppContainerProps } from './layoutTypes'

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
    <AppProvider content={{ ...rest }}>
      <AppSetupProvider settings={settings} page={page}>
        <GlobalTheme
          settings={settings}
          rightDrawerWidth={page?.right_drawer_width}
        >
          <LmAppProvidersContainer settings={settings}>{children}</LmAppProvidersContainer>
        </GlobalTheme>
      </AppSetupProvider>
    </AppProvider>
  )
}

AppContainer.displayName = 'AppContainer'
