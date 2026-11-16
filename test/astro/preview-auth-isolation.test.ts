import { afterEach, beforeEach, expect, it, vi } from 'vitest'
vi.mock('astro:middleware', () => ({ defineMiddleware: (handler: unknown) => handler }))
import lumenStoryblok from '../../packages/lumen-cms-astro/integration.mjs'
import { onRequest } from '../../packages/lumen-cms-astro/src/server/authMiddleware'
import { enterConsumerPreview } from '../../packages/lumen-cms-astro/src/server/request'
import { ALL as authRoute } from '../../packages/lumen-cms-astro/src/server/authRoutes'

beforeEach(() => {
 vi.stubEnv('LUMEN_AUTH_ENABLED', '1')
 vi.stubEnv('AUTH0_DOMAIN', '')
 vi.stubEnv('LUMEN_BUILD_MODE', 'preview')
 vi.stubEnv('LUMEN_PREVIEW_SECRET', 'preview-secret-with-at-least-32-characters')
 vi.stubEnv('STORYBLOK_PREVIEW_TOKEN', 'draft-token')
})
afterEach(() => vi.unstubAllEnvs())

it.each([true, false])('registers Auth0 only outside the Storyblok preview build (preview=%s)', async preview => {
 const options = { config: { output: 'server', adapter: {} }, injectScript: vi.fn(), addDevToolbarApp: vi.fn(), addMiddleware: vi.fn(), injectRoute: vi.fn(), updateConfig: vi.fn() }
 await lumenStoryblok({ preview, auth: true }).hooks['astro:config:setup'](options)
 const authMiddleware = options.addMiddleware.mock.calls.filter(([entry]) => entry.entrypoint.includes('authMiddleware'))
 expect(authMiddleware).toHaveLength(preview ? 0 : 1)
 expect(options.injectRoute.mock.calls.some(([entry]) => entry.pattern === '/auth/login')).toBe(!preview)
})

it.each(['preview', ''])('allows first preview entry without Auth0 configuration (mode=%s)', async mode => {
 vi.stubEnv('LUMEN_BUILD_MODE', mode)
 const values = new Map<string, string>()
 const cookies = { get: (key: string) => values.has(key) ? { value: values.get(key) } : undefined, set: (key: string, value: string) => values.set(key, value) }
 const context = { url: new URL(`https://preview.test/api/preview?secret=${process.env.LUMEN_PREVIEW_SECRET}&slug=settings`), cookies, locals: {}, isPrerendered: false }
 const response = await onRequest(context as never, () => enterConsumerPreview(context as never))
 expect(response.status).toBe(307)
 expect(response.headers.get('Location')).toBe('/settings?')
 expect(values.has('lumen_preview_auth')).toBe(true)
 context.url.searchParams.set('secret', 'invalid')
 expect((await onRequest(context as never, () => enterConsumerPreview(context as never))).status).toBe(401)
})

it('skips Auth0 on preview pages without a cookie and disables account endpoints', async () => {
 const context = { url: new URL('https://preview.test/settings'), cookies: { get: () => undefined }, locals: {}, isPrerendered: false }
 expect((await onRequest(context as never, async () => new Response('preview'))).status).toBe(200)
 expect(context.locals).toEqual({})
 expect((await authRoute(context as never)).status).toBe(404)
})

it('still requires Auth0 configuration on ordinary public dynamic requests', async () => {
 vi.stubEnv('LUMEN_BUILD_MODE', 'public')
 const context = { url: new URL('https://site.test/account'), cookies: { get: () => undefined }, locals: {}, isPrerendered: false }
 await expect(onRequest(context as never, async () => new Response())).rejects.toThrow('AUTH0_DOMAIN is missing')
})
