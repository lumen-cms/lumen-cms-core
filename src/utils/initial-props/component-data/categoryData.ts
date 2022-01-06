import { CategoryBoxStoryblok } from '../../../typings/generated/components-schema'
import { AppPageProps } from '../../../typings/app'
import { filterAllCategory, getAllCategories } from './allCategoryStories'

export const getCategoryData = async (
  item: CategoryBoxStoryblok,
  props: AppPageProps
) => {
  const allItems = await getAllCategories({
    locale: props.locale || '',
    defaultLocale: props.defaultLocale || ''
  })
  let filtered = filterAllCategory(allItems, item)
  return filtered
}
