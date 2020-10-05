import { createContext, useContext } from 'react'
import { LineItem, Product, ProductVariant } from 'shopify-buy'
import { EcommerceShopifyConfigStoryblok } from '../../../../typings/generated/components-schema'

type ShopifySdkContextProps = {
  products: Product[]
  selectedVariant?: ProductVariant
  onVariantSelect: (variant: ProductVariant) => void
  onCheckout: () => void
  cartOpen: boolean
  setCartOpen: (bool: boolean) => void
  addToCart: () => void
  cartVariants: LineItem[]
  updateCartItemQuantity: (variant: LineItem, quantity: number) => void
  totalAmount: number
  config: EcommerceShopifyConfigStoryblok
}

const noop = () => {
  // do nothing
}

export const ShopifySdkContext = createContext<ShopifySdkContextProps>({
  products: [],
  onVariantSelect: noop,
  onCheckout: noop,
  cartOpen: false,
  setCartOpen: noop,
  addToCart: noop,
  cartVariants: [],
  updateCartItemQuantity: noop,
  totalAmount: 0,
  config: {
    component: 'ecommerce_shopify_config',
    _uid: '1'
  }
})
export const useShopifySdkContext = () =>
  useContext<ShopifySdkContextProps>(ShopifySdkContext)
