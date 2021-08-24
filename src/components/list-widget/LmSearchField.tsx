import clsx from 'clsx'
import TextField from '@material-ui/core/TextField'
import Magnify from 'mdi-material-ui/Magnify'
import React from 'react'
import { useDebouncedCallback } from 'use-debounce'
import { LmListSearchFieldProps } from './listWidgetTypes'
import { useRouter } from 'next/router'
import InputAdornment from '@material-ui/core/InputAdornment'

export default function LmSearchField({
  content,
  onChange
}: LmListSearchFieldProps & {
  onChange: (value: string) => void
}) {
  const { query } = useRouter()
  const callback = useDebouncedCallback(
    (value: string) => {
      // onSearchTextChange(value)
      onChange(value)
    },
    // delay in ms
    500
  )
  return (
    <div className={clsx(content.class_names && content.class_names.values)}>
      <TextField
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Magnify />
            </InputAdornment>
          )
        }}
        id={content._uid}
        defaultValue={query?.search__text || ''}
        label={content.label}
        type="search"
        size={content.size ? content.size : undefined}
        fullWidth={content.fullwidth}
        placeholder={content.placeholder}
        variant={content.variant || 'outlined'}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          callback(event.currentTarget.value)
        }
      />
    </div>
  )
}
