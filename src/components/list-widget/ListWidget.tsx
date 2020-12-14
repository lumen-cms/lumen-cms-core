import React from 'react'
import { useAppContext } from '@context/AppContext'
import { useListSearch } from './useListSearch'
import { ListWidgetContainer } from './ListWidgetContainer'
import { LmListWidgetProps } from './listWidgetTypes'

export default function LmListWidget({
  content
}: LmListWidgetProps): JSX.Element {
  const { listWidgetData } = useAppContext()
  const items = useListSearch(
    (listWidgetData && listWidgetData[content._uid]) || [],
    !!content.enable_for_search
  )

  return (
    <ListWidgetContainer
      options={content.list_options}
      content={content}
      items={items}
    />
  )
}
