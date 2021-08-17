import { CategoryBoxStoryblok } from '../../../typings/generated/components-schema'
import { AppPageProps } from '../../../typings/app'
import { filterAllCategory, getAllCategories } from './allCategoryStories'

export const getCategoryData = async (
  item: CategoryBoxStoryblok,
  props: AppPageProps
) => {
  const allItems = await getAllCategories({
    locale: props.locale as string,
    defaultLocale: props.defaultLocale
  })
  return filterAllCategory(allItems, item)
}
