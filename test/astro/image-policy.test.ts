// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest'
import { isStoryblokImage, isSvgImage, responsiveCandidates, storyblokDimensions } from '../../packages/lumen-cms-astro/src/images/policy'
import { storyblokImageUrl } from '../../packages/lumen-cms-astro/src/images/storyblok-service'

describe('CMS image selection', () => {
 it('uses density descriptors for fixed images, width descriptors for responsive images', () => {
  expect(responsiveCandidates(52, '52px')).toEqual([{ width: 52, descriptor: '52w' }, { width: 104, descriptor: '104w' }])
  expect(responsiveCandidates(40)).toEqual([{ width: 40, descriptor: '1x' }, { width: 80, descriptor: '2x' }])
  expect(responsiveCandidates(40, undefined, undefined, [1, '1.5x', 2, 2])).toEqual([{ width: 40, descriptor: '1x' }, { width: 60, descriptor: '1.5x' }, { width: 80, descriptor: '2x' }])
  expect(responsiveCandidates(400, '50vw', [640, 320, 640])).toEqual([{ width: 320, descriptor: '320w' }, { width: 640, descriptor: '640w' }])
  expect(() => responsiveCandidates(400, undefined, [320], [2])).toThrow()
 })
 it('only recognizes the actual Storyblok HTTPS host', () => {
  expect(isStoryblokImage('//a.storyblok.com/f/1/600x400/a.jpg')).toBe(true)
  for (const src of ['https://a.storyblok.com.evil.test/image.jpg', 'https://evil.test/a.storyblok.com/a.jpg', '/a.storyblok.com.jpg', 'http://a.storyblok.com/a.jpg']) expect(isStoryblokImage(src)).toBe(false)
 })
 it('reads dimensions only from real Storyblok metadata and handles transformed sources', () => {
  expect(storyblokDimensions('https://a.storyblok.com/f/1/600x400/a.jpg/m/320x0')).toEqual({ width: 600, height: 400 })
  expect(storyblokDimensions('https://cdn.shopify.com/600x400/a.jpg')).toBeUndefined()
  expect(storyblokDimensions('https://a.storyblok.com/f/1/0x400/a.jpg')).toBeUndefined()
 })
 it('preserves SVGs with queries and does not transform hostile lookalike hosts', () => {
  const svg = 'https://a.storyblok.com/f/logo.SVG?v=2'
  expect(isSvgImage(svg)).toBe(true)
  expect(storyblokImageUrl(svg, 320)).toBe(svg)
  const other = 'https://a.storyblok.com.evil.test/f/a.jpg'
  expect(storyblokImageUrl(other, 320)).toBe(other)
 })
})

import { updateStoryImage } from '../../packages/lumen-cms-astro/src/client/storyImage'
it('rebinds paginated Storyblok images without retaining template sources', () => {
 const img = document.createElement('img'); img.width = 80
 img.src = 'https://a.storyblok.com/f/1/template.jpg/m/80x0/filters:quality(95)'
 img.srcset = `${img.src} 1x, ${img.src} 2x`
 updateStoryImage(img, '//a.storyblok.com/f/1/600x400/new.jpg')
 expect(img.srcset).toContain('/160x0/filters:quality(95) 2x')
 expect(img.srcset).not.toContain('template')
 updateStoryImage(img, 'https://cdn.shopify.com/new.jpg')
 expect(img.hasAttribute('srcset')).toBe(false)
 expect(img.src).toBe('https://cdn.shopify.com/new.jpg')
})
it('does not advertise transformed variants for SVG pagination images', () => {
 const img = document.createElement('img'); img.srcset = 'https://a.storyblok.com/f/a.jpg 320w'
 updateStoryImage(img, 'https://a.storyblok.com/f/logo.svg?v=1')
 expect(img.hasAttribute('srcset')).toBe(false)
 expect(img.src).toBe('https://a.storyblok.com/f/logo.svg?v=1')
})
