import { useState } from 'react'
import { DrawerContentRender } from './CollapsibleListSection'
import { useSettings } from '../../provider/SettingsPageProvider'
import { useAppContext } from '@context/AppContext'

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
    let tmp: unknown = childs
    for (const key of cleanedPath) {
      if (!tmp || typeof tmp !== 'object') break
      const curr: unknown = (tmp as Record<string | number, unknown>)[key]
      if (
        curr &&
        typeof curr === 'object' &&
        '_uid' in curr &&
        typeof curr._uid === 'string'
      ) {
        uids.push(curr._uid)
      }
      tmp = curr
    }
    return uids
  }
  return []
}

export function DrawerContentList(): React.JSX.Element {
  const settings = useSettings()
  const { slug } = useAppContext()
  const activeRoutePath = slug
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
        // eslint-disable-next-line
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
