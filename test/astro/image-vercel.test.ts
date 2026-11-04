import { expect, it } from 'vitest'
import { shouldUseVercelRemoteImage, vercelImageVariant } from '../../packages/lumen-cms-astro/src/images/vercel'
import { vercelImageConfig } from '../../packages/lumen-cms-astro/src/images/vercel-config.mjs'
const source = 'https://example.public.blob.vercel-storage.com/photo name.jpg?x=1&y=2'
it('only opts allowed still photos into managed optimization, leaving Storyblok and special transforms unchanged', () => {
 const enabled = { enabled: true, allowed: true }
 expect(shouldUseVercelRemoteImage(source, enabled)).toBe(true)
 for (const src of ['https://a.storyblok.com/f/1/100x100/photo.jpg', 'https://img2.storyblok.com/f/1/photo.jpg', '/local.jpg', 'https://example.com/animated.webp', 'https://example.com/animated.gif', 'https://example.com/logo.svg']) expect(shouldUseVercelRemoteImage(src, enabled)).toBe(false)
 for (const options of [{ enabled: false }, { allowed: false }, { format: 'png' }, { fit: 'cover' }, { position: 'top' }]) expect(shouldUseVercelRemoteImage(source, { ...enabled, ...options })).toBe(false)
})
it('emits encoded managed URLs with allowed widths and truthful width descriptors', () => {
 for (const width of [24, 150, 301, 640, 1536, 5000]) {
  const variant = vercelImageVariant(source, width, 75)
  const url = new URL(variant.src, 'https://preview.example')
  expect(url.pathname).toBe('/_vercel/image')
  expect(url.searchParams.get('url')).toBe(source)
  expect(url.searchParams.get('q')).toBe('75')
  expect(Number(url.searchParams.get('w'))).toBe(variant.width)
  expect(vercelImageConfig.sizes).toContain(variant.width)
 }
 expect(vercelImageVariant(source, 301, 75).width).toBe(360)
 expect(() => vercelImageVariant(source, NaN, 75)).toThrow()
})

it('provides the remote allowlist explicitly to the managed optimizer', () => {
 expect(vercelImageConfig.remotePatterns).toContainEqual({ protocol: 'https', hostname: '**.public.blob.vercel-storage.com' })
})
