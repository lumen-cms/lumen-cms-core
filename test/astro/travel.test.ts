import { expect, it, vi } from 'vitest'
import { build } from 'esbuild'
import { travelResponse, travelsResponse, travelCategoriesResponse, travelCategoryFilter } from '../../packages/lumen-cms-shared/src/server/travel'
vi.mock('../../packages/lumen-cms-shared/src/core/travel/utils/travels', () => ({ fetchTravels: vi.fn(async () => [{ slug: 'trip', updated_at: '2026-10-01' }]) }))
import { createTravelSitemapHook } from '../../packages/lumen-cms-astro/src/server/travel'
import { fetchTravels } from '../../packages/lumen-cms-shared/src/core/travel/utils/travels'
import { sitemapResponse } from '../../packages/lumen-cms-shared/src/server/sitemap'

it('preserves detail/list JSON, not-found status and cache headers', async () => {
 const load = vi.fn(async () => [{ id: 42, slug: 'trip' }])
 const detail = await travelResponse(new Request('https://fixture.test/api/travel?slug=trip'), load)
 expect(load).toHaveBeenCalledWith('trip')
 expect(detail.status).toBe(200)
 expect(await detail.json()).toEqual({ id: 42, slug: 'trip' })
 expect(detail.headers.get('cache-control')).toBe('s-maxage=3600, stale-while-revalidate')
 const missing = await travelResponse(new Request('https://fixture.test/api/travel?slug=missing'), async () => [])
 expect(missing.status).toBe(404)
 expect(await missing.json()).toEqual({ error: 'not-found' })
 const list = await travelsResponse(load)
 expect(await list.json()).toEqual([{ id: 42, slug: 'trip' }])
 const failure = new Error('Backend unavailable')
 await expect(travelsResponse(async () => { throw failure })).rejects.toBe(failure)
})

it('preserves category locale precedence and all numeric filters', async () => {
 const filter = travelCategoryFilter(new URLSearchParams('locale=it&__nextLocale=de&travelType=1&branch=2&city=3&country=4&searchtext=ignored'), 'de')
 expect(filter).toEqual({ language_key: { _eq: 'IT' }, slug: { _neq: '' }, published: { _eq: true }, title: { _neq: '' }, product_id: { _gte: 1 }, preview_image_id: { _gte: 1 }, mn_travel_travel_types: { travel_type_id: { _eq: 1 } }, mn_travel_branches: { branch_id: { _eq: 2 } }, city_id: { _eq: 3 }, city: { country_id: { _eq: 4 } } })
 expect(travelCategoryFilter(new URLSearchParams('__nextLocale=es'), 'de').language_key._eq).toBe('ES')
 expect(travelCategoryFilter(new URLSearchParams(), 'de').language_key._eq).toBe('DE')
 expect(travelCategoryFilter(new URLSearchParams()).language_key._eq).toBe('EN')
 const load = vi.fn(async (_filter: ReturnType<typeof travelCategoryFilter>) => ({ category: [{ id: 7 }] }))
 const response = await travelCategoriesResponse(new Request('https://fixture.test/api/categories?city=3'), load)
 expect(load.mock.calls[0][0]).toMatchObject({ city_id: { _eq: 3 } })
 expect(await response.json()).toEqual({ category: [{ id: 7 }] })
})

it('adds travel URLs through the existing sitemap hook contract', async () => {
 vi.stubEnv('TRAVELS_SLUG', 'journeys')
 const response = await sitemapResponse(new Request('https://fixture.test/api/sitemap'), { loadStories: async () => [], internalLink: value => value, environment: { SITEMAP_LOCALE: 'de' }, hooks: [createTravelSitemapHook()] })
 expect(fetchTravels).toHaveBeenCalledWith('de')
 expect(await response.text()).toContain('https://fixture.test/journeys/trip')
})

it('bundles optional travel handlers without Next, React or MUI', async () => {
 const result = await build({ entryPoints: ['packages/lumen-cms-astro/src/server/travel.ts'], platform: 'node', format: 'esm', bundle: true, write: false, metafile: true })
 expect(Object.keys(result.metafile.inputs).filter(path => /node_modules.*(?:\/react(?:-dom)?\/|\/next\/|\/@mui\/)/.test(path))).toEqual([])
})

it('enriches optional native travel and jobs blocks through separate server hooks', async () => {
 const { registerTravelServerHooks, registerAuslandszeitServerHooks } = await import('../../packages/lumen-cms-astro/src/server/travel')
 const { SSR_CONFIG } = await import('../../packages/lumen-cms-shared/src/core/utils/initial-props/ssrConfig')
 const { fetchComponentData } = await import('../../packages/lumen-cms-shared/src/core/utils/initial-props/component-data/traversePageContent')
 const previous = { ...SSR_CONFIG.ssrHooks.componentData }
 const request = vi.fn(async () => new Response(JSON.stringify({ jobs: [{ id: 7, title: 'Job' }] }), { status: 200 }))
 vi.stubGlobal('fetch', request)
 vi.stubEnv('AUSLANDSZEIT_API_KEY', 'fixture-secret')
 try {
  registerTravelServerHooks()
  expect(SSR_CONFIG.ssrHooks.componentData.auslandszeit_list_widget).toBe(previous.auslandszeit_list_widget)
  registerAuslandszeitServerHooks()
  registerTravelServerHooks()
  const props = { locale: 'de', page: { body: [{ component: 'travels_list_widget', _uid: 'trip-list', max_number: 1 }, { component: 'auslandszeit_list_widget', _uid: 'jobs', query_filter: '?country=de' }] } } as unknown as Parameters<typeof fetchComponentData>[0]
  await fetchComponentData(props)
  expect(props.page.body?.[0]).toMatchObject({ travels_list_widget_data: [{ slug: 'trip' }] })
  expect(props.page.body?.[1]).toMatchObject({ auslandszeit_list_widget_data: { jobs: [{ id: 7 }] } })
  expect(request).toHaveBeenCalledWith('https://www.auslandsjob.de/wp-json/ajo-job-finder/v1/feed/studentsgoabroad?country=de', { headers: { 'Content-Type': 'application/json', 'x-api-key': 'fixture-secret' } })
 } finally {
  SSR_CONFIG.ssrHooks.componentData = previous
  vi.unstubAllGlobals(); vi.unstubAllEnvs()
 }
})
