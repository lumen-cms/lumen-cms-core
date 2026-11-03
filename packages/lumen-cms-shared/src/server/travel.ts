const cacheHeaders = { 'Cache-Control': 's-maxage=3600, stale-while-revalidate' }

export function travelCategoryFilter(params: URLSearchParams, rootDirectory?: string) {
 const locale = params.get('locale') || params.get('__nextLocale') || (rootDirectory === 'de' ? 'de' : 'en')
 return {
  language_key: { _eq: locale.toUpperCase() },
  slug: { _neq: '' }, published: { _eq: true }, title: { _neq: '' },
  product_id: { _gte: 1 }, preview_image_id: { _gte: 1 },
  ...(params.get('travelType') ? { mn_travel_travel_types: { travel_type_id: { _eq: Number(params.get('travelType')) } } } : {}),
  ...(params.get('branch') ? { mn_travel_branches: { branch_id: { _eq: Number(params.get('branch')) } } } : {}),
  ...(params.get('city') ? { city_id: { _eq: Number(params.get('city')) } } : {}),
  ...(params.get('country') ? { city: { country_id: { _eq: Number(params.get('country')) } } } : {}),
 }
}

export async function travelResponse(request: Request, load: (slug: string) => Promise<unknown>) {
 const travel = await load(new URL(request.url).searchParams.get('slug') || '')
 const found = Array.isArray(travel) && travel.length > 0
 return Response.json(found ? travel[0] : { error: 'not-found' }, { status: found ? 200 : 404, headers: cacheHeaders })
}

export async function travelsResponse(load: () => Promise<unknown>) {
 return Response.json(await load(), { headers: cacheHeaders })
}

export async function travelCategoriesResponse(request: Request, load: (filter: ReturnType<typeof travelCategoryFilter>) => Promise<unknown>, rootDirectory?: string) {
 const result = await load(travelCategoryFilter(new URL(request.url).searchParams, rootDirectory))
 return Response.json(result, { headers: cacheHeaders })
}
