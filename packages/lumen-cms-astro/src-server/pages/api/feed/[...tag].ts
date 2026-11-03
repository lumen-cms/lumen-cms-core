import type { APIRoute } from 'astro'
import { feedResponse } from 'lumen-cms-shared/server/feed'
import { getAllStoriesOfProject } from 'lumen-cms-shared/core/utils/initial-props/storyblokPagesConfig'
import { fetchSettings } from 'lumen-cms-shared/core/utils/initial-props/storyblokDeliveryResolver'

export const ALL: APIRoute = ({ request, params }) => feedResponse(request, params.tag, {
 loadStories: getAllStoriesOfProject,
 async loadSettings() {
  const settings = await fetchSettings({})
  if (!settings?.data.story) throw new Error('Feed settings could not be loaded')
  const content = settings.data.story.content
  return { website_title: content.website_title, seo_description: content.seo_description }
 },
})
