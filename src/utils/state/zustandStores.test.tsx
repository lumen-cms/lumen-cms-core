// @vitest-environment happy-dom
import { act, StrictMode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { useNavigationStore } from './navigationState'
import { useUserActions, useUserData } from '../../components/auth/useAuth'
import { LmToggleDrawerButton } from '../../components/layout/toolbar/ToggleDrawerButton'
import SettingsPageProvider from '../../components/provider/SettingsPageProvider'

let host: HTMLDivElement
let root: Root

beforeEach(() => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
  useNavigationStore.setState({
    leftNavigationDrawer: false,
    rightNavigationDrawer: false
  })
  host = document.createElement('div')
  document.body.append(host)
  root = createRoot(host)
})
afterEach(async () => {
  await act(async () => root.unmount())
  host.remove()
})

describe('navigation store', () => {
  it('toggles the drawers through the toolbar button without render loops', async () => {
    await act(async () =>
      root.render(
        <StrictMode>
          <SettingsPageProvider
            settings={{} as any}
            page={{ right_body: [{}] } as any}
          >
            <LmToggleDrawerButton
              content={{ _uid: 'left', component: 'toolbar_navi_button' }}
            />
            <LmToggleDrawerButton
              content={{
                _uid: 'right',
                component: 'toolbar_navi_button',
                is_right_drawer: true
              }}
            />
          </SettingsPageProvider>
        </StrictMode>
      )
    )
    const [left, right] = host.querySelectorAll('button')
    expect(left.getAttribute('aria-label')).toBe('Drawer left toggle')
    expect(right.getAttribute('aria-label')).toBe('Drawer right toggle')

    await act(async () => left.click())
    expect(useNavigationStore.getState().leftNavigationDrawer).toBe(true)
    expect(useNavigationStore.getState().rightNavigationDrawer).toBe(false)

    await act(async () => right.click())
    expect(useNavigationStore.getState().rightNavigationDrawer).toBe(true)

    await act(async () => left.click())
    expect(useNavigationStore.getState().leftNavigationDrawer).toBe(false)
  })
})

describe('auth store', () => {
  it('shares the current user between consumers', async () => {
    let actions: ReturnType<typeof useUserActions> | undefined
    function Probe() {
      const user = useUserData()
      actions = useUserActions()
      return <span>{user?.email ?? 'anonymous'}</span>
    }
    await act(async () => root.render(<Probe />))
    expect(host.textContent).toBe('anonymous')
    const firstActions = actions

    await act(async () =>
      actions?.setUser({ id: '1', email: 'reader@example.com' })
    )
    expect(host.textContent).toBe('reader@example.com')
    expect(actions).toBe(firstActions)

    await act(async () => actions?.setUser(null))
    expect(host.textContent).toBe('anonymous')
  })
})
