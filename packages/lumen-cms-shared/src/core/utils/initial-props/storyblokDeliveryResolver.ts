import { CONFIG } from '../config'
import { AppApiRequestPayload, PagePropsOptions } from '../../typings/app'
import { LmStoryblokService } from './StoryblokService'
import { ISbStoryParams, type ISbStoryData } from 'storyblok-js-client'

const getSettingsPath = ({
  locale,
  overwriteSettingPath
}: {
  locale?: string
  overwriteSettingPath?: string
}) => {
  if (overwriteSettingPath) {
    // ensure trailing slash
    overwriteSettingPath = overwriteSettingPath.endsWith('/')
      ? overwriteSettingPath
      : `${overwriteSettingPath}/`
  }
  return `${locale && !CONFIG.fieldLevelTranslation ? `${locale}/` : ''}${
    CONFIG.rootDirectory ? `${CONFIG.rootDirectory}/` : ''
  }${overwriteSettingPath || ''}settings`
}

type ApiProps = PagePropsOptions & {
  pageSlug: string
  requestParams?: ISbStoryParams
  liveStory?: ISbStoryData
}

export const fetchSettings = async ({
  locale,
  overwriteSettingPath,
  requestParams
}: {
  locale?: string
  overwriteSettingPath?: string
  requestParams?: ISbStoryParams
}) => {
  return LmStoryblokService.getStory(
    getSettingsPath({ locale, overwriteSettingPath }),
    requestParams
  )
}

export const apiRequestResolver = async ({
  pageSlug,
  insideStoryblok,
  requestParams,
  liveStory,
  ...options
}: ApiProps): Promise<AppApiRequestPayload> => {
  const locale =
    options.locale !== options.defaultLocale || CONFIG.enableLocaleSuffix
      ? options.locale
      : undefined
  const overwriteSettingPath = CONFIG.overwriteSettingsPaths.find((path) =>
    pageSlug.includes(path)
  )
  const currentSlug = CONFIG.fieldLevelTranslation
    ? pageSlug
    : `${locale ? `${locale}/` : ''}${pageSlug}`

  const params: ISbStoryParams = {
    ...requestParams,
    ...(insideStoryblok ? { version: 'draft' as const } : {}),
    ...(CONFIG.fieldLevelTranslation && locale
      ? {
          language: locale
        }
      : {})
  }

  const settingsSlug = getSettingsPath({ locale, overwriteSettingPath })
  // Only authenticated preview callers pass this payload. Match the exact CMS
  // path and language; unrelated/missing metadata must use normal delivery.
  // Never share edited data in the service cache or mutate the Bridge payload.
  const liveResponse =
    insideStoryblok &&
    liveStory?.uuid &&
    liveStory.content &&
    (!CONFIG.fieldLevelTranslation ||
      (liveStory.lang || 'default') === (params.language || 'default'))
      ? {
          data: { story: structuredClone(liveStory), cv: 0 },
          perPage: 1,
          total: 1
        }
      : undefined
  const pageFromPayload =
    liveResponse &&
    liveStory?.full_slug === currentSlug &&
    ['page', 'news', 'event', 'global'].includes(liveStory.content.component)
  const settingsFromPayload =
    liveResponse &&
    liveStory?.full_slug === settingsSlug &&
    liveStory.content.component === 'global'
  const [page, settings] = await Promise.all([
    pageFromPayload
      ? liveResponse
      : LmStoryblokService.getStory(currentSlug, params),
    settingsFromPayload
      ? liveResponse
      : LmStoryblokService.getStory(settingsSlug, params)
  ])

  return {
    page,
    settings
  }
}
