import React from 'react'
import { LmListSearchFieldProps } from './listWidgetTypes'
import {
  onSearchTextSelector,
  useSearchStore
} from '../../utils/state/searchState'
import LmSearchField from './LmSearchField'

export default function LmListSearchField({
  content
}: LmListSearchFieldProps): JSX.Element {
  const onSearchTextChange = useSearchStore(onSearchTextSelector)
  return (
    <LmSearchField
      content={content}
      onChange={(value) => {
        onSearchTextChange(value)
      }}
    />
  )
}
