// Initialize the core component loaders before a consumer adds its own hooks.
// getPageProps registers defaults at module evaluation, so reversing that order
// would silently discard consumer component-data registrations.
import './pages'

/** Server-only enrichment, sitemap hooks and CORS configuration shared by routes. */
export { SSR_CONFIG } from 'lumen-cms-shared/core/utils/initial-props/ssrConfig'
export type { SSR_CONFIG_PROPS } from 'lumen-cms-shared/core/utils/initial-props/ssrConfig'
export { configureLinkRedirects } from '../lib/links'
