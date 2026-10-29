import { expect, it } from 'vitest'
import { matchesAllTags } from './matchesAllTags'
import { legacyFilterAllStories } from './legacyFilterAllStories'
it.each([
  [[], [], true],
  [[], ['a'], false],
  [['a'], ['a', 'a'], true],
  [['a', 'a'], ['a', 'b'], false],
  [['b', 'a', 'extra'], ['a', 'b'], true],
  [['A'], ['a'], false]
] as [string[], string[], boolean][])(
  'preserves all-tag membership for %j and %j',
  (tags, required, expected) => {
    expect(matchesAllTags(Object.freeze(tags), new Set(required))).toBe(
      expected
    )
    expect(expected).toBe(required.every((tag) => tags.includes(tag)))
  }
)
it('preserves story sorting, limiting, duplicate filters and object identity', () => {
  const stories = [
    { name: 'Zulu', tag_list: ['a', 'b'], content: {} },
    { name: 'Alpha', tag_list: ['b', 'a', 'a'], content: {} },
    { name: 'Missing', tag_list: ['a'], content: {} }
  ] as any
  expect(
    legacyFilterAllStories(
      {
        tags: { values: ['a', 'a', 'b'] },
        match_all_tags: true,
        sort: 'title',
        maximum_items: '1'
      } as any,
      stories
    )
  ).toEqual([stories[1]])
  expect(stories[0].name).toBe('Zulu')
})

it('preserves any-tag matches, missing tags, duplicate filters and sorting', () => {
  const stories = [
    { name: 'Zulu', tag_list: ['a', 'a'], content: {} },
    { name: 'Alpha', tag_list: ['b'], content: {} },
    { name: 'Missing', content: {} }
  ] as any
  expect(
    legacyFilterAllStories(
      { tags: { values: ['a', 'b', 'b'] }, sort: 'title' } as any,
      stories
    )
  ).toEqual([stories[1], stories[0]])
  expect(
    legacyFilterAllStories({ tags: { values: ['A'] } } as any, stories)
  ).toEqual([])
  expect(legacyFilterAllStories({ only_tagged: true } as any, stories)).toEqual(
    [stories[0], stories[1]]
  )
})
