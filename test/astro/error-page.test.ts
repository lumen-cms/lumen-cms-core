import { afterEach, beforeEach, expect, it, vi } from 'vitest'
const mocks = vi.hoisted(() => ({ props: vi.fn(), page: vi.fn(), travel: vi.fn() }))
vi.mock('../../packages/lumen-cms-shared/src/core/utils/initial-props/getPageProps', () => ({ default: mocks.props }))
vi.mock('../../packages/lumen-cms-astro/src/server/pages', () => ({ loadPage: mocks.page, staticRoutes: vi.fn() }))
vi.mock('../../packages/lumen-cms-astro/src/server/travelPages', () => ({ loadTravelPage: mocks.travel }))
import { loadErrorPage } from '../../packages/lumen-cms-astro/src/server/errorPage'
import { loadConsumerPage, loadConsumerTravelPage } from '../../packages/lumen-cms-astro/src/server/consumerPages'
import { CmsPageNotFoundError, CmsPageProtectedError } from '../../packages/lumen-cms-astro/src/server/notFound'

afterEach(() => vi.unstubAllEnvs())
const options = { locale: 'de', defaultLocale: 'en', locales: ['en', 'de'], cmsSlug: 'de/missing' }
beforeEach(() => { vi.resetAllMocks(); vi.stubEnv('LUMEN_LOCALES', 'en,de'); vi.stubEnv('LUMEN_PREVIEW_SECRET', '') })

it('prerenders the original CMS slug with published data and never reads preview cookies', async () => {
 const props = { ...options, cmsSlug: 'de/website/home' }
 const context = { isPrerendered: true, props, params: { slug: 'de/website' }, get cookies() { throw new Error('Static pages must not read cookies') } }
 mocks.page.mockResolvedValue({ page: { component: 'page' } })
 await loadConsumerPage(context as never)
 expect(mocks.page).toHaveBeenCalledWith('de/website', props, false, { version: 'published' })
 mocks.page.mockRejectedValue(new CmsPageNotFoundError('de/website'))
 await expect(loadConsumerPage(context as never)).rejects.toBeInstanceOf(CmsPageNotFoundError)
})

it('loads the reserved story using the shared locale/root resolver and preserves CMS content', async () => {
 const data = { page: { component: 'page', body: [{ component: 'headline', text: 'Missing page' }] }, settings: { footer: [] } }
 mocks.props.mockResolvedValue(data)
 expect(await loadErrorPage(options)).toEqual({ ...data, pageNotFound: true })
 expect(mocks.props).toHaveBeenCalledWith('error-404', { locale: 'de', defaultLocale: 'en', locales: ['en', 'de'], insideStoryblok: false }, { version: 'published' })
 await loadErrorPage(options, true, { from_release: '42' })
 expect(mocks.props.mock.calls[1][2]).toEqual({ version: 'draft', from_release: '42' })
})

it('keeps settings when only the error story is missing, but does not expose protected content', async () => {
 mocks.props.mockResolvedValue({ page: null, settings: {} })
 expect(await loadErrorPage(options)).toMatchObject({ settings: {}, pageNotFound: true })
 mocks.props.mockResolvedValue({ settings: null })
 expect(await loadErrorPage(options)).toBeUndefined()
 mocks.props.mockResolvedValue({ settings: {}, needAuth: true })
 expect(await loadErrorPage(options)).toBeUndefined()
})

it.each([loadConsumerPage, loadConsumerTravelPage])('returns layout data with HTTP 404 before rendering', async loader => {
 mocks.page.mockRejectedValue(new CmsPageNotFoundError('missing'))
 mocks.travel.mockRejectedValue(new CmsPageNotFoundError('missing'))
 mocks.props.mockResolvedValue({ page: { component: 'page' }, settings: {} })
 const context = { params: { slug: 'missing' }, cookies: { get: () => undefined }, locals: {}, url: new URL('https://example.test/de/missing'), response: { status: 200, headers: new Headers() } }
 const page = await loader(context as never)
 expect(page).toMatchObject({ pageNotFound: true, settings: {} })
 expect(context.response.status).toBe(404)
 expect(context.response.headers.get('X-Robots-Tag')).toBe('noindex, nofollow')
 expect(mocks.props.mock.calls[0][1].locale).toBe('de')
})

it('preserves delivery errors and authentication failures', async () => {
 const context = { params: {}, cookies: { get: () => undefined }, locals: {}, url: new URL('https://example.test/'), response: { headers: new Headers() } }
 const failure = new Error('Delivery unavailable')
 mocks.page.mockRejectedValue(failure)
 await expect(loadConsumerPage(context as never)).rejects.toBe(failure)
 mocks.page.mockRejectedValue(new CmsPageProtectedError())
 expect(await loadConsumerPage(context as never)).toMatchObject({ status: 401 })
 expect(mocks.props).not.toHaveBeenCalled()
})
