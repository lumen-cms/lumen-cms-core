import { createElement, Fragment, type ReactNode } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { HeadManagerContext } from 'next/dist/shared/lib/head-manager-context.shared-runtime'
import { beforeEach, expect, it, vi } from 'vitest'
import { load } from 'cheerio'
import { AppSeo } from '../../src/components/layout/AppSeo'
import AppHead from '../../src/components/layout/AppHead'
import { pageMetadata, structuredData, type SeoContext } from '../../packages/lumen-cms-shared/src/seo'

// Only replace application state and unrelated tracking; Head, next-seo, the
// image helpers and every legacy schema component remain the real implementation.
const state = vi.hoisted(() => ({ context: {} as SeoContext, config: { rootDirectory: '', overwriteDisableIndex: false } }))
vi.mock('../../src/utils/config', () => ({ CONFIG: state.config }))
vi.mock('../../src/components/provider/SettingsPageProvider', () => ({ useSettings: () => state.context.settings, usePage: () => state.context.page }))
vi.mock('../../src/components/provider/context/AppContext', () => ({ useAppContext: () => state.context }))
vi.mock('../../src/components/tracking/FbqPixel', () => ({ default: () => null }))
vi.mock('../../src/components/tracking/Gtag', () => ({ default: () => null }))
vi.mock('../../src/components/tracking/AdRoll', () => ({ default: () => null }))
vi.mock('../../src/components/tracking/GtmManager', () => ({ default: () => null }))

