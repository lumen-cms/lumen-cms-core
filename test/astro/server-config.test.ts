import { afterEach, expect, it, vi } from 'vitest'
import { SSR_CONFIG } from '../../packages/lumen-cms-astro/src/server/config'
import { loadPage } from '../../packages/lumen-cms-astro/src/server/pages'

vi.mock('../../packages/lumen-cms-shared/src/core/utils/initial-props/storyblokDeliveryResolver', () => ({
 apiRequestResolver: vi.fn(async () => ({
  page: { data: { story: { uuid: 'page', content: { component: 'page', _uid: 'page', body: [{ component: 'consumer_fixture', _uid: 'custom', title: 'Custom block' }] } } } },
  settings: { data: { story: { uuid: 'settings', content: { component: 'global', _uid: 'settings', footer: [] } } } },
 })),
}))
vi.mock('../../packages/lumen-cms-shared/src/core/utils/initial-props/processGoogleFonts', () => ({ loadGoogleFontsCss: vi.fn(async () => {}) }))
const originalHooks = [...SSR_CONFIG.ssrHooks.pageProps]
afterEach(() => {
 SSR_CONFIG.ssrHooks.pageProps.splice(0, Infinity, ...originalHooks)
 delete SSR_CONFIG.ssrHooks.componentData.consumer_fixture
})

it('keeps core loaders and runs consumer component/page hooks through the Astro loader', async () => {
 expect(Object.keys(SSR_CONFIG.ssrHooks.componentData)).toEqual(expect.arrayContaining(['form', 'list_widget', 'list_stories', 'event_calendar', 'category_box']))
 const componentHook = vi.fn(async (block, page) => ({ title: block.title, locale: page.locale }))
 const pageHook = vi.fn(async page => { page.consumerResult = page.page.body[0].consumer_fixture_data })
 SSR_CONFIG.ssrHooks.componentData.consumer_fixture = componentHook
 SSR_CONFIG.ssrHooks.pageProps.push(pageHook)
 const result = await loadPage('example', { locale: 'en', defaultLocale: 'en', locales: ['en'], cmsSlug: 'example' })
 expect(componentHook).toHaveBeenCalledTimes(1)
 expect(pageHook).toHaveBeenCalledTimes(1)
 expect(result).toMatchObject({ consumerResult: { title: 'Custom block', locale: 'en' } })
})

it('propagates consumer hook failures instead of publishing incomplete enrichment', async () => {
 SSR_CONFIG.ssrHooks.componentData.consumer_fixture = async () => { throw new Error('Consumer backend unavailable') }
 await expect(loadPage('example', { locale: 'en', defaultLocale: 'en', locales: ['en'], cmsSlug: 'example' })).rejects.toThrow('Consumer backend unavailable')
})

it('shares registered sitemap hooks with the native endpoint', async () => {
 const { ALL } = await import('../../packages/lumen-cms-astro/src-server/pages/api/sitemap')
 const hook = vi.fn(async stream => { stream.write({ url: '/consumer-page' }) })
 SSR_CONFIG.ssrHooks.sitemap.push(hook)
 try {
  const response = await ALL({ request: new Request('https://example.test/api/sitemap') } as never)
  expect(response.status).toBe(200)
  expect(await response.text()).toContain('https://example.test/consumer-page')
  expect(hook).toHaveBeenCalledTimes(1)
 } finally { SSR_CONFIG.ssrHooks.sitemap.pop() }
})

it('shares the consumer CORS allowlist with the form endpoint', async () => {
 const { ALL } = await import('../../packages/lumen-cms-astro/src-server/pages/api/form-endpoint')
 SSR_CONFIG.corsWhitelistDomains.push('https://consumer.test')
 try {
  const response = await ALL({ request: new Request('https://example.test/api/form-endpoint', { method: 'OPTIONS', headers: { Origin: 'https://consumer.test' } }) } as never)
  expect(response.headers.get('access-control-allow-origin')).toBe('https://consumer.test')
 } finally { SSR_CONFIG.corsWhitelistDomains.pop() }
})

vi.mock('../../packages/lumen-cms-shared/src/core/utils/initial-props/storyblokPagesConfig', () => ({ getAllStoriesOfProject: vi.fn(async () => []) }))
