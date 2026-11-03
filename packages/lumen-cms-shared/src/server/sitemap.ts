import { SitemapStream, streamToPromise } from 'sitemap'

type SitemapStory = { full_slug: string; slug: string; published_at?: string | null }
type SitemapEnvironment = Partial<Record<'SITEMAP_LOCALE' | 'SITEMAP_HOSTNAME' | 'LOCALE_DOMAIN_MAP' | 'SITEMAP_IGNORE_PATH' | 'PUBLIC_FIELD_LEVEL_TRANSLATION', string>>
export type SitemapHook = (stream: SitemapStream, locale?: string) => Promise<void>
export interface SitemapDependencies {
 loadStories(options: { language?: string }): Promise<SitemapStory[]>
 internalLink(slug: string): string
 environment: SitemapEnvironment
 hooks: SitemapHook[]
 onError?(error: unknown): void
}

export async function sitemapResponse(request: Request, dependencies: SitemapDependencies): Promise<Response> {
 let stream: SitemapStream | undefined
 try {
  const env = dependencies.environment
  const stories = await dependencies.loadStories({ language: env.SITEMAP_LOCALE || undefined })
  const host = request.headers.get('host') || new URL(request.url).host
  stream = new SitemapStream({ hostname: `https://${env.SITEMAP_HOSTNAME || host}` })
  // Listen before writing: invalid records or asynchronous hook errors may emit
  // stream errors before the final await, including while a hook is still running.
  const result = streamToPromise(stream)
  void result.catch(() => undefined)
  let locale = env.SITEMAP_LOCALE || undefined
  if (env.LOCALE_DOMAIN_MAP) {
   const mapping = JSON.parse(env.LOCALE_DOMAIN_MAP) as { domain: string; locale: string }[]
   locale = mapping.find(item => item.domain === host)?.locale || locale
  }
  const ignored = [...(env.SITEMAP_IGNORE_PATH ? env.SITEMAP_IGNORE_PATH.split(',') : []), 'demo-content']
  const urls = new Set<string>()
  for (const story of stories) {
   if (story.full_slug.split('/').includes('error-404') || ignored.some(path => story.full_slug.includes(path))) continue
   const home = story.slug === 'home'
   const slug = home ? story.full_slug.replace('home', '') : story.full_slug
   const stripLocale = (value: string) => env.PUBLIC_FIELD_LEVEL_TRANSLATION && env.SITEMAP_LOCALE ? value.replace(`/${env.SITEMAP_LOCALE}/`, '/') : value
   // Preserve the existing ordering: home locales are stripped before link
   // normalization; other page locales are stripped after normalization.
   const url = home ? dependencies.internalLink(stripLocale(slug)) : stripLocale(dependencies.internalLink(slug))
   if (urls.has(url)) continue
   urls.add(url)
   stream.write({ url, lastmod: story.published_at!, priority: home ? 1 : 0.5 })
  }
  await Promise.all(dependencies.hooks.map(hook => hook(stream!, locale)))
  stream.end()
  return new Response((await result).toString(), { headers: { 'Content-Type': 'text/xml', 'Cache-Control': 's-maxage=600, stale-while-revalidate' } })
 } catch (error) {
  stream?.destroy()
  dependencies.onError?.(error)
  return new Response(null, { status: 500 })
 }
}
