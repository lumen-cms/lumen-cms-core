import type { GetStaticPaths, GetStaticProps } from 'next'
import cleanDeep from 'clean-deep'
import type { ISbStoryParams } from 'storyblok-js-client'
import { CONFIG } from '../../utils/config'
import type { AppPageProps } from '../../typings/app'
import type {
  GlobalStoryblok,
  PageStoryblok
} from '../../typings/generated/components-schema'
import { fetchSettings } from '../../utils/initial-props/storyblokDeliveryResolver'
import { prepareForStoryblok } from '../../utils/initial-props/prepareStoryblokRequest'
import { fetchComponentData } from '../../utils/initial-props/component-data/traversePageContent'
import { loadGoogleFontsCss } from '../../utils/initial-props/processGoogleFonts'
import { setStoryblokRequest } from '../../utils/initial-props/storyblokRequestContext'
import { SSR_CONFIG } from '../../utils/initial-props/ssrConfig'
import { fetchTravel } from './travel'
import { fetchTravels } from './travels'

export const getStaticProps: GetStaticProps<AppPageProps> = async (context) => {
  const slug = context.params?.slug
  if (typeof slug !== 'string' || !slug) return { notFound: true }
  const { locale, defaultLocale, locales, preview, previewData } = context
  const options = { locale, defaultLocale, locales, insideStoryblok: !!preview }
  const path = `${
    process.env.TRAVELS_SLUG || (locale === 'de' ? 'reisen' : 'travels')
  }/${slug}`
  const pageSlug: string = prepareForStoryblok(path, options).pageSlug
  const settingsLocale =
    locale !== defaultLocale || CONFIG.enableLocaleSuffix ? locale : undefined
  const release =
    preview &&
    previewData &&
    typeof previewData === 'object' &&
    '_storyblok_release' in previewData
      ? String(previewData._storyblok_release)
      : undefined
  const requestParams: ISbStoryParams = {
    ...(preview ? { version: 'draft' as const } : {}),
    ...(release ? { from_release: release } : {}),
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
  if (!travel) return { notFound: true }
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
  return {
    props: cleanDeep(props, { emptyObjects: false }),
    ...(process.env.REVALIDATE_PROPS
      ? { revalidate: parseInt(process.env.REVALIDATE_PROPS) }
      : {})
  }
}

export const getStaticPaths: GetStaticPaths = async ({
  locales,
  defaultLocale
}) => {
  if (process.env.NODE_ENV === 'development')
    return { paths: [], fallback: 'blocking' }
  const languages = locales?.length ? locales : [defaultLocale || 'en']
  const travels = await Promise.all(
    languages.map((locale) => fetchTravels(locale))
  )
  return {
    paths: travels.flatMap((items, index) =>
      items.map((travel) => ({
        params: { slug: travel.slug },
        ...(locales?.length ? { locale: languages[index] } : {})
      }))
    ),
    fallback: 'blocking'
  }
}
