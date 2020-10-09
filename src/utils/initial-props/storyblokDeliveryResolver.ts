import { CONFIG } from '@CONFIG'
import { AppApiRequestPayload } from '../../typings/app'

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

type ApiProps = {
  pageSlug: string
  locale?: string
  isLandingPage?: boolean
  insideStoryblok?: boolean
}
const configLanguages = CONFIG.languages

export const fetchSharedStoryblokContent = ({
  locale,
  insideStoryblok
}: {
  locale?: string
  insideStoryblok?: boolean
}) => {
  const isDev = insideStoryblok || process.env.NODE_ENV === 'development'
  const token = isDev ? CONFIG.previewToken : CONFIG.publicToken
  const getParams = new URLSearchParams()
  getParams.append('token', token)
  if (rootDirectory || locale) {
    getParams.append('locale', rootDirectory || (locale as string))
  }
  if (isDev) {
    getParams.append('no_cache', 'true')
  }
  return Promise.all([
    fetch(
      `https://cdn-api.lumen.media/api/single-story?token=${token}&slug=${getSettingsPath(
        { locale }
      )}${isDev ? '&no_cache=true' : ''}`
    ).then((r) => r.json()),
    fetch(
      `https://cdn-api.lumen.media/api/all-tag-categories?${getParams.toString()}`
    ).then((r) => r.json()),
    fetch(
      `https://cdn-api.lumen.media/api/all-stories?${getParams.toString()}`
    ).then((r) => r.json()),
    fetch(
      `https://cdn-api.lumen.media/api/all-static-container?${getParams.toString()}`
    ).then((r) => r.json())
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
  const all: any[] = [
    fetch(
      `https://cdn-api.lumen.media/api/single-story?slug=cdn/stories/${pageSlug}&${getParams.toString()}`
    ).then((r) => r.json())
  ]

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
        fetch(
          `https://cdn-api.lumen.media/api/single-story?slug=cdn/stories/${currentLocale}/${pageSlug}&${getParams.toString()}`
        ).then((r) => r.json())
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
