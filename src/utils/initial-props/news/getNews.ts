import { LmStoryblokService } from '../StoryblokService'
import { LmNews } from '../../../components/news/newsTypes'
import { StoryData } from 'storyblok-js-client'

export const getNews = async (
  ignoreRichTextResolve?: boolean
): Promise<
  (StoryData<LmNews> & {
    contentHtml?: string
  })[]
> => {
  const news: StoryData<LmNews>[] = await LmStoryblokService.getAll(
    'cdn/stories',
    {
      filter_query: {
        component: {
          in: 'news'
        }
      }
    }
  )
  return ignoreRichTextResolve
    ? news
    : news.map((i) => {
        return {
          ...i,
          contentHtml: i.content?.content
            ? LmStoryblokService.richTextResolver.render(i.content.content)
            : null
        }
      })
}
