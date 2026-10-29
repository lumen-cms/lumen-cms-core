import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { CONFIG } from '../config'
import { StoryblokServiceClass } from '../initial-props/StoryblokService'
import { getBrowserStories } from './browserClient'
import {
  fixtureFetch,
  fixturePage,
  related,
  story,
  target
} from '../initial-props/__fixtures__/storyblokDelivery'

const originalConfig = { ...CONFIG }
let requests: URL[]
let sequence = 0
beforeEach(() => {
  vi.stubEnv('NODE_ENV', 'production')
  vi.stubGlobal('window', {})
  Object.assign(CONFIG, {
    publicToken: `browser-test-${++sequence}`,
    previewToken: 'must-not-be-used'
  })
  requests = []
  vi.stubGlobal('fetch', vi.fn(fixtureFetch(requests)))
})
afterEach(() => Object.assign(CONFIG, originalConfig))

it('matches service pagination and preserves nested filters, locale and search parameters', async () => {
  const params = {
    page: 2,
    per_page: 2,
    language: 'de',
    starts_with: 'de/',
    search_term: 'a & b',
    filter_query: { component: { in: 'page' } }
  }
  const before = await new StoryblokServiceClass().getStories(params)
  const after = await getBrowserStories(params)
  expect(after).toEqual(before)
  expect(after.data.stories?.map((item) => item.uuid)).toEqual(['item-3'])
  const query = requests.at(-1)!.searchParams
  expect(query.get('search_term')).toBe('a & b')
  expect(query.get('filter_query[component][in]')).toBe('page')
  expect(query.get('language')).toBe('de')
  expect(query.get('starts_with')).toBe('de/')
})

it('pins a public cache version and ignores draft/token overrides in preview', async () => {
  await getBrowserStories({ version: 'draft', token: 'must-not-be-used' })
  await getBrowserStories({ page: 2 })
  expect(
    requests.filter((url) => url.pathname.endsWith('/spaces/me'))
  ).toHaveLength(1)
  for (const url of requests) {
    expect(url.searchParams.get('token')).toBe(CONFIG.publicToken)
    if (url.pathname.endsWith('/stories')) {
      expect(url.searchParams.get('version')).toBe('published')
      expect(url.searchParams.get('cv')).toBe('1')
    }
  }
})

it('matches nested and overflow relation/link resolution with pinned request context', async () => {
  vi.stubGlobal(
    'fetch',
    vi.fn(async (input: RequestInfo | URL) => {
      const url = new URL(input instanceof Request ? input.url : String(input))
      requests.push(url)
      const ids = url.searchParams.get('by_uuids')
      if (ids)
        return Response.json({
          stories:
            ids === 'target' ? [story('target', {}, target.url)] : related,
          cv: 7
        })
      return Response.json(
        {
          stories: [fixturePage('home')],
          rel_uuids: ['shared', 'inner'],
          link_uuids: ['target'],
          cv: 7
        },
        { headers: { total: '1', 'per-page': '25' } }
      )
    })
  )
  const params = {
    language: 'de',
    fallback_lang: 'en',
    from_release: '123',
    cv: 7
  }
  const before = await new StoryblokServiceClass().getStories(params)
  const after = await getBrowserStories(params)
  expect(after).toEqual(before)
  expect(
    after.data.stories?.[0].content.body[1].container.content.body[1].container
      .content.body[0].text
  ).toBe('Nested content')
  expect(after.data.stories?.[0].content.body[0].link.story.uuid).toBe('target')
  expect(() => JSON.stringify(after)).not.toThrow()
  for (const url of requests) {
    expect(url.searchParams.get('language')).toBe('de')
    expect(url.searchParams.get('fallback_lang')).toBe('en')
    expect(url.searchParams.get('from_release')).toBe('123')
    expect(url.searchParams.get('cv')).toBe('7')
    expect(url.searchParams.get('version')).toBe('published')
  }
})

it.each([401, 404])(
  'propagates HTTP %s instead of returning an empty list',
  async (status) => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => Response.json({ message: 'Failed' }, { status }))
    )
    await expect(getBrowserStories({ cv: 1 })).rejects.toMatchObject({
      response: { status }
    })
  }
)
