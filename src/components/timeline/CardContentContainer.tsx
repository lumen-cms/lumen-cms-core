import React, { FunctionComponent } from 'react'
import CardActionArea from '@material-ui/core/CardActionArea'
import { TimelineItemStoryblok } from '../../typings/generated/components-schema'
import { useAppContext } from '../provider/context/AppContext'
import { getLinkAttrs, LinkType } from '../../utils/linkHandler'

export const CardContentContainer: FunctionComponent<{
  content: TimelineItemStoryblok
}> = ({ content, children }) => {
  const { LinkRender } = useAppContext()
  if (content.link) {
    const btnProps: any = content.link?.cached_url
      ? {
          ...getLinkAttrs(content.link as LinkType, {
            openExternal: !!content.open_external
          }),
          naked: true,
          component: LinkRender
        }
      : {}
    return <CardActionArea {...btnProps}>{children}</CardActionArea>
  }
  return <>{children}</>
}
CardContentContainer.displayName = 'CardContentContainer'
