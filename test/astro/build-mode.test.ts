import { afterEach, expect, it, vi } from 'vitest'
import { defineLumenConfig } from '../../packages/lumen-cms-astro/config.mjs'

afterEach(() => vi.unstubAllEnvs())
it.each(['public', 'preview'])('selects %s rendering and embeds the mode for serverless requests', mode => {
 vi.stubEnv('LUMEN_BUILD_MODE', mode)
 vi.stubEnv('LUMEN_SAMPLE_ROUTES', '')
 const config = defineLumenConfig({ site: 'https://example.test', locales: ['en', 'de'] })
 expect(config.output).toBe(mode === 'public' ? 'static' : 'server')
 expect(config.vite.define['process.env.LUMEN_BUILD_MODE']).toBe(JSON.stringify(mode))
 if (mode === 'public') {
  expect(config.image.service.build.entrypoint).toMatch(/runtime-url-service\.ts$/)
  expect(config.image.service.runtime.entrypoint).toBe('astro/assets/services/sharp')
 }
})
it('rejects a misspelled mode or a partial public inventory', () => {
 vi.stubEnv('LUMEN_BUILD_MODE', 'publci')
 expect(() => defineLumenConfig({ site: 'https://example.test' })).toThrow('LUMEN_BUILD_MODE')
 vi.stubEnv('LUMEN_BUILD_MODE', 'public')
 vi.stubEnv('LUMEN_SAMPLE_ROUTES', '["/"]')
 expect(() => defineLumenConfig({ site: 'https://example.test' })).toThrow('LUMEN_SAMPLE_ROUTES')
})
it.each([['SSG', 'static', 'public'], ['SSR', 'server', 'preview']])('TARGET=%s overrides legacy configuration', (target, output, mode) => {
 vi.stubEnv('TARGET', target)
 vi.stubEnv('LUMEN_BUILD_MODE', 'public')
 vi.stubEnv('LUMEN_SAMPLE_ROUTES', '')
 const config = defineLumenConfig({ site: 'https://example.test' })
 expect(config.output).toBe(output)
 expect(config.vite.define['process.env.LUMEN_BUILD_MODE']).toBe(JSON.stringify(mode))
})
it('rejects an unknown TARGET', () => {
 vi.stubEnv('TARGET', 'ssg')
 expect(() => defineLumenConfig({ site: 'https://example.test' })).toThrow('TARGET')
})
