import { travelFilterOnCategories } from './core/travel/components/travel-list/travelFilterOnCategories'
import type { CategoryStateProp } from './core/travel/components/page/pageContextTypes'
import type { AllTravelsQuery } from './core/travel/typings/generated/hasura-schema'

export type TravelTaxonomy = 'travelType' | 'branch' | 'country' | 'city'

/** Count each program once per option, applying only the other fields' filters. */
export function travelFacetCounts(travels: AllTravelsQuery['travel'], filters: CategoryStateProp, taxonomy: TravelTaxonomy) {
 const counts = new Map<string, number>()
 for (const travel of travelFilterOnCategories(travels, { ...filters, [taxonomy]: '' })) {
  const ids = taxonomy === 'branch' ? travel.mn_travel_branches?.map(item => item.branch_id)
   : taxonomy === 'travelType' ? travel.mn_travel_travel_types?.map(item => item.travel_type_id)
   : taxonomy === 'city' ? [travel.city_id] : [travel.city?.country_id]
  for (const id of new Set(ids || [])) {
   if (id == null) continue
   const key = String(id)
   counts.set(key, (counts.get(key) || 0) + 1)
  }
 }
 return counts
}
