import { beforeEach, describe, expect, test, vi } from 'vitest'
import { LmStoryblokService } from '../StoryblokService'

vi.mock('../StoryblokService', () => ({
  LmStoryblokService: {
    getAll: vi.fn(),
    richTextResolver: { render: vi.fn(() => '<p>News body</p>') }
  }
}))

beforeEach(() => {
  vi.mocked(LmStoryblokService.getAll).mockResolvedValue([
    {
      id: 1,
      full_slug: 'https://example.com/news/first',
      published_at: '2026-01-01T00:00:00Z',
      content: {
        title: 'First news',
        description: 'Description',
        content: {
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: 'News body' }]
            }
          ]
        }
      }
    }
  ])
})
import { getNews } from './getNews'
import { getNewsFeed } from './getNewsFeed'

describe('test get news', () => {
  test('test get all news', async () => {
    const news = await getNews()
    expect(news).toHaveLength(1)
    expect(news[0].contentHtml).toBe('<p>News body</p>')
    expect(LmStoryblokService.getAll).toHaveBeenCalledWith('cdn/stories', {
      filter_query: { component: { in: 'news' } }
    })
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
    expect(newsFeed).toContain('First news')
    expect(newsFeed).toContain('https://example.com/news/first')
  })
})
