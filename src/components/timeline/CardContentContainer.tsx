import React, { FunctionComponent } from 'react'
import CardActionArea from '@material-ui/core/CardActionArea'
import { TimelineItemStoryblok } from '../../typings/generated/components-schema'
import { getLinkAttrs, LinkType } from '../../utils/linkHandler'
import { LmCoreComponents } from '../..'

export const CardContentContainer: FunctionComponent<{
  content: TimelineItemStoryblok
}> = ({ content, children }) => {
  if (content.link) {
    const btnProps: any = content.link?.cached_url
      ? {
        ...getLinkAttrs(content.link as LinkType, {
          openExternal: !!content.open_external
        }),
        naked: true,
        component: LmCoreComponents.lm_link_render
      }
      : {}
    return <CardActionArea {...btnProps}>{children}</CardActionArea>
  }
  return <>{children}</>
}
CardContentContainer.displayName = 'CardContentContainer'
