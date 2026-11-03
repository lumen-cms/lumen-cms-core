// @vitest-environment happy-dom
import { expect, it, vi } from 'vitest'
import { initializeFastSpringProvider, fastSpringStore } from '../../packages/lumen-cms-astro/src/client/fastspringProvider'
import { loadExternalScript } from '../../packages/lumen-cms-astro/src/client/externalScript'
vi.mock('../../packages/lumen-cms-astro/src/client/externalScript', () => ({ loadExternalScript: vi.fn().mockImplementation(async () => {
 expect(typeof window.fscDataCallback).toBe('function')
 expect(typeof window.fscDataPopupClosed).toBe('function')
}) }))
it('installs SDK callbacks before loading and preserves script attributes', async () => {
 const config = { component: 'ecommerce_fastspring_config' as const, _uid: 'fixture', url: 'https://example.test/sdk.js', data_storefront: 'fixture-store', data_accesss_key: 'public-fixture-key' }
 await initializeFastSpringProvider(config)
 await initializeFastSpringProvider(config)
 expect(loadExternalScript).toHaveBeenCalledTimes(1)
 expect(loadExternalScript).toHaveBeenCalledWith(config.url, expect.objectContaining({ id: 'fsc-api', 'data-storefront': 'fixture-store', 'data-access-key': 'public-fixture-key', 'data-popup-closed': 'fscDataPopupClosed' }))
 window.fscDataCallback({ currency: 'EUR', groups: [{ items: [] }] } as Parameters<typeof window.fscDataCallback>[0])
 expect(fastSpringStore().currency).toBe('EUR')
})
