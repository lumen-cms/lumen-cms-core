import { expect, it } from 'vitest'
import { createStaticRoutes } from '../../packages/lumen-cms-shared/src/server/routes'

it('generates Astro catch-all paths for published pages and locale homes', () => {
  const routes = createStaticRoutes([
    { full_slug: 'home' }, { full_slug: 'de/home' },
    { full_slug: 'pricing' }, { full_slug: 'de/preise' }
  ], { defaultLocale: 'en', locales: ['en', 'de', 'it'] })
  expect(routes.map(route => route.params.slug)).toEqual([undefined, 'de', 'pricing', 'de/preise', 'it'])
  expect(routes[3].props).toEqual({ locale: 'de', defaultLocale: 'en', locales: ['en', 'de', 'it'], cmsSlug: 'de/preise' })
})

it('removes the CMS root without losing the locale or original lookup path', () => {
  const routes = createStaticRoutes([{ full_slug: 'de/website/contact' }], {
    defaultLocale: 'en', locales: ['en', 'de'], rootDirectory: 'website'
  })
  expect(routes[0].params.slug).toBe('de/contact')
  expect(routes[0].props.cmsSlug).toBe('de/website/contact')
})

it('fails a build instead of silently replacing colliding locale routes', () => {
  expect(() => createStaticRoutes([{ full_slug: 'contact' }, { full_slug: 'de/contact' }], {
    defaultLocale: 'en', locales: ['en', 'de'], suppressSlugLocale: true, languages: ['de']
  })).toThrow('Multiple CMS stories')
})
