// @vitest-environment happy-dom
import { act, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { expect, it, vi } from 'vitest'
import { LmMenu } from './NavMenu'

vi.mock('../provider/context/AppContext', () => ({
  useAppContext: () => ({ slug: '/home' })
}))
vi.mock('../CoreComponents', () => ({ LmComponentRender: () => null }))
vi.mock('@mui/material/Menu', () => ({
  default: ({ open }: { open: boolean }) =>
    open ? <div role="menu">Open menu</div> : null
}))

it('cancels superseded initial opening, preserves deferred opening, and clears its timer on unmount', async () => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  vi.useFakeTimers()
  const host = document.createElement('div')
  document.body.append(host)
  const root = createRoot(host)
  let unmounted = false
  const content = {
    component: 'nav_menu' as const,
    _uid: 'timer-menu',
    title: 'Menu',
    body: []
  }
  const render = async (initialOpen: boolean) => {
    await act(async () =>
      root.render(
        <StrictMode>
          <LmMenu content={content} initialOpen={initialOpen} />
        </StrictMode>
      )
    )
  }
  try {
    await render(true)
    expect(host.querySelector('[role="menu"]')).toBeNull()
    await render(false)
    await act(async () => vi.runAllTimers())
    expect(host.querySelector('[role="menu"]')).toBeNull()
    await render(true)
    expect(host.querySelector('[role="menu"]')).toBeNull()
    await act(async () => vi.runAllTimers())
    expect(host.querySelector('[role="menu"]')).not.toBeNull()
    await render(false)
    await render(true)
    await act(async () => root.unmount())
    unmounted = true
    expect(vi.getTimerCount()).toBe(0)
  } finally {
    if (!unmounted) await act(async () => root.unmount())
    host.remove()
    vi.useRealTimers()
  }
})
