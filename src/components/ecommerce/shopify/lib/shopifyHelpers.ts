import { ShopifyProductFragment } from '../context/ShopifySdkContext'

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
