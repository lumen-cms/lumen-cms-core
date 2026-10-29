import { expect, it } from 'vitest'
import { resolveStoryblokPayload } from './storyblokResponse'
import { story } from './__fixtures__/storyblokDelivery'

it('gives repeated relation references independent nested data and keeps page props serializable', () => {
  const relation = story('related', {
    component: 'card',
    _uid: 'related',
    nested: { label: 'Original', values: [1, 2] }
  })
  const root = story('root', {
    component: 'page',
    _uid: 'root',
    cards: ['related', 'related']
  })
  const result = resolveStoryblokPayload(
    { story: root, rels: [relation], cv: 1 },
    'page.cards',
    false
  )
  const [first, second] = result.story!.content.cards
  expect(first).toEqual(second)
  expect(first).not.toBe(second)
  first.content.nested.label = 'Edited'
  first.content.nested.values.push(3)
  expect(second.content.nested).toEqual({ label: 'Original', values: [1, 2] })
  expect(relation.content.nested).toEqual({ label: 'Original', values: [1, 2] })
  expect(() => JSON.stringify(result)).not.toThrow()
})
