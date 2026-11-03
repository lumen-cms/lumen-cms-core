import { afterEach, expect, it, vi } from 'vitest'
import { loadTravelPage, travelStaticRoutes } from '../../packages/lumen-cms-astro/src/server/travelPages'
import { getStaticProps as legacyTravelProps } from '../../src/travel/utils/travelProps'
import { CONFIG } from '../../src/utils/config'
import { SSR_CONFIG } from '../../src/utils/initial-props/ssrConfig'
import { getStoryblokRequest } from '../../src/utils/initial-props/storyblokRequestContext'
const mock = vi.hoisted(() => ({
 travel: vi.fn(async (_slug: string) => [{ id: 42, slug: 'bali', title: 'Trip', page_title: 'SEO trip', meta_description: 'SEO description', fileStoryblokByHeaderImageId: { url_new: 'https://example.test/photo.jpg' } }]),
 travels: vi.fn(async (_locale: string) => [{ slug: 'bali' }]),
 settings: vi.fn(async (_options: unknown) => ({ data: { story: { uuid: 'global', content: { component: 'global', footer: [] } } } })),
 fonts: vi.fn(async (_settings: unknown) => {}),
 enrich: vi.fn(async (_props: unknown) => {})
}))
vi.mock('../../packages/lumen-cms-astro/src/server/linkInventory', () => ({ publishedLinkIndex: vi.fn(async () => ({ 'page-id': 'about' })) }))
vi.mock('../../src/travel/utils/travel', () => ({ fetchTravel: mock.travel }))
vi.mock('../../src/travel/utils/travels', () => ({ fetchTravels: mock.travels }))
vi.mock('../../src/utils/initial-props/storyblokDeliveryResolver', () => ({ fetchSettings: mock.settings }))
vi.mock('../../src/utils/initial-props/processGoogleFonts', () => ({ loadGoogleFontsCss: mock.fonts }))
vi.mock('../../src/utils/initial-props/component-data/traversePageContent', () => ({ fetchComponentData: mock.enrich }))
const original = { fieldLevelTranslation: CONFIG.fieldLevelTranslation, enableLocaleSuffix: CONFIG.enableLocaleSuffix, overwriteSettingsPaths: CONFIG.overwriteSettingsPaths }
afterEach(() => { Object.assign(CONFIG, original); vi.unstubAllEnvs(); vi.clearAllMocks() })
it.each(['en', 'de'])('preserves legacy %s travel page metadata, settings, enrichment and preview release', async locale => {
 CONFIG.fieldLevelTranslation = true
 CONFIG.enableLocaleSuffix = true
 CONFIG.overwriteSettingsPaths = ['reisen/']
 const options = { locale, defaultLocale: 'en', locales: ['en', 'de'], preview: true, release: 'release-42' }
 const hook = vi.fn(async (props: unknown) => { expect(getStoryblokRequest(props as never)).toMatchObject({ version: 'draft', from_release: 'release-42', language: locale }) })
 SSR_CONFIG.ssrHooks.pageProps.push(hook)
 try {
  const legacy = await legacyTravelProps({ params: { slug: 'bali' }, ...options, previewData: { _storyblok_release: options.release } } as never)
  const legacySettings = mock.settings.mock.calls.at(-1)![0]
  const actual = await loadTravelPage('bali', options)
  expect(actual).toEqual((legacy as { props: unknown }).props)
  expect(mock.settings.mock.calls.at(-1)![0]).toEqual(legacySettings)
  expect(mock.enrich).toHaveBeenCalledTimes(2)
  expect(mock.fonts).toHaveBeenCalledTimes(2)
  expect(hook).toHaveBeenCalledTimes(2)
 } finally { SSR_CONFIG.ssrHooks.pageProps.pop() }
})
it('returns 404 errors for absent trips and preserves backend failures', async () => {
 const options = { locale: 'en', defaultLocale: 'en', locales: ['en'] }
 await expect(loadTravelPage(undefined, options)).rejects.toMatchObject({ name: 'CmsPageNotFoundError' })
 expect(mock.travel).not.toHaveBeenCalled()
 mock.travel.mockResolvedValueOnce([])
 await expect(loadTravelPage('missing', options)).rejects.toMatchObject({ name: 'CmsPageNotFoundError' })
 mock.travel.mockRejectedValueOnce(new Error('Backend unavailable'))
 await expect(loadTravelPage('trip', options)).rejects.toThrow('Backend unavailable')
})
it('does not send draft release parameters for published pages', async () => {
 await loadTravelPage('bali', { locale: 'en', defaultLocale: 'en', locales: ['en'], release: 'must-not-leak' })
 expect(mock.settings.mock.calls.at(-1)![0]).toMatchObject({ requestParams: {} })
 expect((mock.settings.mock.calls.at(-1)![0] as { requestParams: object }).requestParams).not.toHaveProperty('from_release')
})
it('enumerates native localized routes in development and supports configured prefixes', async () => {
 vi.stubEnv('NODE_ENV', 'development')
 vi.stubEnv('TRAVELS_SLUG', '')
 const routes = await travelStaticRoutes({ defaultLocale: 'en', locales: ['en', 'de'] })
 expect(routes.map(route => route.params.slug)).toEqual(['travels/bali', 'de/reisen/bali'])
 expect(routes[1].props).toEqual({ travelSlug: 'bali', locale: 'de', defaultLocale: 'en', locales: ['en', 'de'] })
 vi.stubEnv('TRAVELS_SLUG', 'journeys')
 expect((await travelStaticRoutes({ defaultLocale: 'de', locales: ['de', 'en'] })).map(route => route.params.slug)).toEqual(['journeys/bali', 'en/journeys/bali'])
 await expect(travelStaticRoutes({ defaultLocale: 'fr', locales: ['en'] })).rejects.toThrow('default locale')
 await expect(travelStaticRoutes({ defaultLocale: 'en', locales: ['en', 'de'], suppressSlugLocale: true, languages: ['de'] })).rejects.toThrow('Multiple travel entries')
})

// Feed identical backend fixtures to the independent legacy and Astro pipelines.
vi.mock('../../packages/lumen-cms-shared/src/core/travel/utils/travel', () => ({ fetchTravel: mock.travel }))
vi.mock('../../packages/lumen-cms-shared/src/core/travel/utils/travels', () => ({ fetchTravels: mock.travels }))
vi.mock('../../packages/lumen-cms-shared/src/core/utils/initial-props/storyblokDeliveryResolver', () => ({ fetchSettings: mock.settings }))
vi.mock('../../packages/lumen-cms-shared/src/core/utils/initial-props/processGoogleFonts', () => ({ loadGoogleFontsCss: mock.fonts }))
vi.mock('../../packages/lumen-cms-shared/src/core/utils/initial-props/component-data/traversePageContent', () => ({ fetchComponentData: mock.enrich }))
vi.mock('../../packages/lumen-cms-shared/src/core/utils/config', async () => import('../../src/utils/config'))
vi.mock('../../packages/lumen-cms-shared/src/core/utils/initial-props/ssrConfig', async () => import('../../src/utils/initial-props/ssrConfig'))
vi.mock('../../packages/lumen-cms-shared/src/core/utils/initial-props/storyblokRequestContext', async () => import('../../src/utils/initial-props/storyblokRequestContext'))
