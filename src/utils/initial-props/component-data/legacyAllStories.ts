import { LmStoryblokService } from '../StoryblokService'
import { localeStoriesHelper } from './localeStoriesHelper'
import { AppPageProps } from '../../../typings/app'
import { excludeListForStories } from '../../universal/storyblokParamsHelper'
import { ISbStoriesParams } from 'storyblok-js-client'

export const legacyAllStories = async (options: AppPageProps) => {
  const params: ISbStoriesParams = {
    per_page: 25,
    excluding_fields: excludeListForStories,
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
    return LmStoryblokService.getAll('cdn/stories', params)
  } catch (e) {
    console.log('an error occured while fetching legacy stories', params)
    return []
  }
}
