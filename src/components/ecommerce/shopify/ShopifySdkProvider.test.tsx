// @vitest-environment happy-dom
import { act, memo } from 'react'
import { createRoot } from 'react-dom/client'
import { expect, it, vi } from 'vitest'
import { LmShopifySdkProvider } from './ShopifySdkProvider'
import {
  useShopifySdkContext,
  type ShopifySdkContextProps,
  type ShopifyProductFragment
} from './context/ShopifySdkContext'
const fixture = vi.hoisted(() => ({
  settings: {
    ecommerce: [
      {
        component: 'ecommerce_shopify_config',
        domain: 'first',
        access_token: 'token1'
      }
    ]
  },
  sdk: vi.fn(),
  checkout: vi.fn(async () => ({
    checkoutCreate: { checkout: { webUrl: 'https://example.com/checkout' } }
  }))
}))
vi.mock('../../provider/SettingsPageProvider', () => ({
  useSettings: () => fixture.settings
}))
vi.mock('./lib/shopify-graphql-request', () => ({
  shopifyGraphqlSdk: (options: unknown) => {
    fixture.sdk(options)
    return { checkoutCreate: fixture.checkout }
  }
}))
vi.mock('./product/ShopifyCart', () => ({ ShopfiyCart: () => null }))
vi.mock('./product/ShopifyFloatingCart', () => ({
  ShopifyFloatingCart: () => null
}))
it('keeps context stable on unrelated renders and keeps actions current after state/config changes', async () => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  const destinations: string[] = []
  vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (
    this: HTMLAnchorElement
  ) {
    destinations.push(this.href)
  })
  const root = createRoot(document.createElement('div'))
  let current!: ShopifySdkContextProps
  let renders = 0
  const Consumer = memo(function Consumer() {
    current = useShopifySdkContext()
    renders++
    return null
  })
  const variant = {
    id: 'variant',
    priceV2: { amount: '12', currencyCode: 'EUR' }
  } as ShopifyProductFragment
  try {
    await act(async () =>
      root.render(
        <LmShopifySdkProvider>
          <Consumer />
        </LmShopifySdkProvider>
      )
    )
    const before = current
    const beforeRenders = renders
    await act(async () =>
      root.render(
        <LmShopifySdkProvider>
          <Consumer />
        </LmShopifySdkProvider>
      )
    )
    expect(current).toBe(before)
    expect(renders).toBe(beforeRenders)
    await act(async () => current.onVariantSelect(variant))
    expect(current.selectedVariant).toBe(variant)
    await act(async () => current.addToCart())
    expect(current.cartOpen).toBe(true)
    expect(current.cartVariants).toEqual([{ quantity: 1, variant }])
    await act(async () => current.updateCartItemQuantity(variant, 3))
    expect(current.cartVariants[0].quantity).toBe(3)
    fixture.settings = {
      ecommerce: [
        {
          component: 'ecommerce_shopify_config',
          domain: 'second',
          access_token: 'token2'
        }
      ]
    }
    await act(async () =>
      root.render(
        <LmShopifySdkProvider>
          <Consumer />
        </LmShopifySdkProvider>
      )
    )
    await act(async () => current.onCheckout())
    expect(destinations).toEqual(['https://example.com/checkout'])
    expect(fixture.sdk).toHaveBeenLastCalledWith({
      domain: 'second',
      accessToken: 'token2'
    })
    expect(fixture.checkout).toHaveBeenLastCalledWith({
      input: {
        allowPartialAddresses: true,
        lineItems: [{ quantity: 3, variantId: 'variant' }]
      }
    })
  } finally {
    await act(async () => root.unmount())
  }
})
