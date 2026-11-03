import { expect, it } from 'vitest'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import usePagination from '@mui/material/usePagination'
import { listStoriesParams, paginationItems } from '../../packages/lumen-cms-shared/src/listStories'
import { getListStoriesParams } from '../../src/utils/universal/getListStoriesParams'
import { getStoriesDefaultParams } from '../../src/utils/universal/storyblokParamsHelper'
import type { ListStoriesStoryblok } from '../../src/typings/generated/components-schema'

it.each(['', 'created', 'updated', 'publish', 'title'] as const)('preserves list query filters and %s sorting', sort => {
 const content: ListStoriesStoryblok = { component: 'list_stories', _uid: 'query', sort, sort_descending: true, page_categories: ['category-a'], news_categories: ['news-a'], event_categories: ['event-a'], match_all_categories: true, pagination: [{ component: 'pagination', _uid: 'pages', items_per_page: '10' }] }
 const props = { locale: 'de', defaultLocale: 'en', locales: ['en', 'de'] }
 const expected = getListStoriesParams({ ...content, page_categories: ['selected-b', 'category-a'] }, props)
 expect(listStoriesParams(content, getStoriesDefaultParams(props), 3, 'test query', ['selected-b'])).toEqual({ ...expected, page: 3, search_term: 'test query' })
})

it('preserves compact pagination boundaries for short and long result lists', () => {
 for (const count of [0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 30]) {
  for (let page = 1; page <= Math.max(count, 1); page++) {
   let expected: unknown[] = []
   function Reference() {
    const { items } = usePagination({ count, page })
    const expected = items.filter(item => !['previous', 'next'].includes(item.type)).map(item => item.type === 'page' ? item.page : item.type)
    return createElement('output', null, JSON.stringify(expected))
   }
   const actual = renderToStaticMarkup(createElement('output', null, JSON.stringify(paginationItems(page, count))))
   expect(actual, `page ${page}/${count}`).toBe(renderToStaticMarkup(createElement(Reference)))
  }
 }
})
