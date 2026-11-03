import { expect, it, vi } from 'vitest'
import { cartAmount, cartQuantity, createShopifyStore, type ShopifyVariant } from '../../packages/lumen-cms-shared/src/shopify'
const variant = { id: 'variant-one', title: 'First', productTitle: 'Fixture', priceV2: { amount: '12.34', currencyCode: 'EUR' } } as ShopifyVariant
function fixture() {
 const runtime = { createCheckout: vi.fn().mockResolvedValue({ webUrl: 'https://example.test/checkout' }), navigate: vi.fn(), analytics: vi.fn() }
 return { runtime, store: createShopifyStore(runtime) }
}
it('totals decimal prices and quantities', () => {
 const items = [{ variant, quantity: 3 }]
 expect(cartAmount(items)).toBe(37.02)
 expect(cartQuantity(items)).toBe(3)
})
it('retains duplicate-add and zero-quantity cleanup behavior', () => {
 const { store } = fixture()
 store.select(variant); store.addToCart(); store.addToCart()
 expect(store.cartVariants).toHaveLength(1)
 expect(store.cartVariants[0].quantity).toBe(1)
 expect(store.cartOpen).toBe(true)
 store.updateQuantity(variant, -1)
 expect(store.cartVariants[0].quantity).toBe(0)
 store.setCartOpen(false)
 expect(store.cartVariants).toEqual([])
})
it('uses selected variant when the cart is empty and preserves checkout payload', async () => {
 const { store, runtime } = fixture()
 store.select(variant)
 await expect(store.checkout()).resolves.toBe('https://example.test/checkout')
 expect(runtime.createCheckout).toHaveBeenCalledWith({ allowPartialAddresses: true, lineItems: [{ quantity: 1, variantId: variant.id }] })
 expect(runtime.navigate).toHaveBeenCalledWith('https://example.test/checkout')
})
it('uses cart quantities instead of the selected variant and supports retry', async () => {
 const { store, runtime } = fixture()
 store.select(variant); store.addToCart(); store.updateQuantity(variant, 2)
 runtime.createCheckout.mockRejectedValueOnce(new Error('Unavailable'))
 await expect(store.checkout()).rejects.toThrow('Unavailable')
 expect(runtime.navigate).not.toHaveBeenCalled()
 await store.checkout()
 expect(runtime.createCheckout).toHaveBeenLastCalledWith({ allowPartialAddresses: true, lineItems: [{ quantity: 2, variantId: variant.id }] })
})
it('does nothing without a variant or cart and unsubscribes listeners', async () => {
 const { store, runtime } = fixture()
 await store.checkout(); store.addToCart()
 expect(runtime.createCheckout).not.toHaveBeenCalled()
 const listener = vi.fn(), unsubscribe = store.subscribe(listener)
 store.select(variant); unsubscribe(); store.addToCart()
 expect(listener).toHaveBeenCalledTimes(1)
})
