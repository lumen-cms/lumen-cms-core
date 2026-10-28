import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import StoryblokClient from 'storyblok-js-client'
import { CONFIG } from '@CONFIG'
import { StoryblokServiceClass } from './StoryblokService'
import { rootParams } from '../universal/storyblokParamsHelper'
import {
  fixtureFetch,
  fixturePage,
  related,
  story,
  target
} from './__fixtures__/storyblokDelivery'

const originalConfig = { ...CONFIG }
let requests: URL[]
beforeEach(() => {
  vi.stubEnv('NODE_ENV', 'production')
  vi.stubEnv('STORYBOOK', '')
  Object.assign(CONFIG, {
    publicToken: 'public-test',
    previewToken: 'preview-test'
  })
  requests = []
  vi.stubGlobal('fetch', vi.fn(fixtureFetch(requests)))
})
afterEach(() => Object.assign(CONFIG, originalConfig))

it('matches the legacy SDK for nested relations, links, and pagination metadata', async () => {
  const legacy = new StoryblokClient({
    accessToken: CONFIG.publicToken,
    cache: { type: 'none' }
  })
  legacy.resolveNestedRelations = true
  const service = new StoryblokServiceClass()
  const before = await legacy.getStory('home', {
    ...rootParams,
    version: 'published',
    cv: 1
  })
  const after = await service.getStory('home')
  expect(after?.data).toEqual(before.data)
  const beforeList = await legacy.getStories({
    ...rootParams,
    version: 'published',
    cv: 1,
    per_page: 2
  })
  const afterList = await service.getStories({ per_page: 2 })
  expect(afterList.data).toEqual(beforeList.data)
  expect([afterList.perPage, afterList.total]).toEqual([
    beforeList.perPage,
    beforeList.total
  ])
})

it('fetches every page, deduplicates concurrent calls, and isolates nested filters', async () => {
  const service = new StoryblokServiceClass()
  const params = { per_page: 2, filter_query: { component: { in: 'page' } } }
  const [first, second] = await Promise.all([
    service.getAll('cdn/stories', params),
    service.getAll('cdn/stories', params)
  ])
  expect(first.map((i) => i.uuid)).toEqual(['item-1', 'item-2', 'item-3'])
  expect(second).toEqual(first)
  first[0].content.preview_title = 'Mutation must not leak'
  expect(
    (await service.getAll('cdn/stories', params))[0].content.preview_title
  ).toBe('Item 1')
  expect(
    requests.filter((url) => url.pathname.endsWith('/stories'))
  ).toHaveLength(2)
  await service.getAll('cdn/stories', {
    ...params,
    filter_query: { component: { in: 'news' } }
  })
  expect(
    requests.filter((url) => url.pathname.endsWith('/stories'))
  ).toHaveLength(4)
})

it('separates settings and cache versions by site token and language', async () => {
  const service = new StoryblokServiceClass()
  const first = await service.getStory('settings')
  CONFIG.publicToken = 'second-space'
  const second = await service.getStory('settings')
  await service.getStory('settings', { language: 'de' })
  expect(await service.getStory('settings')).toEqual(second)
  expect(first).not.toBe(second)
  expect(
    requests
      .filter((url) => url.pathname.endsWith('/spaces/me'))
      .map((url) => url.searchParams.get('token'))
  ).toEqual(['public-test', 'second-space'])
  expect(
    requests.filter((url) => url.pathname.endsWith('/settings'))
  ).toHaveLength(3)
})

it('keeps draft/release requests fresh and separate from subsequent published requests', async () => {
  const service = new StoryblokServiceClass()
  await service.getStory('home', {
    version: 'draft',
    from_release: '123',
    language: 'de'
  })
  await service.getStory('home', {
    version: 'draft',
    from_release: '123',
    language: 'de'
  })
  await service.getStory('home')
  const pages = requests.filter((url) => url.pathname.endsWith('/home'))
  expect(pages.map((url) => url.searchParams.get('token'))).toEqual([
    'preview-test',
    'preview-test',
    'public-test'
  ])
  expect(pages[0].searchParams.get('from_release')).toBe('123')
  expect(pages[0].searchParams.get('language')).toBe('de')
  expect(pages[2].searchParams.has('from_release')).toBe(false)
})

it('resolves overflow relations and links with the original language and release', async () => {
  vi.stubGlobal(
    'fetch',
    vi.fn(async (input: RequestInfo | URL) => {
      const url = new URL(input instanceof Request ? input.url : String(input))
      requests.push(url)
      if (url.pathname.endsWith('/home'))
        return Response.json({
          story: fixturePage('home'),
          rel_uuids: ['shared', 'inner'],
          link_uuids: ['target'],
          cv: 1
        })
      const stories =
        url.searchParams.get('by_uuids') === 'target'
          ? [story('target', {}, target.url)]
          : related
      return Response.json({ stories, cv: 1 })
    })
  )
  const result = await new StoryblokServiceClass().getStory('home', {
    version: 'draft',
    language: 'de',
    from_release: '123'
  })
  expect(
    result?.data.story?.content.body[1].container.content.body[1].container
      .content.body[0].text
  ).toBe('Nested content')
  expect(result?.data.story?.content.body[0].link.story.uuid).toBe('target')
  for (const request of requests) {
    expect(request.searchParams.get('token')).toBe('preview-test')
    expect(request.searchParams.get('language')).toBe('de')
    expect(request.searchParams.get('from_release')).toBe('123')
  }
})

