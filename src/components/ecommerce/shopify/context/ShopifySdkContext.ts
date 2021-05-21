import { createContext, useContext } from 'react'
import { EcommerceShopifyConfigStoryblok } from '../../../../typings/generated/components-schema'
import { ProductFragment } from '../../../../typings/generated/shopify-schema'

export type ShopifyProductFragment =
  ProductFragment['variants']['edges'][0]['node'] & {
    productTitle: string
  }
export type ShopifySdkContextProps = {
  selectedVariant?: ShopifyProductFragment
  onVariantSelect: (data: ShopifyProductFragment) => void
  onCheckout: () => Promise<void>
  cartOpen: boolean
  setCartOpen: (bool: boolean) => void
  addToCart: () => void
  cartVariants: {
    quantity: number
    variant: ShopifyProductFragment
  }[]
  updateCartItemQuantity: (
    variant: ShopifyProductFragment,
    quantity: number
  ) => void
  config: EcommerceShopifyConfigStoryblok
}

const noop = () => {
  // do nothing
}

const asyncNoop = async () => {
  // do nothing
}

export const ShopifySdkContext = createContext<ShopifySdkContextProps>({
  onVariantSelect: noop,
  onCheckout: asyncNoop,
  cartOpen: false,
  setCartOpen: noop,
  addToCart: asyncNoop,
  cartVariants: [],
  updateCartItemQuantity: noop,
  config: {
    component: 'ecommerce_shopify_config',
    _uid: '1'
  }
})
export const useShopifySdkContext = () =>
  useContext<ShopifySdkContextProps>(ShopifySdkContext)
