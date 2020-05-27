import React from 'react'
import { GlobalStoryblok, ToolbarRowStoryblok } from '../../../typings/generated/components-schema'
import { useAppSetup } from '../../provider/AppSetupProvider'
import { DrawerContentRender } from './CollapsibleListSection'

type DrawerContentListProps = { content: Partial<GlobalStoryblok> }

export function DrawerContentList({ content }: DrawerContentListProps): JSX.Element {
  const appSetup = useAppSetup()
  let childs = (appSetup.hasDrawer ? content.drawer_body : content.toolbar) || []

  if (!appSetup.hasDrawer && content.multi_toolbar && content.multi_toolbar.length) {
    childs = []
    content.multi_toolbar.forEach(row => {
      const rowItems = row.body || []
      rowItems.forEach((section: ToolbarRowStoryblok) => {
        const sectionItems = section.body || []
        sectionItems.forEach(item => {
          if (['toolbar_search', 'button', 'nav_menu'].includes(item.component)) {
            childs.push(item)
          }
        })
      })
    })
  }
  return (
    <>
      {childs.map((props, i) => DrawerContentRender({ content: props, i }))}
    </>
  )
}
