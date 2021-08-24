import React from 'react'
import { LmListSearchFieldProps } from './listWidgetTypes'
import { useSearchStore } from '../../utils/state/searchState'
import LmSearchField from './LmSearchField'

export default function LmListSearchField({
  content
}: LmListSearchFieldProps): JSX.Element {
  const onSearchTextChange = useSearchStore((state) => state.onSearchTextChange)
  return (
    <LmSearchField
      content={content}
      callback={(value) => {
        onSearchTextChange(value)
      }}
    />
  )
}
