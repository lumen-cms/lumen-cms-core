import { createHmac, timingSafeEqual } from 'node:crypto'
import type { APIRoute, AstroCookies } from 'astro'
import { previewRedirect } from 'lumen-cms-shared/server/preview'

const cookieName = 'lumen_preview_auth'
const lifetime = 60 * 60 * 8
const headers = { 'Cache-Control': 'private, no-store', 'X-Robots-Tag': 'noindex, nofollow' }
const signature = (value: string, secret: string) => createHmac('sha256', secret).update(value).digest('base64url')
const equal = (a: string, b: string) => {
  const left = Buffer.from(a), right = Buffer.from(b)
  return left.length === right.length && timingSafeEqual(left, right)
}

/** Stateless, expiring preview sessions work across serverless instances. */
export function isPreviewRequest(cookies: AstroCookies, secret = process.env.LUMEN_PREVIEW_SECRET || '', now = Date.now()) {
  if (process.env.LUMEN_BUILD_MODE === 'public') return false
  if (secret.length < 32) return false
  const token = cookies.get(cookieName)?.value || ''
  const [expires, mac, extra] = token.split('.')
  return !extra && /^\d+$/.test(expires) && Number(expires) > now && Number(expires) <= now + lifetime * 1000 && !!mac && equal(mac, signature(expires, secret))
}

export const enterConsumerPreview: APIRoute = ({ url, cookies }) => {
  if (process.env.LUMEN_BUILD_MODE === 'public') return new Response('Preview is available on the preview deployment', { status: 404, headers })
  const secret = process.env.LUMEN_PREVIEW_SECRET || ''
  if (secret.length < 32 || !process.env.STORYBLOK_PREVIEW_TOKEN) return new Response('Preview is not configured', { status: 503, headers })
  if (url.searchParams.getAll('secret').length !== 1 || !equal(url.searchParams.get('secret') || '', secret)) return new Response('Invalid preview secret', { status: 401, headers })
  const expires = String(Date.now() + lifetime * 1000)
  cookies.set(cookieName, `${expires}.${signature(expires, secret)}`, {
    httpOnly: true, secure: url.protocol === 'https:', sameSite: url.protocol === 'https:' ? 'none' : 'lax', path: '/', maxAge: lifetime,
  })
  return new Response(null, { status: 307, headers: { ...headers, Location: previewRedirect(url, true) } })
}

export const exitConsumerPreview: APIRoute = ({ url, cookies }) => {
  cookies.delete(cookieName, { path: '/' })
  return new Response(null, { status: 307, headers: { ...headers, Location: previewRedirect(url, false) } })
}

export function pageOptions(slug?: string) {
  const locales = (process.env.LUMEN_LOCALES || 'en').split(',').filter(Boolean)
  const first = slug?.split('/')[0]
  return { locales, defaultLocale: locales[0], locale: first && locales.includes(first) ? first : locales[0], cmsSlug: slug || 'home' }
}
