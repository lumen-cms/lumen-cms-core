import React from 'react'
import { NavItemStoryblok } from '../../typings/generated/components-schema'
import MuiLink from '@material-ui/core/Link'
import { useAppContext } from '../provider/context/AppContext'
import { getLinkAttrs, LinkType } from '../../utils/linkHandler'


export type LmNavListItemProps = NavItemStoryblok

export function LmNavListItem(props: LmNavListItemProps): JSX.Element {
  const content = { ...props }
  const { LinkRender } = useAppContext()
  const btnProps: any = content.link ? {
    ...getLinkAttrs(content.link as LinkType, { openExternal: !!content.open_external }),
    naked: true,
    component: LinkRender
  } : {}

  return (
    <MuiLink
      {...btnProps}
    >
      {content.name}
    </MuiLink>
  )
}

