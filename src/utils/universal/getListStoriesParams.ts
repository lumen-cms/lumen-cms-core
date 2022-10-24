import { ListStoriesStoryblok } from '../../typings/generated/components-schema'
import { AppPageProps } from '../../typings/app'
import {
  getStoriesDefaultParams,
  getStoriesSortHelper
} from './storyblokParamsHelper'
import { ISbStoriesParams } from 'storyblok-js-client/types/interfaces'

export const getListStoriesParams = (
  item: ListStoriesStoryblok,
  pageProps: AppPageProps
) => {
  const perPage = item.max_items || item.pagination?.[0]?.items_per_page
  const params: ISbStoriesParams = {
    ...getStoriesDefaultParams(pageProps),
    per_page: perPage ? Number(perPage) : 25,
    filter_query: {
      component: {
        in: item.view_types?.length
          ? item.view_types.join(',')
          : 'page,event,news'
      }
    },
    sort_by: item.sort
      ? getStoriesSortHelper(item)
      : 'content.published_at:desc,content.preview_publish_date:desc,content.start:desc,content.title:asc'
  }
  if (item.sort) {
    if (item.sort === 'created') {
    }
  }
  // @ts-ignore
  params.filter_query.__or = []
  const categoryFilters: string[] = [
    ...(item.event_categories || []),
    ...(item.news_categories || [])
  ]
  if (categoryFilters.length) {
    // @ts-ignore
    params.filter_query.__or.push({
      category: {
        in: categoryFilters.join(',')
      }
    })
  }
  if (item.page_categories?.length) {
    // @ts-ignore
    params.filter_query.__or.push({
      categories: {
        [item.match_all_categories ? 'all_in_array' : 'in_array']:
          item.page_categories.join(',')
      }
    })
  }
  // @ts-ignore
  if (!params.filter_query.__or.length) {
    // @ts-ignore
    delete params.filter_query.__or
  }

  return params
}
