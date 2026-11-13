import type { APIRoute } from 'astro'
import { safeReturnTo } from 'lumen-cms-shared/auth'
import { authEnabled, createAuth, privateHeaders } from './auth'
import { isPreviewRequest } from './request'
const json = (data: unknown, status = 200) => Response.json(data, { status, headers: privateHeaders })
const redirect = (path: string) => new Response(null, { status: 303, headers: { ...privateHeaders, Location: path } })
export const prerender = false
export const ALL: APIRoute = async ({ url, cookies, request }) => {
 if (!authEnabled()) return json({ error: 'Authentication is not configured' }, 404)
 if (isPreviewRequest(cookies)) return json({ error: 'Account actions are disabled in preview' }, 403)
 const auth = createAuth(cookies, request)
 const path = url.pathname.replace(/\/$/, '')
 try {
  if (path === '/api/account') {
   if (!['PATCH', 'DELETE'].includes(request.method)) return json({ error: 'Method not allowed' }, 405)
   // JSON + same-origin custom header prevent cross-site form submissions.
   if (request.headers.get('Origin') !== auth.config.origin || request.headers.get('X-Lumen-CSRF') !== '1') return json({ error: 'Invalid origin' }, 403)
   const user = await auth.user()
   if (!user) return json({ error: 'Authentication required' }, 401)
   if (!process.env.AUTH_API) return json({ error: 'Account service is not configured' }, 503)
   let profile: { given_name: string; family_name: string } | undefined
   if (request.method === 'PATCH') {
    const body = await request.json().catch(() => null)
    if (!body || typeof body.given_name !== 'string' || typeof body.family_name !== 'string' || !body.given_name.trim() || !body.family_name.trim() || body.given_name.length > 200 || body.family_name.length > 200) return json({ error: 'Invalid profile' }, 400)
    profile = { given_name: body.given_name.trim(), family_name: body.family_name.trim() }
   }
   const token = await auth.client.getAccessToken()
   const upstream = new URL(request.method === 'DELETE' ? '/api/delete-user' : '/api/update-user', process.env.AUTH_API)
   upstream.searchParams.set('sub', user.sub)
   if (profile) {
    for (const [key, value] of Object.entries(profile)) upstream.searchParams.set(key, value)
    if (user.email) upstream.searchParams.set('email', user.email)
   }
   const response = await fetch(upstream, { headers: { Authorization: `Bearer ${token.accessToken}` }, redirect: 'error', signal: AbortSignal.timeout(15000) })
   if (!response.ok) return json({ error: 'Account request failed' }, 502)
   if (profile) { await auth.updateProfile(profile); return json({ user: await auth.user() }) }
   await auth.clear()
   const logout = await auth.client.logout({ returnTo: auth.config.origin + '/' }).catch(() => new URL('/', auth.config.origin))
   return json({ redirect: logout.href })
  }
  if (request.method !== 'GET') return json({ error: 'Method not allowed' }, 405)
  if (path === '/api/auth/session') return json({ user: await auth.user() || null })
  if (path === '/refetch') return redirect('/')
  if (path === '/auth/login' || path === '/auth/signup') {
   const locale = url.searchParams.get('locale') || ''
   const target = await auth.client.startInteractiveLogin({ appState: { returnTo: safeReturnTo(url.searchParams.get('returnTo'), auth.config.origin), explicit: url.searchParams.has('returnTo') }, authorizationParams: { ...(path.endsWith('signup') ? { screen_hint: 'signup' } : {}), ...(/^[a-z]{2}(-[A-Z]{2})?$/.test(locale) ? { ui_locales: locale } : {}) } })
   return redirect(target.href)
  }
  if (path === '/auth/callback') {
   const result = await auth.client.completeInteractiveLogin<{ returnTo: string; explicit: boolean }>(url)
   const user = await auth.user()
   const locales = (process.env.LUMEN_LOCALES || 'en').split(',')
   const language = user?.language?.slice(0, 2)
   const fallback = language && language !== locales[0] && locales.includes(language) ? `/${language}/` : '/'
   const destination = safeReturnTo(result.appState?.explicit ? result.appState.returnTo : fallback, auth.config.origin)
   return redirect(destination)
  }
  if (path === '/auth/logout') {
   const destination = await auth.client.logout({ returnTo: auth.config.origin + '/' })
   if (destination.origin !== new URL('https://' + auth.config.domain).origin) throw new Error('Unexpected logout origin')
   return redirect(destination.href)
  }
  return json({ error: 'Not found' }, 404)
 } catch {
  return json({ error: path === '/auth/callback' ? 'Sign-in failed. Please start login again.' : 'Account request failed. Please try again.' }, path === '/auth/callback' ? 400 : 503)
 }
}
