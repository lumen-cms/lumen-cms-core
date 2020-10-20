import { CONFIG } from '@CONFIG'
import { StoriesParams } from 'storyblok-js-client'
import { PageItem } from '../../typings/generated/schema'
import { LmStoryblokService } from './StoryblokService'

export function getStoryblokPagesConfig(pageConfig?: StoriesParams) {
  const params: StoriesParams = {
    ...{
      per_page: 100,
      excluding_fields:
        'body,right_body,property,meta_title,meta_description,seo_body,preview_title,preview_subtitle,preview_image,preview_teaser',
      sort_by: 'published_at:desc',
      filter_query: {
        component: {
          in: 'page'
        },
        meta_robots: {
          not_in: true
        }
      }
    },
    ...(pageConfig || {})
  }
  console.log(params)
  if (CONFIG.rootDirectory) {
    params.starts_with = `${CONFIG.rootDirectory}/`
  }
  return params
}

export const getAllStoriesOfProject = async (
  pageConfig?: StoriesParams
): Promise<PageItem[]> => {
  await LmStoryblokService.setCacheVersion()
  const stories: PageItem[] = await LmStoryblokService.getAll(
    'cdn/stories',
    getStoryblokPagesConfig(pageConfig)
  )
  return stories
}
