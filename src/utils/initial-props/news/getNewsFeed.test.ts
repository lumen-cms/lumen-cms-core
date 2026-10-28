import { expect, it, vi } from 'vitest'
import { load } from 'cheerio'
import { getNews } from './getNews'
import { getNewsFeed } from './getNewsFeed'

vi.mock('./getNews', () => ({ getNews: vi.fn() }))

it('resolves Storyblok news slugs to absolute feed URLs without changing story IDs or content', async () => {
  vi.mocked(getNews).mockResolvedValue([
    {
      id: 42,
      full_slug: 'de/news/example',
      published_at: '2026-01-01T12:00:00Z',
      content: {
        title: 'News & updates',
        description: 'Description',
        content: {
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: 'Article excerpt' }]
            }
          ]
        },
        category: { content: { name: 'Updates' } },
        image: { filename: 'https://example.com/image.jpg' }
      }
    }
  ] as unknown as Awaited<ReturnType<typeof getNews>>)
  const xml = await getNewsFeed({
    title: 'Example',
    id: 'https://example.com',
    link: 'https://example.com',
    copyright: 'Company',
    updated: new Date('2026-01-02T00:00:00Z')
  })
  const $ = load(xml, { xml: true })
  expect($('item')).toHaveLength(1)
  expect($('item > link').text()).toBe('https://example.com/de/news/example')
  expect($('item > guid').text()).toBe('42')
  expect($('item > guid').attr('isPermaLink')).toBe('false')
  expect($('item > title').text()).toBe('News & updates')
  expect($('item > category').text()).toBe('Updates')
  expect($('item > pubDate').text()).toBe('Thu, 01 Jan 2026 12:00:00 GMT')
  expect($('item > enclosure').attr('url')).toBe(
    'https://example.com/image.jpg'
  )
  expect(xml).toContain('Article excerpt')
})