function legacy(context: SeoContext) {
 state.context = structuredClone(context)
 state.config.rootDirectory = context.rootDirectory || ''
 state.config.overwriteDisableIndex = !!context.disableIndex
 let head: ReactNode = null
 const body = renderToStaticMarkup(createElement(HeadManagerContext.Provider, { value: {
  mountedInstances: new Set(), updateHead: value => { head = value },
 } }, createElement(Fragment, null, createElement(AppSeo), createElement(AppHead))))
 return load(renderToStaticMarkup(createElement(Fragment, null, head)) + body)
}
function tags($: ReturnType<typeof load>) {
 return $('meta[name],meta[property]').toArray().filter(el => !['viewport'].includes($(el).attr('name') || '')).map(el => ({
  ...($(el).attr('name') ? { name: $(el).attr('name') } : { property: $(el).attr('property') }), content: $(el).attr('content'),
 })).sort((a,b) => JSON.stringify(a).localeCompare(JSON.stringify(b)))
}
function parity(context: SeoContext) {
 const $ = legacy(context)
 const actual = pageMetadata(context)
 expect(actual.title).toBe($('title').text())
 expect(actual.canonical).toBe($('link[rel=canonical]').attr('href'))
 expect(actual.meta.toSorted((a,b) => JSON.stringify(a).localeCompare(JSON.stringify(b)))).toEqual(tags($))
 const schemas = $('script[type="application/ld+json"]').toArray().map(el => JSON.parse($(el).text()))
 const stable = (value: unknown): unknown => Array.isArray(value) ? value.map(stable) : value && typeof value === 'object' ? Object.fromEntries(Object.entries(value).sort(([a],[b]) => a.localeCompare(b)).map(([key, item]) => [key, stable(item)])) : value
 const order = (values: Record<string, unknown>[]) => values.map(stable).sort((a,b) => JSON.stringify(a).localeCompare(JSON.stringify(b)))
 expect(order(JSON.parse(JSON.stringify(structuredData(context).map(item => item.data))))).toEqual(order(schemas))
}
const base = (): SeoContext => ({ settings: { seo_website_url: 'https://example.com', seo_robots: true }, page: {}, slug: '/home', locale: 'en', defaultLocale: 'en' })
beforeEach(() => { state.context = base() })
it.each([
 {}, { page: null }, { pageNotFound: true }, { disableIndex: true }, { page: { meta_robots: true } },
 { settings: { seo_robots: false } }, { page: { meta_title: 'A & B < C', meta_description: 'Description "quoted"' } },
 { settings: { seo_title: 'Site', seo_description: 'Site description', setup_google_site_verification: 'verification' } },
 { settings: { pwa_app_name: 'App', pwa_app_description: 'App description' } },
 { page: null, settings: { website_logo: '//a.storyblok.com/f/1/100x100/id/logo.png', seo_website_url: 'https://example.com' } },
])('matches actual next-seo tags and schemas: %j', change => parity({ ...base(), ...change } as SeoContext))
it.each(['https://example.com', 'https://example.com/'])('retains canonical values for %s', hostname => {
 for (const slug of ['/home','/home/','/article','/site','/site/article','/site/home']) for (const locale of ['en','de']) parity({ ...base(), settings: { seo_website_url: hostname }, slug, locale, rootDirectory: 'site' })
})
it.each(['https://a.storyblok.com/', 'http://a.storyblok.com/', '//a.storyblok.com/', ''])('matches image URLs, social fallback and dimensions: %s', prefix => {
 const image = { component: 'image_core', _uid: 'i', url: `${prefix}f/1/1600x900/abc/image.jpg`, alt: 'Alt' }
 parity({ ...base(), settings: { ...base().settings, website_logo: image.url, seo_body: [
  { component: 'seo_open_graph', _uid: 'og', title: 'Site OG', type: 'WEBSITE', app_id: 'site', images: [image, { ...image, url: `${prefix}f/1/100x100/abc/small.png` }] },
  { component: 'seo_twitter', _uid: 'tw', card_type: 'summary', handle: '@creator', site: '@site' },
 ] }, page: { seo_body: [{ component: 'seo_open_graph', _uid: 'page', title: 'Page OG', app_id: 'page', images: [] }] } } as SeoContext)
})
it.each(['Person','Organization'])('matches all JSON-LD blocks and empty optional fields: %s', type => {
 for (const empty of [false,true]) {
  const text = empty ? '' : 'Example'
  const seo_body = [
   { component: 'seo_product', product_name: 'Product', description: text, sku: text, brand: text, images: [], offers: [{ price: 0, price_currency: 'EUR', availability: 'InStock', item_condition: 'NewCondition', seller_name: text, url: text }] },
   { component: 'seo_social_profile', type, name: text, url: text, same_as: 'https://one.test, https://two.test' },
   { component: 'seo_local_business', type: 'School', id: text, name: text, address_country: text, images: [], geo_latitude: '-8', geo_longitude: '115', opening_hours: [{ opens: '09:00', closes: '17:00', day_of_week: 'Monday', valid_from: text, valid_through: text }] },
   { component: 'seo_corporate_contact', url: text, logo: text, contact_point: [{ telephone: text, contact_type: text, area_served: 'DE, ID', available_language: 'English, German' }] },
  ]
  for (const scope of ['page','settings']) parity({ ...base(), settings: { ...base().settings, website_logo: '//a.storyblok.com/f/1/100x100/id/logo.png' }, [scope]: { ...base()[scope as 'page'|'settings'], seo_body } } as SeoContext)
 }
})
it('preserves the explicit preview exception without changing other metadata', () => {
 const context = base()
 parity(context)
 const expected = pageMetadata(context)
 expected.meta.find(tag => tag.name === 'robots')!.content = 'noindex,nofollow'
 expect(pageMetadata({ ...context, preview: true })).toEqual(expected)
 expect(structuredData({ ...context, preview: true })).toEqual(structuredData(context))
})

// Opt-in integration corpus: capture current published Next HTML with
// node scripts/check-seo-parity.cjs --fetch --fetch-only first. Missing files fail.
if (process.env.SEO_SITE_PARITY === '1') {
 const { readFileSync } = await import('node:fs')
 const { default: sites } = await import('../websites/sites.json')
 for (const [site, config] of Object.entries(sites)) for (const route of config.routes) {
  it(`published ${site} ${route}: actual legacy components match shared renderer`, () => {
   const html = readFileSync(`.website-tests/seo-parity/${site}/${encodeURIComponent(route)}.html`, 'utf8')
   const props = JSON.parse(load(html)('#__NEXT_DATA__').text()).props.pageProps
   parity(props)
  })
 }
}

it.each(['f/1/1600x900/id/photo.jpg/m/800x0', 'f/1/100x100/id/icon.svg', 'f/1/1200x630/id/photo.jpg'])('matches legacy social dimensions for %s', path => {
 parity({ ...base(), page: { seo_body: [{ component: 'seo_open_graph', _uid: 'og', images: [{ component: 'image_core', _uid: 'image', url: `https://a.storyblok.com/${path}`, alt: '', width: '', height: '' }] }] } } as SeoContext)
})
