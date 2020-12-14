import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { useAppSetup } from '@context/AppSetupContext'
import { GlobalStoryblok } from '../../../typings/generated/components-schema'
import { DrawerContentRender } from './CollapsibleListSection'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const findPathDeep = require('deepdash/findPathDeep')

type DrawerContentListProps = { content: Partial<GlobalStoryblok> }

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
