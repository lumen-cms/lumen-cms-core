import type { APIRoute } from 'astro'
import { enterPreview } from 'lumen-cms-shared/server/preview'

// Fail closed when the deployment has not configured its preview entry secret.
export const ALL: APIRoute = ({ url, session }) => {
 const secret = process.env.LUMEN_PREVIEW_SECRET
 if (!secret) return new Response('Preview is not configured', { status: 503, headers: { 'Cache-Control': 'private, no-store' } })
 return enterPreview(url, session, secret)
}
