// @vitest-environment happy-dom
import { afterEach, expect, it, vi } from 'vitest'
import { authStore } from '../../packages/lumen-cms-astro/src/client/auth'
afterEach(() => vi.unstubAllGlobals())
it('deduplicates initial lookup, distinguishes errors from guests and publishes logout', async () => {
 let resolve!: (response: Response) => void
 const fetcher = vi.fn(() => new Promise<Response>(done => { resolve = done }))
 vi.stubGlobal('fetch', fetcher)
 const first = authStore.load(), second = authStore.load()
 expect(fetcher).toHaveBeenCalledOnce(); expect(authStore.status).toBe('loading')
 resolve(Response.json({}, { status: 503 })); await Promise.all([first, second])
 expect(authStore.status).toBe('error')
 const retry = authStore.load(); resolve(Response.json({ user: null })); await retry
 expect(authStore.status).toBe('anonymous')
 const login = authStore.load(); resolve(Response.json({ user: { sub: 'u', roles: [] } })); await login
 expect(authStore.status).toBe('authenticated'); expect(authStore.user?.sub).toBe('u')
 const listener = vi.fn(), unsubscribe = authStore.subscribe(listener)
 authStore.clear(); expect(authStore.user).toBeUndefined(); expect(listener).toHaveBeenCalledOnce()
 unsubscribe(); authStore.clear(); expect(listener).toHaveBeenCalledOnce()
})
