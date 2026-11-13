import type { AuthUser, AuthStatus } from 'lumen-cms-shared/auth'
let user: AuthUser | undefined
let status: AuthStatus = 'loading'
let pending: Promise<void> | undefined
let active = false
const listeners = new Set<() => void>()
const publish = () => listeners.forEach(listener => listener())
export const authStore = {
 activate() { active = true },
 get user() { return user }, get status() { return status },
 subscribe(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener) } },
 clear() { user = undefined; status = 'anonymous'; publish() },
 async load() {
  if (pending) return pending
  status = 'loading'; publish()
  pending = (async () => {
   try {
    const response = await fetch('/api/auth/session', { credentials: 'same-origin', cache: 'no-store' })
    if (!response.ok) throw new Error('Session unavailable')
    const data = await response.json()
    user = data.user || undefined; status = user ? 'authenticated' : 'anonymous'
   } catch { user = undefined; status = 'error' }
   finally { pending = undefined; publish() }
  })()
  return pending
 },
}
// Full navigation after logout ensures server-rendered account fragments disappear too.
if (typeof document !== 'undefined') {
 document.addEventListener('astro:page-load', () => { if (active) void authStore.load() })
 document.addEventListener('click', event => {
  const link = (event.target as Element).closest<HTMLAnchorElement>('a[href]')
  if (link && new URL(link.href, document.baseURI).pathname === '/auth/logout') authStore.clear()
 })
 window.addEventListener('pageshow', event => { if (event.persisted) window.location.reload() })
}
