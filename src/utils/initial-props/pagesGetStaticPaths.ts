import { GetStaticPaths } from 'next'
import { internalLinkHandler } from 'lumen-cms-utils'
import { getAllStoriesOfProject } from './storyblokPagesConfig'
import { PageItem } from '../../typings/generated/schema'

const pagesGetStaticPaths: GetStaticPaths = async () => {
  console.log('[start] inside of static paths')
  const stories: PageItem[] = await getAllStoriesOfProject()
  console.log('[end] inside of static paths')

  let paths = stories.map((pageItem) => {
    return {
      params: {
        index: internalLinkHandler(pageItem.full_slug as string)
          .split('/')
          .filter((i) => i)
      }
    }
  })
  if (process.env.TEST || process.env.ANALYZE) {
    paths = paths.slice(0, 2)
  }
  paths.push({ params: { index: [] } }) // landing page as empty
  return {
    paths,
    fallback: true
  }
}

export default pagesGetStaticPaths
