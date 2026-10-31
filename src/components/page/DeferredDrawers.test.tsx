// @vitest-environment happy-dom
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { renderToString } from 'react-dom/server'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { afterEach, expect, it, vi } from 'vitest'
import Loadable from 'next/dist/shared/lib/loadable.shared-runtime'
import RightDrawer from './RightDrawer'
import MwcDrawer from '../layout/drawer/MwcDrawer'
import { useNavigationStore } from '../../utils/state/navigationState'

const fixture = vi.hoisted(() => ({ desktop: false, slug: '/home' }))
vi.mock('@mui/material/useMediaQuery', () => ({
  default: (query: string) =>
    query.includes('min-width') ? fixture.desktop : !fixture.desktop
}))
vi.mock('../provider/SettingsPageProvider', () => ({
  useSettings: () => ({}),
  usePage: () => ({ mobile_breakpoint: 'sm' })
}))
vi.mock('../provider/context/AppContext', () => ({
  useAppContext: () => fixture
}))
vi.mock('../CoreComponents', () => ({
  LmComponentRender: () => <button data-content>Right content</button>
}))
vi.mock('../layout/ContentSpace', () => ({ ContentSpace: () => <div /> }))
const theme = createTheme()
theme.drawer = { left: '240px', right: '240px' }
const rightBody = [
  { component: 'headline' as const, _uid: 'title', text: 'Title' }
]

afterEach(() => {
  fixture.desktop = false
  fixture.slug = '/home'
  useNavigationStore.setState({
    drawerVariant: 'temporary',
    leftNavigationDrawer: false,
    rightNavigationDrawer: false
  })
})

it.each(['left', 'right'] as const)(
  'defers a closed %s drawer, opens, focuses and closes with Escape/backdrop',
  async (side) => {
    vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
    const trigger = document.createElement('button')
    document.body.append(trigger)
    trigger.focus()
    const host = document.createElement('div')
    document.body.append(host)
    const root = createRoot(host)
    const toggle = () =>
      side === 'left'
        ? useNavigationStore.getState().toggleLeftDrawer()
        : useNavigationStore.getState().toggleRightDrawer()
    const isOpen = () =>
      side === 'left'
        ? useNavigationStore.getState().leftNavigationDrawer
        : useNavigationStore.getState().rightNavigationDrawer
    const element = (
      <ThemeProvider theme={theme}>
        {side === 'left' ? (
          <MwcDrawer>
            <button data-content>Left content</button>
          </MwcDrawer>
        ) : (
          <RightDrawer rightBody={rightBody} />
        )}
      </ThemeProvider>
    )
    try {
      await act(async () => root.render(element))
      expect(document.querySelector('.MuiDrawer-root')).toBeNull()
      await act(async () => toggle())
      await vi.waitFor(async () => {
        await act(async () => {})
        expect(document.querySelector('[role="dialog"]')).not.toBeNull()
      })
      expect(isOpen()).toBe(true)
      const dialog = document.querySelector<HTMLElement>('[role="dialog"]')!
      expect(dialog.contains(document.activeElement)).toBe(true)
      await act(async () =>
        dialog.dispatchEvent(
          new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })
        )
      )
      expect(isOpen()).toBe(false)
      await act(async () => toggle())
      expect(isOpen()).toBe(true)
      await act(async () =>
        document.querySelector<HTMLElement>('.MuiBackdrop-root')!.click()
      )
      expect(isOpen()).toBe(false)
    } finally {
      await act(async () => root.unmount())
      host.remove()
      trigger.remove()
    }
  }
)

it('server-renders permanent desktop drawers and keeps the right drawer visible across closed state', async () => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  fixture.desktop = true
  useNavigationStore.setState({ drawerVariant: 'permanent' })
  // Next's Pages renderer preloads next/dynamic modules before rendering HTML.
  await Loadable.preloadAll()
  const element = (
    <ThemeProvider theme={theme}>
      <MwcDrawer>
        <button>Left permanent</button>
      </MwcDrawer>
      <RightDrawer rightBody={rightBody} />
    </ThemeProvider>
  )
  const html = renderToString(element)
  // The left store's SSR snapshot is temporary, as before; the right drawer
  // can be permanent during SSR when matchMedia is supplied by the theme.
  expect(html).toContain('Right content')
  expect(html).toContain('MuiDrawer-docked')
  const host = document.createElement('div')
  const root = createRoot(host)
  try {
    await act(async () => root.render(element))
    expect(host.querySelectorAll('.MuiDrawer-docked')).toHaveLength(2)
    await act(async () => useNavigationStore.getState().closeRightDrawer())
    expect(host.textContent).toContain('Right content')
    fixture.desktop = false
    await act(async () =>
      root.render(
        <ThemeProvider theme={theme}>
          <RightDrawer rightBody={rightBody} />
        </ThemeProvider>
      )
    )
    expect(host.querySelector('.MuiDrawer-docked')).toBeNull()
  } finally {
    await act(async () => root.unmount())
  }
})
