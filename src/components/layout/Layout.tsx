import Header from './toolbar/Header'
import Footer from './Footer'
import React, { FunctionComponent } from 'react'
import AppHead from './AppHead'
import ExternalScripts from '../external-scripts/ExternalScripts'
import { GlobalStoryblok } from '../../typings/generated/components-schema'
import DrawerElement from './drawer/DrawerElement'

export type LayoutComponentProps = {
  // appSetup?: State['appSetup'],
  settings: GlobalStoryblok
}

const Layout: FunctionComponent<LayoutComponentProps> = ({
  children,
  // appSetup,
  settings

}) => {
  return (
    <>
      <AppHead settings={settings} />
      <Header settings={settings} />
      {children}
      <DrawerElement settings={settings} />
      <Footer settings={settings} />
      <ExternalScripts settings={settings} />
    </>
  )
}
Layout.displayName = 'Layout'

// export default memo<{children: ReactNode, settings:GlobalStoryblok}>(Layout)
export default Layout
