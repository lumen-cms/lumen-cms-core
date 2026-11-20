import type { CategoryStateProp } from 'lumen-cms-shared/core/travel/components/page/pageContextTypes'
let value: CategoryStateProp | undefined
export const getTravelState = (): CategoryStateProp => value ?? Object.fromEntries(new URL(location.href).searchParams)
export const getTravelFilters = getTravelState
export function updateTravelState(patch: CategoryStateProp) {
 value = { ...getTravelState(), ...patch }
 for (const key of Object.keys(value) as (keyof CategoryStateProp)[]) if (!value[key]) delete value[key]
 document.dispatchEvent(new CustomEvent('lumen:travel-filter', { detail: value }))
}
document.addEventListener('astro:before-swap', () => { value = undefined })
