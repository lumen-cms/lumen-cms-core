import React, { useState } from 'react'
import {
  GlobalStoryblok,
  ToolbarRowStoryblok
} from '../../../typings/generated/components-schema'
import { useAppSetup } from '../../provider/context/AppSetupContext'
import { DrawerContentRender } from './CollapsibleListSection'
import { useRouter } from 'next/router'

const findPathDeep = require('deepdash/findPathDeep')

type DrawerContentListProps = { content: Partial<GlobalStoryblok> }

/**
 * function to return uids of the current path. only called once
 * @param childs
 * @param activeRoutePath
 */
const getUidsOfSlug = (childs: any[], activeRoutePath: string) => {
  const path =
    activeRoutePath &&
    activeRoutePath !== '/' &&
    findPathDeep(
      childs,
      (_: any, _n: any, context: any) =>
        '/' + context.link?.cached_url === activeRoutePath,
      {
        pathFormat: 'array'
      }
    )
  if (path) {
    const uids = []
    const cleanedPath = path.map((i: string) => (Number(i) ? Number(i) : i))
    let tmp = [...childs]
    for (let i = 0; i < cleanedPath.length; i++) {
      const curr = tmp[cleanedPath[i]]
      curr?._uid && uids.push(curr?._uid)
      tmp = curr
    }
    return uids
  }
  return []
}

export function DrawerContentList({
  content
}: DrawerContentListProps): JSX.Element {
  const appSetup = useAppSetup()
  const router = useRouter()
  const activeRoutePath = router?.asPath
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
  const [openedPath] = useState<string[]>(
    getUidsOfSlug(childs, activeRoutePath)
  )

  return (
    <>
      {childs.map((props) => (
        <DrawerContentRender
          content={props}
          key={props._uid}
          openedPath={openedPath}
        />
      ))}
    </>
  )
}
