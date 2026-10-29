// @vitest-environment happy-dom
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { expect, it, vi } from 'vitest'
import LmCardStandalone from './CardStandalone'
import type { LmCardStandaloneProps } from './cardTypes'

vi.mock('../section/useBackgroundBox', () => ({
  default: () => ({ className: '', style: {}, sx: [] })
}))
vi.mock('../section/BackgroundImage', () => ({ default: () => null }))
vi.mock('../section/BackgroundElements', () => ({ default: () => null }))
vi.mock('../CoreComponents', () => ({
  LmComponentRender: () => <input aria-label="Card field" defaultValue="" />
}))

it.each([false, true])(
  'preserves child input and focus on parent rerenders (linked: %s)',
  async (linked) => {
    vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
    const host = document.createElement('div')
    document.body.append(host)
    const root = createRoot(host)
    const content = {
      _uid: 'card',
      component: 'card',
      body: [{ _uid: 'field', component: 'paragraph' }],
      ...(linked
        ? {
            link: {
              linktype: 'url',
              cached_url: 'https://example.com/offer',
              url: 'https://example.com/offer'
            }
          }
        : {})
    } as LmCardStandaloneProps['content']
    try {
      await act(async () => root.render(<LmCardStandalone content={content} />))
      const input = host.querySelector('input')!
      input.value = 'Unsaved customer details'
      input.focus()
      await act(async () =>
        root.render(
          <LmCardStandalone content={{ ...content, elevation: '3' }} />
        )
      )
      expect(host.querySelector('input')).toBe(input)
      expect(input.value).toBe('Unsaved customer details')
      expect(document.activeElement).toBe(input)
      if (linked)
        expect(host.querySelector('a')?.getAttribute('href')).toBe(
          'https://example.com/offer'
        )
    } finally {
      await act(async () => root.unmount())
      host.remove()
    }
  }
)
