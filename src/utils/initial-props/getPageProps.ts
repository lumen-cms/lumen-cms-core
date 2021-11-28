import { SSR_CONFIG } from '@SSR_CONFIG'
import cleanDeep from 'clean-deep'
import { prepareForStoryblok } from './prepareStoryblokRequest'
import { apiRequestResolver } from './storyblokDeliveryResolver'
import { fetchComponentData } from './component-data/traversePageContent'
import {
  GlobalStoryblok,
  PageStoryblok
} from '../../typings/generated/components-schema'
import { AppPageProps, PagePropsOptions } from '../../typings/app'
import { listWidgetGetData } from './component-data/listWidgetData'
import { googleFormGetData } from './component-data/googleFormData'
import { getCategoryData } from './component-data/categoryData'
import { getEventData } from './component-data/eventData'
import { listStoriesData } from './component-data/listStoriesData'
import { createPlaceholderImages } from './component-data/createPlaceholderImages'

SSR_CONFIG.ssrHooks.componentData = {
  list_widget: listWidgetGetData,
  form: googleFormGetData,
  category_box: getCategoryData,
  event_calendar: getEventData,
  list_stories: listStoriesData,
  parallax_item: createPlaceholderImages,
  background: createPlaceholderImages,
  image: createPlaceholderImages,
  section_video_bg: createPlaceholderImages,
  player: createPlaceholderImages
}

const getPageProps = async (
  slug: string | string[],
  options: PagePropsOptions
): Promise<AppPageProps> => {
  const { pageSlug } = prepareForStoryblok(slug, options)

  const { page, settings, notFoundLocale } = await apiRequestResolver({
    ...options,
    pageSlug
  })

  const pageProps = page?.data?.story?.content as PageStoryblok | undefined
  const settingsProps = settings?.data?.story?.content as
    | GlobalStoryblok
    | undefined

  if (!settings) {
    console.log('SETTINGS MISSING', slug, pageSlug)
  } else if (!pageProps) {
    console.log('PAGE MISSING', slug, pageSlug)
  }

  const pageSettingsProps = {
    page: pageProps ? { ...pageProps, uuid: page?.data?.story?.uuid } : null,
    settings: settingsProps
      ? { ...settingsProps, uuid: settings?.data?.story?.uuid }
      : null
  }

  // @ts-ignore
  if (pageSettingsProps.page?.component === 'global') {
    // edge case: in case settings page gets build overwrite default settings
    // @ts-ignore
    pageSettingsProps.settings = pageSettingsProps.page
  }
  const props: AppPageProps = {
    ...pageSettingsProps,
    ...options,
    notFoundLocale: notFoundLocale || null
  }

  await fetchComponentData(props)
  await Promise.all(SSR_CONFIG.ssrHooks.pageProps.map((func) => func(props)))

  return cleanDeep(props, {
    emptyObjects: false
  })
}

export default getPageProps
