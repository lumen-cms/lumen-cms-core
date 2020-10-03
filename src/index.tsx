import { CONFIG, LmCoreComponents } from '@CONFIG'
import { LmComponentRender } from '@LmComponentRender'

export { LmDefaultApp, reportWebVitals } from './components/pages/_appDefault'

export { LmPagesIndex as LmDefaultPage } from './components/pages/PagesIndex'
export { LmApp } from './components/pages/_app'
export { LmPage } from './components/page/Page'
export { default as LmAppProvider } from './components/provider/AppProvider'
export { AppContainer as LmAppContainer } from './components/layout/AppContainer'
export { useAppContext } from './components/provider/context/AppContext'
export { default as LmAppSetupProvider } from './components/provider/AppSetupProvider'
export { useAppSetup } from './components/provider/context/AppSetupContext'
export { hasFacebookPixel, hasGtag } from './utils/analyticsHelper'
export { CONFIG }

export { LmComponentRender, LmCoreComponents }
