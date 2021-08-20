import { Feed, FeedOptions } from 'feed'
import { getNews } from './getNews'

export const getNewsFeed = async (options: FeedOptions) => {
  const allNews = await getNews()
  const feed = new Feed({ ...options })
  allNews.forEach((newsItem) => {
    return feed.addItem({
      title: newsItem.content.title || '',
      description: newsItem.content.description,
      id: `${newsItem.id}`,
      copyright: options.copyright,
      link: newsItem.full_slug,
      category: newsItem.content.category?.content?.name
        ? [{ name: newsItem.content.category?.content?.name }]
        : [],
      date: newsItem.published_at
        ? new Date(newsItem.published_at)
        : new Date(),
      content: newsItem.content.content.content[0].content[0].text,
      ...(newsItem.content.image?.filename
        ? { image: newsItem.content.image?.filename }
        : {})
    })
  })
  return feed.rss2()
}
