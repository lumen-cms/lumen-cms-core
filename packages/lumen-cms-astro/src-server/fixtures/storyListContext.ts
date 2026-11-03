import type { PageStoryblok } from 'lumen-cms-shared/core/typings/generated/components-schema'
import type { RenderContext } from '../../src/lib/context'
import type { LmListStoriesProps } from 'lumen-cms-shared/core/components/list-widget/listWidgetTypes'
import { createCmsTheme } from 'lumen-cms-shared/theme'
import ServerListLayout from '../../src/components/fixtures/ServerListLayout.astro'
export const content: LmListStoriesProps['content'] = { _uid: 'server-list', component: 'list_stories', enable_search: true, layout: [{ _uid: 'server-cards', component: 'card_list' }], list_stories_data: { total: 0, perPage: 2 } } as LmListStoriesProps['content']
export const context: RenderContext = { theme: createCmsTheme(), preview: false, storyListEndpoint: '/api/fixture-story-list', components: { card_list: ServerListLayout }, page: { locale: 'en', defaultLocale: 'en', page: { component: 'page', _uid: 'fixture', body: [content] } as unknown as PageStoryblok } }
