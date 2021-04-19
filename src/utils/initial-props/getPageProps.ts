/* eslint-disable prefer-const */
import { prepareForStoryblok } from './prepareStoryblokRequest'
import { apiRequestResolver } from './storyblokDeliveryResolver'
import { processFormData, processListWidgetData } from './traversePageContent'
import {
  GlobalStoryblok,
  PageStoryblok
} from '../../typings/generated/components-schema'
import { AppPageProps, PagePropsOptions } from '../../typings/app'
import { SSR_CONFIG } from './ssrConfig'

SSR_CONFIG.ssrHooks.pageProps = [
  processListWidgetData,
  processFormData,
  ...SSR_CONFIG.ssrHooks.pageProps
]

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
  // let componentData = null
  // if (pageProps) {
  //   // traverse content and fetch list widget data
  //   componentData = await collectComponentData(
  //     pageProps,
  //     allCategories,
  //     allStories
  //   )
  // }
  const props: AppPageProps = {
    page: pageProps ? { ...pageProps, uuid: page?.data?.story?.uuid } : null,
    settings: settingsProps
      ? { ...settingsProps, uuid: settings?.data?.story?.uuid }
      : null,
    allCategories,
    allStaticContent,
    allStories,
    locale: options.locale || null,
    defaultLocale: options.defaultLocale,
    // listWidgetData: componentData || null,
    insideStoryblok: !!options.insideStoryblok,
    notFoundLocale: notFoundLocale || null
  }

  await Promise.all(SSR_CONFIG.ssrHooks.pageProps.map((func) => func(props)))
  delete props.allStories // make sure that allStories is not part of props (bloat..)
  return props
}

export default getPageProps
