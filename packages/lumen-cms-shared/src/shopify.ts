import type { ProductFragment, CheckoutCreateInput } from 'lumen-cms-shared/core/typings/generated/shopify-schema'
export type ShopifyVariant = ProductFragment['variants']['edges'][0]['node'] & { productTitle: string }
export type ShopifyCartItem = { quantity: number; variant: ShopifyVariant }
export const cartAmount = (items: ShopifyCartItem[]) => Number(items.reduce((sum, item) => sum + Number(item.variant.priceV2.amount) * item.quantity, 0).toFixed(2))
export const cartQuantity = (items: ShopifyCartItem[]) => items.reduce((sum, item) => sum + item.quantity, 0)
export interface ShopifyRuntime {
 createCheckout(input: CheckoutCreateInput): Promise<{ webUrl?: string } | null | undefined>
 navigate(url: string | undefined): void
 analytics?(provider: 'gtag' | 'fbq', event: string, data: Record<string, unknown>): void
}
export function createShopifyStore(runtime: ShopifyRuntime) {
 let selected: ShopifyVariant | undefined, items: ShopifyCartItem[] = [], open = false, currency = 'EUR'
 const listeners = new Set<() => void>()
 const publish = () => listeners.forEach(listener => listener())
 const cartAnalytics = (value: number) => {
  runtime.analytics?.('fbq', 'AddToCart', { content_ids: items.map(item => `${item.variant.id}`), value, content_type: 'product', currency })
  runtime.analytics?.('gtag', 'add_to_cart', { items: items.map(item => ({ id: item.variant.id, quantity: item.quantity })), content_type: 'product', value, currency })
 }
 return {
  get selectedVariant() { return selected },
  get cartVariants() { return items },
  get cartOpen() { return open },
  subscribe(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener) } },
  select(variant: ShopifyVariant) {
   runtime.analytics?.('gtag', 'select_content', { items: [variant.id] })
   runtime.analytics?.('fbq', 'CustomizeProduct', { content_ids: [variant.id], content_type: 'product' })
   selected = variant; currency = variant.priceV2.currencyCode; publish()
  },
  setCartOpen(value: boolean) { if (open && !value) items = items.filter(item => item.quantity > 0); open = value; publish() },
  addToCart() {
   if (!selected?.id) return
   if (!items.some(item => item.variant.id === selected!.id)) items = [...items, { variant: selected, quantity: 1 }]
   cartAnalytics(cartAmount(items)); open = true; publish()
  },
  updateQuantity(variant: ShopifyVariant, quantity: number) {
   // Legacy analytics reports the previous cart total for quantity changes.
   const previousTotal = cartAmount(items)
   items = items.map(item => ({ variant: item.variant, quantity: item.variant.id === variant.id ? Math.max(0, quantity) : item.quantity }))
   cartAnalytics(previousTotal); publish()
  },
  async checkout() {
   const checkoutItems = items.length ? items : selected?.id ? [{ quantity: 1, variant: selected }] : []
   if (!checkoutItems.length) return
   const lineItems = checkoutItems.map(item => ({ quantity: item.quantity, variantId: item.variant.id }))
   const value = cartAmount(checkoutItems)
   const result = await runtime.createCheckout({ allowPartialAddresses: true, lineItems })
   runtime.analytics?.('gtag', 'begin_checkout', { items: lineItems.map(item => ({ id: item.variantId, quantity: item.quantity })), value, content_type: 'product', currency })
   runtime.analytics?.('fbq', 'InitiateCheckout', { content_ids: lineItems.map(item => `${item.variantId}`), value, content_type: 'product', currency })
   runtime.navigate(result?.webUrl)
   return result?.webUrl
  }
 }
}
