import { CONFIG } from '@CONFIG'
import { AppApiRequestPayload } from '../../typings/app'
import { LmStoryblokService } from './StoryblokService'
import { StoriesParams } from 'storyblok-js-client'

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

const getSettingsPath = ({ locale }: { locale?: string }) => {
  const directory = rootDirectory || locale || ''
  return `cdn/stories/${directory ? `${directory}/` : ''}settings`
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

// export const fetchSharedStoryblokContent = ({
//   locale,
//   insideStoryblok
// }: {
//   locale?: string
//   insideStoryblok?: boolean
// }) => {
//   const isDev = insideStoryblok || process.env.NODE_ENV === 'development'
//   const token = isDev ? CONFIG.previewToken : CONFIG.publicToken
//   const getParams = new URLSearchParams()
//   getParams.append('token', token)
//   if (rootDirectory || locale) {
//     getParams.append('locale', rootDirectory || (locale as string))
//   }
//   if (isDev) {
//     getParams.append('no_cache', 'true')
//   }
//   return Promise.all([
//     fetch(
//       `https://cdn-api.lumen.media/api/single-story?token=${token}&slug=${getSettingsPath(
//         { locale }
//       )}${isDev ? '&no_cache=true' : ''}`
//     ).then((r) => r.json()),
//     fetch(
//       `https://cdn-api.lumen.media/api/all-tag-categories?${getParams.toString()}`
//     ).then((r) => r.json()),
//     fetch(
//       `https://cdn-api.lumen.media/api/all-stories?${getParams.toString()}`
//     ).then((r) => r.json()),
//     fetch(
//       `https://cdn-api.lumen.media/api/all-static-container?${getParams.toString()}`
//     ).then((r) => r.json())
//   ])
// }
export const fetchSharedStoryblokContent = ({
  locale
}: {
  locale?: string
  insideStoryblok?: boolean
}) => {
  return Promise.all([
    LmStoryblokService.get(getSettingsPath({ locale })),
    LmStoryblokService.getAll('cdn/stories', getCategoryParams({ locale })),
    LmStoryblokService.getAll('cdn/stories', getStoriesParams({ locale })), //    Promise.resolve([])/**/,
    LmStoryblokService.getAll('cdn/stories', getStaticContainer({ locale }))
  ])
}

export const apiRequestResolver = async ({
  pageSlug,
  locale,
  isLandingPage,
  insideStoryblok
}: ApiProps): Promise<AppApiRequestPayload> => {
  const [
    settings,
    categories,
    stories,
    staticContent
  ] = await fetchSharedStoryblokContent({ locale, insideStoryblok })
  const isDev = insideStoryblok || process.env.NODE_ENV === 'development'
  const token = isDev ? CONFIG.previewToken : CONFIG.publicToken
  const getParams = new URLSearchParams()
  getParams.append('token', token)
  if (isDev) {
    getParams.append('no_cache', 'true')
  }
  const all: any[] = [LmStoryblokService.get(`cdn/stories/${pageSlug}`)]

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
      insideStoryblok
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
