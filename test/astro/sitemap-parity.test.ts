import { expect, it, vi } from 'vitest'
import { createSitemapApi } from '../../src/pages/api/sitemap'
import { sitemapForRequest } from '../../packages/lumen-cms-astro/src-server/pages/api/sitemap'
const state = vi.hoisted(() => ({ config: { rootDirectory: '', suppressSlugLocale: false, languages: ['en','de'] }, stories: ['home','de/home','de/course','site/home','site/course','demo-content/example','error-404','de/error-404','site/error-404','de/site/error-404'].map(full_slug => ({ full_slug, slug: full_slug.split('/').at(-1), published_at: '2026-11-02T00:00:00Z' })) }))
vi.mock('../../src/utils/config', () => ({ CONFIG: state.config }))
vi.mock('../../src/utils/initial-props/storyblokPagesConfig', () => ({ getAllStoriesOfProject: async () => state.stories }))
vi.mock('../../src/utils/initial-props/ssrConfig', () => ({ SSR_CONFIG: { ssrHooks: { sitemap: [] } } }))
it.each(['default', 'root', 'suppress', 'translated', 'host'])('matches the real Next sitemap endpoint: %s', async mode => {
 state.config.rootDirectory = mode === 'root' ? 'site' : ''
 state.config.suppressSlugLocale = mode === 'suppress'
 vi.stubEnv('PUBLIC_ROOT_DIRECTORY', state.config.rootDirectory)
 vi.stubEnv('PUBLIC_SUPPRESS_SLUG_LOCALE', state.config.suppressSlugLocale ? '1' : '')
 vi.stubEnv('PUBLIC_LANGUAGES', 'en,de')
 vi.stubEnv('NEXT_PUBLIC_FIELD_LEVEL_TRANSLATION', mode === 'translated' ? '1' : '')
 vi.stubEnv('PUBLIC_FIELD_LEVEL_TRANSLATION', mode === 'translated' ? '1' : '')
 vi.stubEnv('SITEMAP_LOCALE', mode === 'translated' ? 'de' : '')
 vi.stubEnv('SITEMAP_HOSTNAME', mode === 'host' ? 'canonical.test' : '')
 vi.stubEnv('LOCALE_DOMAIN_MAP', '')
 vi.stubEnv('SITEMAP_IGNORE_PATH', '')
 let xml = ''
 const headers: Record<string,string> = {}
 const res = { statusCode: 200, setHeader: (name: string, value: string) => { headers[name] = value }, write: (value: string) => { xml += value }, end: () => {} }
 await createSitemapApi()({ headers: { host: 'example.com' } } as never, res as never)
 const actual = await sitemapForRequest(new Request('https://example.com/api/sitemap'))
 expect(actual.status).toBe(res.statusCode)
 expect(await actual.text()).toBe(xml)
 expect(xml).not.toContain('error-404')
 for (const [name,value] of Object.entries(headers)) expect(actual.headers.get(name)).toBe(value)
 if (mode === 'default') expect(xml).toContain('https://example.com/de/</loc>')
})

// Feed identical backend fixtures to the independent legacy and Astro pipelines.
vi.mock('../../packages/lumen-cms-shared/src/core/utils/config', () => ({ CONFIG: state.config }))
vi.mock('../../packages/lumen-cms-shared/src/core/utils/initial-props/storyblokPagesConfig', () => ({ getAllStoriesOfProject: async () => state.stories }))
vi.mock('../../packages/lumen-cms-shared/src/core/utils/initial-props/ssrConfig', () => ({ SSR_CONFIG: { ssrHooks: { sitemap: [] } } }))
