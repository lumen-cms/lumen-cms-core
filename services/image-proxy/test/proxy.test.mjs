import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createHmac } from 'node:crypto'
import sharp from 'sharp'
import { handleRequest, parseRequest, transformImage } from '../api/image.mjs'
import { isPublicAddress, validateSource, fetchImage } from '../lib/source.mjs'

const secret = 'test-only-secret'
function signed(overrides = {}) {
 const p = new URLSearchParams({ v: '1', src: 'https://example.com/a.png', w: '32', q: '75', f: 'webp', ...overrides })
 p.sort()
 p.set('sig', createHmac('sha256', secret).update(p.toString()).digest('hex'))
 return `https://proxy.example/api/image?${p}`
}
test('signature binds source and every transform option', () => {
 assert.equal(parseRequest(signed(), secret).width, 32)
 assert.throws(() => parseRequest(signed().replace('w=32', 'w=64'), secret))
 assert.throws(() => parseRequest(signed(), 'different-secret'))
 for (const options of [{ w: '4097' }, { f: 'svg' }, { h: '-1' }, { q: 'NaN' }, { v: '2' }]) assert.throws(() => parseRequest(signed(options), secret))
})
test('private IPv4/IPv6, mapped addresses, metadata and credentialed URLs are blocked', async () => {
 for (const ip of ['127.0.0.1','10.0.0.1','169.254.169.254','100.64.0.1','192.168.1.1','::1','::ffff:127.0.0.1','fc00::1','2002:7f00:1::']) assert.equal(isPublicAddress(ip), false, ip)
 for (const ip of ['8.8.8.8','2606:4700:4700::1111']) assert.equal(isPublicAddress(ip), true, ip)
 for (const url of ['file:///etc/passwd','https://user:pass@example.com/a','http://example.com:8080/a']) assert.throws(() => validateSource(url))
 await assert.rejects(fetchImage('http://127.0.0.1/a', AbortSignal.timeout(100)))
})
test('real Sharp transforms produce requested formats and dimensions; SVG is rejected', async () => {
 const input = await sharp({ create: { width: 64, height: 32, channels: 4, background: '#ff000080' } }).png().toBuffer()
 for (const format of ['avif','webp','png']) {
  const output = await transformImage(input, { width: 32, quality: 75, format, fit: 'inside', position: 'centre' })
  const metadata = await sharp(output.data).metadata()
  assert.equal(metadata.width, 32)
  assert.equal(metadata.height, 16)
  assert.equal(metadata.hasAlpha, true)
 }
 await assert.rejects(transformImage(Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"></svg>'), { width: 32, format: 'png' }))
})
test('successful variants cache for a year; failures do not; concurrent misses coalesce', async () => {
 process.env.IMAGE_PROXY_SECRET = secret
 const input = await sharp({ create: { width: 64, height: 32, channels: 3, background: 'red' } }).png().toBuffer()
 let calls = 0
 const load = async () => { calls++; await new Promise(resolve => setTimeout(resolve, 10)); return input }
 const responses = await Promise.all([handleRequest(new Request(signed()), load), handleRequest(new Request(signed()), load)])
 assert.equal(calls, 1)
 for (const response of responses) {
  assert.equal(response.status, 200)
  assert.equal(response.headers.get('Cache-Control'), 'public, max-age=31536000, immutable')
  assert.equal(response.headers.get('Vercel-CDN-Cache-Control'), 'public, max-age=31536000')
  assert.equal(response.headers.get('Content-Type'), 'image/webp')
 }
 const failed = await handleRequest(new Request(signed()), async () => { throw new Error('Unavailable') })
 assert.equal(failed.status, 502)
 assert.equal(failed.headers.get('Cache-Control'), 'no-store')
 const invalid = await handleRequest(new Request(signed().replace('w=32', 'w=33')), load)
 assert.equal(invalid.status, 400)
})
