import React, { FunctionComponent, useEffect } from 'react'
import Error from 'next/error'
import AppSetupProvider from '../provider/AppSetupProvider'
import GlobalTheme from '../global-theme/GlobalTheme'
import AppProvider from '../provider/AppProvider'
import { LmAppProvidersContainer } from './LmAppProvidersContainer'
import { AppContainerProps } from './layoutTypes'
import AppSettingsProvider from '../provider/AppSettingsProvider'
import AppPageProvider from '../provider/AppPageProvider'
import { useAppStore } from '../../utils/state/appState'

export const AppContainer: FunctionComponent<AppContainerProps> = ({
  content,
  children
}) => {
  const set = useAppStore.getState().settings
  const pag = useAppStore.getState().page
  const { page, settings, error, ...rest } = content
  settings && set?.uuid !== settings?.uuid && useAppStore.setState({ settings })
  page && !pag.uuid && useAppStore.setState({ page })
  useEffect(() => {
    if (page && pag.uuid !== page?.uuid) {
      useAppStore.setState({ page })
    } else if (!page && pag.uuid) {
      useAppStore.setState({ page: {} }) // reset if page is not exist
    }
  }, [pag.uuid, page])
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
