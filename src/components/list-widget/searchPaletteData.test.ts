import { describe, expect, it, vi } from 'vitest'
import {
  fetchSearchStories,
  searchStoryTitle,
  SearchStory
} from './searchPaletteData'
import { getBrowserStories } from '../../utils/storyblok/browserClient'

vi.mock('../../utils/storyblok/browserClient', () => ({
  getBrowserStories: vi.fn()
}))

describe('palette search requests', () => {
  it('searches only pages (including landing pages), excluding demo content and other locales', async () => {
    vi.mocked(getBrowserStories).mockResolvedValue({
      data: { stories: [] }
    } as never)
    await fetchSearchStories(['search-palette', 'bali', undefined, 'de,fr'])
    expect(getBrowserStories).toHaveBeenLastCalledWith(
      expect.objectContaining({
        per_page: 25,
        search_term: 'bali',
        filter_query: { component: { in: 'page' } },
        excluding_slugs: 'demo-content*,*/demo-content*,de/*,fr/*'
      })
    )
    await fetchSearchStories(['search-palette', 'bali', 'de', 'de,fr'])
    expect(getBrowserStories).toHaveBeenLastCalledWith(
      expect.objectContaining({
        starts_with: 'de/',
        excluding_slugs: 'demo-content*,de/demo-content*'
      })
    )
  })
  it('uses page title fallbacks', () => {
    const story = {
      name: 'Story',
      content: { component: 'page', title: 'Article', meta_title: 'Meta' }
    } as SearchStory
    expect(searchStoryTitle(story)).toBe('Article')
    expect(
      searchStoryTitle({
        ...story,
        content: { ...story.content, preview_title: 'Preview' }
      })
    ).toBe('Preview')
    expect(
      searchStoryTitle({
        ...story,
        content: { component: 'page', meta_title: 'Meta' }
      })
    ).toBe('Meta')
    expect(searchStoryTitle({ ...story, content: { component: 'page' } })).toBe(
      'Story'
    )
  })
})
