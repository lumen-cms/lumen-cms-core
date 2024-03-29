import React from 'react'
import { LmComponentRender } from '@LmComponentRender'
import {
  CardListItemStoryblok,
  CardListStoryblok,
  ListWidgetStoryblok
} from '../../typings/generated/components-schema'
import { AllStoryData } from '../../typings/app'

type ListWidgetCardsProps = {
  content: ListWidgetStoryblok
  items: AllStoryData
  options?: CardListStoryblok
}

export function ListWidgetCards({
  items,
  content,
  options
}: ListWidgetCardsProps): JSX.Element {
  return (
    <LmComponentRender
      content={{
        ...(options || {}),
        _uid: content._uid,
        component: 'card_list',
        body: items.map((item) => {
          const itemContent = item.content
          if (content.sort === 'publish' && !itemContent.preview_publish_date) {
            console.info('missing preview publish date:', item.full_slug)
          }
          return {
            _uid: item.uuid,
            component: 'card_list_item',
            title:
              itemContent.preview_title || itemContent.meta_title || item.name,
            subtitle: itemContent.preview_subtitle,
            description: itemContent.preview_teaser,
            image: itemContent.preview_image,
            link: {
              cached_url: item.full_slug,
              linktype: 'story'
            }
          } as CardListItemStoryblok
        })
      }}
    />
  )
}
