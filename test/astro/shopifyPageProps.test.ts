import { beforeEach, expect, it, vi } from 'vitest'
const mocks = vi.hoisted(() => ({ page: vi.fn(), products: vi.fn(), sdk: vi.fn(), enrich: vi.fn(), fonts: vi.fn(), hook: vi.fn(), inventory: vi.fn() }))
vi.mock('../../packages/lumen-cms-shared/src/core/utils/initial-props/component-data/traversePageContent', () => ({ fetchComponentData: mocks.enrich }))
vi.mock('../../packages/lumen-cms-shared/src/core/utils/initial-props/processGoogleFonts', () => ({ loadGoogleFontsCss: mocks.fonts }))
vi.mock('../../packages/lumen-cms-shared/src/core/utils/initial-props/ssrConfig', () => ({ SSR_CONFIG: { ssrHooks: { pageProps: [mocks.hook] } } }))
vi.mock('../../packages/lumen-cms-shared/src/core/utils/initial-props/getPageProps', () => ({ default: mocks.page }))
vi.mock('../../packages/lumen-cms-shared/src/core/utils/initial-props/storyblokPagesConfig', () => ({ getAllStoriesOfProject: mocks.inventory }))
vi.mock('../../packages/lumen-cms-shared/src/core/components/ecommerce/shopify/lib/shopify-graphql-request', () => ({ shopifyGraphqlSdk: mocks.sdk }))
import { clearPublishedLinkInventory } from '../../packages/lumen-cms-astro/src/server/linkInventory'
import { loadPage, staticRoutes } from '../../packages/lumen-cms-astro/src/server/pages'
import { CmsPageNotFoundError } from '../../packages/lumen-cms-astro/src/server/notFound'
import { previewServerData } from '../../packages/lumen-cms-astro/src/lib/previewServerData'
import type { RenderContext } from '../../packages/lumen-cms-astro/src/lib/context'
import { getStoryblokRequest } from '../../packages/lumen-cms-shared/src/core/utils/initial-props/storyblokRequestContext'
import type { ISbStoryData } from 'storyblok-js-client'
import type { GlobalStoryblok, PageStoryblok, NewsStoryblok, EventStoryblok } from '../../packages/lumen-cms-shared/src/core/typings/generated/components-schema'
const options = { locale: 'en', defaultLocale: 'en', locales: ['en'], cmsSlug: 'product' }
const config = { component: 'ecommerce_shopify_config', domain: 'fixture.myshopify.com', access_token: 'public-test-token' }
it('starts the published inventory while Shopify enrichment is still pending', async () => {
 const products = Promise.withResolvers<{ products: { edges: [] } }>()
 mocks.products.mockReturnValueOnce(products.promise)
 mocks.page.mockResolvedValue({ page: { uuid: 'page-id' }, settings: { ecommerce: [config] } })
 const page = loadPage('product', options)
 try {
  await vi.waitFor(() => expect(mocks.inventory).toHaveBeenCalledOnce())
  expect(mocks.products).toHaveBeenCalledOnce()
 } finally {
  products.resolve({ products: { edges: [] } })
  await page
 }
 expect((await page).storyLinkIndex).toEqual({ 'page-id': 'product' })
})
it('uses SDK server data for matching preview edits without refetching Shopify', async () => {
 const original = { insideStoryblok: true, locale: 'en', page: { uuid: 'page-id' }, settings: { uuid: 'settings-id', ecommerce: [config] }, allShopifyProducts: [{ node: { handle: 'cached-product' } }] } as RenderContext['page']
 const data = previewServerData(original)
 expect(JSON.stringify(data)).not.toContain(config.access_token)
 mocks.page.mockImplementation(async () => ({ ...original, allShopifyProducts: undefined }))
 const result = await loadPage('product', options, true, undefined, liveStory('page-id', 'page'), data)
 expect(result.allShopifyProducts).toEqual(original.allShopifyProducts)
 expect(mocks.products).not.toHaveBeenCalled()
 await loadPage('product', options, false, undefined, undefined, data)
 expect(mocks.products).toHaveBeenCalledOnce()
})
it('refetches when the store changes and omits preview data on public or oversized pages', async () => {
 const original = { insideStoryblok: true, locale: 'en', page: { uuid: 'page-id' }, settings: { uuid: 'settings-id', ecommerce: [config] }, allShopifyProducts: [] } as RenderContext['page']
 const data = previewServerData(original)
 mocks.page.mockResolvedValue({ ...original, allShopifyProducts: undefined, settings: { ...original.settings, ecommerce: [{ ...config, domain: 'other.myshopify.com' }] } })
 await loadPage('product', options, true, undefined, liveStory('page-id', 'page'), data)
 expect(mocks.products).toHaveBeenCalledOnce()
 expect(previewServerData({ ...original, insideStoryblok: false })).toBeUndefined()
 expect(previewServerData({ ...original, allShopifyProducts: [{ node: { handle: 'x'.repeat(128 * 1024) } }] } as RenderContext['page'])).toBeUndefined()
})
it.each(['_dev_/fixture', '[object Object]/fixture'])('rejects reserved route %s without a delivery request', async slug => {
 await expect(loadPage(slug, options, true)).rejects.toBeInstanceOf(CmsPageNotFoundError)
 expect(mocks.page).not.toHaveBeenCalled()
})
it('distinguishes missing CMS content from delivery errors', async () => {
 mocks.page.mockResolvedValueOnce({ page: null, settings: {} })
 await expect(loadPage('missing', options, true)).rejects.toBeInstanceOf(CmsPageNotFoundError)
 mocks.page.mockResolvedValueOnce({ page: {}, settings: null })
 await expect(loadPage('missing-settings', options, true)).rejects.toBeInstanceOf(CmsPageNotFoundError)
 const failure = new Error('Delivery unavailable')
 mocks.page.mockRejectedValueOnce(failure)
 await expect(loadPage('unavailable', options, true)).rejects.toBe(failure)
})
beforeEach(() => {
 vi.clearAllMocks()
 clearPublishedLinkInventory()
 mocks.inventory.mockResolvedValue([{ uuid: 'page-id', full_slug: 'product' }])
 mocks.sdk.mockReturnValue({ allProducts: mocks.products })
 mocks.products.mockResolvedValue({ products: { edges: [{ node: { handle: 'product' } }] } })
})
const liveStory = (uuid: string, component: 'page' | 'global' | 'news' | 'event') => ({ uuid, content: { _uid: 'edited-block', component, body: [], meta_title: 'Unsaved title' } }) as unknown as ISbStoryData<PageStoryblok | GlobalStoryblok | NewsStoryblok | EventStoryblok>
it('renders matching unsaved SDK page payloads and re-enriches with release metadata', async () => {
 mocks.page.mockResolvedValue({ page: { component: 'page', uuid: 'page-id', meta_title: 'Saved' }, settings: { uuid: 'settings-id' } })
 const result = await loadPage('product', options, true, { from_release: 'release-id' }, liveStory('page-id', 'page'))
 expect(result.page?.meta_title).toBe('Unsaved title')
 expect(result.page?.uuid).toBe('page-id')
 expect(mocks.enrich).toHaveBeenCalledWith(result)
 expect(getStoryblokRequest(result)).toEqual({ from_release: 'release-id' })
 expect(mocks.fonts).toHaveBeenCalledWith(result.settings)
 expect(mocks.hook).toHaveBeenCalledWith(result)
})
it('refreshes matching global settings from the SDK payload', async () => {
 mocks.page.mockResolvedValue({ page: { uuid: 'page-id' }, settings: { uuid: 'settings-id' } })
 const result = await loadPage('product', options, true, undefined, liveStory('settings-id', 'global'))
 expect(result.settings?._uid).toBe('edited-block')
 expect(result.page?.uuid).toBe('page-id')
 expect(mocks.fonts).toHaveBeenCalledWith(result.settings)
})
it.each(['news', 'event'] as const)('updates %s stories through the same preview pipeline', async component => {
 mocks.page.mockResolvedValue({ page: { component, uuid: 'page-id' }, settings: { uuid: 'settings-id' } })
 const result = await loadPage('product', options, true, undefined, liveStory('page-id', component))
 expect(result.page?.component).toBe(component)
 expect(result.page?.meta_title).toBe('Unsaved title')
 expect(mocks.enrich).toHaveBeenCalledWith(result)
})
it('ignores unrelated SDK stories and all live payloads outside preview', async () => {
 mocks.page.mockImplementation(async () => ({ page: { uuid: 'page-id', meta_title: 'Saved' }, settings: { uuid: 'settings-id' } }))
 for (const [preview, uuid] of [[true, 'other-id'], [false, 'page-id']] as const) {
  const result = await loadPage('product', options, preview, undefined, liveStory(uuid, 'page'))
  expect(result.page?.meta_title).toBe('Saved')
 }
 // The unrelated preview payload still needs its deferred saved-page enrichment.
 expect(mocks.enrich).toHaveBeenCalledOnce()
 expect(mocks.hook).toHaveBeenCalledOnce()
})
it('enriches configured Astro pages using the existing Shopify server contract', async () => {
 mocks.page.mockResolvedValue({ page: { component: 'page' }, settings: { ecommerce: [config] } })
 const result = await loadPage('product', options)
 expect(mocks.sdk).toHaveBeenCalledWith({ domain: config.domain, accessToken: config.access_token })
 expect(result.allShopifyProducts).toEqual([{ node: { handle: 'product' } }])
})
it('does not fetch for unconfigured sites or replace data supplied by a consumer hook', async () => {
 mocks.page.mockResolvedValueOnce({ page: {}, settings: {} })
 await loadPage('product', options)
 mocks.page.mockResolvedValueOnce({ page: {}, settings: { ecommerce: [config] }, allShopifyProducts: [] })
 expect((await loadPage('product', options)).allShopifyProducts).toEqual([])
 expect(mocks.sdk).not.toHaveBeenCalled()
})
it('rejects protected static routes before requesting commerce data', async () => {
 mocks.page.mockResolvedValue({ page: {}, settings: { ecommerce: [config] }, needAuth: true })
 await expect(loadPage('product', options)).rejects.toThrow('Protected route cannot be statically published')
 expect(mocks.sdk).not.toHaveBeenCalled()
})
it('passes preview release metadata into the page loader for this request only', async () => {
 mocks.page.mockResolvedValue({ page: {}, settings: {} })
 await loadPage('product', options, true, { from_release: 'fixture-release' })
 expect(mocks.page).toHaveBeenLastCalledWith(['product'], { locale: 'en', defaultLocale: 'en', locales: ['en'], insideStoryblok: true }, { from_release: 'fixture-release' }, { defer: false })
 await loadPage('product', options)
 expect(mocks.page).toHaveBeenLastCalledWith(['product'], { locale: 'en', defaultLocale: 'en', locales: ['en'], insideStoryblok: false }, undefined, { defer: false })
})


