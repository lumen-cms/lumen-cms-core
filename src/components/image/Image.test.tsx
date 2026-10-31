// @vitest-environment happy-dom
import { act, type ComponentProps } from 'react'
import type SquareImage from '../avatar/LmSquareImage'
import { createRoot } from 'react-dom/client'
import { expect, it, vi } from 'vitest'
import LmImage from './Image'
import type { LmImageProps } from './imageTypes'

vi.mock('../avatar/LmSquareImage', () => ({
  default: ({ imageProps, size }: ComponentProps<typeof SquareImage>) => (
    <span
      data-image-probe
      data-alt={imageProps?.alt || ''}
      data-loading={imageProps?.loading}
      data-size={size}
      style={imageProps?.style}
      onClick={imageProps?.onClick}
    />
  )
}))

it('preserves sizing, clicks and loading options when switching image layouts', async () => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  const host = document.createElement('div')
  const root = createRoot(host)
  const onClick = vi.fn()
  const content: LmImageProps['content'] = {
    _uid: 'image',
    component: 'image',
    source: 'https://a.storyblok.com/f/1/800x400/abcdef/image.jpg',
    alt: 'Example',
    width: '120',
    disable_lazy_loading: true
  }
  const render = async (overrides: Partial<LmImageProps['content']>) => {
    await act(async () =>
      root.render(
        <LmImage content={{ ...content, ...overrides }} onClick={onClick} />
      )
    )
    return host.querySelector<HTMLElement>('[data-image-probe]')!
  }
  try {
    let image = await render({})
    expect(image.style.maxHeight).toBe('60px')
    expect(image.getAttribute('data-loading')).toBe('eager')
    await act(async () => image.click())
    expect(onClick).toHaveBeenCalledOnce()
    image = await render({ height: '120', property: ['square'] })
    expect(image.style.objectFit).toBe('cover')
    expect(image.getAttribute('data-size')).toBe('120')
    image = await render({ priority: true })
    expect(image.getAttribute('data-loading')).toBeNull()
    expect(image.getAttribute('data-alt')).toBe('Example')
    await render({ source: '' })
    expect(host.querySelector<HTMLElement>('[data-image-probe]')).toBeNull()
  } finally {
    await act(async () => root.unmount())
  }
})
