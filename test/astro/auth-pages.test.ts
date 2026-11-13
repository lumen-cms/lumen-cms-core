import { afterEach, beforeEach, expect, it, vi } from 'vitest'
const f = vi.hoisted(() => ({ page: vi.fn(), routes: vi.fn() }))
vi.mock('../../packages/lumen-cms-astro/src/server/pages', () => ({ loadPage: f.page, staticRoutes: f.routes }))
vi.mock('../../packages/lumen-cms-astro/src/server/errorPage', () => ({ loadErrorPage: vi.fn() }))
vi.mock('../../packages/lumen-cms-astro/src/server/travelPages', () => ({ loadTravelPage: vi.fn(), travelStaticRoutes: vi.fn() }))
import { getConsumerStaticPaths, loadConsumerPage } from '../../packages/lumen-cms-astro/src/server/consumerPages'
import { CmsPageProtectedError } from '../../packages/lumen-cms-astro/src/server/notFound'
beforeEach(() => { vi.resetAllMocks(); vi.stubEnv('LUMEN_AUTH_ENABLED', '1'); vi.stubEnv('LUMEN_PREVIEW_SECRET', '') })
afterEach(() => vi.unstubAllEnvs())
it('excludes protected and nested personalized content from public static routes', async () => {
 const routes = ['public', 'protected', 'personal'].map(slug => ({ params: { slug }, props: { cmsSlug: slug } }))
 f.routes.mockResolvedValue(routes)
 f.page.mockImplementation(async (slug: string) => {
  if (slug === 'protected') throw new CmsPageProtectedError(slug)
  return { page: { body: slug === 'personal' ? [{ body: [{ component: 'auth_container', body: [{ text: 'secret' }] }] }] : [] } }
 })
 expect(await getConsumerStaticPaths()).toEqual([routes[0]])
})
it('redirects guests to login, returns 403 to unauthorized users, and passes identity to the page guard', async () => {
 f.page.mockRejectedValue(new CmsPageProtectedError('account'))
 const context = { params: { slug: 'account' }, cookies: { get: () => undefined }, locals: { lumenAuth: { user: undefined as unknown } }, url: new URL('https://site.test/account?tab=profile'), response: { headers: new Headers() } }
 const guest = await loadConsumerPage(context as never) as Response
 expect(guest.status).toBe(303); expect(guest.headers.get('Location')).toBe('/auth/login?returnTo=%2Faccount%3Ftab%3Dprofile')
 context.locals.lumenAuth.user = { sub: 'reader', roles: ['reader'] }
 const denied = await loadConsumerPage(context as never) as Response
 expect(denied.status).toBe(403)
 expect(f.page.mock.calls.at(-1)?.at(-1)).toEqual(context.locals.lumenAuth.user)
 f.page.mockResolvedValue({ page: { body: [] } })
 expect(await loadConsumerPage(context as never)).toEqual({ page: { body: [] } })
})
