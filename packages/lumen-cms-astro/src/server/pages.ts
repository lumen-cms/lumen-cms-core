// Reuse the framework-independent delivery/enrichment pipeline while its modules
// move into shared. A bundle audit guards against React/Next/MUI runtime imports.
import getPageProps from 'lumen-cms-shared/core/utils/initial-props/getPageProps'
import { publishedLinkStories, publishedLinkIndex } from './linkInventory'
import { createStaticRoutes, type CmsRoute } from 'lumen-cms-shared/server/routes'
import { getShopifyPageProps } from 'lumen-cms-shared/core/components/ecommerce/shopify/lib/getShopifyPageProps'
import type { RenderContext } from '../lib/context'
import type { ISbStoryParams, ISbStoryData } from 'storyblok-js-client'
import type { PageStoryblok, GlobalStoryblok, NewsStoryblok, EventStoryblok } from 'lumen-cms-shared/core/typings/generated/components-schema'
import { fetchComponentData } from 'lumen-cms-shared/core/utils/initial-props/component-data/traversePageContent'
import { setStoryblokRequest } from 'lumen-cms-shared/core/utils/initial-props/storyblokRequestContext'
import { SSR_CONFIG } from 'lumen-cms-shared/core/utils/initial-props/ssrConfig'
import { CmsPageNotFoundError, CmsPageProtectedError, isUnsupportedPageSlug } from './notFound'
import { previewProducts, type PreviewServerData } from '../lib/previewServerData'

export async function staticRoutes(): Promise<CmsRoute[]> {
  const locales = (process.env.LUMEN_LOCALES || 'en,de').split(',')
  const localeSet = new Set(locales)
  const config = {
    locales, defaultLocale: locales[0],
    rootDirectory: process.env.NEXT_PUBLIC_ROOT_DIRECTORY,
    suppressSlugLocale: !!process.env.NEXT_PUBLIC_SUPPRESS_SLUG_LOCALE,
    languages: process.env.NEXT_PUBLIC_LANGUAGES?.split(',')
  }
  // Development renders on demand: sample inventories must not break navigation
  // from search results or CMS links outside the visual-test selection.
  if (process.env.LUMEN_SAMPLE_ROUTES && !import.meta.env.DEV) {
    const paths: string[] = JSON.parse(process.env.LUMEN_SAMPLE_ROUTES)
    return paths.map(path => {
      const slug = path.replace(/^\/+|\/+$/g, '')
      const first = slug.split('/')[0]
      return { params: { slug: slug || undefined }, props: {
        locale: localeSet.has(first) ? first : config.defaultLocale,
        defaultLocale: config.defaultLocale, locales, cmsSlug: slug || 'home'
      } }
    })
  }
  // noindex controls discovery by search engines, not page availability. Next's
  // fallback used to serve these pages even when its initial inventory omitted them.
  return createStaticRoutes(await publishedLinkStories(), config)
}

export async function loadPage(slug: string | undefined, options: CmsRoute['props'], preview = false, requestParams?: ISbStoryParams, liveStory?: ISbStoryData<PageStoryblok | GlobalStoryblok | NewsStoryblok | EventStoryblok>, serverData?: PreviewServerData) {
  if (isUnsupportedPageSlug(slug)) throw new CmsPageNotFoundError(slug)
  const result = await getPageProps(slug?.split('/') || 'home', {
    locale: options.locale, defaultLocale: options.defaultLocale,
    locales: options.locales, insideStoryblok: preview
  }, requestParams)
  if (!result.page || !result.settings) throw new CmsPageNotFoundError(slug)
  if (result.needAuth && !preview) throw new CmsPageProtectedError(slug)
  if (preview && liveStory?.content) {
    let changed = false
    if (liveStory.content.component === 'global' && liveStory.uuid === result.settings.uuid) {
      result.settings = { ...liveStory.content, uuid: liveStory.uuid }; changed = true
    } else if (['page', 'news', 'event'].includes(liveStory.content.component) && liveStory.uuid === result.page.uuid) {
      // Legacy AppPageProps types page narrowly, although its renderer supports news/events.
      result.page = { ...liveStory.content, uuid: liveStory.uuid } as typeof result.page; changed = true
    }
    if (changed) {
      if (requestParams) setStoryblokRequest(result, requestParams)
      await Promise.all([
        fetchComponentData(result),
        import('lumen-cms-shared/core/utils/initial-props/processGoogleFonts').then(({ loadGoogleFontsCss }) => loadGoogleFontsCss(result.settings)),
      ])
      await Promise.all(SSR_CONFIG.ssrHooks.pageProps.map(hook => hook(result)))
    }
  }
  const enriched = result as RenderContext['page']
  // Reuse external catalog data on page edits. Global edits deliberately refetch
  // so changing store credentials/settings cannot retain the old catalog.
  if (preview && liveStory && liveStory.uuid === result.page.uuid && liveStory.content.component !== 'global' && !enriched.allShopifyProducts) {
    enriched.allShopifyProducts = previewProducts(enriched, serverData)
  }
  // Consumer Next apps registered this optional hook themselves. In Astro the
  // configured integration selects it, without requiring a React registry import.
  if (result.settings.ecommerce?.some(config => config.component === 'ecommerce_shopify_config') && !enriched.allShopifyProducts) await getShopifyPageProps(enriched)
  if (!preview) enriched.storyLinkIndex = await publishedLinkIndex(process.env.NEXT_PUBLIC_FIELD_LEVEL_TRANSLATION ? options.locale : undefined)
  return enriched
}
