import type { APIRoute } from 'astro'
import { enterPreview } from 'lumen-cms-shared/server/preview'

// Retain the existing CMS entry-link secret unless the deployment overrides it.
export const ALL: APIRoute = ({ url, session }) => enterPreview(url, session, process.env.LUMEN_PREVIEW_SECRET || 'lm-qrxswkwkwkw')
