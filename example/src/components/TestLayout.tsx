import React, { FunctionComponent } from 'react'
import AppProvider from 'lumen-cms-core/src/components/provider/AppProvider'
import { AppPageProps } from 'lumen-cms-core/src/typings/app'
import { LmComponentRender } from 'lumen-cms-core'
import AppSetupProvider from 'lumen-cms-core/src/components/provider/AppSetupProvider'
import WindowDimensionsProvider from 'lumen-cms-core/src/components/provider/WindowDimensionsProvider'
import GlobalTheme from 'lumen-cms-core/src/components/global-theme/GlobalTheme'
import CssBaseline from '@material-ui/core/CssBaseline'

const TestLayout: FunctionComponent<{ content: AppPageProps }> = ({ children, content }) => {

  console.log('test layout', content)
  return (
    <AppProvider content={{ ComponentRender: LmComponentRender }}>
      <WindowDimensionsProvider>
        <AppSetupProvider settings={content.settings} page={content.page}>
          <GlobalTheme settings={content.settings} rightDrawerWidth={content.page?.right_drawer_width}>
            <CssBaseline />
            {children}
          </GlobalTheme>
        </AppSetupProvider>
      </WindowDimensionsProvider>
    </AppProvider>
  )
}

export default TestLayout
