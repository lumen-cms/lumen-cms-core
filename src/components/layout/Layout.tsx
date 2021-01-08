import React, { FC } from 'react'
import { LmComponentRender } from '@LmComponentRender'
import Header from './toolbar/Header'
import Footer from './Footer'
import { ChatTawktoStoryblok } from '../../typings/generated/components-schema'
import DrawerElement from './drawer/DrawerElement'
import { settingsSelector, useAppStore } from '../../utils/state/appState'

const Layout: FC = ({ children }) => {
  const settings = useAppStore(settingsSelector)

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
      <Header />
      {children}
      <DrawerElement />
      <Footer />
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
