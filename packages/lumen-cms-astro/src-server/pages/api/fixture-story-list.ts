import type { ListStoriesData } from 'lumen-cms-shared/core/components/list-widget/listWidgetTypes'
import type { APIRoute } from 'astro'
import { createStoryListEndpoint } from '../../../src/server/storyLists'
import { context } from '../../fixtures/storyListContext'
const handler = createStoryListEndpoint({
 loadContext: async source => source === '/fixture-story-render' ? context : null,
 loadStories: async (_config, page, text) => ({ stories: text === 'empty' ? [] : [{ uuid: `server-${page}`, full_slug: 'server-story', name: text || 'normal', content: { component: 'page', preview_title: text || 'normal', preview_teaser: 'Rendered by the server' } } as unknown as ListStoriesData], total: text === 'empty' ? 0 : 4, page, cv: 1 })
})
export const ALL: APIRoute = api => process.env.LUMEN_SITE ? new Response(null, { status: 404 }) : handler(api)
