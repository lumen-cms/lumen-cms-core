import { afterEach, expect, it, vi } from 'vitest'
import { getLinkAttrs, internalLinkHandler, isValidLink, type LinkConfig, type LinkType } from '../../packages/lumen-cms-shared/src/links'
import { getLinkAttrs as legacyLink, isValidLink as legacyValid } from '../../src/utils/linkHandler'
import { internalLinkHandler as legacyInternal } from '../../src/utils/internalLinkHandler'
import { CONFIG } from '../../src/utils/config'
import { getLinkAttrs as astroLink } from '../../packages/lumen-cms-astro/src/lib/links'
import { build } from 'esbuild'
afterEach(() => vi.unstubAllEnvs())

it('preserves legacy link contracts under each routing configuration', () => {
 const links: LinkType[] = [{}, { linktype: 'story', cached_url: 'site/en/home', anchor: 'details' }, { linktype: 'story', cached_url: 'en/about' }, { linktype: 'url', cached_url: '#section' }, { linktype: 'url', cached_url: 'https://example.org/path', url: 'https://example.org/other' }, { linktype: 'email', email: 'hello@example.org' }, { linktype: 'asset', cached_url: 'https://a.storyblok.com/f/123/file.pdf' }, { linktype: 'url', cached_url: '+4912345' }, { linktype: 'story', prep: true, cached_url: 'home' }, { linktype: 'story', cached_url: 'en/home', story: { name: 'Home', id: 1, uuid: 'home', slug: 'home', full_slug: 'de/start', url: 'en/home' } }]
 const configs: LinkConfig[] = [{}, { rootDirectory: 'site' }, { suppressSlugLocale: true, languages: ['en', 'de'] }, { fieldLevelTranslation: true }]
 const original = { ...CONFIG }
 try {
  for (const config of configs) {
   Object.assign(CONFIG, { rootDirectory: undefined, suppressSlugLocale: false, languages: [], fieldLevelTranslation: false }, config)
   for (const link of links) {
    for (const openExternal of [false, true]) expect(getLinkAttrs(link, { openExternal }, config)).toEqual(legacyLink(link, { openExternal }))
    expect(isValidLink(link)).toEqual(legacyValid(link))
   }
   for (const path of ['site/en/home', 'en/home', 'en/about', '/en/about', 'de/contact', '']) expect(internalLinkHandler(path, config)).toBe(legacyInternal(path))
  }
 } finally { Object.assign(CONFIG, original) }
})

it('reads the Astro routing environment at request time', () => {
 vi.stubEnv('NEXT_PUBLIC_ROOT_DIRECTORY', 'site')
 expect(astroLink({ linktype: 'story', cached_url: 'site/about' }).href).toBe('/about')
 vi.stubEnv('NEXT_PUBLIC_ROOT_DIRECTORY', '')
 expect(astroLink({ linktype: 'story', cached_url: 'site/about' }).href).toBe('/site/about')
})

it('bundles link resolution without the legacy registry or UI runtime', async () => {
 const result = await build({ entryPoints: ['packages/lumen-cms-astro/src/lib/links.ts'], bundle: true, platform: 'node', write: false, metafile: true })
 expect(Object.keys(result.metafile.inputs).sort()).toEqual(['packages/lumen-cms-astro/src/lib/links.ts', 'packages/lumen-cms-shared/src/links.ts', 'packages/lumen-cms-shared/src/server/routes.ts'])
})

it('resolves CMS links to the published Astro routes while retaining anchors and targets', () => {
 vi.stubEnv('LUMEN_LOCALES', 'en,de')
 vi.stubEnv('NEXT_PUBLIC_ROOT_DIRECTORY', 'site')
 expect(astroLink({ linktype: 'story', cached_url: 'site/home', anchor: 'details' }, { openExternal: true })).toMatchObject({ href: '/#details', target: '_blank' })
 expect(astroLink({ linktype: 'story', cached_url: 'de/site/home?source=nav#details' }).href).toBe('/de?source=nav#details')
 expect(astroLink({ linktype: 'story', cached_url: 'en/site/about' }).href).toBe('/about')
 expect(astroLink({ linktype: 'url', cached_url: 'https://example.com/home?source=nav' }).href).toBe('https://example.com/home?source=nav')
 expect(astroLink({ linktype: 'url', cached_url: '#home' }).href).toBe('#home')
})

it('maps resolved translated story links with the configured default locale', () => {
 vi.stubEnv('LUMEN_LOCALES', 'de,en')
 vi.stubEnv('NEXT_PUBLIC_FIELD_LEVEL_TRANSLATION', '1')
 expect(astroLink({ linktype: 'story', cached_url: 'home', story: { name: 'Home', id: 1, uuid: 'home', slug: 'home', full_slug: 'en/home', url: 'home' } }).href).toBe('/en')
})
