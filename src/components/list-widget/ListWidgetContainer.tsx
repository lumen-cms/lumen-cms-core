import React from 'react'
import ListWidgetLists from './ListWidgetLists'

import {
  CardListStoryblok,
  ListWidgetStoryblok
} from '../../typings/generated/components-schema'
import { ListWidgetCards } from './ListWidgetCards'
import { ListWidgetLinks } from './ListWidgetLinks'
import { ListStoriesData, LmListWidgetProps } from './listWidgetTypes'

type ListWidgetContainerProps = {
  options: LmListWidgetProps['content']['list_options']
  content: ListWidgetStoryblok
  items: ListStoriesData[]
}

export function ListWidgetContainer(
  props: ListWidgetContainerProps
): JSX.Element {
  const { options, content, items } = props
  const listOption = options?.[0]

  if (listOption?.component === 'lists') {
    return <ListWidgetLists options={listOption} items={items} />
  } else if (listOption?.component === 'nav_list') {
    return (
      <ListWidgetLinks _uid={content._uid} options={listOption} items={items} />
    )
  }
  return (
    <ListWidgetCards
      _uid={content._uid}
      options={listOption as CardListStoryblok}
      items={items}
    />
  )
}
