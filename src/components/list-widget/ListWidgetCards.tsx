import React from 'react'
import { LmComponentRender } from '@LmComponentRender'
import {
  CardListItemStoryblok,
  CardListStoryblok
} from '../../typings/generated/components-schema'
import { ListStoriesData } from './listWidgetTypes'
import { getContentFields } from './listUtils/getContentFields'
import { useRouter } from 'next/router'

type ListWidgetCardsProps = {
  _uid: string
  items: ListStoriesData[]
  options?: CardListStoryblok
  disablePagination?: boolean
}

export function ListWidgetCards({
  items,
  _uid,
  options,
  disablePagination
}: ListWidgetCardsProps): JSX.Element {
  const { locale } = useRouter()
  return (
    <LmComponentRender
      disablePagination={disablePagination}
      content={{
        ...(options || {}),
        _uid: _uid,
        component: 'card_list',
        body: items.map((item) => {
          const { title, image, subtitle, description } = getContentFields(
            item,
            { locale, date_format: options?.date_format }
          )
          return {
            _uid: item.uuid,
            component: 'card_list_item',
            title,
            subtitle,
            description,
            image,
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
