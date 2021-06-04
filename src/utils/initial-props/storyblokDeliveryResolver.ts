import { StoriesParams, StoryblokResult } from 'storyblok-js-client'
import { CONFIG } from '@CONFIG'
import { AppApiRequestPayload, PagePropsOptions } from '../../typings/app'
import { LmStoryblokService } from './StoryblokService'

const resolveAllPromises = (promises: Promise<any>[]) => {
  return Promise.all(
    promises.map((p) =>
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  return `cdn/stories/${locale ? `${locale}/` : ''}${
    CONFIG.rootDirectory ? `${CONFIG.rootDirectory}/` : ''
  }${overwriteSettingPath || ''}settings`
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
  if (CONFIG.rootDirectory || locale) {
    params.starts_with = `${locale ? `${locale}/` : ''}${
      CONFIG.rootDirectory ? `${CONFIG.rootDirectory}/` : ''
    }`
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
  if (CONFIG.rootDirectory || locale) {
    params.starts_with = `${locale ? `${locale}/` : ''}${
      CONFIG.rootDirectory ? `${CONFIG.rootDirectory}/` : ''
    }`
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
  if (CONFIG.rootDirectory || locale) {
    params.starts_with = `${locale ? `${locale}/` : ''}${
      CONFIG.rootDirectory ? `${CONFIG.rootDirectory}/` : ''
    }`
  }
  return params
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  // const cdnUrl = `https://cdn-api.lumen.media/api/all-stories?token=${
  //   CONFIG.previewToken
  // }&no_cache=true${locale ? `&locale=${locale}` : ''}`
  const currentSlug = `cdn/stories/${locale ? `${locale}/` : ''}${pageSlug}`
  const [page, settings, allCategories, allStories, allStaticContent] =
    await resolveAllPromises([
      LmStoryblokService.get(currentSlug),
      LmStoryblokService.get(getSettingsPath({ locale, overwriteSettingPath })),
      LmStoryblokService.getAll('cdn/stories', getCategoryParams({ locale })),
      // insideStoryblok || process.env.NODE_ENV !== 'production'
      //   ? fetch(cdnUrl).then((r) => r.json())
      //   : LmStoryblokService.getAll('cdn/stories', getStoriesParams({ locale })),
      LmStoryblokService.getAll('cdn/stories', getStoriesParams({ locale })),
      LmStoryblokService.getAll('cdn/stories', getStaticContainer({ locale }))
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
    allCategories,
    allStories,
    allStaticContent,
    listWidgetData: {},
    notFoundLocale
  }
}
