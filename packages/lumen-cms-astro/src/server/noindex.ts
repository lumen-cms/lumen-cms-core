import type { MiddlewareHandler } from 'astro'

/** All SSR responses, including unauthenticated pages, redirects and API errors. */
export const onRequest: MiddlewareHandler = async (_context, next) => {
 const response = await next()
 const headers = new Headers(response.headers)
 headers.set('X-Robots-Tag', 'noindex, nofollow')
 return new Response(response.body, { status: response.status, statusText: response.statusText, headers })
}
