'use client'

import Header from '../components/layout/toolbar/Header'
import DrawerElement from '../components/layout/drawer/DrawerElement'
import { useSettings } from '../components/provider/SettingsPageProvider'
import { LmComponentRender } from '../components/CoreComponents'

export { Header, DrawerElement as ChromeDrawer }

export function ChromeExtras() {
  const settings = useSettings()
  return (
    <>
      {settings.snackbars?.map((content) => (
        <LmComponentRender content={content} key={content._uid} />
      ))}
      {settings.chat_button?.map((content) => (
        <LmComponentRender content={content} key={content._uid} />
      ))}
    </>
  )
}
