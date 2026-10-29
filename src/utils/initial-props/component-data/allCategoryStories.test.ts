import { expect, it, vi } from 'vitest'
import { filterAllCategory } from './allCategoryStories'
import type { AllCategoryData } from '../../../typings/app'
import type { CategoryBoxStoryblok } from '../../../typings/generated/components-schema'
vi.mock('../StoryblokService', () => ({ LmStoryblokService: {} }))
vi.mock('../../config', () => ({ CONFIG: {} }))
const categories = [
  {
    uuid: 'a',
    tag_list: ['one', 'two'],
    content: { tag_reference: { values: ['one'] } }
  },
  { uuid: 'b', tag_list: ['one'], content: { tag_reference: { values: [] } } },
  { uuid: 'c', tag_list: [], content: { tag_reference: { values: [] } } },
  { uuid: 'd', tag_list: ['two'], content: {} }
] as unknown as AllCategoryData
it.each([
  [{}, ['a', 'b', 'c', 'd']],
  [{ filter_categories: ['c', 'a', 'a'] }, ['a', 'c']],
  [{ filter_categories: ['missing'] }, []],
  [
    { filter_by_tags: { values: ['two'] }, filter_categories: ['b', 'd'] },
    ['a', 'b']
  ],
  [{ filter_by_tags: { values: ['one', 'two'] }, match_all_tags: true }, ['a']],
  [
    { filter_by_tags: { values: ['one', 'two'] }, match_all_tags: false },
    ['a', 'b']
  ],
  [{ filter_by_tags: { values: ['missing'] }, filter_categories: ['c'] }, ['c']]
])('preserves category filtering for %j', (options, expected) => {
  const result = filterAllCategory(categories, options as CategoryBoxStoryblok)
  expect(result.map((item) => item.uuid)).toEqual(expected)
  expect(result.every((item) => categories.includes(item))).toBe(true)
  expect(categories.map((item) => item.uuid)).toEqual(['a', 'b', 'c', 'd'])
})
