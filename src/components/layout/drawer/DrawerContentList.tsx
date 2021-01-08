import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { DrawerContentRender } from './CollapsibleListSection'
import { settingsSelector, useAppStore } from '../../../utils/state/appState'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const findPathDeep = require('deepdash/findPathDeep')

/**
 * function to return uids of the current path. only called once
 * @param childs
 * @param activeRoutePath
 */
const getUidsOfSlug = (childs: any[], activeRoutePath?: string) => {
  const path =
    activeRoutePath &&
    activeRoutePath !== '/' &&
    findPathDeep(
      childs,
      (_: any, _n: any, context: any) =>
        `/${context.link?.cached_url}`.includes(activeRoutePath),
      {
        pathFormat: 'array'
      }
    )
  if (Array.isArray(path)) {
    const uids = []
    const cleanedPath = path.map((i: string | number) =>
      Number(i) ? Number(i) : i
    )
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

export function DrawerContentList(): JSX.Element {
  const settings = useAppStore(settingsSelector)
  const router = useRouter()
  const activeRoutePath = router?.asPath
  const hasDrawer = settings.drawer_body?.length
  let childs = (hasDrawer ? settings.drawer_body : settings.toolbar) || []

  if (!hasDrawer && settings.multi_toolbar?.length) {
    childs = []
    settings.multi_toolbar.forEach((row) => {
      row.body?.forEach((section) => {
        section.body?.forEach((item) => {
          if (
            ['toolbar_search', 'button', 'nav_menu'].includes(item.component)
          ) {
            childs.push(item as any)
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
      {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
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
