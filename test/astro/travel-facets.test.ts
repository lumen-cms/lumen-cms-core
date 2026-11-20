import { expect, it } from 'vitest'
import { travelFacetCounts } from '../../packages/lumen-cms-shared/src/travelFacets'
const travels = [
 { title: 'Teaching Bali', city_id: 1, city: { country_id: 10 }, mn_travel_branches: [{ branch_id: 20 }, { branch_id: 20 }], mn_travel_travel_types: [{ travel_type_id: 30 }] },
 { title: 'Medicine Berlin', city_id: 2, city: { country_id: 11 }, mn_travel_branches: [{ branch_id: 21 }], mn_travel_travel_types: [{ travel_type_id: 31 }] },
 { title: 'Teaching Berlin', city_id: 2, city: { country_id: 11 }, mn_travel_branches: [{ branch_id: 20 }], mn_travel_travel_types: [{ travel_type_id: 30 }] },
 { title: 'Other London', city_id: 3, city: { country_id: 12 }, mn_travel_branches: [{ branch_id: 22 }], mn_travel_travel_types: [{ travel_type_id: 32 }] },
] as Parameters<typeof travelFacetCounts>[0]
it('combines branches with OR and excludes unavailable destinations', () => {
 expect(Object.fromEntries(travelFacetCounts(travels, { branch: '20,21' }, 'city'))).toEqual({ 1: 1, 2: 2 })
 expect(Object.fromEntries(travelFacetCounts(travels, { branch: '20,21' }, 'country'))).toEqual({ 10: 1, 11: 2 })
})
it('ignores its own selection while respecting other taxonomies and text', () => {
 expect(Object.fromEntries(travelFacetCounts(travels, { branch: '20', country: '11' }, 'branch'))).toEqual({ 20: 1, 21: 1 })
 expect(Object.fromEntries(travelFacetCounts(travels, { branch: '20,21', country: '11', searchtext: 'Medicine' }, 'travelType'))).toEqual({ 31: 1 })
})
it('counts a program once per option and restores options after clearing', () => {
 expect(Object.fromEntries(travelFacetCounts(travels, {}, 'branch'))).toEqual({ 20: 2, 21: 1, 22: 1 })
 expect(travelFacetCounts(travels, { city: '999' }, 'branch').size).toBe(0)
})
