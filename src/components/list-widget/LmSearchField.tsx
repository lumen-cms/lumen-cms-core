import { cx as clsx } from 'tss-react/@emotion/css'
import TextField from '@mui/material/TextField'
import Magnify from 'mdi-material-ui/Magnify'
import React, { useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import { LmListSearchFieldProps } from './listWidgetTypes'
import { useRouter } from 'next/router'
import InputAdornment from '@mui/material/InputAdornment'
import CloseCircle from 'mdi-material-ui/CloseCircle'
import IconButton from '@mui/material/IconButton'

export default function LmSearchField({
  content,
  onChange
}: LmListSearchFieldProps & {
  onChange: (value: string) => void
}) {
  const { query } = useRouter()
  const [inputValue, setValue] = useState<string>(
    (query?.search__text as string) || ''
  )
  const callback = useDebouncedCallback(
    (value: string) => {
      // onSearchTextChange(value)
      onChange(value)
    },
    // delay in ms
    500
  )
  return (
    <div
      className={clsx(content.class_names?.values, {
        'w-100': !!content.fullwidth
      })}
    >
      <TextField
        inputProps={{
          autoComplete: 'off'
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Magnify />
            </InputAdornment>
          ),
          endAdornment: inputValue.length ? (
            <InputAdornment position="end">
              <IconButton
                size={'small'}
                onClick={() => {
                  setValue('')
                  onChange('')
                }}
              >
                <CloseCircle />
              </IconButton>
            </InputAdornment>
          ) : null
        }}
        id={content._uid}
        value={inputValue}
        label={content.label}
        type="text"
        size={content.size ? content.size : undefined}
        fullWidth={content.fullwidth}
        placeholder={content.placeholder}
        variant={content.variant || 'outlined'}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          const val = event.currentTarget.value
          setValue(val)
          callback(val)
        }}
      />
    </div>
  )
}
