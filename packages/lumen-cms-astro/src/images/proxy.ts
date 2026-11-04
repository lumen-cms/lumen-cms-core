import { createHmac } from 'node:crypto'

export const imageProxyOrigin = 'https://img-prxy.lumen.media'

/** Server-only signing: the secret must never use a PUBLIC_ environment name. */
export function proxyImageUrl(source: string, options: { width: number; height?: number; quality: number; format: string; fit?: string; position?: string }, origin = process.env.PUBLIC_IMAGE_PROXY_URL || imageProxyOrigin, secret = process.env.IMAGE_PROXY_SECRET) {
 if (!secret) throw new Error('IMAGE_PROXY_SECRET is required for the shared image proxy')
 const url = new URL('/api/image', origin)
 const scale = Math.min(1, 4096 / options.width, options.height ? 4096 / options.height : 1)
 const params = new URLSearchParams({ v: '1', src: source, w: String(Math.max(1, Math.round(options.width * scale))), q: String(options.quality), f: options.format })
 if (options.height) params.set('h', String(Math.max(1, Math.round(options.height * scale))))
 if (options.fit) params.set('fit', options.fit)
 if (options.position) params.set('position', options.position)
 params.sort()
 params.set('sig', createHmac('sha256', secret).update(params.toString()).digest('hex'))
 url.search = params.toString()
 return url.toString()
}
