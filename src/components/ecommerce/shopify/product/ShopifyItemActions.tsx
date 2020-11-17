import React from 'react'
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

export function ShopifyItemActions({ item }: ShopifyProductItemProps) {
  const { addToCart, checkoutUrl, onCheckout, config } = useShopifySdkContext()
  const classes = useStyles()
  return (
    <div>
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
              ...((config?.product_checkout && config.product_checkout[0]) ||
                {})
            } as ButtonStoryblok
          }
          onClick={() => {
            onCheckout()
          }}
          disabled={!checkoutUrl}
        />
      </div>
      {!config?.hide_description && (
        <div className={classes.buttonSpace}>
          <ShopifyProductDescription item={item} />
        </div>
      )}
    </div>
  )
}
