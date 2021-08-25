import React, { useState } from 'react'
import { legacyClientListWidgetSearch, useListSearch } from './useListSearch'
import { ListWidgetContainer } from './ListWidgetContainer'
import { LmListWidgetProps } from './listWidgetTypes'
import { LmComponentRender } from '@LmComponentRender'

export default function LmListWidget({
  content
}: LmListWidgetProps): JSX.Element {
  const clientSideSearch = useListSearch(!!content.enable_for_search)
  let [data] = useState(content.list_widget_data?.items ?? [])

  if (
    content.enable_for_search &&
    (clientSideSearch.searchParamsCategories?.length ||
      clientSideSearch.searchText)
  ) {
    // if its legacy category system search over all data
    data = legacyClientListWidgetSearch(data || [], clientSideSearch)
  }

  return (
    <div
      style={{
        minHeight: content.enable_for_search ? 'calc(100vh - 120px)' : undefined
      }}
    >
      {!data?.length && (
        <div>
          {content.not_found_content?.map((blok) => (
            <LmComponentRender content={blok} key={blok._uid} />
          ))}
        </div>
      )}
      <ListWidgetContainer
        options={content.list_options}
        content={content}
        items={data || []}
      />
    </div>
  )
}
