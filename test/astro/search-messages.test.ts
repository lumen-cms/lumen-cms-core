import { expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { getSearchMessages, searchResultCount } from '../../packages/lumen-cms-shared/src/searchMessages'

it.each(['de', 'de-DE', 'de_CH', 'DE'])('resolves German locale %s', locale => {
 expect(getSearchMessages(locale).search).toBe('Suche')
 expect(searchResultCount(1, locale)).toBe('1 Ergebnis')
 expect(searchResultCount(2, locale)).toBe('2 Ergebnisse')
})
it.each([undefined, '', 'en', 'en-GB', 'fr', 'unknown'])('falls back safely for %s', locale => {
 expect(getSearchMessages(locale).search).toBe('Search')
 expect(searchResultCount(1, locale)).toBe('1 result')
 expect(searchResultCount(2, locale)).toBe('2 results')
})
it('keeps the independently packaged React and Astro catalogs identical', () => {
 expect(readFileSync('src/components/list-widget/searchMessages.ts', 'utf8')).toBe(readFileSync('packages/lumen-cms-shared/src/searchMessages.ts', 'utf8'))
})
