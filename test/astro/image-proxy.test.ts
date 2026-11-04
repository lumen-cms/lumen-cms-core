import { expect, it } from 'vitest'
import { imageProxyOrigin, proxyImageUrl } from '../../packages/lumen-cms-astro/src/images/proxy'
import contract from './fixtures/image-proxy-contract.json'

// Shared golden vectors are also verified by the standalone proxy's parser tests.
it.each(contract)('matches the standalone proxy signing contract: $name', ({ source, options, origin, secret, url }) => {
 expect(proxyImageUrl(source, options, origin, secret)).toBe(url)
})
it('generates stable signed URLs and binds the requested format', () => {
 const options = { width: 640, quality: 75, format: 'avif' }
 const url = proxyImageUrl('https://arbitrary.example/photo.png', options, 'https://img-proxy.vercel.app', 'test-secret')
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
