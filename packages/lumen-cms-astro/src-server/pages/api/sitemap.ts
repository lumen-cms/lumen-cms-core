import type { APIRoute } from 'astro'
import { sitemapResponse, type SitemapHook } from 'lumen-cms-shared/server/sitemap'
import { getAllStoriesOfProject } from 'lumen-cms-shared/core/utils/initial-props/storyblokPagesConfig'
import { internalLinkHandler } from 'lumen-cms-shared/links'
import { SSR_CONFIG } from 'lumen-cms-shared/core/utils/initial-props/ssrConfig'

export function sitemapForRequest(request: Request, additionalHooks: SitemapHook[] = []) {
 return sitemapResponse(request, {
  loadStories: getAllStoriesOfProject,
  // Sitemap URLs are a legacy public contract, including locale-home slashes.
  // The navigation helper's publicRoutes normalization intentionally differs.
  internalLink: url => internalLinkHandler(url, {
   rootDirectory: process.env.NEXT_PUBLIC_ROOT_DIRECTORY,
   suppressSlugLocale: !!process.env.NEXT_PUBLIC_SUPPRESS_SLUG_LOCALE,
   languages: process.env.NEXT_PUBLIC_LANGUAGES?.split(',') || [],
  }),
  environment: {
   SITEMAP_LOCALE: process.env.SITEMAP_LOCALE,
   SITEMAP_HOSTNAME: process.env.SITEMAP_HOSTNAME,
   LOCALE_DOMAIN_MAP: process.env.LOCALE_DOMAIN_MAP,
   SITEMAP_IGNORE_PATH: process.env.SITEMAP_IGNORE_PATH,
   NEXT_PUBLIC_FIELD_LEVEL_TRANSLATION: process.env.NEXT_PUBLIC_FIELD_LEVEL_TRANSLATION,
  },
  hooks: [...SSR_CONFIG.ssrHooks.sitemap, ...additionalHooks],
  onError: error => console.error('Sitemap generation failed', error),
 })
}
export function createSitemapApi(additionalHooks: SitemapHook[] = []): APIRoute {
 return ({ request }) => sitemapForRequest(request, additionalHooks)
}
export const ALL = createSitemapApi()
