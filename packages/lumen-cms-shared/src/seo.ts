import type { GlobalStoryblok, PageStoryblok, ImageCoreStoryblok } from 'lumen-cms-shared/core/typings/generated/components-schema'

type SeoBlock = NonNullable<GlobalStoryblok['seo_body']>[number]
export interface SeoContext {
 settings: Partial<GlobalStoryblok>
 page?: Partial<PageStoryblok> | null
 slug?: string
 locale?: string
 defaultLocale?: string
 preview?: boolean
 pageNotFound?: boolean
 rootDirectory?: string
 disableIndex?: boolean
}
export type Meta = { name?: string; property?: string; content: string }

export function seoImageUrl(image = '', option = '') {
 // Preserve the legacy imageServiceNoWebp contract, including relative CMS paths.
 const original = image.replace(/^(https?:)?\/\/a.storyblok.com\//, '')
 return `https://a.storyblok.com/${original}${image.endsWith('.svg') || !option ? '' : `/m/${option}`}`
}
function imageCore(image: ImageCoreStoryblok) {
 const size = image.width || image.height ? `${image.width || 0}x${image.height || 0}${image.width && image.height ? '/smart' : ''}` : ''
 return seoImageUrl(image.url, size)
}
function socialImage(image: ImageCoreStoryblok) {
 if (!image.url) return undefined
 // Match getOriginalImageDimensions, including already-transformed URLs.
 const dimensions = (image.url.split('/').at(-3) || '').split('x')
 const width = parseInt(dimensions[0]), height = parseInt(dimensions[1])
 const large = width > 1200 && height > 630
 return {
  url: imageCore(large ? { ...image, width: '1200', height: '630' } : image),
  width: large ? 1200 : Number(image.width || width), height: large ? 630 : Number(image.height || height), alt: image.alt,
 }
}
export function canonicalUrl(context: SeoContext) {
 const hostname = context.settings.seo_website_url
 if (!hostname) return undefined
 let path = context.slug || ''
 if (context.locale && context.locale !== context.defaultLocale) path = `/${context.locale}${path}`
 if (path.endsWith('home/')) path = path.replace('/home/', '')
 else if (path.endsWith('home')) path = path.replace('/home', '')
 if (context.rootDirectory && path.endsWith(`/${context.rootDirectory}`)) path = path.replace(`/${context.rootDirectory}`, '')
 if (context.rootDirectory && path.startsWith(`/${context.rootDirectory}/`)) path = path.replace(`/${context.rootDirectory}/`, '/')
 return hostname + path
}
/** Render data only: no Next, React, next-seo, or browser state. */
export function pageMetadata(context: SeoContext) {
 const { settings, page } = context
 const missing = context.pageNotFound || !page
 const title = missing ? 'Not Found' : page.meta_title || settings.seo_title || 'Website made by Lumen Media'
 const description = missing ? undefined : page.meta_description || settings.seo_description || 'Website made by Lumen Media'
 const noindex = !!(missing || context.preview || context.disableIndex || page?.meta_robots || !settings.seo_robots)
 const meta: Meta[] = [{ name: 'robots', content: noindex ? 'noindex,nofollow' : 'index,follow' }]
 const add = (name: string, value: unknown, property = false) => {
  if (value !== undefined && value !== null && value !== '') meta.push({ [property ? 'property' : 'name']: name, content: String(value) })
 }
 // AppHead follows AppSeo; Next Head deduplicates the PWA description last.
 add('description', settings.pwa_app_name && settings.pwa_app_description ? settings.pwa_app_description : description)
 add('google-site-verification', settings.setup_google_site_verification)
 const canonical = missing ? undefined : canonicalUrl(context)
 if (missing) add('og:title', title, true)
 if (!missing) {
  const siteOg = settings.seo_body?.find(block => block.component === 'seo_open_graph')
  const pageOg = page.seo_body?.find(block => block.component === 'seo_open_graph')
  add('og:title', pageOg?.title || title || siteOg?.title, true)
  add('og:description', pageOg?.description || description || siteOg?.description, true)
  add('og:type', (pageOg?.type || siteOg?.type)?.toLowerCase(), true)
  add('og:site_name', pageOg?.site_name || siteOg?.site_name, true)
  add('og:locale', pageOg?.locale || siteOg?.locale, true)
  add('og:url', canonical, true)
  add('fb:app_id', siteOg?.app_id || pageOg?.app_id, true)
  let images = pageOg?.images?.map(socialImage).filter(Boolean) || []
  if (!images.length) images = siteOg?.images?.map(socialImage).filter(Boolean) || []
  for (const image of images) if (image) {
   add('og:image', image.url, true); add('og:image:width', image.width || undefined, true)
   add('og:image:height', image.height || undefined, true); add('og:image:alt', image.alt, true)
  }
  const twitter = settings.seo_body?.find(block => block.component === 'seo_twitter')
  add('twitter:card', twitter?.card_type || twitter?.cardType)
  add('twitter:creator', twitter?.handle); add('twitter:site', twitter?.site)
 }
 if (settings.pwa_app_name && settings.pwa_app_description) {
  for (const [name, value] of Object.entries({ 'application-name': settings.pwa_app_name, 'apple-mobile-web-app-capable': 'yes', 'apple-mobile-web-app-status-bar-style': 'default', 'apple-mobile-web-app-title': settings.pwa_app_name, 'format-detection': 'telephone=no', 'mobile-web-app-capable': 'yes', 'theme-color': '#FFFFFF' })) add(name, value)
 }
 return { title, meta, canonical }
}

export function structuredData({ settings, page, pageNotFound }: SeoContext) {
 const result: { id: string; data: Record<string, unknown> }[] = []
 const add = (id: string, data: Record<string, unknown>) => result.push({ id, data: { '@context': 'https://schema.org', ...data } })
 const pick = <K extends SeoBlock['component']>(component: K) =>
  (page?.seo_body?.find(block => block.component === component) || settings.seo_body?.find(block => block.component === component)) as Extract<SeoBlock, { component: K }> | undefined
 if (settings.website_logo && settings.seo_website_url) add('jsonld-logo', { '@type': 'Organization', logo: seoImageUrl(settings.website_logo), url: settings.seo_website_url })
 if (!page || pageNotFound) return result
 const product = pick('seo_product')
 if (product) add('jsonld-product', {
  '@type': 'Product', name: product.product_name, brand: product.brand ? { '@type': 'Brand', name: product.brand } : undefined,
  description: product.description || undefined, image: product.images?.map(imageCore), sku: product.sku || undefined,
  offers: product.offers?.map(offer => ({ '@type': 'Offer', availability: offer.availability || undefined, itemCondition: offer.item_condition || undefined, price: String(offer.price), priceCurrency: offer.price_currency, url: offer.url, seller: { '@type': 'Organization', name: offer.seller_name } })),
 })
 const social = pick('seo_social_profile')
 if (social) add('jsonld-social', { '@type': social.type === 'Person' ? 'Person' : 'Organization', name: social.type === 'Person' ? social.name : social.name || undefined, url: social.type === 'Person' ? social.url : social.url || undefined, sameAs: social.same_as?.split(',').map(value => value.trim()) })
 const business = pick('seo_local_business')
 if (business) add('jsonld-local-business', {
  '@type': business.type, '@id': business.id || undefined, name: business.name, description: business.description || undefined, url: business.url || undefined, telephone: business.telephone || undefined,
  image: business.images?.length ? business.images.map(imageCore) : undefined,
  address: { '@type': 'PostalAddress', addressCountry: business.address_country, addressLocality: business.address_locality, addressRegion: business.address_region, postalCode: business.address_postal_code, streetAddress: business.address_street },
  geo: business.geo_longitude && business.geo_latitude ? { '@type': 'GeoCoordinates', latitude: business.geo_latitude, longitude: business.geo_longitude } : undefined,
  openingHoursSpecification: business.opening_hours?.length ? business.opening_hours.map(hours => ({ '@type': 'OpeningHoursSpecification', closes: hours.closes, dayOfWeek: hours.day_of_week, opens: hours.opens, validFrom: hours.valid_from, validThrough: hours.valid_through })) : undefined,
 })
 const contact = pick('seo_corporate_contact')
 if (contact) add('jsonld-corporate-contact', { '@type': 'Organization', url: contact.url || undefined, logo: contact.logo || undefined, contactPoint: contact.contact_point?.map(point => ({ '@type': 'ContactPoint', telephone: point.telephone, contactType: point.contact_type, areaServed: point.area_served?.split(',').map(value => value.trim()), availableLanguage: point.available_language?.split(',').map(value => value.trim()) })) })
 return result
}
/** JSON embedded in a script must not be able to terminate the element. */
export function serializeJsonLd(value: unknown) {
 return JSON.stringify(value).replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029')
}
