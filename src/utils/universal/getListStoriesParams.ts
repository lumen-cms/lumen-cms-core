import { ListStoriesStoryblok } from '../../typings/generated/components-schema'
import { AppPageProps } from '../../typings/app'
import { StoriesParams } from 'storyblok-js-client'
import { getStoriesDefaultParams } from './storyblokParamsHelper'

export const getListStoriesParams = (
  item: ListStoriesStoryblok,
  pageProps: AppPageProps
) => {
  const params: StoriesParams = {
    ...getStoriesDefaultParams(pageProps),
    per_page: 25,
    filter_query: {
      component: {
        in: item.view_types?.length
          ? item.view_types.join(',')
          : 'page,event,news'
      }
    }
  }
  return params
}
