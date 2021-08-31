import { StoriesParams, StoryblokResult } from 'storyblok-js-client'
import { CONFIG } from '@CONFIG'
import { AppApiRequestPayload, PagePropsOptions } from '../../typings/app'
import { LmStoryblokService } from './StoryblokService'

const resolveAllPromises = (promises: Promise<any>[]) => {
  return Promise.all(
    promises.map((p) =>
      p.catch((_error) => {
        // console.log(e)
        return null
      })
    )
  )
}

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
  return `cdn/stories/${
    locale && !CONFIG.fieldLevelTranslation ? `${locale}/` : ''
  }${CONFIG.rootDirectory ? `${CONFIG.rootDirectory}/` : ''}${
    overwriteSettingPath || ''
  }settings`
}

type ApiProps = PagePropsOptions & {
  pageSlug: string
}

export const fetchSettings = async ({
  locale
}: {
  locale?: string
}): Promise<StoryblokResult> => {
  return LmStoryblokService.get(getSettingsPath({ locale }))
}

export const apiRequestResolver = async ({
  pageSlug,
  insideStoryblok,
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
    ? `cdn/stories/${pageSlug}`
    : `cdn/stories/${locale ? `${locale}/` : ''}${pageSlug}`

  const params: StoriesParams = {
    ...(CONFIG.fieldLevelTranslation && locale
      ? {
          language: locale
        }
      : {})
  }
  const [page, settings] = await resolveAllPromises([
    LmStoryblokService.get(currentSlug, params),
    LmStoryblokService.get(
      getSettingsPath({ locale, overwriteSettingPath }),
      params
    )
  ])
  let notFoundLocale
  if (CONFIG.suppressSlugLocale && !page && Array.isArray(options.locales)) {
    const [, ...languagesWithoutDefault] = options.locales // make sure default language is always first of array
    const otherPageLanguages = await resolveAllPromises(
      languagesWithoutDefault.map((currentLocale) =>
        LmStoryblokService.get(`cdn/stories/${currentLocale}/${pageSlug}`)
      )
    )
    otherPageLanguages.forEach((value, index) => {
      if (value) {
        notFoundLocale = `/${
          (options?.locales && options.locales[index + 1]) || ''
        }/${pageSlug}` // overwrite locale
      }
    })
  }

  return {
    page,
    settings,
    notFoundLocale
  }
}
