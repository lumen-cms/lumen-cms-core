import { afterEach, expect, it, vi } from 'vitest'
import { GET } from '../../packages/lumen-cms-astro/src/server/robots'
afterEach(() => vi.unstubAllEnvs())
it.each(['public', 'preview'])('allows crawling in %s but advertises only the public sitemap', async mode => {
 vi.stubEnv('LUMEN_BUILD_MODE', mode)
 const response = await GET({ site: new URL('https://public.test') } as never)
 expect(await response.text()).toBe('User-agent: *\nAllow: /\n' + (mode === 'public' ? 'Sitemap: https://public.test/sitemap.xml\n' : ''))
})
