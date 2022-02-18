import React, { FunctionComponent } from 'react'
import CardActionArea from '@material-ui/core/CardActionArea'
import { LmCoreComponents } from '@CONFIG'
import {
  TimelineItemStoryblok,
  TimelineStoryblok
} from '../../typings/generated/components-schema'
import { getLinkAttrs, LinkType } from '../../utils/linkHandler'
import Card, { CardProps } from '@material-ui/core/Card'

export const CardContentContainer: FunctionComponent<{
  content: TimelineItemStoryblok
  options: TimelineStoryblok
}> = ({ content, options, children }) => {
  const cachedUrl = content.link?.cached_url || content.link?.url
  const hasOppositeContent = content.opposite_body?.length
  const cardProps: CardProps = {
    style: {
      backgroundColor: options.card_background_color?.rgba || undefined
    },
    className: hasOppositeContent ? 'mb-2' : undefined,
    variant: options.card_variant === '' ? undefined : options.card_variant,
    square: options.card_square,
    elevation: options.card_elevation
      ? Number(options.card_elevation)
      : undefined
  }
  if (cachedUrl) {
    const btnProps: any = cachedUrl
      ? {
          ...getLinkAttrs(content.link as LinkType, {
            openExternal: !!content.open_external
          }),
          naked: true,
          component: LmCoreComponents.lm_link_render
        }
      : {}

    return options.disable_card ? (
      <CardActionArea {...btnProps}>{children}</CardActionArea>
    ) : (
      <Card {...cardProps}>
        <CardActionArea {...btnProps}>{children}</CardActionArea>
      </Card>
    )
  }
  return options.disable_card ? (
    <>{children}</>
  ) : (
    <Card {...cardProps}>{children}</Card>
  )
}
CardContentContainer.displayName = 'CardContentContainer'
