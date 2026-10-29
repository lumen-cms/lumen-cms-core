import { createBreakpoints } from '@mui/system'
import { describe, expect, it } from 'vitest'
import { traverseBreakpoints } from './gridGenerator'

const breakpoints = createBreakpoints({})
function styles(responsive: Parameters<typeof traverseBreakpoints>[1]) {
  const result = {}
  const values: unknown[] = []
  traverseBreakpoints(breakpoints, responsive, (append, value) => {
    values.push(value)
    append(result, { width: value })
  })
  return { result, values }
}

describe('responsive grid breakpoint traversal', () => {
  it('uses breakpoint order and ignores unknown and undefined object entries', () => {
    expect(styles({ lg: 4, xs: 1, md: undefined, bogus: 9 })).toEqual({
      result: { width: 1, [breakpoints.up('lg')]: { width: 4 } },
      values: [1, 4]
    })
  })
  it('keeps the same filtering for objects larger than the breakpoint list', () => {
    expect(
      styles({ lg: 4, xs: 1, sm: 2, md: undefined, xl: 5, bogus: 9 })
    ).toEqual({
      result: {
        width: 1,
        [breakpoints.up('sm')]: { width: 2 },
        [breakpoints.up('lg')]: { width: 4 },
        [breakpoints.up('xl')]: { width: 5 }
      },
      values: [1, 2, 4, 5]
    })
  })
  it('preserves scalar, array and empty input handling', () => {
    expect(styles(2)).toEqual({ result: { width: 2 }, values: [2] })
    expect(styles([1, 2])).toEqual({
      result: { width: 1, [breakpoints.up('sm')]: { width: 2 } },
      values: [1, 2]
    })
    expect(styles(undefined)).toEqual({ result: {}, values: [] })
    expect(styles({ bad: 1 })).toEqual({ result: {}, values: [] })
  })
})
