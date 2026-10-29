// @vitest-environment happy-dom
import { act, type ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import { expect, it, vi } from 'vitest'
import { ShopfiyCart } from './ShopifyCart'
import { ShopifyItemActions } from './ShopifyItemActions'
import type { ShopifyProductItemProps } from '../shopifyTypes'

const checkout = vi.hoisted(() => vi.fn())
vi.mock('../context/ShopifySdkContext', () => ({
  useShopifySdkContext: () => ({
    onCheckout: checkout,
    config: { hide_description: true },
    cartOpen: true,
    setCartOpen: vi.fn(),
    addToCart: vi.fn(),
    cartVariants: [
      { quantity: 1, variant: { id: 'item', priceV2: { amount: 10 } } }
    ]
  })
}))
vi.mock('./ShopifyCartVariantItem', () => ({
  ShopifyCartVariantItem: () => null
}))
vi.mock('./ShopifyProductDescription', () => ({
  ShopifyProductDescription: () => null
}))
vi.mock('@mui/material/Drawer', () => ({
  default: ({ children }: { children: ReactNode }) => <div>{children}</div>
}))
vi.mock('../../../CoreComponents', () => ({
  LmComponentRender: ({
    content,
    disabled,
    onClick
  }: {
    content: { label?: string }
    disabled?: boolean
    onClick?: () => void
  }) =>
    content.label ? (
      <button disabled={disabled} onClick={onClick}>
        {content.label}
      </button>
    ) : null
}))

it.each(['cart', 'product'])(
  'lets shoppers retry %s checkout after a rejected request',
  async (surface) => {
    vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
    let reject!: (error: Error) => void
    checkout
      .mockReset()
      .mockImplementationOnce(
        () =>
          new Promise((_, fail) => {
            reject = fail
          })
      )
      .mockResolvedValue(undefined)
    const container = document.createElement('div')
    document.body.append(container)
    const root = createRoot(container)
    try {
      await act(async () =>
        root.render(
          surface === 'cart' ? (
            <ShopfiyCart />
          ) : (
            <ShopifyItemActions item={{} as ShopifyProductItemProps['item']} />
          )
        )
      )
      const button = [...container.querySelectorAll('button')].find(
        (b) => b.textContent === 'Checkout'
      )!
      await act(async () => button.click())
      expect(button.disabled).toBe(true)
      await act(async () => reject(new Error('Shopify unavailable')))
      expect(button.disabled).toBe(false)
      expect(container.querySelector('[role="alert"]')?.textContent).toContain(
        'Please try again'
      )
      await act(async () => button.click())
      expect(checkout).toHaveBeenCalledTimes(2)
      expect(button.disabled).toBe(false)
      expect(container.querySelector('[role="alert"]')).toBeNull()
    } finally {
      await act(async () => root.unmount())
      container.remove()
    }
  }
)
