import { expect, it } from 'vitest'
import { storyblokImageUrl } from '../../packages/lumen-cms-astro/src/images/storyblok-service'
it.each(['bell.gif', 'bell.GIF?v=2#preview'])('preserves the original GIF %s', (filename) => {
  const src = `https://a.storyblok.com/f/69559/400x400/hash/${filename}`
  expect(storyblokImageUrl(src, 40, 75)).toBe(src)
  expect(storyblokImageUrl(src.replace('https:', ''), 80)).toBe(src)
})
it('uses Storyblok transformation URLs without an Astro optimization hop', () => {
  expect(storyblokImageUrl('https://a.storyblok.com/f/123/1200x800/photo.jpg', 640, 80)).toBe('https://a.storyblok.com/f/123/1200x800/photo.jpg/m/640x0/filters:quality(80)')
  expect(storyblokImageUrl('//a.storyblok.com/f/123/1200x800/photo.jpg/m/300x0', 640)).toBe('https://a.storyblok.com/f/123/1200x800/photo.jpg/m/640x0/filters:quality(75)')
})
it('preserves SVG and non-Storyblok sources', () => {
  expect(storyblokImageUrl('https://a.storyblok.com/f/123/logo.svg', 100)).toBe('https://a.storyblok.com/f/123/logo.svg')
  expect(storyblokImageUrl('https://example.com/image.jpg', 100)).toBe('https://example.com/image.jpg')
})
