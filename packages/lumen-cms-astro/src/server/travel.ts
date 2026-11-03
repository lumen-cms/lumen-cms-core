import type { APIRoute } from 'astro'
// Initialize core enrichment before consumers register optional hooks.
import './pages'
import type { SitemapHook } from 'lumen-cms-shared/server/sitemap'
import { travelResponse, travelsResponse, travelCategoriesResponse } from 'lumen-cms-shared/server/travel'
import { fetchTravel } from 'lumen-cms-shared/core/travel/utils/travel'
import { fetchTravels } from 'lumen-cms-shared/core/travel/utils/travels'
import { hasuraGraphqlSdk } from 'lumen-cms-shared/core/travel/utils/graphql-request'
import type { Travel_Bool_Exp } from 'lumen-cms-shared/core/travel/typings/generated/hasura-schema'
import { SSR_CONFIG } from 'lumen-cms-shared/core/utils/initial-props/ssrConfig'
import { getTravelListData } from 'lumen-cms-shared/core/travel/utils/getPageProps'
import { getAuslandszeitContent } from 'lumen-cms-shared/core/travel/utils/getAuslandszeitContent'

// Register before loadPage so optional blocks receive the same enriched data.
// Keep each opt-in separate: travel sites need not configure the jobs feed.
export function registerTravelServerHooks() {
 SSR_CONFIG.ssrHooks.componentData.travels_list_widget = getTravelListData
}
export function registerAuslandszeitServerHooks() {
 SSR_CONFIG.ssrHooks.componentData.auslandszeit_list_widget = getAuslandszeitContent
}
export { getTravelListData, getAuslandszeitContent }
export { loadTravelPage, travelStaticRoutes } from './travelPages'
export type { TravelPageOptions } from './travelPages'
export { CmsPageNotFoundError, notFoundResponse } from './notFound'

// Optional consumer endpoints: export these as ALL from the consumer's chosen
// Astro API paths. Core sites do not acquire travel routes automatically.
export const travelApi: APIRoute = ({ request }) => travelResponse(request, fetchTravel)
export const travelsApi: APIRoute = () => travelsResponse(fetchTravels)
export const travelCategoriesApi: APIRoute = ({ request }) => travelCategoriesResponse(request,
 filter => hasuraGraphqlSdk.allCategories({ travelFilter: filter as Travel_Bool_Exp }),
 process.env.NEXT_PUBLIC_ROOT_DIRECTORY)

export function createTravelSitemapHook(): SitemapHook {
 return async (stream, locale) => {
  const items = await fetchTravels(locale || process.env.NEXT_PUBLIC_ROOT_DIRECTORY)
  for (const travel of items) stream.write({
   url: `${process.env.TRAVELS_SLUG || 'travels'}/${travel.slug}`,
   lastmod: travel.updated_at,
   priority: 0.5,
  })
 }
}
