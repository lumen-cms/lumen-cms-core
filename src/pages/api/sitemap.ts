import { SitemapStream, streamToPromise } from 'sitemap'
import { IncomingMessage, ServerResponse } from 'http'
import { internalLinkHandler } from 'lumen-cms-utils'
import { getAllStoriesOfProject } from '../../utils/initial-props/storyblokPagesConfig'
import { PageItem } from '../../typings/generated/schema'
import { SSR_CONFIG } from '../../utils/initial-props/ssrConfig'
// import { createGzip } from 'zlib'

export default async function sitemapApi(
  req: IncomingMessage,
  res: ServerResponse
) {
  // res.setHeader('Content-Encoding', 'gzip')
  try {
    const stories: PageItem[] = await getAllStoriesOfProject()
    const smStream = new SitemapStream({
      hostname: `https://${req.headers.host}`
    })
    const ignoreList =
      (process.env.SITEMAP_IGNORE_PATH &&
        process.env.SITEMAP_IGNORE_PATH.split(',')) ||
      []

    ignoreList.push('demo-content')

    for (let i = 0; i < stories.length; i++) {
      const story = stories[i]
      const fullSlug = story.full_slug as string
      const shouldIndex = !ignoreList.some((ignorePath: string) =>
        fullSlug.includes(ignorePath)
      )
      if (shouldIndex) {
        const isHome = story.slug === 'home'
        if (isHome) {
          smStream.write({
            url: fullSlug.replace('home', ''),
            lastmod: story.published_at,
            priority: 1.0
          })
        } else {
          smStream.write({
            url: internalLinkHandler(fullSlug),
            lastmod: story.published_at,
            priority: 0.5
          })
        }
      }
    }
    await Promise.all(SSR_CONFIG.ssrHooks.sitemap.map((func) => func(smStream)))
    smStream.end()

    const sitemap = await streamToPromise(smStream).then((sm) => sm.toString())

    res.setHeader('Content-Type', 'text/xml')
    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate')
    res.write(sitemap)
    res.end()
  } catch (e) {
    console.log(e)
    res.statusCode = 500
    res.end()
  }
}
