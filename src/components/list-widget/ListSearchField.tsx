import React from 'react'
import { useDebouncedCallback } from 'use-debounce'
import { useRouter } from 'next/router'
import TextField from '@material-ui/core/TextField'
import clsx from 'clsx'
import Magnify from 'mdi-material-ui/Magnify'
import { LmListSearchFieldProps } from './listWidgetTypes'
import { useSearchStore } from '../../utils/state/searchState'

export default function LmListSearchField({
  content
}: LmListSearchFieldProps): JSX.Element {
  const router = useRouter()
  const onSearchTextChange = useSearchStore((state) => state.onSearchTextChange)

  const { callback } = useDebouncedCallback(
    (value: string) => {
      onSearchTextChange(value)
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
        defaultValue={router?.query?.search__text || ''}
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
