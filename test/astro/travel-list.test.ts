import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { expect, it, vi } from 'vitest'
import { build } from 'esbuild'
import TravelList from '../../src/travel/components/travel-list/TravelListWidget'
import { getTravelListContent, type TravelListContent } from '../../packages/lumen-cms-shared/src/travelList'
const state = vi.hoisted(() => ({ locale: 'en', content: undefined as unknown }))
vi.mock('next/router', () => ({ useRouter: () => ({ locale: state.locale, query: {} }) }))
vi.mock('../../src/travel/components/page/PageContext', () => ({ usePageContext: () => ({ value: {} }) }))
vi.mock('../../src/travel/components/travel-list/helpers', () => ({ useCurrency: () => 'eur' }))
vi.mock('../../src/components/CoreComponents', () => ({ LmComponentRender: ({ content }: { content: unknown }) => { state.content = content; return null } }))
it.each(['EN', 'DE'] as const)('preserves travel cards, links, prices and options in %s', locale => {
 state.locale = locale.toLowerCase()
 const content = { _uid: 'travels', component: 'travels_list_widget', travels_list_widget_data: [{ id: 42, slug: 'bali', title: 'Trip', city: { title: 'City', title_de: 'Stadt' }, mn_travel_travel_types: [{ travel_type: { title: 'Internship', title_de: 'Praktikum' } }], product: { product_price: { eur: 1200, usd: 1500 }, duration: 4 } }, { id: 43, slug: 'missing', product: { duration_days: 5 } }] } as TravelListContent
 for (const options of [undefined, [{ _uid: 'custom', component: 'card_list' as const, column_count: '2' as const, body: [] }]]) {
  const data = { ...content, card_options: options }
  const before = JSON.stringify(data)
  const actual = getTravelListContent(data, locale)
  expect(JSON.stringify(data)).toBe(before)
  renderToStaticMarkup(createElement(TravelList, { content: { ...data, travels_list_widget_data: data.travels_list_widget_data! } }))
  expect(actual).toEqual(state.content)
  expect(JSON.stringify(getTravelListContent(data, locale, 'usd'))).toContain('1500 USD')
 }
})
it('bundles travel list content without React, Next or MUI runtime', async () => {
 const result = await build({ entryPoints: ['packages/lumen-cms-shared/src/travelList.ts'], bundle: true, write: false, metafile: true, platform: 'browser', logLevel: 'silent' })
 expect(Object.keys(result.metafile!.inputs).filter(path => /node_modules\/(?:.*\/)?(?:react|react-dom|next|@mui|@emotion)\//.test(path))).toEqual([])
})
