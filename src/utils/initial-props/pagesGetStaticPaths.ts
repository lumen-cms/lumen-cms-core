import { GetStaticPaths } from 'next'
import { internalLinkHandler } from 'lumen-cms-utils'
import { ParsedUrlQuery } from 'querystring'
import { getAllStoriesOfProject } from './storyblokPagesConfig'
import { PageItem } from '../../typings/generated/schema'

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
  return {
    paths,
    fallback: true
  }
}

export default pagesGetStaticPaths
