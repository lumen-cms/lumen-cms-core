import { setStoryblokRequest } from './storyblokRequestContext'
import type { ISbStoryParams } from 'storyblok-js-client'
import { SSR_CONFIG } from './ssrConfig'
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
import { getAuth0RoleOnPath } from '../auth0/auth0Helpers'
import { LmStoryblokService } from './StoryblokService'
import { isDebugTiming, logTiming, timed } from './debugTiming'

SSR_CONFIG.ssrHooks.componentData = {
  list_widget: listWidgetGetData,
  form: googleFormGetData,
  category_box: getCategoryData,
  event_calendar: getEventData,
  list_stories: listStoriesData
}

const getPageProps = async (
  slug: string | string[],
  options: PagePropsOptions,
  requestParams?: ISbStoryParams
): Promise<AppPageProps> => {
  const { pageSlug } = prepareForStoryblok(slug, options)
  const startedAt = performance.now()
  const requestsBefore = LmStoryblokService.requestCount

  const { page, settings } = await timed(`${pageSlug} page+settings`, () =>
    apiRequestResolver({
      ...options,
      pageSlug,
      requestParams
    })
  )

  const pageProps = page?.data?.story?.content as PageStoryblok | undefined
  const settingsProps = settings?.data?.story?.content as
    | GlobalStoryblok
    | undefined

  if (!settings) {
    console.log('SETTINGS MISSING', slug, pageSlug)
  }
  if (!pageProps) {
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

  const needAuth = !!getAuth0RoleOnPath('/' + pageSlug, options)
  const props: AppPageProps = {
    ...pageSettingsProps,
    ...options,
    slug: '/' + pageSlug,
    needAuth
  }

  if (requestParams) setStoryblokRequest(props, requestParams)
  await Promise.all([
    timed(`${pageSlug} component data`, () => fetchComponentData(props)),
    typeof window === 'undefined' &&
      timed(`${pageSlug} google fonts`, () =>
        import('./processGoogleFonts').then(({ loadGoogleFontsCss }) =>
          loadGoogleFontsCss(props.settings)
        )
      )
  ])
  await timed(`${pageSlug} pageProps hooks`, () =>
    Promise.all(SSR_CONFIG.ssrHooks.pageProps.map((func) => func(props)))
  )
  if (isDebugTiming()) {
    // Concurrent renders share the service, so the count is approximate.
    logTiming(
      `${pageSlug} total (~${
        LmStoryblokService.requestCount - requestsBefore
      } Storyblok requests)`,
      startedAt
    )
  }

  return cleanDeep(props, {
    emptyObjects: false
  })
}

export default getPageProps
