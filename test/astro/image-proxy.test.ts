import { expect, it } from 'vitest'
import { imageProxyOrigin, proxyImageUrl } from '../../packages/lumen-cms-astro/src/images/proxy'
import { parseRequest } from '../../services/image-proxy/api/image.mjs'
it('generates stable signed URLs accepted by the standalone proxy', () => {
 const options = { width: 640, quality: 75, format: 'avif' }
 const url = proxyImageUrl('https://arbitrary.example/photo.png', options, 'https://img-proxy.vercel.app', 'test-secret')
 expect(parseRequest(url, 'test-secret')).toMatchObject({ width: 640, format: 'avif', src: 'https://arbitrary.example/photo.png' })
 expect(proxyImageUrl('https://arbitrary.example/photo.png', options, 'https://img-proxy.vercel.app', 'test-secret')).toBe(url)
 expect(proxyImageUrl('https://arbitrary.example/photo.png', { ...options, format: 'webp' }, 'https://img-proxy.vercel.app', 'test-secret')).not.toBe(url)
})
it('defaults to the fixed shared domain and requires server-only credentials', () => {
 const options = { width: 640, quality: 75, format: 'webp' }
 const url = proxyImageUrl('https://example.com/photo.jpg', options, undefined, 'test-secret')
 expect(new URL(url).origin).toBe(imageProxyOrigin)
 expect(imageProxyOrigin).toBe('https://img-prxy.lumen.media')
 expect(() => proxyImageUrl('https://example.com/photo.jpg', options, undefined, '')).toThrow('IMAGE_PROXY_SECRET')
})
