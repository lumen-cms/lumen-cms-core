import { expect, it } from 'vitest'
import { canonicalPageData as canonical } from './serverPageData.test-utils'

it('normalizes only the two validated per-load values while retaining their shape', () => {
  expect(
    canonical({
      form_data: { fbzx: '-123', fields: ['name'] },
      list_widget_data: { cv: 10, total: 2 }
    })
  ).toEqual(
    canonical({
      form_data: { fbzx: '456', fields: ['name'] },
      list_widget_data: { cv: 20, total: 2 }
    })
  )
  for (const fbzx of ['', null, 'invalid', 123]) {
    expect(canonical({ form_data: { fbzx } })).not.toEqual(
      canonical({ form_data: { fbzx: '123' } })
    )
  }
  expect(canonical({ form_data: {} })).not.toEqual(
    canonical({ form_data: { fbzx: '123' } })
  )
  expect(canonical({ list_widget_data: { cv: 'invalid' } })).not.toEqual(
    canonical({ list_widget_data: { cv: 1 } })
  )
})

it('detects content, order, totals, IDs, and real CDN version changes', () => {
  const original = {
    cv: 1,
    total: 2,
    items: [
      { uuid: 'a', title: 'A' },
      { uuid: 'b', title: 'B' }
    ]
  }
  for (const changed of [
    { ...original, cv: 2 },
    { ...original, total: 1 },
    { ...original, items: [...original.items].reverse() },
    {
      ...original,
      items: [{ uuid: 'a', title: 'Changed' }, original.items[1]]
    },
    { ...original, items: original.items.slice(1) }
  ])
    expect(canonical(changed)).not.toEqual(canonical(original))
  expect(canonical({ fbzx: '123' })).not.toEqual(canonical({ fbzx: '456' }))
})
