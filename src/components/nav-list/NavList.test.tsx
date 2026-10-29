// @vitest-environment happy-dom
import { act, type PropsWithChildren } from 'react'
import { createRoot } from 'react-dom/client'
import { expect, it, vi } from 'vitest'
import { LmNavList } from './NavList'
import type { LmNavListProps } from './navListTypes'

vi.mock('../../utils/hooks/useDeviceDimensions', () => ({
  default: () => ({ isMobile: true })
}))
vi.mock('../flex-row/FlexRow', () => ({
  LmFlexRow: ({ children }: PropsWithChildren) => <div>{children}</div>
}))
vi.mock('../CoreComponents', () => ({
  LmComponentRender: ({
    content
  }: {
    content: { component: string; text?: string }
  }) =>
    content.component === 'headline' ? (
      <span data-headline>{content.text}</span>
    ) : (
      <input aria-label="Navigation field" />
    )
}))

it.each([false, true])(
  'preserves navigation children across updates (collapsed layout: %s)',
  async (forceCollapse) => {
    vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
    const host = document.createElement('div')
    document.body.append(host)
    const root = createRoot(host)
    const content = {
      _uid: 'nav',
      component: 'nav_list',
      header: 'Links',
      forceCollapse,
      body: [{ _uid: 'item', component: 'nav_item' }]
    } as LmNavListProps['content']
    try {
      await act(async () => root.render(<LmNavList content={content} />))
      if (forceCollapse)
        await act(async () => host.querySelector('button')!.click())
      const input = host.querySelector('input')!
      const headline = host.querySelector('[data-headline]')!
      input.value = 'Keep me'
      input.focus()
      await act(async () =>
        root.render(
          <LmNavList content={{ ...content, header: 'Updated links' }} />
        )
      )
      expect(host.querySelector('input')).toBe(input)
      expect(input.value).toBe('Keep me')
      expect(document.activeElement).toBe(input)
      expect(host.querySelector('[data-headline]')).toBe(headline)
      expect(headline.textContent).toBe('Updated links')
      if (forceCollapse)
        expect(
          host.querySelector('button')?.getAttribute('aria-expanded')
        ).toBe('true')
    } finally {
      await act(async () => root.unmount())
      host.remove()
    }
  }
)
