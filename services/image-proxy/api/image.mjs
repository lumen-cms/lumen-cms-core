import { createHmac, timingSafeEqual } from 'node:crypto'
import sharp from 'sharp'
import { fetchImage, validateSource } from '../lib/source.mjs'

const pending = new Map()
const errorResponse = (status, message) => new Response(message, { status, headers: { 'Cache-Control': 'no-store' } })
export function parseRequest(url, secret) {
  const params = new URL(url).searchParams
  const signature = params.get('sig') || ''
  params.delete('sig')
  params.sort()
  const expected = createHmac('sha256', secret).update(params.toString()).digest('hex')
  if (!/^[a-f0-9]{64}$/.test(signature) || !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) throw new Error('Invalid signature')
  if (params.get('v') !== '1') throw new Error('Invalid version')
  validateSource(params.get('src'))
  const width = Number(params.get('w'))
  const height = params.has('h') ? Number(params.get('h')) : undefined
  const quality = Number(params.get('q'))
  const format = params.get('f')
  const fit = params.get('fit') || 'inside'
  const position = params.get('position') || 'centre'
  if (!Number.isInteger(width) || width < 1 || width > 4096 || (height !== undefined && (!Number.isInteger(height) || height < 1 || height > 4096)) || !Number.isInteger(quality) || quality < 1 || quality > 100 || !['avif','webp','jpeg','png','gif'].includes(format) || !['inside','outside','cover','contain','fill'].includes(fit) || !['centre','center','top','right','bottom','left','entropy','attention','right top','right bottom','left top','left bottom'].includes(position)) throw new Error('Invalid transform')
  return { key: params.toString(), src: params.get('src'), width, height, quality, format, fit, position }
}
export async function transformImage(input, options) {
  const metadata = await sharp(input, { limitInputPixels: 40_000_000 }).metadata()
  if (!['jpeg','png','webp','avif','heif','gif'].includes(metadata.format)) throw new Error('Unsupported source')
  // Never silently flatten animation into a still AVIF/JPEG.
  const format = metadata.pages > 1 ? (options.format === 'gif' ? 'gif' : 'webp') : options.format
  const data = await sharp(input, { animated: true, limitInputPixels: 40_000_000 })
    .rotate().resize({ width: options.width, height: options.height, fit: options.fit, position: options.position, withoutEnlargement: true })
    .toFormat(format, { quality: options.quality }).toBuffer()
  if (data.length > 4 * 1024 * 1024) throw new Error('Output too large')
  return { data, format }
}
export async function handleRequest(request, load = fetchImage) {
    if (!['GET','HEAD'].includes(request.method)) return errorResponse(405, 'Method not allowed')
    const secret = process.env.IMAGE_PROXY_SECRET
    if (!secret) return errorResponse(503, 'Image proxy is not configured')
    let options
    try { options = parseRequest(request.url, secret) } catch { return errorResponse(400, 'Invalid image request') }
    try {
      let work = pending.get(options.key)
      if (!work) {
        work = load(options.src, AbortSignal.timeout(15_000)).then(input => transformImage(input, options))
        pending.set(options.key, work)
        work.finally(() => pending.delete(options.key)).catch(() => {})
      }
      const { data, format } = await work
      return new Response(request.method === 'HEAD' ? null : new Uint8Array(data), { headers: {
        'Content-Type': `image/${format}`, 'Content-Length': String(data.length),
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Vercel-CDN-Cache-Control': 'public, max-age=31536000',
        'X-Content-Type-Options': 'nosniff',
      } })
    } catch { return errorResponse(502, 'Unable to process image') }
}
export default { fetch: request => handleRequest(request) }
