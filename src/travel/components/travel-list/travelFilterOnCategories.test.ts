import { expect, it } from 'vitest'
import { travelFilterOnCategories } from './travelFilterOnCategories'

const makeTravels = (...titles: string[]) =>
  titles.map((title, id) => ({ id, title })) as Parameters<
    typeof travelFilterOnCategories
  >[0]

it.each([
  '.',
  '*',
  '+',
  '?',
  '^',
  '$',
  '{',
  '}',
  '(',
  ')',
  '|',
  '[',
  ']',
  '\\'
])('treats %s as literal search text', (punctuation) => {
  const travels = makeTravels(`Trip ${punctuation} Bali`, 'Trip Bali')
  expect(
    travelFilterOnCategories(travels, { searchtext: punctuation })
  ).toEqual([travels[0]])
})

it('requires all words, ignoring case and preserving category filters', () => {
  const travels = makeTravels(
    'BALI diving (beginner)',
    'Bali hiking',
    'Java diving'
  )
  travels[0].city_id = 1
  expect(
    travelFilterOnCategories(travels, { searchtext: 'diving bali', city: 1 })
  ).toEqual([travels[0]])
  expect(
    travelFilterOnCategories(travels, { searchtext: 'diving bali', city: 2 })
  ).toEqual([])
  expect(travelFilterOnCategories(travels, {})).toEqual(travels)
})
