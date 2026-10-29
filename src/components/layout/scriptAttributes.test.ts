import { expect, it } from 'vitest'
import { parseToAttributes } from './scriptAttributes'
it.each([
  undefined,
  '',
  ' ',
  'async,data-id=123, data-id=456',
  'token=a=b, spaced = value ',
  '__proto__=literal,constructor=custom',
  ',,'
])('preserves existing parsing for %j', (input) => {
  const old = input
    ? input
        .split(',')
        .map((i) => i.trim())
        .reduce<Record<string, string | undefined>>((previous, current) => {
          const parts = current.split('=')
          return { ...previous, [parts[0]]: parts[1] }
        }, {})
    : undefined
  expect(parseToAttributes(input)).toEqual(old)
})
it('keeps special names as own properties without changing the prototype', () => {
  const parsed = parseToAttributes('__proto__=literal')!
  expect(Object.hasOwn(parsed, '__proto__')).toBe(true)
  expect(Object.getPrototypeOf(parsed)).toBe(Object.prototype)
})
it('retains all unique attributes in a large list', () => {
  const parsed = parseToAttributes(
    Array.from({ length: 1000 }, (_, i) => `data-${i}=${i}`).join(',')
  )!
  expect(Object.keys(parsed)).toHaveLength(1000)
  expect(parsed['data-999']).toBe('999')
})
