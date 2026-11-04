import { afterEach, expect, it, vi } from 'vitest'
import { GET } from '../../packages/lumen-cms-astro/src/server/publicSitemap'
const mocks = vi.hoisted(() => ({ routes: vi.fn(), stories: vi.fn(), travels: vi.fn() }))
vi.mock('../../packages/lumen-cms-astro/src/server/pages', () => ({ staticRoutes: mocks.routes }))
vi.mock('../../packages/lumen-cms-astro/src/server/linkInventory', () => ({ publishedRouteStories: mocks.stories }))
vi.mock('../../packages/lumen-cms-astro/src/server/travelPages', () => ({ travelStaticRoutes: mocks.travels }))
afterEach(() => { vi.unstubAllEnvs(); vi.clearAllMocks() })
it('includes localized public paths and travel routes, excludes noindex and error stories', async () => {
 vi.stubEnv('LUMEN_BUILD_MODE', 'public')
 vi.stubEnv('LUMEN_LOCALES', 'en,de')
 vi.stubEnv('SITEMAP_IGNORE_PATH', 'foo.bar')
 vi.stubEnv('TRAVELS_SLUG', 'travels')
 const rows = [['home', '', 'en', false], ['de/home', 'de', 'de', false], ['private', 'private', 'en', true], ['error-404', 'error-404', 'en', false], ['foo.bar', 'foo.bar', 'en', false], ['fooXbar', 'fooXbar', 'en', false]] as const
 mocks.routes.mockResolvedValue(rows.map(([cmsSlug, slug, locale]) => ({ params: { slug }, props: { cmsSlug, locale } })))
 mocks.stories.mockResolvedValue(rows.map(([full_slug, , locale, meta_robots]) => ({ full_slug, locale, content: { meta_robots } })))
 mocks.travels.mockResolvedValue([{ params: { slug: 'travels/bali' } }, { params: { slug: 'de/reisen/bali' } }, { params: { slug: 'travels/Barcelona ' } }])
 const response = await GET({ site: new URL('https://public.test') } as never)
 const xml = await response.text()
 expect([...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1])).toEqual(['https://public.test/', 'https://public.test/de', 'https://public.test/fooXbar', 'https://public.test/travels/bali', 'https://public.test/de/reisen/bali', 'https://public.test/travels/Barcelona%20'])
})
it('does not fetch or expose a sitemap in SSR', async () => {
 vi.stubEnv('LUMEN_BUILD_MODE', 'preview')
 expect((await GET({} as never)).status).toBe(404)
 expect(mocks.routes).not.toHaveBeenCalled()
})
it('fails the build if a travel inventory fails', async () => {
 vi.stubEnv('LUMEN_BUILD_MODE', 'public')
 vi.stubEnv('TRAVELS_SLUG', 'reisen')
 mocks.routes.mockResolvedValue([])
 mocks.stories.mockResolvedValue([])
 mocks.travels.mockRejectedValue(new Error('inventory unavailable'))
 await expect(GET({ site: new URL('https://public.test') } as never)).rejects.toThrow('inventory unavailable')
})
