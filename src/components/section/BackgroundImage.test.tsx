// @vitest-environment happy-dom
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { expect, it, vi } from 'vitest'
import BackgroundImage from './BackgroundImage'
import type { BackgroundStoryblok } from '../../typings/generated/components-schema'

vi.mock('next/image', () => ({
  default: ({
    src,
    alt,
    className,
    style,
    loading,
    priority,
    quality
  }: {
    src: string
    alt: string
    className?: string
    style?: React.CSSProperties
    loading?: 'eager' | 'lazy'
    priority?: boolean
    quality?: number
  }) => (
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      loading={loading}
      data-priority={String(priority)}
      data-quality={quality}
    />
  )
}))

it.each([undefined, 'fixed_cover', 'fixed_image'] as const)(
  'retains both background images when props update (%s)',
  async (backgroundStyle) => {
    vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
    const host = document.createElement('div')
    document.body.append(host)
    const root = createRoot(host)
    const content = {
      _uid: 'bg',
      component: 'background',
      image: 'https://example.com/landscape.jpg',
      alternative_image: 'https://example.com/portrait.jpg',
      background_position: 'center',
      background_size: 'cover',
      quality: '80',
      disable_lazy_loading: true
    } as BackgroundStoryblok
    try {
      await act(async () =>
        root.render(
          <BackgroundImage
            content={content}
            backgroundStyle={backgroundStyle}
          />
        )
      )
      const images = Array.from(host.querySelectorAll('img'))
      expect(images).toHaveLength(2)
      expect(images[0].className).toContain('landscape')
      expect(images[1].className).toContain('portrait')
      expect(images[0].loading).toBe('eager')
      const wrapper = images[0].parentElement
      await act(async () =>
        root.render(
          <BackgroundImage
            content={{ ...content, background_position: 'top' }}
            backgroundStyle={backgroundStyle}
            sectionPosition={0}
          />
        )
      )
      expect(host.querySelectorAll('img')[0]).toBe(images[0])
      expect(host.querySelectorAll('img')[1]).toBe(images[1])
      expect(images[0].parentElement).toBe(wrapper)
      expect(images[0].style.objectPosition).toBe('top')
      expect(images[0].getAttribute('data-priority')).toBe('true')
      expect(images[0].getAttribute('data-quality')).toBe('80')
      expect(images[0].getAttribute('loading')).toBeNull()
    } finally {
      await act(async () => root.unmount())
      host.remove()
    }
  }
)
