import React, { ChangeEvent, useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import { useRouter } from 'next/router'
import TextField from '@material-ui/core/TextField'
import clsx from 'clsx'
import Magnify from 'mdi-material-ui/Magnify'
import { onSearchTextChange } from '../../utils/state/actions'
import { ListSearchFieldStoryblok } from '../../typings/generated/components-schema'

export type LmListSearchFieldProps = { content: ListSearchFieldStoryblok }

export function LmListSearchField({
  content,
}: LmListSearchFieldProps): JSX.Element {
  const router = useRouter()
  const query = router?.query
  const [searchText, setSearchText] = useState<string>(
    (query.search__text as string) || ''
  )
  const [debouncedCallback] = useDebouncedCallback(
    // function
    (value: string) => {
      onSearchTextChange(value)
    },
    // delay in ms
    300
  )

  function onSearchChange(ev: ChangeEvent<HTMLInputElement>) {
    const { value } = ev.currentTarget
    setSearchText(value)
    debouncedCallback(value)
  }

  return (
    <div className={clsx(content.class_names && content.class_names.values)}>
      <TextField
        InputProps={{
          startAdornment: <Magnify />,
        }}
        id={content._uid}
        value={searchText}
        label={content.label}
        type="search"
        placeholder={content.placeholder}
        variant="outlined"
        onChange={onSearchChange}
      />
    </div>
  )
}
