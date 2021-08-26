import { ListStoriesStoryblok } from '../../typings/generated/components-schema'
import { AppPageProps } from '../../typings/app'
import { StoriesParams } from 'storyblok-js-client'
import { getStoriesDefaultParams } from './storyblokParamsHelper'

export const getListStoriesParams = (
  item: ListStoriesStoryblok,
  pageProps: AppPageProps
) => {
  const perPage = item.max_items || item.pagination?.[0]?.items_per_page
  const params: StoriesParams = {
    ...getStoriesDefaultParams(pageProps),
    per_page: perPage ? Number(perPage) : 25,
    filter_query: {
      component: {
        in: item.view_types?.length
          ? item.view_types.join(',')
          : 'page,event,news'
      }
    },
    sort_by: 'content.published_at:desc'
  }
  if (item.event_categories?.length) {
    params.filter_query.category = {
      in: item.event_categories.join(',')
    }
  }
  if (item.news_categories?.length) {
    params.filter_query.category = {
      in: item.news_categories.join(',')
    }
  }
  if (item.page_categories?.length) {
    params.filter_query.categories = {
      [item.match_all_categories ? 'all_in_array' : 'in_array']:
        item.page_categories.join(',')
    }
  }

  return params
}
