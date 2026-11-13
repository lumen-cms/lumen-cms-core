import { afterEach, expect, it, vi } from 'vitest'
import { hasRoles, matchAuthRule, normalizeUser, safeReturnTo } from '../../packages/lumen-cms-shared/src/auth'
import { createAuth, sessionName } from '../../packages/lumen-cms-astro/src/server/auth'
import { StatelessStateStore, type CookieHandler } from '../../packages/lumen-cms-astro/node_modules/@auth0/auth0-server-js'
import type { AstroCookies } from 'astro'
afterEach(() => vi.unstubAllEnvs())
it('normalizes only public claims and handles both supported role formats', () => {
 const user = normalizeUser({ sub: 'user', given_name: 'Ada', secret: 'hidden', permissions: [{ name: 'reader' }, { nope: true }] }, 'permissions', 'name')!
 expect(user.roles).toEqual(['reader']); expect(user).not.toHaveProperty('secret')
 expect(hasRoles(['reader'], user)).toBe(true); expect(hasRoles(['admin'], user)).toBe(false)
 expect(hasRoles(['any'], undefined)).toBe(false)
 expect(normalizeUser({ email: 'a@b.test' })).toBeUndefined()
})
it('matches segment boundaries and chooses the most specific localized rule', () => {
 const rules = [{ path: '/de/account', roles: ['any'] }, { path: '/de/account/admin', roles: ['admin'] }]
 expect(matchAuthRule('/de/accounting', rules)).toBeUndefined()
 expect(matchAuthRule('/de/account/admin?x=1', rules)?.roles).toEqual(['admin'])
})
it.each(['https://evil.test/', '//evil.test/', '/\\evil.test/', 'javascript:alert(1)'])('rejects unsafe return destination %s', target => {
 expect(safeReturnTo(target, 'https://site.test')).toBe('/')
})
it('retains same-origin destinations including query and fragment', () => {
 expect(safeReturnTo('https://site.test/de/book?a=1#buy', 'https://site.test')).toBe('/de/book?a=1#buy')
})
it('uses encrypted SDK sessions across requests, updates profiles and isolates users', async () => {
 for (const [key, value] of Object.entries({ AUTH0_DOMAIN: 'tenant.auth0.com', AUTH0_CLIENT_ID: 'client', AUTH0_CLIENT_SECRET: 'secret', AUTH0_SESSION_SECRET: 'a'.repeat(64), LUMEN_SITE_URL: 'https://site.test' })) vi.stubEnv(key, value)
 const values = new Map<string, string>()
 const handler: CookieHandler<undefined> = { getCookie: name => values.get(name), getCookies: () => Object.fromEntries(values), setCookie: (name, value) => { values.set(name, value) }, deleteCookie: name => { values.delete(name) } }
 const store = new StatelessStateStore({ secret: 'a'.repeat(64) }, handler)
 await store.set(sessionName, { user: { sub: 'u1', given_name: 'Before' }, idToken: undefined, refreshToken: undefined, tokenSets: [], internal: { sid: 'sid', createdAt: Math.floor(Date.now() / 1000) } })
 const cookies = { get: (key: string) => values.has(key) ? { value: values.get(key) } : undefined, set: (key: string, value: string) => values.set(key, value), delete: (key: string) => values.delete(key) } as unknown as AstroCookies
 const request = () => new Request('https://site.test', { headers: { cookie: [...values].map(([k,v]) => `${k}=${v}`).join('; ') } })
 const auth = createAuth(cookies, request())
 expect((await auth.user())?.sub).toBe('u1')
 await auth.updateProfile({ given_name: 'After', family_name: 'Name' })
 expect((await createAuth(cookies, request()).user())?.firstName).toBe('After')
 expect([...values.values()].join('')).not.toContain('After')
 const blank = { get: () => undefined, set: () => {}, delete: () => {} } as unknown as AstroCookies
 expect(await createAuth(blank).user()).toBeUndefined()
 await auth.clear(); expect(await createAuth(cookies, request()).user()).toBeUndefined()
 await store.set(sessionName, { user: { sub: 'expired' }, idToken: undefined, refreshToken: undefined, tokenSets: [], sessionExpiresAt: Math.floor(Date.now() / 1000) - 3600, internal: { sid: 'old', createdAt: Math.floor(Date.now() / 1000) - 7200 } })
 expect(await createAuth(cookies, request()).user()).toBeUndefined()
})
it('fails clearly when enabled auth is missing required configuration', () => {
 vi.stubEnv('AUTH0_DOMAIN', '')
 expect(() => createAuth({} as AstroCookies)).toThrow('AUTH0_DOMAIN is missing')
})
