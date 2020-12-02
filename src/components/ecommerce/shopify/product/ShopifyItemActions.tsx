import React, { useState } from 'react'
import { LmComponentRender } from '@LmComponentRender'
import { makeStyles } from '@material-ui/core/styles'
import { createStyles, Theme } from '@material-ui/core'
import { ButtonStoryblok } from '../../../../typings/generated/components-schema'
import { useShopifySdkContext } from '../context/ShopifySdkContext'
import { ShopifyProductItemProps } from '../shopifyTypes'
import { ShopifyProductDescription } from './ShopifyProductDescription'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    buttonSpace: {
      marginTop: theme.spacing(3)
    }
  })
)

function AddToCartButton() {
  const { addToCart, config } = useShopifySdkContext()
  const classes = useStyles()

  return (
    <div className={classes.buttonSpace}>
      <LmComponentRender
        content={
          {
            component: 'button',
            label: 'Add to cart',
            _uid: '1321',
            variant: 'outlined',
            color: 'secondary',
            class_names: { values: ['w-100'] },
            ...((config?.product_add_to_cart &&
              config.product_add_to_cart[0]) ||
              {})
          } as ButtonStoryblok
        }
        onClick={() => {
          addToCart()
        }}
      />
    </div>
  )
}

function CheckoutButton() {
  const classes = useStyles()
  const { config, onCheckout } = useShopifySdkContext()
  const [loading, setLoading] = useState<boolean>(false)

  return (
    <div className={classes.buttonSpace}>
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
    </div>
  )
}

export function ShopifyItemActions({ item }: ShopifyProductItemProps) {
  const { config } = useShopifySdkContext()
  const classes = useStyles()
  return (
    <div>
      <AddToCartButton />
      <CheckoutButton />
      {!config?.hide_description && (
        <div className={classes.buttonSpace}>
          <ShopifyProductDescription item={item} />
        </div>
      )}
    </div>
  )
}
