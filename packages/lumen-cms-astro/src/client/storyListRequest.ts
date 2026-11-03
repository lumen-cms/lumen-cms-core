import StoryblokClient from 'storyblok-js-client'
import type { ISbStoriesParams } from 'storyblok-js-client'
import type { ListStoriesStoryblok } from 'lumen-cms-shared/core/typings/generated/components-schema'
import type { LmListStoriesPayload } from 'lumen-cms-shared/core/components/list-widget/listWidgetTypes'
import { listStoriesParams } from 'lumen-cms-shared/listStories'

export interface PublicStoryListConfig {
 publicToken: string
 defaults: Pick<ISbStoriesParams, 'starts_with' | 'language' | 'excluding_slugs' | 'excluding_fields' | 'resolve_relations' | 'resolve_links'>
 content: ListStoriesStoryblok
}
const clients = new Map<string, StoryblokClient>()
/** Public static pages use published content; draft preview stays server-side. */
export async function fetchStoryListPage(config: PublicStoryListConfig, page: number, text = '', categories: string[] = []): Promise<LmListStoriesPayload> {
 let client = clients.get(config.publicToken)
 if (!client) { client = new StoryblokClient({ accessToken: config.publicToken }); clients.set(config.publicToken, client) }
 const params = listStoriesParams(config.content, config.defaults, page, text, categories)
 const { data, total } = await client.get('cdn/stories', { ...params, version: 'published' })
 return { stories: data.stories, total, cv: data.cv, page }
}
