import { useState } from 'react'
import { LmComponentRender } from '@LmComponentRender'
import { ButtonStoryblok } from '../../../../typings/generated/components-schema'
import { useShopifySdkContext } from '../context/ShopifySdkContext'
import { ShopifyProductItemProps } from '../shopifyTypes'
import { ShopifyProductDescription } from './ShopifyProductDescription'
import Box from '@mui/material/Box'

function AddToCartButton() {
  const { addToCart, config } = useShopifySdkContext()

  return (
    <Box sx={{ marginTop: 3 }}>
      <LmComponentRender
        content={
          {
            component: 'button',
            label: 'Add to cart',
            _uid: '1321',
            variant: 'outlined',
            color: 'secondary',
            class_names: { values: ['w-100'] },
            ...(config?.product_add_to_cart?.[0] || {})
          } as ButtonStoryblok
        }
        onClick={() => {
          addToCart()
        }}
      />
    </Box>
  )
}

function CheckoutButton() {
  const { config, onCheckout } = useShopifySdkContext()
  const [loading, setLoading] = useState<boolean>(false)

  return (
    <Box sx={{ marginTop: 3 }}>
      <LmComponentRender
        content={
          {
            component: 'button',
            label: 'Checkout',
            _uid: '1321',
            variant: 'raised',
            color: 'primary',
            class_names: { values: ['w-100'] },
            ...((config?.product_checkout && config.product_checkout[0]) || {})
          } as ButtonStoryblok
        }
        disabled={loading}
        onClick={async () => {
          setLoading(true)
          await onCheckout()
          setLoading(false)
        }}
      />
    </Box>
  )
}

export function ShopifyItemActions({ item }: ShopifyProductItemProps) {
  const { config } = useShopifySdkContext()
  return (
    <div>
      <AddToCartButton />
      <CheckoutButton />
      {!config?.hide_description && (
        <Box sx={{ marginTop: 3 }}>
          <ShopifyProductDescription item={item} />
        </Box>
      )}
    </div>
  )
}
