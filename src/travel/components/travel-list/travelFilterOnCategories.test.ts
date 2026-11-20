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

it('matches any selected value within each taxonomy and requires every taxonomy', () => {
  const travels = makeTravels('A', 'B', 'C')
  travels.forEach((travel, index) => {
    travel.city_id = index + 1
    travel.city = { country_id: index + 10 } as typeof travel.city
    travel.mn_travel_branches = [
      { branch_id: index + 20 }
    ] as typeof travel.mn_travel_branches
    travel.mn_travel_travel_types = [
      { travel_type_id: index + 30 }
    ] as typeof travel.mn_travel_travel_types
  })
  expect(
    travelFilterOnCategories(travels, {
      city: '1,2',
      country: '10,11',
      branch: '20,21',
      travelType: '30,31'
    })
  ).toEqual(travels.slice(0, 2))
  expect(
    travelFilterOnCategories(travels, { city: '1,2', branch: '21,22' })
  ).toEqual([travels[1]])
  expect(
    travelFilterOnCategories(travels, {
      city: '',
      branch: '',
      country: '',
      travelType: ''
    })
  ).toEqual(travels)
})
