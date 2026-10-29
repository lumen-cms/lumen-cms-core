import { renderToStaticMarkup } from 'react-dom/server'
import type { ReactNode } from 'react'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
const seen = vi.hoisted(() => ({
  settings: {} as Record<string, any>,
  preview: false,
  scripts: [] as Record<string, any>[]
}))
vi.mock('../provider/SettingsPageProvider', () => ({
  useSettings: () => seen.settings
}))
vi.mock('../provider/context/AppContext', () => ({
  useAppContext: () => ({ insideStoryblok: seen.preview })
}))
vi.mock('next/head', () => ({
  default: ({ children }: { children: ReactNode }) => <>{children}</>
}))
vi.mock('next/script', () => ({
  default: (p: Record<string, any>) => {
    seen.scripts.push({ ...p })
    return <span data-script={p.id} />
  }
}))
vi.mock('next-seo', () => ({ OrganizationJsonLd: () => <span data-logo /> }))
vi.mock('../../utils/imageServices', () => ({
  imageServiceNoWebp: (url: string, size?: string) =>
    url + '/' + (size || 'original')
}))
vi.mock('../tracking/FbqPixel', () => ({
  default: ({ facebookPixelId }: { facebookPixelId: string }) => (
    <span data-tracking={'fb:' + facebookPixelId} />
  )
}))
vi.mock('../tracking/Gtag', () => ({
  default: ({ googleAnalyticsId }: { googleAnalyticsId: string }) => (
    <span data-tracking={'ga:' + googleAnalyticsId} />
  )
}))
vi.mock('../tracking/AdRoll', () => ({
  default: ({ advId, pixId }: { advId: string; pixId: string }) => (
    <span data-tracking={'ad:' + advId + ':' + pixId} />
  )
}))
vi.mock('../tracking/GtmManager', () => ({
  default: () => <span data-tracking="gtm" />
}))
vi.mock('./GoogleFontsLivePreview', () => ({
  GoogleFontsLivePreview: () => <span data-fonts />
}))
beforeEach(() => {
  seen.preview = false
  seen.settings = {}
  seen.scripts = []
  vi.stubEnv('NEXT_PUBLIC_GTM_CONTAINER', 'GTM-test')
  vi.stubEnv('NEXT_PUBLIC_DISABLE_GOOGLE_FONTS', '')
})
afterEach(() => vi.unstubAllEnvs())
async function render(env = 'production') {
  vi.stubEnv('NODE_ENV', env)
  vi.resetModules()
  const { default: Head } = await import('./AppHead')
  return renderToStaticMarkup(<Head />)
}
it.each([
  ['production', false, true],
  ['production', true, false],
  ['development', false, false]
])(
  'preserves tracking gate in %s / editor %s',
  async (env, preview, enabled) => {
    seen.preview = preview as boolean
    seen.settings = {
      setup_facebook_pixel: 'fb',
      setup_google_analytics: 'ga',
      setup_ad_roll_adv_id: 'adv',
      setup_ad_roll_pix_id: 'pixel'
    }
    const html = await render(env as string)
    expect(html.includes('data-tracking')).toBe(enabled)
    if (enabled) {
      expect(html).toContain('fb:fb')
      expect(html).toContain('ga:ga')
      expect(html).toContain('ad:adv:pixel')
      expect(html).toContain('gtm')
    }
    expect(html.includes('data-fonts')).toBe(preview)
  }
)
it('requires both AdRoll IDs, respects disabled preview fonts and absent GTM', async () => {
  vi.stubEnv('NEXT_PUBLIC_GTM_CONTAINER', '')
  seen.settings = { setup_ad_roll_adv_id: 'only-one' }
  expect(await render()).not.toContain('data-tracking')
  seen.preview = true
  vi.stubEnv('NEXT_PUBLIC_DISABLE_GOOGLE_FONTS', 'true')
  expect(await render()).not.toContain('data-fonts')
})
it('preserves PWA metadata, favicon sizes, logo and custom scripts', async () => {
  seen.settings = {
    pwa_app_name: 'App',
    pwa_app_description: 'Description',
    setup_google_site_verification: 'verify',
    setup_favicon: 'icon',
    website_logo: 'logo',
    seo_website_url: 'https://example.com',
    custom_css: '.custom { color: red; }',
    scripts: [
      {
        _uid: 'external',
        url: 'https://example.com/a.js',
        strategy: 'lazyOnload',
        attributes: 'data-test="value"'
      },
      { _uid: 'inline', id: 'custom-id', script_body: 'window.example = true;' }
    ]
  }
  const html = await render()
  expect(html).toContain('name="application-name"')
  expect(html).toContain('content="verify"')
  expect(html).toContain('/manifest.json')
  expect(html).toContain('icon/32x32')
  expect(html).toContain('icon/152x152')
  expect(html).toContain('icon/180x180')
  expect(html).toContain('data-logo')
  expect(html).toContain('.custom { color: red; }')
  expect(seen.scripts[0]).toMatchObject({
    id: 'external',
    src: 'https://example.com/a.js',
    strategy: 'lazyOnload',
    'data-test': '"value"'
  })
  expect(seen.scripts[1]).toMatchObject({
    id: 'custom-id',
    strategy: 'afterInteractive',
    dangerouslySetInnerHTML: { __html: 'window.example = true;' }
  })
  seen.settings = { pwa_app_name: 'App' }
  const partial = await render()
  expect(partial).not.toContain('/manifest.json')
  expect(partial).not.toContain('name="application-name"')
})
