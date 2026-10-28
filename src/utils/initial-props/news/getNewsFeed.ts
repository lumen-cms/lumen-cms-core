import { Feed, FeedOptions } from 'feed'
import { getNews } from './getNews'

export const getNewsFeed = async (options: FeedOptions) => {
  const allNews = await getNews()
  const feed = new Feed({ ...options })
  allNews.forEach((newsItem) => {
    const firstBlock = newsItem.content.content?.content[0]
    const firstInline =
      firstBlock && 'content' in firstBlock
        ? firstBlock.content?.[0]
        : undefined
    return feed.addItem({
      title: newsItem.content.title || '',
      description: newsItem.content.description,
      id: `${newsItem.id}`,
      copyright: options.copyright,
      // Feed 6 validates URLs. Storyblok full_slug is normally relative.
      link: new URL(newsItem.full_slug, options.link || options.id).href,
      category: newsItem.content.category?.content?.name
        ? [{ name: newsItem.content.category?.content?.name }]
        : [],
      date: newsItem.published_at
        ? new Date(newsItem.published_at)
        : new Date(),
      content: firstInline?.type === 'text' ? firstInline.text : undefined,
      ...(newsItem.content.image?.filename
        ? { image: newsItem.content.image?.filename }
        : {})
    })
  })
  return feed.rss2()
}
