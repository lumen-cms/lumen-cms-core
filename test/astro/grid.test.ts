import { expect, it } from 'vitest'
import { columnWidths, columnSizeCss } from '../../packages/lumen-cms-shared/src/grid'
it('preserves the different phone, tablet and desktop CMS span scales', () => {
  expect(columnWidths({ width_phone: '2', width_tablet: '3', width_general: '3' })).toEqual({ xs: 6, sm: 4, md: 3 })
  expect(columnWidths({ width_general: '9' })).toEqual({ xs: 12, sm: 12, md: 9 })
  expect(columnWidths({ width_general: '6' })).toEqual({ xs: 12, sm: 6, md: 6 })
})
it('preserves legacy auto, growth and disabled width behavior', () => {
  expect(columnWidths({ width_phone: 'auto', width_tablet: 'true', width_general: 'false' })).toEqual({ xs: 'auto', sm: true, md: false })
  expect(columnSizeCss(false)).toBe('')
  expect(columnSizeCss(true)).toContain('flex-grow:1')
  expect(columnSizeCss('auto')).toContain('flex-shrink:0')
})
