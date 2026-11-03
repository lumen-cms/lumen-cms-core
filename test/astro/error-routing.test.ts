import { expect, it, vi } from 'vitest'
import { localeErrorRouting } from '../../packages/lumen-cms-astro/build/error-routing.mjs'
it('registers an on-demand fallback for server adapters', () => {
 const injectRoute = vi.fn()
 localeErrorRouting().hooks['astro:config:setup']({ config: { output: 'server' }, injectRoute })
 expect(injectRoute).toHaveBeenCalledWith({ pattern: '/404', entrypoint: expect.stringMatching(/src\/server\/routes\/404\.astro$/), prerender: false })
})
it('leaves static builds to their generated error files', () => {
 const injectRoute = vi.fn()
 localeErrorRouting().hooks['astro:config:setup']({ config: { output: 'static' }, injectRoute })
 expect(injectRoute).not.toHaveBeenCalled()
})
