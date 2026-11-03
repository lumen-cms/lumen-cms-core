import type { APIRoute } from 'astro'
import { publishedStoryListEndpoint } from '../../server/publishedStoryLists'
// Static output serves this route from the companion Node server. Astro dev
// can handle it directly without emitting a stale JSON artifact at build time.
export const GET: APIRoute = api => import.meta.env.DEV
 ? publishedStoryListEndpoint(api)
 : new Response(null, { status: 404 })
