import React from 'react'
import {
  GlobalStoryblok,
  ToolbarRowStoryblok
} from '../../../typings/generated/components-schema'
import { useAppSetup } from '../../provider/context/AppSetupContext'
import { DrawerContentRender } from './CollapsibleListSection'

// const _findDeepPath = require('deepdash/findPathDeep')

type DrawerContentListProps = { content: Partial<GlobalStoryblok> }

export function DrawerContentList({
  content
}: DrawerContentListProps): JSX.Element {
  const appSetup = useAppSetup()
  // const router = useRouter()
  // const activeRoutePath = router?.asPath
  let childs =
    (appSetup.hasDrawer ? content.drawer_body : content.toolbar) || []

  if (
    !appSetup.hasDrawer &&
    content.multi_toolbar &&
    content.multi_toolbar.length
  ) {
    childs = []
    content.multi_toolbar.forEach((row) => {
      const rowItems = row.body || []
      rowItems.forEach((section: ToolbarRowStoryblok) => {
        const sectionItems = section.body || []
        sectionItems.forEach((item) => {
          if (
            ['toolbar_search', 'button', 'nav_menu'].includes(item.component)
          ) {
            childs.push(item)
          }
        })
      })
    })
  }

  // useEffect(() => {
  //   const path = _findDeepPath(
  //     childs,
  //     (value, parentValue, context) => {
  //       console.log('value: ', value)
  //       console.log('key: ', parentValue)
  //       console.log('context: ', context)
  //       return '/' + context.link?.cached_url === activeRoutePath
  //     },
  //     {}
  //   )
  //   console.log(path)
  // }, [])
  return (
    <>
      {childs.map((props) => (
        <DrawerContentRender content={props} key={props._uid} />
      ))}
    </>
  )
}
