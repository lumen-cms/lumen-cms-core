import { getImageProps } from 'next/image'
import { expect, it } from 'vitest'
import { loader, storyblokImageLoader } from './storyblokImageLoader'

it.each(['bell.gif', 'bell.GIF?v=2#preview'])(
  'serves %s unchanged without resized candidates',
  (filename) => {
    const src = `https://a.storyblok.com/f/69559/400x400/hash/${filename}`
    const { props } = getImageProps({
      src,
      alt: 'Bell',
      width: 40,
      height: 40,
      ...storyblokImageLoader(src)
    })
    expect(props.src).toBe(src)
    expect(props.srcSet).toBeUndefined()
    expect(loader({ src, width: 40, quality: 75 })).toBe(src)
  }
)

it('keeps responsive photo optimization enabled', () => {
  const src = 'https://a.storyblok.com/f/69559/400x400/hash/photo.jpg'
  const { props } = getImageProps({
    src,
    alt: 'Photo',
    width: 40,
    height: 40,
    ...storyblokImageLoader(src)
  })
  expect(props.srcSet).toContain('/m/96x0/filters:quality(75) 2x')
})
