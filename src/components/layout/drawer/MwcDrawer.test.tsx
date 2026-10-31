// @vitest-environment happy-dom
import { act, StrictMode, type PropsWithChildren } from 'react'
import { createRoot } from 'react-dom/client'
import { expect, it, vi } from 'vitest'
import DrawerContainer from './MwcDrawer'
import { useNavigationStore } from '../../../utils/state/navigationState'

const fixture = vi.hoisted(() => ({ slug: '/home', mobile: false }))
vi.mock('../../provider/context/AppContext', () => ({
  useAppContext: () => fixture
}))
vi.mock('../../provider/SettingsPageProvider', () => ({
  useSettings: () => ({})
}))
vi.mock('@mui/material/useMediaQuery', () => ({
  default: () => fixture.mobile
}))
vi.mock('@mui/material/Drawer', () => ({
  default: ({
    open,
    onClose,
    slotProps,
    children
  }: PropsWithChildren<{
    open: boolean
    onClose: () => void
    slotProps: { transition: { unmountOnExit: boolean } }
  }>) => (
    <div
      data-open={String(open)}
      data-unmount={String(slotProps.transition.unmountOnExit)}
    >
      <button onClick={onClose}>Close</button>
      {children}
    </div>
  )
}))

it('retains the opened-once flag across closes and preserves route/breakpoint closing', async () => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  useNavigationStore.setState({
    drawerVariant: 'persistent',
    leftNavigationDrawer: false
  })
  const host = document.createElement('div')
  const root = createRoot(host)
  const render = async () => {
    await act(async () =>
      root.render(
        <StrictMode>
          <DrawerContainer>Content</DrawerContainer>
        </StrictMode>
      )
    )
  }
  const expectDrawer = (open: boolean, unmount: boolean) => {
    expect(host.querySelector('[data-open]')?.getAttribute('data-open')).toBe(
      String(open)
    )
    expect(
      host.querySelector('[data-unmount]')?.getAttribute('data-unmount')
    ).toBe(String(unmount))
  }
  try {
    await render()
    expectDrawer(false, true)
    await act(async () => useNavigationStore.getState().toggleLeftDrawer())
    expectDrawer(true, false)
    await act(async () => host.querySelector('button')!.click())
    expectDrawer(false, false)
    await act(async () => useNavigationStore.getState().toggleLeftDrawer())
    fixture.slug = '/next'
    await render()
    expectDrawer(true, false)
    fixture.mobile = true
    await render()
    expectDrawer(false, false)
    fixture.mobile = false
    await act(async () =>
      useNavigationStore.setState({ drawerVariant: 'temporary' })
    )
    await act(async () => useNavigationStore.getState().toggleLeftDrawer())
    expectDrawer(true, false)
    fixture.slug = '/last'
    await render()
    expectDrawer(false, false)
  } finally {
    await act(async () => root.unmount())
    fixture.slug = '/home'
    fixture.mobile = false
    useNavigationStore.setState({
      drawerVariant: 'temporary',
      leftNavigationDrawer: false
    })
  }
})
