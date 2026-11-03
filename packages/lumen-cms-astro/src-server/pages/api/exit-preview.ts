import type { APIRoute } from 'astro'
import { exitPreview } from 'lumen-cms-shared/server/preview'

export const ALL: APIRoute = ({ url, session }) => {
 const response = exitPreview(url, session)
 if (process.env.LUMEN_SITE_URL) response.headers.set('Location', new URL(response.headers.get('Location')!, process.env.LUMEN_SITE_URL).href)
 return response
}
