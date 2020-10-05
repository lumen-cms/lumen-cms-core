import React from 'react'
import {
  CardListStoryblok,
  ListsStoryblok,
  NavListStoryblok
} from '../../typings/generated/components-schema'
import { useListSearch } from './useListSearch'
import { ListWidgetContainer } from './ListWidgetContainer'
import { useAppContext } from '@context/AppContext'
import { LmListWidgetProps } from './listWidgetTypes'

export function LmListWidget({ content }: LmListWidgetProps): JSX.Element {
  const { listWidgetData } = useAppContext()
  const items = useListSearch(
    (listWidgetData && listWidgetData[content._uid]) || [],
    !!content.enable_for_search
  )

  const listOption: ListsStoryblok | CardListStoryblok | NavListStoryblok =
    (content.list_options && content.list_options[0]) || {}

  return (
    <ListWidgetContainer options={listOption} content={content} items={items} />
  )
}
