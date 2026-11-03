import { expect, it } from 'vitest'
import { canonicalUrl, pageMetadata, structuredData, serializeJsonLd, type SeoContext } from '../../packages/lumen-cms-shared/src/seo'
const base = (): SeoContext => ({ settings: { seo_robots: true, seo_website_url: 'https://example.com' }, page: {}, slug: '/home', locale: 'en', defaultLocale: 'en' })
const value = (context: SeoContext, key: string) => pageMetadata(context).meta.find(meta => meta.name === key || meta.property === key)?.content
it('preserves page overrides and the existing fallback text', () => {
 const context = base()
 expect(pageMetadata(context).title).toBe('Website made by Lumen Media')
 context.settings.seo_title = 'Site'; context.settings.seo_description = 'Site description'
 expect(pageMetadata(context).title).toBe('Site')
 context.page = { meta_title: 'Page', meta_description: 'Page description' }
 expect(pageMetadata(context).title).toBe('Page')
 expect(value(context, 'description')).toBe('Page description')
})
it('keeps all indexing switches and prevents indexing preview and missing pages', () => {
 expect(value(base(), 'robots')).toBe('index,follow')
 for (const change of [{ preview: true }, { disableIndex: true }, { page: { meta_robots: true } }, { settings: { seo_robots: false } }, { page: null }, { pageNotFound: true }]) {
  expect(value({ ...base(), ...change }, 'robots')).toBe('noindex,nofollow')
 }
 const missing = { ...base(), page: null }
 expect(pageMetadata(missing).title).toBe('Not Found')
 expect(pageMetadata(missing).canonical).toBeUndefined()
 expect(structuredData(missing)).toEqual([])
})
it.each([
 ['/home/', 'en', '', 'https://example.com'],
 ['/article', 'de', '', 'https://example.com/de/article'],
 ['/site/article', 'en', 'site', 'https://example.com/article'],
 ['/site', 'en', 'site', 'https://example.com'],
 ['/home', 'de', '', 'https://example.com/de'],
])('normalizes the legacy canonical route %s (%s)', (slug, locale, rootDirectory, expected) => {
 expect(canonicalUrl({ ...base(), slug, locale, rootDirectory })).toBe(expected)
})
it('preserves social overrides, image fallback and Facebook precedence without mutating CMS data', () => {
 const context = base()
 context.settings.seo_body = [
  { component: 'seo_open_graph', _uid: 'site-og', title: 'Site OG', type: 'website', app_id: 'site-id', images: [{ component: 'image_core', _uid: 'image', url: '//a.storyblok.com/f/1/1600x900/abc/site.jpg', alt: 'Site image' }] },
  { component: 'seo_twitter', _uid: 'twitter', card_type: 'summary', handle: '@site', site: '@site' },
 ] as SeoContext['settings']['seo_body']
 context.page = { meta_title: 'Page', seo_body: [{ component: 'seo_open_graph', _uid: 'page-og', title: 'Page OG', app_id: 'page-id', images: [] }] }
 const original = JSON.stringify(context)
 expect(value(context, 'og:title')).toBe('Page OG')
 expect(value(context, 'og:type')).toBe('website')
 expect(value(context, 'fb:app_id')).toBe('site-id')
 expect(value(context, 'og:image')).toBe('https://a.storyblok.com/f/1/1600x900/abc/site.jpg/m/1200x630/smart')
 expect(value(context, 'og:image:width')).toBe('1200')
 expect(value(context, 'twitter:card')).toBe('summary')
 expect(JSON.stringify(context)).toBe(original)
})
it('maps all four structured-data blocks and uses page blocks before site blocks', () => {
 const context = {
  ...base(), settings: { ...base().settings, website_logo: '//a.storyblok.com/f/1/100x100/id/logo.png', seo_body: [{ component: 'seo_social_profile', name: 'Site', same_as: '' }] },
  page: { seo_body: [
   { component: 'seo_product', product_name: 'Course', brand: 'School', offers: [{ price: 40, price_currency: 'EUR', availability: 'InStock', seller_name: 'School' }] },
   { component: 'seo_social_profile', type: 'Person', name: 'Teacher', same_as: 'https://one.test, https://two.test' },
   { component: 'seo_local_business', type: 'School', id: 'school-id', name: 'School', address_country: 'ID', geo_latitude: '-8', geo_longitude: '115', opening_hours: [{ day_of_week: 'Monday', opens: '09:00', closes: '17:00' }] },
   { component: 'seo_corporate_contact', url: 'https://example.com', contact_point: [{ telephone: '+123', contact_type: 'Support', area_served: 'DE, ID', available_language: 'English, German' }] },
  ] },
 } as unknown as SeoContext
 const data = Object.fromEntries(structuredData(context).map(schema => [schema.id, schema.data]))
 expect(Object.keys(data)).toHaveLength(5)
 expect(data['jsonld-product']).toMatchObject({ '@type': 'Product', brand: { '@type': 'Brand', name: 'School' }, offers: [{ '@type': 'Offer', price: '40', priceCurrency: 'EUR' }] })
 expect(data['jsonld-social']).toMatchObject({ '@type': 'Person', name: 'Teacher', sameAs: ['https://one.test', 'https://two.test'] })
 expect(data['jsonld-local-business']).toMatchObject({ '@id': 'school-id', address: { '@type': 'PostalAddress', addressCountry: 'ID' }, geo: { '@type': 'GeoCoordinates' }, openingHoursSpecification: [{ '@type': 'OpeningHoursSpecification', dayOfWeek: 'Monday' }] })
 expect(data['jsonld-corporate-contact']).toMatchObject({ contactPoint: [{ '@type': 'ContactPoint', areaServed: ['DE', 'ID'], availableLanguage: ['English', 'German'] }] })
})
it('escapes script terminators while preserving the JSON-LD value', () => {
 const payload = { name: '</script><script>alert(1)</script>\u2028' }
 const serialized = serializeJsonLd(payload)
 expect(serialized).not.toContain('<')
 expect(JSON.parse(serialized)).toEqual(payload)
})
