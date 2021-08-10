import { StoriesParams, StoryData } from 'storyblok-js-client'
import { CONFIG } from '@CONFIG'
import { PageComponent } from '../../typings/generated/schema'
import { LmStoryblokService } from './StoryblokService'

let allStories: StoryData<PageComponent>[]

export const legacyAllStories = async (options: {
  locale: string
  defaultLocale: string
}) => {
  if (typeof allStories !== 'undefined') {
    return allStories
  }
  const locale =
    options.locale !== options.defaultLocale || CONFIG.enableLocaleSuffix
      ? options.locale
      : undefined
  const params: StoriesParams = {
    per_page: 100,
    excluding_fields:
      'body,right_body,meta_robots,property,meta_description,seo_body',
    sort_by: 'published_at:desc',
    filter_query: {
      component: {
        in: 'page'
      }
    }
  }
  if (CONFIG.rootDirectory || locale) {
    params.starts_with = `${locale ? `${locale}/` : ''}${
      CONFIG.rootDirectory ? `${CONFIG.rootDirectory}/` : ''
    }`
  }
  allStories = await LmStoryblokService.getAll('cdn/stories', params)
  return allStories
}
