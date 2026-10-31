import { expect, it } from 'vitest'
import { queryStringify } from './paramsToQueryString'

it('preserves nested keys, array brackets, ordering, and escaping', () => {
  expect(
    queryStringify({ search: 'a & b', filter: { tags: ['one', 'two'] } })
  ).toBe(
    'search=a%20%26%20b&filter%5Btags%5D%5B%5D=one&filter%5Btags%5D%5B%5D=two'
  )
})

it('preserves native coercion and empty nested values', () => {
  expect(
    queryStringify({
      missing: undefined,
      zero: 0,
      flag: false,
      empty: '',
      nothing: null,
      list: []
    })
  ).toBe('missing=undefined&zero=0&flag=false&empty=&&')
  expect(queryStringify(null)).toBe('')
  expect(queryStringify(undefined)).toBe('')
  expect(queryStringify('ab')).toBe('0=a&1=b')
})

it('ignores inherited properties and handles null-prototype objects', () => {
  const inherited = Object.create({ ignored: 'parent' }) as Record<
    string,
    unknown
  >
  inherited.own = 'child'
  const plain = Object.create(null) as Record<string, unknown>
  plain.own = 'child'
  expect(queryStringify(inherited)).toBe('own=child')
  expect(queryStringify(plain)).toBe('own=child')
})

it('retains native failures and primitive property coercion', () => {
  expect(() => queryStringify({ value: Symbol('unsupported') })).toThrow(
    TypeError
  )
  expect(queryStringify({ value: 12n })).toBe('value=12')
})
