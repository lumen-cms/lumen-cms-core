import React, { CSSProperties, useState } from 'react'
import clsx from 'clsx'
import { useRouter } from 'next/router'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import { LmCategoryBoxProps } from './listWidgetTypes'
import {
  setSearchCategorySelector,
  useSearchStore
} from '../../utils/state/searchState'

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
  const setSearchCategory = useSearchStore(setSearchCategorySelector)

  const categories = content.category_box_data || [] //allCategories
  const style: CSSProperties = {}
  // const style = { maxHeight: '500px', overflowY: 'auto' }
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
                    if (checked) {
                      const currentCategories = [...selected, value]
                      setSelected(currentCategories)
                      setSearchCategory(currentCategories)
                    } else {
                      const currentCategories = selected.filter(
                        (i) => i !== value
                      )
                      setSelected(currentCategories)
                      setSearchCategory(currentCategories)
                    }
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
