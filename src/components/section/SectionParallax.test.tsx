// @vitest-environment happy-dom
import { act, type PropsWithChildren } from 'react'
import { createRoot } from 'react-dom/client'
import { expect, it, vi } from 'vitest'
import SectionParallax from './SectionParallax'
import type { LmSectionParallaxProps } from './sectionTypes'
vi.mock('react-scroll-parallax', () => ({
  ParallaxBanner: ({ children }: PropsWithChildren) => <div>{children}</div>,
  ParallaxBannerLayer: ({
    children,
    speed
  }: PropsWithChildren<{ speed: number }>) => (
    <div data-speed={speed}>{children}</div>
  )
}))
vi.mock('../CoreComponents', () => ({
  LmComponentRender: () => <input aria-label="Layer field" />
}))
it('uses the CMS layer identity even if spread data contains a changing key', async () => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  const host = document.createElement('div')
  document.body.append(host)
  const root = createRoot(host)
  const content = {
    _uid: 'section',
    component: 'section_parallax',
    elements: [
      {
        _uid: 'layer',
        component: 'parallax_item',
        key: 'first',
        speed: '5',
        children: [{ _uid: 'field', component: 'paragraph' }]
      }
    ]
  } as unknown as LmSectionParallaxProps['content']
  try {
    await act(async () => root.render(<SectionParallax content={content} />))
    const input = host.querySelector('input')!
    expect(input).not.toBeNull()
    input.value = 'Keep me'
    input.focus()
    await act(async () =>
      root.render(
        <SectionParallax
          content={{
            ...content,
            elements: content.elements!.map((element) => ({
              ...element,
              key: 'changed',
              speed: '8'
            }))
          }}
        />
      )
    )
    expect(host.querySelector('input')).toBe(input)
    expect(input.value).toBe('Keep me')
    expect(document.activeElement).toBe(input)
    expect(host.querySelector('[data-speed]')?.getAttribute('data-speed')).toBe(
      '8'
    )
  } finally {
    await act(async () => root.unmount())
    host.remove()
  }
})
