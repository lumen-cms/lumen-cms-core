import { expect, it } from 'vitest'
import { legacyClientListWidgetSearch } from './useListSearch'
import type { AllStoryData } from '../../typings/app'

const stories = [
  {
    full_slug: 'one',
    tag_list: ['one', 'one'],
    content: { preview_title: 'One' }
  },
  { full_slug: 'two', tag_list: ['two'], content: {} },
  { full_slug: 'untagged', content: {} }
] as unknown as AllStoryData

it.each([
  [[], []],
  [['one', 'one'], [0]],
  [
    ['two', 'one'],
    [0, 1]
  ],
  [['ONE'], []],
  [['missing'], []]
] as [string[], number[]][])(
  'preserves any-category matching for %j',
  (tags, indices) => {
    const result = legacyClientListWidgetSearch(stories, {
      searchParamsCategories: tags
    })
    expect(result).toEqual(indices.map((i) => stories[i]))
    result.forEach((item, i) => expect(item).toBe(stories[indices[i]]))
    expect(stories.map((s) => s.full_slug)).toEqual(['one', 'two', 'untagged'])
  }
)

it.each([
  '(',
  '[',
  '.',
  '*',
  '+',
  '?',
  '^',
  '$',
  '{',
  '}',
  '|',
  '\\',
  'a.b',
  '(a+)+$'
])(
  'treats search text %j literally without throwing or overmatching',
  (searchText) => {
    const items = [
      { full_slug: `path/${searchText}`, content: {} },
      {
        full_slug: 'title-match',
        content: { preview_title: `Contains ${searchText}` }
      },
      { full_slug: 'unrelated', content: { preview_title: 'Other text' } }
    ] as unknown as AllStoryData
    expect(
      legacyClientListWidgetSearch(items, {
        searchParamsCategories: [],
        searchText
      })
    ).toEqual(items.slice(0, 2))
  }
)

it('keeps case-insensitive text search and category-or-text matching', () => {
  expect(
    legacyClientListWidgetSearch(stories, {
      searchParamsCategories: ['two'],
      searchText: 'ONE'
    })
  ).toEqual(stories.slice(0, 2))
  expect(
    legacyClientListWidgetSearch(stories, {
      searchParamsCategories: [],
      searchText: ''
    })
  ).toEqual([])
})
