import React, { FunctionComponent } from 'react'
import Error from 'next/error'
import { AppPageProps, LinkRenderProps } from '../../typings/app'
import AppSetupProvider from '../provider/AppSetupProvider'
import GlobalTheme from '../global-theme/GlobalTheme'
import AppProvider from '../provider/AppProvider'

type AppContainerProps = {
  content: AppPageProps
  LinkRender: LinkRenderProps
}

export const AppContainer: FunctionComponent<AppContainerProps> = ({
  content,
  LinkRender,
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
    <AppProvider content={{ ...rest, LinkRender }}>
      <AppSetupProvider settings={settings} page={page}>
        <GlobalTheme
          settings={settings}
          rightDrawerWidth={page?.right_drawer_width}
        >
          {children}
        </GlobalTheme>
      </AppSetupProvider>
    </AppProvider>
  )
}

AppContainer.displayName = 'AppContainer'
