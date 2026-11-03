import type { ColumnStoryblok } from 'lumen-cms-shared/core/typings/generated/components-schema'
export type ColumnSize = number | boolean | 'auto' | undefined
const sizes = (values: number[]): Record<string, ColumnSize> => ({ ...Object.fromEntries(values.map((value, index) => [String(index + 1), value])), false: false, true: true, auto: 'auto' })
const phone = sizes([3, 6, 9, 12])
const tablet = sizes([1, 2, 4, 6, 7, 9, 11, 12])
const desktop = sizes([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
export function columnWidths(content: Pick<ColumnStoryblok, 'width_phone' | 'width_tablet' | 'width_general'>) {
  const md = desktop[content.width_general as string]
  let sm = tablet[content.width_tablet as string]
  if (!sm && md) sm = typeof md === 'number' && md > 8 ? 12 : md
  return { xs: content.width_phone ? phone[content.width_phone] : 12, sm, md }
}
export function columnSizeCss(size: ColumnSize) {
  if (size === true) return 'flex-basis:0;flex-grow:1;max-width:100%;'
  if (size === 'auto') return 'flex-basis:auto;flex-grow:0;flex-shrink:0;max-width:none;width:auto;'
  if (typeof size === 'number') return `flex-grow:0;flex-basis:auto;width:calc(100% * ${size} / 12);`
  return ''
}
