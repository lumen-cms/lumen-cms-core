import React from 'react'
import ListWidgetLists from './ListWidgetLists'

import {
  CardListStoryblok,
  ListsStoryblok,
  ListWidgetStoryblok,
  NavListStoryblok
} from '../../typings/generated/components-schema'
import { AppApiRequestPayload } from '../../typings/app'
import { ListWidgetCards } from './ListWidgetCards'
import { ListWidgetLinks } from './ListWidgetLinks'

type ListWidgetContainerProps = {
  options: ListsStoryblok | CardListStoryblok | NavListStoryblok
  content: ListWidgetStoryblok
  items: AppApiRequestPayload['allStories']
}

export function ListWidgetContainer(
  props: ListWidgetContainerProps
): JSX.Element {
  const { options, ...rest } = props
  if (options.component === 'lists') {
    return <ListWidgetLists options={options} {...rest} />
  }
  if (options.component === 'nav_list') {
    return <ListWidgetLinks options={options} {...rest} />
  }
  return <ListWidgetCards options={options} {...rest} />
}
