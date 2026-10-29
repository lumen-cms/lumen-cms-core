import { renderToStaticMarkup } from 'react-dom/server'
import type { ReactNode } from 'react'
import { beforeEach, expect, it, vi } from 'vitest'
import { AppSeo } from './AppSeo'
const seen = vi.hoisted(() => ({
  settings: {} as Record<string, any>,
  page: {} as Record<string, any> | null,
  context: {} as Record<string, any>,
  config: { rootDirectory: '', overwriteDisableIndex: false },
  seo: {} as Record<string, any>
}))
vi.mock('next/head', () => ({
  default: ({ children }: { children: ReactNode }) => <>{children}</>
}))
vi.mock('next-seo/pages', () => ({
  generateNextSeo: (seo: Record<string, any>) => {
    seen.seo = seo
    return <title>{seo.title}</title>
  }
}))
vi.mock('../../utils/config', () => ({ CONFIG: seen.config }))
vi.mock('../provider/SettingsPageProvider', () => ({
  useSettings: () => seen.settings,
  usePage: () => seen.page
}))
vi.mock('../provider/context/AppContext', () => ({
  useAppContext: () => seen.context
}))
vi.mock('../../utils/mapOpenGraphImage', () => ({
  mapOpenGraphImage: (item: { url?: string }) =>
    item.url ? { url: item.url } : undefined
}))
vi.mock('./seo/SeoProduct', () => ({ SeoProduct: () => <span>Product</span> }))
vi.mock('./seo/SeoSocialProfile', () => ({
  SeoSocialProfile: () => <span>Social</span>
}))
vi.mock('./seo/SeoLocalBusiness', () => ({
  SeoLocalBusiness: () => <span>Local</span>
}))
vi.mock('./seo/SeoCorporateContact', () => ({
  SeoCorporateContact: () => <span>Contact</span>
}))
beforeEach(() => {
  seen.settings = { seo_website_url: 'https://example.com', seo_robots: true }
  seen.page = {}
  seen.context = { slug: '/home', locale: 'en', defaultLocale: 'en' }
  seen.config.rootDirectory = ''
  seen.config.overwriteDisableIndex = false
})
it.each([true, false])(
  'keeps not-found metadata and omits structured data (flag: %s)',
  (flag) => {
    if (flag) seen.context.pageNotFound = true
    else seen.page = null
    const html = renderToStaticMarkup(<AppSeo />)
    expect(seen.seo).toEqual({
      title: 'Not Found',
      noindex: true,
      nofollow: true
    })
    expect(html).not.toContain('Product')
  }
)
it('preserves defaults, page overrides, robots policy and structured-data order', () => {
  let html = renderToStaticMarkup(<AppSeo />)
  expect(seen.seo).toMatchObject({
    title: 'Website made by Lumen Media',
    description: 'Website made by Lumen Media',
    noindex: false,
    nofollow: false,
    canonical: 'https://example.com'
  })
  expect(html.indexOf('Product')).toBeLessThan(html.indexOf('Social'))
  expect(html.indexOf('Social')).toBeLessThan(html.indexOf('Local'))
  expect(html.indexOf('Local')).toBeLessThan(html.indexOf('Contact'))
  seen.settings.seo_title = 'Site'
  seen.settings.seo_description = 'Site description'
  seen.page = {
    meta_title: 'Page',
    meta_description: 'Page description',
    meta_robots: true
  }
  renderToStaticMarkup(<AppSeo />)
  expect(seen.seo).toMatchObject({
    title: 'Page',
    description: 'Page description',
    noindex: true,
    nofollow: true
  })
  seen.page = {}
  seen.config.overwriteDisableIndex = true
  renderToStaticMarkup(<AppSeo />)
  expect(seen.seo.title).toBe('Site')
  expect(seen.seo.noindex).toBe(true)
  seen.config.overwriteDisableIndex = false
  seen.settings.seo_robots = false
  renderToStaticMarkup(<AppSeo />)
  expect(seen.seo.noindex).toBe(true)
})
it('preserves social precedence, image fallback, settings Facebook id and Twitter normalization', () => {
  seen.settings.seo_body = [
    {
      component: 'seo_open_graph',
      title: 'Site OG',
      type: 'website',
      site_name: 'Site',
      app_id: 'settings-id',
      images: [{ url: 'site.jpg' }]
    },
    { component: 'seo_twitter', card_type: 'summary', handle: '@site' }
  ]
  seen.page = {
    meta_title: 'Page',
    seo_body: [
      {
        component: 'seo_open_graph',
        title: 'Page OG',
        app_id: 'page-id',
        images: [{ url: 'page.jpg' }]
      }
    ]
  }
  renderToStaticMarkup(<AppSeo />)
  expect(seen.seo.openGraph).toMatchObject({
    title: 'Page OG',
    type: 'website',
    site_name: 'Site',
    images: [{ url: 'page.jpg' }],
    url: 'https://example.com'
  })
  expect(seen.seo.facebook).toEqual({ appId: 'settings-id' })
  expect(seen.seo.twitter.cardType).toBe('summary')
  expect(seen.seo.twitter.card_type).toBeUndefined()
  seen.page.seo_body[0].images = [{}]
  renderToStaticMarkup(<AppSeo />)
  expect(seen.seo.openGraph.images).toEqual([{ url: 'site.jpg' }])
})
it.each([
  ['/home/', 'en', '', 'https://example.com'],
  ['/article', 'de', '', 'https://example.com/de/article'],
  ['/site/article', 'en', 'site', 'https://example.com/article'],
  ['/site', 'en', 'site', 'https://example.com']
])(
  'preserves canonical normalization for %s',
  (slug, locale, root, expected) => {
    seen.context = { slug, locale, defaultLocale: 'en' }
    seen.config.rootDirectory = root
    renderToStaticMarkup(<AppSeo />)
    expect(seen.seo.canonical).toBe(expected)
    expect(seen.seo.openGraph.url).toBe(expected)
  }
)
