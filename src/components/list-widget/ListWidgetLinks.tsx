import React from 'react'
import { LmComponentRender } from '@LmComponentRender'
import { NavListStoryblok } from '../../typings/generated/components-schema'
import { ListStoriesData } from './listWidgetTypes'

type ListWidgetLinksProps = {
  items: ListStoriesData[]
  options: NavListStoryblok
  _uid: string
}

export function ListWidgetLinks({
  items,
  options,
  _uid
}: ListWidgetLinksProps): JSX.Element {
  const listProps = {
    ...options,
    _uid: _uid,
    body: items.map((item) => ({
      _uid: item.uuid,
      component: 'nav_item',
      name:
        item.content.preview_title ||
        item.content.title ||
        item.content.meta_title ||
        item.name,
      link: {
        cached_url: item.full_slug,
        linktype: 'story'
      }
    }))
  }
  return <LmComponentRender content={listProps} />
}
