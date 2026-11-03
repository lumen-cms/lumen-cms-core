// @vitest-environment happy-dom
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import type { ShopifyVariant } from '../../packages/lumen-cms-shared/src/shopify'
const mocks = vi.hoisted(() => ({ loaded: vi.fn(), checkout: vi.fn(), sdk: vi.fn() }))
vi.mock('../../packages/lumen-cms-shared/src/core/components/ecommerce/shopify/lib/shopify-graphql-request', () => {
 mocks.loaded()
 return { shopifyGraphqlSdk: mocks.sdk }
})
const config = { component: 'ecommerce_shopify_config' as const, _uid: 'fixture', domain: 'fixture.myshopify.com', access_token: 'public-test-token' }
const variant = { id: 'fixture-variant', priceV2: { amount: '10', currencyCode: 'EUR' } } as ShopifyVariant
beforeEach(() => {
 vi.resetModules(); vi.clearAllMocks()
 mocks.sdk.mockReturnValue({ checkoutCreate: mocks.checkout })
 mocks.checkout.mockResolvedValue({ checkoutCreate: { checkout: { webUrl: 'https://example.test/mock-checkout' } } })
})
afterEach(() => vi.restoreAllMocks())
it('does not load the SDK for selection, cart operations, empty checkout or missing configuration', async () => {
 const { initializeShopifyProvider } = await import('../../packages/lumen-cms-astro/src/client/shopifyProvider')
 const store = initializeShopifyProvider({ component: 'ecommerce_shopify_config', _uid: '' })
 await store.checkout()
 store.select(variant); store.addToCart(); store.updateQuantity(variant, 2); store.setCartOpen(false)
 expect(mocks.loaded).not.toHaveBeenCalled()
 await expect(store.checkout()).rejects.toThrow('Shopify storefront configuration is missing')
 expect(mocks.loaded).not.toHaveBeenCalled()
})
it('loads on checkout, preserves payload/config/navigation, and reuses the module on subsequent checkouts', async () => {
 const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function () { expect(this.href).toBe('https://example.test/mock-checkout') })
 const { initializeShopifyProvider } = await import('../../packages/lumen-cms-astro/src/client/shopifyProvider')
 const store = initializeShopifyProvider(config)
 store.select(variant)
 expect(mocks.loaded).not.toHaveBeenCalled()
 const pending = store.checkout()
 initializeShopifyProvider({ ...config, domain: 'updated.myshopify.com' })
 await pending
 expect(mocks.sdk).toHaveBeenLastCalledWith({ domain: config.domain, accessToken: config.access_token })
 expect(mocks.checkout).toHaveBeenCalledWith({ input: { allowPartialAddresses: true, lineItems: [{ quantity: 1, variantId: variant.id }] } })
 store.addToCart(); store.updateQuantity(variant, 3)
 await store.checkout()
 expect(mocks.loaded).toHaveBeenCalledOnce()
 expect(mocks.sdk).toHaveBeenLastCalledWith({ domain: 'updated.myshopify.com', accessToken: config.access_token })
 expect(mocks.checkout).toHaveBeenLastCalledWith({ input: { allowPartialAddresses: true, lineItems: [{ quantity: 3, variantId: variant.id }] } })
 expect(click).toHaveBeenCalledTimes(2)
 expect(document.querySelector('a')).toBeNull()
})
it('propagates checkout errors and allows retry without navigating on failure', async () => {
 const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
 const { initializeShopifyProvider } = await import('../../packages/lumen-cms-astro/src/client/shopifyProvider')
 const store = initializeShopifyProvider(config); store.select(variant)
 mocks.checkout.mockRejectedValueOnce(new Error('offline'))
 await expect(store.checkout()).rejects.toThrow('offline')
 expect(click).not.toHaveBeenCalled()
 await store.checkout()
 expect(click).toHaveBeenCalledOnce()
})
