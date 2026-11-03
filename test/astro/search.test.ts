import { expect, it, vi } from 'vitest'
import { searchParams, searchLink } from '../../packages/lumen-cms-shared/src/search'
import { fetchSearchStories } from '../../src/components/list-widget/searchPaletteData'
const { getBrowserStories } = vi.hoisted(() => ({ getBrowserStories: vi.fn(async (_params: unknown) => ({ data: { stories: [] } })) }))
vi.mock('../../src/utils/storyblok/browserClient', () => ({ getBrowserStories }))

it.each([undefined, 'de', 'site-root'])('preserves search parameters with prefix %s', async prefix => {
 await fetchSearchStories(['search-palette-pages', 'Bali & sea', prefix, 'de,id'])
 const previous = getBrowserStories.mock.lastCall![0] as Record<string, unknown>
 const current = searchParams('Bali & sea', { publicToken: 'published-fixture', prefix, additionalLocales: 'de,id', languages: [] })
 for (const [key, value] of Object.entries(previous)) {
  if (key === 'filter_query') expect(current.get('filter_query[component][in]')).toBe('page')
  else expect(current.get(key)).toBe(String(value))
 }
 expect(current.get('version')).toBe('published')
 expect(current.get('token')).toBe('published-fixture')
})
it('preserves CMS root and locale handling for search result links', () => {
 expect(searchLink('site/about', { rootDirectory: 'site', languages: [] })).toBe('/about')
 expect(searchLink('de/about', { suppressSlugLocale: true, languages: ['en', 'de'] })).toBe('/about')
 expect(searchLink('de/home', { suppressSlugLocale: true, languages: ['en', 'de'] })).toBe('/de')
})

it.each([
 ['home', '/'], ['en/home', '/'], ['de/home', '/de'],
 ['de/about', '/de/about'], ['en/site/home', '/'], ['de/site/home', '/de'],
 ['de/site/about', '/de/about']
])('maps CMS result %s to the published Astro route %s', (slug, expected) => {
 expect(searchLink(slug, { defaultLocale: 'en', locales: ['en', 'de'], languages: [], rootDirectory: 'site' })).toBe(expected)
})

it('uses the configured default locale rather than assuming English', () => {
 const config = { defaultLocale: 'de', locales: ['de', 'en'], languages: [] }
 expect(searchLink('de/home', config)).toBe('/')
 expect(searchLink('en/home', config)).toBe('/en')
})
