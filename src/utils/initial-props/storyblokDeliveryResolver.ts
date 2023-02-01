import { CONFIG } from '@CONFIG'
import { AppApiRequestPayload, PagePropsOptions } from '../../typings/app'
import { LmStoryblokService } from './StoryblokService'
import { ISbStoryParams } from 'storyblok-js-client'

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
}

export const fetchSettings = async ({ locale }: { locale?: string }) => {
  return LmStoryblokService.getStory(getSettingsPath({ locale }))
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
    ? pageSlug
    : `${locale ? `${locale}/` : ''}${pageSlug}`

  const params: ISbStoryParams = {
    ...(CONFIG.fieldLevelTranslation && locale
      ? {
          language: locale
        }
      : {})
  }

  // @ts-ignore
  const [{ value: page }, { value: settings }] = await Promise.allSettled([
    LmStoryblokService.getStory(currentSlug, params),
    LmStoryblokService.getStory(
      getSettingsPath({ locale, overwriteSettingPath }),
      params
    )
  ])

  return {
    page,
    settings
  }
}
