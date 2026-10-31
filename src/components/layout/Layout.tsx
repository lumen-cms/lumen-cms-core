import React, { FC } from 'react'
import { LmComponentRender } from '../CoreComponents'
import Header from './toolbar/Header'
import Footer from './Footer'

import DrawerElement from './drawer/DrawerElement'
import { useSettings } from '../provider/SettingsPageProvider'

const Layout: FC<React.PropsWithChildren<unknown>> = ({ children }) => {
  const settings = useSettings()
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

export default Layout
