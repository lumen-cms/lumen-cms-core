import { afterEach, expect, it, vi } from 'vitest'
const fixture = vi.hoisted(() => ({ props: vi.fn() }))
vi.mock('../../packages/lumen-cms-shared/src/core/utils/initial-props/getPageProps', () => ({ default: fixture.props }))
vi.mock('../../packages/lumen-cms-astro/src/server/linkInventory', () => ({ publishedLinkIndex: async () => ({}), publishedRouteStories: async () => [] }))
import { loadPage } from '../../packages/lumen-cms-astro/src/server/pages'
import { CmsPageProtectedError } from '../../packages/lumen-cms-astro/src/server/notFound'
afterEach(() => vi.unstubAllEnvs())
it('guards the actual page loader with normalized roles before returning protected content', async () => {
 vi.stubEnv('AUTH_PATH_REQUIRED_ROLES', JSON.stringify([{ path: '/account', roles: ['any'] }, { path: '/account/admin', roles: ['admin'] }]))
 fixture.props.mockResolvedValue({ page: { component: 'page', body: [{ text: 'private' }] }, settings: {}, needAuth: true })
 const options = { cmsSlug: 'account/admin', locale: 'en', defaultLocale: 'en', locales: ['en'] }
 await expect(loadPage('account/admin', options)).rejects.toBeInstanceOf(CmsPageProtectedError)
 await expect(loadPage('account/admin', options, false, undefined, undefined, undefined, { sub: 'reader', roles: ['reader'] })).rejects.toBeInstanceOf(CmsPageProtectedError)
 const result = await loadPage('account/admin', options, false, undefined, undefined, undefined, { sub: 'admin', roles: ['admin'] })
 expect(result.page?.body).toEqual([{ text: 'private' }])
})
