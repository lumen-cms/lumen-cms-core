import type { APIRoute } from 'astro'
import { formEndpoint } from 'lumen-cms-shared/server/formEndpoint'
import { SSR_CONFIG } from 'lumen-cms-shared/core/utils/initial-props/ssrConfig'

export const ALL: APIRoute = ({ request }) => formEndpoint(request, SSR_CONFIG.corsWhitelistDomains)
