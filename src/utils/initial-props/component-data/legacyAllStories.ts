import { getStoryblokRequest } from '../storyblokRequestContext'
import { LmStoryblokService } from '../StoryblokService'
import { localeStoriesHelper } from './localeStoriesHelper'
import { AppPageProps } from '../../../typings/app'
import { excludeListForStories } from '../../universal/storyblokParamsHelper'
import { ISbStoriesParams } from 'storyblok-js-client'

export const legacyAllStories = async (options: AppPageProps) => {
  const params: ISbStoriesParams = {
    per_page: 100,
    excluding_fields: excludeListForStories,
    sort_by: 'published_at:desc',
    ...localeStoriesHelper(options),
    ...getStoryblokRequest(options),
    filter_query: {
      component: {
        in: 'page'
      }
    }
  }
  if (options.insideStoryblok) {
    params.version = 'draft'
  }

  return LmStoryblokService.getAll('cdn/stories', params)
}
