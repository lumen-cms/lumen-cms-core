import React, { FunctionComponent } from 'react'
import { AppPageProps, ComponentRenderProps, LinkRenderProps } from '../../typings/app'
import WindowDimensionsProvider from '../provider/WindowDimensionsProvider'
import AppSetupProvider from '../provider/AppSetupProvider'
import GlobalTheme from '../global-theme/GlobalTheme'
import CssBaseline from '@material-ui/core/CssBaseline'
import AppProvider from '../provider/AppProvider'
import Error from 'next/error'

type AppContainerProps = {
  content: AppPageProps
  ComponentRender: ComponentRenderProps
  LinkRender: LinkRenderProps
}

export const AppContainer: FunctionComponent<AppContainerProps> = (
  { content, ComponentRender, LinkRender, children }
) => {
  const { page, settings, error, ...rest } = content
  if (error) {
    return <Error statusCode={500} />
  }
  if (!settings) {
    return <Error statusCode={500} />
  }
  return (
    <AppProvider content={{ ...rest, ComponentRender, LinkRender }}>
      <WindowDimensionsProvider>
        <AppSetupProvider settings={settings} page={page}>
          <GlobalTheme settings={settings} rightDrawerWidth={page?.right_drawer_width}>
            <CssBaseline />
            {children}
          </GlobalTheme>
        </AppSetupProvider>
      </WindowDimensionsProvider>
    </AppProvider>
  )
}

AppContainer.displayName = 'AppContainer'
