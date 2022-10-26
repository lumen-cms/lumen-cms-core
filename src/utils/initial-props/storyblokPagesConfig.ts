import { CONFIG } from '@CONFIG'
import { PageItem } from '../../typings/generated/schema'
import { LmStoryblokService } from './StoryblokService'
import { excludingFieldsForLists } from '../universal/storyblokParamsHelper'
import { ISbStoriesParams } from 'storyblok-js-client/types/interfaces'

export function getStoryblokPagesConfig(pageConfig?: ISbStoriesParams) {
  const params: ISbStoriesParams = {
    per_page: 100,
    excluding_fields: excludingFieldsForLists,
    sort_by: 'published_at:desc',
    filter_query: {
      component: {
        in: 'page'
      },
      meta_robots: {
        not_in: 'true'
      }
    },
    ...(pageConfig || {})
  }
  if (CONFIG.rootDirectory) {
    params.starts_with = `${CONFIG.rootDirectory}/`
  }
  if (CONFIG.excluding_slugs) {
    params.excluding_slugs = CONFIG.excluding_slugs
  }
  return params
}

export const getAllStoriesOfProject = async (
  pageConfig?: ISbStoriesParams
): Promise<PageItem[]> => {
  const all = await LmStoryblokService.getAll(
    'cdn/stories',
    getStoryblokPagesConfig(pageConfig)
  )
  return all
}
