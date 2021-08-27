import LmNewsList from './NewsList'
import {
  CardListStoryblok,
  ListsStoryblok,
  NavListStoryblok,
  NewsListStoryblok
} from '../../typings/generated/components-schema'
import { ListWidgetCards } from './ListWidgetCards'
import ListWidgetLists from './ListWidgetLists'
import { ListWidgetLinks } from './ListWidgetLinks'
import React from 'react'
import { ListStoriesData, LmListStoriesProps } from './listWidgetTypes'

type LmListStoriesContainerProps = {
  layout: LmListStoriesProps['content']['layout']
  _uid: string
  items: ListStoriesData[]
}

export default function LmListStoriesContainer({
  layout,
  _uid,
  items
}: LmListStoriesContainerProps) {
  const currentLayout = layout?.[0] || { component: null }
  return {
    news_list: (
      <LmNewsList
        items={items || []}
        options={currentLayout as NewsListStoryblok}
      />
    ),
    card_list: (
      <ListWidgetCards
        disablePagination={true}
        _uid={_uid}
        options={currentLayout as CardListStoryblok}
        items={items}
      />
    ),
    lists: (
      <ListWidgetLists
        options={currentLayout as ListsStoryblok}
        items={items}
      />
    ),
    nav_list: (
      <ListWidgetLinks
        _uid={_uid}
        options={currentLayout as NavListStoryblok}
        items={items}
      />
    )
  }[currentLayout.component || 'news_list']
}
