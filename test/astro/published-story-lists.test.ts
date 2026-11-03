import { afterEach, expect, it, vi } from 'vitest'
const { loadPage } = vi.hoisted(() => ({ loadPage: vi.fn() }))
vi.mock('../../packages/lumen-cms-astro/src/server/pages', () => ({ loadPage }))
vi.mock('../../packages/lumen-cms-astro/src/server/storyLists', () => ({ createStoryListEndpoint: vi.fn() }))
import { loadPublishedStoryContext } from '../../packages/lumen-cms-astro/src/server/publishedStoryLists'
import { CmsPageNotFoundError, CmsPageProtectedError } from '../../packages/lumen-cms-astro/src/server/notFound'
afterEach(() => { vi.resetAllMocks(); vi.unstubAllEnvs() })
it('loads localized source configuration using explicit published delivery', async () => {
 vi.stubEnv('LUMEN_LOCALES', 'en,de')
 loadPage.mockResolvedValue({ locale: 'de', settings: {} })
 const context = await loadPublishedStoryContext('/de/courses/')
 expect(loadPage).toHaveBeenCalledWith('de/courses', { locale: 'de', defaultLocale: 'en', locales: ['en','de'], cmsSlug: 'de/courses' }, false, { version: 'published' })
 expect(context?.storyListEndpoint).toBe('/api/story-list')
 expect(context?.preview).toBe(false)
})
it.each(['/a%2Fb/../private', '/%2e%2e/private', '/bad%ZZ', '/page%3Fversion=draft', '/page%5Cprivate'])('rejects invalid source %s before loading CMS content', async source => {
 expect(await loadPublishedStoryContext(source)).toBeNull()
 expect(loadPage).not.toHaveBeenCalled()
})
it.each([new CmsPageNotFoundError('missing'),new CmsPageProtectedError('private')])('does not expose unavailable page configuration (%s)', async error => {
 loadPage.mockRejectedValue(error)
 expect(await loadPublishedStoryContext('/private')).toBeNull()
})
it('propagates upstream failures instead of rendering a false empty success', async () => {
 loadPage.mockRejectedValue(new Error('upstream unavailable'))
 await expect(loadPublishedStoryContext('/page')).rejects.toThrow('upstream unavailable')
})
