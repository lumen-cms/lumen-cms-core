import { useState } from 'react'
import {
  DrawerContentRender,
  type DrawerContent
} from './CollapsibleListSection'
import { useSettings } from '../../provider/SettingsPageProvider'
import { useAppContext } from '../../provider/context/AppContext'

import { getUidsOfSlug } from './getUidsOfSlug'

export function DrawerContentList(): React.JSX.Element {
  const settings = useSettings()
  const { slug } = useAppContext()
  const activeRoutePath = slug
  const hasDrawer = settings.drawer_body?.length
  let childs: DrawerContent[] =
    (hasDrawer ? settings.drawer_body : settings.toolbar) || []

  if (!hasDrawer && settings.multi_toolbar?.length) {
    childs = []
    settings.multi_toolbar.forEach((row) => {
      row.body?.forEach((section) => {
        section.body?.forEach((item) => {
          if (
            ['toolbar_search', 'button', 'nav_menu'].includes(item.component)
          ) {
            childs.push(
              item as Extract<
                typeof item,
                { component: 'toolbar_search' | 'button' | 'nav_menu' }
              >
            )
          }
        })
      })
    })
  }
  const [openedPath] = useState<string[]>(() =>
    getUidsOfSlug(childs, activeRoutePath)
  )

  return (
    <>
      {
        // @ts-ignore
        childs?.map((props) => (
          <DrawerContentRender
            content={props}
            key={props._uid}
            openedPath={openedPath}
          />
        ))
      }
    </>
  )
}
