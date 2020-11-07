import React, { FunctionComponent } from 'react'
import { LmComponentRender } from '@LmComponentRender'
import Header from './toolbar/Header'
import Footer from './Footer'
import {
  ChatTawktoStoryblok,
  GlobalStoryblok
} from '../../typings/generated/components-schema'
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
