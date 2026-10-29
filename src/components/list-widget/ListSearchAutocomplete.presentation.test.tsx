import { renderToStaticMarkup } from 'react-dom/server'
import type { ReactNode } from 'react'
import { expect, it, vi } from 'vitest'
import Search from './ListSearchAutocomplete'
import type { LmListSearchAutocompleteProps } from './listWidgetTypes'
const seen = vi.hoisted(() => ({
  mobile: false,
  props: {} as Record<string, any>,
  kind: ''
}))
vi.mock('./SearchPaletteProvider', () => ({
  SearchPaletteProvider: ({ children }: { children: ReactNode }) => (
    <>{children}</>
  ),
  useSearchPalette: () => ({ register: () => () => {}, open: () => {} })
}))
vi.mock('@mui/material/useMediaQuery', () => ({ default: () => seen.mobile }))
vi.mock('@mui/material/ButtonBase', () => ({
  default: ({ children, ...p }: { children: ReactNode }) => {
    seen.props = p
    seen.kind = 'input'
    return <button>{children}</button>
  }
}))
vi.mock('@mui/material/IconButton', () => ({
  default: ({ children, ...p }: { children: ReactNode }) => {
    seen.props = p
    seen.kind = 'icon'
    return <button>{children}</button>
  }
}))
vi.mock('../icon/LmIcon', () => ({
  default: ({ iconName }: { iconName: string }) => <span>{iconName}</span>
}))
const content = {
  _uid: 'search',
  component: 'list_search_autocomplete'
} as LmListSearchAutocompleteProps['content']
function render(
  overrides: Partial<LmListSearchAutocompleteProps['content']> = {}
) {
  return renderToStaticMarkup(<Search content={{ ...content, ...overrides }} />)
}
it('preserves default labels, accessibility and desktop dimensions', () => {
  seen.mobile = false
  expect(render()).toContain('Search')
  expect(seen.props).toMatchObject({
    'aria-label': 'Search',
    'aria-haspopup': 'dialog',
    'data-lm-search-mode': 'input',
    sx: { width: 220, height: 40, borderRadius: 1 }
  })
  const html = render({
    label: 'Find',
    placeholder: 'Pages',
    icon: { name: 'Star' }
  })
  expect(html).toContain('Find')
  expect(html).toContain('Pages')
  expect(html).toContain('Star')
  expect(seen.props['aria-label']).toBe('Find')
})
it('preserves shape, size and outline precedence', () => {
  seen.mobile = false
  render({ fullwidth: true, large: true, outlined: true, shape: 'rounded' })
  expect(seen.props.sx).toMatchObject({
    width: '100%',
    height: 56,
    border: '1px solid',
    borderColor: 'divider',
    borderRadius: '20px'
  })
  render({ large: true, height: '72', shape: 'square', placeholder: 'Lookup' })
  expect(seen.props.sx).toMatchObject({ height: 72, borderRadius: 0 })
  expect(seen.props['aria-label']).toBe('Lookup')
})
it('requires a configured breakpoint for mobile icon mode', () => {
  seen.mobile = true
  render()
  expect(seen.kind).toBe('input')
  render({ mobile_breakpoint: 'md', label: 'Find' })
  expect(seen.kind).toBe('icon')
  expect(seen.props).toMatchObject({
    'data-lm-search-mode': 'icon',
    'aria-label': 'Find',
    color: 'inherit',
    size: 'large'
  })
  seen.mobile = false
})
