import { expect, it, vi } from 'vitest'
import { sitemapResponse, type SitemapDependencies } from '../../packages/lumen-cms-shared/src/server/sitemap'
const story = (full_slug: string, slug = full_slug) => ({ full_slug, slug, published_at: '2026-11-02T00:00:00Z' })
const dependencies = (overrides: Partial<SitemapDependencies> = {}): SitemapDependencies => ({ loadStories: vi.fn(async () => []), internalLink: value => value.startsWith('/') ? value : `/${value}`, environment: {}, hooks: [], ...overrides })
const request = new Request('https://fixture.test/api/sitemap')
it('preserves exclusions, home priority, deduplication, XML escaping and cache headers', async () => {
 const response = await sitemapResponse(request, dependencies({
  loadStories: async () => [story('home', 'home'), story('course?a=1&b=2'), story('course?a=1&b=2'), story('en/demo-content/example'), story('en/private/example')],
  environment: { SITEMAP_IGNORE_PATH: 'private' },
 }))
 expect(response.status).toBe(200)
 expect(response.headers.get('Cache-Control')).toBe('s-maxage=600, stale-while-revalidate')
 expect(response.headers.get('Content-Type')).toBe('text/xml')
 const xml = await response.text()
 expect(xml).toContain('<loc>https://fixture.test/</loc>')
 expect(xml).toContain('<priority>1.0</priority>')
 expect(xml).toContain('course?a=1&amp;b=2')
 expect(xml.match(/<url>/g)).toHaveLength(2)
 expect(xml).not.toContain('demo-content'); expect(xml).not.toContain('private')
})
it('retains distinct fetch locale, mapped hook locale and hostname override', async () => {
 const loadStories = vi.fn(async () => [story('de/course')])
 const hook = vi.fn(async (stream, locale) => { stream.write({ url: `/extra-${locale}` }) })
 const response = await sitemapResponse(request, dependencies({ loadStories, hooks: [hook], environment: { SITEMAP_LOCALE: 'de', SITEMAP_HOSTNAME: 'canonical.test', LOCALE_DOMAIN_MAP: JSON.stringify([{ domain: 'fixture.test', locale: 'fr' }]), NEXT_PUBLIC_FIELD_LEVEL_TRANSLATION: 'true' } }))
 expect(loadStories).toHaveBeenCalledWith({ language: 'de' })
 expect(hook.mock.calls[0][1]).toBe('fr')
 const xml = await response.text()
 expect(xml).toContain('https://canonical.test/course')
 expect(xml).toContain('https://canonical.test/extra-fr')
})
it('returns 500 for failed delivery, malformed mapping and failed consumer hooks', async () => {
 for (const config of [
  { loadStories: async () => { throw new Error('Delivery failure') } },
  { environment: { LOCALE_DOMAIN_MAP: '{' } },
  { hooks: [async () => { throw new Error('Hook failure') }] },
 ]) {
  const onError = vi.fn()
  const response = await sitemapResponse(request, dependencies({ ...config, onError }))
  expect(response.status).toBe(500)
  expect(await response.text()).toBe('')
  expect(onError).toHaveBeenCalledTimes(1)
 }
})

it('always excludes error stories at root, locale and configured folder paths', async () => {
 const response = await sitemapResponse(request, dependencies({
  loadStories: async () => ['error-404', 'de/error-404', 'site/error-404', 'de/site/error-404', 'error-404-guide'].map(value => story(value)),
 }))
 const xml = await response.text()
 expect(xml.match(/<url>/g)).toHaveLength(1)
 expect(xml).toContain('/error-404-guide</loc>')
})
