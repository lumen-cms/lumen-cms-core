import React from 'react'
import { LmComponentRender } from '@LmComponentRender'
import {
  ListWidgetStoryblok,
  NavItemStoryblok,
  NavListStoryblok
} from '../../typings/generated/components-schema'
import { AllStoryData } from '../../typings/app'

type ListWidgetLinksProps = {
  items: AllStoryData
  options: NavListStoryblok
  content: ListWidgetStoryblok
}

export function ListWidgetLinks({
  items,
  options,
  content
}: ListWidgetLinksProps): JSX.Element {
  const listProps = {
    ...options,
    _uid: content._uid,
    body: items.map((item) => {
      const opts: NavItemStoryblok = {
        _uid: content._uid + item.uuid,
        component: 'nav_item',
        name: (item.content && (item.content.preview_title || item.name)) || '',
        link: {
          cached_url: item.full_slug,
          linktype: 'story'
        }
      }
      return opts
    })
  }
  return <LmComponentRender content={listProps} />
}
