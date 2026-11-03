import { afterEach, expect, it, vi } from 'vitest'
import { getLinkAttrs, internalLinkHandler } from '../../packages/lumen-cms-astro/src/lib/links'
afterEach(() => vi.unstubAllEnvs())
it('uses consumer page locales over environment defaults for rendered story links', () => {
 vi.stubEnv('LUMEN_LOCALES', 'en,de')
 const page = { defaultLocale: 'de', locales: ['de', 'en', 'fr'] }
 expect(getLinkAttrs({ linktype: 'story', cached_url: 'de/home' }, {}, page).href).toBe('/')
 expect(getLinkAttrs({ linktype: 'story', cached_url: 'en/home' }, {}, page).href).toBe('/en')
 expect(internalLinkHandler('fr/contact', page)).toBe('/fr/contact')
 expect(getLinkAttrs({ linktype: 'story', cached_url: 'de/home?source=nav#top' }, {}, page).href).toBe('/?source=nav#top')
})
it('retains environment defaults without page configuration and external links unchanged', () => {
 vi.stubEnv('LUMEN_LOCALES', 'en,de')
 expect(getLinkAttrs({ linktype: 'story', cached_url: 'de/home' }).href).toBe('/de')
 expect(getLinkAttrs({ linktype: 'url', url: 'https://example.test/de/home', cached_url: 'https://example.test/de/home' }, {}, { locales: ['de'], defaultLocale: 'de' }).href).toBe('https://example.test/de/home')
})
