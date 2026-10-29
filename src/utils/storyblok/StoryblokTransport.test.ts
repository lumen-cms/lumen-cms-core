import { beforeEach, expect, it, vi } from 'vitest'
import { StoryblokTransport } from './StoryblokTransport'

const sdk = vi.hoisted(() => ({ get: vi.fn(), list: vi.fn(), create: vi.fn() }))
vi.mock('@storyblok/api-client', () => ({
  createApiClient: (config: unknown) => {
    sdk.create(config)
    return { stories: { get: sdk.get, list: sdk.list } }
  }
}))
const ids = Array.from({ length: 101 }, (_, i) => `story-${i}`)
const params = {
  token: 'test-token',
  version: 'draft' as const,
  language: 'de',
  fallback_lang: 'en',
  cv: 42,
  from_release: '123',
  resolve_relations: 'page.cards'
}
const response = (data: unknown) => ({
  data,
  response: { headers: new Headers() }
})
beforeEach(() => {
  sdk.get.mockReset()
  sdk.list.mockReset()
  sdk.create.mockReset()
  sdk.get.mockResolvedValue(
    response({ stories: [], rel_uuids: [...ids], cv: 42 })
  )
})

it('waits for each batch, preserves order and request context, and keeps the configured rate limit', async () => {
  const releases: Array<() => void> = []
  sdk.list.mockImplementation(
    ({ query }: { query: { by_uuids: string } }) =>
      new Promise((resolve) => {
        releases.push(() =>
          resolve(
            response({
              stories: query.by_uuids
                .split(',')
                .map((uuid) => ({ uuid, content: {} })),
              cv: 42
            })
          )
        )
      })
  )
  const transport = new StoryblokTransport({ requestsPerSecond: () => 4 })
  const pending = transport.fetch('home', params)
  await vi.waitFor(() => expect(sdk.list).toHaveBeenCalledTimes(1))
  releases[0]()
  await vi.waitFor(() => expect(sdk.list).toHaveBeenCalledTimes(2))
  releases[1]()
  await vi.waitFor(() => expect(sdk.list).toHaveBeenCalledTimes(3))
  releases[2]()
  const result = await pending
  expect(result.data.rels!.map((s) => s.uuid)).toEqual(ids)
  expect(
    sdk.list.mock.calls.map(([arg]) => arg.query.by_uuids.split(',').length)
  ).toEqual([50, 50, 1])
  for (const [arg] of sdk.list.mock.calls)
    expect(arg.query).toMatchObject({
      version: 'draft',
      language: 'de',
      fallback_lang: 'en',
      cv: 42,
      from_release: 123,
      per_page: 50
    })
  expect(sdk.create).toHaveBeenCalledWith(
    expect.objectContaining({
      rateLimit: {
        requestsPerSecond: 4,
        adaptToServerHeaders: false,
        cacheAware: false
      },
      retry: { limit: 5, retryOnTimeout: true }
    })
  )
})

it.each(['error', 'missing-data'] as const)(
  'does not start later batches after %s',
  async (mode) => {
    const failure = new Error('upstream failed')
    sdk.list.mockResolvedValue(
      mode === 'error' ? { error: failure } : { data: undefined }
    )
    const transport = new StoryblokTransport({ requestsPerSecond: () => 4 })
    await expect(transport.fetch('home', params)).rejects.toThrow(
      mode === 'error'
        ? 'upstream failed'
        : 'Storyblok returned no related stories'
    )
    expect(sdk.list).toHaveBeenCalledTimes(1)
  }
)
