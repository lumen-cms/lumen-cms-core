import clsx from 'clsx'
import TextField from '@material-ui/core/TextField'
import Magnify from 'mdi-material-ui/Magnify'
import React from 'react'
import { useDebouncedCallback } from 'use-debounce'
import { LmListSearchFieldProps } from './listWidgetTypes'
import { useRouter } from 'next/router'

export default function LmSearchField({
  content
}: LmListSearchFieldProps & {
  callback: (value: string) => void
}) {
  const { query } = useRouter()
  const callback = useDebouncedCallback(
    (value: string) => {
      // onSearchTextChange(value)
      callback(value)
    },
    // delay in ms
    500
  )
  return (
    <div className={clsx(content.class_names && content.class_names.values)}>
      <TextField
        InputProps={{
          startAdornment: <Magnify />
        }}
        id={content._uid}
        defaultValue={query?.search__text || ''}
        label={content.label}
        type="search"
        placeholder={content.placeholder}
        variant="outlined"
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          callback(event.currentTarget.value)
        }
      />
    </div>
  )
}
