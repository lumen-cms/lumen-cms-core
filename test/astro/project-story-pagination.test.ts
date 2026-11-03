import { beforeEach, expect, it, vi } from 'vitest'

const state = vi.hoisted(() => ({ fetch: vi.fn() }))
vi.mock('../../packages/lumen-cms-shared/src/core/utils/storyblok/StoryblokTransport', () => ({
  StoryblokTransport: class {
    parameters = async (params: object) => ({ version: 'published', ...params })
    fetch = state.fetch
    clearCacheVersions() {}
  }
}))
import { getAllStoriesOfProject, getStoryblokPagesConfig } from '../../packages/lumen-cms-shared/src/core/utils/initial-props/storyblokPagesConfig'
import { LmStoryblokService } from '../../packages/lumen-cms-shared/src/core/utils/initial-props/StoryblokService'

const stories = Array.from({ length: 237 }, (_, index) => ({
  uuid: `story-${index}`, full_slug: `page-${index}`, content: { component: 'page' }
}))
beforeEach(() => {
  LmStoryblokService.clearCaches()
  state.fetch.mockReset().mockImplementation(async (_slug, params) => ({
    total: stories.length,
    perPage: params.per_page,
    data: { stories: stories.slice((params.page - 1) * params.per_page, params.page * params.per_page) }
  }))
})

it('retrieves the complete ordered inventory in three requests instead of ten', async () => {
  const params = { language: 'de', filter_query: { component: { in: 'page,news,event' } } }
  const result = await getAllStoriesOfProject(params)
  expect(result).toEqual(stories)
  expect(state.fetch).toHaveBeenCalledTimes(3)
  expect(state.fetch.mock.calls.map(([, query]) => query.page)).toEqual([1, 2, 3])
  for (const [, query] of state.fetch.mock.calls) {
    expect(query).toMatchObject({ ...params, per_page: 100, sort_by: 'published_at:desc' })
  }
  expect(await getAllStoriesOfProject(params)).toEqual(stories)
  expect(state.fetch).toHaveBeenCalledTimes(3)
})

it('preserves explicit bulk page sizes and normal list pagination defaults', async () => {
  expect(getStoryblokPagesConfig().per_page).toBe(25)
  expect(await getAllStoriesOfProject({ per_page: 50 })).toEqual(stories)
  expect(state.fetch).toHaveBeenCalledTimes(5)
  expect(state.fetch.mock.calls.every(([, query]) => query.per_page === 50)).toBe(true)
})

it('fails rather than publishing a partial inventory, and permits retry', async () => {
  state.fetch.mockImplementationOnce(async () => ({ total: 237, perPage: 100, data: { stories: stories.slice(0, 100) } }))
    .mockRejectedValueOnce(new Error('delivery unavailable'))
  await expect(getAllStoriesOfProject()).rejects.toThrow('delivery unavailable')
  expect(await getAllStoriesOfProject()).toEqual(stories)
})