it('exposes published non-sample and noindex pages during development', async () => {
 try {
  vi.stubEnv('DEV', true)
  vi.stubEnv('LUMEN_SAMPLE_ROUTES', '["/sample"]')
  vi.stubEnv('LUMEN_LOCALES', 'en,de')
  mocks.inventory.mockResolvedValue([{ full_slug: 'outside-sample' }, { full_slug: 'thank-you', content: { meta_robots: true } }, { full_slug: 'news/article', content: { component: 'news' } }, { full_slug: 'events/workshop', content: { component: 'event' } }])
  const routes = await staticRoutes()
  expect(routes.map(route => route.params.slug)).toContain('outside-sample')
  expect(routes.map(route => route.params.slug)).toContain('thank-you')
  expect(routes.map(route => route.params.slug)).toContain('news/article')
  expect(routes.map(route => route.params.slug)).toContain('events/workshop')
  expect(mocks.inventory).toHaveBeenCalledWith({ version: 'published', filter_query: { component: { in: 'page,news,event' } } })
 } finally { vi.unstubAllEnvs() }
})
it('keeps sample static builds limited to the requested routes', async () => {
 try {
  vi.stubEnv('DEV', false)
  vi.stubEnv('LUMEN_SAMPLE_ROUTES', '["/sample"]')
  mocks.inventory.mockClear()
  expect((await staticRoutes()).map(route => route.params.slug)).toEqual(['sample'])
  expect(mocks.inventory).not.toHaveBeenCalled()
 } finally { vi.unstubAllEnvs() }
})

it('loads nested home stories by the original CMS slug while keeping their public routes', async () => {
 mocks.inventory.mockResolvedValue([{ uuid: 'nested-home', full_slug: 'demo-content/home' }, { uuid: 'localized-home', full_slug: 'de/demo-content/home' }])
 mocks.page.mockResolvedValue({ page: { uuid: 'nested-home' }, settings: {} })
 vi.stubEnv('LUMEN_LOCALES', 'en,de')
 try {
  const routes = await staticRoutes()
  for (const path of ['demo-content', 'de/demo-content']) {
   const route = routes.find(route => route.params.slug === path)!
   expect(route.props.cmsSlug).toBe(`${path}/home`)
   await loadPage(route.params.slug, route.props)
   expect(mocks.page).toHaveBeenLastCalledWith(`${path}/home`.split('/'), expect.objectContaining({ locale: path.startsWith('de/') ? 'de' : 'en' }), undefined, { defer: false })
  }
 } finally { vi.unstubAllEnvs() }
})
