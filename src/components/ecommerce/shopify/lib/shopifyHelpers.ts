import { ShopifyProductFragment } from '../context/ShopifySdkContext'

export const getTotalCartQuantity = (
  cartItems: {
    quantity: number
    variant: ShopifyProductFragment
  }[]
) => {
  return cartItems.reduce((a, b) => a + b.quantity, 0)
}

export const getTotalCartAmount = (
  cartItems: {
    quantity: number
    variant: ShopifyProductFragment
  }[]
) => {
  return cartItems.reduce(
    (a, b) => a + b.variant.priceV2.amount * b.quantity,
    0
  )
}
