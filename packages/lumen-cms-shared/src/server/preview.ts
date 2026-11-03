export const previewSessionKey = 'lumenCmsPreview'

/** Keep redirects on this server, including backslash and encoded-slash inputs. */
export function previewRedirect(url: URL, includeQuery: boolean) {
 const slug = url.searchParams.get('slug') || ''
 let path = `/${slug.replaceAll('\\', '/').replace(/^\/+/, '')}`
 if (new URL(path, url).origin !== url.origin) path = '/'
 const params = new URLSearchParams()
 if (includeQuery) for (const key of new Set(url.searchParams.keys())) {
  if (key !== 'secret' && key !== 'slug') params.append(key, url.searchParams.getAll(key).join(','))
 }
 return `${path}${includeQuery ? `?${params}` : ''}`
}

export interface PreviewSession {
 set(key: string, value: unknown): void
 delete(key: string): void
 regenerate(): Promise<void>
}
export async function enterPreview(url: URL, session: PreviewSession | undefined, secret: string) {
 if (!secret || url.searchParams.getAll('secret').length !== 1 || url.searchParams.get('secret') !== secret) return Response.json({ message: 'Invalid token/slug' }, { status: 401, headers: { 'Cache-Control': 'private, no-store' } })
 if (!session) return new Response('Preview sessions are unavailable', { status: 503 })
 await session.regenerate()
 session.set(previewSessionKey, true)
 return new Response(null, { status: 307, headers: { Location: previewRedirect(url, true), 'Cache-Control': 'private, no-store' } })
}
export function exitPreview(url: URL, session?: PreviewSession) {
 session?.delete(previewSessionKey)
 return new Response(null, { status: 307, headers: { Location: previewRedirect(url, false), 'Cache-Control': 'private, no-store' } })
}
