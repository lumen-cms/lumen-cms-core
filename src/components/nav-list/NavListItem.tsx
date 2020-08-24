import React from 'react'
import MuiLink from '@material-ui/core/Link'
import { NavItemStoryblok } from '../../typings/generated/components-schema'
import { useAppContext } from '../provider/context/AppContext'
import { getLinkAttrs, LinkType } from '../../utils/linkHandler'

export type LmNavListItemProps = NavItemStoryblok

export function LmNavListItem(props: LmNavListItemProps): JSX.Element {
  const content = { ...props }
  const { LinkRender } = useAppContext()
  const btnProps: any = content.link?.cached_url
    ? {
        ...getLinkAttrs(content.link as LinkType, {
          openExternal: !!content.open_external,
        }),
        naked: true,
        component: LinkRender,
      }
    : {}

  return <MuiLink {...btnProps}>{content.name}</MuiLink>
}
