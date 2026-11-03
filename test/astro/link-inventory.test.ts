import { beforeEach, expect, it, vi } from 'vitest'
const fetchStories = vi.hoisted(() => vi.fn())
vi.mock('../../packages/lumen-cms-shared/src/core/utils/initial-props/storyblokPagesConfig', () => ({ getAllStoriesOfProject: fetchStories }))
import { clearPublishedLinkInventory, publishedLinkStories, publishedLinkIndex } from '../../packages/lumen-cms-astro/src/server/linkInventory'
beforeEach(() => { clearPublishedLinkInventory(); fetchStories.mockReset() })
it('shares the published inventory across route enumeration and UUID lookup', async () => {
 fetchStories.mockResolvedValue([{ uuid: 'id', full_slug: 'renamed' }])
 const [stories, index] = await Promise.all([publishedLinkStories(), publishedLinkIndex()])
 expect(stories[0].full_slug).toBe('renamed')
 expect(index).toEqual({ id: 'renamed' })
 expect(fetchStories).toHaveBeenCalledOnce()
 expect(fetchStories).toHaveBeenCalledWith({ version: 'published', filter_query: { component: { in: 'page,news,event' } } })
})
it('isolates translated inventories and retries failed delivery instead of caching a false empty result', async () => {
 fetchStories.mockRejectedValueOnce(new Error('offline'))
 await expect(publishedLinkIndex('de')).rejects.toThrow('offline')
 fetchStories.mockResolvedValueOnce([{ uuid: 'id', full_slug: 'de/neu' }]).mockResolvedValueOnce([{ uuid: 'id', full_slug: 'en/new' }])
 expect(await publishedLinkIndex('de')).toEqual({ id: 'de/neu' })
 expect(await publishedLinkIndex('en')).toEqual({ id: 'en/new' })
 expect(fetchStories).toHaveBeenCalledTimes(3)
 expect(fetchStories.mock.calls.at(-1)?.[0].language).toBe('en')
})
