import type { APIRoute } from 'astro'
import { sitemapForRequest } from '../../src-server/pages/api/sitemap'

/** The public static build needs the same discovery endpoints as Next's rewrite.
 * Use the deployment origin, never Astro's prerender request hostname. */
export const staticSitemap: APIRoute = async context => {
 if (!context.site) {
  if (process.env.LUMEN_SITE) throw new Error('A public site URL is required for the sitemap')
  return new Response(null, { status: 404 }) // component-only fixture build
 }
 const request = new Request(new URL('/api/sitemap', context.site))
 const response = await sitemapForRequest(request)
 if (response.status !== 200) throw new Error('Cannot publish a site with a failed sitemap')
 return response
}
