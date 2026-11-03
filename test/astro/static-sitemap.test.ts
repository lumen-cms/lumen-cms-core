import { expect, it, vi } from 'vitest'
import { staticSitemap } from '../../packages/lumen-cms-astro/src/server/staticSitemap'
const handler = vi.hoisted(() => vi.fn())
vi.mock('../../packages/lumen-cms-astro/src-server/pages/api/sitemap', () => ({ sitemapForRequest: handler }))
it('uses the deployment origin without touching prerender-only context getters', async () => {
 handler.mockResolvedValue(new Response('<urlset/>'))
 const context = { site: new URL('https://example.com'), get clientAddress() { throw new Error('Not available during prerender') } }
 expect((await staticSitemap(context as Parameters<typeof staticSitemap>[0])).status).toBe(200)
 expect(handler.mock.calls.at(-1)![0].url).toBe('https://example.com/api/sitemap')
})
it('fails publication if sitemap generation fails or the deployment origin is missing', async () => {
 handler.mockResolvedValue(new Response(null, { status: 500 }))
 await expect(staticSitemap({ site: new URL('https://example.com') } as Parameters<typeof staticSitemap>[0])).rejects.toThrow('failed sitemap')
 vi.stubEnv('LUMEN_SITE', 'bali')
 await expect(staticSitemap({} as Parameters<typeof staticSitemap>[0])).rejects.toThrow('site URL')
})
