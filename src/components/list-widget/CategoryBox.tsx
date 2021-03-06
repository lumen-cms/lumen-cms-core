import React, { CSSProperties, useState } from 'react'
import clsx from 'clsx'
import { useRouter } from 'next/router'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import { useAppContext } from '@context/AppContext'
import { LmCategoryBoxProps } from './listWidgetTypes'
import { useSearchStore } from '../../utils/state/searchState'

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
  const setSearchCategory = useSearchStore((state) => state.setSearchCategory)

  const { allCategories } = useAppContext()
  let categories = allCategories
  const filterByTags = content.filter_by_tags?.values || []
  const filterByCategories = content.filter_categories || []
  if (filterByTags || filterByCategories.length) {
    categories = categories.filter((category) => {
      const categoryContent = category.content
      if (!categoryContent.tag_reference?.values) {
        // remove all categories without tag_reference
        return false
      }
      let exists = true
      if (filterByTags.length) {
        const tagList = category.tag_list || []
        exists =
          tagList.length && content.match_all_tags
            ? filterByTags.every((element) => tagList.includes(element))
            : filterByTags.some((element) => tagList.includes(element))
        if (exists) return true
      }
      if (filterByCategories.length) {
        return filterByCategories.includes(category.uuid)
      }
      return exists
    })
  }

  const style: CSSProperties = {}
  // const style = { maxHeight: '500px', overflowY: 'auto' }
  return (
    <div
      style={style}
      className={clsx(content.class_names && content.class_names.values)}
    >
      {categories.map((category) => {
        const checkboxValue =
          category.content &&
          category.content.tag_reference &&
          category.content.tag_reference.values
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
              label={category.content && category.content.name}
            />
          </div>
        )
      })}
    </div>
  )
}
