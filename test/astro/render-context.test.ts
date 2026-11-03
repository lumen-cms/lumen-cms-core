import { expect, it } from 'vitest'
import { createRenderContext } from '../../packages/lumen-cms-astro/src/lib/renderContext'
import type { RenderContext } from '../../packages/lumen-cms-astro/src/lib/context'
it('uses the production renderer for published documents and preserves overrides', () => {
 const page = { locale: 'en', settings: {} } as RenderContext['page']
 expect(createRenderContext(page).storyListEndpoint).toBe('/api/story-list')
 expect(createRenderContext(page, { storyListEndpoint: '/custom/list' }).storyListEndpoint).toBe('/custom/list')
 expect(createRenderContext({ ...page, insideStoryblok: true }).storyListEndpoint).toBeUndefined()
})
