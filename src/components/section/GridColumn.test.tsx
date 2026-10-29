import { renderToStaticMarkup } from 'react-dom/server'
import type { ReactNode } from 'react'
import { expect, it, vi } from 'vitest'
import { LmGridColumn } from './GridColumn'
import type { LmGridColumnProps } from './sectionTypes'
const seen = vi.hoisted(() => ({
  grid: {} as Record<string, any>,
  wrap: {} as Record<string, any>,
  stack: {} as Record<string, any>
}))
vi.mock('../../vendor/grid', () => ({
  default: ({ children, ...p }: { children: ReactNode }) => {
    seen.grid = p
    return <div>{children}</div>
  }
}))
vi.mock('./useBackgroundBox', () => ({
  default: () => ({ className: 'custom', style: { color: 'red' }, sx: [] })
}))
vi.mock('./WrapGridContainer', () => ({
  default: ({ children, ...p }: { children: ReactNode }) => {
    seen.wrap = p
    return <div>{children}</div>
  }
}))
vi.mock('@mui/material/Stack', () => ({
  default: ({ children, ...p }: { children: ReactNode }) => {
    seen.stack = p
    return <div data-stack>{children}</div>
  }
}))
vi.mock('./BackgroundImage', () => ({ default: () => <span>Background</span> }))
vi.mock('./BackgroundElements', () => ({
  default: () => <span>Elements</span>
}))
vi.mock('../CoreComponents', () => ({
  LmComponentRender: ({ content }: { content: { _uid: string } }) => (
    <span>{content._uid}</span>
  )
}))
const content = {
  _uid: 'column',
  component: 'column',
  body: [
    { _uid: 'first', component: 'headline' },
    { _uid: 'second', component: 'headline' }
  ]
} as LmGridColumnProps['content']
function render(
  overrides: Partial<LmGridColumnProps['content']> = {},
  direction: LmGridColumnProps['parent']['direction'] = 'row'
) {
  return renderToStaticMarkup(
    <LmGridColumn
      content={{ ...content, ...overrides }}
      parent={{ direction }}
    />
  )
}
it.each([
  [{}, { xs: 12, sm: undefined, md: undefined }],
  [{ width_general: '9' }, { xs: 12, sm: 12, md: 9 }],
  [{ width_general: '6' }, { xs: 12, sm: 6, md: 6 }],
  [
    { width_general: '9', width_tablet: '2', width_phone: '2' },
    { xs: 6, sm: 2, md: 9 }
  ],
  [
    { width_general: 'auto', width_tablet: 'false', width_phone: 'false' },
    { xs: false, sm: 'auto', md: 'auto' }
  ]
])('preserves width mapping and fallback for %j', (override, expected) => {
  render(override as Partial<LmGridColumnProps['content']>)
  expect(seen.grid).toMatchObject(expected)
})
it('preserves stacking decisions, alignment and child order', () => {
  const html = render({
    justify: 'center',
    align_items: 'flex-end',
    align_content: 'center'
  })
  expect(html).toContain('data-stack')
  expect(html.indexOf('first')).toBeLessThan(html.indexOf('second'))
  expect(seen.stack.sx).toEqual({
    justifyContent: 'center',
    alignItems: 'flex-end',
    alignContent: 'center',
    minHeight: '100%'
  })
  expect(render({ justify: 'center' }, 'column')).not.toContain('data-stack')
  expect(render({ justify: 'center' }, 'column-reverse')).not.toContain(
    'data-stack'
  )
  expect(render()).not.toContain('data-stack')
})
it('preserves background order and wrapper styles', () => {
  const html = render({
    background: [
      {
        _uid: 'bg',
        component: 'background',
        image: 'image',
        background_elements: [{ _uid: 'el', component: 'headline' }]
      }
    ]
  } as unknown as Partial<LmGridColumnProps['content']>)
  expect(html.indexOf('Background')).toBeLessThan(html.indexOf('Elements'))
  expect(html.indexOf('Elements')).toBeLessThan(html.indexOf('first'))
  expect(seen.grid.className).toBe('lm-column__bg-image')
  expect(seen.wrap).toMatchObject({
    className: 'custom lm-grid-column__wrap',
    style: { color: 'red' },
    hasCustomStyles: true
  })
})
