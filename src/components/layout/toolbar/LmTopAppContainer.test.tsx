// @vitest-environment happy-dom
import { act, type ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import { expect, it, vi } from 'vitest'
import Toolbar from './LmTopAppContainer'
const state = vi.hoisted(() => ({
  settings: {} as Record<string, any>,
  page: {} as Record<string, any>,
  scroll: false,
  variant: 'temporary',
  open: false,
  props: {} as Record<string, any>
}))
vi.mock('../../provider/SettingsPageProvider', () => ({
  useSettings: () => state.settings,
  usePage: () => state.page
}))
vi.mock('../../../utils/hooks/useScrollTop', () => ({
  default: () => state.scroll
}))
vi.mock('../../../utils/state/navigationState', () => ({
  drawerVariantSelector: (s: Record<string, any>) => s.variant,
  leftNavigationDrawerSelector: (s: Record<string, any>) => s.open,
  useNavigationStore: (select: (s: typeof state) => unknown) => select(state)
}))
vi.mock('@mui/material/AppBar', () => ({
  default: ({ children, ...props }: { children: ReactNode }) => {
    state.props = props
    return <header>{children}</header>
  }
}))
async function check(
  test: (render: () => Promise<void>, host: HTMLDivElement) => Promise<void>
) {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  Object.assign(state, {
    settings: {},
    page: {},
    scroll: false,
    variant: 'temporary',
    open: false
  })
  const host = document.createElement('div'),
    root = createRoot(host)
  const render = async () => {
    await act(async () =>
      root.render(
        <Toolbar>
          <input defaultValue="keep" />
        </Toolbar>
      )
    )
  }
  try {
    await test(render, host)
  } finally {
    await act(async () => root.unmount())
  }
}
it('preserves feature-image scroll colors, elevation and mounted children', async () =>
  check(async (render, host) => {
    state.settings = {
      toolbar_color: { rgba: 'red' },
      toolbar_background: 'gradient',
      toolbar_elevation: '7',
      toolbar_variant: 'primary',
      toolbar_config: ['fixed', 'text_bold']
    }
    state.page = { property: ['has_feature'] }
    await render()
    const input = host.querySelector('input')
    expect(state.props).toMatchObject({
      elevation: 0,
      position: 'fixed',
      color: 'primary',
      style: { background: 'gradient', backgroundColor: undefined }
    })
    expect(state.props.className).toContain('lm-toolbar__has-feature')
    expect(state.props.className).toContain('lm-toolbar__text-bold')
    state.scroll = true
    await render()
    expect(state.props.elevation).toBe(7)
    expect(state.props.style.backgroundColor).toBe('red')
    expect(state.props.className).not.toContain('lm-toolbar__has-feature')
    expect(host.querySelector('input')).toBe(input)
  }))
it('preserves defaults, unelevated configuration and zero elevation', async () =>
  check(async (render) => {
    await render()
    expect(state.props).toMatchObject({
      elevation: 4,
      position: 'relative',
      style: { background: undefined, backgroundColor: undefined }
    })
    state.settings = {
      toolbar_config: ['unelevated'],
      toolbar_elevation: '0',
      toolbar_variant: 'dark',
      toolbar_color: { rgba: 'blue' }
    }
    await render()
    expect(state.props.elevation).toBe(0)
    expect(state.props.color).toBe('inherit')
    expect(state.props.style.backgroundColor).toBe('blue')
    state.scroll = true
    await render()
    expect(state.props.elevation).toBe(0)
  }))
it('preserves drawer shift conditions', async () =>
  check(async (render) => {
    state.open = true
    await render()
    expect(state.props.sx[1]).toBe(false)
    state.variant = 'persistent'
    await render()
    expect(typeof state.props.sx[1]).toBe('function')
    for (const flag of ['drawer_below_toolbar', 'drawer_below_toolbar_xs']) {
      state.settings = { [flag]: true }
      await render()
      expect(state.props.sx[1]).toBe(false)
    }
    state.settings = {}
    state.open = false
    await render()
    expect(state.props.sx[1]).toBe(false)
  }))
