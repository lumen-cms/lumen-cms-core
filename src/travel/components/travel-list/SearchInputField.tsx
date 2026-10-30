import { usePageContext } from '../page/PageContext'
import { useRouter } from 'next/router'
import { useDebouncedCallback } from 'use-debounce'
import translations from '../../utils/translations'
import React from 'react'
import TextField from '@mui/material/TextField'

export function SearchInputField(): React.JSX.Element {
  const { updateContext, value } = usePageContext()
  const { locale } = useRouter()

  const debounced = useDebouncedCallback((val: string) => {
    updateContext({ searchtext: val })
  }, 750)

  return (
    <TextField
      name="search"
      fullWidth
      type="search"
      defaultValue={value?.searchtext || ''}
      variant="outlined"
      margin="normal"
      slotProps={{ htmlInput: { autoComplete: 'new-password' } }}
      label={
        translations[locale?.toUpperCase() as 'EN' | 'DE'].search as string
      }
      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
        debounced(event.currentTarget.value)
      }
    />
  )
}
