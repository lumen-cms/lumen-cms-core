import { StoriesParams, StoryData } from 'storyblok-js-client'
import { CONFIG } from '@CONFIG'
import { PageComponent } from '../../../typings/generated/schema'
import { LmStoryblokService } from '../StoryblokService'
import { localeStoriesHelper } from './localeStoriesHelper'

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
    ...localeStoriesHelper(locale),
    filter_query: {
      component: {
        in: 'page'
      }
    }
  }
  allStories = await LmStoryblokService.getAll('cdn/stories', params)
  return allStories
}
