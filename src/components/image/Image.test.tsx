// @vitest-environment happy-dom
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { expect, it, vi } from 'vitest'
import LmImage from './Image'
import type { LmImageProps } from './imageTypes'

vi.mock('../avatar/LmSquareImage', () => ({
  default: ({ imageProps, size }: any) => (
    <img alt="" {...imageProps} data-size={size} />
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
    return host.querySelector('img')!
  }
  try {
    let image = await render({})
    expect(image.style.maxHeight).toBe('60px')
    expect(image.getAttribute('loading')).toBe('eager')
    await act(async () => image.click())
    expect(onClick).toHaveBeenCalledOnce()
    image = await render({ height: '120', property: ['square'] })
    expect(image.style.objectFit).toBe('cover')
    expect(image.getAttribute('data-size')).toBe('120')
    image = await render({ priority: true })
    expect(image.getAttribute('loading')).toBeNull()
    expect(image.alt).toBe('Example')
    await render({ source: '' })
    expect(host.querySelector('img')).toBeNull()
  } finally {
    await act(async () => root.unmount())
  }
})
