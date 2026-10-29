// @vitest-environment happy-dom
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { expect, it, vi } from 'vitest'
import { LmToggleDrawerButton } from './ToggleDrawerButton'
import { useNavigationStore } from '../../../utils/state/navigationState'
import type { LmToggleDrawerButtonProps } from './toolbarTypes'

const fixture = vi.hoisted(() => ({ rightBody: [{}] as object[] }))

vi.mock('../../provider/SettingsPageProvider', () => ({
  useSettings: () => ({ mobile_nav_breakpoint: 'md' }),
  usePage: () => ({ mobile_breakpoint: 'lg', right_body: fixture.rightBody })
}))
vi.mock('../../icon/LmIcon', () => ({
  default: ({ iconName }: { iconName: string }) => <span data-icon={iconName} />
}))
vi.mock('../../CoreComponents', () => ({
  LmComponentRender: ({
    onClick,
    additionalClassName
  }: {
    onClick: () => void
    additionalClassName: string
  }) => (
    <button className={additionalClassName} onClick={onClick}>
      Custom
    </button>
  )
}))

it.each([false, true])(
  'keeps closed icon mounted and toggles the correct drawer (right: %s)',
  async (right) => {
    vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
    useNavigationStore.setState({
      leftNavigationDrawer: false,
      rightNavigationDrawer: false
    })
    const host = document.createElement('div')
    document.body.append(host)
    const root = createRoot(host)
    const content = {
      _uid: 'toggle',
      component: 'toolbar_navi_button',
      is_right_drawer: right,
      icon: { name: 'Menu' }
    } as LmToggleDrawerButtonProps['content']
    try {
      await act(async () =>
        root.render(<LmToggleDrawerButton content={content} />)
      )
      const icon = host.querySelector('[data-icon]')
      expect(icon).not.toBeNull()
      await act(async () =>
        root.render(
          <LmToggleDrawerButton content={{ ...content, force_show: true }} />
        )
      )
      expect(host.querySelector('[data-icon]')).toBe(icon)
      await act(async () => host.querySelector('button')!.click())
      expect(useNavigationStore.getState().leftNavigationDrawer).toBe(!right)
      expect(useNavigationStore.getState().rightNavigationDrawer).toBe(right)
      expect(host.querySelector('[data-icon]')).toBeNull()
      await act(async () => host.querySelector('button')!.click())
      expect(host.querySelector('[data-icon]')).not.toBeNull()
    } finally {
      await act(async () => root.unmount())
      host.remove()
      useNavigationStore.setState({
        leftNavigationDrawer: false,
        rightNavigationDrawer: false
      })
    }
  }
)

it.each([false, true])(
  'preserves custom controls and breakpoint visibility (right: %s)',
  async (right) => {
    vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
    const host = document.createElement('div')
    const root = createRoot(host)
    const content = {
      _uid: 'toggle',
      component: 'toolbar_navi_button',
      is_right_drawer: right,
      button: [{ _uid: 'custom', component: 'button' }]
    } as LmToggleDrawerButtonProps['content']
    try {
      await act(async () =>
        root.render(<LmToggleDrawerButton content={content} />)
      )
      expect(host.querySelector('button')!.className).toBe(
        right ? 'd-lg-none' : 'd-md-none'
      )
      await act(async () => host.querySelector('button')!.click())
      expect(useNavigationStore.getState().leftNavigationDrawer).toBe(!right)
      expect(useNavigationStore.getState().rightNavigationDrawer).toBe(right)
      await act(async () =>
        root.render(
          <LmToggleDrawerButton content={{ ...content, force_show: true }} />
        )
      )
      expect(host.querySelector('button')!.className).toBe('')
    } finally {
      await act(async () => root.unmount())
      useNavigationStore.setState({
        leftNavigationDrawer: false,
        rightNavigationDrawer: false
      })
    }
  }
)

it('hides only the right toggle when the page has no right drawer', async () => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  fixture.rightBody = []
  const host = document.createElement('div')
  const root = createRoot(host)
  const content = {
    _uid: 'toggle',
    component: 'toolbar_navi_button',
    is_right_drawer: true
  } as LmToggleDrawerButtonProps['content']
  try {
    await act(async () =>
      root.render(<LmToggleDrawerButton content={content} />)
    )
    expect(host.childElementCount).toBe(0)
    await act(async () =>
      root.render(
        <LmToggleDrawerButton
          content={{ ...content, is_right_drawer: false }}
        />
      )
    )
    expect(host.querySelector('button')?.getAttribute('aria-label')).toBe(
      'Drawer left toggle'
    )
    expect(host.querySelector('svg')).not.toBeNull()
  } finally {
    await act(async () => root.unmount())
    fixture.rightBody = [{}]
  }
})
