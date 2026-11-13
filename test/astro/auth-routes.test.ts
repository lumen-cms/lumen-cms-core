import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { ALL } from '../../packages/lumen-cms-astro/src/server/authRoutes'
const f = vi.hoisted(() => ({ user: { sub: 'trusted-user', email: 'user@example.test', roles: [] } as Record<string, unknown> | undefined, update: vi.fn(), login: vi.fn(async () => new URL('https://tenant.auth0.com/authorize')), callback: vi.fn(async () => ({ appState: { explicit: true, returnTo: '/de/book' } })), logout: vi.fn(async () => new URL('https://tenant.auth0.com/logout')) }))
vi.mock('../../packages/lumen-cms-astro/src/server/auth', () => ({ authEnabled: () => true, privateHeaders: { 'Cache-Control': 'private, no-store' }, createAuth: () => ({ config: { origin: 'https://site.test' }, user: async () => f.user, updateProfile: f.update, clear: vi.fn(), client: { getAccessToken: async () => ({ accessToken: 'server-token' }), startInteractiveLogin: f.login, completeInteractiveLogin: f.callback, logout: f.logout } }) }))
vi.mock('../../packages/lumen-cms-astro/src/server/request', () => ({ isPreviewRequest: () => false }))
beforeEach(() => { f.user = { sub: 'trusted-user', email: 'user@example.test', roles: [] }; vi.stubEnv('AUTH_API', 'https://api.test'); vi.clearAllMocks() })
afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals() })
function call(path: string, method = 'GET', body?: unknown, csrf = true) {
 const url = new URL(path, 'https://site.test')
 return ALL({ url, cookies: {}, request: new Request(url, { method, headers: csrf ? { Origin: url.origin, 'X-Lumen-CSRF': '1', 'Content-Type': 'application/json' } : {}, body: body ? JSON.stringify(body) : undefined }) } as Parameters<typeof ALL>[0]) as Promise<Response>
}
it('serves only the public session and prevents caching', async () => {
 const response = await call('/api/auth/session'); expect(response.headers.get('Cache-Control')).toBe('private, no-store')
 expect(await response.json()).toEqual({ user: f.user })
 f.user = undefined; expect(await (await call('/api/auth/session')).json()).toEqual({ user: null })
})
it('passes signup hint and sanitizes returnTo before creating transaction state', async () => {
 expect((await call('/auth/signup?returnTo=https://evil.test&locale=de')).status).toBe(303)
 expect(f.login).toHaveBeenCalledWith(expect.objectContaining({ appState: { explicit: true, returnTo: '/' }, authorizationParams: { screen_hint: 'signup', ui_locales: 'de' } }))
})
it('validates callback through SDK and handles invalid transactions', async () => {
 expect((await call('/auth/callback?code=abc&state=xyz')).headers.get('Location')).toBe('/de/book')
 f.callback.mockRejectedValueOnce(new Error('bad state'))
 expect((await call('/auth/callback')).status).toBe(400)
})
it('rejects mutation without session or CSRF before contacting upstream', async () => {
 const fetcher = vi.fn(); vi.stubGlobal('fetch', fetcher)
 expect((await call('/api/account', 'DELETE', undefined, false)).status).toBe(403)
 f.user = undefined; expect((await call('/api/account', 'DELETE')).status).toBe(401)
 expect(fetcher).not.toHaveBeenCalled()
})
it('uses session sub, ignores injected identity and never sends token to browser', async () => {
 const fetcher = vi.fn(async () => new Response('{}')); vi.stubGlobal('fetch', fetcher)
 const response = await call('/api/account', 'PATCH', { sub: 'attacker', given_name: ' Ada ', family_name: 'Lovelace', email: 'attacker@test' })
 expect(response.status).toBe(200)
 const [url, options] = fetcher.mock.calls[0] as unknown as [URL, RequestInit]
 expect(url.searchParams.get('sub')).toBe('trusted-user'); expect(url.searchParams.get('email')).toBe('user@example.test')
 expect(options.headers).toEqual({ Authorization: 'Bearer server-token' })
 expect(f.update).toHaveBeenCalledWith({ given_name: 'Ada', family_name: 'Lovelace' })
 expect(await response.text()).not.toContain('server-token')
})
it('does not change local profile on upstream errors and ends session after deletion', async () => {
 vi.stubGlobal('fetch', vi.fn(async () => new Response('', { status: 500 })))
 expect((await call('/api/account', 'PATCH', { given_name: 'Ada', family_name: 'Name' })).status).toBe(502)
 expect(f.update).not.toHaveBeenCalled()
 vi.stubGlobal('fetch', vi.fn(async () => new Response('{}')))
 expect((await call('/api/account', 'DELETE')).status).toBe(200); expect(f.logout).toHaveBeenCalledOnce()
})
it('refetch redirects without requesting interactive login', async () => {
 expect((await call('/refetch')).headers.get('Location')).toBe('/')
 expect(f.login).not.toHaveBeenCalled()
})
