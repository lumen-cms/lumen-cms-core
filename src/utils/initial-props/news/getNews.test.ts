import { getNews } from './getNews'
import { getNewsFeed } from './getNewsFeed'

describe('test get news', () => {
  test('test get all news', async () => {
    const news = await getNews()
    expect(news.length > 0).toBeTruthy()
    expect(news.length > 0).toBeTruthy()
  })

  test('test news feed', async () => {
    const newsFeed = await getNewsFeed({
      title: 'Example',
      // description: '',
      id: 'Example News Feed',
      link: 'https://www.example.com',
      language: 'en-en', // optional, used only in RSS 2.0, possible values: http://www.w3.org/TR/REC-html40/struct/dirlang.html#langcodes
      // image: "http://example.com/image.png",
      // favicon: "http://example.com/favicon.ico",
      copyright: 'Example Copyright'
    })

    expect(newsFeed.startsWith('<?xml version')).toBeTruthy()
  })
})
