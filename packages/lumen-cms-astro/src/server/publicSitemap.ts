import type { APIRoute } from 'astro'
import { renderSitemap } from 'lumen-cms-shared/server/sitemap'
import { staticRoutes } from './pages'
import { getAuth0RoleOnPath } from 'lumen-cms-shared/core/utils/auth0/auth0Helpers'
import { publishedRouteStories } from './linkInventory'
import { travelStaticRoutes } from './travelPages'
import { pageOptions } from './request'

/** Use exactly the public route inventory; SEO exclusions do not remove pages
 * from getStaticPaths, only from search discovery. Never use the request host. */
export const GET: APIRoute = async ({ site }) => {
 if (process.env.LUMEN_BUILD_MODE !== 'public') return new Response(null, { status: 404 })
 if (!site) throw new Error('A public site URL is required for the sitemap')
 const options = pageOptions()
 const [routes, stories] = await Promise.all([
  staticRoutes(), publishedRouteStories(options.locales, !!process.env.PUBLIC_FIELD_LEVEL_TRANSLATION),
 ])
 const inventory = new Map(stories.map(story => [
  `${'locale' in story ? story.locale : ''}:${story.full_slug}`, story,
 ]))
 const ignored = (process.env.SITEMAP_IGNORE_PATH || '').split(',').filter(Boolean).concat('demo-content')
 const ignoredPattern = new RegExp(ignored.map(path => path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'))
 const entries: { url: string; lastmod?: string }[] = []
 const urls = new Set<string>()
 const write = (url: string, lastmod?: string | null) => {
  if (urls.has(url)) return
  urls.add(url)
  // Setting pathname preserves trailing spaces in external travel slugs;
  // resolving a URL string would silently trim them and point to a missing page.
  const location = new URL(site.origin)
  location.pathname = url
  entries.push({ url: location.href, ...(lastmod ? { lastmod } : {}) })
 }
 for (const route of routes) {
  const slug = route.props.cmsSlug
  if (getAuth0RoleOnPath('/' + slug, route.props)) continue
  const story = inventory.get(`${route.props.locale}:${slug}`) || inventory.get(`:${slug}`)
  if (/(?:^|\/)error-404(?:\/|$)/.test(slug) || ignoredPattern.test(slug)) continue
  if (String(story?.content.meta_robots) === 'true') continue
  write(`/${route.params.slug || ''}`, story?.published_at)
 }
 if (process.env.TRAVELS_SLUG) {
  for (const route of await travelStaticRoutes(options)) write(`/${route.params.slug}`)
 }
 return new Response(await renderSitemap(entries, site.origin), { headers: { 'Content-Type': 'application/xml; charset=utf-8' } })
}
