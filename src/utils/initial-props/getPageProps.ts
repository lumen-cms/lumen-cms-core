/* eslint-disable prefer-const */
import { prepareForStoryblok } from './prepareStoryblokRequest'
import { apiRequestResolver } from './storyblokDeliveryResolver'
import { collectComponentData } from './traversePageContent'
import {
  GlobalStoryblok,
  PageStoryblok
} from '../../typings/generated/components-schema'
import { AppPageProps, PagePropsOptions } from '../../typings/app'
import { SSR_CONFIG } from './ssrConfig'

const getPageProps = async (
  slug: string | string[],
  options: PagePropsOptions
): Promise<AppPageProps> => {
  const { pageSlug } = prepareForStoryblok(slug, options)

  let {
    page,
    settings,
    allCategories = [],
    allStories = [],
    allStaticContent = [],
    notFoundLocale
  } = await apiRequestResolver({
    ...options,
    pageSlug
  })

  // const url = `https://${CONFIG.HOSTNAME}${seoSlug ? `/${seoSlug}` : ''}` // for seo purpose
  const pageProps = page?.data?.story?.content as PageStoryblok | undefined
  const settingsProps = settings?.data?.story?.content as
    | GlobalStoryblok
    | undefined

  if (!settings) {
    console.log('SETTINGS MISSNG')
  } else if (!pageProps) {
    console.log('PAGE MISSNG')
  }
  let componentData = null
  if (pageProps) {
    // traverse content and fetch list widget data
    componentData = await collectComponentData(
      pageProps,
      allCategories,
      allStories
      // ,
      // knownLocale
    )
  }
  const props = {
    page: pageProps ? { ...pageProps, uuid: page?.data?.story?.uuid } : null,
    settings: settingsProps
      ? { ...settingsProps, uuid: settings?.data?.story?.uuid }
      : null,
    allCategories,
    allStaticContent,
    locale: options.locale || null,
    listWidgetData: componentData || null,
    insideStoryblok: !!options.insideStoryblok,
    notFoundLocale: notFoundLocale || null
  }

  await Promise.all(SSR_CONFIG.ssrHooks.pageProps.map((func) => func(props)))

  return props
}

export default getPageProps
