import { GetStaticPaths } from 'next'
import { ParsedUrlQuery } from 'querystring'
import { getAllStoriesOfProject } from './storyblokPagesConfig'
import { PageItem } from '../../typings/generated/schema'
import { internalLinkHandler } from '../internalLinkHandler'

const getFallbackMode = () => {
  if (process.env.NEXT_FALLBACK_MODE === 'true') {
    return true
  }
  if (process.env.NEXT_FALLBACK_MODE === 'false') {
    return false
  }
  if (process.env.NEXT_FALLBACK_MODE) {
    return process.env.NEXT_FALLBACK_MODE as 'blocking'
  }
  return 'blocking'
}

const pagesGetStaticPaths: GetStaticPaths = async ({
  defaultLocale,
  locales
}) => {
  const stories: PageItem[] = await getAllStoriesOfProject()

  let paths = stories.map((pageItem) => {
    const fullSlug = pageItem.full_slug || ''
    const internalLink = internalLinkHandler(fullSlug)
      .split('/')
      .filter((i) => i)
    const opts = {
      params: {
        index: internalLink
      } as ParsedUrlQuery,
      locale:
        locales?.find((k) => k === fullSlug?.split('/')[0]) || defaultLocale
    }
    return opts
  })
  if (process.env.TEST || process.env.ANALYZE) {
    paths = paths.slice(0, 2)
  }

  paths.push({ params: { index: [] }, locale: defaultLocale })
  locales?.forEach((loc) => {
    if (loc !== defaultLocale) {
      paths.push({ params: { index: [loc] }, locale: loc })
    }
  })
  return {
    paths,
    fallback: getFallbackMode()
  }
}

export default pagesGetStaticPaths
