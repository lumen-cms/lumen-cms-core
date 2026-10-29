// @vitest-environment happy-dom
import { act, type PropsWithChildren } from 'react'
import { createRoot } from 'react-dom/client'
import { expect, it, vi } from 'vitest'
import { CollapsibleListSection } from './CollapsibleListSection'
import type { NavMenuStoryblok } from '../../../typings/generated/components-schema'

vi.mock('../../icon/LmIcon', () => ({
  default: ({ iconName, iconUrl }: { iconName?: string; iconUrl?: string }) => (
    <span data-icon={iconName} data-url={iconUrl} />
  )
}))
vi.mock('./DrawerButton', () => ({ DrawerButton: () => null }))
vi.mock('./DrawerNavList', () => ({ DrawerNavList: () => null }))
vi.mock('../../CoreComponents', () => ({
  LmComponentRender: () => <span>Child</span>
}))
vi.mock('@mui/material/Collapse', () => ({
  default: ({ children, in: open }: PropsWithChildren<{ in: boolean }>) => (
    <div data-open={String(open)}>{children}</div>
  )
}))

it.each([false, true])(
  'keeps configured icons mounted across updates (initially open: %s)',
  async (open) => {
    vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
    const host = document.createElement('div')
    document.body.append(host)
    const root = createRoot(host)
    const content = {
      _uid: 'menu',
      component: 'nav_menu',
      title: 'Menu',
      icon: { name: 'Expand' },
      icon_collapse: { name: 'Collapse' },
      icon_custom: [{ icon_url: '/expand.svg' }],
      icon_collapse_custom: [{ icon_url: '/collapse.svg' }],
      body: []
    } as unknown as NavMenuStoryblok
    try {
      await act(async () =>
        root.render(
          <CollapsibleListSection
            content={content}
            openedPath={open ? ['menu'] : []}
          />
        )
      )
      const icon = host.querySelector('[data-icon]')!
      expect(icon).not.toBeNull()
      expect(icon.getAttribute('data-url')).toBe(
        open ? '/collapse.svg' : '/expand.svg'
      )
      await act(async () =>
        root.render(
          <CollapsibleListSection
            content={{ ...content, title: 'Updated' }}
            openedPath={open ? ['menu'] : []}
          />
        )
      )
      expect(host.querySelector('[data-icon]')).toBe(icon)
      expect(host.textContent).toContain('Updated')
      expect(host.querySelector('[data-open]')?.getAttribute('data-open')).toBe(
        String(open)
      )
      await act(async () =>
        (host.querySelector('[role="button"]') as HTMLElement).click()
      )
      expect(host.querySelector('[data-icon]')?.getAttribute('data-icon')).toBe(
        open ? 'Expand' : 'Collapse'
      )
      expect(host.querySelector('[data-open]')?.getAttribute('data-open')).toBe(
        String(!open)
      )
    } finally {
      await act(async () => root.unmount())
      host.remove()
    }
  }
)

it('evaluates the initial opened path once and preserves user toggles on rerender', async () => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  const path = ['menu']
  const includes = vi.spyOn(path, 'includes')
  const host = document.createElement('div')
  const root = createRoot(host)
  const content = {
    _uid: 'menu',
    component: 'nav_menu',
    title: 'Menu',
    body: []
  } as NavMenuStoryblok
  try {
    await act(async () =>
      root.render(
        <CollapsibleListSection content={content} openedPath={path} />
      )
    )
    expect(includes).toHaveBeenCalledOnce()
    includes.mockClear()
    await act(async () =>
      (host.querySelector('[role="button"]') as HTMLElement).click()
    )
    await act(async () =>
      root.render(
        <CollapsibleListSection
          content={{ ...content, title: 'Changed' }}
          openedPath={path}
        />
      )
    )
    expect(includes).not.toHaveBeenCalled()
    expect(host.querySelector('[data-open]')?.getAttribute('data-open')).toBe(
      'false'
    )
  } finally {
    await act(async () => root.unmount())
  }
})
