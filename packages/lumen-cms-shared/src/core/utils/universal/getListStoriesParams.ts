import { storyblokRelationIds } from './storyblokRelations'
import { ListStoriesStoryblok } from '../../typings/generated/components-schema'
import { AppPageProps } from '../../typings/app'
import {
  getStoriesDefaultParams,
  getStoriesSortHelper
} from './storyblokParamsHelper'
import { ISbStoriesParams } from 'storyblok-js-client'

export const getListStoriesParams = (
  item: ListStoriesStoryblok,
  pageProps: AppPageProps
) => {
  const perPage = item.max_items || item.pagination?.[0]?.items_per_page
  const filterQuery: {
    component: { in: string }
    __or?: Record<string, Record<string, string>>[]
  } = {
    component: {
      in: item.view_types?.length
        ? item.view_types.join(',')
        : 'page,event,news'
    }
  }
  const params: ISbStoriesParams = {
    ...getStoriesDefaultParams(pageProps),
    per_page: perPage ? Number(perPage) : 25,
    filter_query: filterQuery,
    sort_by: item.sort
      ? getStoriesSortHelper(item)
      : 'content.published_at:desc,content.preview_publish_date:desc,content.start:desc,content.title:asc'
  }
  if (item.sort) {
    if (item.sort === 'created') {
    }
  }
  filterQuery.__or = []
  const categoryFilters: string[] = [
    ...storyblokRelationIds(item.event_categories),
    ...storyblokRelationIds(item.news_categories)
  ]
  if (categoryFilters.length) {
    filterQuery.__or.push({
      category: {
        in: categoryFilters.join(',')
      }
    })
  }
  if (item.page_categories?.length) {
    filterQuery.__or.push({
      categories: {
        [item.match_all_categories ? 'all_in_array' : 'in_array']:
          storyblokRelationIds(item.page_categories).join(',')
      }
    })
  }
  if (!filterQuery.__or.length) {
    delete filterQuery.__or
  }

  return params
}
