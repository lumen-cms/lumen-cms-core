import cleanDeep from 'clean-deep'
import { publishedLinkIndex } from './linkInventory'
import type { RenderContext } from '../lib/context'
import type { ISbStoryParams } from 'storyblok-js-client'
import { CONFIG } from 'lumen-cms-shared/core/utils/config'
import type { AppPageProps } from 'lumen-cms-shared/core/typings/app'
import type {
  GlobalStoryblok,
  PageStoryblok
} from 'lumen-cms-shared/core/typings/generated/components-schema'
import { fetchSettings } from 'lumen-cms-shared/core/utils/initial-props/storyblokDeliveryResolver'
import { prepareForStoryblok } from 'lumen-cms-shared/core/utils/initial-props/prepareStoryblokRequest'
import { fetchComponentData } from 'lumen-cms-shared/core/utils/initial-props/component-data/traversePageContent'
import { loadGoogleFontsCss } from 'lumen-cms-shared/core/utils/initial-props/processGoogleFonts'
import { setStoryblokRequest } from 'lumen-cms-shared/core/utils/initial-props/storyblokRequestContext'
import { SSR_CONFIG } from 'lumen-cms-shared/core/utils/initial-props/ssrConfig'
import { fetchTravel } from 'lumen-cms-shared/core/travel/utils/travel'
import { fetchTravels } from 'lumen-cms-shared/core/travel/utils/travels'

import { CmsPageNotFoundError } from './notFound'
import type { RouteConfig } from 'lumen-cms-shared/server/routes'
import { travelDetailPath } from 'lumen-cms-shared/travelList'

export interface TravelPageOptions {
 locale: string
 defaultLocale: string
 locales: string[]
 preview?: boolean
 release?: string
}

/** Load native travel page data for Document; missing trips use the core 404 error. */
export async function loadTravelPage(slug: string | undefined, { locale, defaultLocale, locales, preview = false, release }: TravelPageOptions): Promise<AppPageProps> {
 if (!slug) throw new CmsPageNotFoundError(slug)
  const options = { locale, defaultLocale, locales, insideStoryblok: !!preview }
  const path = `${
    process.env.TRAVELS_SLUG || (locale === 'de' ? 'reisen' : 'travels')
  }/${slug}`
  const pageSlug: string = prepareForStoryblok(path, options).pageSlug
  const settingsLocale =
    locale !== defaultLocale || CONFIG.enableLocaleSuffix ? locale : undefined
  const requestParams: ISbStoryParams = {
    ...(preview ? { version: 'draft' as const } : {}),
    ...(preview && release ? { from_release: release } : {}),
    ...(CONFIG.fieldLevelTranslation && settingsLocale
      ? { language: settingsLocale }
      : {})
  }
  const [sets, travels] = await Promise.all([
    fetchSettings({
      locale: settingsLocale,
      overwriteSettingPath: CONFIG.overwriteSettingsPaths.find((path) =>
        pageSlug.includes(path)
      ),
      requestParams
    }),
    fetchTravel(slug)
  ])
  const travel = travels[0]
  if (!travel) throw new CmsPageNotFoundError(slug)
  const settings = sets?.data?.story?.content as GlobalStoryblok | undefined
  if (!settings) throw new Error(`Travel settings not found for ${pageSlug}`)

  const props: AppPageProps = {
    ...options,
    slug: '/' + pageSlug,
    settings: { ...settings, uuid: sets?.data?.story?.uuid },
    page: {
      _uid: travel.slug,
      component: 'page',
      uuid: travel.slug,
      meta_title: travel.page_title,
      meta_description: travel.meta_description,
      seo_body: [
        {
          component: 'seo_open_graph',
          _uid: 'seo_open_graph',
          images: [
            {
              component: 'image_core',
              _uid: 'travel-header',
              alt: travel.title,
              url:
                travel.fileStoryblokByHeaderImageId?.url_new ??
                process.env.NEXT_PUBLIC_TRAVEL_HEADER_FALLBACK_IMG
            }
          ]
        }
      ],
      body: [
        { ...travel, _uid: `travel-item${travel.id}`, component: 'travel' }
      ]
      // Travel is a runtime-registered block, absent from the generated CMS body union.
    } as unknown as PageStoryblok
  }
  setStoryblokRequest(props, requestParams)
  await Promise.all([
    fetchComponentData(props),
    loadGoogleFontsCss(props.settings)
  ])
  await Promise.all(SSR_CONFIG.ssrHooks.pageProps.map((hook) => hook(props)))
  if (!preview) (props as RenderContext['page']).storyLinkIndex = await publishedLinkIndex(CONFIG.fieldLevelTranslation ? locale : undefined)
  return cleanDeep(props, { emptyObjects: false })
}

/** For a consumer's [...slug].astro route. Unlike Next fallback, static Astro
 * builds need the full inventory; development can use this same route set. */
export async function travelStaticRoutes(config: RouteConfig) {
 if (!config.locales.includes(config.defaultLocale)) throw new Error('The default locale must be included in locales')
 const lists = await Promise.all(config.locales.map(locale => fetchTravels(locale)))
 const seen = new Set<string>()
 return lists.flatMap((items, index) => {
  const locale = config.locales[index]
  const prefix = process.env.TRAVELS_SLUG || (locale === 'de' ? 'reisen' : 'travels')
  return items.filter(travel => travel.slug).map(travel => {
   const path = travelDetailPath(travel.slug!, locale, config, prefix)
   if (seen.has(path)) throw new Error(`Multiple travel entries map to ${path}`)
   seen.add(path)
   return { params: { slug: path.slice(1) }, props: { travelSlug: travel.slug, locale, defaultLocale: config.defaultLocale, locales: [...config.locales] } }
  })
 })
}