it('returns null for missing pages, but rejects authorization failures', async () => {
  const fetchMock = vi.fn(async () =>
    Response.json({ message: 'Not found' }, { status: 404 })
  )
  vi.stubGlobal('fetch', fetchMock)
  const service = new StoryblokServiceClass()
  expect(await service.getStory('missing', { version: 'draft' })).toBeNull()
  fetchMock.mockImplementation(async () =>
    Response.json({ message: 'Unauthorized' }, { status: 401 })
  )
  await expect(
    service.getStory('home', { version: 'draft' })
  ).rejects.toMatchObject({ response: { status: 401 } })
})

it('keeps mutually referencing relations JSON-serializable with legacy depth', async () => {
  const payload = {
    story: story('root', {
      component: 'page',
      _uid: 'root',
      body: [{ component: 'static_section', _uid: 'root-ref', container: 'a' }]
    }),
    rels: [
      story('a', {
        component: 'static_container',
        _uid: 'a',
        body: [{ component: 'static_section', _uid: 'a-ref', container: 'b' }]
      }),
      story('b', {
        component: 'static_container',
        _uid: 'b',
        body: [{ component: 'static_section', _uid: 'b-ref', container: 'a' }]
      })
    ],
    links: [],
    cv: 1
  }
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => Response.json(payload))
  )
  const legacy = new StoryblokClient({
    accessToken: CONFIG.previewToken,
    cache: { type: 'none' }
  })
  legacy.resolveNestedRelations = true
  const before = await legacy.getStory('home', {
    ...rootParams,
    version: 'draft'
  })
  const after = await new StoryblokServiceClass().getStory('home', {
    version: 'draft'
  })
  expect(after?.data).toEqual(before.data)
  expect(() => JSON.stringify(after)).not.toThrow()
})

describe('dev draft cache', () => {
  const pageRequests = () =>
    requests.filter((url) => url.pathname.endsWith('/home'))
  const listRequests = () =>
    requests.filter((url) => url.pathname.endsWith('/stories'))
  const devService = () => {
    const service = new StoryblokServiceClass()
    service.setDevMode()
    return service
  }
  afterEach(() => vi.useRealTimers())

  it('reuses dev drafts within the TTL and refetches after it expires', async () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.stubEnv('STORYBLOK_DEV_CACHE_TTL', '30')
    const service = devService()
    const first = await service.getStory('home')
    const second = await service.getStory('home')
    expect(second).toEqual(first)
    expect(second).not.toBe(first)
    await service.getAll('cdn/stories', { per_page: 2 })
    await service.getAll('cdn/stories', { per_page: 2 })
    await service.getStories({ per_page: 2 })
    await service.getStories({ per_page: 2 })
    expect(pageRequests()).toHaveLength(1)
    expect(pageRequests()[0].searchParams.get('token')).toBe('preview-test')
    expect(listRequests()).toHaveLength(3)

    vi.advanceTimersByTime(31_000)
    await service.getStory('home')
    await service.getAll('cdn/stories', { per_page: 2 })
    expect(pageRequests()).toHaveLength(2)
    expect(listRequests()).toHaveLength(5)
  })

  it('never caches explicit draft or release requests', async () => {
    const service = devService()
    await service.getStory('home', { version: 'draft' })
    await service.getStory('home', { version: 'draft' })
    await service.getStory('home', { from_release: '123' })
    await service.getStory('home', { from_release: '123' })
    expect(pageRequests()).toHaveLength(4)
  })

  it('is disabled with STORYBLOK_DEV_CACHE_TTL=0', async () => {
    vi.stubEnv('STORYBLOK_DEV_CACHE_TTL', '0')
    const service = devService()
    await service.getStory('home')
    await service.getStory('home')
    expect(pageRequests()).toHaveLength(2)
  })

  it('refetches after clearCaches()', async () => {
    const service = devService()
    await service.getStory('home')
    service.clearCaches()
    await service.getStory('home')
    expect(pageRequests()).toHaveLength(2)
  })
})

it('retries a transient HTTP failure through the official client', async () => {
  const fetchMock = vi
    .fn()
    .mockResolvedValueOnce(
      Response.json({}, { status: 503, headers: { 'retry-after': '0' } })
    )
    .mockImplementation(fixtureFetch(requests))
  vi.stubGlobal('fetch', fetchMock)
  const result = await new StoryblokServiceClass().getStory('home', {
    version: 'draft'
  })
  expect(result?.data.story?.uuid).toBe('page-10')
  expect(fetchMock).toHaveBeenCalledTimes(2)
})
