import type { APIRoute } from 'astro'

// Only public Meta SDK/configuration scripts. Never proxy collection, cookies,
// arbitrary hosts or redirects. Pixel configuration must not be shared-cache stale.
export const prerender = false
export const GET: APIRoute = async ({ params, request }) => {
 const path = params.path || ''
 const library = /^[a-z]{2}_[A-Z]{2}\/fbevents\.js$/.test(path)
 if (!library && !/^signals\/config\/\d+$/.test(path)) return new Response('Not found', { status: 404 })
 const upstream = new URL(`https://connect.facebook.net/${path}`)
 upstream.search = new URL(request.url).search
 try {
  const response = await fetch(upstream, { redirect: 'error', signal: AbortSignal.timeout(10000), headers: { Accept: 'application/javascript' } })
  if (!response.ok) return new Response('Facebook script unavailable', { status: 502 })
  return new Response(response.body, { headers: {
   'Content-Type': 'application/javascript; charset=utf-8',
   'X-Content-Type-Options': 'nosniff',
   'Cache-Control': library ? 'public, max-age=300, s-maxage=300' : 'private, no-store',
  } })
 } catch { return new Response('Facebook script unavailable', { status: 502 }) }
}
