import {
  createElement,
  Fragment,
  type ReactElement,
  type ReactNode
} from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { expect, it } from 'vitest'
import NextHead from 'next/head'
import { HeadManagerContext } from 'next/dist/shared/lib/head-manager-context.shared-runtime'
import { load } from 'cheerio'

import { generateNextSeo, type NextSeoProps } from 'next-seo/pages'
import { Feed } from 'feed'
import { SitemapStream, streamToPromise } from 'sitemap'
import baseline from './__fixtures__/serverOutputs.json'
import SettingsPageProvider from '../components/provider/SettingsPageProvider'
import AppHead from '../components/layout/AppHead'
import { SeoProduct } from '../components/layout/seo/SeoProduct'
import { SeoSocialProfile } from '../components/layout/seo/SeoSocialProfile'
import { SeoLocalBusiness } from '../components/layout/seo/SeoLocalBusiness'
import { SeoCorporateContact } from '../components/layout/seo/SeoCorporateContact'

const fixture = (name: string, index = 0) =>
  baseline.seo.filter((item) => item.name === name)[index]
const jsonLd = (html: string) =>
  JSON.parse(load(html)('script[type="application/ld+json"]').html() || '')

it.each(
  baseline.seo
    .filter((item) => item.name === 'NextSeo')
    .map((item, index) => ({ ...item, index }))
)('preserves NextSeo head tags fixture $index', ({ props, html }) => {
  let head: ReactElement[] = []
  renderToStaticMarkup(
    createElement(
      HeadManagerContext.Provider,
      {
        value: {
          mountedInstances: new Set(),
          updateHead: (elements: ReactElement[]) => {
            head = elements
          }
        }
      },
      createElement(NextHead, null, generateNextSeo(props as NextSeoProps))
    )
  )
  // Next adds charset/viewport defaults; the fixture captures library tags.
  const tags = head.filter((element) => {
    const attributes = element.props as Record<string, unknown>
    return !attributes.charSet && attributes.name !== 'viewport'
  })
  expect(renderToStaticMarkup(createElement(Fragment, null, tags))).toBe(html)
})

const renderWithSettings = (
  settings: Record<string, unknown>,
  node: ReactNode
) =>
  renderToStaticMarkup(
    createElement(SettingsPageProvider, { settings: settings as any }, node)
  )

it('preserves the logo structured data', () => {
  const html = renderWithSettings(
    {
      website_logo: 'https://a.storyblok.com/f/1/logo.png',
      seo_website_url: 'https://example.com'
    },
    createElement(AppHead)
  )
  expect(jsonLd(html)).toEqual({
    ...jsonLd(fixture('LogoJsonLd').html),
    logo: 'https://a.storyblok.com/f/1/logo.png'
  })
})

it('preserves the social profile structured data', () => {
  const props = fixture('SocialProfileJsonLd').props as any
  const html = renderWithSettings(
    {
      seo_body: [
        {
          component: 'seo_social_profile',
          type: props.type,
          name: props.name,
          url: props.url,
          same_as: props.sameAs.join(', ')
        }
      ]
    },
    createElement(SeoSocialProfile)
  )
  expect(jsonLd(html)).toEqual(jsonLd(fixture('SocialProfileJsonLd').html))
})

it('preserves the corporate contact structured data', () => {
  const props = fixture('CorporateContactJsonLd').props as any
  const html = renderWithSettings(
    {
      seo_body: [
        {
          component: 'seo_corporate_contact',
          url: props.url,
          logo: props.logo,
          contact_point: props.contactPoint.map((point: any) => ({
            telephone: point.telephone,
            contact_type: point.contactType,
            area_served: point.areaServed.join(', '),
            available_language: point.availableLanguage.join(', ')
          }))
        }
      ]
    },
    createElement(SeoCorporateContact)
  )
  expect(jsonLd(html)).toEqual(jsonLd(fixture('CorporateContactJsonLd').html))
})

it('preserves the local business structured data including @id', () => {
  const props = fixture('LocalBusinessJsonLd').props as any
  const html = renderWithSettings(
    {
      seo_body: [
        {
          component: 'seo_local_business',
          id: props.id,
          type: props.type,
          name: props.name,
          description: props.description,
          url: props.url,
          telephone: props.telephone,
          images: [{ url: 'https://a.storyblok.com/f/1/image.png' }],
          geo_latitude: props.geo.latitude,
          geo_longitude: props.geo.longitude,
          opening_hours: props.openingHours.map((opening: any) => ({
            opens: opening.opens,
            closes: opening.closes,
            day_of_week: opening.dayOfWeek
          })),
          address_street: props.address.streetAddress,
          address_locality: props.address.addressLocality,
          address_region: props.address.addressRegion,
          address_postal_code: props.address.postalCode,
          address_country: props.address.addressCountry
        }
      ]
    },
    createElement(SeoLocalBusiness)
  )
  expect(jsonLd(html)).toEqual({
    ...jsonLd(fixture('LocalBusinessJsonLd').html),
    image: ['https://a.storyblok.com/f/1/image.png']
  })
})

it('preserves the product structured data', () => {
  const props = fixture('ProductJsonLd').props as any
  const html = renderWithSettings(
    {
      seo_body: [
        {
          component: 'seo_product',
          product_name: props.productName,
          brand: props.brand,
          description: props.description,
          images: [{ url: 'https://a.storyblok.com/f/1/program.jpg' }],
          sku: props.sku,
          offers: props.offers.map((offer: any) => ({
            price: offer.price,
            price_currency: offer.priceCurrency,
            availability: offer.availability,
            item_condition: offer.itemCondition,
            url: offer.url,
            seller_name: offer.seller.name
          }))
        }
      ]
    },
    createElement(SeoProduct)
  )
  expect(jsonLd(html)).toEqual({
    ...jsonLd(fixture('ProductJsonLd').html),
    image: ['https://a.storyblok.com/f/1/program.jpg']
  })
})

it('preserves RSS and JSON feed data with reviewed Feed 6 URL/GUID corrections', () => {
  const options = baseline.feed.options
  const feed = new Feed({ ...options, updated: new Date(options.updated) })
  baseline.feed.items.forEach((item) =>
    feed.addItem({ ...item, date: new Date(item.date) })
  )
  const $ = load(feed.rss2(), { xml: true })
  expect($('channel > link').text()).toBe('https://example.com/')
  expect($('item > guid').attr('isPermaLink')).toBe('false')
  // Feed 6 canonicalizes origin URLs and correctly labels non-URL GUIDs.
  // Compare everything else byte-for-byte against the pre-upgrade output.
  const compatibleRss = feed
    .rss2()
    .replace(
      '<link>https://example.com/</link>',
      '<link>https://example.com</link>'
    )
    .replace('<guid isPermaLink="false">1</guid>', '<guid>1</guid>')
  expect(compatibleRss).toBe(baseline.feed.rss)
  expect(JSON.parse(feed.json1())).toEqual(JSON.parse(baseline.feed.json))
})

it('preserves sitemap XML, locales, escaping, dates and priorities', async () => {
  const stream = new SitemapStream({ hostname: 'https://example.com' })
  const output = streamToPromise(stream)
  baseline.sitemap.items.forEach((item) => stream.write(item))
  stream.end()
  expect((await output).toString()).toBe(baseline.sitemap.xml)
})
