import { StoriesParams, StoryData } from 'storyblok-js-client'
import { PageComponent } from '../../../typings/generated/schema'
import { LmStoryblokService } from '../StoryblokService'
import { localeStoriesHelper } from './localeStoriesHelper'
import { AppPageProps } from '../../../typings/app'

let allStories: StoryData<PageComponent>[]

export const legacyAllStories = async (options: AppPageProps) => {
  if (typeof allStories !== 'undefined' && !options.insideStoryblok) {
    return allStories
  }

  const params: StoriesParams = {
    per_page: 100,
    excluding_fields:
      'body,right_body,meta_robots,property,meta_description,seo_body',
    sort_by: 'published_at:desc',
    ...localeStoriesHelper(options),
    filter_query: {
      component: {
        in: 'page'
      }
    }
  }
  if (options.insideStoryblok) {
    params.version = 'draft'
  }

  try {
    allStories = await LmStoryblokService.getAll('cdn/stories', params)
  } catch (e) {
    console.log('an error occured while fetching stories', params)
    return []
  }
  return allStories
}
