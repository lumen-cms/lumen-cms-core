import { StoriesParams } from 'storyblok-js-client'
import { CONFIG } from '@CONFIG'
import { LmStoryblokService } from './StoryblokService'
import { AllCategoryData } from '../../typings/app'
import { CategoryBoxStoryblok } from '../../typings/generated/components-schema'

let allCategories: AllCategoryData

export const getAllCategories = async (props: {
  locale: string
  defaultLocale: string
}) => {
  if (typeof allCategories !== 'undefined') {
    return allCategories
  }
  const locale = props.locale !== props.defaultLocale ? props.locale : null
  const params: StoriesParams = {
    per_page: 100,
    sort_by: 'content.name:asc',
    filter_query: {
      component: {
        in: 'category'
      }
    }
  }
  if (CONFIG.rootDirectory || locale) {
    params.starts_with = `${locale ? `${locale}/` : ''}${
      CONFIG.rootDirectory ? `${CONFIG.rootDirectory}/` : ''
    }`
  }
  allCategories = await LmStoryblokService.getAll('cdn/stories', params)
  return allCategories
}

export const filterAllCategory = (
  categories: AllCategoryData,
  content: CategoryBoxStoryblok
) => {
  const filterByTags = content.filter_by_tags?.values || []
  const filterByCategories = content.filter_categories || []
  if (filterByTags || filterByCategories.length) {
    return categories.filter((category) => {
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
  return categories
}
