import React, { CSSProperties, useState } from 'react'
import { useRouter } from 'next/router'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import { LmCategoryBoxProps } from './listWidgetTypes'
import {
  setSearchCategorySelector,
  useSearchStore
} from '../../utils/state/searchState'
import { Autocomplete, TextField } from '@mui/material'
import clsx from 'clsx'

export default function LmCategoryBox({
  content
}: LmCategoryBoxProps): JSX.Element {
  const router = useRouter()
  const query = router?.query
  let initialValues: string[] = []
  if (query?.search__categories) {
    initialValues = Array.isArray(query.search__categories)
      ? query.search__categories
      : [query.search__categories]
  }
  const [selected, setSelected] = useState<string[]>(initialValues)
  const [categories] = useState(content.category_box_data || []) //allCategories
  const setSearchCategory = useSearchStore(setSearchCategorySelector)
  const style: CSSProperties = {}
  if (content.max_height) {
    style.maxHeight = content.max_height + 'px'
    style.overflowY = 'auto'
  }
  const modifySelect = (value: string, isNew?: boolean) => {
    if (isNew) {
      const currentCategories = [...selected, value]
      setSelected(currentCategories)
      setSearchCategory(currentCategories)
    } else {
      const currentCategories = selected.filter((i) => i !== value)
      setSelected(currentCategories)
      setSearchCategory(currentCategories)
    }
  }
  if (content.display === 'autocomplete_checkbox') {
    return (
      <div style={style} className={clsx(content.class_names?.values)}>
        <Autocomplete
          multiple
          disableClearable
          id={'autocomplete__' + content._uid}
          options={categories}
          getOptionLabel={(category) => category.content.name || category.name}
          onChange={(_event, _value, reason, details) => {
            let value = details?.option.uuid as string
            if (reason === 'removeOption') {
              modifySelect(value)
            } else if (reason === 'selectOption') {
              modifySelect(value, true)
            }
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label={content.autocomplete_label}
              placeholder={content.autocomplete_placeholder}
              variant={content.autocomplete_variant || 'outlined'}
            />
          )}
        />
      </div>
    )
  }
  return (
    <div style={style} className={clsx(content.class_names?.values)}>
      {categories.map((category) => {
        const checkboxValue =
          category.content?.tag_reference?.values || category.uuid
        return (
          <div key={category.uuid}>
            <FormControlLabel
              control={
                <Checkbox
                  id={category.uuid}
                  name={category.uuid}
                  checked={selected.includes(checkboxValue)}
                  value={checkboxValue}
                  onChange={(event) => {
                    const { value, checked } = event.currentTarget
                    modifySelect(value, checked)
                  }}
                />
              }
              label={category.content.name || category.name}
            />
          </div>
        )
      })}
    </div>
  )
}
