import { ServerClient, SessionExpiredError, CookieTransactionStore, StatelessStateStore, type CookieHandler } from '@auth0/auth0-server-js'
import type { AstroCookies } from 'astro'
import { normalizeUser } from 'lumen-cms-shared/auth'
export const authEnabled = () => process.env.LUMEN_AUTH_ENABLED === '1'
export const sessionName = 'lumen_auth'
export const privateHeaders = { 'Cache-Control': 'private, no-store', 'X-Robots-Tag': 'noindex, nofollow' }
export function authConfig() {
 const required = ['AUTH0_DOMAIN', 'AUTH0_CLIENT_ID', 'AUTH0_CLIENT_SECRET', 'AUTH0_SESSION_SECRET', 'LUMEN_SITE_URL'] as const
 for (const key of required) if (!process.env[key]) throw new Error(`Auth enabled but ${key} is missing`)
 if (process.env.AUTH0_SESSION_SECRET!.length < 32) throw new Error('AUTH0_SESSION_SECRET must contain at least 32 characters')
 const origin = new URL(process.env.LUMEN_SITE_URL!).origin
 if (!origin.startsWith('https://') && !['localhost', '127.0.0.1', '[::1]'].includes(new URL(origin).hostname)) throw new Error('Auth requires HTTPS outside localhost')
 return { origin, secret: process.env.AUTH0_SESSION_SECRET!, domain: process.env.AUTH0_DOMAIN!, clientId: process.env.AUTH0_CLIENT_ID!, clientSecret: process.env.AUTH0_CLIENT_SECRET! }
}
/** Request-local adapter: cookie writes and identity never cross requests. */
export function createAuth(cookies: AstroCookies, request?: Request) {
 const config = authConfig()
 const names = new Set((request?.headers.get('cookie') || '').split(';').map(value => value.trim().split('=')[0]).filter(Boolean))
 const handler: CookieHandler<undefined> = {
  getCookie: name => cookies.get(name)?.value,
  getCookies: () => Object.fromEntries([...names].flatMap(name => { const value = cookies.get(name)?.value; return value === undefined ? [] : [[name, value]] })),
  setCookie: (name, value, options) => { names.add(name); cookies.set(name, value, { ...options, httpOnly: true, secure: config.origin.startsWith('https:'), sameSite: 'lax', path: '/' }) },
  deleteCookie: name => cookies.delete(name, { path: '/' }),
 }
 const stateStore = new StatelessStateStore({ secret: config.secret }, handler)
 const client = new ServerClient({ domain: config.domain, clientId: config.clientId, clientSecret: config.clientSecret,
  stateIdentifier: sessionName, stateStore, transactionStore: new CookieTransactionStore({ secret: config.secret }, handler),
  authorizationParams: { redirect_uri: config.origin + '/auth/callback', scope: 'openid profile email offline_access', ...(process.env.AUTH0_AUDIENCE ? { audience: process.env.AUTH0_AUDIENCE } : {}) },
 })
 return { client, config,
  async user() { try { return normalizeUser(await client.getUser(), process.env.AUTH_PERMISSION || 'roles', process.env.AUTH_PERMISSION_KEY) } catch (error) { if (error instanceof SessionExpiredError) { await stateStore.delete(sessionName); return undefined } throw error } },
  async updateProfile(profile: { given_name: string; family_name: string }) {
   const state = await stateStore.get(sessionName)
   if (!state?.user) throw new Error('Session missing')
   state.user = { ...state.user, ...profile }
   await stateStore.set(sessionName, state)
  },
  async clear() { await stateStore.delete(sessionName) },
 }
}
export type AuthAdapter = ReturnType<typeof createAuth>
