import { expect, it } from 'vitest'
import { additionalFormData } from './additionalFormData'
it('preserves last-field precedence, conversion, empty values and literal special names', () => {
  const fields = Object.freeze([
    Object.freeze({ name: 'duplicate', value: 'CMS' }),
    Object.freeze({ name: 'number', value: '12.5', is_number: true }),
    Object.freeze({ name: 'zero', value: '', is_number: true }),
    Object.freeze({ name: 'invalid', value: 'abc', is_number: true }),
    Object.freeze({ name: '__proto__', value: 'literal' }),
    Object.freeze({ name: 'constructor', value: 'literal constructor' }),
    Object.freeze({ name: 'duplicate', value: 'Caller' }),
    Object.freeze({ name: 'empty', value: '' })
  ])
  const old = fields.reduce<Record<string, unknown>>(
    (previous, field) => ({
      ...previous,
      [field.name]:
        'is_number' in field && field.is_number
          ? Number(field.value)
          : field.value
    }),
    {}
  )
  const result = additionalFormData(fields)
  expect(result).toEqual(old)
  expect(result.duplicate).toBe('Caller')
  expect(Object.getPrototypeOf(result)).toBe(Object.prototype)
  expect(Object.hasOwn(result, '__proto__')).toBe(true)
})
it('preserves empty inputs and large collections', () => {
  expect(additionalFormData([])).toEqual({})
  const fields = Array.from({ length: 1000 }, (_, i) => ({
    name: `field${i}`,
    value: String(i),
    is_number: true
  }))
  const result = additionalFormData(fields)
  expect(Object.keys(result)).toHaveLength(1000)
  expect(result.field999).toBe(999)
})
