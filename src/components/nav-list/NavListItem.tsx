import React from 'react'
import MuiLink from '@material-ui/core/Link'
import { LmCoreComponents } from '@CONFIG'
import { getLinkAttrs, LinkType } from '../../utils/linkHandler'
import { LmNavListItemProps } from './navListTypes'

export function LmNavListItem(props: LmNavListItemProps): JSX.Element {
  const content = { ...props }
  const btnProps: any = content.link?.cached_url
    ? {
        ...getLinkAttrs(content.link as LinkType, {
          openExternal: !!content.open_external
        }),
        naked: true,
        component: LmCoreComponents.lm_link_render
      }
    : {}

  return <MuiLink {...btnProps}>{content.name}</MuiLink>
}
