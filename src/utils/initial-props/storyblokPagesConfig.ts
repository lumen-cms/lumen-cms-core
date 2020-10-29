import { CONFIG } from '@CONFIG'
import { StoriesParams } from 'storyblok-js-client'
import { PageItem } from '../../typings/generated/schema'
import { LmStoryblokService } from './StoryblokService'

export function getStoryblokPagesConfig(pageConfig?: StoriesParams) {
  const params: StoriesParams = {
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
  pageConfig?: StoriesParams
): Promise<PageItem[]> => {
  const cdnUrl = `https://cdn-api.lumen.media/api/all-stories?token=${CONFIG.previewToken}&no_cache=true`
  const stories: PageItem[] =
    process.env.NODE_ENV !== 'production'
      ? await fetch(cdnUrl).then((r) => r.json())
      : await LmStoryblokService.getAll(
          'cdn/stories',
          getStoryblokPagesConfig(pageConfig)
        )
  return stories
}
