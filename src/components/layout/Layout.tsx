import React, { FunctionComponent } from 'react'
import Header from './toolbar/Header'
import Footer from './Footer'
import AppHead from './AppHead'
import {
  ChatTawktoStoryblok,
  GlobalStoryblok
} from '../../typings/generated/components-schema'
import DrawerElement from './drawer/DrawerElement'
import { LmComponentRender } from '../CoreComponents'

export type LayoutComponentProps = {
  // appSetup?: State['appSetup'],
  settings: GlobalStoryblok
}

const Layout: FunctionComponent<LayoutComponentProps> = ({
  children,
  // appSetup,
  settings
}) => {
  // legacy code for old projects.. remove after all tawkto are integrated
  if (settings.tawkto) {
    settings.chat_button = [
      {
        _uid: 'chat button',
        component: 'chat_tawkto',
        account: settings.tawkto
      } as ChatTawktoStoryblok
    ]
  }
  return (
    <>
      <AppHead settings={settings} />
      <Header settings={settings} />
      {children}
      <DrawerElement settings={settings} />
      <Footer settings={settings} />
      {settings.snackbars?.map((blok) => (
        <LmComponentRender content={blok} key={blok._uid} />
      ))}
      {settings.chat_button?.map((blok) => (
        <LmComponentRender content={blok} key={blok._uid} />
      ))}
    </>
  )
}
Layout.displayName = 'Layout'

// export default memo<{children: ReactNode, settings:GlobalStoryblok}>(Layout)
export default Layout
