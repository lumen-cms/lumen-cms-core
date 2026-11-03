import type { CategoryStateProp } from 'lumen-cms-shared/core/travel/components/page/pageContextTypes'
let value: CategoryStateProp = {}
export const getTravelState = () => value
export const getTravelFilters = () => Object.keys(value).length ? value : Object.fromEntries(new URL(location.href).searchParams)
export function updateTravelState(patch: CategoryStateProp) {
 value = { ...value, ...patch }
 for (const key of Object.keys(value) as (keyof CategoryStateProp)[]) if (!value[key]) delete value[key]
 document.dispatchEvent(new CustomEvent('lumen:travel-filter', { detail: value }))
 window.scrollTo(0, 0)
}
document.addEventListener('astro:before-swap', () => { value = {} })
