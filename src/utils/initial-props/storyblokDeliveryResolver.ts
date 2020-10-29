import { StoriesParams, StoryblokResult } from 'storyblok-js-client'
import { CONFIG } from '@CONFIG'
import { AppApiRequestPayload } from '../../typings/app'
import { LmStoryblokService } from './StoryblokService'

const { rootDirectory } = CONFIG

const resolveAllPromises = (promises: Promise<any>[]) => {
  return Promise.all(
    promises.map((p) =>
      p.catch(() => {
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
  const directory = rootDirectory || locale || ''
  console.log(locale, overwriteSettingPath)
  return `cdn/stories/${directory ? `${directory}/` : ''}${
    overwriteSettingPath || ''
  }settings`
}

const getCategoryParams = ({ locale }: { locale?: string }) => {
  const params: StoriesParams = {
    per_page: 100,
    sort_by: 'content.name:asc',
    filter_query: {
      component: {
        in: 'category'
      }
    }
  }
  if (rootDirectory) {
    params.starts_with = `${rootDirectory}/`
  } else if (locale) {
    params.starts_with = `${locale}/`
  }
  return params
}

const getStaticContainer = ({ locale }: { locale?: string }) => {
  const params: StoriesParams = {
    per_page: 25,
    sort_by: 'content.name:asc',
    filter_query: {
      component: {
        in: 'static_container'
      }
    }
  }
  if (rootDirectory) {
    params.starts_with = `${rootDirectory}/`
  } else if (locale) {
    params.starts_with = `${locale}/`
  }
  return params
}

const getStoriesParams = ({ locale }: { locale?: string }) => {
  const params: StoriesParams = {
    per_page: 100,
    excluding_fields:
      'body,right_body,meta_robots,property,meta_description,seo_body',
    sort_by: 'published_at:desc',
    filter_query: {
      component: {
        in: 'page'
      }
    }
  }
  if (rootDirectory) {
    params.starts_with = `${rootDirectory}/`
  } else if (locale) {
    params.starts_with = `${locale}/`
  }
  return params
}

type ApiProps = {
  pageSlug: string
  locale?: string
  isLandingPage?: boolean
  insideStoryblok?: boolean
}
const configLanguages = CONFIG.languages

export const fetchSettings = async ({
  locale
}: {
  locale?: string
}): Promise<StoryblokResult> => {
  return LmStoryblokService.get(getSettingsPath({ locale }))
}

export const fetchSharedStoryblokContent = ({
  locale,
  insideStoryblok,
  overwriteSettingPath
}: {
  locale?: string
  insideStoryblok?: boolean
  overwriteSettingPath?: string
}) => {
  const cdnUrl = `https://cdn-api.lumen.media/api/all-stories?token=${
    CONFIG.previewToken
  }&no_cache=true${locale ? `&locale=${locale}` : ''}`
  return Promise.all([
    LmStoryblokService.get(getSettingsPath({ locale, overwriteSettingPath })),
    LmStoryblokService.getAll('cdn/stories', getCategoryParams({ locale })),
    insideStoryblok || process.env.NODE_ENV !== 'production'
      ? fetch(cdnUrl).then((r) => r.json())
      : LmStoryblokService.getAll('cdn/stories', getStoriesParams({ locale })),
    LmStoryblokService.getAll('cdn/stories', getStaticContainer({ locale }))
  ])
}

export const apiRequestResolver = async ({
  pageSlug,
  locale,
  isLandingPage,
  insideStoryblok
}: ApiProps): Promise<AppApiRequestPayload> => {
  const overwriteSettingPath = CONFIG.overwriteSettingsPaths.find((path) =>
    pageSlug.includes(path)
  )
  console.log('[start] inside delivery resolver')

  const [
    settings,
    categories,
    stories,
    staticContent
  ] = await fetchSharedStoryblokContent({
    locale,
    insideStoryblok,
    overwriteSettingPath
  })
  console.log('[after shared] inside delivery resolver')
  const all: any[] = [LmStoryblokService.get(`cdn/stories/${pageSlug}`)]
  console.log("[after page] inside delivery resolver'")

  if (
    CONFIG.suppressSlugLocale &&
    configLanguages.length > 1 &&
    !isLandingPage
  ) {
    const [, ...languagesWithoutDefault] = configLanguages // make sure default language is always first of array
    if (CONFIG.suppressSlugIncludeDefault) {
      languagesWithoutDefault.unshift(CONFIG.defaultLocale)
    }
    languagesWithoutDefault.forEach((currentLocale) => {
      all.push(
        LmStoryblokService.get(`cdn/stories/${currentLocale}/${pageSlug}`)
      )
    })
  }

  // eslint-disable-next-line prefer-const
  let [page, ...otherPageLanguages] = await resolveAllPromises(all)

  if (page === null && otherPageLanguages.length) {
    otherPageLanguages.forEach((value, index) => {
      if (value) {
        locale =
          configLanguages[CONFIG.suppressSlugIncludeDefault ? index : index + 1] // overwrite locale
        page = value // overwrite page values of localized page
      }
    })

    // make 2nd API calls to fetch locale based settings and other values
    const [
      localizedSettings,
      localizedCategories,
      localizedStories,
      localizedStaticContent
    ] = await fetchSharedStoryblokContent({
      locale,
      insideStoryblok,
      overwriteSettingPath
    })

    return {
      page,
      locale,
      settings: localizedSettings,
      allCategories: localizedCategories,
      allStories: localizedStories,
      allStaticContent: localizedStaticContent,
      listWidgetData: {}
    }
  }

  return {
    page,
    settings,
    allCategories: categories,
    allStories: stories,
    locale,
    allStaticContent: staticContent,
    listWidgetData: {}
  }
}
