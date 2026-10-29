import { matchesAllTags } from '../matchesAllTags'
import type { PagePropsOptions } from '../../../typings/app'
import { getStoryblokRequest } from '../storyblokRequestContext'
import { CONFIG } from '../../config'
import { LmStoryblokService } from '../StoryblokService'
import { AllCategoryData } from '../../../typings/app'
import { CategoryBoxStoryblok } from '../../../typings/generated/components-schema'
import { ISbStoriesParams } from 'storyblok-js-client'

export const getAllCategories = async (
  props: PagePropsOptions
): Promise<AllCategoryData> => {
  const locale = props.locale !== props.defaultLocale ? props.locale : null
  const params: ISbStoriesParams = {
    ...getStoryblokRequest(props),
    ...(props.insideStoryblok ? { version: 'draft' as const } : {}),
    per_page: 100,
    sort_by: 'content.name:asc,name:asc',
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
  return LmStoryblokService.getAll('cdn/stories', params)
}

export const filterAllCategory = (
  categories: AllCategoryData,
  content: CategoryBoxStoryblok
) => {
  const filterByTags = content.filter_by_tags?.values || []
  const selectedTags = new Set(filterByTags)
  const requiredTags = content.match_all_tags ? selectedTags : null
  const filterByCategories = new Set(content.filter_categories || [])
  if (filterByTags || filterByCategories.size) {
    return categories.filter((category) => {
      const categoryContent = category.content
      let exists = true
      if (filterByTags.length) {
        if (!categoryContent.tag_reference?.values) {
          // remove all categories without tag_reference
          return false
        }
        const tagList = category.tag_list || []
        exists =
          tagList.length && requiredTags
            ? matchesAllTags(tagList, requiredTags)
            : tagList.some((tag) => selectedTags.has(tag))
        if (exists) return true
      }
      if (filterByCategories.size) {
        return filterByCategories.has(category.uuid)
      }
      return exists
    })
  }
  return categories
}
