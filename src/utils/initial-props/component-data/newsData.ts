import { LmStoryblokService } from '../StoryblokService'
import { NewsListStoryblok } from '../../../typings/generated/components-schema'
import { StoriesParams } from 'storyblok-js-client'

export const getNewsData = async (item: NewsListStoryblok) => {
  const params: StoriesParams = {
    filter_query: {
      component: {
        in: 'news'
      }
    },
    sort_by: 'content.published_at:desc'
  }
  if (item.max_items) {
    params.per_page = Number(item.max_items)
  }
  if (item.categories?.length) {
    params.filter_query.category = {
      in: item.categories.join(',')
    }
  }
  const news = item.max_items
    ? await LmStoryblokService.get('cdn/stories', params)
    : await LmStoryblokService.getAll('cdn/stories', params)
  return Array.isArray(news) ? news : news.data?.stories
}
