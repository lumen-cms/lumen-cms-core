import type { APIRoute, APIContext } from 'astro'
import { experimental_AstroContainer } from 'astro/container'
import StoryListFragment from '../components/StoryListFragment.astro'
import type { RenderContext } from '../lib/context'
import type { LmListStoriesProps, LmListStoriesPayload } from 'lumen-cms-shared/core/components/list-widget/listWidgetTypes'
import { getStoriesDefaultParams } from 'lumen-cms-shared/core/utils/universal/storyblokParamsHelper'
import { fetchStoryListPage, type PublicStoryListConfig } from '../client/storyListRequest'

type Content = LmListStoriesProps['content']
export interface StoryListEndpointOptions {
 /** Resolve an authorized page/context from the source path. Never accept a
  * client-supplied renderer, theme, token, or component configuration. */
 loadContext: (sourcePath: string, request: APIContext) => Promise<RenderContext | null>
 loadStories?: (config: PublicStoryListConfig, page: number, text: string, categories: string[]) => Promise<LmListStoriesPayload>
}
function findList(value: unknown, uid: string): Content | undefined {
 if (!value || typeof value !== 'object') return
 const item = value as Record<string, unknown>
 if (item.component === 'list_stories' && item._uid === uid) return item as Content
 for (const child of Object.values(item)) {
  const found = findList(child, uid)
  if (found) return found
 }
}
/** Same-origin published pagination, including Astro image optimization. */
export function createStoryListEndpoint(options: StoryListEndpointOptions): APIRoute {
 return async api => {
  const headers = { 'Cache-Control': 'private, no-store', 'Content-Type': 'application/json; charset=utf-8' }
  const response = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers })
  if (api.request.method !== 'GET') return new Response(null, { status: 405, headers: { ...headers, Allow: 'GET' } })
  const query = api.url.searchParams
  const source = query.get('source') || ''
  const uid = query.get('list') || ''
  const page = Number(query.get('page') || 1)
  if (!source.startsWith('/') || source.startsWith('//') || source.includes('\\') || /[?#]/.test(source) || !uid || !Number.isSafeInteger(page) || page < 1) return response({ error: 'invalid-request' }, 400)
  const context = await options.loadContext(source, api)
  if (!context) return response({ error: 'not-found' }, 404)
  // Draft delivery belongs to the authenticated preview renderer, not this
  // published-list endpoint. Its source loader must enforce page access too.
  if (context.preview || context.page.needAuth) return response({ error: 'unavailable' }, 403)
  const content = findList(context.page, uid)
  if (!content) return response({ error: 'not-found' }, 404)
  if (content.max_items) return response({ error: 'pagination-disabled' }, 400)
  const { starts_with, language, excluding_slugs, excluding_fields, resolve_links, resolve_relations } = getStoriesDefaultParams(context.page)
  const config = { content, publicToken: process.env.PUBLIC_STORYBLOK_TOKEN || '', defaults: { starts_with, language, excluding_slugs, excluding_fields, resolve_links, resolve_relations } }
  const data = await (options.loadStories || fetchStoryListPage)(config, page, query.get('search__text') || '', query.getAll('search__categories'))
  const container = await experimental_AstroContainer.create()
  const html = await container.renderToString(StoryListFragment, { props: { items: data.stories, content, context }, request: api.request })
  return response({ html, total: data.total, count: data.stories.length })
 }
}
