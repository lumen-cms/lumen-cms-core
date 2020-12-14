import React from 'react'
import ListWidgetLists from './ListWidgetLists'

import {
  CardListStoryblok,
  ListWidgetStoryblok
} from '../../typings/generated/components-schema'
import { AppApiRequestPayload } from '../../typings/app'
import { ListWidgetCards } from './ListWidgetCards'
import { ListWidgetLinks } from './ListWidgetLinks'
import { LmListWidgetProps } from './listWidgetTypes'

type ListWidgetContainerProps = {
  options: LmListWidgetProps['content']['list_options']
  content: ListWidgetStoryblok
  items: AppApiRequestPayload['allStories']
}

export function ListWidgetContainer(
  props: ListWidgetContainerProps
): JSX.Element {
  const { options, ...rest } = props
  const listOption = options?.[0]

  if (listOption?.component === 'lists') {
    return <ListWidgetLists options={listOption} {...rest} />
  }
  if (listOption?.component === 'nav_list') {
    return <ListWidgetLinks options={listOption} {...rest} />
  }
  return <ListWidgetCards options={listOption as CardListStoryblok} {...rest} />
}
