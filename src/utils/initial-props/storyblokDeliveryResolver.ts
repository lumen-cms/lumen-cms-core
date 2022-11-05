import { CONFIG } from '@CONFIG'
import { AppApiRequestPayload, PagePropsOptions } from '../../typings/app'
import { LmStoryblokService } from './StoryblokService'
import { ISbStoriesParams } from 'storyblok-js-client/types/interfaces'

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

export const fetchSettings = async ({ locale }: { locale?: string }) => {
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

  const params: ISbStoriesParams = {
    ...(CONFIG.fieldLevelTranslation && locale
      ? {
          language: locale
        }
      : {})
  }
  // @ts-ignore
  const [{ value: page }, { value: settings }] = await Promise.allSettled([
    LmStoryblokService.get(currentSlug, params),
    LmStoryblokService.get(
      getSettingsPath({ locale, overwriteSettingPath }),
      params
    )
  ])

  return {
    page,
    settings
  }
}
