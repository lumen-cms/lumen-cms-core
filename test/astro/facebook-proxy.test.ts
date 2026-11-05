import { afterEach, expect, it, vi } from 'vitest'
import { GET } from '../../packages/lumen-cms-astro/src/server/facebookScriptProxy'
import { trackingWorkerConfig } from '../../packages/lumen-cms-astro/build/tracking-workers.mjs'
const call = (path: string) => GET({ params: { path }, request: new Request('https://site.test/~facebook/' + path + '?domain=site.test&v=1') } as Parameters<typeof GET>[0])
afterEach(() => vi.unstubAllGlobals())
it('only proxies the SDK and numeric pixel configuration without forwarding cookies', async () => {
 const fetcher = vi.fn().mockResolvedValue(new Response('sdk', { headers: { 'set-cookie': 'unwanted=1' } }))
 vi.stubGlobal('fetch', fetcher)
 const result = await call('en_US/fbevents.js')
 expect(result.status).toBe(200)
 expect(await result.text()).toBe('sdk')
 expect(result.headers.get('set-cookie')).toBeNull()
 expect(fetcher.mock.calls[0][0].href).toBe('https://connect.facebook.net/en_US/fbevents.js?domain=site.test&v=1')
 expect(fetcher.mock.calls[0][1]).toMatchObject({ redirect: 'error', headers: { Accept: 'application/javascript' } })
 fetcher.mockResolvedValueOnce(new Response('config'))
 expect((await call('signals/config/123')).headers.get('cache-control')).toBe('private, no-store')
})
it('rejects arbitrary URLs, traversal, collection and malformed IDs before fetching', async () => {
 const fetcher = vi.fn(); vi.stubGlobal('fetch', fetcher)
 for (const path of ['https://evil.test/x', '../en_US/fbevents.js', 'signals/config/a', 'signals/config/123/extra', 'tr', '//evil.test/sdk.js', 'en_US/fbevents.js/..']) expect((await call(path)).status).toBe(404)
 expect(fetcher).not.toHaveBeenCalled()
})
it('returns an explicit failure for upstream errors', async () => {
 vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network')))
 expect((await call('en_US/fbevents.js')).status).toBe(502)
 vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('', { status: 403 })))
 expect((await call('en_US/fbevents.js')).status).toBe(502)
})
it('forwards Facebook and GA independently, proxying only Meta scripts', () => {
 const config = trackingWorkerConfig()
 expect(config.forward).toEqual(['gtag', 'dataLayer.push', 'fbq'])
 expect(trackingWorkerConfig({google:false}).forward).toEqual(['fbq'])
 const location = new URL('https://site.test/')
 expect(config.resolveUrl(new URL('https://connect.facebook.net/signals/config/123?v=1'),location,'script').href).toBe('https://site.test/~facebook/signals/config/123?v=1')
 for(const url of ['https://www.facebook.com/tr/?ev=PageView','https://www.googletagmanager.com/gtag/js?id=G-TEST','https://js.hs-scripts.com/123.js']) expect(config.resolveUrl(new URL(url),location,'script').href).toBe(url)
})
