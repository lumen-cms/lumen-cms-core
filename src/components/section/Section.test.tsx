import { renderToStaticMarkup } from 'react-dom/server'
import type { ReactNode } from 'react'
import { expect, it, vi } from 'vitest'
import { LmSection } from './Section'
import type { LmSectionProps } from './sectionTypes'
const seen = vi.hoisted(() => ({
  container: {} as Record<string, any>,
  box: {} as Record<string, any>,
  background: {} as Record<string, any>,
  hook: {} as Record<string, any>
}))
vi.mock('@mui/material/styles', () => ({
  useTheme: () => ({ defaultContainerWidth: 'lg' })
}))
vi.mock('@mui/material/Container', () => ({
  default: ({ children, ...p }: { children: ReactNode }) => {
    seen.container = p
    return <main>{children}</main>
  }
}))
vi.mock('@mui/material/Box', () => ({
  default: ({ children, ...p }: { children: ReactNode }) => {
    seen.box = p
    return <div>{children}</div>
  }
}))
vi.mock('./useBackgroundBox', () => ({
  default: (p: Record<string, any>) => {
    seen.hook = p
    return {
      style: { color: 'red' },
      className: 'custom',
      sx: [{ color: 'blue' }]
    }
  }
}))
vi.mock('./BackgroundImage', () => ({
  default: (p: Record<string, any>) => {
    seen.background = p
    return <span>Background</span>
  }
}))
vi.mock('./BackgroundElements', () => ({
  default: () => <span>Elements</span>
}))
vi.mock('../CoreComponents', () => ({
  LmComponentRender: ({ content }: { content: { _uid: string } }) => (
    <span>{content._uid}</span>
  )
}))
const content = {
  _uid: 'section',
  component: 'section',
  body: [
    { _uid: 'first', component: 'headline' },
    { _uid: 'second', component: 'headline' }
  ]
} as LmSectionProps['content']
function render(overrides: Partial<LmSectionProps['content']> = {}) {
  return renderToStaticMarkup(
    <LmSection content={{ ...content, ...overrides }} sectionPosition={2} />
  )
}
it.each([undefined, '8px', '8px 12px', '8px 12px 16px 20px'])(
  'preserves padding semantics for %s',
  (padding) => {
    render({ padding })
    expect(seen.container.style).toEqual({
      ...((padding?.split(' ').length || 0) > 2 ? { padding } : {}),
      paddingTop: padding?.split(' ')[0] || '2.5rem',
      paddingBottom: padding?.split(' ')[0] || '2.5rem'
    })
  }
)
it('preserves full-height, width, overflow and identifiers', () => {
  render()
  expect(seen.container.maxWidth).toBe('lg')
  expect(seen.box.id).toBe('section')
  expect(seen.box.style).toEqual({ color: 'red', overflow: 'hidden' })
  render({
    property: ['is_full_height', 'allow_overflow'],
    max_width: 'none',
    padding: '10px',
    section_identifier: 'custom-id'
  })
  expect(seen.container.style).toEqual({})
  expect(seen.container.maxWidth).toBe(false)
  expect(seen.container.sx[1]).toMatchObject({ minHeight: '100vh' })
  expect(seen.box.style.overflow).toBeUndefined()
  expect(seen.box.id).toBe('custom-id')
  render({ max_width: 'sm' })
  expect(seen.container.maxWidth).toBe('sm')
})
it('preserves background order, child order and variant precedence', () => {
  const background = {
    _uid: 'bg',
    component: 'background',
    image: 'image',
    background_elements: [{ _uid: 'element', component: 'headline' }]
  }
  const html = render({
    background: [background],
    variant: 'dark',
    presetVariant: 'light'
  } as unknown as Partial<LmSectionProps['content']>)
  expect(html.indexOf('Background')).toBeLessThan(html.indexOf('Elements'))
  expect(html.indexOf('Elements')).toBeLessThan(html.indexOf('first'))
  expect(html.indexOf('first')).toBeLessThan(html.indexOf('second'))
  expect(seen.background.sectionPosition).toBe(2)
  expect(seen.hook.variant).toBe('dark')
  expect(seen.box.className).toBe('lm-section custom')
  expect(seen.container.className).toBe('custom')
  render({ presetVariant: 'dark', body: undefined })
  expect(seen.hook.variant).toBe('dark')
})
